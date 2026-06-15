// InputGroup 분자 — 입력칸 양 끝에 비대화형 어드온(단위·아이콘). 방식 A(children).
// 입력군에서 닫았던 어댄먼트(raw 구멍)를 분자에선 string|<Icon>로 좁혀 연다.
import type { ReactNode, ReactElement } from 'react';
import { Group } from './Group';
import { Text } from './Text';

type Addon = string | ReactElement; // 텍스트(₩·원·kg) 또는 Icon 원자만 — raw 노드 금지
type Props = {
  leftAddon?: Addon;
  rightAddon?: Addon;
  children: ReactNode; // 입력 원자
};

function renderAddon(a: Addon) {
  return typeof a === 'string' ? <Text variant="body" color="secondary">{a}</Text> : a;
}

export function InputGroup({ leftAddon, rightAddon, children }: Props) {
  // 테두리 합치기·정확한 gap은 분자 모아보기에서 시각 확정(보류). 구조(Group align=center)만 확정.
  return (
    <Group gap="xs" align="center">
      {leftAddon !== undefined && renderAddon(leftAddon)}
      {children}
      {rightAddon !== undefined && renderAddon(rightAddon)}
    </Group>
  );
}
