
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// AccountController kế thừa từ BaseApiController và sử dụng SignInManager để quản lý xác thực người dùng.
public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
    // Định nghĩa endpoint HTTP POST tại "api/account/register" để đăng ký người dùng mới.
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        // Tạo một đối tượng User mới với Username và Email dựa trên dữ liệu từ RegisterDto.
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email };

        // Sử dụng SignInManager để tạo tài khoản mới với mật khẩu do người dùng cung cấp.
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        // Kiểm tra nếu quá trình tạo tài khoản không thành công.
        if (!result.Succeeded)
        {
            // Lặp qua danh sách lỗi và thêm vào ModelState để phản hồi lại cho người dùng.
            foreach (var error in result.Errors)
            {
                string errorMessage = error.Description;
                // Dịch lỗi "DuplicateUserName" sang tiếng Việt
                if (error.Code == "DuplicateUserName")
                {
                    errorMessage = "Email này đã được sử dụng. Vui lòng chọn email khác.";
                }
                ModelState.AddModelError(error.Code, errorMessage);
            }

            // Trả về lỗi xác thực với danh sách lỗi.
            return ValidationProblem();
        }

        // Nếu đăng ký thành công, thêm người dùng vào role "Member".
        await signInManager.UserManager.AddToRoleAsync(user, "Member");

        // Trả về phản hồi thành công (HTTP 200 OK).
        return Ok();
    }

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized();

        var roles = await signInManager.UserManager.GetRolesAsync(user);

        return Ok(new
        {
            user.UserName,
            user.Email,
            Roles = roles
        });
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();

        return NoContent();
    }

    [Authorize] // yêu cầu người dùng đăng nhập mới có thể gọi api này, nếu không sẽ báo lỗi 401 unauthorized
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address)
    {
        var user = await signInManager.UserManager.Users
            .Include(x => x.Address) //eager loading luôn cả address
            .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name); // tìm user có name trùng với user đang đang nhập

        if (user == null) return Unauthorized();

        user.Address = address; // gán địa chỉ cho user

        var result = await signInManager.UserManager.UpdateAsync(user); // cập nhật lại csdl

        if (!result.Succeeded) return BadRequest("Cập nhật địa chỉ không thành công");

        return Ok(user.Address);
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetSavedAddress()
    {
        var address = await signInManager.UserManager.Users
            .Where(x => x.UserName == User.Identity!.Name)
            .Select(x => x.Address)
            .FirstOrDefaultAsync();

        if (address == null) return NoContent();

        return address;
    }
}

