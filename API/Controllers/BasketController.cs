using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController(StoreContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NoContent();

            return basket.ToDto();
        }

        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(); // kiểm tra rổ nếu chưa có thì tạo

            basket ??= CreateBasket();

            var product = await context.Products.FindAsync(productId); // tìm sẩn phẩm nếu k có thì báo lỗi

            if (product == null) return BadRequest("Có lỗi khi thêm sản phẩm vào giỏ hàng");

            basket.AddItem(product, quantity); // thêm sản phẩm vào rổ và lưu vào bộ nhớ tạm

            var result = await context.SaveChangesAsync() > 0; // lưu thay đổi với csdl

            if (result) return CreatedAtAction(nameof(GetBasket), basket.ToDto()); // trả về http 201 với đường dẫn getbasket và nội dung ở body là basket mới được thêm

            return BadRequest("Có lỗi khi cập nhật giỏ hàng"); // báo lỗi nếu thêm không thành công
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket();

            if (basket == null) return BadRequest("Không thể lấy giỏ hàng");

            basket.RemoveItem(productId, quantity);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("Có lỗi khi cập nhật giỏ hàng");
        }

        private Basket CreateBasket()
        {
            var basketId = Guid.NewGuid().ToString(); //tạo ra chuỗi ngẩy nhiên
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(30)
            }; // tạo option cho cookie với thời gian gian 30 ngày
            Response.Cookies.Append("basketId", basketId, cookieOptions); // trả cookie lưu tại trình duyệt client tự lưu
            var basket = new Basket { BasketId = basketId }; //tạo đối tượng 
            context.Baskets.Add(basket); //thêm đối tượng vào bộ nhớ tạm thời của DBcontext
            return basket;
        }

        private async Task<Basket?> RetrieveBasket()
        {
            return await context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["BasketId"]);
        }
    }
}
