declare const PDFDocumentSource: any;
import { Data, Divider, Header, Options, Padding, Rect, Table, Title } from "./types";
export interface IFillAndOpacity {
    fill: string | undefined;
    opacity: number | undefined;
}
export interface IOptions {
    title?: string | Title;
    subtitle?: string | Title;
    width?: number;
    x?: number | null;
    y?: number;
    divider?: Divider | undefined;
    columnsSize?: number[];
    padding?: number[] | Padding;
    hideHeader?: boolean;
    minRowHeight?: number;
    prepareHeader: () => any;
    prepareRow: (row: any, indexColumn?: number, indexRow?: number, rectRow?: Rect, rectCell?: Rect) => any;
}
interface ICalcRowHeightOptions {
    align?: string;
    isHeader?: boolean;
    preventLongText?: boolean;
}
interface IPdfkitTableCache {
    title: string | Title;
    subtitle: string | Title;
    headers: (string | Header)[];
    datas: Data[];
    rows: string[][];
    options: IOptions;
    table: {
        width: number;
        pages: number;
        lines: number;
        columns: number;
        summation: any[];
    };
    distanceCorrection: number;
    safelyPageHeight: number;
    safelyPageY: number;
}
declare class PDFDocument extends PDFDocumentSource {
    pdfkitTableCache: IPdfkitTableCache;
    constructor(option?: any);
    initValidates(): void;
    initCalcs(): void;
    resetPeerTable(): void;
    resetPeerPage(): void;
    initColumns(): void;
    prepareTable(table: any): any;
    prepareOptions(options?: any): any;
    prepareRowOptions(row: any): void;
    prepareRowFillOptionsHeader: (object: any) => IFillAndOpacity;
    prepareRowFillOptionsData: (object: any) => IFillAndOpacity;
    prepareCellPadding(p: number | number[]): Padding;
    addPageAsync(): Promise<void>;
    pageAddedFire(): Promise<void>;
    createFill(rect: Rect, fillColor?: string, fillOpacity?: number): Promise<void>;
    addBackground: (rect: Rect, fillColor?: string | undefined, fillOpacity?: number | undefined) => Promise<void>;
    createDivider(type: string, x: number, y: number, strokeWidth?: number, strokeOpacity?: number, strokeDisabled?: boolean, strokeColor?: string): void;
    createTitles(): Promise<unknown>;
    createTitle(data: string | Title | undefined, size?: number, opacity?: number, isTitle?: boolean): Promise<void>;
    createHeader(): Promise<void>;
    createRowString(data: any): Promise<void>;
    createRowObject(data: any): Promise<void>;
    calcRowHeightString(row: any, opt: ICalcRowHeightOptions): Promise<number | any>;
    calcRowHeightObject(row: any, opt: ICalcRowHeightOptions): Promise<number | any[]>;
    calcTitleSubtitleHeaderAndFirstLine(): Promise<number>;
    calcLimitCellOnPage(y: number, height: number): boolean;
    createTable(data: any): Promise<void>;
    tableResume(): {
        y: any;
        x: any;
        width: number;
        pages: number;
        lines: number;
        columns: number;
        summation: any[];
    };
    table(table: Table, options: Options, callback?: Function): Promise<{
        y: any;
        x: any;
        width: number;
        pages: number;
        lines: number;
        columns: number;
        summation: any[];
    }>;
    tables(tables: Table[], callback?: Function): Promise<unknown>;
    logg(...args: any[]): void;
}
export default PDFDocument;
export { PDFDocument };
//# sourceMappingURL=index.d.ts.map