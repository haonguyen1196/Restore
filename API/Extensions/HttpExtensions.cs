using System;
using System.Text.Json;
using API.RequestHelpers;
using Microsoft.Net.Http.Headers;

namespace API.Extensions;

public static class HttpExtensions
{
    // phương thức mở rộng để thêm header phân trang
    public static void AddPaginationHeader(this HttpResponse response, PaginationMetadata metadata)
    {
        // tạo tùy chọn serialize JSON với quy tắc đặt tên camel case
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        // Chuyển đổi metadata thành JSON với tùy chọn trên và thêm vào header "Pagination"
        response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));

        // Đảm bảo client có thể đọc header "Pagination" bằng cách thêm nó vào danh sách các header được phép truy cập
        response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
    }
}
