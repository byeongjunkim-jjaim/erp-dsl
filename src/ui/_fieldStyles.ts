// 입력칸 테두리 통로. 평소엔 --border-default, FormField(분자)가 에러 시 --field-border를
// 자식 영역에 깔면 그 값으로 덮인다. 입력칸은 자기가 에러인지 모른다(역할 변수 통로).
export const fieldBorder = { borderColor: 'var(--field-border, var(--border-default))' };
