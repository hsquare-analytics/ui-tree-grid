export interface DiagGridRes {
  hospitalType: string;
  acrsTp: string;
  medDeptNm: string;
  medrStfNm: string;
  allGoalMtdAmtRate: string;
  allMtdAmt: string;
  allPyMtdAmtRate: string;
  allPyMtdAmtForDiv: string;
  allRefMtdAmtRate: string;
  outGoalMtdAmtRate: string;
  outMtdAmt: string;
  outPyMtdAmtRate: string;
  outPyMtdAmtForDiv: string;
  inGoalMtdAmtRate: string;
  inMtdAmt: string;
  inPyMtdAmtRate: string;
  inPyMtdAmtForDiv: string;
  outMtdPtCnt: string;
  outPyMtdPtCntRate: string;
  outPyMtdPtCntForDiv: string;
  inMtdPtCnt: string;
  inPyMtdPtCntRate: string;
  inPyMtdPtCntForDiv: string;
  realInMtdPtCnt: string;
  realInPyMtdPtCntRate: string;
  realInPyMtdPtCntForDiv: string;
  outMtdPerPtAmt: string;
  outPyMtdPerPtAmtRate: string;
  outPyMtdPerPtAmtForDiv: string;
  inMtdPerPtAmt: string;
  inPyMtdPerPtAmtRate: string;
  inPyMtdPerPtAmtForDiv: string;
  allYtdAmt: string;
  allPyYtdAmtRate: string;
  allGoalYtdAmtRate: string;
  outYtdAmt: string;
  outPyYtdAmtRate: string;
  outPyYtdAmtForDiv: string;
  outGoalYtdAmtRate: string;
  inYtdAmt: string;
  inPyYtdAmtRate: string;
  inGoalYtdAmtRate: string;
  outYtdPtCnt: string;
  outPyYtdPtCntRate: string;
  outPyYtdPtCntForDiv: string;
  inYtdPtCnt: string;
  inPyYtdPtCntRate: string;
  inPyYtdPtCntForDiv: string;
  realInYtdPtCnt: string;
  realInPyYtdPtCntRate: string;
  realInPyYtdPtCntForDiv: string;
  outYtdPerPtAmt: string;
  outPyYtdPerPtAmtRate: string;
  outPyYtdPerPtAmtForDiv: string;
  inYtdPerPtAmt: string;
  inPyYtdPerPtAmtRate: string;
  inPyYtdPerPtAmtForDiv: string;
  allRefMtdAmtRateMed?: string;
  allGoalMtdAmtForDiv?: string;
  allGoalMtdAmtForDivMed?: string;
  allRefAmtForDiv?: string;
  allRefAmtForDivMed?: string;
  allGoalMtdAmtRateMed?: string;
  // 인덱스 시그니처
  [prop: string]: any;
}
export type DiagGrid = {
  [K in keyof DiagGridRes]?: string | null;
};

export type DiagGridRes2 = {
  분당본원: {};
  분당여성: {};
  분당난임: {};
  // 인덱스 시그니처
  [prop: string]: any;
};

export type HospitalType = {
  분당본원: 'A';
  분당여성: 'B';
  분당난임: 'E';
};

export interface ICellInfo {
  value?: string | number | Date | undefined;
  valueText?: string | undefined;
}
