import DevExpress from 'devextreme';
import { Format } from 'devextreme/localization';

export declare const DxPlanitTreeGrid;
export default DxPlanitTreeGrid;

export declare module TypeDxPlanit {
  export interface IGroupField {
    groupCaption: string;
    groupName?: string;
    html?: string;
    depth: number;
    colspan: number;
  }

  export interface ColumnField {
    colspan: number;
    text: string;
    type: string;
  }

  export interface IColorInfo {
    format: Format;
    color: string;
    condition: string;
  }

  export interface Props extends DevExpress.ui.dxPivotGrid.Properties {
    id?: string;
    dataSource?: any;
    groupField?: IGroupField[];
    dataColor?: IColorInfo[];
    convertNullToHipen?: boolean;
    convertZeroToHipen?: boolean;
    stateStoringKey?: string;
    customExcelButton?: boolean;
  }
}
