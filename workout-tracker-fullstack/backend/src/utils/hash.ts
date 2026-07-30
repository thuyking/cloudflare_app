export async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password); //chuyển chuỗi password thành các số(byte)(bởi vì máy tính ko thể hiểu trực tiếp chữ cái)

  const hashBuffer = await crypto.subtle.digest("SHA-256", data) //Đây là bước băm (hash). SHA-256 là 1 công thức toán học có sẵn, nhận input là dãy số ở bước 1, rồi trộn/xáo nó theo 1 quy tắc cực kỳ phức tạp, cho ra 1 kết quả luôn có độ dài cố định (dù password ngắn hay dài).

  const hashArray = Array.from(new Uint8Array(hashBuffer)) //biến thành 1 danh sách các số nguyên, mỗi số từ 0 đến 255 

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("") //.
  // toString(16) chuyển số đó sang hệ thập lục phân (hệ 16 — dùng ký tự 0-9 và a-f để biểu diễn số). 
  // .padStart(2, "0") đảm bảo chuỗi luôn có đúng 2 ký tự, nếu thiếu thì tự thêm số 0 vào phía trước. 
  // .join("") gộp tất cả các phần tử trong mảng thành 1 chuỗi duy nhất, nối liền nhau không có dấu ngăn cách ("" nghĩa là nối bằng "không có gì" ở giữa):
}