using API.Data;
using API.Entities;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnecting"));
}); //  inject options cho db context

builder.Services.AddCors();// thêm cors
builder.Services.AddTransient<ExceptionMiddleware>();// DI cho middle
// thêm các endpoint cho hệ thống xác thực người dùng
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true; // mỗi tài khoản người dùng phải có email duy nhất trong hệ thống
})
    .AddRoles<IdentityRole>() // thêm hỗ trợ vai trò người dùng
    .AddEntityFrameworkStores<StoreContext>(); // lưu trức thông tin người dùng vào csdl

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();// sử dụng middle
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000");
});// cấu hình cors

app.UseAuthentication(); // kiểm tra danh tính người dùng
app.UseAuthorization(); // kiểm tra quyền truy cập tài nguyên

app.MapControllers(); // định tuyến các api controller
app.MapGroup("api").MapIdentityApi<User>(); //Đặt tất cả các endpoint Identity vào nhóm /api/...

DbInitializer.InitDb(app);

app.Run();
