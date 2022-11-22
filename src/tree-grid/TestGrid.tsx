import { useEffect, useState } from 'react';

import { PivotGridField, TreeDataGroup } from './gridField';

import { DiagGrid } from './type';
import { TestGridData } from './data';
import DxPlanitTreeGrid from 'dx-planit-tree-grid/DxPlanitTreeGrid';

type DataStatus = 'pending' | 'loading' | 'success' | 'error';
type GridPivotState = {
  status: DataStatus;
  data: DiagGrid[];
};

const TestGrid = (): JSX.Element => {
  const NaNData = Object.freeze(['hospitalType', 'medDeptNm', 'medrStfNm']);

  const [gridData, setGridData] = useState<GridPivotState>({
    status: 'loading',
    data: [],
  });

  const [dataSource, setDataSource] = useState({});

  /**
   * NaN일 경우 number 타입으로 변환
   * @param num
   * @returns
   */
  const fixedNaN = (num: any): number => {
    const newNum = parseFloat(num);

    return newNum === null || Number.isNaN(newNum) ? 0 : newNum;
  };

  /**
   * string 타입의 데이터를 모두 숫자로 변경
   * @param data
   * @return
   */
  const reformGridData = (data: DiagGrid[]): DiagGrid[] => {
    return data.map((item: DiagGrid) => {
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

  /**
   * 그리드 데이터 초기화
   */
  const initGridData = (): void => {
    const init = {
      status: 'loading' as DataStatus,
      data: [] as DiagGrid[],
    };
    setGridData(init);
  };

  /**
   * 그리드 데이터 reset
   * @param gridDataParam
   */
  const resetPivotGridfield = (gridDataParam: GridPivotState): void => {
    setDataSource(PivotGridField(gridDataParam));
  };

  /**
   * 그리드 데이터 불러오기
   */
  const requestGridData = async (): Promise<void> => {
    initGridData();

    const doctor = await TestGridData;
    const grid = {
      status: 'success' as DataStatus,
      data: reformGridData(doctor),
    };

    setGridData(grid);
    resetPivotGridfield(grid);
  };

  useEffect(() => {
    requestGridData();
  }, []);

  return (
    <div className="table-wrapper">
      {gridData.data?.length && (
        <DxPlanitTreeGrid
          dataSource={dataSource}
          groupField={TreeDataGroup}
          dataColor={[
            { format: 'percent', color: 'rgb(26, 169, 228)', condition: '>= 110' },
            { format: 'percent', color: '#fd7e14', condition: '< 100' },
          ]}
          convertNullToHipen={true}
          convertZeroToHipen={true}
          stateStoring={true}
        />
      )}
    </div>
  );
};

export default TestGrid;
