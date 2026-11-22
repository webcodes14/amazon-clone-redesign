import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotificationsState {
    readKeys: string[];
    isHydrated: boolean;
}

const initialState: NotificationsState = {
    readKeys: [],
    isHydrated: false,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        hydrateReadNotifications(state, action: PayloadAction<string[]>) {
            state.readKeys = action.payload;
            state.isHydrated = true;
        },
        markNotificationsRead(state, action: PayloadAction<string[]>) {
            state.readKeys = [...new Set(action.payload)];
        },
        retainActiveNotificationKeys(state, action: PayloadAction<string[]>) {
            const activeKeys = new Set(action.payload);
            const activeReadKeys = state.readKeys.filter((key) => activeKeys.has(key));
            if (activeReadKeys.length !== state.readKeys.length) {
                state.readKeys = activeReadKeys;
            }
        },
    },
});

export const { hydrateReadNotifications, markNotificationsRead, retainActiveNotificationKeys } = notificationsSlice.actions;
export default notificationsSlice.reducer;
