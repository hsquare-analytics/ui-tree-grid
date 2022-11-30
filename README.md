# DevExtreme Planit Tree Grid

DevExtreme Planit Tree Grid는 Devextreme의 PivotGrid에 Colspan과 컬러 지정 기능 등의 몇 가지 추가 기능을 설정한 React Wrapper입니다.
코드는 React와 typescript로 작성되었으며, DevExtreme 22.1 버전에서 테스트 되었습니다.

## Dependecies

엑셀 다운로드 기능을 위해 아래의 두 의존성을 반드시 설치해야 합니다.

```
npm install exceljs

npm install file-saver
```

## Getting Started

DevExtreme이 설치되어 있어야 합니다.

```
npm install devextreme
```

```
npm install devextreme-planit-treegrid-react
```

사용 방법은 DevExtreme의 PivotGrid의 사용방법과 같습니다. [DevExtreme PivotGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPivotGrid/)의 기능을 그대로 사용하실 수 있습니다.

```
import DxPlanitTreeGrid from 'devextreme-planit-treegrid-react'

<DxPlanitTreeGrid
  id='dx-planit-vera-pivotgrid-id'
  ref={$childRef}
  dataSource={dataSource}
  groupField={TreeDataGroup}
  dataColor={[
    { format: 'percent', color: 'rgb(26, 169, 228)', condition: '>= 110' },
    { format: 'percent', color: '#fd7e14', condition: '< 100' },
  ]}
  convertNullToHipen={true}
  convertZeroToHipen={true}
  stateStoringKey={'dx-vera-pivotgrid-storing'}
  allowSortingBySummary={true}
  ...
/>
```

DevExtreme PivotGrid에 몇몇 기능이 추가되었습니다. 추가된 기능은 아래와 같습니다.

### 1. dataColor

특정 조건 데이터의 컬러를 직접 지정하실 수 있습니다.

1. format: [DevExtreme PivotGrid Data Format](https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/Format/) 타입을 사용하실 수 있습니다.
2. color: (string) 사용하고자 하는 컬러값을 rgba 혹은 hex 형식으로 입력합니다.
3. condition: (string) 컬러값을 사용할 조건을 입력합니다.(예: 100보다 큰 수에만 컬러를 적용하고자 하는 경우 '> 100')

### 2. convertNullToHipen

value가 null 인 데이터를 하이픈('-')으로 보여줍니다.

### 3. convertZeroToHipen

value가 0 | '0' | '0%' 인 데이터를 하이픈('-')으로 보여줍니다.

### 4. groupField

groupField는 그리드 상단에 colspan 된 새로운 column을 생성합니다. 자세한 사용법은 github의 demo 폴더를 확인하십시오.

```
export const TreeDataGroup: IGroupField[] = [
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

\*\*Note: [DevExtreme PivotGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPivotGrid/) 중 아래의 기능은 사용 불능 처리되었습니다.

> width, height, showColumnGrandTotals, showColumnTotals, showRowGrandTotals, FieldChooser

\*\*Note: [DevExtreme PivotGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxPivotGrid/) 중 아래의 기능은 사용 방법이 변경되었습니다.

> &lt;StateStoring enabled='true' /&gt; 은 stateStoringKey: boolean property로 대체되었습니다.
>
> stateStoringKey가 없을 경우, &lt;StateStoring enabled='false' /&gt; 와 동일하게 작동합니다.

```
<DxPlanitTreeGrid
  stateStoringKey={'dx-vera-pivotgrid-storing'}
  ...
/>
```
