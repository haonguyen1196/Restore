using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

// giúp các route không xác định đều tải lại index, để client quyết định nội dung nào đc render tùy vào route
public class FallbackController : Controller
{
    [AllowAnonymous]
    public IActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
    }
}
