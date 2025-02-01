using System;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket)// static thì không cần khỏi tạo vẫn có thể gọi được hàm ở bên ngoài. this đại diện cho đối tượng gọi tới
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Product.Name,
                Price = x.Product.Price,
                Brand = x.Product.Brand,
                Type = x.Product.Type,
                PictureUrl = x.Product.PictureUrl,
                Quantity = x.Quantity
            }).ToList()
        };
    }
}
