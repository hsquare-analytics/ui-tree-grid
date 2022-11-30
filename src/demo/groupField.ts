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
    groupCaption: '환자수 (명)',
    groupName: 'mediIncome',
    html: '환자수 <em>(명)</em>',
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
    groupCaption: '인당 수입 (천원)',
    groupName: 'personIncome',
    html: '인당 수입 <em>(천원)</em>',
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
