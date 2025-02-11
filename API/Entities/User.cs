using System;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser
{
    public int? AddressId { get; set; } // foreign key của bảng address
    public Address? Address { get; set; } // navigation property giúp truy cập thông tin địa chỉ của user
}
