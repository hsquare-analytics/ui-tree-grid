import * as React from 'react';
import { useEffect, useState } from 'react';

import { LoadPanel } from 'devextreme-react/load-panel';

import { PivotGridField } from '../tree-grid/gridField';
import PivotGrid, { FieldChooser } from 'devextreme-react/pivot-grid';
import { StateStoring } from 'devextreme-react/data-grid';

import { DiagGrid, DiagGridRes, DiagGridRes2, HospitalType } from '../tree-grid/type';

type DataStatus = 'pending' | 'loading' | 'success' | 'error';
type GridPivotState = {
  status: DataStatus;
  data: DiagGrid[];
};

export const getStandardMonth = (standardDate: string) => {
  return Number(standardDate.substr(5, 2));
};

export const getStandardDay = (standardDate: string) => {
  return Number(standardDate.substr(8, 2));
};

// 이번달 오늘날짜까지
export const getMtdRange = (standardDate: string) => {
  return getStandardMonth(standardDate) + '.1' + '~' + getStandardMonth(standardDate) + '.' + getStandardDay(standardDate);
};

// 올해 오늘까지
export const getYtdRange = (standardDate: string) => {
  return '1.1~' + getStandardMonth(standardDate) + '.' + getStandardDay(standardDate);
};

const DxPlanitTreeGrid = (props: any, ref: React.LegacyRef<PivotGrid> | undefined): JSX.Element => {
  const { currentHospitalType, chaStandardDate, diagnosisParamFilters, isMonth, isExpandMode } = props;
  const [blueColor, redColor] = ['rgb(26, 169, 228)', '#fd7e14'];
  const cellWidth = isExpandMode ? 92 : 92;
  const NaNData = Object.freeze(['hospitalType', 'medDeptNm', 'medrStfNm']);

  const [gridData, setGridData] = useState<GridPivotState>({
    status: 'loading',
    data: [],
  });
  const [originGridData, setOriginGridData] = useState<GridPivotState>({
    status: 'loading',
    data: [],
  });

  const [dateRange, setDateRange] = useState(getMtdRange(chaStandardDate));
  const [filterMode, setFilterMode] = useState(false);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [dataSource, setDataSource] = useState({});

  const isMountedRef = useIsMounted();

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
   * string 타입의 데이터를 모두 숫자로 변경
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

  const filteringGridData = (hospitalType: '' | 'A' | 'B', requestGrid?: GridPivotState): GridPivotState => {
    let hospital = '';
    const originData = requestGrid ?? originGridData;
    for (const [key, value] of Object.entries(hospitalNm)) {
      if (value === hospitalType) {
        hospital = key;
        break;
      }
    }
    if (hospital === '') {
      setFilterMode(false);
      return originData;
    }

    const newGridData = { ...originData };
    const data = newGridData.data?.filter((grid: DiagGrid) => grid.hospitalType === hospital);
    newGridData.data = data as DiagGrid[];

    if (data?.length) {
      setFilterMode(true);
      return newGridData;
    }

    return {
      status: 'success',
      data: [],
    };
  };

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

  const insertRowHeaderGroup = (e: any): void => {
    if (e.cell.type !== 'GT' || e.cell.text !== 'Grand Total') {
      return;
    }
    // 접었을 때: 셀 19
    // 펼쳤을 때: 셀 28
    if (e.area === 'column') {
      let innerHtml = '';
      if (isExpandMode) {
        innerHtml = `
          <table class="inner-table" style="table-layout: fixed" ref={$tableRef}>
            <tr>
              <td colspan="${isMonth ? 17 : 15}">${dateRange} 진료 수입<span class="small-day">(백만원)</span></td>
              <td colspan="9">${dateRange} 환자수<span class="small-day">(명)</span></td>
              <td colspan="6">${dateRange} 인당 수입<span class="small-day">(천원)</span></td>
            </tr>
            <tr>
              <td colspan="${isMonth ? 7 : 5}">전체</td>
              <td colspan="5">외래</td>
              <td colspan="5">입원</td>
              <td colspan="3">외래</td>
              <td colspan="3">입원</td>
              <td colspan="3">실입원</td>
              <td colspan="3">외래</td>
              <td colspan="3">입원</td>
            </tr>
          </table>
        `;
      } else {
        innerHtml = `
          <table class="inner-table" style="table-layout: fixed">
            <tr>
              <td colspan="${isMonth ? 10 : 9}">${dateRange} 진료 수입<span class="small-day">(백만원)</span></td>
              <td colspan="6">${dateRange} 환자수<span class="small-day">(명)</span></td>
              <td colspan="4">${dateRange} 인당 수입<span class="small-day">(천원)</span></td>
            </tr>
            <tr>
              <td colspan="${isMonth ? 4 : 3}">전체</td>
              <td colspan="3">외래</td>
              <td colspan="3">입원</td>
              <td colspan="2">외래</td>
              <td colspan="2">입원</td>
              <td colspan="2">실입원</td>
              <td colspan="2">외래</td>
              <td colspan="2">입원</td>
            </tr>
          </table>
        `;
      }
      e.cellElement.innerHTML = innerHtml;
    } else if (e.area === 'row') {
      e.cellElement.innerHTML = '<span style="display: block;text-align: center">합계</span>';
    }
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

  const onCellPrepared = (e: any) => {
    makeColorAtPercent(e);
    insertRowHeaderGroup(e);
    fixTagbleWidth(e);
    changeTotalText(e);
    changeNullToHipen(e);
  };

  const onContentReady = (e: any) => {
    // console.log(e);
    getGridSize();
  };

  const makeColorAtPercent = (e: any): void => {
    if (e.cell.format?.type === 'percent' && !Number.isNaN(e.cell.value)) {
      if (e.cell.value >= 1.1) {
        e.cellElement.style.color = blueColor;
      } else if (e.cell.value < 1) {
        e.cellElement.style.color = redColor;
      }
    }
  };

  // const dataSource = PivotGridField(gridData, hospitalNm, isMonth, isExpandMode, cellWidth);

  const getDateStandard = () => {
    if (isMonth) {
      setDateRange(getMtdRange(chaStandardDate));
    } else {
      setDateRange(getYtdRange(chaStandardDate));
    }
  };

  const params1 = {
    mtdOrYtd: isMonth ? 'mtd' : 'ytd',
    filters: diagnosisParamFilters,
    standardDate: chaStandardDate,
    useDoctorNmColumn: 'Y',
    hospitalType: currentHospitalType,
  };

  const params2 = { ...params1, useDoctorNmColumn: 'N' };

  const initGridData = (): void => {
    const init = {
      status: 'loading' as DataStatus,
      data: [] as DiagGrid[],
    };
    setOriginGridData(init);
    setGridData(init);
  };

  const resetPivotGridfield = (gridDataParam: GridPivotState): void => {
    setDataSource(PivotGridField(gridDataParam));
  };

  const requestGridData = async (): Promise<void> => {
    initGridData();

    // const hospital = await getDetailGrid(params2);
    // const doctor = await getDetailGrid(params1);
    // const grid = {
    //   status: 'success' as DataStatus,
    //   data: collapseGridData(factorial(doctor), factorial(hospital)),
    // };

    // const filterGrid = filteringGridData(currentHospitalType, grid);
    // setGridData(filterGrid);
    // setOriginGridData(grid);
    // resetPivotGridfield(filterGrid);
  };

  const resetSession = (): void => {
    sessionStorage.removeItem('pivotgrid-storing');
  };

  useEffect(() => {
    resetSession();
    requestGridData();
    getDateStandard();
  }, [chaStandardDate, diagnosisParamFilters, isMonth, isMountedRef]);

  useEffect(() => {
    if (gridData.data) {
      const newGridData = filteringGridData(currentHospitalType);
      setGridData(newGridData);
      resetPivotGridfield(newGridData);
    }
  }, [currentHospitalType]);

  useEffect(() => {
    resetPivotGridfield(gridData);
  }, [isExpandMode]);

  return (
    <div className="area-item-table table-wrapper diag-table-wrapper">
      <LoadPanel visible={gridData.status === 'loading'} position={{ of: '#dx-vera-pivotGrid' }} />
      {gridData.status === 'success' && gridData.data?.length && (
        <PivotGrid
          ref={ref}
          id={'dx-vera-pivotGrid'}
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowSorting={false}
          allowFiltering={false}
          allowExpandAll={true}
          showRowTotals={true}
          showColumnTotals={false}
          showColumnGrandTotals={true}
          showRowGrandTotals={!filterMode}
          showBorders={true}
          wordWrapEnabled={false}
          width={width}
          height={height}
          onContentReady={onContentReady}
          onCellPrepared={onCellPrepared}
        >
          <StateStoring enabled={gridData.status === 'success'} type="sessionStorage" storageKey="dx-vera-pivotgrid-storing" />
          <FieldChooser enabled={false} />
        </PivotGrid>
      )}
    </div>
  );
};

export default DxPlanitTreeGrid;
function useIsMounted() {
  throw new Error('Function not implemented.');
}
