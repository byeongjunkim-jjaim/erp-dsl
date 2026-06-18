// hierarchyImport — 엑셀 "등록" 시트(행 배열 1장)를 HierarchyExplorer 데이터로 변환하는 순수 함수.
//  · 의존성 0 — 파일 해독(SheetJS 등)은 호출 측(dev import 도구/소비앱)이 하고, 여기엔 "행"만 들어온다.
//  · 단일 시트 모델: 한 행 = 한 품목. '품목명' 열을 기준으로 왼쪽 = 폴더(계층) 칸, 오른쪽 = 품목 필드.
//    비전공자가 ‘>’ 경로 문법이나 두 표 교차참조 없이, 칸만 채우면 트리가 선다(왼쪽=큰 분류 → 오른쪽=작은 분류).
//  · 품목명 오른쪽 동적 열의 *첫 칸 = 핵심값(headline)*, 나머지 = 보조(attributes). '배지' 열 = 상태(status).
//    → ObjectCard 역할 슬롯과 1:1. 양식의 열 순서가 곧 카드의 정보 위계(중요한 지표를 첫 열에).
//  · 산출: { nodes(TreeNodeData[]) , objectsByPath } — 익스플로러 selectedId(=경로)로 objectsByPath[path] 조회.
import type { TreeNodeData } from './Tree';
import type { HierarchyObject } from './HierarchyExplorer';
import type { CellType, BadgeColor } from './_cells';

const SEP = '>';                                   // 트리 노드 id 표기용 구분자(사용자는 칸으로 입력, 문법 노출 없음)
const TITLE = '품목명';                              // 이 열 왼쪽 = 폴더 칸 / 오른쪽 = 품목 필드. 필수 열.
const FIXED_RIGHT = new Set(['부제', '배지', '배지색', '썸네일']); // 품목명 오른쪽의 고정 열(나머지는 동적 필드)

// 한글 입력값 → 내부 토큰(비전공자 친화: 표에는 한글만 보인다).
const TONE_KO: Record<string, BadgeColor> = { 성공: 'success', 경고: 'warning', 위험: 'danger', 정보: 'info', 기본: 'neutral' };
const TYPE_KO: Record<string, CellType> = { 숫자: 'number', 금액: 'currency', 날짜: 'date', 퍼센트: 'percent', 예아니오: 'boolean', 글자: 'text', 텍스트: 'text' };

export type HierarchyImport = {
  nodes: TreeNodeData[];
  objectsByPath: Record<string, HierarchyObject[]>;
};

const pathId = (segs: string[]) => segs.join(` ${SEP} `); // ["현장","강남 현장"] → "현장 > 강남 현장"

// 경로(세그먼트 배열) 목록 → 중첩 트리. id=정규화 경로, label=마지막 segment.
function buildTree(paths: string[][]): TreeNodeData[] {
  const root: TreeNodeData[] = [];
  const seen = new Map<string, TreeNodeData>();
  for (const segs of paths) {
    let level = root;
    const acc: string[] = [];
    for (const seg of segs) {
      acc.push(seg);
      const key = pathId(acc);
      let node = seen.get(key);
      if (!node) { node = { id: key, label: seg, children: [] }; seen.set(key, node); level.push(node); }
      level = node.children!;
    }
  }
  return root;
}

// '면적(숫자)' → { label:'면적', type:'number' }. 괄호 없으면 글자(text).
function parseHeader(raw: string): { label: string; type: CellType } {
  const m = raw.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (m) return { label: m[1].trim(), type: TYPE_KO[m[2].trim()] ?? 'text' };
  return { label: raw.trim(), type: 'text' };
}

// 셀 타입에 맞춰 값 정규화(숫자류는 number로). 표시 포맷은 renderCell이 담당.
function coerce(v: unknown, type: CellType): unknown {
  const s = String(v ?? '').trim();
  if (s === '') return '';
  if (type === 'number' || type === 'currency' || type === 'percent') {
    const n = Number(s.replace(/,/g, ''));
    return Number.isNaN(n) ? s : n;
  }
  if (type === 'boolean') return /^(true|y|yes|예|o|1)$/i.test(s);
  return s;
}

/**
 * rows: '등록' 시트 행들(0행=헤더, 1행~=데이터).
 *  · '품목명' 열을 기준으로 왼쪽=폴더(계층) 칸, 오른쪽=품목 필드.
 *  · 폴더 경로는 왼쪽부터 채운 만큼(빈 칸에서 멈춤). 품목명이 비면 그 줄은 '빈 폴더'만 만든다.
 *  · 폴더 칸이 모두 빈 줄(미아 품목)은 버린다.
 */
export function buildHierarchyFromRows(rows: string[][]): HierarchyImport {
  const objectsByPath: Record<string, HierarchyObject[]> = {};
  const paths: string[][] = [];
  if (rows.length < 1) return { nodes: [], objectsByPath };

  const head = (rows[0] ?? []).map((c) => String(c ?? '').trim());
  const titleIdx = head.indexOf(TITLE);
  if (titleIdx < 0) throw new Error(`헤더에서 ‘${TITLE}’ 열을 찾지 못했습니다. 양식의 첫 행(헤더)을 지우지 마세요.`);

  const at = (row: string[], i: number) => String(row[i] ?? '').trim();
  const folderIdx = Array.from({ length: titleIdx }, (_, i) => i);   // 품목명 왼쪽 = 폴더 칸들(왼→오 = 얕은→깊은)
  const fix = (label: string) => head.indexOf(label);
  const subIdx = fix('부제'), badgeIdx = fix('배지'), toneIdx = fix('배지색'), thumbIdx = fix('썸네일');
  const dynCols = head
    .map((h, i) => ({ i, ...parseHeader(h) }))
    .filter((c) => c.i > titleIdx && c.label && !FIXED_RIGHT.has(head[c.i]));

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r] ?? [];
    // 폴더 경로: 왼쪽부터 채운 칸을 모으되 빈 칸에서 멈춘다(중간 공백은 끝으로 간주).
    const segs: string[] = [];
    for (const i of folderIdx) { const v = at(row, i); if (!v) break; segs.push(v); }
    const title = at(row, titleIdx);
    if (!segs.length) continue;                 // 폴더 없는 줄(완전 빈 줄·미아 품목) 버림
    paths.push(segs);                           // 폴더 등록(품목 없어도 빈 폴더로 트리에 보강)
    if (!title) continue;                       // 폴더만 만드는 줄

    const path = pathId(segs);
    const badgeLabel = badgeIdx >= 0 ? at(row, badgeIdx) : ''; // '배지' 열 = 오브젝트 상태(status)로 매핑
    const tone = toneIdx >= 0 ? (TONE_KO[at(row, toneIdx)] ?? 'neutral') : 'neutral';
    // 동적 열(값 있는 것만) → 첫 칸 = 핵심값(headline), 나머지 = 보조(attributes). 역할 슬롯 강제 매핑.
    const dyn = dynCols
      .map((c) => ({ label: c.label, type: c.type, value: coerce(row[c.i], c.type) }))
      .filter((f) => f.value !== '' && f.value != null);
    const [headline, ...attributes] = dyn;

    const obj: HierarchyObject = {
      id: `${path}#${r}`,
      title,
      subtitle: subIdx >= 0 ? (at(row, subIdx) || undefined) : undefined,
      status: badgeLabel ? { label: badgeLabel, tone } : undefined,
      thumbnail: thumbIdx >= 0 ? (at(row, thumbIdx) || undefined) : undefined,
      headline,
      attributes: attributes.length ? attributes : undefined,
    };
    (objectsByPath[path] ??= []).push(obj);
  }

  return { nodes: buildTree(paths), objectsByPath };
}
