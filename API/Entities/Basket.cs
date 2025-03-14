using System;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = []; //định nghĩa mỗi quan hệ với hảng basketItem
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }

    public void AddItem(Product product, int quantity)
    {
        if (product == null) ArgumentNullException.ThrowIfNull(product);
        if (quantity < 0) throw new ArgumentException("Số lượng phải lớn hơn 0", nameof(quantity));

        var existingItem = FindItem(product.Id);

        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                Product = product,
                Quantity = quantity
            });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Số lượng phải lớn hơn 0", nameof(quantity));

        var item = FindItem(productId);

        if (item == null) return;

        item.Quantity -= quantity;

        if (item.Quantity <= 0) Items.Remove(item);
    }

    private BasketItem? FindItem(int productId) // trả về 1 basketitem hoặc ?(là null)
    {
        return Items.FirstOrDefault(item => item.ProductId == productId);
    }
}
