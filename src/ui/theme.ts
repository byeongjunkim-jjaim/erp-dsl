import { createTheme, type MantineColorsTuple, type CSSVariablesResolver } from '@mantine/core';

// ─────────────────────────────────────────────────────────────
// theme.ts — 시스템 전체에서 hex가 사는 "유일한" 파일 (헌법 3·8).
// 컴포넌트는 hex를 직접 안 본다. 오직 역할 이름(primary/neutral/text.*/...)만 참조.
// ※ 값(hex·px)은 전부 화면 검증에서 조정할 잠정값. 구조·관계만 확정이다.
// ─────────────────────────────────────────────────────────────

// 색 사다리 (각 10칸: index 0 = 50(가장 밝음) … 9 = 900(가장 어두움)) ─────────

// primary = 미지수 그릇. 지금은 navy(hue 216). index 6(#1E4178)이 메인.
// 회사가 바뀌면 이 배열만 통째로 교체 → 전체 화면이 따라온다.
const primary: MantineColorsTuple = [
  '#EEF2F9', '#D6E0F0', '#B0C2DF', '#7E9AC6', '#4F72AB',
  '#2F5490', '#1E4178', '#173360', '#11264A', '#0B1A35',
];

// neutral = f(primary). primary와 같은 hue(216), 채도만 ~7%로 죽인 차가운 회색.
const neutral: MantineColorsTuple = [
  '#F8F9FA', '#F1F2F4', '#E2E4E9', '#CBCED6', '#9CA1AD',
  '#6E7480', '#4F545E', '#383C44', '#24272D', '#16181C',
];

// 상태색(불변). Tailwind의 대비 검증된 사다리를 출발점으로.
const success: MantineColorsTuple = [
  '#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80',
  '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D',
];

// warning = amber(갈색기) 대신 더 노란 yellow 계열.
const warning: MantineColorsTuple = [
  '#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15',
  '#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12',
];

const danger: MantineColorsTuple = [
  '#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171',
  '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
];

const info: MantineColorsTuple = [
  '#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA',
  '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
];

// ── 시맨틱 역할 (텍스트·배경·보더) — 모드 분기가 일어나는 "유일한" 층 ──────
// 컴포넌트(Title 등)는 text.primary만 참조하고 검정/흰색 분기를 모른다.
// 색이 뒤집히는 책임은 토큰(여기)이 진다. (02 "시맨틱 역할" 절)
// boder color는 독립 토큰이 아니라 neutral/primary 사다리를 참조한다(02).
const semantic = {
  text: {
    primary:   { light: neutral[9], dark: neutral[0] }, // 기본 본문·제목
    secondary: { light: neutral[6], dark: neutral[3] }, // 보조·흐림
    danger:    { light: danger[6],  dark: danger[4]  }, // 에러
    disabled:  { light: neutral[4], dark: neutral[6] },
  },
  bg: {
    primary:   { light: '#FFFFFF',  dark: neutral[9] }, // 기본 면
    secondary: { light: neutral[0], dark: neutral[8] }, // 표면(카드 등)
    tertiary:  { light: neutral[1], dark: '#0B0D10'  }, // 페이지 바닥 (카드보다 살짝 어두운 연회색, 잠정)
  },
  border: {
    default: { light: neutral[2], dark: neutral[7] }, // 기본 = neutral 200
    strong:  { light: neutral[3], dark: neutral[6] }, // 강조 = neutral 300
    focus:   { light: primary[6], dark: primary[4] }, // 포커스 = primary 600
  },
} as const;

// 타이포 6단계 {크기·굵기·행간}. body-strong = body 크기 + 굵게(강조). (단일 진실 공급원)
// 모듈 상수로 둬서 createTheme(other)와 resolver가 같은 값을 공유한다.
type TypographyStep =
  | 'display' | 'heading' | 'subheading' | 'body' | 'body-strong' | 'caption';
const typography: Record<TypographyStep, { fontSize: string; fontWeight: number; lineHeight: number }> = {
  display:       { fontSize: '1.75rem',  fontWeight: 700, lineHeight: 1.2 },
  heading:       { fontSize: '1.25rem',  fontWeight: 700, lineHeight: 1.3 },
  subheading:    { fontSize: '1rem',     fontWeight: 600, lineHeight: 1.4 },
  body:          { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  'body-strong': { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
  caption:       { fontSize: '0.75rem',  fontWeight: 400, lineHeight: 1.4 },
};

const borderWidth = '1px';            // 보더 굵기 1종
const iconBaselineShift = '-0.125em'; // 아이콘 광학정렬 보정(폰트 크기 비례 토큰, 1/8 룰)

// 모서리 곡률(애플식 squircle). corner-shape: superellipse(2)=squircle.
// radius 스케일(sm/md/full)·값은 안 건드리고, 그 위에 *연속 곡률*만 얹는 단일 토큰.
// border·box-shadow·outline·overflow가 이 모양을 네이티브로 따라간다(충돌 없음).
// 미지원 브라우저(Safari/Firefox)는 무시 → 평범한 둥근 모서리로 graceful fallback.
// 값은 화면 검증에서 조정(더 부드럽게=superellipse(1.8) 등). 컴포넌트엔 prop으로 안 연다(헌법 5).
const cornerShape = 'superellipse(2)';

// ─────────────────────────────────────────────────────────────
export const theme = createTheme({
  white: '#FFFFFF',
  black: neutral[9],

  colors: { primary, neutral, success, warning, danger, info },
  primaryColor: 'primary',
  primaryShade: 6, // index 6 = #1E4178 (메인 navy)

  fontFamily: '"Pretendard GOV Variable", "Pretendard GOV", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  // 간격: 4px 베이스 (xxs4·xs8·sm12·md16·lg24·xl32·xxl48). 임의 px 금지.
  spacing: {
    xxs: '0.25rem', xs: '0.5rem', sm: '0.75rem', md: '1rem',
    lg: '1.5rem', xl: '2rem', xxl: '3rem',
  },

  // Mantine 호환용 크기 칸(단일 진실 공급원은 other.typography).
  fontSizes: {
    xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem', xl: '1.75rem',
  },

  radius: { sm: '8px', md: '16px', full: '9999px' }, // md 키움(squircle 곡률이 보이려면 큰 반경 필요 — 8px는 안 드러남)
  defaultRadius: 'sm',

  // 그림자: none은 "안 줌"이라 키 없음. sm(카드)·md(모달)만.
  shadows: {
    sm: '0 1px 2px rgba(11, 26, 53, 0.12)',
    md: '0 4px 12px rgba(11, 26, 53, 0.16)',
  },

  // ── theme.other: 단일 진실 공급원의 자유 공간 (위 모듈 상수를 그대로 싣는다) ──
  other: {
    typography,
    semantic,
    borderWidth,
    iconBaselineShift,
    cornerShape,
  },
});

// ─────────────────────────────────────────────────────────────
// 시맨틱 역할 → CSS 변수. 모드 분기는 여기서 일어난다.
// 컴포넌트는 var(--text-primary) 등 "역할 이름"만 쓰고 라이트/다크를 모른다.
// (Providers의 MantineProvider에 주입)
// ─────────────────────────────────────────────────────────────
// 모듈 상수(typography·semantic·borderWidth·iconBaselineShift)를 직접 읽는다.
// t.other를 거치지 않으므로 mantine.d.ts의 module augmentation에 의존하지 않는다.
// → 패키지 자기 tsc와 소비자 next build(augmentation 미적용) 가 동일하게 통과한다.
//   (resolver는 어차피 이 테마 전용이라, 같은 상수를 직접 쓰는 게 단일 진실 공급원에도 맞다)
export const cssVariablesResolver: CSSVariablesResolver = () => {
  const s = semantic;

  // 타이포 6단계도 같은 통로(CSS 변수)로 흘려보낸다.
  // → Text/Title/Label 원자는 var(--typo-body-size) 식 역할 이름만 부르고
  //   실제 크기·굵기·행간(typography)은 모른다. (색과 동일 구조)
  const typoVars: Record<string, string> = {};
  for (const [step, spec] of Object.entries(typography)) {
    typoVars[`--typo-${step}-size`]   = spec.fontSize;
    typoVars[`--typo-${step}-weight`] = String(spec.fontWeight);
    typoVars[`--typo-${step}-lh`]     = String(spec.lineHeight);
  }

  const pick = (mode: 'light' | 'dark') => ({
    '--text-primary':   s.text.primary[mode],
    '--text-secondary': s.text.secondary[mode],
    '--text-danger':    s.text.danger[mode],
    '--text-disabled':  s.text.disabled[mode],
    '--bg-primary':     s.bg.primary[mode],
    '--bg-secondary':   s.bg.secondary[mode],
    '--bg-tertiary':    s.bg.tertiary[mode],
    '--border-default': s.border.default[mode],
    '--border-strong':  s.border.strong[mode],
    '--border-focus':   s.border.focus[mode],
  });
  return {
    variables: {
      '--border-width':        borderWidth,
      '--icon-baseline-shift': iconBaselineShift,
      '--corner-shape':        cornerShape,
      ...typoVars,
    },
    light: pick('light'),
    dark: pick('dark'),
  };
};
