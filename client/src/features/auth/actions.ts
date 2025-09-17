import { login as apiLogin, register as apiRegister } from "@/api/user";

export async function loginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await apiLogin(username, password);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { success: true, token, user };
    }
    return { success: false, error: "No token received" };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error?.response?.data?.message || "Login failed",
    };
  }
}

export async function registerAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await apiRegister(username, password);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { success: true, token, user };
    }
    return { success: false, error: "No token received" };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error?.response?.data?.message || "Registration failed",
    };
  }
}