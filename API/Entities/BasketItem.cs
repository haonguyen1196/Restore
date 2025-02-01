using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("BasketItems")] //sử dụng đặt tên cho bảng phụ khi nó không được khai báo trong store context
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    //navigation properties
    public int ProductId { get; set; }
    public required Product Product { get; set; }

    public int BasketId { get; set; }
    public Basket Basket { get; set; } = null!;
}