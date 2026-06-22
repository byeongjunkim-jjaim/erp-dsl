'use client';
// FieldGrid (유기체) — 테두리 친 2D 셀 격자(장표/帳票). FormSection·DataTable·DescriptionList의 형제:
//  스키마를 받아 도메인 무지로 한 구획을 그린다. 없던 레이아웃 어휘 = "칸칸 테두리 2D 격자 + 작성/확인 양용".
//  · 셀 = 고정 라벨 | 스키마 필드 | 이미지 | 빈 칸. 배치는 colSpan·rowSpan(닫힌 값, 임의 px 금지).
//  · mode(edit/read): 셀 박스 기하는 모드 불변(같은 크기·같은 뷰 — 작성한 쪽 == 받는 쪽). 차이는 편집 가능 여부 하나뿐.
//      edit → 입력 원자(FormSection 매핑과 동형) / read → *같은 입력 원자를 inert로* 재사용(편집만 차단, 별도 텍스트 렌더 없음).
//  · 에러: FormField를 쓰지 않는다(라벨이 별도 셀이라 구조가 다름). 메시지 줄이 기하를 깨지 않게
//      --field-border=danger를 셀에 깔아 입력칸이 빨간 테두리만 그리고(역할 변수 통로 재사용),
//      메시지는 Tooltip으로 띄운다.
//  · 도메인 무지: "현장주소"·"도어" 같은 단어를 모른다. 소비자가 rows(격자)·fields(정의)·values로 먹임.
import './fieldgrid.css';
import type { CSSProperties, ReactNode } from 'react';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { CurrencyInput } from './CurrencyInput';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { Checkbox } from './Checkbox';
import { Image } from './Image';
import { Text } from './Text';
import { Tooltip } from './Tooltip';
import { applyMask } from './_masks';
import type { FieldSpec } from '../schema';

export type FieldGridCell = {
  label?: string;       // 고정 라벨 셀(음영)
  field?: string;       // 스키마 필드 셀 — fields[]에서 정의를 찾는다(name)
  image?: string;       // 이미지 셀(도면·로고 등) src
  alt?: string;         // image 셀 접근성
  node?: ReactNode;     // 커스텀 셀(cascader/팔레트 등 비표준 컨트롤 통째). label/field/image와 배타. mode 무관 그대로 렌더
  colSpan?: number;     // 가로 점유 칸(기본 1)
  rowSpan?: number;     // 세로 점유 칸(기본 1) — 병합 표현
  align?: 'start' | 'center' | 'end'; // 셀 내용 가로 정렬(기본 start)
};

type Values = Record<string, unknown>;
type Props = {
  columns: number;                  // 격자 열 수(raw grid 1fr 균등 — 12약수 제약 없음, 명시 예외)
  rows: FieldGridCell[][];          // 행 × 셀
  fields?: FieldSpec[];             // field 셀이 가리키는 필드 정의(type·label·options)
  mode?: 'edit' | 'read';           // 기본 edit
  values?: Values;
  onChange?: (name: string, value: unknown) => void;
  errors?: Record<string, string>;
};

export function FieldGrid({ columns, rows, fields, mode = 'edit', values = {}, onChange, errors }: Props) {
  const fieldMap = new Map((fields ?? []).map((f) => [f.name, f]));

  // edit 입력 원자 매핑(FormSection.control과 동형 — lookup은 격자 셀에선 단순 text로). controlled 전용.
  const editControl = (f: FieldSpec): ReactNode => {
    const v = values[f.name];
    const set = (x: unknown) => onChange?.(f.name, x);
    // 마스크가 있으면 입력 변환 후 반영(text 계열). pattern(검증)과 별개 축 — FormSection과 동형.
    const setText = (x: string) => onChange?.(f.name, f.mask ? applyMask(f.mask, x) : x);
    switch (f.type) {
      case 'number':
        return <NumberInput name={f.name} placeholder={f.placeholder} value={(v as number | string) ?? ''} onChange={set} />;
      case 'currency':
        return <CurrencyInput name={f.name} placeholder={f.placeholder} value={(v as number | string) ?? ''} onChange={set} />;
      case 'textarea':
        // autosize — 내용만큼 자라 read 텍스트 줄바꿈과 같은 높이(작성/확인 기하 통일).
        return <Textarea name={f.name} placeholder={f.placeholder} autosize value={(v as string) ?? ''} onChange={setText} />;
      case 'select':
        return <Select name={f.name} placeholder={f.placeholder} options={f.options ?? []} value={(v as string | null) ?? null} onChange={set} />;
      case 'date':
        return <DatePicker name={f.name} placeholder={f.placeholder} value={(v as string | null) ?? null} onChange={set} />;
      case 'checkbox':
        return <Checkbox name={f.name} checked={Boolean(v)} onChange={set} />;
      default: // text / lookup
        return <TextInput name={f.name} placeholder={f.placeholder} value={(v as string) ?? ''} onChange={setText} />;
    }
  };

  const fieldCell = (name: string): ReactNode => {
    const f = fieldMap.get(name);
    if (!f) return null; // 정의 없는 필드는 빈 셀(스키마 누락 가드)
    // 확인(read) = 작성과 *같은 입력칸을 그대로* 쓰되 편집만 막는다(inert). 차이는 편집 가능 여부 하나뿐 —
    // 폰트·높이·인셋·값 표현이 구조적으로 동일(별도 텍스트 렌더 없음).
    if (mode === 'read') return <div className="erp-fg-field" inert>{editControl(f)}</div>;
    const err = errors?.[name];
    // 에러면 자식 영역에 --field-border=danger를 깐다(입력칸은 자기가 에러인지 모름 — 역할 변수 통로).
    const style = err ? ({ ['--field-border']: 'var(--text-danger)' } as CSSProperties) : undefined;
    const control = <div className="erp-fg-field" style={style}>{editControl(f)}</div>;
    return err ? <Tooltip label={err}>{control}</Tooltip> : control;
  };

  const renderCellBox = (c: FieldGridCell, key: number) => {
    const span: CSSProperties = {
      gridColumn: c.colSpan && c.colSpan > 1 ? `span ${c.colSpan}` : undefined,
      gridRow: c.rowSpan && c.rowSpan > 1 ? `span ${c.rowSpan}` : undefined,
    };
    const isLabel = c.label != null;
    const isImage = c.image != null;
    const isField = c.field != null;
    const isNode = c.node != null;
    const cls = [
      'erp-fg-cell',
      isLabel ? 'is-label' : '',
      isImage ? 'is-image' : '',
      isNode ? 'is-node' : '',
      !isLabel && !isImage && !isField && !isNode ? 'is-empty' : '',
      c.align === 'center' ? 'align-center' : c.align === 'end' ? 'align-end' : '',
    ].filter(Boolean).join(' ');

    let inner: ReactNode = null;
    if (isLabel) inner = <Text variant="body-strong">{c.label}</Text>;
    else if (isImage) inner = <Image src={c.image!} alt={c.alt ?? ''} size="full" fit="contain" />;
    else if (isField) inner = fieldCell(c.field!);
    else if (isNode) inner = c.node;

    return <div key={key} className={cls} style={span}>{inner}</div>;
  };

  return (
    <div className="erp-fg" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {rows.flatMap((row, r) => row.map((c, i) => renderCellBox(c, r * 1000 + i)))}
    </div>
  );
}
