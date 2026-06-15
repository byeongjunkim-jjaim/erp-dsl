// Anchor 원자 — 이동 의미. 색+밑줄 링크 스타일 고정.
import { Anchor as MantineAnchor } from '@mantine/core';
import type { ReactNode } from 'react';

type AnchorProps = {
  href: string;
  children: ReactNode;
};

export function Anchor({ href, children }: AnchorProps) {
  return (
    <MantineAnchor href={href} c="primary" underline="always" fz="var(--typo-body-size)">
      {children}
    </MantineAnchor>
  );
}
