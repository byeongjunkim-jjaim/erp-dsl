'use client';
// 고객 관리 (목록) — ListPage + 신규 고객 등록 Modal(FormSection). 전부 스키마 구동.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListPage, Modal, FormSection, notify, type DataTableRow } from '@/ui';
import { buildZodSchema } from '@/schema';
import { 고객등록필드, 고객행, 유입경로색, mockResolvers } from './_data';

const listSchema = {
  title: '고객 관리',
  primaryAction: undefined as undefined | import('@/ui').Action,
  columns: [
    { key: 'name', label: '고객명', type: 'text' as const, sortable: true },
    { key: 'phone', label: '연락처', type: 'text' as const },
    { key: 'source', label: '유입경로', type: 'badge' as const, badgeColors: 유입경로색 },
    { key: 'createdAt', label: '등록일', type: 'date' as const, sortable: true },
    { key: 'actions', label: '', type: 'actions' as const },
  ],
  filterable: true,
  emptyState: { icon: 'search' as const, title: '고객이 없습니다', description: '신규 고객을 등록해 보세요' },
};

const zod = buildZodSchema(고객등록필드);

export default function CustomersPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onChange = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

  const submit = () => {
    const r = zod.safeParse(values);
    if (!r.success) {
      const e: Record<string, string> = {};
      for (const issue of r.error.issues) e[String(issue.path[0])] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setOpen(false);
    setValues({});
    notify.success('고객이 등록되었습니다'); // 작업 성공 = 토스트. 필드 검증 실패는 위에서 인라인(토스트 안 띄움).
  };

  return (
    <>
      <ListPage
        schema={{ ...listSchema, primaryAction: { label: '신규 고객 등록', variant: 'primary', icon: 'plus', onClick: () => setOpen(true) } }}
        rows={고객행}
        status="ready"
        totalCount={고객행.length}
        onRowClick={(row: DataTableRow) => router.push(`/customers/${row.id}`)}
      />
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="신규 고객 등록"
        closeOnOverlayClick={false}
        actions={[
          { label: '취소', variant: 'secondary', onClick: () => setOpen(false) },
          { label: '등록', variant: 'primary', onClick: submit },
        ]}
      >
        <FormSection
          fields={고객등록필드}
          values={values}
          onChange={onChange}
          columns={2}
          resolvers={mockResolvers}
          errors={errors}
        />
      </Modal>
    </>
  );
}
