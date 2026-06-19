// ── 스키마 층 (데이터 세계) ──────────────────────────────────
// FieldSpec은 부품이 아니다(원자/분자 분류에 안 들어감). LLM이 생성하고 Zod가 검증하는
// "한 입력칸의 명세(데이터 shape)"다. 도메인은 오직 여기로만 들어온다(헌법 1번).
// 함수(resolver 등 배선)는 여기 두지 않는다 — 직렬화 불가 + LLM이 생성 불가. 코드 측에서 주입.

export type FieldType =
  | 'text'
  | 'number'
  | 'currency'   // 돈 입력(₩ + 천단위 콤마, 무소수). number와 검증 동일(z.number)이나 표현이 다름 → CurrencyInput.
  | 'textarea'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'lookup';   // 외부 조회로 채워지는 입력(카카오 주소·우편번호·사업자조회 등). "카카오"는 모름.

export type MaskName = 'phone'; // 명명 enum(임의 금지 — 마스크는 큐레이션 추가, rule of three). 현재 phone만.

// 조건부 술어 — 선언형(함수 금지: 직렬화·LLM 생성 가능해야 함). 현재 술어는 filled 하나(참조 필드가 채워졌는지).
export type FieldCondition = { field: string; filled: boolean };

export type FieldSpec = {
  name: string;                                  // 폼 값 키
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[]; // select 전용
  lookupKey?: string;                            // lookup 전용: 어떤 resolver를 쓸지 식별(문자열 — 함수 아님)
  span?: 1 | 2;                                   // FormSection columns=2일 때 한 줄 전체 차지(기본 1)
  pattern?: string;                               // 정규식(데이터). buildZodSchema가 .regex로 검증. 잘못된 패턴은 가드.
  mask?: MaskName;                                // 입력 마스킹(하이픈 등). FormSection이 onChange에서 적용. pattern과 별개 축.
  requiredWhen?: FieldCondition;                  // 조건부 필수(.superRefine 교차검증)
  disabledWhen?: FieldCondition;                  // 조건부 비활성(FormSection이 토글)
};
