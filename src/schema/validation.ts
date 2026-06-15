// FieldSpec[] → Zod 런타임 검증기 도출. "강제 3층"의 스키마판(데이터가 렌더러에 가기 전 관문).
import { z } from 'zod';
import type { FieldSpec } from './fields';

// 값이 "채워졌는가" — 조건부 술어(filled)와 검증이 공유하는 단일 정의.
export function isFilled(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (typeof v === 'boolean') return v; // 체크박스: 체크됨 = 채워짐
  return true; // number 등
}

// 정규식 컴파일 가드 — 잘못된 pattern이 throw하지 않게(데이터가 LLM/사람 손이므로 방어).
function safeRegExp(pattern: string): RegExp | null {
  try { return new RegExp(pattern); } catch { return null; }
}

export function buildZodSchema(fields: FieldSpec[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const f of fields) {
    let base: z.ZodTypeAny;
    // 조건부 필수(requiredWhen)는 .superRefine으로 처리하므로, 여기선 hard required만 반영.
    const hardRequired = f.required === true;

    switch (f.type) {
      case 'number':
        base = hardRequired ? z.number() : z.number().optional();
        break;
      case 'checkbox':
        base = z.boolean();
        if (!hardRequired) base = base.optional();
        break;
      case 'select': {
        const vals = (f.options ?? []).map((o) => o.value);
        const en = vals.length > 0 ? z.enum(vals as [string, ...string[]]) : z.string();
        base = hardRequired ? en : en.optional();
        break;
      }
      default: {
        // text / textarea / date(ISO string) / lookup(string)
        let s = z.string();
        if (hardRequired) s = s.min(1, `${f.label}은(는) 필수입니다`);
        // 정규식 검증(빈 값은 통과 — 필수 여부는 위에서). 잘못된 pattern은 무시(가드).
        if (f.pattern) {
          const re = safeRegExp(f.pattern);
          if (re) s = s.refine((v) => v === '' || v == null || re.test(v), `${f.label} 형식이 올바르지 않습니다`);
        }
        base = hardRequired ? s : s.optional();
      }
    }
    shape[f.name] = base;
  }

  const object = z.object(shape);

  // 조건부 필수 교차검증 — requiredWhen이 충족인데 비어있으면 이슈.
  const conditionals = fields.filter((f) => f.requiredWhen);
  if (conditionals.length === 0) return object;

  return object.superRefine((val: Record<string, unknown>, ctx) => {
    for (const f of conditionals) {
      const cond = f.requiredWhen!;
      const active = isFilled(val[cond.field]) === cond.filled; // 참조 필드의 filled 상태가 조건과 일치
      // disabledWhen이 동시에 비활성이면 필수 요구 안 함(둘은 보통 상보적으로 작성됨).
      const disabled = f.disabledWhen ? isFilled(val[f.disabledWhen.field]) === f.disabledWhen.filled : false;
      if (active && !disabled && !isFilled(val[f.name])) {
        ctx.addIssue({ code: 'custom', path: [f.name], message: `${f.label}은(는) 필수입니다` });
      }
    }
  });
}

export type InferValues = Record<string, unknown>;
