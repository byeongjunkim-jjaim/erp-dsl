// 마스크 카탈로그 — FieldSpec.mask(명명 enum) → 입력 변환 함수. FormSection이 onChange에서 적용.
//  · 마스킹(입력 중 하이픈)과 검증(정규식 pattern)은 별개 축. 여기는 "보이는 형태" 변환만.
//  · 카탈로그는 사람이 큐레이션으로만 늘린다(헌법 4 — rule of three). 현재 phone(KR) 하나.
//  · 전화 형식(010 휴대폰 vs 02 지역번호 자릿수)은 로케일 값 = 잠정. 다국어화 시 분리.
import type { MaskName } from '../schema';

// 한국 전화: 숫자만 추출 후 하이픈 삽입(서울 02 / 휴대폰·기타 3-4-4 또는 3-3-4).
function maskPhoneKR(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.startsWith('02')) {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

const MASKS: Record<MaskName, (raw: string) => string> = {
  phone: maskPhoneKR,
};

export function applyMask(mask: MaskName, raw: string): string {
  return MASKS[mask](raw);
}
