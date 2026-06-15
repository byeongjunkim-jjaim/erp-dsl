'use client';
// 1단계 시각 검증용 dev 갤러리. DSL 부품 아님 — 화면 확인 도구.
import { useState } from 'react';
import { Stack } from './Stack';
import { Group } from './Group';
import { Grid } from './Grid';
import { Card } from './Card';
import { Divider } from './Divider';
import { Title } from './Title';
import { Text } from './Text';
import { Label } from './Label';
import { Anchor } from './Anchor';
import { Badge } from './Badge';
import { Chip } from './Chip';
import { Avatar } from './Avatar';
import { Tooltip } from './Tooltip';
import { Spinner } from './Spinner';
import { Icon } from './Icon';
import { Button } from './Button';
import { SegmentedControl } from './SegmentedControl';
import { TabBar } from './TabBar';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { Textarea } from './Textarea';
import { PasswordInput } from './PasswordInput';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { Radio } from './Radio';

const opts = [
  { label: '택배', value: 'parcel' },
  { label: '화물', value: 'freight' },
  { label: '직접수령', value: 'pickup' },
];

export function DevAtomGallery() {
  const [text, setText] = useState('');
  const [num, setNum] = useState<number | string>(0);
  const [sel, setSel] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [check, setCheck] = useState(false);
  const [sw, setSw] = useState(true);
  const [radio, setRadio] = useState('parcel');
  const [seg, setSeg] = useState('parcel');
  const [tab, setTab] = useState('parcel');
  const [chip, setChip] = useState(true);

  return (
    <Stack gap="xl">
      <Title variant="heading">1단계 — 원자 22 + 레이아웃 3 + 프리미티브 3</Title>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">텍스트 · 링크</Title>
          <Title variant="display">display 제목</Title>
          <Text variant="body">body 본문 텍스트입니다.</Text>
          <Text variant="body-strong">body-strong 강조 텍스트</Text>
          <Text variant="caption" color="secondary">caption 보조 텍스트</Text>
          <Text variant="body" color="danger">danger 텍스트</Text>
          <Anchor href="#">이동 링크(Anchor)</Anchor>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">Badge · Chip · Avatar · Tooltip · Spinner · Icon</Title>
          <Group gap="xs" wrap>
            <Badge color="neutral">대기</Badge>
            <Badge color="success">완료</Badge>
            <Badge color="warning">보류</Badge>
            <Badge color="danger">실패</Badge>
            <Badge color="info">정보</Badge>
          </Group>
          <Group gap="sm">
            <Chip selected={chip} onChange={() => setChip((v) => !v)}>선택 칩</Chip>
            <Chip color="info" onRemove={() => {}}>제거가능 칩</Chip>
          </Group>
          <Group gap="md">
            <Avatar>김</Avatar>
            <Tooltip label="툴팁 설명"><span><Icon name="alert-circle" /></span></Tooltip>
            <Spinner size="md" />
            <Group gap="xs">
              <Icon name="check" color="primary" />
              <Icon name="search" color="secondary" />
              <Icon name="trash" color="danger" />
              <Icon name="calendar" />
            </Group>
          </Group>
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">버튼 · 뷰/구획 전환</Title>
          <Group gap="md">
            <Button variant="primary" leftIcon={<Icon name="plus" />}>추가</Button>
            <Button variant="secondary">보조</Button>
            <Button variant="danger" leftIcon={<Icon name="trash" />}>삭제</Button>
            <Button variant="ghost">고스트</Button>
            <Button loading>로딩</Button>
          </Group>
          <SegmentedControl options={opts} value={seg} onChange={setSeg} />
          <TabBar options={opts} value={tab} onChange={setTab} />
        </Stack>
      </Card>

      <Card variant="outlined" padding="lg">
        <Stack gap="md">
          <Title variant="subheading">입력군 (장식·에러는 2단계 FormField가 소유 → 여기선 맨몸)</Title>
          <Grid columns={2} gap="md">
            <Grid.Col span={1}>
              <Stack gap="xxs"><Label>텍스트</Label><TextInput value={text} onChange={setText} placeholder="입력" /></Stack>
            </Grid.Col>
            <Grid.Col span={1}>
              <Stack gap="xxs"><Label>숫자</Label><NumberInput value={num} onChange={setNum} placeholder="0" /></Stack>
            </Grid.Col>
            <Grid.Col span={1}>
              <Stack gap="xxs"><Label>비밀번호</Label><PasswordInput value="" onChange={() => {}} placeholder="••••" /></Stack>
            </Grid.Col>
            <Grid.Col span={1}>
              <Stack gap="xxs"><Label>선택</Label><Select options={opts} value={sel} onChange={setSel} placeholder="고르기" /></Stack>
            </Grid.Col>
            <Grid.Col span={1}>
              <Stack gap="xxs"><Label>날짜</Label><DatePicker value={date} onChange={setDate} placeholder="날짜" /></Stack>
            </Grid.Col>
            <Grid.Col span={1}>
              <Stack gap="xxs"><Label>여러 줄</Label><Textarea value="" onChange={() => {}} autosize placeholder="메모" /></Stack>
            </Grid.Col>
          </Grid>
          <Divider />
          <Group gap="lg">
            <Checkbox label="동의합니다" checked={check} onChange={setCheck} />
            <Switch label="알림" checked={sw} onChange={setSw} />
          </Group>
          <Radio options={opts} value={radio} onChange={setRadio} />
        </Stack>
      </Card>
    </Stack>
  );
}
