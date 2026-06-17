# @your-org/erp-dsl

ERP No-Code 빌더의 부품 DSL. 닫힌 부품 집합(원자·분자·유기체·템플릿)과 스키마 층(Zod)을 제공한다.
LLM은 화면이 아니라 **스키마(FieldSpec[])**를 생성하고, 결정적 렌더러(부품)가 화면으로 변환한다.

## 설치 (GitHub Packages)

소비 레포 루트에 `.npmrc`:

```
@your-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm i @byeongjunkim-jjaim/erp-dsl
# peer 의존성(소비 앱이 직접 설치)
npm i @mantine/core @mantine/dates @mantine/hooks @mantine/notifications dayjs zod react react-dom
```

## Next.js 설정 (필수)

소스(.tsx)를 그대로 배포하므로 소비 앱이 트랜스파일한다.

```ts
// next.config.ts
export default { transpilePackages: ['@your-org/erp-dsl'] };
```

## 사용

```tsx
import { Providers, ListPage, notify } from '@your-org/erp-dsl';
import { buildZodSchema, type FieldSpec } from '@your-org/erp-dsl/schema';
```

`Providers`를 루트 레이아웃에 감싸고(테마·토스트 마운트 포함), 부품은 `@your-org/erp-dsl`,
스키마 타입·검증기는 `@your-org/erp-dsl/schema`에서 가져온다.

## 폰트 (PretendardGOV)

`Providers`가 `fonts.css`를 통해 **Pretendard GOV**를 자동 로드한다 — 소비 앱이 따로 폰트를 걸 필요 없음.
폰트는 **패키지에 동봉(self-host)** 된 단일 가변 woff2(`src/ui/fonts/PretendardGOVVariable.woff2`, 전 weight 45~920)라 **CDN 없이 사내망·오프라인에서도 동작**한다. theme의 `fontFamily="Pretendard GOV Variable"`이 이 실물을 가리킨다.
> Next 소비 앱은 `transpilePackages` 덕에 패키지 안 CSS의 `url()` woff2를 정적 자산으로 처리한다.

## 경계 (헌법)

- 소비 앱은 이 패키지를 **수정하지 않는다.** 카탈로그 확장은 본 라이브러리 레포에서 사람이 큐레이션으로만(헌법 4).
- Mantine 직접 import 금지 — 이 패키지의 배럴만 사용(헌법 7).
