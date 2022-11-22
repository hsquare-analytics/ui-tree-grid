import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DiagGrid, ICellInfo } from './type';
import { CalcuateRate, ConvertToMillion, convertToNumber } from './convert-num-unit';
import { IGroupField } from 'dx-planit-tree-grid/type';

type GridPivotState = {
  status: 'pending' | 'loading' | 'success' | 'error';
  data: DiagGrid[];
};

export const TreeDataGroup: IGroupField[] = [
  {
    groupCaption: '진료 수입 <em>(백만원)</em>',
    groupName: 'mediIncome',
    depth: 1,
    colspan: 7,
  },
  {
    groupCaption: '전체',
    groupName: 'mediIncomeAll',
    depth: 2,
    colspan: 3,
  },
  {
    groupCaption: '외래',
    groupName: 'mediIncomeOut',
    depth: 2,
    colspan: 2,
  },
  {
    groupCaption: '입원',
    groupName: 'mediIncomeIn',
    depth: 2,
    colspan: 2,
  },
  {
    groupCaption: '환자수',
    groupName: 'mediIncome',
    depth: 1,
    colspan: 6,
  },
  {
    groupCaption: '외래',
    groupName: 'patientOut',
    depth: 2,
    colspan: 2,
  },
  {
    groupCaption: '입원',
    groupName: 'patientIn',
    depth: 2,
    colspan: 2,
  },
  {
    groupCaption: '실입원',
    groupName: 'patientRealIn',
    depth: 2,
    colspan: 2,
  },
  {
    groupCaption: '인당 수입',
    groupName: 'personIncome',
    depth: 1,
    colspan: 4,
  },
  {
    groupCaption: '외래',
    groupName: 'personIncomeOut',
    depth: 2,
    colspan: 2,
  },
  {
    groupCaption: '입원',
    groupName: 'personIncomeIn',
    depth: 2,
    colspan: 2,
  },
];

export const PivotGridField = (gridData: GridPivotState): PivotGridDataSource => {
  return new PivotGridDataSource({
    fields: [
      {
        caption: '기관',
        dataField: 'hospitalType',
        area: 'row',
        width: 80,
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
      // 진료 수입 - 전체
      {
        caption: '실적',
        dataField: 'allMtdAmt',
        area: 'data',
        dataType: 'number',
        summaryType: 'sum',
        customizeText: (d: { value?: string | number | Date | undefined; valueText?: string | undefined }) =>
          ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'allPyMtdAmtRate',
        area: 'data',
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
        area: 'data',
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdAmtRate',
        area: 'data',
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
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => ConvertToMillion(d.value, 1000000),
      },
      {
        caption: '전년대비',
        dataField: 'inPyMtdAmtRate',
        area: 'data',
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
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'outPyMtdPtCntRate',
        area: 'data',
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
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'inPyMtdPtCntRate',
        area: 'data',
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
        summaryType: 'sum',
        customizeText: (d: ICellInfo) => convertToNumber(d.value).toLocaleString('en'),
      },
      {
        caption: '전년대비',
        dataField: 'realInPyMtdPtCntRate',
        area: 'data',
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
