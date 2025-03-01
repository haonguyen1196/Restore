using System;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context) : BaseApiController
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
}
