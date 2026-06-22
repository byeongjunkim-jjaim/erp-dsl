'use client';
// PaperModal (유기체) — A4 문서 *뷰어* 모달. 완성된 문서(거래명세서·견적서 등)를 한 화면에 통째로 본다(보기 전용, 편집 아님).
//  · 종이가 자기 윤곽을 가짐(.erpPaper) — 모달이 아니라 *종이*가 A4 한 장. 종이 안은 **절대 스크롤 없음**.
//  · A4 비율(210:297)을 CSS aspect-ratio/max-*로 맞추지 않는다. 본문 영역을 실측(ResizeObserver)해
//    A4 contain 박스를 px로 계산(fitA4)하고, 표준 A4 픽셀 캔버스(@96dpi)를 transform:scale로 그 박스에 꽉 맞춘다.
//    → 폰트·여백 비율이 통째로 줄어 "한 화면 무스크롤"이 폰트 깨짐 없이 성립(프레임만 줄이는 방식의 내용 넘침을 회피).
//  · 모달이 *종이에 hug* — 95vw×95vh를 상한으로만 쓰고, 그 안의 최대 A4를 구해 모달 폭·본문 높이를 종이+8px로 줄인다(세로 A4의 좌우 회색 낭비 제거). orientation=세로/가로 *버전* 고정(토글 아님 — 문서 종류가 방향을 정함).
//  · 내용(children)은 소비처가 **표준 A4 캔버스(CANON) 좌표계** 기준으로 채움(보통 FieldGrid 장표) — 도메인 0.
//  · 인쇄는 소비처 위임: actions에 인쇄 버튼 배선 + .erpPaper를 print CSS로 타겟(뷰어 자체엔 인쇄 빌트인 없음).
//  · Mantine Modal 격리 래핑(헌법 7). Modal과 같은 3영역 계약이나 본문이 '뷰어 본문'이라 별도 유기체(공유 Modal 불변).
import { Modal as M } from '@mantine/core';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Group } from './Group';
import { Title } from './Title';
import { Icon } from './Icon';
import type { Action } from './_cells';
import { renderAction } from './_cells';
import './controls.css';

type Orientation = 'portrait' | 'landscape';

// 표준 A4 픽셀 캔버스(@96dpi): 210mm×297mm = 794×1123. 소비처는 이 좌표계 기준으로 문서를 그린다(스케일은 뷰어가 함).
const CANON: Record<Orientation, { w: number; h: number }> = {
  portrait:  { w: 794, h: 1123 },
  landscape: { w: 1123, h: 794 },
};
const PAD = 8;  // 본문 영역 안쪽 여백(px) — 종이가 가장자리에 닿지 않게 하는 최소 숨구멍.

// fitA4 — 본문 실측 영역(cw×ch)에 A4 비율(orientation)로 contain되는 최대 박스를 px로 계산. (크기 계산 로직)
function fitA4(cw: number, ch: number, orientation: Orientation) {
  const ratio = orientation === 'landscape' ? 297 / 210 : 210 / 297;  // w/h
  let w = cw;
  let h = w / ratio;
  if (h > ch) { h = ch; w = h * ratio; }      // 폭 기준이 넘치면 높이 기준으로 다시(contain)
  return { w: Math.max(0, Math.floor(w)), h: Math.max(0, Math.floor(h)) };
}

const isPrimaryEnd = (v?: string) => v === 'primary' || v === 'danger';

type Props = {
  opened: boolean;
  onClose: () => void;
  title: string;
  actions?: Action[];                       // 푸터 — 소비처가 인쇄·닫기 등 배선(뷰어는 빌트인 없음)
  orientation?: Orientation;                // 기본 portrait(A4 세로). 고정(토글 아님 — 문서 종류가 방향을 정함).
  closeOnOverlayClick?: boolean;
  children: ReactNode;                      // 표준 A4 캔버스(CANON) 기준 문서 — 소비처(FieldGrid 등)
};

export function PaperModal({
  opened, onClose, title, actions, orientation = 'portrait', closeOnOverlayClick = false, children,
}: Props) {
  const ordered = actions
    ? [...actions].sort((a, b) => Number(isPrimaryEnd(a.variant)) - Number(isPrimaryEnd(b.variant)))
    : [];
  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const orientationRef = useRef(orientation);
  orientationRef.current = orientation;          // 옵저버 콜백이 항상 최신 방향을 읽게.
  // 모달을 종이에 hug — 95vw×95vh는 *상한*. 그 안에 들어가는 최대 A4를 구하고, 모달 폭·본문 높이를 종이+패딩으로 줄인다. (크기 계산 로직)
  const [dim, setDim] = useState({ modalW: 0, bodyH: 0, boxW: 0, boxH: 0 });

  const measure = useCallback(() => {
    if (typeof window === 'undefined') return;
    const headerH = headerRef.current?.offsetHeight ?? 0;   // 크롬(헤더/푸터) 실측 — 종이에 쓸 높이에서 뺀다.
    const footerH = footerRef.current?.offsetHeight ?? 0;
    const availW = window.innerWidth * 0.95 - PAD * 2;       // 상한 95vw 안의 종이 가용 폭
    const availH = window.innerHeight * 0.95 - headerH - footerH - PAD * 2;  // 상한 95vh − 크롬 안의 가용 높이
    const box = fitA4(availW, availH, orientationRef.current);
    setDim({ modalW: box.w + PAD * 2, bodyH: box.h + PAD * 2, boxW: box.w, boxH: box.h });  // 모달·본문이 종이를 hug
  }, []);

  // 콜백 ref — 모달 콘텐츠 루트가 실제 DOM에 붙는 순간 측정·관찰 시작(Mantine Portal이 effect로 늦게 mount해도 놓치지 않음).
  //  주의: useRef+useEffect는 Portal mount 전에 돌아 노드를 놓쳐 dim이 0으로 굳는다 → 종이 scale 0(투명).
  const setRootRef = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect();
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);  // 크롬(폰트 스케일·제목 줄바꿈) 변화 추적
    ro.observe(el);
    roRef.current = ro;
  }, [measure]);

  // 방향 토글·뷰포트 리사이즈 시 재계산.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [orientation, measure]);

  const canon = CANON[orientation];
  const scale = dim.boxW > 0 ? dim.boxW / canon.w : 0;  // 두 변이 같은 A4 비율이라 uniform scale(가로=세로 배율).

  return (
    <M
      opened={opened}
      onClose={onClose}
      size={dim.modalW || '95vw'}  /* 종이에 hug한 px 폭(상한 95vw). 측정 전 첫 프레임만 95vw. */
      xOffset="2.5vw"          /* 좌우 5vw 여백 → content 폭 95vw까지 허용(기본 5vw는 95vw를 90vw로 깎음) */
      yOffset="2.5vh"          /* 상하 5vh 여백 → content 높이 95vh까지 허용(기본 5dvh는 90dvh로 캡) */
      centered
      closeOnClickOutside={closeOnOverlayClick}
      radius="md"
      shadow="md"
      withCloseButton={false}  /* 기본 헤더 끔 — 우리가 직접 조립 */
      padding={0}              /* 본문 패딩 끔 — 패딩 주인을 우리 3영역으로 이관 */
    >
      {/* 3영역 flex 세로 — 높이는 종이에 hug(헤더 + 본문 bodyH + 푸터). 루트에 콜백 ref로 측정·관찰. */}
      <div ref={setRootRef} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* 헤더(고정) — 우리 Group으로 조립. */}
        <div ref={headerRef} style={{ flex: 'none', padding: 'var(--mantine-spacing-md)', borderBottom: `var(--border-width) solid var(--border-default)` }}>
          <Group justify="between" align="center">
            <Title variant="heading">{title}</Title>
            <span role="button" aria-label="닫기" onClick={onClose} style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <Icon name="x" color="secondary" />
            </span>
          </Group>
        </div>

        {/* 본문(뷰어) — 종이를 hug한 높이(bodyH). overflow:hidden = 절대 스크롤 없음.
            패딩 PAD, 가운데 정렬. 회색 데스크(bg-secondary) 위에 흰 종이가 떠 보인다(사방 PAD만). */}
        <div
          style={{
            height: dim.bodyH, overflow: 'hidden', padding: PAD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-secondary)',
          }}
        >
          {/* 발자국 박스(boxW×boxH = A4 contain 결과). 종이를 이 안에 absolute로 스케일해 정확히 채운다. */}
          <div style={{ position: 'relative', width: dim.boxW, height: dim.boxH }}>
            {/* 종이 — 표준 A4 캔버스(canon)를 transform:scale로 박스에 꽉 맞춤(origin top-left). 종이가 자기 윤곽(.erpPaper)을 가짐. */}
            <div
              className="erpPaper"
              style={{
                position: 'absolute', top: 0, left: 0,
                width: canon.w, height: canon.h,
                transform: `scale(${scale})`, transformOrigin: 'top left',
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* 푸터(고정) — actions 있을 때만(소비처가 인쇄 등 배선). flex:none. */}
        {ordered.length > 0 && (
          <div ref={footerRef} style={{ flex: 'none', padding: 'var(--mantine-spacing-md)', borderTop: `var(--border-width) solid var(--border-default)` }}>
            <Group justify="end" gap="xs">
              {ordered.map((a, i) => renderAction(a, i))}
            </Group>
          </div>
        )}
      </div>
    </M>
  );
}
