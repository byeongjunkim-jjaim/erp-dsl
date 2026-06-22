'use client';
// PaperModal (유기체) — A4 비율 문서 모달. **모달 본문 자체가 거의 A4 한 장**(작성·확인 양용 — viewer로 보낼 문서를 여기서 편집/확인).
//  · 종이 = 모달 본문(회색 backdrop 중첩 없음 → 공간 안 버림). 본문이 A4 비율(세로/가로)로 폭을 꽉 채우고, 최소 여백은 모달 패딩이 확보.
//  · orientation으로 세로/가로 *버전*을 고정 선택(토글 아님 — 문서 종류가 방향을 정함). 폭도 방향에 맞춰(세로 lg / 가로 xl).
//  · 내용(children)은 소비처가 채움(보통 FieldGrid 장표) — 도메인 0. 인쇄는 소비처 위임: 종이 영역 **.erpPaper 훅**을 print CSS로 타겟 + actions에 인쇄 버튼(window.print()).
import type { ReactNode } from 'react';
import { Modal } from './Modal';
import type { Action } from './_cells';
import './controls.css';

type Orientation = 'portrait' | 'landscape';
type Props = {
  opened: boolean;
  onClose: () => void;
  title: string;
  actions?: Action[];          // 푸터(인쇄·닫기 등) — 인쇄 동작은 소비처가 window.print()로 배선
  orientation?: Orientation;   // 기본 portrait(A4 세로). landscape=가로 버전. 고정(토글 없음).
  closeOnOverlayClick?: boolean;
  children: ReactNode;         // A4 종이 안 문서(소비처 — FieldGrid 등)
};

export function PaperModal({
  opened, onClose, title, actions, orientation = 'portrait', closeOnOverlayClick = false, children,
}: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      actions={actions}
      size={orientation === 'landscape' ? 'xl' : 'lg'}   // 방향별 A4 폭
      closeOnOverlayClick={closeOnOverlayClick}
    >
      {/* .erpPaper = A4 비율 종이(본문 폭 꽉 채움) + 인쇄 타겟 훅. 내용이 길면 모달 본문이 스크롤(한 장 넘는 문서). */}
      <div className={orientation === 'landscape' ? 'erpPaper erpPaper-landscape' : 'erpPaper erpPaper-portrait'}>
        {children}
      </div>
    </Modal>
  );
}
