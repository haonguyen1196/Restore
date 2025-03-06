using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class OrdersController(StoreContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await context.Orders
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUserName())
            .ToListAsync();

        return orders;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderDetail(int id)
    {
        var order = await context.Orders
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUserName() && id == x.Id)
            .FirstOrDefaultAsync();

        if (order == null) return NotFound();

        return order;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);
        if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId))
            return BadRequest("Giỏ hàng trống hoặc không tìm thấy");

        var items = CreateBasketItems(basket.Items);
        if (items == null) return BadRequest("Một số sản phẩm trong kho không đủ số lượng");

        var subtotal = items.Sum(x => x.Price * x.Quantity);
        var deliveryFee = CalculateDeliveryFee(subtotal);

        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == basket.PaymentIntentId);

        if (order == null)
        {
            order = new Order
            {
                OrderItems = items,
                BuyerEmail = User.GetUserName(),
                ShippingAddress = orderDto.ShippingAddress,
                DeliveryFee = deliveryFee,
                Subtotal = subtotal,
                PaymentSummary = orderDto.PaymentSummary,
                PaymentIntentId = basket.PaymentIntentId
            };

            context.Orders.Add(order);
        }
        else
        {
            order.OrderItems = items;
        }

        var result = await context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("Có lỗi khi tạo đơn hàng");

        return CreatedAtAction(nameof(GetOrderDetail), new { id = order.Id }, order.ToDto()); // trả về http 201, tạo url để user có thể truy cập vào tài nguyên vừa tạo, hoạt động đúng chuẩn HATEOAS

    }

    private long CalculateDeliveryFee(long subtotal)
    {
        return subtotal > 10000 ? 0 : 500;
    }

    private List<OrderItem>? CreateBasketItems(List<BasketItem> items)
    {
        var orderItems = new List<OrderItem>();
        foreach (var item in items)
        {
            if (item.Product.QuantityInStock < item.Quantity)
                return null;

            var orderItem = new OrderItem
            {
                ItemOrdered = new ProductItemOrdered
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    PictureUrl = item.Product.PictureUrl
                },
                Price = item.Product.Price,
                Quantity = item.Quantity
            };
            orderItems.Add(orderItem);

            item.Product.QuantityInStock -= item.Quantity;
        }
        return orderItems;
    }
}
