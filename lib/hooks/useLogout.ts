"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { logout as logoutAction } from "@/lib/authSlice";
import { authApi } from "@/lib/api/authApi";
import { userApi, useLogoutMutation } from "@/lib/api/userApi";

export function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const refresh = useSelector((s: RootState) => s.auth.refresh);
  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const logoutUser = async () => {
    try {
      // Serverda refresh tokenni blacklist qilish
      if (refresh) await logoutRequest({ refresh }).unwrap();
    } catch (err) {
      // Token muddati o'tgan bo'lsa ham lokal chiqishni davom ettiramiz
      console.log("LOGOUT ERROR:", err);
    } finally {
      dispatch(logoutAction());
      dispatch(authApi.util.resetApiState());
      dispatch(userApi.util.resetApiState());
      router.push("/login");
    }
  };

  return { logoutUser, isLoading };
}