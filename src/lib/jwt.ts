import { jwtDecode, JwtPayload } from "jwt-decode";

export const jwtDecodeFunc = (token?: string): JwtPayload => {
  try {
    if (!token) throw Error("Token invalid");

    // Decode token
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error: any) {
    console.error("Error decoding token:", error);
    throw Error("Token Error", error);
  }
};

// Hàm decode JWT và kiểm tra hạn sử dụng
export const checkTokenExpiration = (token?: string): boolean => {
  try {
    const decoded = jwtDecodeFunc(token);

    // Lấy thời gian hiện tại (UNIX timestamp)
    const currentTime = Math.floor(Date.now() / 1000);

    // Kiểm tra hạn sử dụng của token
    if (decoded && decoded.exp && decoded.exp < currentTime) {
      return false; // Token đã hết hạn
    }

    return true; // Token vẫn còn hạn sử dụng
  } catch (error) {
    console.error("Error decoding token:", error);
    return false; // Token không hợp lệ
  }
};
