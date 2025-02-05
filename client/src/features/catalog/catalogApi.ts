import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { ProductParams } from "../../app/models/productParams";
import { filterEmptyValues } from "../../lib/util";
import { Pagination } from "../../app/models/pagination";

export const catalogApi = createApi({
    reducerPath: "catalogApi",
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<
            { items: Product[]; pagination: Pagination },
            ProductParams
        >({
            query: (productParams) => {
                return {
                    url: "products",
                    params: filterEmptyValues(productParams),
                };
            },
            // cấu trúc lại dữ liệu trả về, trả về thêm thông tin pagination
            transformResponse: (items: Product[], meta) => {
                const paginationHeader =
                    meta?.response?.headers.get("Pagination");
                const pagination = paginationHeader
                    ? JSON.parse(paginationHeader)
                    : null;
                return { items, pagination };
            },
        }),
        fetchProductDetail: builder.query<Product, number>({
            query: (productId) => `products/${productId}`,
        }),
        fetchFilter: builder.query<{ brands: string[]; types: string[] }, void>(
            {
                query: () => "products/filters",
            }
        ),
    }),
});

export const {
    useFetchProductDetailQuery,
    useFetchProductsQuery,
    useFetchFilterQuery,
} = catalogApi;
