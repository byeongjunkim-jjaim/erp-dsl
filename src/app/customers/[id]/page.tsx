'use client';
// 고객 상세 — DetailPage(좌 정보 DescriptionList / 우 프로젝트 생성 FormSection). 스키마 구동.
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DetailPage } from '@/ui';
import { buildZodSchema } from '@/schema';
import { 고객행, 유입경로색, 프로젝트생성필드 } from '../_data';

const zod = buildZodSchema(프로젝트생성필드);

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const cust = 고객행.find((c) => c.id === id) ?? 고객행[0];

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const onChange = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

  const createProject = () => {
    const r = zod.safeParse(values);
    if (!r.success) {
      const e: Record<string, string> = {};
      for (const issue of r.error.issues) e[String(issue.path[0])] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setValues({});
  };

  return (
    <DetailPage
      title={cust.name}
      description={`${cust.source} · ${cust.createdAt} 등록`}
      actions={[
        { label: '목록으로', variant: 'ghost', icon: 'arrow-left', onClick: () => router.push('/customers') },
        { label: '수정', variant: 'primary', icon: 'edit', onClick: () => {} },
      ]}
      info={{
        heading: '고객 정보',
        columns: 1,
        items: [
          { label: '고객명', value: cust.name, type: 'text' },
          { label: '연락처', value: cust.phone, type: 'text' },
          { label: '유입경로', value: cust.source, type: 'badge', badgeColors: 유입경로색 },
          { label: '등록일', value: cust.createdAt, type: 'date' },
        ],
      }}
      form={{
        heading: '프로젝트 생성',
        fields: 프로젝트생성필드,
        columns: 1,
        values,
        onChange,
        errors,
        footer: [{ label: '프로젝트 생성', variant: 'primary', onClick: createProject }],
      }}
    />
  );
}
