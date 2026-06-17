// Radio 원자 — 단일 선택 그룹. options의 label이 인라인 라벨, 그룹 필드 라벨은 FormField.
// 배열 방향은 배치 프리미티브의 일(경로 둘 방지) → 여기선 기본 세로.
import { Radio as M, Stack } from '@mantine/core';
type Option = { label: string; value: string };
type Props = {
  options: Option[]; value: string; onChange: (value: string) => void;
  disabled?: boolean; name?: string;
};
export function Radio({ options, value, onChange, disabled, name }: Props) {
  return (
    <M.Group value={value} onChange={onChange} name={name}>
      {/* 다중 행: 행 간격 md로 띄워 44px 터치 타깃이 인접 행과 과하게 겹치지 않게(밀집 라디오 고려). */}
      <Stack gap="md">
        {options.map((o) => (
          <M key={o.value} value={o.value} label={o.label} disabled={disabled} color="primary"
            classNames={{ radio: 'erpHitTarget' }} />
        ))}
      </Stack>
    </M.Group>
  );
}
