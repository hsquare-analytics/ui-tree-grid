import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';

import PivotGrid, { HeaderFilter, FieldChooser, FieldPanel } from 'devextreme-react/pivot-grid';
import { Format, StateStoring } from 'devextreme-react/data-grid';
import DevExpress from 'devextreme';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { TypeDxPlanit } from './index.d';
import React from 'react';

/**
 * devextreme pivotgrid Configrations 중 사용 불가 항목 : id, width, height, showColumnGrandTotals, showColumnTotals, showRowGrandTotals, FieldChooser. fieldPanel,
 * devextreme pivotgrid Configrations 중 사용 방법 변경 항목 : stateStoring, Export
 * onExported, onFileSaving 이벤트 사용하지 않음.
 */
/**
 * todoList:
 * 2) columIndex 초기화 기능이 있어야 함(column 개수 변할 때)
 * 3) 헤더에 테이블 삽입되면서 그리드 크기가 늘어남. height에 그리드 크기 늘어난 만큼 반영되어야 함.
 */

const grandTotalCssNm = 'data-grand-total';

const DxPlanitTreeGrid = forwardRef(
  (props: TypeDxPlanit.Props, ref: any): JSX.Element => {
    const {
      children,
      id = 'dx-planit-vera-pivotgrid-id',
      groupField,
      dataColor,
      convertNullToHipen = true,
      convertZeroToHipen = true,
      allowExpandAll = false,
      allowFiltering = false,
      allowSorting = false,
      allowSortingBySummary = false,
      dataFieldArea = 'column',
      dataSource,
      disabled = false,
      elementAttr,
      encodeHtml,
      hideEmptySummaryCells = false,
      hint,
      rowHeaderLayout = 'standard',
      rtlEnabled = false,
      showBorders = true,
      showRowTotals = true,
      showTotalsPrior = 'none',
      tabIndex = 0,
      visible = true,
      wordWrapEnabled = false,
      onCellClick,
      onCellPrepared,
      onContentReady,
      onContextMenuPreparing,
      onDisposing,
      onExporting,
      onInitialized,
      onOptionChanged,
    } = props;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [columnIndex, setColumnIndex] = useState(0);
    const [gridDataSource, setGridDataSource] = useState<PivotGridDataSource>(dataSource);

    const $tableRef = useRef<PivotGrid>(null);
    const excelBorder = { style: 'thin', color: { argb: 'FF7E7E7E' } };

    /**
     * props.children 경고문 출력
     * @param child props.children
     */
    const warnDisableProps = (child: any): void => {
      if (child.props.showColumnFields || child.props.showFilterFields || child.props.showDataFields) {
        console.warn('FieldPanel의 showColumnFields, showFilterFields, showDataFields 기능은 사용하실 수 없습니다');
      }
    };

    /**
     * props.children 중 FieldPanel 일부 기능 불능화
     * @param child props.children
     * @returns
     */
    const modifyChildren = (child: any, index: number): JSX.Element => {
      if (child.type.name === 'FieldPanel') {
        warnDisableProps(child);
        return (
          <FieldPanel
            key={'FieldPanel' + index}
            visible={child.props.visible ?? false}
            allowFieldDragging={child.props.allowFieldDragging ?? false}
            showColumnFields={false}
            showFilterFields={false}
            showDataFields={false}
            showRowFields={child.props.showRowFields ?? false}
          />
        );
      }
      return child;
    };

    /**
     * 그리드 사이즈 재조정
     * @returns 그리드 사이즈
     */
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

    /**
     * 'Total' 을 한글로 변경
     * @param e devextreme CellPreparedEvent
     */
    const changeTotalText = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
      if (!e.cellElement) {
        return;
      }
      if (e.cell?.type === 'T') {
        const text = e.cell.text?.replace('Total', '합계');
        e.cellElement.innerHTML = `<span>${text}</span>`;
      }
    };

    /**
     * null값을 하이픈으로 모두 변경
     * @param e devextreme CellPreparedEvent
     */
    const changeNullToHipen = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
      if (!convertNullToHipen) {
        return;
      }
      if (e.area === 'data' && e.cell?.text === null && e.cellElement) {
        e.cellElement.innerHTML = '<span class="text-color">-</span>';
      }
    };

    /**
     * '0', '0.0%' 를 하이픈으로 모두 변경
     * @param e devextreme CellPreparedEvent
     */
    const changeZeroToHipen = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
      if (!convertZeroToHipen) {
        return;
      }
      if (e.area === 'data' && (e.cell?.text === '0' || e.cell?.text === '0.0%' || e.cell?.text === '') && e.cellElement) {
        e.cellElement.innerHTML = '<span class="text-color">-</span>';
      }
    };

    /**
     * 테이블 헤더에 colspan, rowspan 한 HTMLElement 정보 반환
     * @param groupField 사용자가 작성한 그룹 정보
     * @return
     */
    const makeColspan = (group: TypeDxPlanit.IGroupField, index: number, isLast: boolean): HTMLElement => {
      const td = document.createElement('td');
      let text = group.html ?? group.groupCaption;

      td.setAttribute('colspan', group.colspan.toString());
      td.setAttribute('class', 'dx-row-total dx-grand-total dx-planit-colspan');

      if (isLast && index === 0) {
        td.setAttribute('style', 'border-bottom: 0; border-right: 0');
      } else if (isLast && index !== 0) {
        td.setAttribute('style', 'border-right: 0');
      } else if (!isLast && index === 0) {
        td.setAttribute('style', 'border-bottom: 0');
      }
      td.innerHTML = `<span>${text}</span>`;

      return td;
    };

    /**
     * 그룹 필드 데이터 유효성 검증용 데이터 생성
     * @param groupField
     * @returns
     */
    const makeCheckGroupData = (groupField: TypeDxPlanit.IGroupField[]): any => {
      const data: any = {};

      groupField?.forEach((group: TypeDxPlanit.IGroupField) => {
        if (data[group.depth]) {
          data[group.depth] += group.colspan;
        } else {
          data[group.depth] = group.colspan;
        }
      });

      return data;
    };

    /**
     * GroupField 데이터 검증
     * @param 사용자가 설정한 그룹 필드 정보
     * @returns 데이터 검증 결과
     */
    const isCheckGroupField = (groupField: TypeDxPlanit.IGroupField[]): boolean => {
      const map = makeCheckGroupData(groupField);

      for (const depth of Object.keys(map)) {
        if (map[depth] !== columnIndex + 1) {
          console.error('그룹 데이터의 colspan 숫자가 columnIndex와 맞지 않습니다. 다시 한 번 확인 바랍니다.');
        }
      }

      return true;
    };

    /**
     * Grand Total 셀 정보 저장
     * @param e
     */
    const setTotalElementInfo = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
      if (!groupField?.length || e.cell?.type !== 'GT' || e.cell?.text !== 'Grand Total') {
        return;
      }

      e.cellElement?.classList.add(grandTotalCssNm);
    };

    /**
     * cell의 columnIndex 최대값 저장
     * @param e
     */
    const setMaxColumIndex = (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent): void => {
      if (!e.columnIndex) {
        return;
      }
      if (e.columnIndex > columnIndex) {
        setColumnIndex(e.columnIndex);
      }
    };

    /**
     * groupField depth의 유니크한 배열 구하기
     * @param group
     * @param arr
     * @returns
     */
    const getGroupDepth = (group: TypeDxPlanit.IGroupField[], arr: 'asc' | 'desc'): number[] => {
      const groupData = group.slice();
      const set = new Set(groupData.map((group: TypeDxPlanit.IGroupField) => group.depth));
      return Array.from(set).sort(function compare(a: number, b: number) {
        if (a > b) {
          return arr === 'asc' ? -1 : 1;
        }
        if (a < b) {
          return arr === 'asc' ? 1 : -1;
        }
        return 0;
      });
    };

    /**
     * 현재 depth에 맞는 그룹 필드 정보 반환
     * @param group
     * @param depth
     * @returns
     */
    const getCurrentGroup = (group: TypeDxPlanit.IGroupField[], depth: number): TypeDxPlanit.IGroupField[] => {
      return group.filter((gr: TypeDxPlanit.IGroupField) => gr.depth === depth);
    };

    /**
     * 테이블 헤더(DOM)에 colspan 적용된 테이블 삽입
     */
    const insertRowHeaderGroup = (): void => {
      if (!groupField?.length) {
        return;
      }

      isCheckGroupField(groupField);

      const totalElement = document.querySelector('.' + grandTotalCssNm);
      const targetElement = totalElement?.parentNode;
      const thead = targetElement?.parentNode;

      if (!targetElement || !thead) {
        return;
      }

      const firstChild = thead?.firstChild;
      if (!firstChild) {
        return;
      }
      totalElement.innerHTML = '';
      totalElement.setAttribute('style', 'padding: 0; border: 0');
      const colgroup = thead.previousSibling?.cloneNode(true);

      const groupData = groupField.slice();
      const depth = getGroupDepth(groupData, 'asc');

      const table = document.createElement('table');

      depth.forEach((dep: number, index: number) => {
        const groupInfo = getCurrentGroup(groupData, dep);

        const tr = document.createElement('tr');

        groupInfo.forEach((group: TypeDxPlanit.IGroupField, cellIndex: number) => {
          const isLast = cellIndex === groupInfo.length - 1 ? true : false;
          tr.appendChild(makeColspan(group, index, isLast));
        });
        (table as HTMLElement).prepend(tr);
      });

      table.prepend(colgroup as Node);
      totalElement.appendChild(table);
    };

    /**
     * Devextreme의 dateController columnInfo에 그룹 정보 삽입
     * @param group
     * @returns
     */
    const makeDataControllerColumnGroup = (group: TypeDxPlanit.IGroupField[]): TypeDxPlanit.ColumnField[][] => {
      const groupData = group.slice();
      const depth = getGroupDepth(groupData, 'desc');

      return depth.map((dep: number) => {
        const groupInfo = getCurrentGroup(groupData, dep);
        return groupInfo.map((group: TypeDxPlanit.IGroupField) => ({ colspan: group.colspan, text: group.groupCaption, type: 'GT' }));
      });
    };

    /**
     * 사용자가 입력한 컬러 조건을 { standard: string; condition: string } 형식으로 변경 반환
     * @param condition 사용자 입력 컬러 조건식 ex) '>= 100'
     * @returns
     */
    const makeSplitCondtion = (condition: string): { standard: string; condition: string } => {
      const newCondition = { standard: '', condition: '' };
      [...condition].forEach((cond: string) => {
        if (Number.isNaN(parseFloat(cond))) {
          newCondition.condition += cond;
        } else {
          newCondition.standard += cond;
        }
      });

      return newCondition;
    };

    /**
     * 데이터에 색상 적용
     * @param e onCellPrepared 이벤트
     * @returns
     */
    const makeColorAtPercent = (e: any): void => {
      if (!dataColor || !e.cellElement) {
        return;
      }

      dataColor.forEach((color: TypeDxPlanit.IColorInfo) => {
        if (e.cell.value === null) {
          return;
        }
        if (e.cell?.format?.type === color.format && !Number.isNaN(e.cell.value)) {
          const standardData = makeSplitCondtion(color.condition.replace(/(\s*)/g, ''));
          const rate = color.format === 'percent' ? 0.01 : 1;
          let condition = false;

          switch (standardData.condition) {
            case '>':
              condition = e.cell.value > parseFloat(standardData.standard) * rate;
              break;
            case '>=':
              condition = e.cell.value >= parseFloat(standardData.standard) * rate;
              break;
            case '<':
              condition = e.cell.value < parseFloat(standardData.standard) * rate;
              break;
            case '<=':
              condition = e.cell.value <= parseFloat(standardData.standard) * rate;
              break;
          }

          if (condition && !(e.cell.value === 0 && convertZeroToHipen)) {
            e.cellElement.style.color = color.color;
          }
        }
      });
    };

    /**
     * 그리드 데이터 정합성 체크. 데이터 잘못되어 있으면 에러 발생
     * @param dataSource
     */
    const checkDataSource = (dataSource: any): void => {
      if (!dataSource._fields) {
        throw Error(
          'PivotGridDataSource 의 field 정보가 없습니다. 올바른 field 정보를 입력하세요. https://js.devexpress.com/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/'
        );
      }
      const isColumns = dataSource._fields.findIndex((field: any) => field.area === 'column');
      const isRows = dataSource._fields.findIndex((field: any) => field.area === 'row');
      const isDatas = dataSource._fields.findIndex((field: any) => field.area === 'data');

      if (isColumns > -1) {
        throw Error('DxPlanitTreeGrid는 column이 존재하는 형식의 pivot grid에는 사용할 수 없습니다.');
      }

      if (isRows === -1 || isDatas === -1) {
        throw Error('DxPlanitTreeGrid 데이터는 row와 data가 반드시 존재해야 합니다.');
      }
    };

    /**
     * 엑셀 export 명령
     * @param fileName 저장하고자 하는 엑셀파일명
     */
    const exportToExcel = (fileName: string): void => {
      setTimeout(() => exportToExcelAction($tableRef.current?.instance, fileName));
    };

    /**
     * devextreme component 정보의 dataController의 columnInfo에 사용자가 설정한 groupFIled 정보 병합
     * @param component devextreme component
     * @returns devextreme component
     */
    const convertDataControllerColumnsInfo = (component: any): any => {
      let arr: TypeDxPlanit.ColumnField[][] = [];
      const columnInfo = component._dataController._columnsInfo.forEach((column: TypeDxPlanit.ColumnField[]) => {
        let newColumn = column.slice();
        if (groupField && newColumn.length === 1 && newColumn[0].type === 'GT' && newColumn[0].text === 'Grand Total') {
          arr.push(...makeDataControllerColumnGroup(groupField));
        } else {
          arr.push(newColumn);
        }
      });
      component._dataController._columnsInfo = arr;
      return component;
    };

    /**
     * 엑셀 export
     * @param e
     */
    const exportToExcelAction = (e: any, fileName: string): void => {
      const newComponent = convertDataControllerColumnsInfo(e);

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(fileName);

      exportPivotGrid({
        component: newComponent,
        worksheet,
        customizeCell: ({ excelCell }) => {
          const borderStyle = excelBorder;
          excelCell.border = {
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle,
            top: borderStyle,
          };
        },
      }).then(() => {
        workbook.xlsx.writeBuffer().then(buffer => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
        });
      });
      e.cancel = true;
    };

    /**
     * props.children 요소 중 일부 요소 default 설정 변경
     * @param child ReactNode
     * @returns ReatNode
     */
    const convertChildren = (child: any): any => {
      if (Array.isArray(child)) {
        return child.map((item: any, index: number) => {
          return modifyChildren(item, index);
        });
      } else {
        return modifyChildren(child, 0);
      }
    };

    /**
     * StateStoring 의 storageKey값 가져오기
     * @param child props.children
     * @returns storageKey값
     */
    const getStateStorageKey = (child: any): string | null => {
      if (Array.isArray(child)) {
        const stateStoring = child.filter((node: any) => node.type.name === 'StateStoring');
        if (stateStoring?.length) {
          return stateStoring[0].props.storageKey;
        }
        return null;
      } else if (child.type.name === 'StateStoring') {
        return child.props.storageKey;
      }
      return null;
    };

    /**
     * 그리드 펼침 정보 세션스토리지 리셋
     */
    const resetSession = (): void => {
      const stateStoringKey = getStateStorageKey(children);
      if (stateStoringKey) {
        sessionStorage.removeItem(stateStoringKey);
      }
    };

    /**
     * devextreme CellPreparedEvent 이벤트 실행
     * @param e
     */
    const onCellPreparedChild = (
      e: DevExpress.ui.dxPivotGrid.CellPreparedEvent
    ): ((e: DevExpress.ui.dxPivotGrid.CellPreparedEvent) => void) | void => {
      makeColorAtPercent(e);
      setTotalElementInfo(e);
      setMaxColumIndex(e);
      changeTotalText(e);
      changeNullToHipen(e);
      changeZeroToHipen(e);

      return onCellPrepared ? onCellPrepared(e) : undefined;
    };

    /**
     * devextreme Raise Event
     */
    const onContentReadyChild = (
      e: DevExpress.ui.dxPivotGrid.ContentReadyEvent
    ): ((e: DevExpress.ui.dxPivotGrid.ContentReadyEvent) => void) | void => {
      setTimeout(() => insertRowHeaderGroup(), 0);
      getGridSize();

      return onContentReady ? onContentReady(e) : undefined;
    };

    const onCellClickChild = (
      e: DevExpress.ui.dxPivotGrid.CellClickEvent
    ): ((e: DevExpress.ui.dxPivotGrid.CellClickEvent) => void) | void => {
      return onCellClick ? onCellClick(e) : undefined;
    };

    const onContextMenuPreparingChild = (
      e: DevExpress.ui.dxPivotGrid.ContextMenuPreparingEvent
    ): ((e: DevExpress.ui.dxPivotGrid.ContextMenuPreparingEvent) => void) | void => {
      return onContextMenuPreparing ? onContextMenuPreparing(e) : undefined;
    };

    const onDisposingChild = (
      e: DevExpress.ui.dxPivotGrid.DisposingEvent
    ): ((e: DevExpress.ui.dxPivotGrid.DisposingEvent) => void) | void => {
      return onDisposing ? onDisposing(e) : undefined;
    };

    const onExportingChild = (
      e: DevExpress.ui.dxPivotGrid.ExportingEvent
    ): ((e: DevExpress.ui.dxPivotGrid.ExportingEvent) => void) | void => {
      return onExporting ? onExporting(e) : undefined;
    };

    const onInitializedChild = (
      e: DevExpress.ui.dxPivotGrid.InitializedEvent
    ): ((e: DevExpress.ui.dxPivotGrid.InitializedEvent) => void) | void => {
      return onInitialized ? onInitialized(e) : undefined;
    };

    const onOptionChangedChild = (
      e: DevExpress.ui.dxPivotGrid.OptionChangedEvent
    ): ((e: DevExpress.ui.dxPivotGrid.OptionChangedEvent) => void) | void => {
      return onOptionChanged ? onOptionChanged(e) : undefined;
    };

    useImperativeHandle(ref, () => ({
      exportToExcel,
    }));

    useEffect(() => {
      if (Object.keys(dataSource).length) {
        resetSession();
        setGridDataSource(dataSource);
        checkDataSource(dataSource);
      }
    }, [dataSource]);

    return (
      <>
        {Object.keys(gridDataSource).length && (
          <div>
            <PivotGrid
              id={id}
              ref={$tableRef}
              dataSource={gridDataSource}
              showColumnTotals={false}
              showColumnGrandTotals={true}
              showRowGrandTotals={false}
              width={width}
              height={height}
              allowExpandAll={allowExpandAll}
              allowFiltering={allowFiltering}
              allowSorting={allowSorting}
              allowSortingBySummary={allowSortingBySummary}
              dataFieldArea={dataFieldArea}
              disabled={disabled}
              elementAttr={elementAttr}
              encodeHtml={encodeHtml}
              hideEmptySummaryCells={hideEmptySummaryCells}
              hint={hint}
              rowHeaderLayout={rowHeaderLayout}
              rtlEnabled={rtlEnabled}
              showBorders={showBorders}
              showRowTotals={showRowTotals}
              showTotalsPrior={showTotalsPrior}
              tabIndex={tabIndex}
              visible={visible}
              wordWrapEnabled={wordWrapEnabled}
              onCellClick={onCellClickChild}
              onContentReady={onContentReadyChild}
              onCellPrepared={onCellPreparedChild}
              onContextMenuPreparing={onContextMenuPreparingChild}
              onDisposing={onDisposingChild}
              onExporting={onExportingChild}
              onInitialized={onInitializedChild}
              onOptionChanged={onOptionChangedChild}
            >
              {convertChildren(children)}
              <FieldChooser enabled={false} />
            </PivotGrid>
          </div>
        )}
      </>
    );
  }
);

export default DxPlanitTreeGrid;
