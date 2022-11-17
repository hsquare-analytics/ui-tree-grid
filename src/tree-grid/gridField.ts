import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DiagGrid, DiagGridRes2, ICellInfo } from './type';
import { CalcuateRate, ConvertToMillion, convertToNumber } from './convert-num-unit';
import DevExpress from 'devextreme';

type GridPivotState = {
  status: 'pending' | 'loading' | 'success' | 'error';
  data: DiagGrid[];
};

export const NaNData = Object.freeze(['hospitalType', 'medDeptNm', 'medrStfNm']);

export const PivotGridField = (
  gridData: GridPivotState,
  hospitalNm: { [k in keyof DiagGridRes2]: 'A' | 'B' | 'E' },
  cellWidth: number
): PivotGridDataSource => {
  return new PivotGridDataSource({
    fields: [
      // 진료 수입 - 전체
      {
        caption: '기관',
        dataField: 'hospitalType',
        area: 'row',
        width: 80,
        sortingMethod: (a: DevExpress.ui.dxPivotGrid.Cell, b: DevExpress.ui.dxPivotGrid.Cell) => {
          if (hospitalNm[a.value] > hospitalNm[b.value]) {
            return 1;
          } else if (hospitalNm[a.value] < hospitalNm[b.value]) {
            return -1;
          }
          return 0;
        },
      },
      {
        caption: '진료과',
        dataField: 'medDeptNm',
        area: 'row',
        width: 120,
      },
      {
        caption: '진료의',
        dataField: 'medrStfNm',
        area: 'row',
        width: 80,
      },
      {
        caption: '실적',
        dataField: 'allMtdAmt',
        area: 'data',
        dataType: 'number',
        width: cellWidth,
        summaryType: 'sum',
        customizeText: (d: { value?: string | number | Date | undefined; valueText?: string | undefined }) =>
          ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'allPyMtdAmtRate',
        area: 'data',
        width: cellWidth,
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('allMtdAmt'), e.value('allPyMtdAmtForDiv'));
        },
      },

      {
        caption: '목표달성률',
        dataField: 'outGoalMtdAmtRateMed',
        area: 'data',
        width: cellWidth,
        summaryType: 'custom',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('outMtdAmt'), e.value('outGoalMtdAmtForDivMed'));
        },
      },
      {
        caption: '실적',
        dataField: 'outMtdAmt',
        area: 'data',
        width: cellWidth,
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdAmtRate',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('outMtdAmt'), e.value('outPyMtdAmtForDiv'));
        },
      },

      // 진료 수입 - 입원

      {
        caption: '실적',
        dataField: 'inMtdAmt',
        area: 'data',
        width: cellWidth,
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'inPyMtdAmtRate',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('inMtdAmt'), e.value('inPyMtdAmtForDiv'));
        },
      },

      // 환자수 - 외래
      {
        caption: '실적',
        dataField: 'outMtdPtCnt',
        area: 'data',
        width: cellWidth,
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdPtCntRate',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('outMtdPtCnt'), e.value('outPyMtdPtCntForDiv'));
        },
      },

      //  환자수 - 입원
      {
        caption: '실적',
        dataField: 'inMtdPtCnt',
        area: 'data',
        width: cellWidth,
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'inPyMtdPtCntRate',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('inMtdPtCnt'), e.value('inPyMtdPtCntForDiv'));
        },
      },

      // 환자수 - 실입원
      {
        caption: '실적',
        dataField: 'realInMtdPtCnt',
        area: 'data',
        width: cellWidth,
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'realInPyMtdPtCntRate',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('realInMtdPtCnt'), e.value('realInPyMtdPtCntForDiv'));
        },
      },

      //  인당 수입 - 외래
      {
        caption: '실적',
        dataField: 'outMtdPerPtAmt',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000),
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('outMtdAmt'), e.value('outMtdPtCnt'));
        },
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdPerPtAmtRate',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          const cur = CalcuateRate(e.value('outMtdAmt'), e.value('outMtdPtCnt'));
          const old = CalcuateRate(e.value('outPyMtdAmtForDiv'), e.value('outPyMtdPtCntForDiv'));
          return CalcuateRate(cur, old);
        },
      },

      //  인당 수입 - 입원
      {
        caption: '실적',
        dataField: 'inMtdPerPtAmt',
        area: 'data',
        width: cellWidth,
        summaryType: 'avg',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000),
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('inMtdAmt'), e.value('inMtdPtCnt'));
        },
      },

      {
        caption: '전년대비',
        dataField: 'inPyMtdPerPtAmtRate',
        area: 'data',
        width: cellWidth,
        groupName: 'Address',
        summaryType: 'avg',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          const cur = CalcuateRate(e.value('inMtdAmt'), e.value('inMtdPtCnt'));
          const old = CalcuateRate(e.value('inPyMtdAmtForDiv'), e.value('inPyMtdPtCntForDiv'));
          return CalcuateRate(cur, old);
        },
      },
    ],
    store: gridData.data,
  });
};
