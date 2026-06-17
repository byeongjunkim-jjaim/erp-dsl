'use client';
// ─────────────────────────────────────────────────────────────────────────
// _DevPlayground — 부품 "구성(composition) 편집기" PoC (궁극 editor의 씨앗).
//
//  핵심: 단순 prop 놀이터가 아니다. 편집 대상 부품을 *구성하는 모든 요소*가 편집 대상이며,
//  특히 각 구성요소를 배치하는 **배치 프리미티브(Group/Stack)·레이아웃 원자(Card)·토큰**이 핵심이다.
//  (label·icon 같은 콘텐츠 값도 포함 — "구성하는 모든 요소"라서.)
//
//  왜 재현하나: SummaryCard 같은 완성 부품은 내부 배치가 닫혀(고정) 있어 prop으로 못 바꾼다.
//  그래서 편집기는 그 구성을 프리미티브로 재현(parameterized)해 배치값을 state로 노출한다.
//  큐레이터가 화면에서 값을 정하면 → 그게 부품에 *박힐* 값(헌법 4 큐레이션 도구).
//
//  레이아웃(에디터 관습): 좌측 = 편집(상단 패널) + 결과 구성(하단), 우측 = 라이브 프리뷰(넓게).
//  SummaryCard는 작지만 편집기 틀은 모든 부품(큰 것 포함)을 덮어야 해 프리뷰 칸을 크게 둔다.
//
//  PoC라 SummaryCard 1종을 손배선. 다음: _catalog.ts prop/구성요소 스펙에 구조화 options를 얹어
//  컨트롤·구성트리를 자동 생성 → 부품마다 손배선 제거, AppShell 등으로 확장.
//  dev 전용(publish 제외).
// ─────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Stack } from './Stack';
import { Group } from './Group';
import { Grid } from './Grid';
import { Card } from './Card';
import { Divider } from './Divider';
import { Title } from './Title';
import { Text } from './Text';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { Select } from './Select';
import { Switch } from './Switch';
import { Icon, type IconName } from './Icon';
import { Label } from './Label';
import { fmtCurrency, fmtNumber, type BadgeColor } from './_cells';

// ── 닫힌 토큰/enum 어휘 ──
type GapTok = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type Align3 = 'start' | 'center' | 'end';
type Align4 = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'between';
type RadiusTok = 'sm' | 'md' | 'full';
type CardVar = 'elevated' | 'outlined' | 'flat';
type CardPad = 'none' | 'sm' | 'md' | 'lg';
type SizeTok = 'sm' | 'md' | 'lg';
type TextVar = 'body' | 'body-strong' | 'caption';
type TitleVar = 'display' | 'heading' | 'subheading';
type TextColor = 'primary' | 'secondary' | 'danger';

const GAPS: GapTok[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const ALIGN3: Align3[] = ['start', 'center', 'end'];
const ALIGN4: Align4[] = ['start', 'center', 'end', 'stretch'];
const JUSTIFY: Justify[] = ['start', 'center', 'end', 'between'];
const RADII: RadiusTok[] = ['sm', 'md', 'full'];
const CARD_VARS: CardVar[] = ['elevated', 'outlined', 'flat'];
const CARD_PADS: CardPad[] = ['none', 'sm', 'md', 'lg'];
const SIZES: SizeTok[] = ['sm', 'md', 'lg'];
const TEXT_VARS: TextVar[] = ['body', 'body-strong', 'caption'];
const TITLE_VARS: TitleVar[] = ['display', 'heading', 'subheading'];
const TEXT_COLORS: TextColor[] = ['primary', 'secondary', 'danger'];
const TONES: BadgeColor[] = ['neutral', 'success', 'warning', 'danger', 'info'];
const ICONS: IconName[] = ['clock', 'check-circle', 'coin', 'won', 'package', 'truck', 'chart-bar', 'wallet', 'credit-card', 'bell'];

const optsOf = (xs: readonly string[]) => xs.map((x) => ({ label: x, value: x }));

// 편집 컨트롤 한 줄: 라벨 + 컨트롤
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Grid columns={12} gap="xs">
      <Grid.Col span={5}><div style={{ paddingTop: 6 }}><Text variant="caption" color="secondary">{label}</Text></div></Grid.Col>
      <Grid.Col span={7}>{children}</Grid.Col>
    </Grid>
  );
}
// 구성요소 묶음 헤더 (어떤 계층 요소인지 배지로)
function Section({ title, kind, children }: { title: string; kind: string; children: React.ReactNode }) {
  return (
    <Stack gap="xs">
      <Group gap="xs" align="center"><Text variant="body-strong">{title}</Text><Text variant="caption" color="secondary">{kind}</Text></Group>
      <Stack gap="xs">{children}</Stack>
    </Stack>
  );
}

export function DevPlayground() {
  // 콘텐츠 값
  const [label, setLabel] = useState('승인 대기');
  const [icon, setIcon] = useState<IconName>('clock');
  const [tone, setTone] = useState<BadgeColor>('warning');
  const [showCount, setShowCount] = useState(true);
  const [count, setCount] = useState<number | string>(12);
  const [showAmount, setShowAmount] = useState(true);
  const [amount, setAmount] = useState<number | string>(3400000);
  // Card (레이아웃 원자)
  const [cardVar, setCardVar] = useState<CardVar>('elevated');
  const [cardPad, setCardPad] = useState<CardPad>('lg');
  // Group (배치 프리미티브 — 바깥: [아이콘 | 텍스트묶음])
  const [gGap, setGGap] = useState<GapTok>('md');
  const [gAlign, setGAlign] = useState<Align3>('center');
  const [gJustify, setGJustify] = useState<Justify>('start');
  const [gWrap, setGWrap] = useState(false);
  // 아이콘 박스 (틴트 span — 토큰)
  const [ibPad, setIbPad] = useState<GapTok>('xs');
  const [ibRadius, setIbRadius] = useState<RadiusTok>('md');
  const [iconSize, setIconSize] = useState<SizeTok>('md');
  // Stack (배치 프리미티브 — 텍스트 묶음)
  const [sGap, setSGap] = useState<GapTok>('xxs');
  const [sAlign, setSAlign] = useState<Align4>('start');
  // 텍스트 변형
  const [labelVar, setLabelVar] = useState<TextVar>('body');
  const [labelColor, setLabelColor] = useState<TextColor>('secondary');
  const [countVar, setCountVar] = useState<TitleVar>('heading');
  const [amountVar, setAmountVar] = useState<TextVar>('body-strong');

  const numCount = typeof count === 'number' ? count : Number(count) || 0;
  const numAmount = typeof amount === 'number' ? amount : Number(amount) || 0;

  // 구성 트리 (각 구성요소 + 그 배치 프리미티브/토큰을 한눈에)
  const tree =
`Card  variant="${cardVar}" padding="${cardPad}"          (레이아웃 원자)
└ Group  gap="${gGap}" align="${gAlign}" justify="${gJustify}" wrap={${gWrap}}   (배치 프리미티브)
  ├ 아이콘박스  padding="${ibPad}" radius="${ibRadius}" · Icon size="${iconSize}" tone="${tone}"   (토큰)
  └ Stack  gap="${sGap}" align="${sAlign}"          (배치 프리미티브)
    ├ Text(label)  variant="${labelVar}" color="${labelColor}"   (의미 원자)${showCount ? `\n    ├ Title(count)  variant="${countVar}"   (의미 원자)` : ''}${showAmount ? `\n    └ Text(amount)  variant="${amountVar}"   (의미 원자)` : ''}`;

  return (
    <Grid columns={12} gap="lg">
      {/* ── 좌: 편집(상단) + 결과 구성(하단) ── */}
      <Grid.Col span={5}>
        <Stack gap="md">
          {/* 상단: 편집 패널 (길면 스크롤) */}
          <Card variant="outlined" padding="lg">
            <Stack gap="md">
              <Group gap="xs" align="center"><Title variant="subheading">SummaryCard</Title><Text variant="caption" color="secondary">구성 편집</Text></Group>
              <div style={{ maxHeight: '58vh', overflowY: 'auto', paddingRight: 4 }}>
                <Stack gap="lg">
                  <Section title="콘텐츠" kind="값">
                    <Row label="label"><TextInput value={label} onChange={setLabel} /></Row>
                    <Row label="icon"><Select options={optsOf(ICONS)} value={icon} onChange={(v) => v && setIcon(v as IconName)} /></Row>
                    <Row label="tone"><Select options={optsOf(TONES)} value={tone} onChange={(v) => v && setTone(v as BadgeColor)} /></Row>
                    <Row label="count 표시"><Switch checked={showCount} onChange={setShowCount} /></Row>
                    {showCount && <Row label="count"><NumberInput value={count} onChange={setCount} /></Row>}
                    <Row label="amount 표시"><Switch checked={showAmount} onChange={setShowAmount} /></Row>
                    {showAmount && <Row label="amount"><NumberInput value={amount} onChange={setAmount} /></Row>}
                  </Section>

                  <Divider />
                  <Section title="Card" kind="레이아웃 원자">
                    <Row label="variant"><Select options={optsOf(CARD_VARS)} value={cardVar} onChange={(v) => v && setCardVar(v as CardVar)} /></Row>
                    <Row label="padding"><Select options={optsOf(CARD_PADS)} value={cardPad} onChange={(v) => v && setCardPad(v as CardPad)} /></Row>
                  </Section>

                  <Divider />
                  <Section title="Group — [아이콘 | 텍스트]" kind="배치 프리미티브">
                    <Row label="gap"><Select options={optsOf(GAPS)} value={gGap} onChange={(v) => v && setGGap(v as GapTok)} /></Row>
                    <Row label="align"><Select options={optsOf(ALIGN3)} value={gAlign} onChange={(v) => v && setGAlign(v as Align3)} /></Row>
                    <Row label="justify"><Select options={optsOf(JUSTIFY)} value={gJustify} onChange={(v) => v && setGJustify(v as Justify)} /></Row>
                    <Row label="wrap"><Switch checked={gWrap} onChange={setGWrap} /></Row>
                  </Section>

                  <Divider />
                  <Section title="아이콘 박스 (틴트)" kind="토큰">
                    <Row label="padding"><Select options={optsOf(GAPS)} value={ibPad} onChange={(v) => v && setIbPad(v as GapTok)} /></Row>
                    <Row label="radius"><Select options={optsOf(RADII)} value={ibRadius} onChange={(v) => v && setIbRadius(v as RadiusTok)} /></Row>
                    <Row label="icon size"><Select options={optsOf(SIZES)} value={iconSize} onChange={(v) => v && setIconSize(v as SizeTok)} /></Row>
                  </Section>

                  <Divider />
                  <Section title="Stack — 텍스트 묶음" kind="배치 프리미티브">
                    <Row label="gap"><Select options={optsOf(GAPS)} value={sGap} onChange={(v) => v && setSGap(v as GapTok)} /></Row>
                    <Row label="align"><Select options={optsOf(ALIGN4)} value={sAlign} onChange={(v) => v && setSAlign(v as Align4)} /></Row>
                  </Section>

                  <Divider />
                  <Section title="텍스트 변형" kind="의미 원자">
                    <Row label="label variant"><Select options={optsOf(TEXT_VARS)} value={labelVar} onChange={(v) => v && setLabelVar(v as TextVar)} /></Row>
                    <Row label="label color"><Select options={optsOf(TEXT_COLORS)} value={labelColor} onChange={(v) => v && setLabelColor(v as TextColor)} /></Row>
                    {showCount && <Row label="count variant"><Select options={optsOf(TITLE_VARS)} value={countVar} onChange={(v) => v && setCountVar(v as TitleVar)} /></Row>}
                    {showAmount && <Row label="amount variant"><Select options={optsOf(TEXT_VARS)} value={amountVar} onChange={(v) => v && setAmountVar(v as TextVar)} /></Row>}
                  </Section>
                </Stack>
              </div>
            </Stack>
          </Card>

          {/* 하단: 결과 구성(구성 트리) */}
          <Card variant="flat" padding="md">
            <Stack gap="xs">
              <Text variant="caption" color="secondary">결과 구성 (구성요소 + 배치 프리미티브/토큰)</Text>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{tree}</pre>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>

      {/* ── 우: 라이브 프리뷰 (넓게) ── 부품 구성을 프리미티브로 재현, 배치값 state 바인딩 ── */}
      <Grid.Col span={7}>
        <Stack gap="xs">
          <Text variant="caption" color="secondary">라이브 프리뷰</Text>
          <div style={{ minHeight: '70vh', background: 'var(--bg-tertiary)', borderRadius: 'var(--mantine-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--mantine-spacing-xl)' }}>
            <div style={{ width: 320 }}>
              <Card variant={cardVar} padding={cardPad}>
                <Group gap={gGap} align={gAlign} justify={gJustify} wrap={gWrap}>
                  {icon && (
                    <span style={{ color: `var(--mantine-color-${tone}-7)`, background: `var(--mantine-color-${tone}-0)`, borderRadius: `var(--mantine-radius-${ibRadius})`, padding: `var(--mantine-spacing-${ibPad})`, display: 'inline-flex', flexShrink: 0 }}>
                      <Icon name={icon} size={iconSize} />
                    </span>
                  )}
                  <Stack gap={sGap} align={sAlign}>
                    <Text variant={labelVar} color={labelColor}>{label}</Text>
                    {showCount && <Title variant={countVar}>{`${fmtNumber(numCount)}건`}</Title>}
                    {showAmount && <Text variant={amountVar}>{fmtCurrency(numAmount)}</Text>}
                  </Stack>
                </Group>
              </Card>
            </div>
          </div>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
