// Image 원자 — 콘텐츠 이미지(제품사진·도면썸네일·로고). Avatar(원형·이니셜)와 별개 —
//  Avatar는 사람 식별용 원형 폴백, Image는 임의 콘텐츠 이미지의 고정 종횡비 박스.
//  · src·alt·fallbackSrc = 콘텐츠 prop. src는 placeholder류라 닫기 대상 아님(스타일 우회 아님).
//    alt는 접근성 필수.
//  · fit = cover(꽉 채우고 넘침 자름)/contain(다 보이게 안쪽 맞춤). size가 박스를 고정해야 fit이 산다.
//  · size = sm/md/lg 토큰. 고정 종횡비(4:3) 박스의 폭을 정하고 높이는 비율로 도출.
//  · radius = 토큰(sm/md/full).
//  ※ 예외(명시): "폭은 컨테이너가 분배" 원칙의 고정치수 예외 — 이미지는 고유 종횡비 콘텐츠라
//    컨테이너에 맡기면 찌그러진다(Avatar 동형). 값은 토큰으로 닫혀 임의 px 누수 없음.
import { Image as M } from '@mantine/core';

type Fit = 'cover' | 'contain';
type Radius = 'sm' | 'md' | 'full';
type Size = 'sm' | 'md' | 'lg';

type ImageProps = {
  src: string;
  alt: string;                  // 접근성 필수
  fallbackSrc?: string;         // 로드 실패 시
  fit?: Fit;                    // 기본 cover(썸네일 표준)
  radius?: Radius;              // 기본 sm
  size?: Size;                  // 기본 md
};

// size 토큰 → 박스 폭 px(잠정값). 높이는 4:3 비율로 도출(아래 calc).
const WIDTH_PX: Record<Size, number> = { sm: 80, md: 160, lg: 280 };
const ASPECT = 3 / 4; // 높이 = 폭 * 3/4 (4:3 가로 박스)

export function Image({
  src, alt, fallbackSrc, fit = 'cover', radius = 'sm', size = 'md',
}: ImageProps) {
  const w = WIDTH_PX[size];
  return (
    <M
      src={src}
      alt={alt}
      fallbackSrc={fallbackSrc}
      fit={fit}
      radius={radius}
      w={w}
      h={w * ASPECT}
    />
  );
}
