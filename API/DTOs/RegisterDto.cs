using System.ComponentModel.DataAnnotations; // Thư viện hỗ trợ kiểm tra dữ liệu (validation)

namespace API.DTOs;

// Lớp DTO dùng để truyền dữ liệu đăng ký từ client đến server
public class RegisterDto
{
    [Required] // Bắt buộc trường Email phải có giá trị (không được null hoặc rỗng)
    public string Email { get; set; } = string.Empty; // Khởi tạo Email với chuỗi rỗng để tránh null

    public required string Password { get; set; } // Thuộc tính Password bắt buộc phải có giá trị khi khởi tạo đối tượng
}
