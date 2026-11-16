import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ai là triệu phú | Chinh phục Triết học Mác – Lênin',
  description: 'Bước lên ghế nóng, chinh phục 15 câu hỏi về học thuyết hình thái kinh tế – xã hội.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
