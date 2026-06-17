import { redirect } from 'next/navigation';

// 루트 → 박물관(/dev). dev 진입점 단일화(갤러리 덤프 폐기, 분류 셸로 일원화).
export default function Home() {
  redirect('/dev');
}
