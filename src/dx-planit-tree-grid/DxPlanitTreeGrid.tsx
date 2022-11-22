import { useEffect, useState } from 'react';

import { LoadPanel } from 'devextreme-react/load-panel';

import PivotGrid, { FieldChooser } from 'devextreme-react/pivot-grid';
import { StateStoring } from 'devextreme-react/data-grid';
import DevExpress from 'devextreme';
import { IGroupField } from './type';
import { Format } from 'devextreme/localization';

interface IColorInfo {
  format: Format;
  color: string;
  condition: string;
}

interface Props {
  dataSource: any;
  groupField?: IGroupField[];
  dataColor?: IColorInfo[];
  convertNullToHipen?: boolean;
  convertZeroToHipen?: boolean;
  stateStoring?: boolean;
  [prop: string]: any;
}

/**
 * todoList:
 * 2) columIndex 초기화 기능이 있어야 함(column 개수 변할 때)
 */

const grandTotalCssNm = 'data-grand-total';

const DxPlanitTreeGrid = (props: Props): JSX.Element => {
  const { dataSource, groupField, dataColor, convertNullToHipen = true, convertZeroToHipen = true, stateStoring = true } = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isVisibleGrid, setIsVisibleGrid] = useState(true);
  const [columnIndex, setColumnIndex] = useState(0);

  /**
   * 그리드 사이즈 재조정
   * @returns 그리드 사이즈
   */
  const getGridSize = (): { width: number; height: number } => {
    const wrapper = document.querySelector('.diag-table-wrapper');
    const gap = 10;
    setWidth(wrapper?.clientWidth ?? 0);
    setHeight(wrapper ? wrapper.clientHeight - gap : 0);

    window.addEventListener('resize', () => {
      setWidth(wrapper?.clientWidth ?? 0);
      setHeight(wrapper ? wrapper.clientHeight - gap : 0);
    });
    return { width, height };
  };

  /**
   * 'Total' 을 한글로 변경
   * @param e devextreme CellPreparedEvent
   */
  const changeTotalText = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
    if (!e.cellElement) {
      return;
    }
    if (e.cell?.type === 'T') {
      const text = e.cell.text?.replace('Total', '합계');
      e.cellElement.innerHTML = `<span>${text}</span>`;
    }
  };

  /**
   * null값이나 0, '0.0%' 를 하이픈으로 모두 변경
   * @param e devextreme CellPreparedEvent
   */
  const changeNullToHipen = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
    if (!convertNullToHipen) {
      return;
    }
    if (e.area === 'data' && e.cell?.text === null && e.cellElement) {
      e.cellElement.innerHTML = '<span class="text-color">-</span>';
    }
  };

  /**
   * null값이나 0, '0.0%' 를 하이픈으로 모두 변경
   * @param e devextreme CellPreparedEvent
   */
  const changeZeroToHipen = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
    if (!convertZeroToHipen) {
      return;
    }
    if (e.area === 'data' && (e.cell?.text === '0' || e.cell?.text === '0.0%' || e.cell?.text === '') && e.cellElement) {
      e.cellElement.innerHTML = '<span class="text-color">-</span>';
    }
  };

  /**
   * 테이블 헤더에 colspan, rowspan 한 HTMLElement 정보 반환
   * @param groupField 사용자가 작성한 그룹 정보
   * @return
   */
  const makeColspan = (group: IGroupField): HTMLElement => {
    const td = document.createElement('td');
    let text = group.groupCaption;

    if (group.depth === 1) {
      text = `${group.groupCaption}`;
    }

    td.setAttribute('colspan', group.colspan.toString());
    td.setAttribute('class', 'dx-row-total dx-grand-total dx-planit-colspan');
    td.innerHTML = `<div>${text}</div>`;

    return td;
  };

  /**
   * 그룹 필드 데이터 유효성 검증용 데이터 생성
   * @param groupField
   * @returns
   */
  const makeCheckGroupData = (groupField: IGroupField[]): any => {
    const data: any = {};

    groupField?.forEach((group: IGroupField) => {
      if (data[group.depth]) {
        data[group.depth] += group.colspan;
      } else {
        data[group.depth] = group.colspan;
      }
    });

    return data;
  };

  /**
   * GroupField 데이터 검증
   * @param 사용자가 설정한 그룹 필드 정보
   * @returns 데이터 검증 결과
   */
  const isCheckGroupField = (groupField: IGroupField[]): boolean => {
    const map = makeCheckGroupData(groupField);

    for (const depth of Object.keys(map)) {
      if (map[depth] !== columnIndex + 1) {
        console.error('그룹 데이터의 children 숫자가 columnIndex와 맞지 않습니다. 다시 한 번 확인 바랍니다.');
      }
    }

    return true;
  };

  /**
   * Grand Total 셀 정보 저장
   * @param e
   */
  const setTotalElementInfo = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
    if (!groupField?.length || e.cell?.type !== 'GT' || e.cell?.text !== 'Grand Total') {
      return;
    }

    e.cellElement?.classList.add(grandTotalCssNm);
  };

  /**
   * cell의 columnIndex 최대값 저장
   * @param e
   */
  const setMaxColumIndex = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
    if (!e.columnIndex) {
      return;
    }
    if (e.columnIndex > columnIndex) {
      setColumnIndex(e.columnIndex);
    }
  };

  /**
   * 테이블 헤더에 그룹 정보 삽입
   */
  const insertRowHeaderGroup = (): void => {
    if (!groupField?.length) {
      return;
    }

    isCheckGroupField(groupField);

    const totalElement = document.querySelector('.' + grandTotalCssNm);
    const targetElement = totalElement?.parentNode;
    const thead = targetElement?.parentNode;

    if (!targetElement || !thead) {
      return;
    }

    const firstChild = thead?.firstChild;
    if (!firstChild) {
      return;
    }

    thead.removeChild(firstChild);

    const groupData = groupField.slice();
    const set = new Set(groupData.map((group: IGroupField) => group.depth));
    const depth = Array.from(set).sort(function compare(a: number, b: number) {
      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    });

    depth.forEach((dep: number) => {
      const groupInfo = groupData.filter((group: IGroupField) => group.depth === dep);
      const tr = document.createElement('tr');
      groupInfo.forEach((group: IGroupField) => {
        tr.appendChild(makeColspan(group));
      });
      thead.prepend(tr);
    });
  };

  /**
   * 사용자가 입력한 컬러 조건을 { standard: string; condition: string } 형식으로 변경 반환
   * @param condition 사용자 입력 컬러 조건식 ex) '>= 100'
   * @returns
   */
  const makeSplitCondtion = (condition: string): { standard: string; condition: string } => {
    const newCondition = { standard: '', condition: '' };
    [...condition].forEach((cond: string) => {
      if (Number.isNaN(parseFloat(cond))) {
        newCondition.condition += cond;
      } else {
        newCondition.standard += cond;
      }
    });

    return newCondition;
  };

  /**
   * 데이터에 색상 적용
   * @param e onCellPrepared 이벤트
   * @returns
   */
  const makeColorAtPercent = (e: any): void => {
    if (!dataColor || !e.cellElement) {
      return;
    }

    dataColor.forEach((color: IColorInfo) => {
      if (e.cell.value === null) {
        return;
      }
      if (e.cell?.format?.type === color.format && !Number.isNaN(e.cell.value)) {
        const standardData = makeSplitCondtion(color.condition.replace(/(\s*)/g, ''));
        const rate = color.format === 'percent' ? 0.01 : 1;
        let condition = false;
        // console.log(e.cell.value);

        switch (standardData.condition) {
          case '>':
            condition = e.cell.value > parseFloat(standardData.standard) * rate;
            break;
          case '>=':
            condition = e.cell.value >= parseFloat(standardData.standard) * rate;
            break;
          case '<':
            condition = e.cell.value < parseFloat(standardData.standard) * rate;
            break;
          case '<=':
            condition = e.cell.value <= parseFloat(standardData.standard) * rate;
            break;
        }

        if (condition && !(e.cell.value === 0 && convertZeroToHipen)) {
          e.cellElement.style.color = color.color;
        }
      }
    });
  };

  /**
   * 그리드 펼침 정보 세션스토리지 리셋
   */
  const resetSession = (): void => {
    sessionStorage.removeItem('dx-vera-pivotgrid-storing');
  };

  const onCellPrepared = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent) => {
    makeColorAtPercent(e);
    setTotalElementInfo(e);
    setMaxColumIndex(e);
    changeTotalText(e);
    changeNullToHipen(e);
    changeZeroToHipen(e);
  };

  const onContentReady = () => {
    setTimeout(() => insertRowHeaderGroup(), 0);
    setIsVisibleGrid(true);
    getGridSize();
  };

  useEffect(() => {
    setIsVisibleGrid(false);
    resetSession();
  }, [dataSource]);

  return (
    <div className="area-item-table table-wrapper diag-table-wrapper">
      <LoadPanel position={{ of: '#dx-planit-vera-pivotgrid-id' }} />
      <PivotGrid
        // visible={isVisibleGrid}
        id={'dx-planit-vera-pivotgrid-id'}
        dataSource={dataSource}
        hideEmptySummaryCells={false}
        allowSortingBySummary={true}
        allowSorting={false}
        allowFiltering={false}
        allowExpandAll={true}
        showRowTotals={true}
        showColumnTotals={false}
        showColumnGrandTotals={true}
        showRowGrandTotals={false}
        showBorders={true}
        wordWrapEnabled={false}
        width={width}
        height={height}
        onContentReady={onContentReady}
        onCellPrepared={onCellPrepared}
      >
        <StateStoring enabled={stateStoring} type="sessionStorage" storageKey="dx-vera-pivotgrid-storing" />
        <FieldChooser enabled={false} />
      </PivotGrid>
    </div>
  );
};

export default DxPlanitTreeGrid;
