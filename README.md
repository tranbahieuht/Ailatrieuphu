# AI LÀ TRIỆU PHÚ — Chinh phục Triết học Mác – Lênin

Gameshow chạy độc lập, dành cho trình chiếu và tổ chức hoạt động trong lớp học. Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, Lucide. Không tài khoản, database, backend nghiệp vụ, Canva SDK hay script theo dõi.

## Chạy trên máy

Yêu cầu Node.js 20.9 trở lên.

```sh
npm install
npm run dev
```

Mở http://localhost:3000. `predev` tự kiểm tra nhạc và tạo manifest. Nhạc dự phòng đã có sẵn trong `public/audio/`.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Bộ câu hỏi và nguồn học thuật

Bản yêu cầu ban đầu không kèm mã HTML/JS chứa bộ câu hỏi cũ. Theo chỉ dẫn tiếp theo của người dùng, dự án có **15 câu hỏi biên soạn mới**, 4 phương án, một đáp án đúng, giải thích và gợi ý cho từng câu, chủ đề học thuyết hình thái kinh tế – xã hội. Không tuyên bố đây là nội dung nguyên văn của bộ gốc.

Sửa tại `src/data/questions.ts`. `correct` dùng chỉ số từ 0 đến 3. Các nguồn hiển thị trong Luật chơi, sau phần giải thích và màn hình kết quả:

- [Bộ Giáo dục và Đào tạo, Giáo trình Triết học Mác – Lênin, Chương X](https://tailieuso.lce.vn/wp-content/uploads/2023/06/Giao-trinh-Triet-hoc-Mac-Leninf4426fe_triethocmaclenin.pdf), bản lưu tại thư viện Trường Cao đẳng Sư phạm Lạng Sơn. Các mục về sản xuất vật chất, lực lượng sản xuất, quan hệ sản xuất, cơ sở hạ tầng, kiến trúc thượng tầng và hình thái kinh tế – xã hội.
- [C. Mác, Lời tựa Góp phần phê phán khoa kinh tế chính trị (1859)](https://www.marxists.org/archive/marx/works/1859/critique-pol-economy/preface.htm), bản tiếng Anh trên Marxists Internet Archive, đối chiếu các luận điểm về cơ cấu kinh tế, quan hệ sản xuất và chuyển biến xã hội.

Các câu hỏi và giải thích là nội dung biên soạn, diễn đạt lại cho mục đích ôn tập. Chuyên gia đưa gợi ý từ dữ liệu câu hỏi; không gọi AI hay dịch vụ bên ngoài. Khán giả là bình chọn mô phỏng.

## Âm thanh

Đã ghép 5 bản ghi người dùng cung cấp từ `D:\Nhạc`:

| Tệp trong dự án | Phần phát nhạc |
| --- | --- |
| `public/audio/intro.mp3` | Mở màn 2015–2020; phát hết rồi bắt đầu câu 1, có nút bỏ qua |
| `public/audio/correct-10.mp3` | Trả lời đúng câu 10; ưu tiên bản riêng thay hiệu ứng mốc chung |
| `public/audio/victory.mp3` | Trả lời đúng câu 15, bản dài |
| `public/audio/wrong.mp3` | Trả lời sai; đoạn đầu 0–8,7 giây của video tổng hợp |
| `public/audio/ending.mp3` | Màn kết quả khi thắng, trả lời sai, hết giờ hoặc dừng giữ điểm |
| `public/audio/countdown.mp3` | Nhạc từ `NHẠC TÍNH DÂY.mp4`, phát khi đồng hồ đếm ngược ở tất cả 15 câu |

Các MP3 đã được tách âm thanh từ MP4, không kèm hình ảnh. Tên video nguồn và đoạn trích được lưu tại `public/audio/sources.json`. Nhạc câu 15 phát khi công bố đáp án; khi người chơi bấm xem kết quả, nhạc kết thúc thay thế bản này. Sang câu mới, hiệu ứng của câu trước được dừng.

Để nhập lại từ video nguồn: `python scripts/import-audio.py "D:\Nhạc"` (cần FFmpeg hoặc gói Python `imageio-ffmpeg`), sau đó chạy `node scripts/prepare-audio.mjs`. Các MP3 được lưu sẵn trong dự án; chạy hoặc triển khai website không cần Python hay thư mục nguồn.

Website có **12 bản nhạc/hiệu ứng nguyên bản**, được tổng hợp bằng mã trong `scripts/prepare-audio.mjs`: nền hòa âm, bass, arpeggio, nhịp gõ và hiệu ứng stereo. Các WAV này không sử dụng bản ghi hay giai điệu của chương trình truyền hình. Mã và các bản thu tổng hợp này được cung cấp theo **CC0-1.0**; xem `public/audio/LICENSE.txt`.

Nếu đã có quyền sử dụng nhạc gốc, đặt MP3 vào các vị trí dưới đây. **Không cần chỉnh mã AudioManager**. Chạy lại `npm run dev` hoặc `npm run build`: manifest ưu tiên các MP3 có thật, còn lại dùng WAV dự phòng; không thử tải đường dẫn MP3 không tồn tại.

| Tệp | Sử dụng |
| --- | --- |
| `public/audio/intro.mp3` | Mở màn khi bắt đầu |
| `public/audio/question-easy.mp3` | Nhạc lặp câu 1–5 |
| `public/audio/question-medium.mp3` | Nhạc lặp câu 6–10 |
| `public/audio/question-hard.mp3` | Nhạc lặp câu 11–15 |
| `public/audio/final-answer.mp3` | Nhạc chốt đáp án, công bố sau 2,8 giây |
| `public/audio/correct.mp3` | Đáp án đúng |
| `public/audio/wrong.mp3` | Đáp án sai |
| `public/audio/milestone.mp3` | Vượt câu 5 hoặc 10 |
| `public/audio/victory.mp3` | Thắng đủ 15 câu |
| `public/audio/timeout.mp3` | Hết giờ |
| `public/audio/lifeline.mp3` | Dùng trợ giúp |
| `public/audio/warning.mp3` | Tùy chọn: cảnh báo từng giây từ 10 giây trở xuống |

Nhạc chỉ phát sau thao tác người dùng. Một kênh nhạc nền và một kênh hiệu ứng, fade-out/fade-in, hủy yêu cầu phát cũ khi đổi màn hình hoặc tắt tiếng. Âm lượng và trạng thái tắt tiếng được lưu cục bộ trên trình duyệt; tên và lịch sử lượt chơi không được gửi đi. Nếu trình duyệt chặn âm thanh hoặc thiết bị không phát được tệp, trò chơi vẫn tiếp tục và hiển thị thông báo.

## Điều khiển và luật

| Phím | Chức năng |
| --- | --- |
| A / B / C / D | Chọn đáp án |
| Enter | Bắt đầu, chốt, câu tiếp hoặc xem kết quả tùy trạng thái |
| 1 / 2 / 3 | 50:50 / Khán giả / Chuyên gia |
| Space | Tạm dừng hoặc tiếp tục đồng hồ |
| M | Bật/tắt âm thanh |
| F | Bật/tắt toàn màn hình |
| Escape | Đóng popup, hoặc thoát toàn màn hình theo trình duyệt |
| Tab / Shift+Tab | Điều hướng tất cả nút và trường nhập |

- 30 giây/câu, tính theo thời gian thực đã trôi qua (`performance.now`), không trừ cố định theo số lần interval chạy. Không đếm trong mở màn, suspense, công bố, tạm dừng hay tư vấn chuyên gia.
- Khán giả **không** dừng đồng hồ; popup ghi rõ thời gian đang chạy. Nếu hết giờ, popup tự đóng để hiển thị đáp án và giải thích.
- Chuyên gia tạm dừng đồng hồ câu hỏi, tư vấn tối đa 20 giây. Đóng sớm hoặc hết tư vấn sẽ tiếp tục từ thời gian còn lại.
- Đáp án chỉ công bố sau khi chốt 2,8 giây. Không tự chuyển qua phần giải thích.
- Sai/hết giờ: 0 điểm nếu chưa qua câu 5; 1.000 nếu qua câu 5; 5.000 nếu qua câu 10. Vượt câu 15: 30.000.
- Có thể dừng sau mỗi câu đúng để giữ điểm của câu đó. Trợ giúp chỉ dùng một lần/lượt, được khôi phục khi chơi lại.
- Luật chơi chỉ mở trước hoặc sau lượt chơi. Tên bỏ trống dùng “Người chinh phục”.

## Cấu trúc

```text
src/app/               Trang Next.js, metadata, giao diện responsive
src/components/        GameStage, WelcomeScreen, QuestionCard, AnswerButton,
                       ScoreLadder, LifelinePanel, Modal, Emblem, ResultScreen
src/data/questions.ts  15 câu hỏi, đáp án, giải thích, gợi ý, nguồn
src/lib/game.ts        Reducer, trạng thái, tính điểm, mô phỏng trợ giúp
src/lib/AudioManager.ts Điều phối nhạc và hiệu ứng
scripts/prepare-audio.mjs Tổng hợp WAV, phát hiện MP3, tạo manifest
tests/                 Kiểm tra luật chơi và vòng đời âm thanh
public/audio/          Tệp âm thanh chạy độc lập
```

## Deploy Vercel

Đưa thư mục dự án lên repository Git rồi import vào Vercel. Chọn framework **Next.js**, install command `npm ci`, build command `npm run build`; output để mặc định. Không cần biến môi trường hay database. Cấu hình Next.js tiêu chuẩn đã được giữ nguyên để dùng `npm start` khi tự host.

Thư mục `public/audio` phải được đưa vào repository để deployment có đủ âm thanh. `prebuild` cập nhật manifest theo các MP3 hợp lệ hiện có. Không cần tải nhạc từ dịch vụ bên ngoài khi người chơi sử dụng.

## Kiểm tra

`npm test` kiểm tra bộ 15 câu hỏi, toàn bộ thang điểm, luồng thắng, sai tại từng cấp, hết giờ, dừng giữ điểm, tạm dừng/chuyên gia, hủy thao tác khi chốt, 50:50, bình chọn tổng 100%, reset lượt chơi và vòng đời âm thanh. Build production thực hiện kiểm tra TypeScript.

Các breakpoint giao diện: desktop hai cột, tablet bố cục dọc, mobile bốn đáp án xếp một cột. Trên mobile và tablet, trợ giúp đặt ngay trên câu hỏi để không phải cuộn xuống thang điểm. Khi đổi câu hoặc đổi màn hình, trang trở về đầu; tiêu đề câu hỏi/kết quả nhận focus để tiếp tục chơi bằng bàn phím. Popup giữ focus, hỗ trợ cả mục tài liệu mở rộng và trả focus khi đóng. CSS cùng Framer Motion tuân theo `prefers-reduced-motion`.

Đã kiểm tra trực tiếp trên Edge với viewport giả lập 390 × 900, 768 × 900, 1280 × 720 và desktop: màn mở đầu, bố cục câu hỏi/đáp án, 50:50 kết hợp khán giả (hai cột bị loại ở 0%), chuyên gia tư vấn, hết giờ tự đóng popup và hiển thị lời giải, màn kết quả, chơi lại khôi phục trợ giúp, chọn đáp án sai và công bố đáp án đúng. Giao diện công bố đáp án tự thu gọn huy hiệu trên màn hình thấp để dành chỗ cho giải thích. Đây là kiểm tra responsive trên trình duyệt desktop, chưa phải kiểm tra trên thiết bị iOS/Android thật.

Âm nhạc ưu tiên 5 MP3 đã nhập ở trên; các phần chưa có bản ghi riêng tiếp tục dùng WAV dự phòng.
