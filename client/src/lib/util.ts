import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { PaymentSummary, ShippingAddress } from "../app/models/order";

export function currencyFormat(amount: number) {
    return "$" + (amount / 100).toFixed(2);
}

export function filterEmptyValues(values: object) {
    return Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined &&
                value.length !== 0
        )
    );
} // entries biến object thành 1 mảng có các mảng con chứa key và value
// => filter ,value thỏa đk thì lấy mảng con đó
// biến mảng chứa các mảng con thỏe điền kiện lại thành object bằng fromEntries

export const formatAddressString = (address: ShippingAddress) => {
    return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`;
};

export const formatPaymentString = (card: PaymentSummary) => {
    return `${card?.brand.toUpperCase()}, **** **** ${card?.last4}, Exp: ${
        card?.exp_month
    }/${card?.exp_year}`;
};

//xử lý lỗi trả về và hán lỗi tương ứng vào field
export function handleApiError<T extends FieldValues>(
    error: unknown, // đối tượng lỗi từ api trả về
    setError: UseFormSetError<T>, // gán lỗi vào field trong form
    fieldNames: Path<T>[] // danh sách cách field trong form để tìm xem lỗi api có liên quan tới field nào không
) {
    const apiError = (error as { message: string }) || {}; // giả xử error là 1 object

    if (apiError.message && typeof apiError.message === "string") {
        const errorArray = apiError.message.split(","); // tách lỗi thành mãng qua ký tu ','

        errorArray.forEach((e) => {
            const matchedField = fieldNames.find((fieldName) =>
                e.toLowerCase().includes(fieldName.toString().toLowerCase())
            ); // tìm lỗi match với tên field

            if (matchedField) setError(matchedField, { message: e.trim() }); // nếu matching thì gắn lỗi cho field name
        });
    }
}
