'use client';
// RichText (분자) — 저장된 리치 텍스트(HTML)를 읽기 전용으로 렌더. Editor의 짝(같은 TipTap 엔진·스키마).
//  · ProseMirror 스키마가 허용 노드만 렌더 → dangerouslySetInnerHTML보다 안전(스키마 새니타이즈).
//  · 서식 스타일 = Editor와 동일 토큰(editor.css .ProseMirror). 읽기 모드라 툴바·테두리 없음.
//  · BoardView 본문(content 슬롯)·문서 상세 등에서 작성물을 그대로 보여주는 데 쓴다.
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import './editor.css';

type Props = { html: string };

export function RichText({ html }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [StarterKit, Image, TableKit],
    content: html,
  });
  useEffect(() => {
    if (editor && html !== editor.getHTML()) editor.commands.setContent(html);
  }, [html, editor]);
  if (!editor) return null;
  return <div className="rich-text"><EditorContent editor={editor} /></div>;
}
