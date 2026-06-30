'use client';
// Editor (분자) — 리치 텍스트 작성기. TipTap(헤드리스 엔진) 흡수: 엔진은 외부, *스킨은 우리 토큰*(무테).
//  · @tiptap/* import는 이 파일(+RichText)에 격리(헌법 7 — Mantine 격리와 동형). 바깥은 Editor만 본다.
//  · 툴바 = 우리가 직접 조립(템플릿 전용 버튼), 본문 서식 = 토큰(editor.css .ProseMirror). 라이브러리 룩 0.
//  · features = 닫힌 기능 세트 — 소비처가 부분집합 선택(CellType/FieldSpec 동형, 옵션 스태킹 아님). 새 기능=큐레이션(헌법 4).
//  · 출력 = HTML 문자열(value/onChange, controlled). 짝 = RichText(읽기 뷰어, 같은 엔진·스키마).
import { useEffect, type ReactNode } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import { Icon, type IconName } from './Icon';
import './editor.css';

export type EditorFeature =
  | 'bold' | 'italic' | 'heading' | 'bulletList' | 'orderedList'
  | 'quote' | 'link' | 'image' | 'table' | 'divider';

const ALL_FEATURES: EditorFeature[] = ['bold', 'italic', 'heading', 'bulletList', 'orderedList', 'quote', 'link', 'image', 'table', 'divider'];

type Props = {
  value: string;                       // HTML
  onChange: (html: string) => void;
  features?: EditorFeature[];          // 노출 툴바(닫힌 세트). 기본 전체
  placeholder?: string;
  name?: string;                       // 폼 배선(hidden input로 HTML 전달)
};

export function Editor({ value, onChange, features = ALL_FEATURES, placeholder = '내용을 입력하세요', name }: Props) {
  const has = (f: EditorFeature) => features.includes(f);
  const editor = useEditor({
    immediatelyRender: false,          // Next SSR — 하이드레이션 불일치 방지
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Placeholder.configure({ placeholder }),
      ...(has('image') ? [Image] : []),
      ...(has('table') ? [TableKit] : []),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return null;

  const tb = (key: string, active: boolean, onClick: () => void, label: string, icon?: IconName, text?: ReactNode) => (
    <button key={key} type="button" className={`editor-tb${active ? ' on' : ''}`} title={label} aria-label={label}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {text ?? (icon && <Icon name={icon} size="sm" />)}
    </button>
  );

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크 URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };
  const insertImage = () => {
    const url = window.prompt('이미지 URL', 'https://');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="erp-editor">
      <div className="erp-editor-tb">
        {has('bold') && tb('b', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), '굵게', undefined, <b>B</b>)}
        {has('italic') && tb('i', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), '기울임', undefined, <i>I</i>)}
        {has('heading') && tb('h', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), '제목', undefined, <span style={{ fontWeight: 800 }}>H</span>)}
        {(has('bulletList') || has('orderedList') || has('quote')) && <span className="editor-tb-sep" />}
        {has('bulletList') && tb('ul', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '목록', 'list')}
        {has('orderedList') && tb('ol', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '번호 목록', 'list-numbers')}
        {has('quote') && tb('q', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), '인용', 'quote')}
        {(has('link') || has('image') || has('table') || has('divider')) && <span className="editor-tb-sep" />}
        {has('link') && tb('link', editor.isActive('link'), setLink, '링크', 'link')}
        {has('image') && tb('img', false, insertImage, '이미지', 'photo')}
        {has('table') && tb('table', false, () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), '표', 'table')}
        {has('divider') && tb('hr', false, () => editor.chain().focus().setHorizontalRule().run(), '구분선', 'minus')}
      </div>
      <EditorContent editor={editor} />
      {name && <input type="hidden" name={name} value={value} readOnly />}
    </div>
  );
}
