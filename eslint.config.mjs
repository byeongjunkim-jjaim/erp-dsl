import tseslint from 'typescript-eslint';

// ─────────────────────────────────────────────────────────────
// 강제의 3층 중 "그물 2"(린트). 본 DSL의 일부 — 어느 레포에 올라가든 따라가는 헌법.
//  문 1: Mantine 직접 import 금지 (격리 구역 src/ui/** 만 예외)        — 헌법 7
//  문 2: hex 리터럴 직접 사용 금지 (theme.ts 파일 "하나"만 예외)        — 헌법 3·8
//
// ⚠️ files:['**/*.ts','**/*.tsx'] 명시 필수. 안 하면 flat config가 .ts/.tsx를
//    아예 안 훑어서 "에러 0"으로 거짓 통과한다. (02 §9-1)
// ─────────────────────────────────────────────────────────────

export default tseslint.config(
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },

  // 본체: 두 문을 모든 .ts/.tsx에 건다.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // 문 1
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@mantine/*'],
          message: 'Mantine 직접 import 금지 — @/ui 배럴만 사용 (헌법 7).',
        }],
      }],
      // 문 2 — hex 색 리터럴 차단
      'no-restricted-syntax': ['error', {
        selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3,4}){1,2}$/]',
        message: 'hex 리터럴 금지 — 색은 theme.ts 토큰만 (헌법 3·8).',
      }],
    },
  },

  // 예외 1: 격리 구역 전체는 Mantine 직접 import 허용 (폴더 단위 — 헌법 7·8)
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },

  // 예외 2: hex는 theme.ts "파일 하나"만 허용 (폴더 아님 — 헌법 8)
  {
    files: ['src/ui/theme.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
);
