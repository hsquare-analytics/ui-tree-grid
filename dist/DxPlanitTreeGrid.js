"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _pivotGrid = _interopRequireWildcard(require("devextreme-react/pivot-grid"));
var _excel_exporter = require("devextreme/excel_exporter");
var _exceljs = require("exceljs");
var _fileSaver = _interopRequireDefault(require("file-saver"));
var _localization = require("devextreme/localization");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * devextreme pivotgrid Configrations ??? ?????? ?????? ?????? : id, width, height, showColumnGrandTotals, showColumnTotals, showRowGrandTotals, FieldChooser. fieldPanel,
 * devextreme pivotgrid Configrations ??? ?????? ?????? ?????? ?????? : stateStoring, Export
 * onExported, onFileSaving ????????? ???????????? ??????.
 */
/**
 * todoList:
 * 2) columIndex ????????? ????????? ????????? ???(column ?????? ?????? ???)
 * 3) ????????? ????????? ??????????????? ????????? ????????? ?????????. height??? ????????? ?????? ????????? ?????? ??????????????? ???.
 */

var grandTotalCssNm = 'data-grand-total';
var DxPlanitTreeGrid = /*#__PURE__*/(0, _react.forwardRef)(function (props, ref) {
  var children = props.children,
    _props$id = props.id,
    id = _props$id === void 0 ? 'dx-planit-vera-pivotgrid-id' : _props$id,
    groupField = props.groupField,
    dataColor = props.dataColor,
    _props$convertNullToH = props.convertNullToHipen,
    convertNullToHipen = _props$convertNullToH === void 0 ? true : _props$convertNullToH,
    _props$convertZeroToH = props.convertZeroToHipen,
    convertZeroToHipen = _props$convertZeroToH === void 0 ? true : _props$convertZeroToH,
    _props$allowExpandAll = props.allowExpandAll,
    allowExpandAll = _props$allowExpandAll === void 0 ? false : _props$allowExpandAll,
    _props$allowFiltering = props.allowFiltering,
    allowFiltering = _props$allowFiltering === void 0 ? false : _props$allowFiltering,
    _props$allowSorting = props.allowSorting,
    allowSorting = _props$allowSorting === void 0 ? false : _props$allowSorting,
    _props$allowSortingBy = props.allowSortingBySummary,
    allowSortingBySummary = _props$allowSortingBy === void 0 ? false : _props$allowSortingBy,
    _props$dataFieldArea = props.dataFieldArea,
    dataFieldArea = _props$dataFieldArea === void 0 ? 'column' : _props$dataFieldArea,
    dataSource = props.dataSource,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    elementAttr = props.elementAttr,
    _props$hideEmptySumma = props.hideEmptySummaryCells,
    hideEmptySummaryCells = _props$hideEmptySumma === void 0 ? false : _props$hideEmptySumma,
    hint = props.hint,
    _props$rowHeaderLayou = props.rowHeaderLayout,
    rowHeaderLayout = _props$rowHeaderLayou === void 0 ? 'standard' : _props$rowHeaderLayou,
    _props$rtlEnabled = props.rtlEnabled,
    rtlEnabled = _props$rtlEnabled === void 0 ? false : _props$rtlEnabled,
    _props$showBorders = props.showBorders,
    showBorders = _props$showBorders === void 0 ? true : _props$showBorders,
    _props$showRowTotals = props.showRowTotals,
    showRowTotals = _props$showRowTotals === void 0 ? true : _props$showRowTotals,
    _props$showTotalsPrio = props.showTotalsPrior,
    showTotalsPrior = _props$showTotalsPrio === void 0 ? 'none' : _props$showTotalsPrio,
    _props$tabIndex = props.tabIndex,
    tabIndex = _props$tabIndex === void 0 ? 0 : _props$tabIndex,
    _props$visible = props.visible,
    visible = _props$visible === void 0 ? true : _props$visible,
    _props$wordWrapEnable = props.wordWrapEnabled,
    wordWrapEnabled = _props$wordWrapEnable === void 0 ? false : _props$wordWrapEnable,
    _props$language = props.language,
    language = _props$language === void 0 ? 'en' : _props$language,
    onCellClick = props.onCellClick,
    onCellPrepared = props.onCellPrepared,
    onContentReady = props.onContentReady,
    onContextMenuPreparing = props.onContextMenuPreparing,
    onDisposing = props.onDisposing,
    onExporting = props.onExporting,
    onInitialized = props.onInitialized,
    onOptionChanged = props.onOptionChanged;
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    width = _useState2[0],
    setWidth = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    height = _useState4[0],
    setHeight = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    columnIndex = _useState6[0],
    setColumnIndex = _useState6[1];
  var _useState7 = (0, _react.useState)(dataSource),
    _useState8 = _slicedToArray(_useState7, 2),
    gridDataSource = _useState8[0],
    setGridDataSource = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    oldDataSource = _useState10[0],
    setOldDataSource = _useState10[1];
  var $tableRef = (0, _react.useRef)(null);
  var excelBorder = {
    style: 'thin',
    color: {
      argb: 'FF7E7E7E'
    }
  };
  var korean = {
    'ko': {
      'dxPivotGrid-sortColumnBySummary': '"{0}" ???(???) ????????? ??? ???????????? ??????',
      'dxPivotGrid-removeAllSorting': '???????????? ?????? ??????',
      'dxPivotGrid-expandAll': '?????? ?????????',
      'dxPivotGrid-collapseAll': '?????? ??????',
      'dxDataGrid-headerFilterOK': '??????',
      'dxDataGrid-headerFilterCancel': '??????',
      'dxList-selectAll': '?????? ??????',
      'Search': '??????'
    }
  };

  /**
   * devextreme ????????? ??????
   * @param lang ????????? language ??????
   */
  var transferLanguage = function transferLanguage(lang) {
    (0, _localization.locale)(lang);
    if (lang === 'ko' || lang === 'ko-KR') {
      (0, _localization.loadMessages)(korean);
    }
  };

  /**
   * props.children ????????? ??????
   * @param child props.children
   */
  var warnDisableProps = function warnDisableProps(child) {
    if (child.props.showColumnFields || child.props.showFilterFields || child.props.showDataFields) {
      console.warn('FieldPanel??? showColumnFields, showFilterFields, showDataFields ????????? ???????????? ??? ????????????');
    }
  };

  /**
   * props.children ??? FieldPanel ?????? ?????? ?????????
   * @param child props.children
   * @returns
   */
  var modifyChildren = function modifyChildren(child, index) {
    if ((child === null || child === void 0 ? void 0 : child.type.OptionName.toLowerCase()) === 'fieldpanel') {
      var _child$props$visible, _child$props$allowFie, _child$props$showRowF;
      warnDisableProps(child);
      return /*#__PURE__*/_react.default.createElement(_pivotGrid.FieldPanel, {
        key: 'FieldPanel' + index,
        visible: (_child$props$visible = child.props.visible) !== null && _child$props$visible !== void 0 ? _child$props$visible : false,
        allowFieldDragging: (_child$props$allowFie = child.props.allowFieldDragging) !== null && _child$props$allowFie !== void 0 ? _child$props$allowFie : true,
        showColumnFields: false,
        showFilterFields: false,
        showDataFields: false,
        showRowFields: (_child$props$showRowF = child.props.showRowFields) !== null && _child$props$showRowF !== void 0 ? _child$props$showRowF : true
      });
    }
    return child;
  };

  /**
   * ????????? ????????? ?????????
   * @returns ????????? ?????????
   */
  var getGridSize = function getGridSize() {
    var _wrapper$clientWidth;
    var wrapper = document.querySelector('.diag-table-wrapper');
    var gap = 10;
    setWidth((_wrapper$clientWidth = wrapper === null || wrapper === void 0 ? void 0 : wrapper.clientWidth) !== null && _wrapper$clientWidth !== void 0 ? _wrapper$clientWidth : 0);
    setHeight(wrapper ? wrapper.clientHeight - gap : 0);
    window.addEventListener('resize', function () {
      var _wrapper$clientWidth2;
      setWidth((_wrapper$clientWidth2 = wrapper === null || wrapper === void 0 ? void 0 : wrapper.clientWidth) !== null && _wrapper$clientWidth2 !== void 0 ? _wrapper$clientWidth2 : 0);
      setHeight(wrapper ? wrapper.clientHeight - gap : 0);
    });
    return {
      width: width,
      height: height
    };
  };

  /**
   * 'Total' ??? ????????? ??????
   * @param e devextreme CellPreparedEvent
   */
  var changeTotalText = function changeTotalText(e) {
    var _e$cell;
    if (!e.cellElement || !(language === 'ko' || language === 'ko-KR')) {
      return;
    }
    if (((_e$cell = e.cell) === null || _e$cell === void 0 ? void 0 : _e$cell.type) === 'T') {
      var _e$cell$text;
      var text = (_e$cell$text = e.cell.text) === null || _e$cell$text === void 0 ? void 0 : _e$cell$text.replace('Total', '??????');
      e.cellElement.innerHTML = "<span>".concat(text, "</span>");
    }
  };

  /**
   * null?????? ??????????????? ?????? ??????
   * @param e devextreme CellPreparedEvent
   */
  var changeNullToHipen = function changeNullToHipen(e) {
    var _e$cell2;
    if (!convertNullToHipen) {
      return;
    }
    if (e.area === 'data' && ((_e$cell2 = e.cell) === null || _e$cell2 === void 0 ? void 0 : _e$cell2.text) === null && e.cellElement) {
      e.cellElement.innerHTML = '<span class="text-color">-</span>';
    }
  };

  /**
   * '0', '0.0%' ??? ??????????????? ?????? ??????
   * @param e devextreme CellPreparedEvent
   */
  var changeZeroToHipen = function changeZeroToHipen(e) {
    var _e$cell3, _e$cell4, _e$cell5;
    if (!convertZeroToHipen) {
      return;
    }
    if (e.area === 'data' && (((_e$cell3 = e.cell) === null || _e$cell3 === void 0 ? void 0 : _e$cell3.text) === '0' || ((_e$cell4 = e.cell) === null || _e$cell4 === void 0 ? void 0 : _e$cell4.text) === '0.0%' || ((_e$cell5 = e.cell) === null || _e$cell5 === void 0 ? void 0 : _e$cell5.text) === '') && e.cellElement) {
      e.cellElement.innerHTML = '<span class="text-color">-</span>';
    }
  };

  /**
   * ????????? ????????? colspan, rowspan ??? HTMLElement ?????? ??????
   * @param groupField ???????????? ????????? ?????? ??????
   * @return
   */
  var makeColspan = function makeColspan(group, index, isLast) {
    var _group$html;
    var td = document.createElement('td');
    var text = (_group$html = group.html) !== null && _group$html !== void 0 ? _group$html : group.groupCaption;
    td.setAttribute('colspan', group.colspan.toString());
    td.setAttribute('class', 'dx-row-total dx-grand-total dx-planit-colspan');
    if (isLast && index === 0) {
      td.setAttribute('style', 'border-bottom: 0; border-right: 0');
    } else if (isLast && index !== 0) {
      td.setAttribute('style', 'border-right: 0');
    } else if (!isLast && index === 0) {
      td.setAttribute('style', 'border-bottom: 0');
    }
    td.innerHTML = "<span>".concat(text, "</span>");
    return td;
  };

  /**
   * ?????? ?????? ????????? ????????? ????????? ????????? ??????
   * @param groupField
   * @returns
   */
  var makeCheckGroupData = function makeCheckGroupData(groupField) {
    var data = {};
    groupField === null || groupField === void 0 ? void 0 : groupField.forEach(function (group) {
      if (data[group.depth]) {
        data[group.depth] += group.colspan;
      } else {
        data[group.depth] = group.colspan;
      }
    });
    return data;
  };

  /**
   * GroupField ????????? ??????
   * @param ???????????? ????????? ?????? ?????? ??????
   * @returns ????????? ?????? ??????
   */
  var isCheckGroupField = function isCheckGroupField(groupField) {
    var map = makeCheckGroupData(groupField);
    for (var _i2 = 0, _Object$keys = Object.keys(map); _i2 < _Object$keys.length; _i2++) {
      var depth = _Object$keys[_i2];
      if (map[depth] !== columnIndex + 1) {
        console.error('?????? ???????????? colspan ????????? columnIndex??? ?????? ????????????. ?????? ??? ??? ?????? ????????????.');
      }
    }
    return true;
  };

  /**
   * Grand Total ??? ?????? ??????
   * @param e
   */
  var setTotalElementInfo = function setTotalElementInfo(e) {
    var _e$cell6, _e$cell7, _e$cellElement;
    if (!(groupField !== null && groupField !== void 0 && groupField.length) || ((_e$cell6 = e.cell) === null || _e$cell6 === void 0 ? void 0 : _e$cell6.type) !== 'GT' || ((_e$cell7 = e.cell) === null || _e$cell7 === void 0 ? void 0 : _e$cell7.text) !== 'Grand Total') {
      return;
    }
    (_e$cellElement = e.cellElement) === null || _e$cellElement === void 0 ? void 0 : _e$cellElement.classList.add(grandTotalCssNm);
  };

  /**
   * cell??? columnIndex ????????? ??????
   * @param e
   */
  var setMaxColumIndex = function setMaxColumIndex(e) {
    if (!e.columnIndex) {
      return;
    }
    if (e.columnIndex > columnIndex) {
      setColumnIndex(e.columnIndex);
    }
  };

  /**
   * groupField depth??? ???????????? ?????? ?????????
   * @param group
   * @param arr
   * @returns
   */
  var getGroupDepth = function getGroupDepth(group, arr) {
    var groupData = group.slice();
    var set = new Set(groupData.map(function (group) {
      return group.depth;
    }));
    return Array.from(set).sort(function compare(a, b) {
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
   * ?????? depth??? ?????? ?????? ?????? ?????? ??????
   * @param group
   * @param depth
   * @returns
   */
  var getCurrentGroup = function getCurrentGroup(group, depth) {
    return group.filter(function (gr) {
      return gr.depth === depth;
    });
  };

  /**
   * ????????? ??????(DOM)??? colspan ????????? ????????? ??????
   */
  var insertRowHeaderGroup = function insertRowHeaderGroup() {
    var _thead$previousSiblin;
    if (!(groupField !== null && groupField !== void 0 && groupField.length)) {
      return;
    }
    isCheckGroupField(groupField);
    var totalElement = document.querySelector('.' + grandTotalCssNm);
    var targetElement = totalElement === null || totalElement === void 0 ? void 0 : totalElement.parentNode;
    var thead = targetElement === null || targetElement === void 0 ? void 0 : targetElement.parentNode;
    if (!targetElement || !thead) {
      return;
    }
    var firstChild = thead === null || thead === void 0 ? void 0 : thead.firstChild;
    if (!firstChild) {
      return;
    }
    totalElement.innerHTML = '';
    totalElement.setAttribute('style', 'padding: 0; border: 0');
    var colgroup = (_thead$previousSiblin = thead.previousSibling) === null || _thead$previousSiblin === void 0 ? void 0 : _thead$previousSiblin.cloneNode(true);
    var groupData = groupField.slice();
    var depth = getGroupDepth(groupData, 'asc');
    var table = document.createElement('table');
    depth.forEach(function (dep, index) {
      var groupInfo = getCurrentGroup(groupData, dep);
      var tr = document.createElement('tr');
      groupInfo.forEach(function (group, cellIndex) {
        var isLast = cellIndex === groupInfo.length - 1 ? true : false;
        tr.appendChild(makeColspan(group, index, isLast));
      });
      table.prepend(tr);
    });
    table.prepend(colgroup);
    totalElement.appendChild(table);
  };

  /**
   * Devextreme??? dateController columnInfo??? ?????? ?????? ??????
   * @param group
   * @returns
   */
  var makeDataControllerColumnGroup = function makeDataControllerColumnGroup(group) {
    var groupData = group.slice();
    var depth = getGroupDepth(groupData, 'desc');
    return depth.map(function (dep) {
      var groupInfo = getCurrentGroup(groupData, dep);
      return groupInfo.map(function (group) {
        return {
          colspan: group.colspan,
          text: group.groupCaption,
          type: 'GT'
        };
      });
    });
  };

  /**
   * ???????????? ????????? ?????? ????????? { standard: string; condition: string } ???????????? ?????? ??????
   * @param condition ????????? ?????? ?????? ????????? ex) '>= 100'
   * @returns
   */
  var makeSplitCondtion = function makeSplitCondtion(condition) {
    var newCondition = {
      standard: '',
      condition: ''
    };
    _toConsumableArray(condition).forEach(function (cond) {
      if (Number.isNaN(parseFloat(cond))) {
        newCondition.condition += cond;
      } else {
        newCondition.standard += cond;
      }
    });
    return newCondition;
  };

  /**
   * ???????????? ?????? ??????
   * @param e onCellPrepared ?????????
   * @returns
   */
  var makeColorAtPercent = function makeColorAtPercent(e) {
    if (!dataColor || !e.cellElement) {
      return;
    }
    dataColor.forEach(function (color) {
      var _e$cell8, _e$cell8$format;
      if (e.cell.value === null) {
        return;
      }
      if (((_e$cell8 = e.cell) === null || _e$cell8 === void 0 ? void 0 : (_e$cell8$format = _e$cell8.format) === null || _e$cell8$format === void 0 ? void 0 : _e$cell8$format.type) === color.format && !Number.isNaN(e.cell.value)) {
        var standardData = makeSplitCondtion(color.condition.replace(/(\s*)/g, ''));
        var rate = color.format === 'percent' ? 0.01 : 1;
        var condition = false;
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
   * ????????? ????????? ????????? ??????. ????????? ???????????? ????????? ?????? ??????
   * @param dataSource
   */
  var checkDataSource = function checkDataSource(dataSource) {
    if (!dataSource._fields) {
      throw Error('PivotGridDataSource ??? field ????????? ????????????. ????????? field ????????? ???????????????. https://js.devexpress.com/Documentation/ApiReference/Data_Layer/PivotGridDataSource/Configuration/fields/');
    }
    var isColumns = dataSource._fields.findIndex(function (field) {
      return field.area === 'column';
    });
    var isRows = dataSource._fields.findIndex(function (field) {
      return field.area === 'row';
    });
    var isDatas = dataSource._fields.findIndex(function (field) {
      return field.area === 'data';
    });
    if (isColumns > -1) {
      throw Error('DxPlanitTreeGrid??? column??? ???????????? ????????? pivot grid?????? ????????? ??? ????????????.');
    }
    if (isRows === -1 || isDatas === -1) {
      throw Error('DxPlanitTreeGrid ???????????? row??? data??? ????????? ???????????? ?????????.');
    }
  };

  /**
   * ?????? export ??????
   * @param fileName ??????????????? ?????? ???????????????
   */
  var exportToExcel = function exportToExcel(fileName) {
    setTimeout(function () {
      var _$tableRef$current;
      return exportToExcelAction((_$tableRef$current = $tableRef.current) === null || _$tableRef$current === void 0 ? void 0 : _$tableRef$current.instance, fileName);
    });
  };

  /**
   * devextreme component ????????? dataController??? columnInfo??? ???????????? ????????? groupFIled ?????? ??????
   * @param component devextreme component
   * @returns devextreme component
   */
  var convertDataControllerColumnsInfo = function convertDataControllerColumnsInfo(component) {
    var arr = [];
    component._dataController._columnsInfo.forEach(function (column) {
      var newColumn = column.slice();
      if (groupField && newColumn.length === 1 && newColumn[0].type === 'GT' && newColumn[0].text === 'Grand Total') {
        arr.push.apply(arr, _toConsumableArray(makeDataControllerColumnGroup(groupField)));
      } else {
        arr.push(newColumn);
      }
    });
    component._dataController._columnsInfo = arr;
    return component;
  };

  /**
   * ?????? export
   * @param e
   */
  var exportToExcelAction = function exportToExcelAction(e, fileName) {
    var newComponent = convertDataControllerColumnsInfo(e);
    var workbook = new _exceljs.Workbook();
    var worksheet = workbook.addWorksheet(fileName);
    (0, _excel_exporter.exportPivotGrid)({
      component: newComponent,
      worksheet: worksheet,
      customizeCell: function customizeCell(_ref) {
        var excelCell = _ref.excelCell;
        var borderStyle = excelBorder;
        excelCell.border = {
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle,
          top: borderStyle
        };
      }
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer) {
        (0, _fileSaver.default)(new Blob([buffer], {
          type: 'application/octet-stream'
        }), fileName + '.xlsx');
      });
    });
    e.cancel = true;
  };

  /**
   * props.children ?????? ??? ?????? ?????? default ?????? ??????
   * @param child ReactNode
   * @returns ReatNode
   */
  var convertChildren = function convertChildren(child) {
    if (Array.isArray(child)) {
      return child.map(function (item, index) {
        return modifyChildren(item, index);
      });
    } else {
      return modifyChildren(child, 0);
    }
  };

  /**
   * StateStoring ??? storageKey??? ????????????
   * @param child props.children
   * @returns storageKey???
   */
  var getStateStorageKey = function getStateStorageKey(child) {
    if (Array.isArray(child)) {
      var stateStoring = child.filter(function (node) {
        return node.type.OptionName.toLowerCase() === 'statestoring';
      });
      if (stateStoring !== null && stateStoring !== void 0 && stateStoring.length) {
        return stateStoring[0].props.storageKey;
      }
      return null;
    } else if (child.type.OptionName.toLowerCase() === 'statestoring') {
      return child.props.storageKey;
    }
    return null;
  };

  /**
   * ????????? ?????? ?????? ?????????????????? ??????
   */
  var resetSession = function resetSession() {
    var stateStoringKey = getStateStorageKey(children);
    if (stateStoringKey) {
      sessionStorage.removeItem(stateStoringKey);
    }
  };

  /**
   * devextreme CellPreparedEvent ????????? ??????
   * @param e
   */
  var onCellPreparedChild = function onCellPreparedChild(e) {
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
  var onContentReadyChild = function onContentReadyChild(e) {
    insertRowHeaderGroup();
    getGridSize();
    return onContentReady ? onContentReady(e) : undefined;
  };
  var onCellClickChild = function onCellClickChild(e) {
    return onCellClick ? onCellClick(e) : undefined;
  };
  var onContextMenuPreparingChild = function onContextMenuPreparingChild(e) {
    return onContextMenuPreparing ? onContextMenuPreparing(e) : undefined;
  };
  var onDisposingChild = function onDisposingChild(e) {
    return onDisposing ? onDisposing(e) : undefined;
  };
  var onExportingChild = function onExportingChild(e) {
    return onExporting ? onExporting(e) : undefined;
  };
  var onInitializedChild = function onInitializedChild(e) {
    return onInitialized ? onInitialized(e) : undefined;
  };
  var onOptionChangedChild = function onOptionChangedChild(e) {
    return onOptionChanged ? onOptionChanged(e) : undefined;
  };
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      exportToExcel: exportToExcel
    };
  });
  (0, _react.useEffect)(function () {
    if (Object.keys(dataSource).length) {
      if (oldDataSource && oldDataSource._fields.length !== dataSource._fields.length) {
        resetSession();
        setOldDataSource(dataSource);
      }
      setGridDataSource(dataSource);
      checkDataSource(dataSource);
    }
  }, [dataSource]);
  (0, _react.useEffect)(function () {
    transferLanguage(language);
  }, [language]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, Object.keys(gridDataSource).length && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_pivotGrid.default, {
    id: id,
    ref: $tableRef,
    dataSource: gridDataSource,
    showColumnTotals: false,
    showColumnGrandTotals: true,
    showRowGrandTotals: false,
    width: width,
    height: height,
    allowExpandAll: allowExpandAll,
    allowFiltering: allowFiltering,
    allowSorting: allowSorting,
    allowSortingBySummary: allowSortingBySummary,
    dataFieldArea: dataFieldArea,
    disabled: disabled,
    elementAttr: elementAttr,
    hideEmptySummaryCells: hideEmptySummaryCells,
    hint: hint,
    rowHeaderLayout: rowHeaderLayout,
    rtlEnabled: rtlEnabled,
    showBorders: showBorders,
    showRowTotals: showRowTotals,
    showTotalsPrior: showTotalsPrior,
    tabIndex: tabIndex,
    visible: visible,
    wordWrapEnabled: wordWrapEnabled,
    onCellClick: onCellClickChild,
    onContentReady: onContentReadyChild,
    onCellPrepared: onCellPreparedChild,
    onContextMenuPreparing: onContextMenuPreparingChild,
    onDisposing: onDisposingChild,
    onExporting: onExportingChild,
    onInitialized: onInitializedChild,
    onOptionChanged: onOptionChangedChild
  }, convertChildren(children), /*#__PURE__*/_react.default.createElement(_pivotGrid.FieldChooser, {
    enabled: false
  }))));
});
var _default = DxPlanitTreeGrid;
exports.default = _default;