import { Format } from 'devextreme/localization';
// import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import PivotGridDataSourceField from 'devextreme/ui/pivot_grid/data_source';

export interface IGroupField {
  groupCaption: string;
  groupName?: string;
  depth: number;
  colspan: number;
}

export interface IColorInfo {
  format: Format;
  color: string;
  condition: string;
}

export class DxPlanitField extends PivotGridDataSourceField {
  groupCaption?: string;
}

// export class DxPlanitGridDataSource extends PivotGridDataSource {
//   fields(): Array<DxPlanitField>;
// }
