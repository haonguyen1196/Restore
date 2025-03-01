using System;
using API.Entities;
using Stripe;

namespace API.Services;

// sử dụng Stripe API để tạo hoặc cập nhật một PaymentIntent cho một giỏ hàng (Basket).
public class PaymentsService(IConfiguration config)
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"]; // thiết lập khóa api của stripe

        var service = new PaymentIntentService(); // tạo dịch vụ xử lý payment intent

        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(x => x.Quantity * x.Product.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };
            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };

            await service.UpdateAsync(basket.PaymentIntentId, options);
        }

        return intent;
    }
}
