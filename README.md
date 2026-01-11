# Vue Naive Admin

<p align="center">
  <a href="https://github.com/zclzone/vue-naive-admin">
    <img alt="Vue Naive Admin Logo" width="200" src="./src/assets/images/logo.png">
  </a>
</p>
<p align="center">
  <a href="./LICENSE"><img alt="MIT License" src="https://badgen.net/github/license/zclzone/vue-naive-admin"/></a>
</p>

---

<a href="https://hellogithub.com/repository/54f19ba1f9ae4238b3cbd111f3c428b0" target="_blank"><img src="https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=54f19ba1f9ae4238b3cbd111f3c428b0&claim_uid=jXGayRdJZScqMNr" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Giới thiệu

Vue Naive Admin là một template quản lý backend với phong cách tối giản, bao gồm giải pháp frontend và backend. Frontend sử dụng Vite + Vue3 + Pinia + Unocss, backend sử dụng Nestjs + TypeOrm + MySql. Đơn giản dễ dùng, đẹp mắt, qua hàng chục lần tái cấu trúc và hoàn thiện chi tiết, thành ý đầy đủ!!

## Triết lý thiết kế

Vue Naive Admin bắt đầu mã nguồn mở từ tháng 2/2022, từ 1.0 đến 2.0 hiện tại, luôn giữ vững triết lý `đơn giản là đúng đắn`, nhằm giúp các doanh nghiệp vừa và nhỏ, sinh viên đại học và các nhà phát triển cá nhân nhanh chóng làm quen với việc phát triển dự án quản lý backend. Để giảm chi phí học tập cho người sử dụng, chúng tôi không sử dụng TypeScript (frontend) có vẻ như là xu hướng chính, điều này cũng khiến Vue Naive Admin trở thành một trong số ít `template quản lý Vue3 backend sử dụng JavaScript` trên thị trường, và vẫn khá xuất sắc, được nhiều bạn bè công nhận và yêu thích.

## Tính năng

- 🆒 Sử dụng **Vue3** stack công nghệ mới nhất: `Vite + Vue3 + Pinia`
- 🍇 Sử dụng framework **Atomic CSS**: `Unocss`, tinh tế, nhẹ nhàng, dễ dùng
- 🍍 Tích hợp `Pinia` quản lý state, hỗ trợ state persistence
- 🤹 Sử dụng phương án icon `iconify + unocss` phổ biến, hỗ trợ custom icon, hỗ trợ render động
- 🎨 Sử dụng Naive UI, `phong cách code cực kỳ đơn giản và thiết kế trang gọn gàng`, thẩm mỹ online, dễ dàng tùy chỉnh theme
- 👏 Thiết kế cấu trúc file tiên tiến và dễ hiểu, **zero coupling** giữa nhiều module, xóa một module nghiệp vụ không ảnh hưởng module khác
- 🚀 Thiết kế `flat route`, mỗi component đều có thể là một trang, giải quyết vấn đề `KeepAlive` khó thực hiện với multi-level route
- 🍒 `Tạo route động dựa trên quyền`, không cần định nghĩa route thêm, `có thể phân biệt trang 403 và 404`, thay vì không có quyền cũng nhảy 404
- 🔐 Tích hợp `refresh không cảm giác` dựa trên Redis, trạng thái đăng nhập người dùng có thể kiểm soát, bảo mật và trải nghiệm không thể thiếu
- ✨ Đóng gói phương thức công cụ toàn cục `message` dựa trên Naive UI, hỗ trợ nhắc nhở hàng loạt, hỗ trợ chế độ singleton cross-page
- ⚡️ Đóng gói các component nghiệp vụ thường dùng dựa trên Naive UI, bao gồm component `Page`, component bảng `CRUD` và component `Modal`, đơn giản dễ dùng, giảm thiểu công việc lặp lại

## Hiệu suất tối ưu

![](https://docs.isme.top/Public/Uploads/2023-11-18/6558568b2b476.png)
![](https://docs.isme.top/Public/Uploads/2023-11-18/655853caa9ce8.png)

## Khác biệt giữa 2.0 và 1.0

- 2.0 được thiết kế lại từ 0 đến 1 dựa trên phong cách 1.0, vì vậy 2.0 trông giống 1.0 nhưng thực tế cấu trúc code khá khác biệt.
- 1.0 chỉ cung cấp frontend, backend sử dụng Mock mô phỏng, còn 2.0 là phiên bản full-stack, cung cấp API backend thực.
- Mặc dù 2.0 có version cao hơn 1.0, nhưng độ phức tạp lại thấp hơn nhiều so với 1.0, dù 1.0 cũng rất đơn giản.
- Tính linh hoạt của 2.0 cao hơn nhiều so với 1.0, chỉ cần bạn muốn, bạn có thể tùy chỉnh riêng một layout cho mỗi trang

[Trải nghiệm 1.0 | template.isme.top](https://template.isme.top)

[Trải nghiệm 2.0 | admin.isme.top](https://admin.isme.top)

## Backend Nestjs

Vue Naive Admin cung cấp một bộ code backend, tech stack sử dụng Nestjs + TypeOrm + MySql, tích hợp sẵn JWT, RABC và một số API cơ bản cần thiết cho template.

- Source code-github: [isme-nest-serve | github](https://github.com/zclzone/isme-nest-serve)
- Source code-gitee: [isme-nest-serve | gitee](https://gitee.com/isme-admin/isme-nest-serve)

## Tài liệu

- Tài liệu dự án: [docs | vue-naive-admin](https://isme.top)
- Tài liệu API: [apidoc | isme-nest-serve](https://apifox.com/apidoc/shared-ff4a4d32-c0d1-4caf-b0ee-6abc130f734a)

> Lưu ý: Có một câu hỏi khá phổ biến là làm thế nào để thêm và sửa menu. Do dự án được điều khiển bởi backend về tài nguyên menu, nên cần kết nối backend rồi sử dụng chức năng quản lý tài nguyên để thêm/sửa/xóa menu, sau đó sử dụng chức năng quản lý vai trò để cấp quyền cho vai trò tương ứng. Cụ thể cách kết nối backend, vui lòng tham khảo [Tài liệu dự án](https://isme.top). Tất nhiên, có thể có một số menu bạn không muốn kiểm soát qua quyền, thì bạn có thể thêm basePermissions trong file `/src/settings.js`, chỉ cần căn chỉnh cấu trúc tài nguyên menu, cấu trúc có thể tham khảo [Tài liệu API](https://apifox.com/apidoc/shared-ff4a4d32-c0d1-4caf-b0ee-6abc130f734a/api-134536978).

## Sử dụng template này để bắt đầu dự án của bạn

[Sử dụng template này để tạo Github repository](https://github.com/zclzone/vue-naive-admin/generate).

Hoặc sử dụng `degit` để clone repository này, như vậy sẽ không có lịch sử commit:

```cmd
npx degit zclzone/vue-naive-admin
```

## Thông tin bản quyền

Dự án này sử dụng `Giấy phép MIT`, mặc định cấp quyền cho bất kỳ ai, người được cấp quyền có thể sử dụng, sao chép, sửa đổi, hợp nhất, phát hành, phân phối, cấp phép lại, bán các bản sao phần mềm này miễn phí và không giới hạn, và có quyền cấp quyền tương tự cho người được cung cấp, nhưng phải đáp ứng các điều kiện sau:

- Sao chép, sửa đổi và phân phối code dự án này cần bao gồm thông tin bản quyền và giấy phép của tác giả gốc, bao gồm nhưng không giới hạn ở comment đầu file, thỏa thuận, v.v.

Nói đơn giản, tác giả chỉ muốn giữ bản quyền, không có bất kỳ hạn chế nào khác.

## Các dự án backend khác đã kết nối với dự án này

- [isme-java-serve](https://github.com/DHBin/isme-java-serve): Một dịch vụ backend Java nhẹ, dựa trên SpringBoot, MybatisPlus, SaToken, MapStruct, v.v., đã kết nối với Vue Naive Admin 2.0.
- [naive-admin-go](https://github.com/ituserxxx/naive-admin-go): Một dịch vụ backend Go, dựa trên gin, gorm, mysql, jwt và session, đã kết nối với Vue Naive Admin 2.0.
- [isme-java](https://github.com/AllenDengMs/isme-java): Một dịch vụ backend Java nhẹ và hoàn thiện cao, dựa trên Springboot 3 + JDK21, cấu trúc phân tầng nghiêm ngặt, comment đầy đủ, tránh đóng gói quá mức, độ dễ đọc code cao, dependency tối giản, chi phí tiếp cận thấp, đã tích hợp quản lý tài khoản, quản lý quyền, xác thực API, quốc tế hóa tin nhắn và các chức năng khác.

## Liên hệ tác giả hoặc tham gia nhóm trao đổi

[https://www.isme.top/contact.html](https://www.isme.top/contact.html)
