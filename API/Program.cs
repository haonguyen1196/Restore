using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary")); // ánh xạ dữ liệu vào class rồi dùng dữ liệu tại các service
builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
}); //  inject options cho db context

builder.Services.AddCors();// thêm cors
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies()); // autoMapper, load các kế thừa từ profile
builder.Services.AddTransient<ExceptionMiddleware>();// DI cho middle
builder.Services.AddScoped<PaymentsService>();
builder.Services.AddScoped<ImageService>();
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

app.UseDefaultFiles(); // tìm thư mục index
app.UseStaticFiles(); // Kích hoạt middleware phục vụ các tệp tĩnh như HTML, CSS, JavaScript, hình ảnh từ thư mục wwwroot

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000");
});// cấu hình cors

app.UseAuthentication(); // kiểm tra danh tính người dùng
app.UseAuthorization(); // kiểm tra quyền truy cập tài nguyên

app.MapControllers(); // định tuyến các api controller
app.MapGroup("api").MapIdentityApi<User>(); //Đặt tất cả các endpoint Identity vào nhóm /api/...
app.MapFallbackToController("Index", "Fallback"); // chuyển hướng các yêu cầu không khớp với bất kì route nào tới index trong fallback controller

await DbInitializer.InitDb(app);

app.Run();
