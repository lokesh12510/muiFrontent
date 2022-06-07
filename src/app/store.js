import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// api
import { authApi } from "../modules/admin/pages/Auth/_adminApi";
import { api } from "./api";
// reducers
import authReducer from "../modules/admin/pages/Auth/_authSlice";

const reducers = combineReducers({
	auth: authReducer,
	[authApi.reducerPath]: authApi.reducer,
	[api.reducerPath]: api.reducer,
});

// store user details in localStorage
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"], // to persist in localStorage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== "production",

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			authApi.middleware,
			api.middleware
		),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

//    dispatch(baseApi.util.resetApiState());
