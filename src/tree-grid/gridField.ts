import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DiagGrid, ICellInfo } from './type';
import { CalcuateRate, ConvertToMillion, convertToNumber } from './convert-num-unit';

type GridPivotState = {
  status: 'pending' | 'loading' | 'success' | 'error';
  data: DiagGrid[];
};

export const PivotGridField = (gridData: GridPivotState): PivotGridDataSource => {
  return new PivotGridDataSource({
    fields: [
      {
        caption: '기관',
        dataField: 'hospitalType',
        area: 'row',
        name: '',
        width: 80,
      },
      {
        caption: '진료과',
        dataField: 'medDeptNm',
        area: 'row',
        name: '',
        width: 120,
      },
      {
        caption: '진료의',
        dataField: 'medrStfNm',
        area: 'row',
        name: '',
        width: 80,
      },

      // 진료 수입 - 전체

      {
        caption: '실적',
        dataField: 'allMtdAmt',
        area: 'data',
        name: 'allMtdAmt',
        dataType: 'number',
        summaryType: 'sum',
        customizeText: (d: { value?: string | number | Date | undefined; valueText?: string | undefined }) =>
          ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'allPyMtdAmtRate',
        area: 'data',
        name: 'allPyMtdAmtRate',
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
        name: 'outGoalMtdAmtRateMed',
        summaryType: 'custom',
        format: {
          type: 'percent',
          precision: 1,
        },
        calculateSummaryValue: (e): number => {
          return CalcuateRate(e.value('outMtdAmt'), e.value('outGoalMtdAmtForDivMed'));
        },
      },

      // 진료 수입 - 외래
      {
        caption: '실적',
        dataField: 'outMtdAmt',
        name: 'outMtdAmt',
        area: 'data',
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdAmtRate',
        area: 'data',
        name: 'outPyMtdAmtRate',
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
        name: 'inMtdAmt',
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'inPyMtdAmtRate',
        area: 'data',
        name: 'inPyMtdAmtRate',
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
        name: 'outMtdPtCnt',
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdPtCntRate',
        area: 'data',
        name: 'outPyMtdPtCntRate',
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
        name: 'inMtdPtCnt',
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'inPyMtdPtCntRate',
        area: 'data',
        name: 'inPyMtdPtCntRate',
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
        name: 'realInMtdPtCnt',
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'realInPyMtdPtCntRate',
        area: 'data',
        name: 'realInPyMtdPtCntRate',
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
        name: 'outMtdPerPtAmt',
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
        name: 'outPyMtdPerPtAmtRate',
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
        name: 'inMtdPerPtAmt',
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
        name: 'inPyMtdPerPtAmtRate',
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
