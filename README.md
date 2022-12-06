# DevExtreme Planit Tree Grid

DevExtreme Planit Tree Grid는 Devextreme의 PivotGrid에 Colspan과 컬러 지정 기능 등의 몇 가지 추가 기능을 설정한 React Wrapper입니다.
코드는 React와 typescript로 작성되었으며, DevExtreme 22.1 버전에서 테스트 되었습니다.

## Demo

[DEMO](https://bcahn.github.io/dxTreeGrid/)

## Dependecies

엑셀 다운로드 기능을 위해 아래의 두 의존성을 반드시 설치해야 합니다.

```
npm install exceljs

npm install file-saver
```

## Getting Started

DevExtreme이 설치되어 있어야 합니다.

```
npm install devextreme devextreme-react
```

```
npm install devextreme-planit-treegrid-react
```

사용 방법은 DevExtreme의 PivotGrid의 사용방법과 같습니다. [DevExtreme PivotGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPivotGrid/)의 기능을 그대로 사용하실 수 있습니다.

```
import DxPlanitTreeGrid from 'devextreme-planit-treegrid-react'

<>
  <LoadPanel position={{ of: 'dx-planit-vera-pivotgrid-id' }} />
  <DxPlanitTreeGrid
    id="dx-planit-vera-pivotgrid-id"
    ref={$childRef}
    dataSource={dataSource}
    groupField={TreeDataGroup}
    dataColor={[
      { format: 'percent', color: 'rgb(26, 169, 228)', condition: '>= 110' },
      { format: 'percent', color: '#fd7e14', condition: '< 100' },
    ]}
    convertNullToHipen={true}
    convertZeroToHipen={true}
    allowSortingBySummary={true}
    allowFiltering={true}
    allowSorting={true}
    language={'ko'} // 'ko' | 'en'
    ...
  >
    <HeaderFilter allowSearch={true} showRelevantValues={true} />
    <FieldPanel visible={true} />
    <StateStoring enabled={true} type="sessionStorage" storageKey={'dx-vera-pivotgrid-storing'} />
  </DxPlanitTreeGrid>
</>
```

```
**Note: id가 필수사항은 아니지만 가급적 사용할 것을 권고합니다. id를 사용하지 않으면 한 페이지에 여러 개의 Tree Grid를 생성할 경우 DevExtreme의 Load Pannel이 의도치 않은 곳에 생성될 수 있습니다.
```

DevExtreme PivotGrid에 몇몇 기능이 추가되었습니다. 추가된 기능은 아래와 같습니다.

### 1. dataColor

> type: {
> format: [Format](https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/Format/);
> color: string;
> condition: string;
> } <br />
> default value: null

특정 조건 데이터의 컬러를 직접 지정하실 수 있습니다.

1. format: [DevExtreme PivotGrid Data Format](https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/Format/) 타입을 사용하실 수 있습니다.
2. color: (string) 사용하고자 하는 컬러값을 rgba 혹은 hex 형식으로 입력합니다.
3. condition: (string) 컬러값을 사용할 조건을 입력합니다.(예: 100보다 큰 수에만 컬러를 적용하고자 하는 경우 '> 100')

### 2. convertNullToHipen

value가 null 인 데이터를 하이픈('-')으로 보여줍니다.

> type: boolean <br />
> default value: true

### 3. convertZeroToHipen

value가 0 | '0' | '0%' 인 데이터를 하이픈('-')으로 보여줍니다.

> type: boolean<br />
> default value: true

### 4. groupField

groupField는 그리드 상단에 colspan 된 새로운 column을 생성합니다. 자세한 사용법은 github의 demo 폴더를 확인하십시오.

> type: {
> groupCaption: string;
> groupName?: string;
> html?: string;
> depth: number;
> colspan: number;
> }[]<br />
> default value: null

### 5. language

> type: 'ko' | 'en' <br />
> default value: 'en'

한국어 설정을 할 수 있습니다.

```
import { TypeDxPlanit } from 'devextreme-planit-treegrid-react';

export const TreeDataGroup: TypeDxPlanit.IGroupField[] = [
  {
    groupCaption: '진료 수입 (백만원)',
    groupName: 'mediIncome',
    html: '진료 수입 <em>(백만원)</em>',
    depth: 1,
    colspan: 7,
  },
  {
    groupCaption: '전체',
    groupName: 'mediIncomeAll',
    depth: 2,
    colspan: 3,
  },

  ....

```

\*\*Note: [DevExtreme PivotGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPivotGrid/) 의 property중 아래의 기능은 사용 불능 처리되었습니다.

> width, height, showColumnGrandTotals, showColumnTotals, showRowGrandTotals, FieldChooser

\*\*Note: [DevExtreme PivotGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPivotGrid/) 추가 기능 중 아래의 기능은 일부 제한되었습니다.

> &lt;FieldPanel enabled='true' /&gt; 의 속성 중 showColumnFields, showDataFields, showFilterFields 은 사용 불능 처리되었습니다.
