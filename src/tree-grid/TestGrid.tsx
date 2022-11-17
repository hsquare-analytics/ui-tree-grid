import * as React from 'react';
import { useEffect, useState } from 'react';

import { LoadPanel } from 'devextreme-react/load-panel';

import { NaNData, PivotGridField } from './gridField';
import { FieldChooser } from 'devextreme-react/pivot-grid';
import { StateStoring } from 'devextreme-react/data-grid';

import { DiagGrid, DiagGridRes, DiagGridRes2, HospitalType } from './type';
import { TestGridData } from './data';
import DxPlanitTreeGrid from 'dx-planit-tree-grid/DxPlanitTreeGrid';

type DataStatus = 'pending' | 'loading' | 'success' | 'error';
type GridPivotState = {
  status: DataStatus;
  data: DiagGrid[];
};

const TestGrid = (): JSX.Element => {
  /**
   * to library
   */
  const [blueColor, redColor] = ['rgb(26, 169, 228)', '#fd7e14'];
  const cellWidth = 92;

  const [gridData, setGridData] = useState<GridPivotState>({
    status: 'loading',
    data: [],
  });
  const [originGridData, setOriginGridData] = useState<GridPivotState>({
    status: 'loading',
    data: [],
  });

  const [dataSource, setDataSource] = useState({});

  const hospitalNm: HospitalType = {
    분당본원: 'A',
    분당여성: 'B',
    분당난임: 'E',
  };

  const fieldByOnlyMed = [];

  /**
   * 각 기관별 의료진 데이터만 재귀적으로 추출
   * @param data 기관별 데이터
   * @param keys Object.keys(기관별 데이터)
   * @param index
   * @param array 반환 데이터
   * @return DiagGridRes[]
   */
  const extractArray = (data: any, keys: string[], index: number, array: DiagGridRes[] = []): DiagGridRes[] => {
    if (index === keys.length) {
      return array;
    }
    array.push(...data[keys[index]]);
    return extractArray(data, keys, index + 1, array);
  };

  const fixedNaN = (num: any): number => {
    const newNum = parseFloat(num);

    return newNum === null || Number.isNaN(newNum) ? 0 : newNum;
  };

  /**
   * string 타입의 데이터를 모두 숫자로 변경 to library
   * @param data
   * @return
   */
  const reformGridData = (data: DiagGridRes[]): DiagGrid[] => {
    return data.map((item: DiagGridRes) => {
      const newItem: any = { ...item };
      for (const key of Object.keys(newItem)) {
        if (NaNData.includes(key)) {
          continue;
        }
        const isPercent = typeof newItem[key] === 'string' && newItem[key].includes('%');

        newItem[key] = fixedNaN(newItem[key]);

        if (isPercent) {
          newItem[key] = newItem[key] / 100;
        }
      }

      return newItem;
    });
  };

  const factorial = (data: DiagGridRes2): DiagGrid[] => {
    const arr: DiagGridRes[] = [];
    Object.keys(data).forEach(key => arr.push(...extractArray(data[key], Object.keys(data[key]), 0, [])));
    return reformGridData(arr);
  };

  const initGridData = (): void => {
    const init = {
      status: 'loading' as DataStatus,
      data: [] as DiagGrid[],
    };
    setOriginGridData(init);
    setGridData(init);
  };

  const resetPivotGridfield = (gridDataParam: GridPivotState): void => {
    setDataSource(PivotGridField(gridDataParam, hospitalNm, cellWidth));
  };

  const requestGridData = async (): Promise<void> => {
    initGridData();

    const doctor = TestGridData;
    const grid = {
      status: 'success' as DataStatus,
      data: factorial(doctor),
    };

    setGridData(grid);
    setOriginGridData(grid);
    resetPivotGridfield(grid);
  };

  /**
   * to library
   */
  const resetSession = (): void => {
    sessionStorage.removeItem('dx-vera-pivotgrid-storing');
  };

  useEffect(() => {
    resetSession();
    requestGridData();
  }, []);

  return (
    <div className="area-item-table table-wrapper diag-table-wrapper">
      {gridData.status === 'success' && gridData.data?.length && (
        <DxPlanitTreeGrid dataSource={dataSource} color={{ color1: 'rgb(26, 169, 228)', color2: '#fd7e14' }} />
      )}
    </div>
  );
};

export default TestGrid;
