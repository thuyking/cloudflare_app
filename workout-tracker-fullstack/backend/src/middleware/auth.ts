import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!auth) {
    return c.json({ message: "No token provided" }, 401);
  }
  const token = auth.replace("Bearer ", "");
  //Method .replace() của string: tìm chuỗi con A xuất hiện đầu tiên trong chuỗi gốc, rồi thay nó bằng chuỗi B.
  //Trong chuỗi auth, tìm đoạn "Bearer " (chữ Bearer + 1 dấu cách), thay nó bằng "" (chuỗi rỗng, tức là xóa đi) cách hàm replace trên chạy mục đích là lấy chuỗi token không để so sánh
  try {
    const payload = await verify(token, c.env.JWT_SECRET, "HS256") // so sanh token vs JWT_SECRET để xác thực 
    c.set("userId", payload.userId); // dùng để lưu  lại useId đã xác thực và sẽ được dùng cho các hàm logic bên trong sau khi login bằng c.get("userId") nó gần giống như localStorge ở
    await next();
  } catch {
    return c.json(
      { message: "Unauthorized" },
      401)
  }
})   