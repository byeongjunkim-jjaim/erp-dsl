// Timeline (유기체) — 시간순 누적 이벤트를 [시각·작성자·구분·내용]으로 그린다.
//  · 이벤트 shape를 닫힌 스키마로 받음(DataTable=columns, DescriptionList=items와 동형). 도메인 무지(헌법 1).
//  · 역할 라벨·색·구분(category)은 데이터가 정함. 내부 고정: timestamp 오름차순 정렬 + 날짜 구분 + 말풍선 카드.
//  · DataTable(동종 다수행 표)과 결과물이 달라 경쟁 경로 아님(이쪽은 시간 그룹 + 아바타 + 말풍선).
//
//  ⚠️ 스펙↔부품 정합 보정 2건:
//   ① 날짜 구분은 Divider(label=…)이 아니라 가운데 Text(caption). 우리 Divider는 orientation만 노출(닫힘).
//   ② actor 색(tone)은 받지 않는다. Avatar 원자가 색을 primary로 고정(닫힘)하므로 닫힌 경계로 못 칠한다.
//      per-actor 색이 필요하면 Avatar에 tone 경계를 여는 별도 결정(rule of three).
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import type { BadgeColor } from './_cells';
import type { IconName } from './Icon';
import dayjs from 'dayjs';

type TimelineEvent = {
  id: string;
  timestamp: string;                                  // ISO. 날짜 구분은 내부 파생
  actor: { name: string };                            // Avatar 이니셜(name 첫 글자). 색은 Avatar 고정(주석 ② 참조)
  category?: { label: string; tone: BadgeColor };     // 구분 배지(doc_type 등) — 선택
  title?: string;
  body?: string;
};

type TimelineProps = {
  events: TimelineEvent[];
  emptyState?: { icon?: IconName; title: string; description?: string };
};

// 시간 포맷(잠정 KR — 다국어화 시 locale 분리). dayjs 전역 locale을 건드리지 않으려 수동 포맷.
function fmtTime(ts: string): string {
  const d = dayjs(ts);
  if (!d.isValid()) return '';
  const h = d.hour();
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}:${String(d.minute()).padStart(2, '0')}`;
}
function fmtDateLabel(ts: string): string {
  const d = dayjs(ts);
  return d.isValid() ? `${d.year()}년 ${d.month() + 1}월 ${d.date()}일` : ts;
}
function dateKey(ts: string): string {
  const d = dayjs(ts);
  return d.isValid() ? d.format('YYYY-MM-DD') : ts;
}

// timestamp 오름차순 정렬 후 날짜별 그룹(순서 보존).
function groupByDate(events: TimelineEvent[]): Array<{ key: string; label: string; items: TimelineEvent[] }> {
  const sorted = [...events].sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
  const out: Array<{ key: string; label: string; items: TimelineEvent[] }> = [];
  for (const ev of sorted) {
    const key = dateKey(ev.timestamp);
    const last = out[out.length - 1];
    if (last && last.key === key) last.items.push(ev);
    else out.push({ key, label: fmtDateLabel(ev.timestamp), items: [ev] });
  }
  return out;
}

export function Timeline({ events, emptyState }: TimelineProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={emptyState?.icon ?? 'history'}
        title={emptyState?.title ?? '기록 없음'}
        description={emptyState?.description}
      />
    );
  }

  const groups = groupByDate(events);
  return (
    <Stack gap="lg">
      {groups.map((g) => (
        <Stack gap="md" key={g.key}>
          {/* 날짜 구분 — 가운데 caption(라벨-라인 Divider 대체, 주석 ① 참조) */}
          <Group justify="center" align="center">
            <Text variant="caption" color="secondary">{g.label}</Text>
          </Group>
          {g.items.map((ev) => (
            <Group key={ev.id} gap="sm" align="start" wrap={false}>
              <Avatar size="md">{ev.actor.name.slice(0, 1)}</Avatar>
              <Stack gap="xxs">
                {/* 헤더줄: 작성자 + 구분배지 + 시각 */}
                <Group gap="xs" align="center">
                  <Text variant="body-strong">{ev.actor.name}</Text>
                  {ev.category && <Badge color={ev.category.tone}>{ev.category.label}</Badge>}
                  <Text variant="caption" color="secondary">{fmtTime(ev.timestamp)}</Text>
                </Group>
                {/* 말풍선 — title·body 둘 다 없으면 생략(헤더줄만) */}
                {(ev.title || ev.body) && (
                  <Card variant="outlined" padding="sm">
                    <Stack gap="xxs">
                      {ev.title && <Text variant="body-strong">{ev.title}</Text>}
                      {ev.body && <Text variant="body">{ev.body}</Text>}
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Group>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
