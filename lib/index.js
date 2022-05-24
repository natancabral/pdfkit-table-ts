"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFDocument = void 0;
const PDFDocumentSource = require("pdfkit");
;
;
class PDFDocument extends PDFDocumentSource {
    constructor(option = {}) {
        super(option);
        this.pdfkitTableCache = {
            title: '',
            subtitle: '',
            headers: [],
            datas: [],
            rows: [],
            options: {
                prepareHeader: () => { },
                prepareRow: () => { },
            },
            table: {
                width: 0,
                pages: 1,
                lines: 0,
                columns: 0,
                summation: [],
            },
            distanceCorrection: 1.5,
            safelyPageHeight: 0,
            safelyPageY: 0,
        };
        this.prepareRowFillOptionsHeader = (object) => {
            const undefinedDefault = { fill: undefined, opacity: undefined };
            if (typeof object !== 'object') {
                return undefinedDefault;
            }
            let { fill, opac } = {};
            object.options && (object = object.options);
            const { headerColor, headerOpacity, columnColor, columnOpacity } = object;
            if (headerColor) {
                fill = headerColor;
                opac = headerOpacity;
            }
            else if (columnColor) {
                fill = columnColor;
                opac = columnOpacity;
            }
            return {
                opacity: opac,
                fill
            };
        };
        this.prepareRowFillOptionsData = (object) => {
            const undefinedDefault = { fill: undefined, opacity: undefined };
            if (typeof object !== 'object') {
                return undefinedDefault;
            }
            let { fill, opac } = {};
            object.options && object.options.backgroundColor && (object = object.options);
            const { columnColor, columnOpacity, backgroundColor, backgroundOpacity } = object;
            if (backgroundColor) {
                fill = backgroundColor;
                opac = backgroundOpacity;
            }
            else if (columnColor) {
                fill = columnColor;
                opac = columnOpacity;
            }
            return {
                opacity: opac,
                fill
            };
        };
        this.addBackground = this.createFill;
        this.opt = option;
    }
    initValidates() {
        if (this.isHeaderString === false || !this.pdfkitTableCache.headers || !this.pdfkitTableCache.table.columns) {
            new Error('Please, defined headers. Use hideHeader option to hide header.');
            return;
        }
        if (this.isHeaderString && this.pdfkitTableCache.datas.length) {
            new Error('Combination simple "header" + complex "datas" dont works.');
            return;
        }
    }
    initCalcs() {
        this.resetPeerTable();
        this.resetPeerPage();
        this.initColumns();
    }
    resetPeerTable() {
        this.initialPositionX = this.pdfkitTableCache.options.x;
        this.positionX = this.pdfkitTableCache.options.x;
        this.positionY = (this.pdfkitTableCache.options.y || this.y) + (this.pdfkitTableCache.distanceCorrection * 2);
        this.titleHeight = this.pdfkitTableCache.title ? 20 : (this.pdfkitTableCache.options.title ? 20 : 0);
        this.subtitleHeight = this.pdfkitTableCache.subtitle ? 15 : (this.pdfkitTableCache.options.subtitle ? 15 : 0);
        this.headerHeight = 0;
        this.firstLineHeight = 0;
        this.titleAndHeaderAndFirstLineHeightCalc = 0;
        this.rowHeight = 0;
        this.minRowHeight = this.pdfkitTableCache.options.minRowHeight || 0;
    }
    resetPeerPage() {
        this.pdfkitTableCache.safelyPageHeight = this.page.height - (this.page.margins.bottom + this.page.margins.top);
        this.pdfkitTableCache.safelyPageY = this.page.height - (this.page.margins.bottom);
    }
    initColumns() {
        let w = 0;
        let h = [];
        let p = [];
        w = this.page.width - this.page.margins.right - (this.pdfkitTableCache.options.x || 0);
        this.pdfkitTableCache.options.width && (w = Number(String(this.pdfkitTableCache.options.width).replace(/\D+/g, '')));
        this.pdfkitTableCache.headers.forEach((el) => el.width && h.push(el.width >> 0));
        h.length === 0 && (h = this.pdfkitTableCache.options.columnsSize || []);
        h.length === 0 && (h = Array(this.pdfkitTableCache.table.columns).fill((w / this.pdfkitTableCache.table.columns)));
        h.length && (w = h.reduce((prev, curr) => prev + curr, 0));
        h.reduce((prev, curr) => {
            p.push(prev);
            return prev + curr;
        }, this.pdfkitTableCache.options.x || 0);
        h.length && (this.columnSizes = h);
        p.length && (this.columnPositions = p);
        this.pdfkitTableCache.table.width = w;
    }
    prepareTable(table) {
        typeof table === 'string' && (table = JSON.parse(table));
        table || (table = {});
        table.title || (table.title = '');
        table.subtitle || (table.subtitle = '');
        table.headers || (table.headers = []);
        table.datas || (table.datas = []);
        table.rows || (table.rows = []);
        table.options || (table.options = {});
        this.headerPadding = Array(table.headers.length).fill(this.prepareCellPadding(0));
        table.headers.map((el, index) => {
            if (typeof el === 'string') {
                this.isHeaderString = true;
                return el;
            }
            el.backgroundColor && (el.columnColor = el.backgroundColor);
            el.backgroundOpacity && (el.columnOpacity = el.backgroundOpacity);
            el.background && el.background.color && (el.columnColor = el.background.color);
            el.background && el.background.opacity && (el.columnColor = el.background.opacity);
            el.padding = this.prepareCellPadding(el.padding);
            this.headerPadding[index] = el.padding;
            return el;
        });
        this.pdfkitTableCache.table.columns = table.headers.length;
        this.pdfkitTableCache = Object.assign(Object.assign({}, this.pdfkitTableCache), table);
        return table;
    }
    prepareOptions(options) {
        options = options || {};
        options.padding || (options.padding);
        options.hideHeader || (options.hideHeader = false);
        options.columnsSize || (options.columnsSize = []);
        options.addPage || (options.addPage = false);
        options.absolutePosition || (options.absolutePosition = false);
        options.minRowHeight || (options.minRowHeight = 0);
        options.width || (options.width = 0);
        if (options.x === null) {
            options.x = this.page.margins.left;
        }
        options.x || (options.x = this.positionX || this.initialPositionX || this.x || this.page.margins.left || 0);
        options.padding = this.prepareCellPadding(options.padding);
        if (options.columnSpacing && typeof options.columnSpacing === 'number') {
            options.padding.top = options.padding.bottom = options.columnSpacing;
        }
        options.divider || (options.divider = {});
        options.divider.header || (options.divider.header = { disabled: false, width: undefined, opacity: undefined });
        options.divider.horizontal || (options.divider.horizontal = { disabled: false, width: undefined, opacity: undefined });
        options.divider.vertical || (options.divider.vertical = { disabled: true, width: undefined, opacity: undefined });
        options.title || (options.title = null);
        options.subtitle || (options.subtitle = null);
        options.prepareHeader || (options.prepareHeader = () => this.fillColor('black').font("Helvetica-Bold").fontSize(8).fill());
        options.prepareRow || (options.prepareRow = (row, indexRow, rectRow, rectCell) => this.fillColor('black').font("Helvetica").fontSize(8).fill());
        options.preventLongText === undefined && (options.preventLongText = true);
        this.pdfkitTableCache = Object.assign(Object.assign({}, this.pdfkitTableCache), { options });
        return options;
    }
    prepareRowOptions(row) {
        if (typeof row !== 'object' || !row.hasOwnProperty('options'))
            return;
        const { fontFamily, fontSize, color } = row.options;
        fontFamily && this.font(fontFamily);
        fontSize && this.fontSize(fontSize);
        color && this.fillColor(color);
    }
    ;
    prepareCellPadding(p) {
        if (Array.isArray(p)) {
            switch (p.length) {
                case 3:
                    p = [...p, 0];
                    break;
                case 2:
                    p = [...p, ...p];
                    break;
                case 1:
                    p = Array(4).fill(p[0]);
                    break;
            }
        }
        else if (typeof p === 'number') {
            p = Array(4).fill(p);
        }
        else if (typeof p === 'object') {
            const { top, right, bottom, left } = p;
            p = [top, right, bottom, left];
        }
        else {
            p = Array(4).fill(0);
        }
        return {
            top: p[0] >> 0,
            right: p[1] >> 0,
            bottom: p[2] >> 0,
            left: p[3] >> 0,
        };
    }
    ;
    addPageAsync() {
        const { layout, size, margins } = this.page;
        this.addPage({ layout, size, margins });
        return Promise.resolve();
    }
    pageAddedFire() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pdfkitTableCache.table.pages += 1;
            this.resetPeerPage();
            this.initialPositionY = this.page.margins.top;
            this.positionY = this.page.margins.top;
            if (this.doNotCreateHeader) {
                this.doNotCreateHeader = undefined;
                return;
            }
        });
    }
    ;
    createFill(rect, fillColor, fillOpacity) {
        this.logg('createFill');
        return new Promise((resolve, reject) => {
            try {
                const { x, y, width, height } = rect;
                const distance = this.pdfkitTableCache.distanceCorrection;
                fillColor || (fillColor = 'grey');
                fillOpacity || (fillOpacity = 0.1);
                this.save();
                this
                    .fill(fillColor)
                    .fillOpacity(fillOpacity)
                    .rect(x, y - (distance * 3), width, height + (distance * 2))
                    .fill();
                this.restore();
                resolve();
            }
            catch (error) {
                this.logg(error);
                reject(error);
            }
        });
    }
    createDivider(type, x, y, strokeWidth, strokeOpacity, strokeDisabled, strokeColor) {
        var _a, _b;
        const distance = this.pdfkitTableCache.distanceCorrection;
        let direction;
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
        const { width, color, opacity, disabled } = direction || {
            width: undefined, color: undefined, opacity: undefined, disabled: false
        };
        strokeWidth = width || strokeWidth || 0.5;
        strokeColor = color || strokeColor || 'black';
        strokeOpacity = opacity || strokeOpacity || 0.5;
        if (disabled !== undefined) {
            strokeDisabled = disabled;
        }
        else if (strokeDisabled === undefined) {
            strokeDisabled = false;
        }
        const s = (strokeWidth / 2) - distance;
        if (strokeDisabled) {
            this.positionY += (distance * 2);
            return;
        }
        this
            .save()
            .moveTo(x, y + s)
            .lineTo(this.pdfkitTableCache.table.width + (this.pdfkitTableCache.options.x || 0), y + s)
            .lineWidth(strokeWidth)
            .strokeColor(strokeColor)
            .opacity(strokeOpacity)
            .stroke()
            .opacity(1)
            .restore();
        this.positionY += strokeWidth + (distance * 2);
    }
    createTitles() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { title, subtitle } = this.pdfkitTableCache;
                title || (title = this.pdfkitTableCache.options.title);
                subtitle || (subtitle = this.pdfkitTableCache.options.subtitle);
                this.titleAndHeaderAndFirstLineHeightCalc = yield this.calcTitleSubtitleHeaderAndFirstLine();
                console.log(this.titleAndHeaderAndFirstLineHeightCalc);
                if (this.calcLimitCellOnPage(0, this.titleAndHeaderAndFirstLineHeightCalc)) {
                    this.doNotCreateHeader = true;
                    yield this.addPageAsync();
                }
                yield this.createTitle(title, 12, 1, true);
                yield this.createTitle(subtitle, 9, 0.7, false);
                resolve('');
            }
            catch (error) {
                reject('');
            }
        }));
    }
    createTitle(data, size, opacity, isTitle) {
        return new Promise((resolve) => {
            if (!data) {
                resolve();
                return;
            }
            const { x, y } = this.pdfkitTableCache.options;
            let titleHeight = 0;
            this.save();
            if (typeof data === 'string') {
                this.fillColor('black').fontSize(size).opacity(opacity).fill();
                titleHeight = this.heightOfString(data, {
                    width: this.pdfkitTableCache.table.width,
                });
                this.text(data, x, y, {
                    align: 'left'
                });
            }
            else if (typeof data === 'object') {
                let text = data.label || '';
                if (text) {
                    data.fontFamily && this.font(data.fontFamily);
                    data.color && this.fillColor(data.color);
                    this.fontSize(data.fontSize || size);
                    titleHeight = this.heightOfString(text, {
                        width: this.pdfkitTableCache.table.width,
                        align: 'left',
                    });
                    this.text(data.label, x, y, {
                        align: 'left'
                    })
                        .fill();
                }
            }
            if (isTitle) {
                this.titleHeight = titleHeight;
            }
            else {
                this.subtitleHeight = titleHeight;
            }
            this.opacity(1);
            this.positionY += titleHeight + (this.pdfkitTableCache.distanceCorrection * 2);
            resolve();
        });
    }
    createHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const { top, right, left } = Object(this.pdfkitTableCache.options.padding);
                    let colIndex;
                    let colLen = this.pdfkitTableCache.table.columns || 0;
                    let text;
                    let padding = { top: 0, right: 0, bottom: 0, left: 0 };
                    yield this.pdfkitTableCache.options.prepareHeader();
                    if (this.titleAndHeaderAndFirstLineHeightCalc === 0) {
                        this.titleAndHeaderAndFirstLineHeightCalc = yield this.calcTitleSubtitleHeaderAndFirstLine();
                    }
                    if (this.positionY + this.titleAndHeaderAndFirstLineHeightCalc > this.pdfkitTableCache.safelyPageY) {
                        const err = 'CRAZY! This a big text on cell';
                        console.log(err);
                        this.logg(err);
                        yield this.addPageAsync();
                        yield this.createHeader();
                        resolve();
                        return;
                    }
                    else if (this.titleAndHeaderAndFirstLineHeightCalc > this.pdfkitTableCache.safelyPageHeight) {
                        this.logg('addPage');
                        console.log('addPage');
                        yield this.addPageAsync();
                        yield this.createHeader();
                        resolve();
                        return;
                    }
                    const rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.headerHeight };
                    this.createFill(rectRow);
                    if (this.isHeaderString) {
                        for (colIndex = 0; colIndex < colLen; colIndex++) {
                            text = this.pdfkitTableCache.headers[colIndex];
                            this.logg(text, colIndex);
                            this.text(text, this.columnPositions[colIndex] + left, this.positionY + top, {
                                width: this.columnSizes[colIndex] - (left + right),
                                align: 'left',
                            });
                        }
                    }
                    else {
                        for (colIndex = 0; colIndex < colLen; colIndex++) {
                            const rectCell = Object.assign(Object.assign({}, rectRow), { x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] });
                            let fill = Object(this.prepareRowFillOptionsHeader(this.pdfkitTableCache.headers[colIndex]));
                            fill.fill && this.createFill(rectCell, fill.fill, fill.opacity);
                            padding = Object(this.headerPadding[colIndex]);
                            text = Object(this.pdfkitTableCache.headers[colIndex]).label;
                            this.logg(text, colIndex);
                            this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top, {
                                width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                                align: 'left',
                            });
                        }
                    }
                    this.positionY += this.headerHeight;
                    this.createDivider('horizontal', this.columnPositions[0], this.positionY, 1, 1);
                    yield ((_b = (_a = this.pdfkitTableCache.options) === null || _a === void 0 ? void 0 : _a.prepareRow) === null || _b === void 0 ? void 0 : _b.call(_a, null));
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    createRowString(data) {
        this.logg('createRowString');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { rows } = data;
            if (!rows || !rows.length) {
                resolve();
                return;
            }
            if (!Array.isArray(rows[0]) || typeof rows[0][0] !== 'string') {
                reject();
                throw new Error('ROWS need be a Array[] with String"". See documentation.');
            }
            const { top, right, left } = Object(this.pdfkitTableCache.options.padding);
            const distance = this.pdfkitTableCache.distanceCorrection / 2;
            let rowIndex = 0;
            let colIndex = 0;
            let rowLen = rows.length || 0;
            let colLen = this.pdfkitTableCache.table.columns || 0;
            let elm;
            let text;
            let padding = { top: 0, right: 0, bottom: 0, left: 0 };
            let fill = { opacity: undefined, fill: undefined };
            yield ((_b = (_a = this.pdfkitTableCache.options) === null || _a === void 0 ? void 0 : _a.prepareRow) === null || _b === void 0 ? void 0 : _b.call(_a, null));
            for (rowIndex = 0; rowIndex < rowLen; rowIndex++) {
                const { height, veryLongText, haveLongText } = Object(yield this.calcRowHeightString(rows[rowIndex], { isHeader: false, preventLongText: true }));
                this.rowHeight = Number(height);
                if (haveLongText)
                    this.logg(`CRAZY! This a big text on cell`);
                if (haveLongText || this.calcLimitCellOnPage(this.positionY, this.rowHeight)) {
                    yield this.addPageAsync();
                    yield this.createHeader();
                }
                elm = rows[rowIndex];
                for (colIndex = 0; colIndex < colLen; colIndex++) {
                    text = elm[colIndex];
                    this.positionY || (this.positionY = this.y);
                    if (haveLongText) {
                        let lt = veryLongText[colIndex];
                        if (lt) {
                            const { fitValue, fitHeight } = Object(lt);
                            text = fitValue;
                            this.rowHeight = fitHeight;
                        }
                    }
                    padding = Object(this.headerPadding[colIndex]);
                    const rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.rowHeight };
                    const rectCell = Object.assign(Object.assign({}, rectRow), { x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] });
                    if (this.isHeaderString === false) {
                        fill = this.prepareRowFillOptionsData(this.pdfkitTableCache.headers[colIndex]);
                        fill.fill && (yield this.createFill(rectCell, fill.fill, fill.opacity));
                    }
                    (_d = (_c = this.pdfkitTableCache.options) === null || _c === void 0 ? void 0 : _c.prepareRow) === null || _d === void 0 ? void 0 : _d.call(_c, elm, colIndex, rowIndex, rectRow, rectCell);
                    this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top - distance, {
                        width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                        align: 'left',
                    });
                }
                this.positionY += this.rowHeight;
                this.createDivider('horizontal', this.columnPositions[0], this.positionY);
                if (haveLongText) {
                }
            }
            this.pdfkitTableCache.table.lines += rowLen;
            resolve();
        }));
    }
    createRowObject(data) {
        this.logg('createRowObject');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { datas } = data;
            if (!datas || !datas.length) {
                resolve();
                return;
            }
            if (Array.isArray(datas[0]) || typeof datas[0] !== 'object') {
                reject();
                throw new Error('Datas need be a Array[] with Objects{}. See documentation.');
                return;
            }
            const { top, right, bottom, left } = Object(this.pdfkitTableCache.options.padding);
            const distance = this.pdfkitTableCache.distanceCorrection / 2;
            let rowIndex = 0;
            let colIndex = 0;
            let rowLen = datas.length || 0;
            let colLen = this.pdfkitTableCache.table.columns || 0;
            let elm;
            let text;
            let fill = { opacity: undefined, fill: undefined };
            for (rowIndex = 0; rowIndex < rowLen; rowIndex++) {
                const { height, veryLongText, haveLongText } = Object(yield this.calcRowHeightObject(datas[rowIndex], { isHeader: false, preventLongText: true }));
                this.rowHeight = Number(height);
                if (haveLongText)
                    this.logg(`CRAZY! This a big text on cell`);
                if (haveLongText || this.calcLimitCellOnPage(this.positionY, this.rowHeight)) {
                    yield this.addPageAsync();
                }
                elm = datas[rowIndex];
                (_b = (_a = this.pdfkitTableCache.options) === null || _a === void 0 ? void 0 : _a.prepareRow) === null || _b === void 0 ? void 0 : _b.call(_a, elm);
                this.prepareRowOptions(elm);
                for (colIndex = 0; colIndex < colLen; colIndex++) {
                    let { property, width, align, valign, padding, renderer } = Object(this.pdfkitTableCache.headers[colIndex]);
                    text = elm[property];
                    typeof text === 'object' && (text = String(text.label).trim() || '');
                    if (haveLongText) {
                        let lt = veryLongText[colIndex];
                        if (lt) {
                            const { fitValue, fitHeight } = Object(lt);
                            text = fitValue;
                            this.rowHeight = fitHeight;
                        }
                    }
                    const rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.rowHeight };
                    const rectCell = Object.assign(Object.assign({}, rectRow), { x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] });
                    if (colIndex === 0) {
                        fill = Object(this.prepareRowFillOptionsData(elm));
                        fill.fill && (yield this.createFill(rectCell, fill.fill, fill.opacity));
                    }
                    if (typeof elm[property] === 'object') {
                        if (elm[property].hasOwnProperty('options')) {
                            this.prepareRowOptions(elm[property]);
                            fill = this.prepareRowFillOptionsData(elm[property]);
                            fill.fill && (yield this.createFill(rectCell, fill.fill, fill.opacity));
                        }
                    }
                    else {
                        fill = this.prepareRowFillOptionsData(this.pdfkitTableCache.headers[colIndex]);
                        fill.fill && (yield this.createFill(rectCell, fill.fill, fill.opacity));
                    }
                    if (String(text).substring(0, 5) === 'bold:') {
                        this.font('Helvetica-Bold');
                        text = text.replace('bold:', '');
                    }
                    if (String(text).substring(0, 4) === 'size') {
                        let size = Number(String(text).substring(4, 4).replace(/\D+/g, ''));
                        this.fontSize(size < 7 ? 7 : size);
                        text = text.replace(`size${size}:`, '');
                    }
                    width = width || this.columnSizes[colIndex];
                    align = align || 'left';
                    if (typeof renderer === 'function') {
                        text = renderer(text, colIndex, rowIndex, elm, rectRow, rectCell);
                    }
                    (_d = (_c = this.pdfkitTableCache.options) === null || _c === void 0 ? void 0 : _c.prepareRow) === null || _d === void 0 ? void 0 : _d.call(_c, elm, colIndex, rowIndex, rectRow, rectCell);
                    this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top - distance, {
                        width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                        align: 'left',
                    });
                }
                this.positionY += this.rowHeight;
                this.createDivider('horizontal', this.columnPositions[0], this.positionY);
            }
            this.pdfkitTableCache.table.lines += rowLen;
            resolve();
        }));
    }
    calcRowHeightString(row, opt) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let { align, isHeader, preventLongText } = opt;
            const { left, top, right, bottom } = Object(this.pdfkitTableCache.options.padding);
            isHeader === undefined && (isHeader = false);
            align || (align = 'left');
            let text = '';
            let height = isHeader ? 0 : (this.minRowHeight || 0);
            let heightCompute = 0;
            let len = row.length || 0;
            let haveLongText = false;
            let veryLongText = [];
            let padding = { top: 0, right: 0, bottom: 0, left: 0 };
            let colIndex = 0;
            if (isHeader) {
                yield ((_b = (_a = this.pdfkitTableCache.options) === null || _a === void 0 ? void 0 : _a.prepareHeader) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
            else {
                yield ((_d = (_c = this.pdfkitTableCache.options) === null || _c === void 0 ? void 0 : _c.prepareRow) === null || _d === void 0 ? void 0 : _d.call(_c, null));
            }
            for (colIndex = 0; colIndex < len; colIndex++) {
                text = row[colIndex];
                text = String(text).replace('bold:', '').replace('size', '');
                padding = Object(this.headerPadding[colIndex]);
                heightCompute = this.heightOfString(text, {
                    lineGap: 0,
                    width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
                    align,
                });
                height = Math.max(height, heightCompute + (padding.top + padding.bottom));
                if (preventLongText) {
                    if (heightCompute > this.pdfkitTableCache.safelyPageHeight) {
                        haveLongText = true;
                        let safeHeight = this.pdfkitTableCache.safelyPageHeight - this.headerHeight - (this.pdfkitTableCache.distanceCorrection * 4);
                        let percent = heightCompute / (safeHeight) + 0.01;
                        let lenTextTest = text.length / percent - 50;
                        let fitValue = '';
                        let fitHeight = 0;
                        let maxLoop = 14;
                        for (let ilen = 0; ilen < maxLoop; ilen++) {
                            lenTextTest = lenTextTest + (10 * ilen);
                            lenTextTest = (lenTextTest > text.length ? text.length : lenTextTest) - 7;
                            const fitValueTest = String(text).substring(0, lenTextTest);
                            let heightComputeFit = this.heightOfString(fitValueTest, {
                                lineGap: 0,
                                width: this.columnSizes[ilen] - (left + right) - (padding.left + padding.right),
                                align,
                            });
                            heightComputeFit += (top + bottom) + (padding.top + padding.bottom);
                            if (heightComputeFit === fitHeight || fitHeight > heightComputeFit) {
                                ilen = maxLoop;
                            }
                            else {
                                fitValue = fitValueTest;
                                fitHeight = heightComputeFit;
                            }
                        }
                        const fitValueLength = fitValue.length;
                        veryLongText.push({
                            index: colIndex,
                            key: null,
                            value: text,
                            fitValue: `${fitValue} +${text.length - fitValueLength - 7}...`,
                            restValue: String(text).substring(text.length - fitValueLength - 7),
                            fitHeight,
                        });
                    }
                    else {
                        veryLongText.push(null);
                    }
                }
            }
            height = height + this.pdfkitTableCache.distanceCorrection + top + bottom;
            if (preventLongText) {
                resolve({
                    height,
                    veryLongText,
                    haveLongText
                });
            }
            else {
                resolve(height);
            }
        }));
    }
    ;
    calcRowHeightObject(row, opt) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let { align, isHeader, preventLongText } = opt;
            const { left, top, right, bottom } = Object(this.pdfkitTableCache.options.padding);
            isHeader === undefined && (isHeader = false);
            align || (align = 'left');
            let text = '';
            let height = isHeader ? 0 : (this.minRowHeight || 0);
            let heightCompute = 0;
            let len = this.pdfkitTableCache.table.columns || 0;
            let haveLongText = false;
            let veryLongText = [];
            let padding = { top: 0, right: 0, bottom: 0, left: 0 };
            let i = 0;
            if (isHeader) {
                yield ((_b = (_a = this.pdfkitTableCache.options) === null || _a === void 0 ? void 0 : _a.prepareHeader) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
            else {
                yield ((_d = (_c = this.pdfkitTableCache.options) === null || _c === void 0 ? void 0 : _c.prepareRow) === null || _d === void 0 ? void 0 : _d.call(_c, null));
            }
            for (i = 0; i < len; i++) {
                const { property } = Object(this.pdfkitTableCache.headers[i]);
                padding = Object(this.headerPadding[i]);
                text = row[property];
                typeof text === 'object' && (text = text.label || '');
                text = String(text).replace('bold:', '').replace('size', '');
                heightCompute = this.heightOfString(text, {
                    lineGap: 0,
                    width: this.columnSizes[i] - (left + right) - (padding.left + padding.right),
                    align,
                });
                height = Math.max(height, heightCompute + (padding.top + padding.bottom));
                if (preventLongText) {
                    if (heightCompute > this.pdfkitTableCache.safelyPageHeight) {
                        haveLongText = true;
                        let safeHeight = this.pdfkitTableCache.safelyPageHeight - this.headerHeight - (this.pdfkitTableCache.distanceCorrection * 4);
                        let percent = heightCompute / (safeHeight) + 0.01;
                        let fitHeight = safeHeight;
                        let lenTextTest = text.length / percent - 70;
                        let fitValue = '';
                        let maxLoop = 14;
                        for (let ilen = 0; ilen < maxLoop; ilen++) {
                            lenTextTest = lenTextTest + (10 * ilen);
                            lenTextTest = (lenTextTest > text.length ? text.length : lenTextTest) - 7;
                            const fitValueTest = String(text).substring(0, lenTextTest);
                            let heightComputeFit = this.heightOfString(fitValueTest, {
                                lineGap: 0,
                                width: this.columnSizes[i] - (left + right) - (padding.left + padding.right),
                                align,
                            });
                            heightComputeFit += (top + bottom) + (padding.top + padding.bottom);
                            if (heightComputeFit === fitHeight || fitHeight > heightComputeFit) {
                                ilen = maxLoop;
                            }
                            else {
                                fitValue = fitValueTest;
                                fitHeight = heightComputeFit;
                            }
                        }
                        const fitValueLength = fitValue.length;
                        veryLongText.push({
                            index: i,
                            key: null,
                            value: text,
                            fitValue: `${fitValue} +${text.length - fitValueLength - 7}...`,
                            restValue: String(text).substring(text.length - fitValueLength - 7),
                            fitHeight,
                        });
                    }
                    else {
                        veryLongText.push(null);
                    }
                }
            }
            height = height + this.pdfkitTableCache.distanceCorrection + (top + bottom);
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
            return;
        }));
    }
    calcTitleSubtitleHeaderAndFirstLine() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { headers, datas, rows } = this.pdfkitTableCache;
                    if (this.headerHeight === 0) {
                        if (this.isHeaderString === false) {
                            this.headerHeight = Number(yield this.calcRowHeightObject(headers, { isHeader: true }));
                        }
                        else {
                            this.headerHeight = Number(yield this.calcRowHeightString(headers, { isHeader: true }));
                        }
                    }
                    if (this.firstLineHeight === 0) {
                        if (datas.length > 0) {
                            this.firstLineHeight = Number(yield this.calcRowHeightObject(datas[0], { isHeader: true }));
                            this.logg(this.firstLineHeight, 'datas');
                        }
                        else if (rows.length > 0) {
                            this.firstLineHeight = Number(yield this.calcRowHeightString(rows[0], { isHeader: true }));
                            this.logg(this.firstLineHeight, 'rows');
                        }
                    }
                    const calc = (this.titleHeight +
                        this.subtitleHeight +
                        this.headerHeight +
                        this.firstLineHeight +
                        (this.pdfkitTableCache.distanceCorrection * 2));
                    resolve(calc);
                    return;
                }
                catch (err) {
                    reject(0);
                    return;
                }
            }));
        });
    }
    calcLimitCellOnPage(y, height) {
        if (y === 0) {
            y = Math.max(this.y, this.positionY);
        }
        return (y + height >= this.pdfkitTableCache.safelyPageY);
    }
    createTable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logg('createTable');
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const { table } = data;
                const { datas, rows } = table;
                yield this.createRowObject({ datas });
                yield this.createRowString({ rows });
                resolve();
            }));
        });
    }
    tableResume() {
        return Object.assign(Object.assign({}, this.pdfkitTableCache.table), { y: this.positionY, x: this.positionX });
    }
    table(table, options, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            table = this.prepareTable(table);
            options = Object.assign(Object.assign({}, options), table.options);
            options = this.prepareOptions(options);
            this.initCalcs();
            this.initValidates();
            this.on('pageAdded', this.pageAddedFire);
            this.logg('table');
            try {
                yield this.createTitles();
                yield this.createHeader();
                yield this.createTable({ table });
                this.y = this.positionY;
                this.moveDown();
            }
            catch (error) {
                this.logg(error);
                throw new Error(String(error));
            }
            this.off('pageAdded', this.pageAddedFire);
            typeof callback === 'function' && callback(this.tableResume());
            return Promise.resolve(this.tableResume());
        });
    }
    tables(tables, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (Array.isArray(tables)) {
                        for (let i = 0; i < tables.length; i++) {
                            yield this.table(tables[i], tables[i].options || {});
                        }
                    }
                    else if (typeof tables === 'object') {
                        yield this.table(tables, {});
                    }
                    typeof callback === 'function' && callback(this.tableResume());
                    resolve(this.tableResume());
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    logg(...args) {
    }
}
exports.PDFDocument = PDFDocument;
exports.default = PDFDocument;
//# sourceMappingURL=index.js.map