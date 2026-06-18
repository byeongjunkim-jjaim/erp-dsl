'use client';
// ToastHost — 토스트 호스트(위치·지속·스택 단일 관리). notify.*가 이 호스트로 띄운다.
//  · 기존엔 <Notifications/>가 Providers에 묻혀 설정(위치·지속)이 분산 → ToastHost로 단일화(앱 셸에 1회 배치).
//  · @mantine/notifications 격리(헌법 7). notify(트리거)와 한 쌍 — 트리거는 notify.*, 자리는 ToastHost.
import { Notifications } from '@mantine/notifications';
export function ToastHost() {
  return <Notifications position="top-right" autoClose={4000} />;
}
