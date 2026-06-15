// Icon 원자 — SVG로 그린다(유니코드 글리프 금지). 색은 currentColor(텍스트 역할 통로).
// --icon-baseline-shift(-0.125em) 내장 → 텍스트와 나란히 놓일 때 광학 중심 자동 정렬.
// 아이콘 세트는 시스템 밖에서 사람이 큐레이션으로 늘린다(헌법 4).

import type { CSSProperties } from 'react';

export type IconName =
  | 'check' | 'x' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
  | 'search' | 'plus' | 'minus' | 'calendar' | 'upload' | 'trash' | 'refresh'
  | 'eye' | 'eye-off' | 'alert-circle' | 'alert-triangle' | 'info' | 'dots' | 'edit' | 'arrow-left' | 'filter' | 'bell'
  // ── ERP 큐레이션 확장 (헌법 4 — Tabler 원본 path, 함수별 선별. kk 요구 home·users·building·store·book·package·database 포함) ──
  | 'home' | 'dashboard' | 'menu' | 'settings' | 'logout' | 'user' | 'users' | 'building' | 'store' | 'arrow-right' | 'external-link' | 'help' | 'download' | 'save' | 'copy' | 'print' | 'send' | 'dots-vertical' | 'adjustments' | 'history' | 'check-circle' | 'x-circle' | 'clock' | 'ban' | 'lock' | 'lock-open' | 'file' | 'file-text' | 'file-invoice' | 'files' | 'folder' | 'clipboard' | 'receipt' | 'report' | 'book' | 'package' | 'box' | 'truck' | 'warehouse' | 'barcode' | 'cart' | 'database' | 'coin' | 'won' | 'credit-card' | 'calculator' | 'tag' | 'discount' | 'chart-bar' | 'chart-line' | 'wallet' | 'phone' | 'mail' | 'map-pin' | 'id-card' | 'paperclip' | 'link' | 'star' | 'list' | 'table' | 'sort-asc' | 'sort-desc';

// 24x24 viewBox, stroke=currentColor 기반(outline). path만 정의(색·정렬은 래퍼가).
const PATHS: Record<IconName, string> = {
  'check': 'M5 12l5 5L20 7',
  'x': 'M6 6l12 12M18 6L6 18',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-up': 'M6 15l6-6 6 6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  'search': 'M11 3a8 8 0 100 16 8 8 0 100-16M21 21l-4.3-4.3',
  'plus': 'M12 5v14M5 12h14',
  'minus': 'M5 12h14',
  'calendar': 'M5 5h14v15H5zM8 3v4M16 3v4M5 10h14',
  'upload': 'M12 16V4M7 9l5-5 5 5M5 20h14',
  'trash': 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  'refresh': 'M21 12a9 9 0 11-9-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5',
  'eye': 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6',
  'eye-off': 'M3 3l18 18M10 6a9 9 0 0111 6 11 11 0 01-2 3M6 6a11 11 0 00-4 6s4 7 10 7a9 9 0 004-1',
  'alert-circle': 'M12 3a9 9 0 100 18 9 9 0 000-18M12 8v5M12 16h.01',
  'alert-triangle': 'M12 4L2 20h20zM12 10v4M12 17h.01',
  'info': 'M12 3a9 9 0 100 18 9 9 0 000-18M12 11v5M12 8h.01',
  'bell': 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  'dots': 'M5 12h.01M12 12h.01M19 12h.01',
  'edit': 'M4 20h4L18.5 9.5a2.12 2.12 0 00-3-3L5 17v3M13.5 6.5l3 3',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  'filter': 'M3 5h18l-7 8v6l-4-2v-4z',
  // ── ERP 큐레이션 확장 ──
  'home': 'M0 0h24v24H0z M5 12l-2 0l9 -9l9 9l-2 0 M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7 M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6',
  'dashboard': 'M0 0h24v24H0z M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1 M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1 M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1 M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1',
  'menu': 'M0 0h24v24H0z M4 6l16 0 M4 12l16 0 M4 18l16 0',
  'settings': 'M0 0h24v24H0z M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065 M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0',
  'logout': 'M0 0h24v24H0z M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2 M9 12h12l-3 -3 M18 15l3 -3',
  'user': 'M0 0h24v24H0z M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0 M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2',
  'users': 'M0 0h24v24H0z M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M21 21v-2a4 4 0 0 0 -3 -3.85',
  'building': 'M0 0h24v24H0z M3 21l18 0 M9 8l1 0 M9 12l1 0 M9 16l1 0 M14 8l1 0 M14 12l1 0 M14 16l1 0 M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16',
  'store': 'M0 0h24v24H0z M3 21l18 0 M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4 M5 21l0 -10.15 M19 21l0 -10.15 M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4',
  'arrow-right': 'M0 0h24v24H0z M5 12l14 0 M13 18l6 -6 M13 6l6 6',
  'external-link': 'M0 0h24v24H0z M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6 M11 13l9 -9 M15 4h5v5',
  'help': 'M0 0h24v24H0z M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0 M12 16v.01 M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483',
  'download': 'M0 0h24v24H0z M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2 M7 11l5 5l5 -5 M12 4l0 12',
  'save': 'M0 0h24v24H0z M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2 M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M14 4l0 4l-6 0l0 -4',
  'copy': 'M0 0h24v24H0z M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666 M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1',
  'print': 'M0 0h24v24H0z M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2 M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4 M7 15a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -4',
  'send': 'M0 0h24v24H0z M10 14l11 -11 M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5',
  'dots-vertical': 'M0 0h24v24H0z M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
  'adjustments': 'M0 0h24v24H0z M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0 M6 4v4 M6 12v8 M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0 M12 4v10 M12 18v2 M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0 M18 4v1 M18 9v11',
  'history': 'M0 0h24v24H0z M12 8l0 4l2 2 M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5',
  'check-circle': 'M0 0h24v24H0z M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M9 12l2 2l4 -4',
  'x-circle': 'M0 0h24v24H0z M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M10 10l4 4m0 -4l-4 4',
  'clock': 'M0 0h24v24H0z M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0 M12 7v5l3 3',
  'ban': 'M0 0h24v24H0z M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M5.7 5.7l12.6 12.6',
  'lock': 'M0 0h24v24H0z M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6 M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0 M8 11v-4a4 4 0 1 1 8 0v4',
  'lock-open': 'M0 0h24v24H0z M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6 M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M8 11v-5a4 4 0 0 1 8 0',
  'file': 'M0 0h24v24H0z M14 3v4a1 1 0 0 0 1 1h4 M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2',
  'file-text': 'M0 0h24v24H0z M14 3v4a1 1 0 0 0 1 1h4 M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2 M9 9l1 0 M9 13l6 0 M9 17l6 0',
  'file-invoice': 'M0 0h24v24H0z M14 3v4a1 1 0 0 0 1 1h4 M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2 M9 7l1 0 M9 13l6 0 M13 17l2 0',
  'files': 'M0 0h24v24H0z M15 3v4a1 1 0 0 0 1 1h4 M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2 M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2',
  'folder': 'M0 0h24v24H0z M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2',
  'clipboard': 'M0 0h24v24H0z M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2 M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2 M9 12h6 M9 16h6',
  'receipt': 'M0 0h24v24H0z M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2m4 -14h6m-6 4h6m-2 4h2',
  'report': 'M0 0h24v24H0z M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697 M18 14v4h4 M18 11v-4a2 2 0 0 0 -2 -2h-2 M8 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2 M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M8 11h4 M8 15h3',
  'book': 'M0 0h24v24H0z M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0 M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0 M3 6l0 13 M12 6l0 13 M21 6l0 13',
  'package': 'M0 0h24v24H0z M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5 M12 12l8 -4.5 M12 12l0 9 M12 12l-8 -4.5 M16 5.25l-8 4.5',
  'box': 'M0 0h24v24H0z M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5 M12 12l8 -4.5 M12 12l0 9 M12 12l-8 -4.5',
  'truck': 'M0 0h24v24H0z M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5',
  'warehouse': 'M0 0h24v24H0z M3 21v-13l9 -4l9 4v13 M13 13h4v8h-10v-6h6 M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3',
  'barcode': 'M0 0h24v24H0z M4 7v-1a2 2 0 0 1 2 -2h2 M4 17v1a2 2 0 0 0 2 2h2 M16 4h2a2 2 0 0 1 2 2v1 M16 20h2a2 2 0 0 0 2 -2v-1 M5 11h1v2h-1l0 -2 M10 11l0 2 M14 11h1v2h-1l0 -2 M19 11l0 2',
  'cart': 'M0 0h24v24H0z M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M17 17h-11v-14h-2 M6 5l14 1l-1 7h-13',
  'database': 'M0 0h24v24H0z M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0 M4 6v6a8 3 0 0 0 16 0v-6 M4 12v6a8 3 0 0 0 16 0v-6',
  'coin': 'M0 0h24v24H0z M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1 M12 7v10',
  'won': 'M0 0h24v24H0z M4 6l3.245 11.358a.85 .85 0 0 0 1.624 .035l3.131 -9.393l3.131 9.393a.85 .85 0 0 0 1.624 -.035l3.245 -11.358 M21 10h-18 M21 14h-18',
  'credit-card': 'M0 0h24v24H0z M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8 M3 10l18 0 M7 15l.01 0 M11 15l2 0',
  'calculator': 'M0 0h24v24H0z M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14 M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1 M8 14l0 .01 M12 14l0 .01 M16 14l0 .01 M8 17l0 .01 M12 17l0 .01 M16 17l0 .01',
  'tag': 'M0 0h24v24H0z M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3',
  'discount': 'M0 0h24v24H0z M9 15l6 -6 M9 9.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0 M14 14.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0 M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
  'chart-bar': 'M0 0h24v24H0z M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6 M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -10 M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -14 M4 20h14',
  'chart-line': 'M0 0h24v24H0z M4 19l16 0 M4 15l4 -6l4 2l4 -5l4 4',
  'wallet': 'M0 0h24v24H0z M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12 M20 12v4h-4a2 2 0 0 1 0 -4h4',
  'phone': 'M0 0h24v24H0z M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2',
  'mail': 'M0 0h24v24H0z M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10 M3 7l9 6l9 -6',
  'map-pin': 'M0 0h24v24H0z M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0 M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0',
  'id-card': 'M0 0h24v24H0z M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -10 M7 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M15 8l2 0 M15 12l2 0 M7 16l10 0',
  'paperclip': 'M0 0h24v24H0z M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5',
  'link': 'M0 0h24v24H0z M9 15l6 -6 M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464 M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463',
  'star': 'M0 0h24v24H0z M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245',
  'list': 'M0 0h24v24H0z M9 6l11 0 M9 12l11 0 M9 18l11 0 M5 6l0 .01 M5 12l0 .01 M5 18l0 .01',
  'table': 'M0 0h24v24H0z M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14 M3 10h18 M10 3v18',
  'sort-asc': 'M0 0h24v24H0z M4 6l7 0 M4 12l7 0 M4 18l9 0 M15 9l3 -3l3 3 M18 6l0 12',
  'sort-desc': 'M0 0h24v24H0z M4 6l9 0 M4 12l7 0 M4 18l7 0 M15 15l3 3l3 -3 M18 6l0 12',
};

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = { sm: 16, md: 20, lg: 24 };
const COLOR_VAR: Record<'primary' | 'secondary' | 'danger', string> = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  danger: 'var(--text-danger)',
};

type IconProps = {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  // 색을 안 주면 currentColor(부모 텍스트색)를 따른다 — 버튼/칩 안 아이콘용
  color?: 'primary' | 'secondary' | 'danger';
};

export function Icon({ name, size = 'md', color }: IconProps) {
  const px = SIZE_PX[size];
  const style: CSSProperties = {
    verticalAlign: 'var(--icon-baseline-shift)', // 광학 정렬 보정(토큰)
    color: color ? COLOR_VAR[color] : undefined,
    flexShrink: 0,
  };
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
