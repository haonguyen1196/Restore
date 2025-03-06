using System;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context, IConfiguration config, ILogger<PaymentsController> logger) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);

        if (basket == null) return BadRequest("Giỏ hàng gặp vấn đề");

        var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) return BadRequest("Có vấn đề khi thực hiện ý định thanh toán");

        basket.PaymentIntentId ??= intent.Id; // có giá trị khác null thì đc gán intent.id
        basket.ClientSecret ??= intent.ClientSecret; // có giá trị khác null thì đc gán intent.ClientSecret

        // kiểm tra có sự thay đổi nào trong db context không
        if (context.ChangeTracker.HasChanges())
        {
            var result = await context.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Có sự cố khi cập nhật giỏ hàng với intent");
        }

        return basket.ToDto();
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = ConstructStripeEvent(json);

            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Dữ liệu sự kiện không hợp lệ");
            }

            if (intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
            else await HandlePaymentIntentFailed(intent);

            return Ok();
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe Webhook");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Một lỗi không mong muốn đã xảy ra");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        }
    }

    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id) ?? throw new Exception("Không tìm thấy đơn hàng");

        foreach (var item in order.OrderItems)
        {
            var productItem = await context.Products
                .FindAsync(item.ItemOrdered.ProductId) ?? throw new Exception("Có vấn đề khi cập nhật số lượng sản phẩm");

            productItem.QuantityInStock += item.Quantity;
        }

        order.OrderStatus = OrderStatus.PaymentFailed;

        await context.SaveChangesAsync();
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id) ?? throw new Exception("Không tìm thấy đơn hàng");

        if (order.GetTotal() != intent.Amount)
        {
            order.OrderStatus = OrderStatus.PaymentMismatch;
        }
        else
        {
            order.OrderStatus = OrderStatus.PaymentReceived;
        }

        var basket = await context.Baskets.FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);

        if (basket != null) context.Baskets.Remove(basket);

        await context.SaveChangesAsync();

    }

    private Event ConstructStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], config["StripeSetting:WhSecret"]);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Xây dưng sự kiện stripe không thành công");
            throw new StripeException("Chữ kí không hợp lệ");
        }
    }
}
