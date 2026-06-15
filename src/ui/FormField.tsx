// FormField 분자 — 입력 원자에서 벗긴 장식·에러의 수령자. 방식 A(컨트롤을 children으로).
// 에러 메커니즘: 사용자는 error 메시지 하나만 준다 → "메시지 있음=에러"로 1회 판정.
//  · 메시지는 FormField가 직접 그린다(맨 아래, caption+danger).
//  · 빨간 테두리는 입력칸이 그리되, 입력칸은 자기가 에러인지 모른다.
//    FormField가 에러일 때 자식 영역에 --field-border=danger를 깐다(역할 변수 통로).
import type { ReactNode, CSSProperties } from 'react';
import { Stack } from './Stack';
import { Label } from './Label';
import { Text } from './Text';

type FormFieldProps = {
  label?: string;
  withAsterisk?: boolean;       // 별표 표시만 (필수 검증은 스키마)
  error?: string;              // 메시지. 있으면 에러 상태로 판정
  children: ReactNode;         // 입력 컨트롤(원자)
};

export function FormField({ label, withAsterisk, error, children }: FormFieldProps) {
  const hasError = Boolean(error);
  // 에러일 때만 자식 영역에 --field-border를 danger 토큰으로 덮는다.
  const fieldArea: CSSProperties | undefined = hasError
    ? ({ ['--field-border']: 'var(--text-danger)' } as CSSProperties)
    : undefined;

  return (
    <Stack gap="xs">
      <Stack gap="xxs">
        {label && (
          <Label>
            {label}
            {withAsterisk && <span style={{ color: 'var(--text-danger)' }}> *</span>}
          </Label>
        )}
        <div style={fieldArea}>{children}</div>
      </Stack>
      {hasError && <Text variant="caption" color="danger">{error}</Text>}
    </Stack>
  );
}
