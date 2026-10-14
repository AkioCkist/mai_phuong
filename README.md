# Mai Phương — Calliope Portfolio

Portfolio cá nhân của **Hồ Mai Phương (Calliope)**, giới thiệu hành trình học tập, kinh nghiệm tổ chức sự kiện, truyền thông, Hành chính – Nhân sự và các dự án đổi mới sáng tạo.

![Giao diện trang chủ](./text-clipping-fixed.jpg)

## Điểm nổi bật

- Giao diện editorial nhẹ nhàng, cá tính với bảng màu hồng kem.
- Typography hỗ trợ đầy đủ tiếng Việt, kết hợp Fraunces và Be Vietnam Pro.
- Nội dung được chia thành các phần: giới thiệu, sự kiện nổi bật, câu chuyện cá nhân, kinh nghiệm, thành tích, thư viện và liên hệ.
- Bộ lọc thư viện chương trình theo năm.
- Hiệu ứng xuất hiện và chuyển động có hỗ trợ `prefers-reduced-motion`.
- Thiết kế responsive cho desktop và thiết bị di động.
- Tích hợp Vercel Analytics ở môi trường production.

## Công nghệ

- [Next.js 16](https://nextjs.org/) với App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) cho biểu tượng
- [Vercel Analytics](https://vercel.com/docs/analytics)

## Chạy dự án trên máy

Yêu cầu Node.js 20+ và pnpm.

```bash
git clone https://github.com/AkioCkist/mai_phuong.git
cd mai_phuong
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Các lệnh chính

```bash
pnpm dev      # Chạy môi trường phát triển
pnpm build    # Tạo bản production
pnpm start    # Chạy bản production đã build
```

## Cấu trúc dự án

```text
app/                  Trang, layout và CSS toàn cục
components/site/      Các section và thành phần giao diện của portfolio
components/ui/        Thành phần UI dùng chung
lib/                  Nội dung và tiện ích
public/images/        Hình minh họa, mascot và tài nguyên hình ảnh
data/                 Tài liệu nội dung gốc
```

Phần lớn nội dung hiển thị được quản lý tập trung trong `lib/content.ts`, giúp cập nhật kinh nghiệm, sự kiện và thông tin cá nhân mà không cần sửa cấu trúc giao diện.

## Triển khai

Dự án có thể triển khai trực tiếp lên [Vercel](https://vercel.com/) bằng cách kết nối repository và sử dụng cấu hình mặc định dành cho Next.js.

Trước khi triển khai, kiểm tra bản production:

```bash
pnpm build
pnpm start
```

## Bạn

**Hồ Mai Phương — Calliope**

- Email: [Hmaiphuongworkmail@gmail.com](mailto:Hmaiphuongworkmail@gmail.com)
- LinkedIn: [Hồ Mai Phương](https://www.linkedin.com/in/h%E1%BB%93-mai-ph%C6%B0%C6%A1ng-973496391)

---

Made with care for Calliope.
