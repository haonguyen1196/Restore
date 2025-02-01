import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket, Item } from "../../app/models/basket";
import { Product } from "../../app/models/product";

//là hàm check dữ liệu truyền vào là product hay là Item
function isBasketItem(product: Product | Item): product is Item {
    // nếu quantity k phải là undefinde thì chắc chắc product là 1 Item
    return (product as Item).quantity !== undefined;
}

export const basketApi = createApi({
    reducerPath: "basketApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Basket"], // tao ra tag
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => "basket",
            providesTags: ["Basket"], // gán tag cho nơi cần sử dụng dữ liệu mới nhất (invalid caching)
        }),
        addBasketItem: builder.mutation<
            Basket,
            { product: Product | Item; quantity: number }
        >({
            query: ({ product, quantity }) => {
                const productId = isBasketItem(product)
                    ? product.productId
                    : product.id;
                return {
                    url: `basket?productId=${productId}&quantity=${quantity}`,
                    method: "POST",
                };
            },
            onQueryStarted: async (
                { product, quantity },
                { dispatch, queryFulfilled }
            ) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData(
                        "fetchBasket",
                        undefined,
                        (draft) => {
                            const productId = isBasketItem(product)
                                ? product.productId
                                : product.id;

                            const existingItem = draft.items.find(
                                (item) => item.productId === productId
                            );

                            if (existingItem) {
                                existingItem.quantity += quantity;
                            } else {
                                draft.items.push(
                                    isBasketItem(product)
                                        ? product
                                        : {
                                              ...product,
                                              productId: product.id,
                                              quantity: quantity,
                                          }
                                );
                            }
                        }
                    )
                );
                try {
                    await queryFulfilled;
                    // dispatch(basketApi.util.invalidateTags(["Basket"])); // mỗi khi add item vào giỏ hàng thành công sẽ thông báo cần fetch lại dữ liệu với tag tương ứng
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            }, // on query start chạy trước, phản hồi giỏ hàng ngay lập tức và lưu tạm giỏ hàng, nếu có lỗi thì sẽ undo();
        }),
        removeBasketItem: builder.mutation<
            void,
            { productId: number; quantity: number }
        >({
            query: ({ productId, quantity }) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: "DELETE",
            }),
            onQueryStarted: async (
                { productId, quantity },
                { dispatch, queryFulfilled }
            ) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData(
                        "fetchBasket", // những noi nào lấy dữ liệu từ hàm này sẽ có sự thay đổi dữ liệu ngay lập tức
                        undefined,
                        (draft) => {
                            const itemIndex = draft.items.findIndex(
                                (item) => item.productId === productId
                            );
                            if (itemIndex >= 0) {
                                draft.items[itemIndex].quantity -= quantity;
                                if (draft.items[itemIndex].quantity <= 0) {
                                    draft.items.splice(itemIndex, 1);
                                }
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useFetchBasketQuery,
    useAddBasketItemMutation,
    useRemoveBasketItemMutation,
} = basketApi;
