'use client';
// Popover 원자 — 클릭하면 떠오르는 플로팅 패널. Tooltip(hover·텍스트)의 형제이나
//  trigger가 클릭이고 content가 슬롯(부품)이라는 점이 다르다.
//  · content는 raw ReactNode 슬롯 — Modal children과 동형(방식 A: Popover는 안이 뭔지 모름).
//    안의 스타일 우회는 인지(부품만 조립)로 막고 hex는 eslint가 차단(강제 3층).
//  · position은 닫힌 enum(top/bottom/left/right, 기본 bottom). auto 제외 — "명시 top"과
//    "auto가 고른 top"이 경쟁 경로라서. 화면 끝 자동 뒤집기(flip)는 position과 별개 동작이라 상시 ON.
//  · width는 sm/md/lg 토큰(Container 동형, px는 내부 매핑·잠정값). 그림자·radius·화살표 고정.
//  · controlled(opened/onChange) 전용 — 상태 주인은 하나(횡단규칙 2와 동형).
import { Popover as M } from '@mantine/core';
import type { ReactNode } from 'react';

type Position = 'top' | 'bottom' | 'left' | 'right';
type Width = 'sm' | 'md' | 'lg';

type PopoverProps = {
  children: ReactNode;          // trigger(감쌀 대상)
  content: ReactNode;           // 떠오르는 패널 내용(@/ui 부품 — raw 슬롯, Modal children 동형)
  opened: boolean;              // controlled
  onChange: (opened: boolean) => void;
  position?: Position;          // 기본 bottom
  width?: Width;                // 기본 md
};

// width 토큰 → px(잠정값, 화면 검증에서 조정). Container SIZE와 같은 구조.
const WIDTH_PX: Record<Width, number> = { sm: 200, md: 280, lg: 360 };

export function Popover({
  children, content, opened, onChange, position = 'bottom', width = 'md',
}: PopoverProps) {
  return (
    <M
      opened={opened}
      onChange={onChange}
      position={position}
      width={WIDTH_PX[width]}
      withArrow
      shadow="md"
      radius="md"
      withinPortal
    >
      <M.Target>
        {/* Target은 ref 가능한 단일 자식이 필요 → span으로 감싼다.
            controlled 모드에선 우리가 클릭으로 직접 토글한다(onChange). 바깥 클릭/ESC 닫기는
            Mantine이 onChange(false)로 알린다. */}
        <span
          role="button"
          onClick={() => onChange(!opened)}
          style={{ display: 'inline-flex', cursor: 'pointer' }}
        >
          {children}
        </span>
      </M.Target>
      <M.Dropdown p="md">{content}</M.Dropdown>
    </M>
  );
}
