using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductDto
{
    [Required] //validated
    public string Name { get; set; } = string.Empty; // chuỗi rỗng đảm bảo dữ liệu k null

    [Required]
    public required string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, double.PositiveInfinity)]
    public long Price { get; set; }

    [Required]
    public IFormFile File { get; set; } = null!;

    [Required]
    public required string Type { get; set; }

    [Required]
    public required string Brand { get; set; }

    [Required]
    [Range(0, 200)]
    public int QuantityInStock { get; set; }
}
