using System;
using API.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        query = orderBy switch //switch expression 
        {
            "price" => query.OrderBy(x => x.Price), // nếu orderBy là price
            "priceDesc" => query.OrderByDescending(x => x.Price), // nếu orderBy là priceDesc 
            _ => query.OrderBy(x => x.Name) //nếu không khớp với giá trị nào
        };

        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        if (string.IsNullOrEmpty(searchTerm)) return query; // nếu không có dữ liệu thì trả về để tiếp thục filter

        var lowerCaseSearchTerm = searchTerm.Trim().ToLower(); // loại bỏ khoảng trắng ở đầu và cuối, convert thành chữ thường

        return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm)); // tìm từ khóa không phân biệt hoa thường 

    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
    {
        var brandList = new List<string>(); // tạo mảng rỗng
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brands))
        {
            brandList.AddRange([.. brands.ToLower().Split(",")]); // tách chuỗi thàng danh sách
        }

        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange([.. types.ToLower().Split(",")]);
        }

        query = query.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower())); // nếu brand có trong danh sách
        query = query.Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));

        return query;
    }
}
