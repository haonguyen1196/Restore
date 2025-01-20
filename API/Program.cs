using API.Data;
using API.Middleware;
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

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();// sử dụng middle
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:3000");
});// cấu hình cors

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
