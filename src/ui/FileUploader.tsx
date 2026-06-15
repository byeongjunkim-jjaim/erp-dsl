'use client';
// FileUploader 분자 — controlled(value + onChange 하나). 횡단규칙 2와 동형:
//  · value(부모가 줌)를 받아 4단계 상태를 표현한다.
//  · 선택/제거/재시도 → "목록이 이렇게 바뀌었으면 함"(next)을 통째로 신호만 쏜다.
//    그 신호로 무엇이 일어나는지(실제 업로드)는 모른다 — 렌더러의 일.
//  · 브라우저 File → FileItem(id·status:'pending') 부여는 분자의 일(표현 단위라서).
// status 4 enum: pending=점선/대기 · uploading=진행바 · done=체크 · error=빨강+재시도.
// 검증(용량·확장자)은 스키마 → 위반 시 status='error'. 단일/다중은 multiple로 흡수.
import { useRef } from 'react';
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { Icon } from './Icon';
import { Button } from './Button';
import { Progress } from '@mantine/core';

export type FileItem = {
  id: string;
  name: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress?: number; // 0~100
  error?: string;
};

type Props = {
  value: FileItem[];
  onChange: (next: FileItem[]) => void; // 다음 목록을 통째로 신호 (controlled)
  multiple?: boolean;
  disabled?: boolean;
  name?: string;
};

// 브라우저 File → FileItem(pending) 부여는 분자의 책임.
function toItems(files: FileList): FileItem[] {
  return Array.from(files).map((f) => ({
    id: `${f.name}-${f.size}-${f.lastModified}`,
    name: f.name,
    status: 'pending' as const,
  }));
}

export function FileUploader({ value, onChange, multiple, disabled, name }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (files: FileList | null) => {
    if (!files || !files.length) return;
    const picked = toItems(files);
    const merged = multiple ? [...value, ...picked] : picked.slice(0, 1);
    onChange(merged);
  };
  const remove = (id: string) => onChange(value.filter((f) => f.id !== id));
  const retry = (id: string) =>
    onChange(value.map((f) => (f.id === id ? { ...f, status: 'pending', error: undefined } : f)));

  return (
    <Stack gap="xs">
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (!disabled) add(e.dataTransfer.files); }}
        style={{
          border: 'var(--border-width) dashed var(--border-default)',
          borderRadius: 'var(--mantine-radius-md)',
          padding: 'var(--mantine-spacing-lg)',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Group gap="xs" align="center" justify="center">
          <Icon name="upload" color="secondary" />
          <Text variant="body" color="secondary">파일을 끌어다 놓거나 클릭해 선택</Text>
        </Group>
        <input
          ref={inputRef}
          type="file"
          name={name}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => add(e.currentTarget.files)}
          style={{ display: 'none' }}
        />
      </div>

      {value.map((f) => (
        <Group key={f.id} gap="sm" align="center" justify="between">
          <Group gap="xs" align="center">
            {f.status === 'done' && <Icon name="check" color="primary" size="sm" />}
            {f.status === 'error' && <Icon name="alert-circle" color="danger" size="sm" />}
            <Text variant="body" color={f.status === 'error' ? 'danger' : 'primary'}>{f.name}</Text>
          </Group>
          <Group gap="xs" align="center">
            {f.status === 'uploading' && (
              <div style={{ width: 120 }}><Progress value={f.progress ?? 0} color="primary" size="sm" /></div>
            )}
            {f.status === 'error' && (
              <Button variant="ghost" size="sm" leftIcon={<Icon name="refresh" size="sm" />} onClick={() => retry(f.id)}>
                재시도
              </Button>
            )}
            <span role="button" aria-label="제거" onClick={() => !disabled && remove(f.id)}
              style={{ display: 'inline-flex', cursor: disabled ? 'not-allowed' : 'pointer' }}>
              <Icon name="x" color="secondary" size="sm" />
            </span>
          </Group>
        </Group>
      ))}
    </Stack>
  );
}
