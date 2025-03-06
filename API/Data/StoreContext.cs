using System.Text;
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }//Products sẽ đc quy ước làm tên của table
    public required DbSet<Basket> Baskets { get; set; }

    public required DbSet<Order> Orders { get; set; }

    //cấu hình dữ liệu ban đầu cho bảng identity role
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>()
        .HasData(
            new IdentityRole { Id = "dd38a94a-c3b9-49d9-95d1-19571e49e285", Name = "Member", NormalizedName = "MEMBER" },
            new IdentityRole { Id = "cb19885f-a496-47b8-a42a-25a6d45b26e7", Name = "Admin", NormalizedName = "ADMIN" }
        );
    }
}
