declare const PDFDocumentSource: any;
import { IData, IDivider, IHeader, IOptions, IPadding, IRect, ITable, ITitle } from "./types";
interface IIFillAndOpacity {
    fill: string | undefined;
    opacity: number | undefined;
}
interface IIOptions {
    title?: string | ITitle;
    subtitle?: string | ITitle;
    width?: number;
    x?: number | null;
    y?: number;
    divider?: IDivider | undefined;
    columnsSize?: number[];
    padding?: number[] | IPadding;
    hideHeader?: boolean;
    minRowHeight?: number;
    prepareHeader: () => any;
    prepareRow: (row: any, indexColumn?: number, indexRow?: number, rectRow?: IRect, rectCell?: IRect) => any;
}
interface IICalcRowHeightOptions {
    align?: string;
    isHeader?: boolean;
    preventLongText?: boolean;
}
interface IIPdfkitTableCache {
    title: string | ITitle;
    subtitle: string | ITitle;
    headers: (string | IHeader)[];
    datas: IData[];
    rows: string[][];
    options: IIOptions;
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
    pdfkitTableCache: IIPdfkitTableCache;
    constructor(option?: any);
    private initValidates;
    private initCalcs;
    resetPeerTable(): void;
    resetPeerPage(): void;
    initColumns(): void;
    prepareTable(table: any): any;
    prepareOptions(options?: any): any;
    prepareRowOptions(row: any): void;
    prepareRowFillOptionsHeader: (object: any) => IIFillAndOpacity;
    prepareRowFillOptionsData: (object: any) => IIFillAndOpacity;
    prepareCellPadding(p: number | number[]): IPadding;
    addPageAsync(): Promise<void>;
    pageAddedFire(): Promise<void>;
    createFill(rect: IRect, fillColor?: string, fillOpacity?: number): Promise<void>;
    addBackground: (rect: IRect, fillColor?: string | undefined, fillOpacity?: number | undefined) => Promise<void>;
    createDivider(type: string, x: number, y: number, strokeWidth?: number, strokeOpacity?: number, strokeDisabled?: boolean, strokeColor?: string): void;
    createTitles(): Promise<unknown>;
    createTitle(data: string | ITitle | undefined, size?: number, opacity?: number, isTitle?: boolean): Promise<void>;
    createHeader(): Promise<void>;
    createRowString(data: any): Promise<void>;
    createRowObject(data: any): Promise<void>;
    calcRowHeightString(row: any, opt: IICalcRowHeightOptions): Promise<number | any>;
    calcRowHeightObject(row: any, opt: IICalcRowHeightOptions): Promise<number | any[]>;
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
    table(table: ITable, options: IOptions, callback?: Function): Promise<{
        y: any;
        x: any;
        width: number;
        pages: number;
        lines: number;
        columns: number;
        summation: any[];
    }>;
    tables(tables: ITable[], callback?: Function): Promise<unknown>;
    logg(...args: any[]): void;
}
export default PDFDocument;
export { PDFDocument };
//# sourceMappingURL=index.d.ts.map