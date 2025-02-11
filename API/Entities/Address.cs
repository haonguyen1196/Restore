using System.Text.Json.Serialization;

namespace API.Entities;

public class Address
{
    [JsonIgnore] // không muốn id xuất hiện trong kết quả trả ra
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }

    [JsonPropertyName("postal_code")]// Khi serialize JSON, thuộc tính này sẽ có tên là "postal_code"
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
}
