import * as React from 'react';
import { useEffect, useState } from 'react';

import { LoadPanel } from 'devextreme-react/load-panel';

import PivotGrid, { FieldChooser } from 'devextreme-react/pivot-grid';
import { StateStoring } from 'devextreme-react/data-grid';
import DevExpress from 'devextreme';
import { Guid } from './guid';

interface Props {
  dataSource: any;
  color?: { color1: string; color2: string };
  [prop: string]: any;
}

const TestGrid = (props: Props): JSX.Element => {
  const { dataSource, color } = props;

  const [blueColor, redColor] = [color?.color1, color?.color2];
  const guid = Guid();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

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

  const fixTagbleWidth = (e: any): void => {
    e.cellElement.style.width = e.cellElement.style.minWidth;
  };

  const changeTotalText = (e: any): void => {
    if (e.cell.type === 'T') {
      const text = e.cell.text.replace('Total', '합계');
      e.cellElement.innerHTML = `<span>${text}</span>`;
    }
  };

  /**
   * null값이나 0, '0.0%' 를 하이픈으로 모두 변경
   * @param e devextreme onCellPrepared parameter
   */
  const changeNullToHipen = (e: any): void => {
    if (
      e.area === 'data' &&
      (e.cell.text === null || e.cell.text === 0 || e.cell.text === '0' || e.cell.text === '0.0%' || e.cell.text === '')
    ) {
      e.cellElement.innerHTML = '<span class="text-color">-</span>';
    }
  };

  const onCellPrepared = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent) => {
    makeColorAtPercent(e);
    // insertRowHeaderGroup(e);
    fixTagbleWidth(e);
    changeTotalText(e);
    changeNullToHipen(e);
  };

  const onContentReady = (e: any) => {
    getGridSize();
  };

  /**
   * 데이터에 색상 적용
   * @param e onCellPrepared 이벤트
   * @returns
   */
  const makeColorAtPercent = (e: any): void => {
    if (!blueColor || !redColor) {
      return;
    }

    if (!e.cellElement) {
      return;
    }

    if (e.cell?.format?.type === 'percent' && !Number.isNaN(e.cell.value)) {
      if (e.cell.value >= 1.1) {
        e.cellElement.style.color = blueColor;
      } else if (e.cell.value < 1) {
        e.cellElement.style.color = redColor;
      }
    }
  };

  /**
   * 그리드 펼침 정보 세션스토리지 리셋
   */
  const resetSession = (): void => {
    sessionStorage.removeItem('dx-vera-pivotgrid-storing');
  };

  useEffect(() => {
    resetSession();
  }, []);

  return (
    <div className="area-item-table table-wrapper diag-table-wrapper">
      <LoadPanel position={{ of: '#' + guid }} />
      <PivotGrid
        id={guid}
        dataSource={dataSource}
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
        <StateStoring enabled={true} type="sessionStorage" storageKey="dx-vera-pivotgrid-storing" />
        <FieldChooser enabled={false} />
      </PivotGrid>
    </div>
  );
};

export default TestGrid;
