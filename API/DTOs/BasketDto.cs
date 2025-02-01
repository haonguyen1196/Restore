namespace API.DTOs;

//data transfer object laf design pattern dùng trong việc xử lý dữ liệu trả về
public class BasketDto
{
    public required string BasketId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
}
