import {
  type DefaultMantineColor,
  type MantineColorsTuple,
} from '@mantine/core';

// ─────────────────────────────────────────────────────────────
// 지도(자동완성 힌트)일 뿐 그물이 아니다. (헌법 6, 01 강제 3층)
// Mantine size 타입은 전부 `| (string & {})`로 끝나 임의 문자열이 통과한다.
// 즉 여기 추가한 키(full/xxs/xxl)는 자동완성에만 뜨고 차단은 래퍼+린트가 한다.
// tsconfig include에 잡혀야 적용된다.
// ─────────────────────────────────────────────────────────────

type CustomColors =
  | 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  | DefaultMantineColor;

type TypographyStep =
  | 'display' | 'heading' | 'subheading' | 'body' | 'body-strong' | 'caption';

type SemanticPair = { light: string; dark: string };

declare module '@mantine/core' {
  // color="primary" 등에서 우리 색 역할 이름을 타입으로 인식
  export interface MantineThemeColorsOverride {
    colors: Record<CustomColors, MantineColorsTuple>;
  }

  // theme.other 자유 공간의 타입 (단일 진실 공급원)
  export interface MantineThemeOther {
    typography: Record<
      TypographyStep,
      { fontSize: string; fontWeight: number; lineHeight: number }
    >;
    semantic: {
      text: Record<'primary' | 'secondary' | 'danger' | 'disabled', SemanticPair>;
      bg: Record<'primary' | 'secondary' | 'tertiary', SemanticPair>;
      border: Record<'default' | 'strong' | 'focus', SemanticPair>;
    };
    borderWidth: string;
    iconBaselineShift: string;
    cornerShape: string;
  }

  // spacing에 추가한 xxs/xxl, radius에 추가한 full 키 인식
  export interface MantineThemeSizesOverride {
    spacing: {
      xxs: string; xs: string; sm: string; md: string;
      lg: string; xl: string; xxl: string;
    };
    radius: {
      sm: string; md: string; full: string;
    };
  }
}
