"use strict";
// comming son. 
// version v0.2.0
/*

PDFDocument

  let pdfkitTableCache
  -------------------- class
  constructor
  logg
  -------------------- init
  initValidates
  initCalcs
  initColumns
  -------------------- reset
  resetPeerTable
  resetPeerPage
  -------------------- prepare
  prepareTable
  prepareOptions
  prepareRowOptions
  prepareRowFillOptions
  prepareCellPadding
  -------------------- page
  addPageAsync
  pageAddedFire
  -------------------- style
  createFill
  createDivider
  ----------------------------------------------- title
  createTitles
  createTitle
  -------------------- header
  async createHeader
  -------------------- rows and datas
  createRowString
  createRowObject
  -------------------- calc height
  calcRowHeightString
  calcRowHeightObject
  calcLimitCellOnPage // necessary?
  
  async createTable
  async table
  async tables

*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.PDFDocument = void 0;
var PDFDocumentSource = require("pdfkit");
;
;
// declare namespace PDFKitTable
// {
var PDFDocument = /** @class */ (function (_super) {
    __extends(PDFDocument, _super);
    // // x and y
    // initialPositionX: number | null | undefined = null;
    // positionX: number | null | undefined  = null;
    // positionY: number  = 0;
    // // titles
    // titleHeight: number = 0;
    // subtitleHeight: number = 0;
    // // rows
    // rowHeight: number = 0;
    // minRowHeight: number = 0;
    // // header
    // isHeaderString: boolean = false;  
    // headerHeight: number = 0;
    // headerHeightAndFirstLine: number = 0;
    // titleAndHeaderAndFirstLineHeightCalc: number = 0;
    // Contructor
    // ------------------------------------------------------------------
    function PDFDocument(option) {
        if (option === void 0) { option = {}; }
        var _this = _super.call(this, option) || this;
        // variables
        _this.pdfkitTableCache = {
            // cache
            title: '',
            subtitle: '',
            headers: [],
            datas: [],
            rows: [],
            options: {
                prepareHeader: function () { },
                prepareRow: function () { }
            },
            // promise return
            table: {
                width: 0,
                pages: 1,
                lines: 0,
                columns: 0,
                summation: []
            },
            distanceCorrection: 1.5,
            safelyPageHeight: 0,
            safelyPageY: 0
        };
        // Prepare fill options TO ONLY header
        _this.prepareRowFillOptionsHeader = function (object) {
            var undefinedDefault = { fill: undefined, opacity: undefined };
            // validate
            if (typeof object !== 'object') {
                return undefinedDefault;
            }
            // variables
            var _a = {}, fill = _a.fill, opac = _a.opac;
            // if options exists
            object.options && (object = object.options);
            // extract
            var headerColor = object.headerColor, headerOpacity = object.headerOpacity, columnColor = object.columnColor, columnOpacity = object.columnOpacity;
            if (headerColor) {
                fill = headerColor;
                opac = headerOpacity;
            }
            else if (columnColor) // ^0.1.70
             {
                fill = columnColor;
                opac = columnOpacity;
            }
            // values
            return {
                opacity: opac,
                fill: fill
            };
        };
        // Prepare fill options TO ONLY data
        _this.prepareRowFillOptionsData = function (object) {
            var undefinedDefault = { fill: undefined, opacity: undefined };
            // validate
            if (typeof object !== 'object') {
                return undefinedDefault;
            }
            // variables
            var _a = {}, fill = _a.fill, opac = _a.opac;
            // if options exists
            object.options && object.options.backgroundColor && (object = object.options);
            // extract
            var columnColor = object.columnColor, columnOpacity = object.columnOpacity, backgroundColor = object.backgroundColor, backgroundOpacity = object.backgroundOpacity;
            if (backgroundColor) {
                fill = backgroundColor;
                opac = backgroundOpacity;
            }
            else if (columnColor) // ^0.1.70
             {
                fill = columnColor;
                opac = columnOpacity;
            }
            // values
            return {
                opacity: opac,
                fill: fill
            };
        };
        // v0.1.x
        _this.addBackground = _this.createFill;
        _this.opt = option;
        return _this;
    }
    // Init validates
    // ------------------------------------------------------------------
    PDFDocument.prototype.initValidates = function () {
        // validate
        if (this.isHeaderString === false || !this.pdfkitTableCache.headers || !this.pdfkitTableCache.table.columns) {
            new Error('Please, defined headers. Use hideHeader option to hide header.');
            return;
        }
        // header simple header and complex datas
        if (this.isHeaderString && this.pdfkitTableCache.datas.length) {
            new Error('Combination simple "header" + complex "datas" dont works.');
            return;
        }
    };
    // Init calc
    // ------------------------------------------------------------------
    PDFDocument.prototype.initCalcs = function () {
        // reset global values
        this.resetPeerTable();
        // reset peer page
        this.resetPeerPage();
        // columns
        this.initColumns();
    };
    // Reset table
    // ------------------------------------------------------------------
    PDFDocument.prototype.resetPeerTable = function () {
        // fixed initial x position 
        this.initialPositionX = this.pdfkitTableCache.options.x;
        // position by cell
        this.positionX = this.pdfkitTableCache.options.x;
        // position by row
        this.positionY = (this.pdfkitTableCache.options.y || this.y) + (this.pdfkitTableCache.distanceCorrection * 2);
        // header
        // this.isHeaderString   = this.pdfkitTableCache.table.columns ? (typeof this.pdfkitTableCache.headers[0] === 'string') : false;
        // TODO: Dont works
        // default size to fit new page
        this.titleHeight = this.pdfkitTableCache.title ? 20 : (this.pdfkitTableCache.options.title ? 20 : 0);
        this.subtitleHeight = this.pdfkitTableCache.subtitle ? 15 : (this.pdfkitTableCache.options.subtitle ? 15 : 0);
        this.headerHeight = 0; // cache
        this.firstLineHeight = 0; // big cell
        this.titleAndHeaderAndFirstLineHeightCalc = 0; // big cell with title + subtitle
        this.rowHeight = 0; // default row height
        this.minRowHeight = this.pdfkitTableCache.options.minRowHeight || 0; // default min row height
    };
    // Reset page
    // ------------------------------------------------------------------
    PDFDocument.prototype.resetPeerPage = function () {
        this.pdfkitTableCache.safelyPageHeight = this.page.height - (this.page.margins.bottom + this.page.margins.top); // add this.rowHeight
        this.pdfkitTableCache.safelyPageY = this.page.height - (this.page.margins.bottom); // add this.y || this.positionY first calc page
    };
    // Read columns
    // ------------------------------------------------------------------
    PDFDocument.prototype.initColumns = function () {
        var w = 0; // table width
        var h = []; // header width
        var p = []; // position
        // (table width) 1o - Max size table
        w = this.page.width - this.page.margins.right - (this.pdfkitTableCache.options.x || 0);
        // (table width) 2o - Size defined
        // this.pdfkitTableCache.options.width && (w = String(this.pdfkitTableCache.options.width).replace(/\D+/g,'') >> 0);
        // TODO: talvez verificar se precisa acrescentar ponto no expressão regular pra não estourar o valor, por isso o parseInt
        this.pdfkitTableCache.options.width && (w = parseInt(String(this.pdfkitTableCache.options.width)) || Number(String(this.pdfkitTableCache.options.width).replace(/[^0-9.]/g, '')));
        // (table width) if table is percent of page 
        // TODO:
        // (size columns) 1o
        this.pdfkitTableCache.headers.forEach(function (el) { return el.width && h.push(el.width >> 0); });
        // (size columns) 1o
        h.length === 0 && (h = this.pdfkitTableCache.options.columnsSize || []);
        // (size columns) 2o
        h.length === 0 && (h = Array(this.pdfkitTableCache.table.columns).fill((w / this.pdfkitTableCache.table.columns)));
        // if headers has width, apply tables width priority (sum columns width)
        // (table width) 3o
        h.length && (w = h.reduce(function (prev, curr) { return prev + curr; }, 0));
        // set columnPositions
        h.reduce(function (prev, curr) {
            p.push(prev); // >> 0
            return prev + curr;
        }, this.pdfkitTableCache.options.x || 0); // TODO: zero or padding left ??
        // done
        h.length && (this.columnSizes = h);
        p.length && (this.columnPositions = p);
        this.pdfkitTableCache.table.width = w;
        // // console.log(w, h, p);
    };
    // Prepare table data
    // ------------------------------------------------------------------
    PDFDocument.prototype.prepareTable = function (table) {
        var _this = this;
        // parse json 
        typeof table === 'string' && (table = JSON.parse(table));
        // validate
        table || (table = {});
        table.title || (table.title = '');
        table.subtitle || (table.subtitle = '');
        table.headers || (table.headers = []);
        table.datas || (table.datas = []);
        table.rows || (table.rows = []);
        table.options || (table.options = {});
        // TODO: create prepareHeaders
        // header padding default
        this.headerPadding = Array(table.headers.length).fill(this.prepareCellPadding(0));
        // map header
        table.headers.map(function (el, index) {
            // validade
            if (typeof el === 'string') {
                _this.isHeaderString = true;
                return el;
            }
            // fill
            el.backgroundColor && (el.columnColor = el.backgroundColor);
            el.backgroundOpacity && (el.columnOpacity = el.backgroundOpacity);
            el.background && el.background.color && (el.columnColor = el.background.color);
            el.background && el.background.opacity && (el.columnColor = el.background.opacity);
            // header padding
            el.padding = _this.prepareCellPadding(el.padding);
            _this.headerPadding[index] = el.padding;
            return el;
        });
        // header length
        this.pdfkitTableCache.table.columns = table.headers.length;
        // global
        this.pdfkitTableCache = __assign(__assign({}, this.pdfkitTableCache), table);
        return table;
    };
    // Prepare options 
    // ------------------------------------------------------------------
    PDFDocument.prototype.prepareOptions = function (options) {
        var _this = this;
        // validate
        options = options || {};
        options.padding || (options.padding);
        options.hideHeader || (options.hideHeader = false);
        options.columnsSize || (options.columnsSize = []);
        options.addPage || (options.addPage = false);
        options.absolutePosition || (options.absolutePosition = false);
        options.minRowHeight || (options.minRowHeight = 0);
        options.width || (options.width = 0);
        // TODO: options.hyperlink           || (options.hyperlink = { urlToLink: false, description: null }); // true || false
        // position correction
        if (options.x === null) {
            options.x = this.page.margins.left;
        }
        options.x || (options.x = this.positionX || this.initialPositionX || this.x || this.page.margins.left || 0);
        // options.x                || (options.x = this.page.margins.left || this.x || 100);
        // options.y                || (options.y = this.page.margins.top);
        // validate padding
        options.padding = this.prepareCellPadding(options.padding);
        // TODO: Remove is 0.2.5x ---------------------------------------------
        // 0.1.x correction
        if (options.columnSpacing && typeof options.columnSpacing === 'number') {
            options.padding.top = options.padding.bottom = options.columnSpacing;
        }
        // --------------------------------------------------------------------
        // divider lines
        options.divider || (options.divider = {});
        options.divider.header || (options.divider.header = { disabled: false, width: undefined, opacity: undefined });
        options.divider.horizontal || (options.divider.horizontal = { disabled: false, width: undefined, opacity: undefined });
        options.divider.vertical || (options.divider.vertical = { disabled: true, width: undefined, opacity: undefined });
        options.title || (options.title = null);
        options.subtitle || (options.subtitle = null);
        // prepare style
        options.prepareHeader || (options.prepareHeader = function () { return _this.fillColor('black').font("Helvetica-Bold").fontSize(8).fill(); });
        options.prepareRow || (options.prepareRow = function (row, indexRow, rectRow, rectCell) { return _this.fillColor('black').font("Helvetica").fontSize(8).fill(); });
        // options.prepareCell      || (options.prepareCell = (cell, indexColumn, indexRow, indexCell, rectCell) => this.fillColor('black').font("Helvetica").fontSize(8).fill());
        // validate
        options.preventLongText === undefined && (options.preventLongText = true);
        // global
        this.pdfkitTableCache = __assign(__assign({}, this.pdfkitTableCache), { options: options });
        return options;
    };
    // Prepare row options style
    // ------------------------------------------------------------------
    PDFDocument.prototype.prepareRowOptions = function (row) {
        // validate
        if (typeof row !== 'object' || !row.hasOwnProperty('options'))
            return;
        // variables
        var _a = row.options, fontFamily = _a.fontFamily, fontSize = _a.fontSize, color = _a.color;
        // style
        fontFamily && this.font(fontFamily);
        fontSize && this.fontSize(fontSize);
        color && this.fillColor(color);
    };
    ;
    // Padding to cells
    // ------------------------------------------------------------------
    /**
     * Entries:
     *
     * padding: [10, 10, 10, 10]
     * padding: [10, 10]
     * padding: {top: 10, right: 10, bottom: 10, left: 10}
     * padding: 10,
     *
     */
    PDFDocument.prototype.prepareCellPadding = function (p) {
        // array
        if (Array.isArray(p)) {
            switch (p.length) {
                case 3:
                    p = __spreadArray(__spreadArray([], p, true), [0], false);
                    break;
                case 2:
                    p = __spreadArray(__spreadArray([], p, true), p, true);
                    break;
                case 1:
                    p = Array(4).fill(p[0]);
                    break;
            }
        }
        // number
        else if (typeof p === 'number') {
            p = Array(4).fill(p);
        }
        // object
        else if (typeof p === 'object') {
            var top_1 = p.top, right = p.right, bottom = p.bottom, left = p.left;
            p = [top_1, right, bottom, left];
        }
        // null
        else {
            p = Array(4).fill(0);
        }
        // resolve
        return {
            top: p[0] >> 0,
            right: p[1] >> 0,
            bottom: p[2] >> 0,
            left: p[3] >> 0
        };
    };
    ;
    // Add page async
    // ------------------------------------------------------------------
    PDFDocument.prototype.addPageAsync = function () {
        var _a = this.page, layout = _a.layout, size = _a.size, margins = _a.margins;
        this.addPage({ layout: layout, size: size, margins: margins });
        return Promise.resolve();
    };
    // Add page event
    // ------------------------------------------------------------------
    // event emitter
    PDFDocument.prototype.pageAddedFire = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // +1
                this.pdfkitTableCache.table.pages += 1;
                // reset peer page (when change direction)
                this.resetPeerPage();
                // reset positions
                this.initialPositionY = this.page.margins.top;
                this.positionY = this.page.margins.top;
                return [2 /*return*/];
            });
        });
    };
    ;
    // Row fill (background header, cells and rows)
    // ------------------------------------------------------------------
    PDFDocument.prototype.createFill = function (rect, fillColor, fillOpacity) {
        var _this = this;
        this.logg('createFill');
        return new Promise(function (resolve, reject) {
            try {
                var x = rect.x, y = rect.y, width = rect.width, height = rect.height;
                var distance = _this.pdfkitTableCache.distanceCorrection;
                // validate
                fillColor || (fillColor = 'grey');
                fillOpacity || (fillOpacity = 0.1);
                // save current style
                _this.save();
                // draw bg
                _this
                    .fill(fillColor)
                    //.stroke(fillColor)
                    .fillOpacity(fillOpacity)
                    // .rect(x, y, width, height + (distance * 2))
                    // .rect(x, y - (distance * 3), width, height + (distance * 2))
                    .rect(x, y - (distance * 3), width, height + (distance * 2))
                    //.stroke()
                    .fill();
                // back to saved style
                _this.restore();
                // callback
                // typeof callback === 'function' && callback(this);
                // done
                resolve();
            }
            catch (error) {
                _this.logg(error);
                reject(error);
            }
        });
    };
    // Divider
    // ------------------------------------------------------------------
    PDFDocument.prototype.createDivider = function (type, x, y, strokeWidth, strokeOpacity, strokeDisabled, strokeColor) {
        var _a, _b;
        var distance = this.pdfkitTableCache.distanceCorrection;
        var direction;
        // type || (type = 'horizontal'); // header | horizontal | vertical 
        switch (type) {
            case 'horizontal':
                direction = (_a = this.pdfkitTableCache.options.divider) === null || _a === void 0 ? void 0 : _a.horizontal;
                break;
            case 'header':
                direction = (_b = this.pdfkitTableCache.options.divider) === null || _b === void 0 ? void 0 : _b.header;
                break;
            default:
                direction = {};
        }
        var _c = direction || {
            width: undefined, color: undefined, opacity: undefined, disabled: false
        }, width = _c.width, color = _c.color, opacity = _c.opacity, disabled = _c.disabled;
        strokeWidth = width || strokeWidth || 0.5;
        strokeColor = color || strokeColor || 'black';
        strokeOpacity = opacity || strokeOpacity || 0.5;
        // disabled
        if (disabled !== undefined) {
            strokeDisabled = disabled;
        }
        else if (strokeDisabled === undefined) {
            strokeDisabled = false;
        }
        var s = (strokeWidth / 2) - distance; // space line and letter
        if (strokeDisabled) {
            this.positionY += (distance * 2);
            return;
        }
        // draw
        this
            .save() // save style
            .moveTo(x, y + s)
            .lineTo(this.pdfkitTableCache.table.width + (this.pdfkitTableCache.options.x || 0), y + s)
            .lineWidth(strokeWidth)
            .strokeColor(strokeColor)
            .opacity(strokeOpacity)
            .stroke()
            .opacity(1) // Reset opacity after drawing the line
            .restore(); // reset style
        // add y
        this.positionY += strokeWidth + (distance * 2);
    };
    // Title key:@title
    // ------------------------------------------------------------------
    PDFDocument.prototype.createTitles = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, title, subtitle, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _a = this.pdfkitTableCache, title = _a.title, subtitle = _a.subtitle;
                        // from options
                        title || (title = this.pdfkitTableCache.options.title);
                        subtitle || (subtitle = this.pdfkitTableCache.options.subtitle);
                        // calc
                        // const calc: number = await this.calcTitleSubtitleHeaderAndFirstLine();
                        _b = this;
                        return [4 /*yield*/, this.calcTitleSubtitleHeaderAndFirstLine()];
                    case 1:
                        // calc
                        // const calc: number = await this.calcTitleSubtitleHeaderAndFirstLine();
                        _b.titleAndHeaderAndFirstLineHeightCalc = _c.sent();
                        if (!this.calcLimitCellOnPage(0, this.titleAndHeaderAndFirstLineHeightCalc)) return [3 /*break*/, 3];
                        // console.log('calcLimitCellOnPage');
                        // this.doNotCreateHeader = true;
                        return [4 /*yield*/, this.addPageAsync()];
                    case 2:
                        // console.log('calcLimitCellOnPage');
                        // this.doNotCreateHeader = true;
                        _c.sent();
                        _c.label = 3;
                    case 3: 
                    // init
                    return [4 /*yield*/, this.createTitle(title, 12, 1, true)];
                    case 4:
                        // init
                        _c.sent();
                        return [4 /*yield*/, this.createTitle(subtitle, 9, 0.7, false)];
                    case 5:
                        _c.sent();
                        resolve('');
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _c.sent();
                        reject('');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    PDFDocument.prototype.createTitle = function (data, size, opacity, isTitle) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!data) {
                resolve();
                return;
            }
            var _a = _this.pdfkitTableCache.options, x = _a.x, y = _a.y;
            var titleHeight = 0;
            // style save
            _this.save();
            // if string      
            if (typeof data === 'string') {
                // font size
                _this.fillColor('black').fontSize(size).opacity(opacity).fill();
                // calc height
                titleHeight = _this.heightOfString(data, {
                    width: _this.pdfkitTableCache.table.width
                });
                // write 
                _this.text(data, x, y, {
                    align: 'left'
                });
            }
            else if (typeof data === 'object') {
                var text = data.label || '';
                if (text) {
                    // aply style
                    data.fontFamily && _this.font(data.fontFamily);
                    data.color && _this.fillColor(data.color);
                    _this.fontSize(data.fontSize || size);
                    // calc height
                    titleHeight = _this.heightOfString(text, {
                        width: _this.pdfkitTableCache.table.width,
                        align: 'left'
                    });
                    // title object
                    _this.text(data.label, x, y, {
                        align: 'left' // TODO: | center | right
                    })
                        .fill();
                }
            }
            if (isTitle) {
                _this.titleHeight = titleHeight;
            }
            else {
                _this.subtitleHeight = titleHeight;
            }
            // style restore
            _this.opacity(1);
            // position y
            _this.positionY += titleHeight + (_this.pdfkitTableCache.distanceCorrection * 2);
            // done
            resolve();
        });
    };
    // Init header key:@header
    // ------------------------------------------------------------------
    PDFDocument.prototype.createHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, top_2, right, left, colIndex, colLen, text, padding, _b, err, rectRow, rectCell, fill, error_2;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _e.trys.push([0, 11, , 12]);
                                    _a = Object(this.pdfkitTableCache.options.padding), top_2 = _a.top, right = _a.right, left = _a.left;
                                    colIndex = void 0;
                                    colLen = this.pdfkitTableCache.table.columns || 0;
                                    text = void 0;
                                    padding = { top: 0, right: 0, bottom: 0, left: 0 };
                                    // x reset
                                    // this.positionX = this.initialPositionX;
                                    // apply style
                                    // this.save();
                                    return [4 /*yield*/, this.pdfkitTableCache.options.prepareHeader()];
                                case 1:
                                    // x reset
                                    // this.positionX = this.initialPositionX;
                                    // apply style
                                    // this.save();
                                    _e.sent();
                                    if (!(this.titleAndHeaderAndFirstLineHeightCalc === 0)) return [3 /*break*/, 3];
                                    _b = this;
                                    return [4 /*yield*/, this.calcTitleSubtitleHeaderAndFirstLine()];
                                case 2:
                                    _b.titleAndHeaderAndFirstLineHeightCalc = _e.sent();
                                    _e.label = 3;
                                case 3:
                                    if (!(this.positionY + this.titleAndHeaderAndFirstLineHeightCalc > this.pdfkitTableCache.safelyPageY)) return [3 /*break*/, 6];
                                    err = 'CRAZY! This a big text on cell';
                                    // console.log(err);
                                    this.logg(err);
                                    return [4 /*yield*/, this.addPageAsync()];
                                case 4:
                                    _e.sent();
                                    return [4 /*yield*/, this.createHeader()];
                                case 5:
                                    _e.sent();
                                    resolve();
                                    return [2 /*return*/];
                                case 6:
                                    if (!(this.titleAndHeaderAndFirstLineHeightCalc > this.pdfkitTableCache.safelyPageHeight)) return [3 /*break*/, 9];
                                    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                                    this.logg('addPage');
                                    // console.log('addPage');
                                    return [4 /*yield*/, this.addPageAsync()];
                                case 7:
                                    // console.log('addPage');
                                    _e.sent();
                                    return [4 /*yield*/, this.createHeader()];
                                case 8:
                                    _e.sent();
                                    resolve();
                                    return [2 /*return*/];
                                case 9:
                                    rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.headerHeight };
                                    this.createFill(rectRow);
                                    // simple header
                                    if (this.isHeaderString) {
                                        // columns
                                        for (colIndex = 0; colIndex < colLen; colIndex++) {
                                            // validade
                                            text = this.pdfkitTableCache.headers[colIndex];
                                            this.logg(text, colIndex);
                                            this.text(text, this.columnPositions[colIndex] + left, this.positionY + top_2, {
                                                width: this.columnSizes[colIndex] - (left + right),
                                                align: 'left'
                                            });
                                        }
                                    }
                                    else {
                                        // columns
                                        for (colIndex = 0; colIndex < colLen; colIndex++) {
                                            rectCell = __assign(__assign({}, rectRow), { x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] });
                                            fill = Object(this.prepareRowFillOptionsHeader(this.pdfkitTableCache.headers[colIndex]));
                                            fill.fill && this.createFill(rectCell, fill.fill, fill.opacity);
                                            // # TODO:
                                            // fontSize: 30, color: 'blue', fontFamily: localType
                                            // header padding
                                            padding = Object(this.headerPadding[colIndex]);
                                            // validade
                                            text = Object(this.pdfkitTableCache.headers[colIndex]).label;
                                            this.logg(text, colIndex);
                                            this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top_2 + padding.top, {
                                                width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                                                align: 'left'
                                            });
                                        }
                                    }
                                    // /!\ dont changer order
                                    // y add
                                    this.positionY += this.headerHeight;
                                    // divider
                                    this.createDivider('horizontal', this.columnPositions[0], this.positionY, 1, 1);
                                    // style restore
                                    // this.restore();
                                    return [4 /*yield*/, ((_d = (_c = this.pdfkitTableCache.options) === null || _c === void 0 ? void 0 : _c.prepareRow) === null || _d === void 0 ? void 0 : _d.call(_c, null))];
                                case 10:
                                    // style restore
                                    // this.restore();
                                    _e.sent();
                                    // to global
                                    // this.pdfkitTableCache.table.columns = colLen;
                                    // console.log('Start Header');
                                    // done
                                    resolve();
                                    return [3 /*break*/, 12];
                                case 11:
                                    error_2 = _e.sent();
                                    // error
                                    reject(error_2);
                                    return [3 /*break*/, 12];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    // Rows - tables.rows key:@rows
    // ------------------------------------------------------------------
    PDFDocument.prototype.createRowString = function (data) {
        var _this = this;
        this.logg('createRowString');
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var rows, _a, top, right, left, distance, rowIndex, colIndex, rowLen, colLen, elm, text, padding, fill, _b, height, veryLongText, haveLongText, _c, lt, _d, fitValue, fitHeight, rectRow, rectCell, _e;
            var _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        rows = data.rows;
                        // has content
                        if (!rows || !rows.length) {
                            resolve();
                            return [2 /*return*/];
                        }
                        // is array whith object
                        if (!Array.isArray(rows[0]) || typeof rows[0][0] !== 'string') {
                            reject();
                            throw new Error('ROWS need be a Array[] with String"". See documentation.');
                        }
                        _a = Object(this.pdfkitTableCache.options.padding), top = _a.top, right = _a.right, left = _a.left;
                        distance = this.pdfkitTableCache.distanceCorrection / 2;
                        rowIndex = 0;
                        colIndex = 0;
                        rowLen = rows.length || 0;
                        colLen = this.pdfkitTableCache.table.columns || 0;
                        padding = { top: 0, right: 0, bottom: 0, left: 0 };
                        fill = { opacity: undefined, fill: undefined };
                        // style
                        return [4 /*yield*/, ((_g = (_f = this.pdfkitTableCache.options) === null || _f === void 0 ? void 0 : _f.prepareRow) === null || _g === void 0 ? void 0 : _g.call(_f, null))];
                    case 1:
                        // style
                        _k.sent();
                        rowIndex = 0;
                        _k.label = 2;
                    case 2:
                        if (!(rowIndex < rowLen)) return [3 /*break*/, 14];
                        _c = Object;
                        return [4 /*yield*/, this.calcRowHeightString(rows[rowIndex], { isHeader: false, preventLongText: true })];
                    case 3:
                        _b = _c.apply(void 0, [_k.sent()]), height = _b.height, veryLongText = _b.veryLongText, haveLongText = _b.haveLongText;
                        this.rowHeight = Number(height);
                        // // console.log('RowString', height, veryLongText, haveLongText);
                        if (haveLongText)
                            this.logg("CRAZY! This a big text on cell");
                        if (!(haveLongText || this.calcLimitCellOnPage(this.positionY, this.rowHeight))) return [3 /*break*/, 6];
                        // console.log('AddPage calc', rowIndex);
                        return [4 /*yield*/, this.addPageAsync()];
                    case 4:
                        // console.log('AddPage calc', rowIndex);
                        _k.sent();
                        return [4 /*yield*/, this.createHeader()];
                    case 5:
                        _k.sent();
                        _k.label = 6;
                    case 6:
                        // // console.log(this.y, 0, this.pdfkitTableCache.safelyPageHeight, this.page.height);
                        // // console.log(rowIndex, 'Y position to writer ', this.positionY + this.rowHeight + 0, 
                        // this.y + this.rowHeight + 0);
                        // element
                        elm = rows[rowIndex];
                        colIndex = 0;
                        _k.label = 7;
                    case 7:
                        if (!(colIndex < colLen)) return [3 /*break*/, 12];
                        // validade
                        text = elm[colIndex];
                        this.positionY || (this.positionY = this.y);
                        // Prevent break page with long text
                        // ----------------------------------------------------
                        // big text
                        if (haveLongText) {
                            lt = veryLongText[colIndex];
                            // if have value to work
                            if (lt) {
                                _d = Object(lt), fitValue = _d.fitValue, fitHeight = _d.fitHeight;
                                // console.log('Entrou', this.rowHeight, fitHeight, fitValue.substring(0, 2));
                                // fit text
                                text = fitValue;
                                // row calc
                                this.rowHeight = fitHeight; // this.rowHeight / percent;
                                // restValue
                                // // console.log(veryLongText[colIndex]);              
                            }
                        }
                        // ----------------------------------------------------
                        // header padding
                        padding = Object(this.headerPadding[colIndex]);
                        rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.rowHeight };
                        rectCell = __assign(__assign({}, rectRow), { x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] });
                        if (!(this.isHeaderString === false)) return [3 /*break*/, 10];
                        // style column by header
                        fill = this.prepareRowFillOptionsData(this.pdfkitTableCache.headers[colIndex]);
                        _e = fill.fill;
                        if (!_e) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.createFill(rectCell, fill.fill, fill.opacity)];
                    case 8:
                        _e = (_k.sent());
                        _k.label = 9;
                    case 9:
                        _e;
                        _k.label = 10;
                    case 10:
                        // ############################## BACKGROUND
                        // ----------------------------------------------------
                        // style
                        (_j = (_h = this.pdfkitTableCache.options) === null || _h === void 0 ? void 0 : _h.prepareRow) === null || _j === void 0 ? void 0 : _j.call(_h, elm, colIndex, rowIndex, rectRow, rectCell);
                        // write
                        // console.log('text', rowIndex, text);
                        this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top - distance, {
                            width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                            align: 'left'
                        });
                        _k.label = 11;
                    case 11:
                        colIndex++;
                        return [3 /*break*/, 7];
                    case 12:
                        // /!\ dont changer order
                        // y add
                        this.positionY += this.rowHeight;
                        // divider
                        // this.createDivider('horizontal', this.initialPositionX, this.positionY);
                        this.createDivider('horizontal', this.columnPositions[0], this.positionY);
                        if (haveLongText) {
                            // await this.addPageAsync();
                        }
                        _k.label = 13;
                    case 13:
                        rowIndex++;
                        return [3 /*break*/, 2];
                    case 14:
                        // x reset
                        // this.positionX = this.initialPositionX;
                        // to global
                        this.pdfkitTableCache.table.lines += rowLen;
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Data - tables.datas key:@datas
    // ------------------------------------------------------------------
    PDFDocument.prototype.createRowObject = function (data) {
        var _this = this;
        this.logg('createRowObject');
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var datas, _a, top, right, bottom, left, distance, rowIndex, colIndex, rowLen, colLen, elm, text, fill, _b, height, veryLongText, haveLongText, _c, _d, property, width, align, valign, padding, renderer, lt, _e, fitValue, fitHeight, rectRow, rectCell, _f, _g, _h, size;
            var _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        datas = data.datas;
                        // has content
                        if (!datas || !datas.length) {
                            resolve();
                            return [2 /*return*/];
                        }
                        // is array whith object
                        if (Array.isArray(datas[0]) || typeof datas[0] !== 'object') {
                            reject();
                            throw new Error('Datas need be a Array[] with Objects{}. See documentation.');
                            return [2 /*return*/];
                        }
                        _a = Object(this.pdfkitTableCache.options.padding), top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
                        distance = this.pdfkitTableCache.distanceCorrection / 2;
                        rowIndex = 0;
                        colIndex = 0;
                        rowLen = datas.length || 0;
                        colLen = this.pdfkitTableCache.table.columns || 0;
                        fill = { opacity: undefined, fill: undefined };
                        rowIndex = 0;
                        _o.label = 1;
                    case 1:
                        if (!(rowIndex < rowLen)) return [3 /*break*/, 19];
                        _c = Object;
                        return [4 /*yield*/, this.calcRowHeightObject(datas[rowIndex], { isHeader: false, preventLongText: true })];
                    case 2:
                        _b = _c.apply(void 0, [_o.sent()]), height = _b.height, veryLongText = _b.veryLongText, haveLongText = _b.haveLongText;
                        this.rowHeight = Number(height);
                        if (haveLongText)
                            this.logg("CRAZY! This a big text on cell");
                        if (!(haveLongText || this.calcLimitCellOnPage(this.positionY, this.rowHeight))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.addPageAsync()];
                    case 3:
                        _o.sent();
                        _o.label = 4;
                    case 4:
                        // element
                        elm = datas[rowIndex];
                        // style row
                        // style
                        (_k = (_j = this.pdfkitTableCache.options) === null || _j === void 0 ? void 0 : _j.prepareRow) === null || _k === void 0 ? void 0 : _k.call(_j, elm);
                        // row options
                        // allow the user to override style for rows
                        this.prepareRowOptions(elm);
                        colIndex = 0;
                        _o.label = 5;
                    case 5:
                        if (!(colIndex < colLen)) return [3 /*break*/, 17];
                        _d = Object(this.pdfkitTableCache.headers[colIndex]), property = _d.property, width = _d.width, align = _d.align, valign = _d.valign, padding = _d.padding, renderer = _d.renderer;
                        // validade
                        text = elm[property];
                        typeof text === 'object' && (text = String(text.label).trim() || '');
                        // Apply cell style options 
                        // ----------------------------------------------------
                        // Prevent break page with long text
                        // ----------------------------------------------------
                        // big text
                        if (haveLongText) {
                            lt = veryLongText[colIndex];
                            // if have value to work
                            if (lt) {
                                _e = Object(lt), fitValue = _e.fitValue, fitHeight = _e.fitHeight;
                                // fit text
                                text = fitValue;
                                // row calc
                                this.rowHeight = fitHeight; // this.rowHeight / percent;
                                // restValue
                                // // console.log(veryLongText[colIndex]);              
                            }
                        }
                        rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.rowHeight };
                        rectCell = __assign(__assign({}, rectRow), { x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] });
                        if (!(colIndex === 0)) return [3 /*break*/, 8];
                        fill = Object(this.prepareRowFillOptionsData(elm));
                        _f = fill.fill;
                        if (!_f) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.createFill(rectCell, fill.fill, fill.opacity)];
                    case 6:
                        _f = (_o.sent());
                        _o.label = 7;
                    case 7:
                        _f;
                        _o.label = 8;
                    case 8:
                        if (!(typeof elm[property] === 'object')) return [3 /*break*/, 12];
                        if (!elm[property].hasOwnProperty('options')) return [3 /*break*/, 11];
                        // set font style
                        this.prepareRowOptions(elm[property]);
                        fill = this.prepareRowFillOptionsData(elm[property]);
                        _g = fill.fill;
                        if (!_g) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.createFill(rectCell, fill.fill, fill.opacity)];
                    case 9:
                        _g = (_o.sent());
                        _o.label = 10;
                    case 10:
                        _g;
                        _o.label = 11;
                    case 11: return [3 /*break*/, 15];
                    case 12:
                        // style column by header
                        fill = this.prepareRowFillOptionsData(this.pdfkitTableCache.headers[colIndex]);
                        _h = fill.fill;
                        if (!_h) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.createFill(rectCell, fill.fill, fill.opacity)];
                    case 13:
                        _h = (_o.sent());
                        _o.label = 14;
                    case 14:
                        _h;
                        _o.label = 15;
                    case 15:
                        // ############################## BACKGROUND
                        // ----------------------------------------------------
                        // TODO: REMOVER 
                        // Apply string style
                        // ----------------------------------------------------
                        // bold
                        if (String(text).substring(0, 5) === 'bold:') {
                            this.font('Helvetica-Bold');
                            text = text.replace('bold:', '');
                        }
                        // size
                        if (String(text).substring(0, 4) === 'size') {
                            size = Number(String(text).substring(4, 4).replace(/\D+/g, ''));
                            this.fontSize(size < 7 ? 7 : size);
                            text = text.replace("size" + size + ":", '');
                        }
                        // 
                        width = width || this.columnSizes[colIndex];
                        align = align || 'left';
                        // renderer
                        if (typeof renderer === 'function') {
                            text = renderer(text, colIndex, rowIndex, elm, rectRow, rectCell); // value, index-column, index-row, row, doc[this]
                        }
                        // style
                        (_m = (_l = this.pdfkitTableCache.options) === null || _l === void 0 ? void 0 : _l.prepareRow) === null || _m === void 0 ? void 0 : _m.call(_l, elm, colIndex, rowIndex, rectRow, rectCell);
                        // write
                        this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top - distance, {
                            width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                            align: 'left'
                        });
                        _o.label = 16;
                    case 16:
                        colIndex++;
                        return [3 /*break*/, 5];
                    case 17:
                        // /!\ dont changer order
                        // y add
                        this.positionY += this.rowHeight;
                        // divider
                        // this.createDivider('horizontal', this.initialPositionX, this.positionY);
                        this.createDivider('horizontal', this.columnPositions[0], this.positionY);
                        _o.label = 18;
                    case 18:
                        rowIndex++;
                        return [3 /*break*/, 1];
                    case 19:
                        // this.positionY += this.y;
                        // x reset
                        // this.positionX = this.initialPositionX;
                        // to global
                        this.pdfkitTableCache.table.lines += rowLen;
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Calc row height (from array)
    // ------------------------------------------------------------------
    PDFDocument.prototype.calcRowHeightString = function (row, opt) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var align, isHeader, preventLongText, _a, left, top, right, bottom, text, height, heightCompute, len, haveLongText, veryLongText, padding, colIndex, safeHeight, percent, lenTextTest, fitValue, fitHeight, maxLoop, ilen, fitValueTest, heightComputeFit, fitValueLength;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        align = opt.align, isHeader = opt.isHeader, preventLongText = opt.preventLongText;
                        _a = Object(this.pdfkitTableCache.options.padding), left = _a.left, top = _a.top, right = _a.right, bottom = _a.bottom;
                        // validate
                        isHeader === undefined && (isHeader = false);
                        align || (align = 'left');
                        text = '';
                        height = isHeader ? 0 : (this.minRowHeight || 0);
                        heightCompute = 0;
                        len = row.length || 0;
                        haveLongText = false;
                        veryLongText = [];
                        padding = { top: 0, right: 0, bottom: 0, left: 0 };
                        colIndex = 0;
                        if (!isHeader) return [3 /*break*/, 2];
                        return [4 /*yield*/, ((_c = (_b = this.pdfkitTableCache.options) === null || _b === void 0 ? void 0 : _b.prepareHeader) === null || _c === void 0 ? void 0 : _c.call(_b))];
                    case 1:
                        _f.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ((_e = (_d = this.pdfkitTableCache.options) === null || _d === void 0 ? void 0 : _d.prepareRow) === null || _e === void 0 ? void 0 : _e.call(_d, null))];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        // loop
                        for (colIndex = 0; colIndex < len; colIndex++) {
                            // value
                            text = row[colIndex];
                            text = String(text).replace('bold:', '').replace('size', ''); // .replace(/^:/g,'');
                            // header padding
                            padding = Object(this.headerPadding[colIndex]);
                            // this.isHeaderString || (padding = this.pdfkitTableCache.headers[i].padding);
                            // calc height size of string
                            heightCompute = this.heightOfString(text, {
                                lineGap: 0,
                                width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                                align: align
                            });
                            // stay max height
                            height = Math.max(height, heightCompute + (padding.top + padding.bottom));
                            // register long text
                            if (preventLongText) {
                                // // console.log('preventLongText', heightCompute, this.pdfkitTableCache.safelyPageHeight);
                                // console.log('AAAA', heightCompute, height);
                                // if row height is bigger 
                                if (heightCompute > this.pdfkitTableCache.safelyPageHeight) {
                                    haveLongText = true;
                                    safeHeight = this.pdfkitTableCache.safelyPageHeight - this.headerHeight - (this.pdfkitTableCache.distanceCorrection * 4);
                                    percent = heightCompute / (safeHeight) + 0.01;
                                    lenTextTest = text.length / percent - 50;
                                    fitValue = '';
                                    fitHeight = 0;
                                    maxLoop = 14;
                                    for (ilen = 0; ilen < maxLoop; ilen++) {
                                        lenTextTest = lenTextTest + (10 * ilen);
                                        lenTextTest = (lenTextTest > text.length ? text.length : lenTextTest) - 7;
                                        fitValueTest = String(text).substring(0, lenTextTest);
                                        heightComputeFit = this.heightOfString(fitValueTest, {
                                            lineGap: 0,
                                            width: this.columnSizes[ilen] - (left + right) - (padding.left + padding.right),
                                            align: align
                                        });
                                        // add header padding
                                        heightComputeFit += (top + bottom) + (padding.top + padding.bottom);
                                        // console.log( ilen + '>', safeHeight, heightComputeFit, fitHeight);
                                        if (heightComputeFit === fitHeight || fitHeight > heightComputeFit) {
                                            ilen = maxLoop;
                                        }
                                        else {
                                            fitValue = fitValueTest;
                                            // fitValue  = fitValueTest.substring(0, lenTextTest - 7); // ??? (FIX break line, no bad solution performance)
                                            fitHeight = heightComputeFit;
                                        }
                                    }
                                    fitValueLength = fitValue.length;
                                    // push prevent
                                    veryLongText.push({
                                        index: colIndex,
                                        key: null,
                                        value: text,
                                        fitValue: fitValue + " +" + (text.length - fitValueLength - 7) + "...",
                                        restValue: String(text).substring(text.length - fitValueLength - 7),
                                        fitHeight: fitHeight
                                    });
                                }
                                // null if normal row size
                                else {
                                    veryLongText.push(null);
                                }
                            }
                        }
                        // minimum row height 
                        // height = Math.max(height, this.pdfkitTableCache.minRowHeight || 0);
                        height = height + this.pdfkitTableCache.distanceCorrection + top + bottom;
                        // return array
                        if (preventLongText) {
                            resolve({
                                height: height,
                                veryLongText: veryLongText,
                                haveLongText: haveLongText
                            });
                        }
                        else {
                            resolve(height);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ;
    // Calc row height (from object)
    // ------------------------------------------------------------------
    PDFDocument.prototype.calcRowHeightObject = function (row, opt) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var align, isHeader, preventLongText, _a, left, top, right, bottom, text, height, heightCompute, len, haveLongText, veryLongText, padding, i, property, safeHeight, percent, fitHeight, lenTextTest, fitValue, maxLoop, ilen, fitValueTest, heightComputeFit, fitValueLength;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        align = opt.align, isHeader = opt.isHeader, preventLongText = opt.preventLongText;
                        _a = Object(this.pdfkitTableCache.options.padding), left = _a.left, top = _a.top, right = _a.right, bottom = _a.bottom;
                        // validate
                        isHeader === undefined && (isHeader = false);
                        align || (align = 'left');
                        text = '';
                        height = isHeader ? 0 : (this.minRowHeight || 0);
                        heightCompute = 0;
                        len = this.pdfkitTableCache.table.columns || 0;
                        haveLongText = false;
                        veryLongText = [];
                        padding = { top: 0, right: 0, bottom: 0, left: 0 };
                        i = 0;
                        if (!isHeader) return [3 /*break*/, 2];
                        return [4 /*yield*/, ((_c = (_b = this.pdfkitTableCache.options) === null || _b === void 0 ? void 0 : _b.prepareHeader) === null || _c === void 0 ? void 0 : _c.call(_b))];
                    case 1:
                        _f.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ((_e = (_d = this.pdfkitTableCache.options) === null || _d === void 0 ? void 0 : _d.prepareRow) === null || _e === void 0 ? void 0 : _e.call(_d, null))];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        // loop
                        for (i = 0; i < len; i++) {
                            property = Object(this.pdfkitTableCache.headers[i]).property;
                            padding = Object(this.headerPadding[i]);
                            // value
                            text = row[property];
                            typeof text === 'object' && (text = text.label || '');
                            text = String(text).replace('bold:', '').replace('size', ''); // .replace(/^:/g,'');
                            // calc height size of string
                            heightCompute = this.heightOfString(text, {
                                lineGap: 0,
                                width: this.columnSizes[i] - (left + right) - (padding.left + padding.right),
                                align: align
                            });
                            // stay max height
                            height = Math.max(height, heightCompute + (padding.top + padding.bottom));
                            // register long text
                            if (preventLongText) {
                                // console.log('preventLongText');
                                // // console.log('preventLongText', heightCompute, this.pdfkitTableCache.safelyPageHeight);
                                // if row height is bigger 
                                if (heightCompute > this.pdfkitTableCache.safelyPageHeight) {
                                    haveLongText = true;
                                    safeHeight = this.pdfkitTableCache.safelyPageHeight - this.headerHeight - (this.pdfkitTableCache.distanceCorrection * 4);
                                    percent = heightCompute / (safeHeight) + 0.01;
                                    fitHeight = safeHeight;
                                    lenTextTest = text.length / percent - 70;
                                    fitValue = '';
                                    maxLoop = 14;
                                    for (ilen = 0; ilen < maxLoop; ilen++) {
                                        lenTextTest = lenTextTest + (10 * ilen);
                                        lenTextTest = (lenTextTest > text.length ? text.length : lenTextTest) - 7;
                                        fitValueTest = String(text).substring(0, lenTextTest);
                                        heightComputeFit = this.heightOfString(fitValueTest, {
                                            lineGap: 0,
                                            width: this.columnSizes[i] - (left + right) - (padding.left + padding.right),
                                            align: align
                                        });
                                        // add header padding
                                        heightComputeFit += (top + bottom) + (padding.top + padding.bottom);
                                        // console.log( ilen + '>', safeHeight, heightComputeFit, fitHeight);
                                        if (heightComputeFit === fitHeight || fitHeight > heightComputeFit) {
                                            ilen = maxLoop;
                                        }
                                        else {
                                            fitValue = fitValueTest;
                                            // fitValue  = fitValueTest.substring(0, lenTextTest - 7); // ??? (FIX break line, no bad solution performance)
                                            fitHeight = heightComputeFit;
                                        }
                                    }
                                    fitValueLength = fitValue.length;
                                    // // console.log('E', fitValue);
                                    // push prevent
                                    veryLongText.push({
                                        index: i,
                                        key: null,
                                        value: text,
                                        fitValue: fitValue + " +" + (text.length - fitValueLength - 7) + "...",
                                        restValue: String(text).substring(text.length - fitValueLength - 7),
                                        fitHeight: fitHeight
                                    });
                                }
                                // null if normal row size
                                else {
                                    veryLongText.push(null);
                                }
                            }
                        }
                        // minimum row height 
                        // height = Math.max(height, this.minRowHeight || 0);
                        height = height + this.pdfkitTableCache.distanceCorrection + (top + bottom); //  + (padding.top + padding.bottom)
                        // // console.log('F', height);
                        // // console.log('G', [
                        //   row,
                        //   height,
                        //   veryLongText,
                        //   haveLongText
                        // ]);
                        // return array
                        if (preventLongText) {
                            resolve([
                                height,
                                veryLongText,
                                haveLongText
                            ]);
                        }
                        else {
                            resolve(height);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    PDFDocument.prototype.calcTitleSubtitleHeaderAndFirstLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, headers, datas, rows, _b, _c, _d, _e, _f, _g, _h, _j, calc, err_1;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    _k.trys.push([0, 9, , 10]);
                                    _a = this.pdfkitTableCache, headers = _a.headers, datas = _a.datas, rows = _a.rows;
                                    if (!(this.headerHeight === 0)) return [3 /*break*/, 4];
                                    if (!(this.isHeaderString === false)) return [3 /*break*/, 2];
                                    _b = this;
                                    _c = Number;
                                    return [4 /*yield*/, this.calcRowHeightObject(headers, { isHeader: true })];
                                case 1:
                                    _b.headerHeight = _c.apply(void 0, [_k.sent()]);
                                    return [3 /*break*/, 4];
                                case 2:
                                    _d = this;
                                    _e = Number;
                                    return [4 /*yield*/, this.calcRowHeightString(headers, { isHeader: true })];
                                case 3:
                                    _d.headerHeight = _e.apply(void 0, [_k.sent()]);
                                    _k.label = 4;
                                case 4:
                                    if (!(this.firstLineHeight === 0)) return [3 /*break*/, 8];
                                    if (!(datas.length > 0)) return [3 /*break*/, 6];
                                    _f = this;
                                    _g = Number;
                                    return [4 /*yield*/, this.calcRowHeightObject(datas[0], { isHeader: true })];
                                case 5:
                                    _f.firstLineHeight = _g.apply(void 0, [_k.sent()]);
                                    this.logg(this.firstLineHeight, 'datas');
                                    return [3 /*break*/, 8];
                                case 6:
                                    if (!(rows.length > 0)) return [3 /*break*/, 8];
                                    _h = this;
                                    _j = Number;
                                    return [4 /*yield*/, this.calcRowHeightString(rows[0], { isHeader: true })];
                                case 7:
                                    _h.firstLineHeight = _j.apply(void 0, [_k.sent()]);
                                    this.logg(this.firstLineHeight, 'rows');
                                    _k.label = 8;
                                case 8:
                                    calc = (this.titleHeight +
                                        this.subtitleHeight +
                                        this.headerHeight + // + header height 
                                        this.firstLineHeight + // + first line height
                                        (this.pdfkitTableCache.distanceCorrection * 2) // space between titles and lines
                                    );
                                    resolve(calc);
                                    return [2 /*return*/];
                                case 9:
                                    err_1 = _k.sent();
                                    reject(0);
                                    return [2 /*return*/];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    // Calc last position y + new row height
    // ------------------------------------------------------------------
    PDFDocument.prototype.calcLimitCellOnPage = function (y, height) {
        if (y === 0) {
            y = Math.max(this.y, this.positionY);
        }
        // this.y
        return (y + height >= this.pdfkitTableCache.safelyPageY);
    };
    // Init loop key:@data
    // ------------------------------------------------------------------
    PDFDocument.prototype.createTable = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.logg('createTable');
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var table, datas, rows;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    table = data.table;
                                    datas = table.datas, rows = table.rows;
                                    // lopps
                                    return [4 /*yield*/, this.createRowObject({ datas: datas })];
                                case 1:
                                    // lopps
                                    _a.sent();
                                    return [4 /*yield*/, this.createRowString({ rows: rows })];
                                case 2:
                                    _a.sent();
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    // Resume
    // ------------------------------------------------------------------
    PDFDocument.prototype.tableResume = function () {
        return __assign(__assign({}, this.pdfkitTableCache.table), { y: this.positionY, x: this.positionX });
    };
    // Table - THE MAGIC key:@table
    // ------------------------------------------------------------------
    PDFDocument.prototype.table = function (table, options, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // prepare
                        table = this.prepareTable(table);
                        options = __assign(__assign({}, options), table.options); // merge options
                        options = this.prepareOptions(options);
                        this.initCalcs();
                        this.initValidates();
                        // on fire
                        this.on('pageAdded', this.pageAddedFire);
                        // init
                        this.logg('table');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        // the big magic
                        return [4 /*yield*/, this.createTitles()];
                    case 2:
                        // the big magic
                        _a.sent();
                        return [4 /*yield*/, this.createHeader()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.createTable({ table: table })];
                    case 4:
                        _a.sent();
                        // update position
                        this.y = this.positionY;
                        // break
                        this.moveDown();
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        this.logg(error_3);
                        throw new Error(String(error_3));
                    case 6:
                        // off fire
                        this.off('pageAdded', this.pageAddedFire);
                        // this.logg(resolve);
                        typeof callback === 'function' && callback(this.tableResume()); // TODO: remove
                        return [2 /*return*/, Promise.resolve(this.tableResume())];
                }
            });
        });
    };
    // Join tables key:@tables
    // ------------------------------------------------------------------
    PDFDocument.prototype.tables = function (tables) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var len, i, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 8, , 9]);
                                    if (!Array.isArray(tables)) return [3 /*break*/, 5];
                                    len = tables.length;
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < len)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.table(tables[i], tables[i].options || {})];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 7];
                                case 5:
                                    if (!(typeof tables === 'object')) return [3 /*break*/, 7];
                                    // else is tables is a unique table object
                                    return [4 /*yield*/, this.table(tables, {})];
                                case 6:
                                    // else is tables is a unique table object
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    // done!
                                    resolve(this.tableResume());
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_4 = _a.sent();
                                    // ops!
                                    reject(error_4);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    PDFDocument.prototype.logg = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // // console.log(args);
    };
    return PDFDocument;
}(PDFDocumentSource));
exports.PDFDocument = PDFDocument;
exports["default"] = PDFDocument;
