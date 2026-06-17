'use client';
// Menu (분자) — Popover + Action[] 리스트(+선택적 header). 클릭 시 열리는 액션 메뉴.
//  · rule of three로 추출: AppShell 프로필·알림(슬롯) + Tree 노드 ⋯ 메뉴. Popover 토글은 분자가 내부 소유.
//  · 항목은 Action(label·icon?·variant?·onClick). 클릭 시 메뉴 닫고 onClick 실행. danger는 빨강.
//  · content 슬롯 우회는 Popover와 동일(부품만 조립 인지 + hex 린트). 닫힌 trigger/items만 노출.
import { useState, type ReactNode } from 'react';
import { Popover } from './Popover';
import { Stack } from './Stack';
import { Divider } from './Divider';
import { Text } from './Text';
import { Icon } from './Icon';
import type { Action } from './_cells';

type Props = {
  trigger: ReactNode;                          // 보통 IconButton(dots-vertical) 등
  items: Action[];
  header?: ReactNode;                          // 선택: 메뉴 상단 신원/제목 블록(있으면 구분선 자동)
  width?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export function Menu({ trigger, items, header, width = 'sm', position = 'bottom' }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      opened={open}
      onChange={setOpen}
      width={width}
      position={position}
      content={
        <Stack gap="xxs">
          {header && (<>{header}<Divider /></>)}
          {items.map((a, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              className="erpMenuItem"
              onClick={() => { setOpen(false); a.onClick(); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(false); a.onClick(); } }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--mantine-spacing-xs)', padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}
            >
              {a.icon && <Icon name={a.icon} size="sm" color={a.variant === 'danger' ? 'danger' : 'secondary'} />}
              <Text variant="body" color={a.variant === 'danger' ? 'danger' : 'primary'}>{a.label}</Text>
            </div>
          ))}
        </Stack>
      }
    >
      {trigger}
    </Popover>
  );
}
