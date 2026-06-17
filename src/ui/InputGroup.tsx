// InputGroup 분자 — 입력칸 양 끝에 비대화형 어드온(단위·아이콘). 방식 A(children).
// 입력군에서 닫았던 어댄먼트(raw 구멍)를 분자에선 string|<Icon>로 좁혀 연다.
import type { ReactNode, ReactElement } from 'react';
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
  // [addon | input | addon]을 하나의 테두리로 합친다(controls.css). 내부 입력칸의 자체 테두리는 후손 선택자로 제거.
  return (
    <div className="erpInputGroup">
      {leftAddon !== undefined && <div className="erpAddon erpAddonLeft">{renderAddon(leftAddon)}</div>}
      <div className="erpInputGroupField">{children}</div>
      {rightAddon !== undefined && <div className="erpAddon erpAddonRight">{renderAddon(rightAddon)}</div>}
    </div>
  );
}
