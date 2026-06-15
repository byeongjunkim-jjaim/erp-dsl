'use client';
// FormSection (조직) — FieldSpec[]을 받아 FormField + 입력 원자로 조립.
//  · 고정(코드): 배치 프리미티브(Grid/Stack)·gap 토큰·FormField 감싸기·타입→원자 매핑·마스크 적용·조건부 토글.
//  · 가변(스키마): 어떤 필드가 몇 개·무슨 타입·라벨·필수·options·span·pattern·mask·requiredWhen·disabledWhen.
// 도메인을 모른다(fields를 받아 그릴 뿐). "신규 고객 등록"은 Modal + FormSection + 고객 스키마의 조립.
import { Grid } from './Grid';
import { Stack } from './Stack';
import { Group } from './Group';
import { FormField } from './FormField';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { Icon } from './Icon';
import { applyMask } from './_masks';
import { isFilled, type FieldSpec, type FieldCondition } from '../schema';

type Values = Record<string, unknown>;
// resolver: lookup 필드를 외부 조회로 채운다. 여러 필드를 한 번에(patch) — 단일 set은 폐기(경쟁 경로 차단).
type Resolver = (apply: (patch: Record<string, unknown>) => void) => void;

type Props = {
  fields: FieldSpec[];
  values: Values;
  onChange: (name: string, value: unknown) => void;
  columns?: 1 | 2;                       // B안: 스키마가 1·2열까지 지정(임의 배치 금지)
  resolvers?: Record<string, Resolver>;  // lookupKey(또는 name) → 조회 함수
  errors?: Record<string, string>;
};

// 조건부 술어 평가 — 참조 필드의 filled 상태가 조건과 일치하는가.
function meets(cond: FieldCondition | undefined, values: Values): boolean {
  if (!cond) return false;
  return isFilled(values[cond.field]) === cond.filled;
}

export function FormSection({ fields, values, onChange, columns = 1, resolvers, errors }: Props) {
  const control = (f: FieldSpec, disabled: boolean) => {
    const v = values[f.name];
    // 마스크가 있으면 입력 변환 후 반영(text 계열). pattern(검증)과 별개 축.
    const setText = (x: string) => onChange(f.name, f.mask ? applyMask(f.mask, x) : x);
    switch (f.type) {
      case 'number':
        return <NumberInput name={f.name} placeholder={f.placeholder} disabled={disabled}
          value={(v as number | string) ?? ''} onChange={(x) => onChange(f.name, x)} />;
      case 'textarea':
        return <Textarea name={f.name} placeholder={f.placeholder} autosize disabled={disabled}
          value={(v as string) ?? ''} onChange={setText} />;
      case 'select':
        return <Select name={f.name} placeholder={f.placeholder} options={f.options ?? []} disabled={disabled}
          value={(v as string | null) ?? null} onChange={(x) => onChange(f.name, x)} />;
      case 'date':
        return <DatePicker name={f.name} placeholder={f.placeholder} disabled={disabled}
          value={(v as string | null) ?? null} onChange={(x) => onChange(f.name, x)} />;
      case 'checkbox':
        return <Checkbox name={f.name} disabled={disabled}
          checked={Boolean(v)} onChange={(x) => onChange(f.name, x)} />;
      case 'lookup':
        // 외부 조회형: 입력칸이 행 전체를 채우고 검색 버튼이 우측에. resolver는 patch로 여러 필드 한 번에 채움.
        return (
          <Group gap="xs" align="center" wrap={false}>
            <div style={{ flex: 1 }}>
              <TextInput name={f.name} placeholder={f.placeholder} disabled={disabled}
                value={(v as string) ?? ''} onChange={setText} />
            </div>
            <Button variant="secondary" disabled={disabled} leftIcon={<Icon name="search" />}
              onClick={() => resolvers?.[f.lookupKey ?? f.name]?.((patch) => {
                for (const [k, val] of Object.entries(patch)) onChange(k, val);
              })}>
              검색
            </Button>
          </Group>
        );
      default: // text
        return <TextInput name={f.name} placeholder={f.placeholder} disabled={disabled}
          value={(v as string) ?? ''} onChange={setText} />;
    }
  };

  const cell = (f: FieldSpec) => {
    const disabled = meets(f.disabledWhen, values);
    const required = f.required === true || meets(f.requiredWhen, values);
    return (
      <FormField key={f.name} label={f.label} withAsterisk={required} error={errors?.[f.name]}>
        {control(f, disabled)}
      </FormField>
    );
  };

  // 배치는 FormSection이 고정. 1열은 Stack, 2열은 Grid(span으로 한 줄 전체 허용).
  if (columns === 1) {
    return <Stack gap="md">{fields.map((f) => cell(f))}</Stack>;
  }
  return (
    <Grid columns={2} gap="md">
      {fields.map((f) => (
        <Grid.Col span={f.span ?? 1} key={f.name}>{cell(f)}</Grid.Col>
      ))}
    </Grid>
  );
}
