'use client';
// notify (피드백 시스템 — 부품이 아니라 명령형 트리거). 휘발 토스트(우상단, 잠깐 떴다 사라짐).
//  · 경계: 토스트는 "서버/작업 레벨 결과"(저장됨·삭제 실패 등)만. 필드 검증은 인라인 FormField 몫(토스트로 안 띄움).
//  · 닫힘: tone(역할 enum) + 메시지 string. 위치·지속시간·애니메이션은 시스템 고정(Providers의 <Notifications/>).
//  · 격리: @mantine/notifications import는 여기(src/ui)에만. 바깥은 notify.*만 호출(헌법 7).
import { notifications } from '@mantine/notifications';
import { Icon, type IconName } from './Icon';

type Tone = 'success' | 'danger' | 'warning' | 'info';
type Payload = string | { title?: string; message: string };

// tone → (의미색 스케일 키, 아이콘). 색은 Mantine color 토큰만.
const MAP: Record<Tone, { key: string; icon: IconName }> = {
  success: { key: 'success', icon: 'check' },
  danger:  { key: 'danger',  icon: 'alert-circle' },
  warning: { key: 'warning', icon: 'alert-triangle' },
  info:    { key: 'info',    icon: 'info' },
};

const AUTO_CLOSE = 4000; // 지속시간 고정(잠정 — 화면 검증 후 토큰화 가능)

function normalize(p: Payload): { title?: string; message: string } {
  return typeof p === 'string' ? { message: p } : p;
}

function show(tone: Tone, p: Payload) {
  const m = MAP[tone];
  const { title, message } = normalize(p);
  notifications.show({
    title,
    message,
    color: m.key,
    autoClose: AUTO_CLOSE,
    withBorder: true,
    radius: 'md',
    icon: <Icon name={m.icon} size="sm" />,
  });
}

export const notify = {
  success: (p: Payload) => show('success', p),
  danger: (p: Payload) => show('danger', p),
  warning: (p: Payload) => show('warning', p),
  info: (p: Payload) => show('info', p),
};
