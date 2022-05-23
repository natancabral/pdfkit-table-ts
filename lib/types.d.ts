export declare type Padding = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export interface Header {
    label: string;
    property: string;
    width?: number;
    align?: string;
    valign?: string;
    headerColor?: string;
    headerOpacity?: number;
    headerAlign?: string;
    columnColor?: string;
    columnOpacity?: number;
    renderer?: (value: any, indexColumn?: number, indexRow?: number, row?: number, rectRow?: Rect, rectCell?: Rect) => string;
}
export interface DataOptions {
    fontSize: number;
    fontFamily: string;
    separation: boolean;
}
export interface ObjectData {
    label: string;
    options: DataOptions;
}
export interface Data {
    [key: string]: (string | number | boolean | null) | ObjectData;
}
export interface DividerOptions {
    disabled?: boolean;
    width?: number;
    opacity?: number;
    color?: string;
}
export interface Divider {
    header: DividerOptions;
    horizontal: DividerOptions;
}
export interface Title {
    label: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}
export interface Table {
    title?: string | Title;
    subtitle?: string | Title;
    headers: (string | Header)[];
    datas?: Data[];
    rows?: string[][];
    options?: Options;
}
export interface Options {
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
    prepareHeader?: () => any;
    prepareRow?: (row: number, indexColumn?: number, indexRow?: number, rectRow?: Rect, rectCell?: Rect) => () => any;
}
//# sourceMappingURL=types.d.ts.map