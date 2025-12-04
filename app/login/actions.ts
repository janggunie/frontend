// app/login/actions.ts
"use server";

import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post("/api/v1/login", {
      username,
      password,
    });

    const cookieStore = await cookies();
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      setCookieHeader.forEach((cookieStr) => {
        const [cookieNameValue, ...options] = cookieStr.split(";");
        const [name, value] = cookieNameValue.split("=");

        if (name && value) {
          cookieStore.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
          });
        }
      });
    }

    cookieStore.set("logged-in", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1일
    });

    return { success: true };
  } catch (error) {
    const err = error as AxiosError<{ detail?: string }>;

    if (err.response?.data?.detail) {
      return { error: err.response.data.detail };
    }

    console.error("Login error:", err);
    return { error: "로그인 중 알 수 없는 오류가 발생했습니다." };
  }
}
