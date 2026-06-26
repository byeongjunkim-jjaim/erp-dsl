'use client';
// CalendarPage (템플릿) — "자원×시간" 스케줄 화면 골격. 도메인 0줄(헌법 1).
//  · 주력 = 리소스 타임라인(행=기준축, x=일, spanning 바). 범위 1주(기본)/2주, 더 줌아웃=월 그리드.
//  · 데이터/표현 분리: CalendarEvent.attrs=임의 차원(부품은 의미 0지식) · CalendarEncoding=attr→채널 매핑.
//  · 채널: 앵커 attr→색(6팔레트)+아이콘 / 상태 attr→채움(확정 진함)·점선+흐림(요청) / 사람 attr→아바타(타임라인 행축).
//  · 색은 theme.ts 6역할 팔레트만(헌법 8) · 7열/일 트랙은 raw CSS grid 명시 예외(calendarpage.css).
//  · 공휴일·주말: 부품은 로케일 무지 — 주말은 자체 표시(토=파랑/일=빨강 텍스트), 공휴일은 holidays 주입받아 표시.
//  · 범례=필터(분류·상태 토글) · 투데이 라인(간트 관행) · "오늘" 버튼은 뷰가 오늘 포함 시 비활성·벗어나면 방향.
import { useState, type ReactNode, type CSSProperties } from 'react';
import dayjs from 'dayjs';
import { PageHeader } from './PageHeader';
import { SegmentedControl } from './SegmentedControl';
import { IconButton } from './IconButton';
import { Button } from './Button';
import { Drawer } from './Drawer';
import { EmptyState } from './EmptyState';
import { Stack } from './Stack';
import { Group } from './Group';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';
import './calendarpage.css';

export type CalendarColorRole = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type CalendarEvent = {
  id: string;
  start: string;            // ISO 'YYYY-MM-DD'
  end?: string;             // ISO inclusive; 미지정 = start
  label: string;
  attrs?: Record<string, string>;  // 임의 차원 — 부품은 의미를 모른다
};
export type CalendarHoliday = { date: string; name: string };  // 로케일 데이터(주입) — 부품은 달력을 모른다
// ⚑ 적층 가이드: anchor.values / status.values의 *정의 순서* = 바 적층 중요도(위→아래).
//   소비처가 values를 나열한 순서로 적층이 결정된다(분류 우선 → 상태 차선 → 시작일). 순서를 바꾸면 적층도 바뀜.
export type CalendarEncoding = {
  anchor: { attr: string; values: Record<string, { color: CalendarColorRole; icon?: IconName; label: string }> };
  status?: { attr: string; values: Record<string, { emphasis: 'solid' | 'dashed'; label: string }> };
  person?: { attr: string; values: Record<string, { initial: string; label: string; color?: CalendarColorRole }> };
  rowAxes?: { attr: string; label: string }[];
};
type Props = {
  title: string;
  description?: string;
  events: CalendarEvent[];
  encoding: CalendarEncoding;
  holidays?: CalendarHoliday[];
  createLabel?: string;
  onCreate?: () => void;
  onSelectEvent?: (e: CalendarEvent) => void;
  renderEventDetail?: (e: CalendarEvent) => ReactNode;
  rowMiniBar?: boolean;   // 행 헤더 분류-구성 미니막대 노출(기본 true) — 소비처 결정
};

type Range = 'week' | 'biweek' | 'month';
const NAME_COL = 150;
const monStart = (d: dayjs.Dayjs) => d.subtract((d.day() + 6) % 7, 'day');
const weekOfMonth = (mon: dayjs.Dayjs) => { const th = mon.add(3, 'day'); return { m: th.month() + 1, w: Math.floor((th.date() - 1) / 7) + 1 }; };
const cvar = (role: CalendarColorRole, s: number) => `var(--mantine-color-${role}-${s})`;
function barCss(role: CalendarColorRole, emphasis: 'solid' | 'dashed'): CSSProperties {
  return emphasis === 'dashed'
    ? { background: cvar(role, 0), border: `1.4px dashed ${cvar(role, 5)}`, color: cvar(role, 6), opacity: 0.7 }  // 요청: 흐리고 점선 — 물러남
    : { background: cvar(role, 2), borderLeft: `3px solid ${cvar(role, 6)}`, color: cvar(role, 7) };               // 확정: 진한 채움 — 명확
}
// 레인 적층 순서 = 중요도: 분류 순서 → 상태 순서 → 시작일. (인코딩 values 정의 순서가 곧 중요도)
function packLanes<T extends { a: number; b: number; ai: number; si: number }>(items: T[]) {
  const lanes: T[][] = []; const out: (T & { lane: number })[] = [];
  for (const it of [...items].sort((x, y) => (x.ai - y.ai) || (x.si - y.si) || (x.a - y.a))) {
    let i = 0; while (lanes[i] && lanes[i].some((r) => !(it.b < r.a || it.a > r.b))) i++;
    (lanes[i] = lanes[i] || []).push(it); out.push({ ...it, lane: i });
  }
  return { out, laneCount: lanes.length };
}

export function CalendarPage({ title, description, events, encoding, holidays, createLabel = '새 일정', onCreate, onSelectEvent, renderEventDetail, rowMiniBar = true }: Props) {
  const [range, setRange] = useState<Range>('week');
  const rowAxisOpts = encoding.rowAxes ?? (encoding.person ? [{ attr: encoding.person.attr, label: '담당' }] : []);
  const [rowAxis, setRowAxis] = useState(rowAxisOpts[0]?.attr ?? encoding.anchor.attr);
  const [anchor, setAnchor] = useState(() => dayjs());
  const [daySel, setDaySel] = useState<string | null>(null);
  const [evSel, setEvSel] = useState<CalendarEvent | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const today = dayjs();

  const holMap = new Map((holidays ?? []).map((h) => [h.date, h.name]));
  const anchorOrder = Object.keys(encoding.anchor.values);
  const statusOrder = encoding.status ? Object.keys(encoding.status.values) : [];
  const aiOf = (e: CalendarEvent) => { const v = e.attrs?.[encoding.anchor.attr]; const i = v ? anchorOrder.indexOf(v) : -1; return i < 0 ? 999 : i; };
  const siOf = (e: CalendarEvent) => { if (!encoding.status) return 0; const v = e.attrs?.[encoding.status.attr]; const i = v ? statusOrder.indexOf(v) : -1; return i < 0 ? 99 : i; };
  const evStart = (e: CalendarEvent) => dayjs(e.start);
  const evEnd = (e: CalendarEvent) => dayjs(e.end ?? e.start);
  const toggle = (k: string) => setHidden((p) => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const isHidden = (e: CalendarEvent) => {
    const av = e.attrs?.[encoding.anchor.attr]; if (av && hidden.has('a:' + av)) return true;
    if (encoding.status) { const sv = e.attrs?.[encoding.status.attr]; if (sv && hidden.has('s:' + sv)) return true; }
    return false;
  };
  const visible = events.filter((e) => !isHidden(e));
  const openDay = (iso: string) => setDaySel(iso);
  const openEvent = (ev: CalendarEvent) => { setEvSel(ev); onSelectEvent?.(ev); };

  // ── 바 ──
  function bar(ev: CalendarEvent, a: number, b: number, lane: number, opts: { contL?: boolean; contR?: boolean; avatar?: boolean }) {
    const av = ev.attrs?.[encoding.anchor.attr]; const aspec = av ? encoding.anchor.values[av] : undefined;
    const role = aspec?.color ?? 'neutral';
    const sv = encoding.status ? ev.attrs?.[encoding.status.attr] : undefined;
    const emphasis = (sv ? encoding.status?.values[sv]?.emphasis : undefined) ?? 'solid';
    const pv = encoding.person ? ev.attrs?.[encoding.person.attr] : undefined; const pspec = pv ? encoding.person?.values[pv] : undefined;
    const cls = ['cal-bar', opts.contL ? 'cont-l' : '', opts.contR ? 'cont-r' : ''].filter(Boolean).join(' ');
    return (
      <div key={ev.id} className={cls}
        style={{ ...barCss(role, emphasis), gridColumn: `${a + 1} / span ${b - a + 1}`, gridRow: lane + 1 }}
        onClick={(e) => { e.stopPropagation(); openEvent(ev); }}>
        {aspec?.icon && <span className="gly"><Icon name={aspec.icon} size="sm" /></span>}
        <span className="ttl">{ev.label}</span>
        {opts.avatar && pspec && <span className="cal-ava" style={pspec.color ? { background: cvar(pspec.color, 6) } : undefined}>{pspec.initial}</span>}
      </div>
    );
  }

  function rowHeaderMain(val: string): ReactNode {
    if (rowAxis === encoding.person?.attr) { const p = encoding.person.values[val]; return <><span className="cal-ava lg" style={p?.color ? { background: cvar(p.color, 6) } : undefined}>{p?.initial ?? val.slice(0, 1)}</span>{p?.label ?? val}</>; }
    if (rowAxis === encoding.anchor.attr) { const a = encoding.anchor.values[val]; return <><span className="cal-sw" style={{ background: cvar(a?.color ?? 'neutral', 6) }} />{a?.icon && <Icon name={a.icon} size="sm" color="secondary" />}{a?.label ?? val}</>; }
    if (rowAxis === encoding.status?.attr) { const s = encoding.status.values[val]; return <>{s?.label ?? val}</>; }
    return <>{val}</>;
  }

  // ── 행 brief (분류 미니 막대 + 상태 카운트) ──
  function rowBrief(rowEvents: CalendarEvent[]): ReactNode {
    const total = rowEvents.length;
    const showAnchor = rowAxis !== encoding.anchor.attr;
    const showStatus = encoding.status && rowAxis !== encoding.status.attr;
    const byAnchor: Record<string, number> = {};
    if (showAnchor) rowEvents.forEach((e) => { const v = e.attrs?.[encoding.anchor.attr]; if (v) byAnchor[v] = (byAnchor[v] || 0) + 1; });
    const statusText = showStatus
      ? Object.entries(encoding.status!.values).map(([v, s]) => `${s.label} ${rowEvents.filter((e) => e.attrs?.[encoding.status!.attr] === v).length}`).join(' · ')
      : '';
    return (
      <div className="cal-brief">
        {rowMiniBar && showAnchor && total > 0 && (
          <div className="cal-mini">
            {Object.entries(byAnchor).map(([v, c]) => <span key={v} style={{ width: `${(c / total) * 100}%`, background: cvar(encoding.anchor.values[v]?.color ?? 'neutral', 6) }} />)}
          </div>
        )}
        <span className="cal-brief-txt">{total}건{statusText && ` · ${statusText}`}</span>
      </div>
    );
  }

  // ── 타임라인 ──
  function timeline() {
    const days = range === 'biweek' ? 14 : 7;
    const winStart = monStart(anchor); const winEnd = winStart.add(days - 1, 'day');
    const cols = `repeat(${days}, minmax(0, 1fr))`; const colTpl = `${NAME_COL}px ${cols}`;
    const known = rowAxis === encoding.anchor.attr ? encoding.anchor.values
      : rowAxis === encoding.status?.attr ? encoding.status.values
      : rowAxis === encoding.person?.attr ? encoding.person.values : null;
    const vals = known ? Object.keys(known) : [...new Set(visible.map((e) => e.attrs?.[rowAxis]).filter(Boolean) as string[])];
    const inWin = (e: CalendarEvent) => !(evEnd(e).isBefore(winStart, 'day') || evStart(e).isAfter(winEnd, 'day'));
    const showAvatar = rowAxis !== encoding.person?.attr;
    const todayIdx = today.diff(winStart, 'day');

    return (
      <div className="cal-tl">
        {todayIdx >= 0 && todayIdx < days && (
          <div className="cal-today-col" style={{ left: `calc(${NAME_COL}px + ${todayIdx} * (100% - ${NAME_COL}px) / ${days})`, width: `calc((100% - ${NAME_COL}px) / ${days})` }} />
        )}
        <div className="cal-tl-head" style={{ gridTemplateColumns: colTpl }}>
          <div className="cal-tl-corner" />
          {Array.from({ length: days }, (_, i) => {
            const d = winStart.add(i, 'day'); const wd = d.day(); const hol = holMap.get(d.format('YYYY-MM-DD'));
            const cls = ['cal-tl-dh', wd === 6 ? 'sat' : '', wd === 0 ? 'sun' : '', hol ? 'hol' : '', d.isSame(today, 'day') ? 'today' : ''].filter(Boolean).join(' ');
            return <div key={i} className={cls} onClick={() => openDay(d.format('YYYY-MM-DD'))}><span className="cal-dh-top"><span className="cal-dnum">{d.date()}</span>{hol && <span className="cal-hol-in">·{hol}</span>}</span><small>{'일월화수목금토'[wd]}</small></div>;
          })}
        </div>
        {vals.map((val) => {
          const rowEvents = visible.filter((e) => e.attrs?.[rowAxis] === val && inWin(e));
          const items = rowEvents.map((e) => ({ a: Math.max(0, evStart(e).diff(winStart, 'day')), b: Math.min(days - 1, evEnd(e).diff(winStart, 'day')), e, ai: aiOf(e), si: siOf(e), contL: evStart(e).isBefore(winStart, 'day'), contR: evEnd(e).isAfter(winEnd, 'day') }));
          const { out, laneCount } = packLanes(items);
          return (
            <div key={val} className="cal-tl-row" style={{ gridTemplateColumns: colTpl }}>
              <div className="cal-tl-name">
                <div className="cal-name-main">{rowHeaderMain(val)}</div>
                {rowBrief(rowEvents)}
              </div>
              <div className="cal-tl-track" style={{ gridTemplateColumns: cols, backgroundSize: `${100 / days}% 100%`, minHeight: Math.max(1, laneCount) * 27 + 8 }}>
                {out.map((it) => bar(it.e, it.a, it.b, it.lane, { contL: it.contL, contR: it.contR, avatar: showAvatar }))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── 월 그리드 ──
  function month() {
    const mStart = anchor.startOf('month'); const gridStart = monStart(mStart);
    const weekdays = [['월'], ['화'], ['수'], ['목'], ['금'], ['토', 'sat'], ['일', 'sun']] as [string, string?][];
    return (
      <div>
        <div className="cal-mh">{weekdays.map(([w, c]) => <div key={w} className={c}>{w}</div>)}</div>
        {Array.from({ length: 6 }, (_, w) => {
          const ws = gridStart.add(w * 7, 'day'); const we = ws.add(6, 'day');
          const segs = visible.filter((e) => !(evEnd(e).isBefore(ws, 'day') || evStart(e).isAfter(we, 'day')))
            .map((e) => ({ a: Math.max(0, evStart(e).diff(ws, 'day')), b: Math.min(6, evEnd(e).diff(ws, 'day')), e, ai: aiOf(e), si: siOf(e), isStart: !evStart(e).isBefore(ws, 'day'), isEnd: !evEnd(e).isAfter(we, 'day') }));
          const { out, laneCount } = packLanes(segs);
          const cellH = Math.max(96, 32 + laneCount * 25);
          return (
            <div key={w} className="cal-wk">
              <div className="cal-days">
                {Array.from({ length: 7 }, (_, c) => {
                  const d = ws.add(c, 'day'); const wd = d.day(); const hol = holMap.get(d.format('YYYY-MM-DD'));
                  const cls = ['cal-cell', d.month() !== mStart.month() ? 'other' : '', wd === 6 ? 'sat' : '', wd === 0 ? 'sun' : '', hol ? 'hol' : '', d.isSame(today, 'day') ? 'today' : ''].filter(Boolean).join(' ');
                  return <div key={c} className={cls} style={{ minHeight: cellH }} onClick={() => openDay(d.format('YYYY-MM-DD'))}><span className="cal-num">{d.date()}</span>{hol && <span className="cal-hol-in">·{hol}</span>}</div>;
                })}
              </div>
              <div className="cal-mbars">
                {out.map((it) => bar(it.e, it.a, it.b, it.lane, { contL: !it.isStart, contR: !it.isEnd, avatar: true }))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── 네비게이션 + "오늘" 관계 ──
  const step = (dir: number) => setAnchor(range === 'month' ? anchor.add(dir, 'month') : anchor.add(dir * (range === 'biweek' ? 14 : 7), 'day'));
  let onToday: boolean; let todayDir: 'left' | 'right' | null = null;
  if (range === 'month') { onToday = anchor.isSame(today, 'month'); if (!onToday) todayDir = today.isBefore(anchor, 'month') ? 'left' : 'right'; }
  else { const s = monStart(anchor); const e = s.add((range === 'biweek' ? 14 : 7) - 1, 'day'); onToday = !today.isBefore(s, 'day') && !today.isAfter(e, 'day'); if (!onToday) todayDir = today.isBefore(s, 'day') ? 'left' : 'right'; }

  const rangeLabel = (() => {
    if (range === 'month') return anchor.format('YYYY년 M월');
    const s = monStart(anchor); const days = range === 'biweek' ? 14 : 7; const e = s.add(days - 1, 'day');
    const dateRange = `${s.format('M/D')}–${e.format('M/D')}`;  // 항상 M/D (단일/겹침 일관)
    if (range === 'week') { const { m, w } = weekOfMonth(s); return `${m}월 ${w}주차 (${dateRange})`; }
    const w1 = weekOfMonth(s); const w2 = weekOfMonth(s.add(7, 'day'));
    const tag = w1.m === w2.m ? `${w1.m}월 ${w1.w}·${w2.w}주차` : `${w1.m}월 ${w1.w}주차·${w2.m}월 ${w2.w}주차`;
    return `${tag} (${dateRange})`;
  })();

  const dayEvents = daySel ? events.filter((e) => !(evEnd(e).isBefore(dayjs(daySel), 'day') || evStart(e).isAfter(dayjs(daySel), 'day'))) : [];

  function dayRow(ev: CalendarEvent) {
    const av = ev.attrs?.[encoding.anchor.attr]; const a = av ? encoding.anchor.values[av] : undefined;
    const sv = encoding.status ? ev.attrs?.[encoding.status.attr] : undefined; const s = sv ? encoding.status?.values[sv] : undefined;
    const pv = encoding.person ? ev.attrs?.[encoding.person.attr] : undefined; const p = pv ? encoding.person?.values[pv] : undefined;
    return (
      <div key={ev.id} onClick={() => openEvent(ev)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mantine-spacing-xs)', padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)', border: 'var(--border-width) solid var(--border-default)', borderRadius: 'var(--mantine-radius-sm)', cursor: 'pointer' }}>
        <span className="cal-sw" style={{ background: cvar(a?.color ?? 'neutral', 6) }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text variant="body">{ev.label}</Text>
          <Text variant="caption" color="secondary">{[a?.label, s?.label, p?.label].filter(Boolean).join(' · ')}</Text>
        </div>
        {p && <span className="cal-ava" style={p.color ? { background: cvar(p.color, 6) } : undefined}>{p.initial}</span>}
      </div>
    );
  }

  function eventDetailDefault(ev: CalendarEvent): ReactNode {
    const av = ev.attrs?.[encoding.anchor.attr]; const a = av ? encoding.anchor.values[av] : undefined;
    const sv = encoding.status ? ev.attrs?.[encoding.status.attr] : undefined; const s = sv ? encoding.status?.values[sv] : undefined;
    const pv = encoding.person ? ev.attrs?.[encoding.person.attr] : undefined; const p = pv ? encoding.person?.values[pv] : undefined;
    const row = (k: string, v: ReactNode) => <Group gap="md" align="start"><div style={{ width: 64, flex: 'none' }}><Text variant="caption" color="secondary">{k}</Text></div><div>{v}</div></Group>;
    const period = ev.end && ev.end !== ev.start ? `${dayjs(ev.start).format('M월 D일')} – ${dayjs(ev.end).format('M월 D일')}` : dayjs(ev.start).format('M월 D일');
    return (
      <Stack gap="sm">
        {row('현장', <Text variant="body">{ev.label}</Text>)}
        {a && row('분류', <Group gap="xs" align="center">{a.icon && <Icon name={a.icon} size="sm" color="secondary" />}<Text variant="body">{a.label}</Text></Group>)}
        {s && row('상태', <Text variant="body">{s.label}</Text>)}
        {p && row('담당', <Group gap="xs" align="center"><span className="cal-ava" style={p.color ? { background: cvar(p.color, 6) } : undefined}>{p.initial}</span><Text variant="body">{p.label}</Text></Group>)}
        {row('기간', <Text variant="body">{period}</Text>)}
      </Stack>
    );
  }

  const rangeOptions = [{ label: '1주', value: 'week' }, { label: '2주', value: 'biweek' }, { label: '월', value: 'month' }];

  return (
    <div className="cal">
      <PageHeader title={title} description={description}
        actions={onCreate ? [{ label: createLabel, variant: 'primary', icon: 'plus', onClick: onCreate }] : undefined} />
      <div className="cal-card">
        <div className="cal-toolbar">
          <SegmentedControl options={rangeOptions} value={range} onChange={(v) => setRange(v as Range)} size="sm" />
          <span className="cal-nav">
            <IconButton icon="chevron-left" label="이전" variant="ghost" size="sm" onClick={() => step(-1)} />
            <span className="cal-rlabel">{rangeLabel}</span>
            <IconButton icon="chevron-right" label="다음" variant="ghost" size="sm" onClick={() => step(1)} />
          </span>
          <Button variant={onToday ? 'ghost' : 'secondary'} size="sm" disabled={onToday}
            leftIcon={todayDir === 'left' ? <Icon name="chevron-left" size="sm" /> : undefined}
            rightIcon={todayDir === 'right' ? <Icon name="chevron-right" size="sm" /> : undefined}
            onClick={() => setAnchor(today)}>오늘</Button>
          <span className="cal-spacer" />
          {range !== 'month' && rowAxisOpts.length > 1 && (
            <Group gap="xs" align="center">
              <Text variant="caption" color="secondary">행 기준</Text>
              <SegmentedControl options={rowAxisOpts.map((o) => ({ label: o.label, value: o.attr }))} value={rowAxis} onChange={setRowAxis} size="sm" />
            </Group>
          )}
        </div>

        <div className="cal-legend">
          <span className="lab">분류</span>
          <span className="set">
            {Object.entries(encoding.anchor.values).map(([val, a]) => (
              <button key={val} className={`cal-chip ${hidden.has('a:' + val) ? 'off' : ''}`} onClick={() => toggle('a:' + val)}>
                <span className="cal-sw" style={{ background: cvar(a.color, 6) }} />{a.icon && <Icon name={a.icon} size="sm" color="secondary" />}{a.label}
              </button>
            ))}
          </span>
          {encoding.status && (<>
            <span className="sep" />
            <span className="lab">상태</span>
            <span className="set">
              {Object.entries(encoding.status.values).map(([val, s]) => (
                <button key={val} className={`cal-chip ${hidden.has('s:' + val) ? 'off' : ''}`} onClick={() => toggle('s:' + val)}>
                  <span style={{ ...barCss('neutral', s.emphasis), width: '1.5em', height: '0.9em', borderRadius: 'var(--mantine-radius-xs)', flex: 'none' }} />{s.label}
                </button>
              ))}
            </span>
          </>)}
        </div>

        {range === 'month' ? month() : timeline()}
      </div>

      <Drawer opened={daySel != null} onClose={() => setDaySel(null)}
        title={daySel ? `${dayjs(daySel).format('M월 D일')} (${'일월화수목금토'[dayjs(daySel).day()]})${holMap.get(daySel) ? ' · ' + holMap.get(daySel) : ''}` : ''}
        actions={onCreate ? [{ label: createLabel, variant: 'primary', icon: 'plus', onClick: onCreate }] : undefined}>
        {dayEvents.length === 0
          ? <EmptyState icon="calendar" title="이 날의 일정이 없습니다" />
          : <Stack gap="xs"><Text variant="caption" color="secondary">{dayEvents.length}건</Text>{dayEvents.map(dayRow)}</Stack>}
      </Drawer>

      <Drawer opened={evSel != null} onClose={() => setEvSel(null)} title="상세"
        actions={[{ label: '편집', variant: 'primary', icon: 'edit', onClick: () => {} }, { label: '삭제', variant: 'danger', icon: 'trash', onClick: () => {} }]}>
        {evSel && (renderEventDetail ? renderEventDetail(evSel) : eventDetailDefault(evSel))}
      </Drawer>
    </div>
  );
}
