import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

export interface IGroupField {
  groupCaption: string;
  groupName?: string;
  depth: number;
  colspan: number;
}
