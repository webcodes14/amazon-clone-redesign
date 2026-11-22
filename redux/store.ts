import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice";
import cartReducer from "./cartSlice";
import notificationsReducer from "./notificationsSlice";

export const makeStore = () => configureStore({
    reducer: {
        _placeholder: (state = {}) => state,
        wishlist: wishlistReducer,
        cart: cartReducer,
        notifications: notificationsReducer,
    }
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];