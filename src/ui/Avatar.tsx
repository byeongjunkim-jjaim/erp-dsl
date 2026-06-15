// Avatar 원자 — 이미지 또는 이니셜 폴백. 모양 고정(원형).
import { Avatar as MantineAvatar } from '@mantine/core';

type AvatarProps = { src?: string; size?: 'sm' | 'md' | 'lg'; children?: string };

export function Avatar({ src, size = 'md', children }: AvatarProps) {
  return <MantineAvatar src={src ?? null} size={size} radius="full" color="primary">{children}</MantineAvatar>;
}
