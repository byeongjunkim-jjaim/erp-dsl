# 위젯 청사진 레지스트리 (vendor-neutral)

> **무엇**: 세상의 검증된 디자인시스템(IBM Carbon · MS Fluent · Shopify Polaris · Ant Design · Google/MUI Material · Atlassian · Mantine · Radix/shadcn)에서 *정형화된 위젯의 청사진*을 수확 → 합의형으로 증류 → **우리 DSL 조립 레시피**로 번역한 것.
> **쓰는 법**: 당신은 각 항목의 `판단:` 칸만 채우면 됨 — **✅ 채택 / 🔧 보강(무엇을) / ⏭️ 스킵(이유)**.
> **정렬**: ERP 도메인 중요도 — **Tier S**(ERP 화면 골격, 없으면 안 돌아감) → **A**(자주·보조) → **B**(특수·드묾).
> **보유 표기**: ✅ 보유 · 🟡 유사보유(부품명) · ❌ 갭. `합의 n/8` = 표준화 강도(여러 시스템 공통일수록 정형화됨).
> ⚠️ 이 파일은 신규 생성분. 다른 문서는 수정하지 않음.

---

## 📊 판단 대시보드 — 먼저 볼 것

**Tier S(골격)에서 손볼 것** = 최우선 확보 목록:

- **S · 진짜 갭(❌)**: `Cascader`(카테고리 트리 선택) · `Skeleton`(표/카드 로딩)
- **S · 부분보유(🟡, 보강 필요)**: `Combobox/Autocomplete`(검색형 Select) · `TreeSelect`(조직/분류) · `Drawer`(상세·필터 패널) · `Header/Topbar` · `Filters/SearchToolbar`(목록 상단 바) · `Stat/Metric`(SummaryCard 보강) · `DashboardGrid`(PageGrid 보강)

이 9개만 처리하면 ERP 화면 골격은 완성. 나머지 Tier A/B는 여유 있게.

**전체 분포**: 총 ~80 · ✅보유 ~38 · 🟡부분 ~24 · ❌갭 ~18.

---

# Tier S — ERP 화면 골격

## 입력
### TextInput — 보유:✅ · 합의 8/8
- 해부: label · 입력필드 · placeholder · helper · error · prefix/suffix(아이콘·단위) · clear(옵션)
- 표준 props: type(text·email·tel·url) · size · disabled · readOnly · invalid · required · maxLength
- 상태: default·focus·disabled·readOnly·error·warning
- → DSL: `TextInput` 직매핑. 폼에선 `FormField`로 label+helper+error 래핑(FieldSpec[]). 단위/아이콘은 `InputGroup`
- 판단: ☐

### Textarea — 보유:✅ · 합의 7/8
- 해부: label · 멀티라인 영역 · placeholder · helper · error · 글자수 카운터 · autoSize 핸들
- 표준 props: rows · maxLength · autoSize(min/max) · disabled · readOnly · invalid · resize
- → DSL: `Textarea` 직매핑. `FormField`로 라벨/카운터/에러
- 판단: ☐

### NumberInput — 보유:✅ · 합의 6/8
- 해부: label · 숫자필드 · 증감 스테퍼(▲▼) · prefix/suffix(통화·단위) · helper · error
- 표준 props: min · max · step · precision · hideControls · disabled · invalid
- → DSL: `NumberInput` 직매핑. 통화/단위 `InputGroup`+`Text`
- 판단: ☐

## 선택
### Select — 보유:✅ · 합의 8/8
- 해부: 트리거(값/placeholder+chevron) · Popover 리스트박스 · 옵션 행(체크/하이라이트). 단일값
- 표준 props: options · value · placeholder · disabled · size · status · clearable · searchable
- → DSL: `Select` 직매핑. `FormField` 래핑. status=neutral|danger
- 판단: ☐

### MultiSelect — 보유:✅ · 합의 7/8
- 해부: Select 트리거 안 선택 토큰(Chip) 다발 · 옵션마다 Checkbox · 카운트
- 표준 props: options · value[] · maxCount · searchable · clearable · disabled
- → DSL: `MultiSelect` 직매핑. 선택표시 `Chip`(sm), 오버플로 +N `Badge`
- 판단: ☐

### Combobox / Autocomplete — 보유:🟡(Select searchable) · 합의 8/8
- 해부: role=combobox 텍스트 입력 · 필터된 listbox · activedescendant 하이라이트
- 표준 props: options · inputValue · filterOptions · freeSolo · loading
- 상태: typing·filtering·loading·no-result·selected
- → DSL: `TextInput`(트리거)+`Popover`+`Menu`(필터결과). 로딩 `Spinner`, 빈결과 `EmptyState`. **보강: searchable Select를 비동기 typeahead로 확장**
- 판단: ☐

### Cascader — 보유:❌ · 합의 3/8 (Ant·MUI·Mantine) · **ERP 카테고리트리 필수**
- 해부: 트리거 · 다단 패널(컬럼별 레벨) · hover로 하위 전개 · 리프 선택→경로값
- 표준 props: options(children) · value(path) · changeOnSelect · multiple · showSearch · expandTrigger
- → DSL: 트리거 `Select`/`TextInput` + `Popover`에 `Group`으로 컬럼형 `Menu` 다단, 또는 `Tree` 계층 전개. 선택경로 `Breadcrumb`
- 판단: ☐

### TreeSelect — 보유:🟡(Tree) · 합의 4/8 · **조직/분류 필수**
- 해부: Select 트리거 + Popover 안 Tree(접기/펼치기·checkable) · 다중 시 Chip
- 표준 props: treeData · value · multiple · treeCheckable · maxCount · showSearch
- → DSL: 트리거 `Select`+`Popover`+조직 `Tree`(노드 `Checkbox` indeterminate). 결과 `Chip`. **보강: Tree를 드롭다운에 임베드**
- 판단: ☐

### Radio — 보유:✅ · 합의 8/8
- 해부: 원형 인디케이터+Label, 그룹 내 택1
- 표준 props: value · checked · name(group) · disabled · size
- → DSL: `Radio`+`Stack`/`Group` 그룹화, `FormField` 라벨/에러
- 판단: ☐

### Checkbox — 보유:✅ · 합의 8/8
- 해부: 사각 박스(체크/indeterminate)+Label
- 표준 props: checked · indeterminate · disabled · size
- → DSL: `Checkbox` 직매핑. 전체선택은 indeterminate. `FormField` 래핑
- 판단: ☐

### Switch — 보유:✅ · 합의 8/8
- 해부: 트랙+슬라이딩 썸, 즉시 토글(라벨)
- 표준 props: checked · disabled · size · label
- → DSL: `Switch`+`Label`을 `Group` 가로배치. 설정행은 `StatusRow`/`FormField`
- 판단: ☐

## 날짜·시간
### DatePicker — 보유:✅ · 합의 7/7
- 해부: label · 날짜 입력필드 · 캘린더 아이콘 · 팝오버 캘린더(월·연 네비)
- 표준 props: value · size · dateFormat · locale · weekStartDay · min/max · invalid
- → DSL: `DatePicker` 직매핑. 입력은 `TextInput`+`Icon`(calendar), 캘린더는 `Popover`+`Calendar`
- 판단: ☐

### DateRangePicker — 보유:✅(DateRangeField) · 합의 6/7 · **근태·정산기간 핵심**
- 해부: 시작·종료 두 입력 · 2개월 캘린더 · 범위 하이라이트
- 표준 props: value(start,end) · startLabel/endLabel · dateFormat · min/max · invalid
- → DSL: `DateRangeField` 직매핑. 내부 `Group`+시작/종료 `TextInput`+`Popover`+`Calendar`(range)
- 판단: ☐

## 데이터 표시
### DataTable — 보유:✅ · 합의 8/8
- 해부: 헤더행+바디행 그리드 · 행별 셀 · 선택 체크박스열 · 일괄작업 바 · 확장영역
- 표준 props: 정렬(asc/desc) · 행 단일·전체 선택 · 일괄작업 · 고정열·고정헤더 · 확장행 · 요약/합계행 · 가상스크롤 · 필터·페이지 연동
- 상태: 로딩(스켈레톤)·빈상태·정렬/선택활성·행 hover
- → DSL: `DataTable` 직매핑. 일괄작업=`SectionHeader`+`IconButton`, 요약=`TotalRow`, 빈상태=`EmptyState`, 하단=`Pagination`. **보강 후보: 컬럼 show/hide 영속(persistKey)**
- 판단: ☐

### DescriptionList — 보유:✅ · 합의 6/8
- 해부: 라벨(term)–값(definition) 쌍 반복 · 가로/세로 · 그룹 구획
- 표준 props: 컬럼수 · 레이아웃 · 라벨폭 · 구획제목 · size · 경계선
- → DSL: `DescriptionList` 직매핑. 구획 `SectionHeader`, 값강조 `Text`(role)/`Badge`/`StatusRow`
- 판단: ☐

### Stat/Metric — 보유:🟡(SummaryCard) · 합의 6/8
- 해부: 큰 수치값+라벨 · 추세 화살표·델타% · 비교기간 · (스파크라인·아이콘)
- 표준 props: 값·단위 · 라벨 · 추세(up/down/flat)+상태색 · 델타값 · 보조텍스트 · size · 아이콘
- → DSL: `SummaryCard`에 매핑. 추세=`Badge`(success/danger)+`Icon`, 보조=`Text`(secondary). **보강: 추세/델타 prop 추가. 스파크라인은 스킵(차트 범위 밖)**
- 판단: ☐

### Badge — 보유:✅ · 합의 8/8
- 해부: 작은 상태 라벨 또는 카운트 점/숫자, 색=의미
- 표준 props: 상태색(neutral/success/warning/danger/info) · count·dot 모드 · size · 아이콘
- → DSL: `Badge` 직매핑(status 토큰). 행 상태는 `StatusRow`와 결합
- 판단: ☐

### Card — 보유:✅ · 합의 8/8
- 해부: 컨테이너 박스(radius·경계·패딩) · 헤더·미디어·본문·액션 영역
- 표준 props: padding · radius(sm/md) · 경계/그림자 · 헤더·푸터 슬롯 · 선택·클릭 · 미디어
- → DSL: `Card` 직매핑. 헤더=`SectionHeader`, 본문=`Stack`, 액션=`Group`(Button), 미디어=`Image`. bento 핵심
- 판단: ☐

## 피드백
### Skeleton — 보유:❌ · 합의 7/8 · **표·카드 로딩 UX 핵심**
- 해부: 콘텐츠 로드 전 회색 자리표시 블록(텍스트줄/원형/사각)+shimmer
- 표준 props: variant text|circular|rectangular · width/height · animation pulse|wave · count
- → DSL: 갭. 임의 치수가 필요해 토큰과 충돌 → **size 토큰(sm/md/lg)으로 변형 한정한 `Skeleton` 원자 신설**. `DataTable status='loading'`을 Spinner→Skeleton 행으로 교체 시 표 로딩 상향
- 판단: ☐

## 오버레이
### Modal/Dialog — 보유:✅ · 합의 8/8
- 해부: overlay(dim)+container · header(title·close)·body·footer(actions) · 포커스트랩·중앙정렬
- 표준 props: open · size(sm/md/lg) · dismiss(overlay·ESC·close) · title · footer actions · danger 변형
- → DSL: `Modal` 직매핑. header `Title`+`IconButton`(close), body `Stack`(md), footer `Group`(sm)+`Button`(secondary/primary·danger)
- 판단: ☐

### Drawer/Sheet — 보유:🟡(Modal) · 합의 8/8 · **상세 편집·필터 패널 핵심**
- 해부: edge에서 슬라이드인 패널 · overlay+container · header·body·footer
- 표준 props: position(top/bottom/left/right) · size(sm/md/lg) · overlay(mask) · dismiss · resizable
- → DSL: 갭. **`Modal`을 베이스로 position·size 슬롯 추가가 정공법**. 내부는 Modal과 동일(`Title`+`IconButton`, `Stack` body, `Group` footer). overlay/dismiss 계약 재사용
- 판단: ☐

## 네비게이션
### AppShell/Sidebar — 보유:✅ · 합의 8/8
- 해부: 좌 넷바(로고+그룹메뉴) · 우상단 바(알림·프로필) · 콘텐츠 영역
- 표준 props: menuItems(label·icon·path·group) · activePath · onNavigate · logo · profile · notification
- → DSL: `AppShell` 직매핑. group으로 사이드바 구획, activePath 강조. 내부 `Avatar`·`Icon`·`Popover`·`IconButton`·`Divider` 소비
- 판단: ☐

### Header/Topbar — 보유:🟡(AppShell 상단바) · 합의 6/8
- 해부: 좌(브랜드/검색) · 우(알림·프로필 액션). 전역 유틸 바
- 표준 props: 브랜드 슬롯 · 유틸 액션 · 프로필 메뉴 · 알림
- → DSL: AppShell 우상단 바(profile·notification)가 흡수. 분리형 토픽바 필요 시 `Group`+`IconButton`+`Menu`. **보강: 전역 검색 슬롯 표준화 여부 판단**
- 판단: ☐

### Breadcrumb — 보유:✅ · 합의 8/8
- 해부: a › b › c 경로 · chevron 구분 · 마지막=현재(비링크 강조)
- 표준 props: items(label·onClick?) · 마지막 현재처리 · 구분자 · 축약(…)
- → DSL: `Breadcrumb` 직매핑. 내부 `Group`+`Text`+`Icon`(chevron). `SectionHeader.titleNode`에도 삽입 가능
- 판단: ☐

### Tabs — 보유:✅(TabBar) · 합의 8/8
- 해부: 라벨 트랙+활성 인디케이터(밑줄) · 구획 자체 전환
- 표준 props: options(label·value) · value/onChange · disabled
- → DSL: `TabBar` 직매핑(구획 전환). 같은 대상의 뷰/모드 토글은 `SegmentedControl`로 구분
- 판단: ☐

### Pagination — 보유:✅ · 합의 8/8
- 해부: 이전/다음 화살표 · 번호열(축약 …) · 현재 강조
- 표준 props: total · value/onChange. 페이지 크기 선택은 별도
- → DSL: `Pagination` 직매핑. DataTable이 page/totalPages로 내장 연결(HierarchyExplorer는 페이지네이션 없이 목록 스크롤)
- 판단: ☐

### Filters/SearchToolbar — 보유:🟡(ListPage toolbar) · 합의 6/8 · **목록 화면 핵심**
- 해부: 검색 입력 · 필터 컨트롤군 · 정렬 · (저장된 뷰 탭). 목록 상단 띠
- 표준 props: query · filters[] · sort · savedViews · 적용/리셋
- 상태: 활성 필터칩 · 적용/대기 · 저장뷰 전환
- → DSL: 전용 바 없음. **`SearchToolbar` 분자 신설 강력 후보**: `Group`에 `TextInput`(검색)+`Select`/`MultiSelect`(필터)+`DateRangeField`+`Chip`(활성필터). 저장뷰=`TabBar`
- 판단: ☐

## 액션·레이아웃·패턴
### Button — 보유:✅ · 합의 8/8
- 해부: 라벨±아이콘 · variant·size · 단독/그룹
- 표준 props: variant(primary/secondary/danger/ghost) · size · disabled · loading · iconLeft/Right · fullWidth
- → DSL: `Button` 직매핑. tertiary→ghost. 아이콘은 `Icon` 합성
- 판단: ☐

### Stack — 보유:✅ · 합의 8/8
- 해부: 수직(또는 수평) 1차원 흐름, 일관 간격
- 표준 props: gap · direction · align · justify
- → DSL: `Stack` 직매핑(spacing 토큰). 모든 폼·페이지 세로 리듬의 골격
- 판단: ☐

### Group/Inline — 보유:✅ · 합의 7/8
- 해부: 수평 1차원 배치 · 래핑·정렬(액션바·태그열)
- 표준 props: gap · align · justify · wrap
- → DSL: `Group` 직매핑. 헤더 액션·버튼묶음·메타행
- 판단: ☐

### ListPage/ResourceIndex — 보유:✅ · 합의 8/8
- 해부: PageHeader(제목+생성 primary) · 필터/검색 · DataTable · 페이지네이션
- 표준 props: title · primaryAction · filters · columns · data
- → DSL: `ListPage` 템플릿 직매핑. 생성 액션=우상단 primary `Button`(전 시스템 합의)
- 판단: ☐

### DetailPage — 보유:✅ · 합의 7/8
- 해부: PageHeader(제목+액션) · 메타/필드 섹션 · 관련 리스트
- 표준 props: title · actions · sections · breadcrumb
- → DSL: `DetailPage` 템플릿 직매핑. `PageHeader`+`Card`/`FormSection` 섹션
- 판단: ☐

### FormPage/FormSection — 보유:✅ · 합의 8/8
- 해부: 라벨드 필드 그룹을 섹션으로 · 하단 primary/secondary 액션 · 세로 1열 권장
- 표준 props: sections · fields(FieldSpec[]) · submit/cancel · layout(vertical)
- → DSL: `FormSection` 템플릿 + `Container`(narrow) + `Stack`. 하단 `Group` primary 우측정렬
- 판단: ☐

### DashboardGrid — 보유:🟡(PageGrid) · 합의 6/8
- 해부: 카드/위젯을 반응형 그리드로 배열한 요약 화면
- 표준 props: columns · gap · widgets/cards
- → DSL: `PageGrid` 템플릿 매핑. `Card`×N을 `Grid` 배치. bento=Card 묶음. **보강: 위젯별 loading/empty 표준**
- 판단: ☐

---

# Tier A — 자주·보조

## 입력·선택
### PasswordInput — 보유:✅ · 합의 5/8
- 해부: 마스킹 필드 · 표시/숨김 토글 · (강도 미터)
- 표준 props: visibilityToggle · disabled · invalid · maxLength
- → DSL: `PasswordInput` 직매핑(토글 내장). 강도미터는 `StatusRow`/`Text` 대체
- 판단: ☐

### SearchInput — 보유:🟡(TextInput+IconButton) · 합의 6/8
- 해부: 검색 아이콘(좌)·필드·clear/X(우)·(로딩)
- 표준 props: placeholder · clearButton · loading · size
- → DSL: `InputGroup`에 `Icon`(search)+`TextInput`+`IconButton`(clear)+`Spinner`. ListPage 필터바 핵심
- 판단: ☐

### FileUpload/Dropzone — 보유:✅ · 합의 6/8
- 해부: 드롭존(점선·아이콘·안내) 또는 업로드 버튼 · 파일 리스트(이름·크기·상태·삭제) · 진행률
- 표준 props: multiple · accept · maxSize · maxFiles · disabled · loading
- → DSL: `FileUploader` 직매핑. 리스트=`StatusRow`(status), 진행=`Spinner`
- 판단: ☐

### SegmentedControl — 보유:✅ · 합의 7/8
- 해부: 한 컨테이너 인접 세그먼트+활성 인디케이터, 택1 뷰 전환
- 표준 props: options · value · size · fullWidth · disabled
- → DSL: `SegmentedControl` 직매핑. 필터/뷰 토글
- 판단: ☐

### Chip/ChoiceChips — 보유:✅ · 합의 6/8
- 해부: 둥근 캡슐 라벨(±아이콘/삭제) · 선택형/표시형
- 표준 props: label · selected · onRemove · disabled · variant
- → DSL: `Chip`+`Group`(wrap). 다중필터는 selected 토글, 표시전용은 `Badge`와 구분
- 판단: ☐

### TagsInput — 보유:🟡(MultiSelect+Chip) · 합의 4/8
- 해부: 필드 내 입력 토큰(Chip) 누적 · Enter/콤마 추가 · 자유입력 또는 옵션보조
- 표준 props: value[] · maxTags · allowDuplicates · data
- → DSL: `TextInput`+입력토큰 `Chip`(onRemove) `Group`. 옵션보조 시 `Popover`+`Menu`
- 판단: ☐

### MultiDatePicker — 보유:✅ · 합의 4/7
- 해부: 입력(선택 날짜 칩/카운트) · 캘린더(다중 토글 셀)
- 표준 props: value[] · maxSelections · dateFormat
- → DSL: `MultiDatePicker` 직매핑(불규칙 근무일·지정휴일). 선택표시 `Group`+`Text`
- 판단: ☐

### Calendar/Scheduler — 보유:✅(Calendar) · 합의 7/7
- 해부: 컨트롤(이전/다음·월연)·헤더(요일)·바디(날짜셀 그리드)·풋터
- 표준 props: value · onMonthChange · weekStartDay · weekendDays · showWeekNumbers
- → DSL: `Calendar` 직매핑. 셀 `Grid` 7열, 네비 `Group`+`Button`+`Icon`. 스케줄러 확장은 `Card` 일정블록
- 판단: ☐

### TimePicker — 보유:❌ · 합의 5/7 · **정산·근태 시각 입력**
- 해부: 시간 필드(HH:MM)+드롭다운 시·분(·AM/PM)
- 표준 props: value · format(12/24) · step · min/max · hideSeconds
- → DSL: 갭. `TextInput`(HH:MM 마스크)+`Popover` 안 `Select` 두 개(시·분) `Group`. **원자 신설 권고**
- 판단: ☐

## 데이터 표시
### List — 보유:🟡(ListPage·Stack) · 합의 6/8
- 해부: 수직 행 항목(리딩+본문+메타+액션)
- 표준 props: spacing · 구분선 · 헤더/푸터 · 선택·hover · 무한스크롤 · 액션슬롯
- → DSL: `Stack`(md)으로 `ObjectCard`/`StatusRow` 반복+`Divider`. 페이지단위 `ListPage`
- 판단: ☐

### Tree — 보유:✅ · 합의 6/8
- 해부: 들여쓰기 노드 계층 · 펼침 토글 · 선택/체크 · 리딩 아이콘
- 표준 props: expandedKeys · 단일/다중·체크 · 지연로딩 · 드래그 · 라인
- → DSL: `Tree` 직매핑. 노드=`Group`(Icon+Text), 상태=`Badge`, 빈상태 `EmptyState`
- 판단: ☐

### Tag — 보유:🟡(Chip) · 합의 6/8
- 해부: 라운드 라벨 · (아이콘·삭제 x) · 색 분류
- 표준 props: 색/상태 · 닫기 · 선택 · 아이콘 · size
- → DSL: `Chip` 매핑. 분류색 status, 묶음 `Group`(xs)
- 판단: ☐

### Avatar/AvatarGroup — 보유:🟡(Avatar) · 합의 7/8
- 해부: 원형 이미지/이니셜/아이콘 · 그룹은 겹쳐 +N 오버플로
- 표준 props: 이미지·이니셜·아이콘 · size · 모양 · 그룹 최대수·+N · 상태배지
- → DSL: `Avatar` 직매핑. **그룹=`Group`(xxs)으로 Avatar 반복+말미 +N Avatar** (보강). 상태배지=`Badge` 인접
- 판단: ☐

### Accordion/Collapse — 보유:❌ · 합의 7/8
- 해부: 헤더(제목+토글 아이콘)+펼침 패널 반복 · 단일/다중 펼침
- 표준 props: 펼침상태 · accordion 모드 · 아이콘 위치 · 경계 · disabled
- → DSL: 갭. `Stack`+`Card` 반복, 헤더=`SectionHeader`+`IconButton`(chevron), 본문 토글. **전용 `Accordion` 신설 권장**
- 판단: ☐

## 피드백
### Banner/Alert/InlineNotification — 보유:🟡(Callout) · 합의 8/8
- 해부: 인라인 비휘발 알림 · 톤 아이콘+제목/본문+(액션 ghost)+(닫기 X)
- 표준 props: tone info|success|warning|critical · title · dismissible · actions(0~2) · banner(전폭)
- → DSL: `Callout` 직대응. **갭 보강: ① success 톤 추가 ② onDismiss ③ actions**
- 판단: ☐

### Toast/Notification — 보유:❌ · 합의 8/8
- 해부: 화면 모서리 휘발성 피드백 · 상태아이콘+메시지+(액션)+자동소멸/닫기 · 스택 큐
- 표준 props: status · message · duration · action · placement
- → DSL: 갭. 핵심은 imperative API(toast.show)·포털·타이머 → 닫힌 props로 불가. **앱 셸 레벨 `ToastHost` 유기체 + `notify()` 훅, 셀만 Callout 토큰 재사용**
- 판단: ☐

### InlineError — 보유:✅(FormField.error) · 합의 7/8
- 해부: 필드 아래 한 줄 에러(danger 색+짧은 메시지+선택 아이콘)
- → DSL: `FormField.error`가 흡수. 단독은 `Text`(caption·danger). 매핑 완료
- 판단: ☐

### Progress(bar/ring/steps) — 보유:🟡(FileUploader 내부) · 합의 7/8
- 해부: 결정형(%)/단계형 진척 · 트랙+채움(bar)/원형(ring)/단계노드(steps)+(라벨·상태색)
- 표준 props: value(0~100) · status normal|success|error|active · variant bar|ring|steps · size
- → DSL: 갭(비결정형은 Spinner로 충족). **`Progress` 분자 신설(value·status·size, bar 우선)**, status는 기존 토큰 재사용
- 판단: ☐

### Spinner — 보유:✅ · 합의 8/8
- 해부: 비결정형 로딩 회전 인디케이터
- 표준 props: size sm|md|lg · (aria label)
- → DSL: `Spinner` 직매핑. Button.loading·DataTable loading에서 소비 중
- 판단: ☐

### EmptyState — 보유:✅ · 합의 7/8
- 해부: 0건/무결과 자리 · 아이콘+제목+설명+(CTA), 세로 중앙
- 표준 props: icon · title · description · action
- → DSL: `EmptyState` 직매핑. DataTable/Timeline에 내장. "무결과 vs 첫진입"은 icon/문구로 흡수
- 판단: ☐

### Tooltip — 보유:✅ · 합의 8/8
- 해부: hover/focus 시 짧은 텍스트 설명 · 화살표·자동 위치
- 표준 props: label · placement(자동) · children
- → DSL: `Tooltip` 직매핑. 리치 콘텐츠 필요 시 `Popover`로 승급
- 판단: ☐

## 오버레이
### Popover — 보유:✅ · 합의 8/8
- 해부: trigger anchor+floating content · arrow·padding · 비모달
- 표준 props: position · width(sm/md/lg) · open(click/hover) · dismiss(outside·ESC)
- → DSL: `Popover` 직매핑. content `Stack`(sm)+`Text`/`Button`
- 판단: ☐

### Menu/Dropdown — 보유:✅ · 합의 8/8
- 해부: trigger+anchored list · item(icon·label)·separator·group·danger item
- 표준 props: position · items(label·icon·danger·disabled) · dismiss(select·outside·ESC)
- → DSL: `Menu` 직매핑. item `Icon`+`Text`, 구분 `Divider`, 위험 text danger
- 판단: ☐

### Popconfirm — 보유:🟡(Popover) · 합의 6/8
- 해부: trigger 옆 소형 confirm bubble · icon+message+확인/취소
- 표준 props: position · title/message · ok/cancel(role·label)
- → DSL: `Popover`(width sm) 안 `Group`: `Icon`+`Text`, footer `Group`(xs)+`Button`(secondary 취소)+`Button`(danger 확인)
- 판단: ☐

## 네비게이션·액션
### Stepper/Wizard(표시기) — 보유:❌ · 합의 6/8 · **등록 마법사 빈출**
- 해부: 단계 노드(번호/체크)+커넥터+라벨 · 가로/세로·선형/비선형
- 표준 props: activeStep · steps(label·optional) · completed · orientation
- → DSL: 갭. `Group`/`Stack`에 단계=`Icon`(check/번호)+`Text`+`Divider`(커넥터), 색=primary(활성)·success(완료)·secondary(대기)·danger. **부품화 후보**
- 판단: ☐

### NavMenu — 보유:🟡(AppShell menuItems/Menu) · 합의 6/8
- 해부: 그룹 라벨+항목(아이콘+텍스트)+활성 강조 · 중첩 가능
- → DSL: 1차 네비는 `AppShell` menuItems. 액션/오버플로는 `Menu`. 다단 트리형은 `Tree`
- 판단: ☐

### Anchor/Link — 보유:✅ · 합의 8/8
- 해부: 이동 의미 텍스트 링크(href)·hover 밑줄
- 표준 props: href · children
- → DSL: `Anchor` 직매핑(Button과 의미 분리). 목차형(스크롤스파이)은 경계 밖
- 판단: ☐

### IconButton — 보유:✅ · 합의 7/8
- 해부: 정사각 영역 Icon 단독 · aria-label 필수
- 표준 props: icon · variant · size · disabled · aria-label
- → DSL: `IconButton` 직매핑. 툴팁은 맥락 보조
- 판단: ☐

### ButtonGroup — 보유:🟡(Group) · 합의 7/8
- 해부: 인접 버튼 묶음 · 균일 간격 · 연결형/분리형
- 표준 props: spacing · attached · orientation · align
- → DSL: 분리형 `Group`+`Button`×N(xs/sm). 연결형(attached)은 갭 — `Divider` 근사. 토글형은 `SegmentedControl`
- 판단: ☐

### ToggleButton — 보유:✅(SegmentedControl) · 합의 7/8
- 해부: 선택상태 유지 버튼 · 단일/다중 토글
- → DSL: `SegmentedControl` 직매핑(택일). 단일 토글은 2옵션 또는 Button variant 전환
- 판단: ☐

## 레이아웃
### Grid — 보유:✅ · 합의 8/8
- 해부: 2차원 컬럼/로우 · 반응형 트랙 · gutter
- 표준 props: columns · gap · areas · responsive
- → DSL: `Grid` 직매핑+spacing. 페이지 레벨은 `PageGrid`
- 판단: ☐

### Container — 보유:✅ · 합의 6/8
- 해부: 최대폭 제한+중앙 정렬 래퍼
- 표준 props: maxWidth · padding · centered
- → DSL: `Container` 직매핑. maxWidth narrow|default|wide(폼 narrow, 리스트 wide)
- 판단: ☐

### Divider — 보유:✅ · 합의 8/8
- 해부: 콘텐츠 구분 선(수평/수직·선택 라벨)
- 표준 props: orientation · spacing · label
- → DSL: `Divider` 직매핑
- 판단: ☐

## 패턴
### MasterDetail/SplitView — 보유:🟡(HierarchyExplorer) · 합의 6/8
- 해부: 좌 목록/트리(master)+우 상세(detail) 동기 패널
- 표준 props: items · selected · detail · resizable
- → DSL: `HierarchyExplorer`가 트리+상세 직접 충족. 평면형은 `Grid`(2col)+`ListPage`(좌)+`DetailPage`(우)
- 판단: ☐

### Settings page — 보유:🟡(FormSection) · 합의 6/8
- 해부: 좌 네비/섹션 헤더 + 그룹화된 설정 폼(토글·셀렉트) · 섹션별 저장
- → DSL: `FormSection`+`SectionHeader` 반복+`Container`(narrow)+`Divider`. 좌 네비 `Menu`
- 판단: ☐

---

# Tier B — 특수·드묾

### MaskedInput — 보유:🟡(TextInput) · 합의 4/8
- → DSL: `TextInput`+FieldSpec.mask 데이터(사업자번호·전화). 별도 부품 불필요
- 판단: ☐

### PinInput — 보유:🟡(InputGroup+TextInput) · 합의 5/8
- → DSL: `Group`(xs)에 length개 `TextInput`(maxLength=1). OTP·인증 한정
- 판단: ☐

### Slider — 보유:❌ · 합의 7/8
- → DSL: 갭. 정밀입력은 `NumberInput` 대체. 시각 슬라이더는 조립 불가
- 판단: ☐

### RangeSlider — 보유:❌ · 합의 4/8
- → DSL: 갭. 범위필터는 `DateRangeField` 또는 두 `NumberInput`(min/max)+`Text`("~")
- 판단: ☐

### Rating — 보유:❌ · 합의 5/8
- → DSL: 표시전용은 `Icon`(star)×N+`Group`. 입력 평점은 `SegmentedControl`(1~5)/`Select` 대체. ERP 희소
- 판단: ☐

### ColorInput — 보유:🟡(TextInput+Popover) · 합의 4/8
- → DSL: `Popover`(trigger=스와치 `Avatar`/`Chip`)+`TextInput`(hex)+프리셋 `Chip`. 테마설정 한정
- 판단: ☐

### RichTextEditor — 보유:❌ · 합의 4/8
- → DSL: 닫힌 DSL로 contentEditable 불가 → 명확한 갭. 평문은 `Textarea`. 비고/설명 한정
- 판단: ☐

### DateTimePicker — 보유:❌ · 합의 5/7
- → DSL: 갭. TimePicker 신설 후 `Popover`+`Calendar`+(시각)+확인 `Button`을 `Stack`으로 분자화
- 판단: ☐

### MonthPicker/YearPicker — 보유:❌ · 합의 4/7
- → DSL: 저비용 갭. `Popover`+`Grid`(월 3열/연 그리드)+`Button` 셀. **Calendar에 picker 모드 prop 확장 권고**(정산 월단위 빈출)
- 판단: ☐

### Transfer — 보유:❌ · 합의 3/8 · **권한 배정**
- → DSL: `Grid`(2열)+각 열 `Card`(`SectionHeader`+검색 `TextInput`+`Checkbox` 목록), 가운데 `Stack`+`IconButton`×2. 빈 열 `EmptyState`
- 판단: ☐

### Timeline — 보유:✅ · 합의 5/8
- → DSL: `Timeline` 직매핑. 노드색=status, 헤더=`Text`(primary)+`Text`(secondary)+`Icon`
- 판단: ☐

### Image — 보유:✅ · 합의 5/8
- → DSL: `Image` 직매핑(radius). 캡션 `Text`(secondary), 폴백 `EmptyState`/`Icon`
- 판단: ☐

### Code/Kbd — 보유:❌ · 합의 5/8
- → DSL: 근사=`Card`+`Text` 모노+`IconButton`(복사). 정식은 부품 신설. ERP 저빈도 후순위
- 판단: ☐

### Carousel — 보유:❌ · 합의 5/8
- → DSL: 갭. `Group`+`Card` 가로배열+`SegmentedControl` 페이지전환 근사. 저빈도 후순위
- 판단: ☐

### Result/StatusPage — 보유:🟡(EmptyState 유사) · 합의 4/8
- → DSL: EmptyState와 골격 동형. **EmptyState에 status: success|danger|info prop 추가로 흡수** 또는 얇은 래퍼. 신규 골격 불필요
- 판단: ☐

### Tour/Coachmark — 보유:❌ · 합의 3/8
- → DSL: 말풍선은 `Popover`+`Title`/`Text`+`Group`. 스포트라이트 마스크·타깃추적은 격리 CSS 필요. ERP 저빈도 후순위
- 판단: ☐

### ContextMenu — 보유:🟡(Menu) · 합의 6/8
- → DSL: `Menu`로 충족(트리거만 우클릭). ERP 빈도 낮음
- 판단: ☐

### HoverCard — 보유:🟡(Popover) · 합의 5/8
- → DSL: `Popover`(trigger=hover) content `Card`+`Stack`+`Title`+`Text`. 또는 `Tooltip`(텍스트 한정)
- 판단: ☐

### CommandPalette/Spotlight — 보유:❌ · 합의 4/8
- → DSL: `Modal`+`TextInput`(검색)+`Stack`(Button/Anchor 행)+`Text`(단축키). 키보드 네비는 호출부. ERP 비핵심 백로그
- 판단: ☐

### SplitButton — 보유:❌ · 합의 6/8
- → DSL: `Group`(none)+`Button`(기본)+`IconButton`(caret→`Menu` 트리거). attached는 근사
- 판단: ☐

### FAB — 보유:❌ · 합의 2/8 · **ERP 부적합**
- → DSL: 데스크탑 ERP 비표준. 주요 액션은 PageHeader 우측 primary Button. **미구현 권장**
- 판단: ☐

### SimpleGrid — 보유:🟡(Grid) · 합의 2/8
- → DSL: `Grid`로 흡수(균일 columns). 별도 부품 불필요
- 판단: ☐

### ScrollArea — 보유:❌ · 합의 4/8
- → DSL: overflow 토큰 부재 → 미구현. 긴 목록은 DataTable/ListPage 자체 스크롤
- 판단: ☐

### AspectRatio — 보유:❌ · 합의 4/8
- → DSL: 비율 토큰 부재 · ERP 저빈도 → 미구현 권장
- 판단: ☐

### BackToTop/Affix — 보유:❌ · 합의 2/8
- → DSL: fixed-position 속성 부재(className/style 금지) → DSL 경계 밖. 합의 약함 → 비도입 권장
- 판단: ☐

### Wizard(전체 플로우) — 보유:❌ · 합의 5/8
- → DSL: 갭. `SegmentedControl`(단계표시)+`FormSection`(현재단계)+`Group`(Back/Next). Stepper 표시기 신설과 연계
- 판단: ☐

---

## 부록 — 출처
각 항목 합의는 IBM Carbon · MS Fluent · Shopify Polaris · Ant Design · Google/MUI · Atlassian · Mantine · Radix/shadcn 공식 문서 교차 검증(+Adobe Spectrum·Element Plus 일부). 보유 판정은 `src/ui/_catalog.ts` 대조.
