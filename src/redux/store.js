import { configureStore } from "@reduxjs/toolkit";
import authApi from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import productsApi from "./features/products/productsApi";
import reviewsApi from "./features/reviews/reviewsApi";
import cartReducer from "./features/cart/cartSlice";
import orderApi from "./features/orders/orderApi";
import statsApi from "./features/stats/statsApi";
import categoriesApi from "./features/categories/categoriesApi";
import sizesApi from "./features/sizes/sizesApi";
import discountsApi from "./features/discounts/discountsApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        cart: cartReducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [sizesApi.reducerPath]: sizesApi.reducer,
        [discountsApi.reducerPath]: discountsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            productsApi.middleware,
            reviewsApi.middleware,
            orderApi.middleware,
            statsApi.middleware,
            categoriesApi.middleware,
            sizesApi.middleware,
            discountsApi.middleware
        ),
});