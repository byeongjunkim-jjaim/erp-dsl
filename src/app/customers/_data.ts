// ── 데모 도메인 (앱 측 — 라이브러리가 아님) ────────────────────
// 고객/프로젝트는 부품이 아니라 데이터(헌법 1번). FieldSpec[]·rows·resolver 전부 여기 산다.
// 부품(FormSection/ListPage/DetailPage)은 이걸 받아 그릴 뿐 "고객"을 모른다.
import type { FieldSpec } from '@/schema';
import type { BadgeColor } from '@/ui';

export const 유입경로옵션 = [
  { label: '검색', value: 'search' },
  { label: '지인 소개', value: 'referral' },
  { label: '광고', value: 'ad' },
  { label: '재방문', value: 'return' },
  { label: '기타', value: 'etc' },
];
export const 유입경로색: Record<string, BadgeColor> = {
  검색: 'info', '지인 소개': 'success', 광고: 'warning', 재방문: 'neutral', 기타: 'neutral',
};

// 신규 고객 등록 스키마 (사용자 지정 구성)
export const 고객등록필드: FieldSpec[] = [
  { name: 'name',    label: '고객명',  type: 'text',     required: true, span: 1, placeholder: '홍길동' },
  { name: 'phone',   label: '연락처',  type: 'text',     required: true, span: 1, placeholder: '010-0000-0000', mask: 'phone', pattern: '^\\d{2,3}-\\d{3,4}-\\d{4}$' },
  { name: 'address', label: '주소',    type: 'lookup',   required: true, span: 2, lookupKey: 'postcode', placeholder: '검색으로 주소 입력' },
  // 상세주소: 주소가 채워졌을 때만 활성·필수(조건부 — 선언형).
  { name: 'detail',  label: '상세주소', type: 'text',     span: 2, placeholder: '동·호수 등',
    requiredWhen: { field: 'address', filled: true }, disabledWhen: { field: 'address', filled: false } },
  { name: 'source',  label: '유입경로', type: 'select',   required: true, span: 1, options: 유입경로옵션, placeholder: '선택' },
  { name: 'memo',    label: '메모',    type: 'textarea', span: 2, placeholder: '특이사항' },
];

// 프로젝트 생성 스키마 (상세 페이지 우하단 — 대표 표본, 실제 필드는 데이터 계약 후 교체)
export const 프로젝트생성필드: FieldSpec[] = [
  { name: 'pname',  label: '프로젝트명', type: 'text',     required: true },
  { name: 'start',  label: '시작일',    type: 'date',     required: true },
  { name: 'budget', label: '예산',      type: 'number',   placeholder: '0' },
  { name: 'note',   label: '비고',      type: 'textarea' },
];

// 카카오 주소 = resolver로 주입(목). 부품은 카카오를 모름 — "외부 조회"만 안다.
// 새 시그니처: apply(patch) — 여러 필드를 한 번에 채운다(단일 set 폐기).
export const mockResolvers = {
  postcode: (apply: (patch: Record<string, unknown>) => void) =>
    apply({ address: '서울특별시 강남구 테헤란로 123 (목 데이터)' }),
};

// 목록 표본 데이터
export const 고객행 = [
  { id: 'c1', name: '홍길동', phone: '010-1111-2222', source: '검색',     createdAt: '2026-05-02' },
  { id: 'c2', name: '김영희', phone: '010-3333-4444', source: '지인 소개', createdAt: '2026-05-11' },
  { id: 'c3', name: '이철수', phone: '010-5555-6666', source: '광고',     createdAt: '2026-06-01' },
].map((r) => ({ ...r, actions: [
  { label: '수정', variant: 'ghost' as const, icon: 'edit' as const, onClick: () => {} },
  { label: '삭제', variant: 'danger' as const, icon: 'trash' as const, iconOnly: true, onClick: () => {} },
] }));
