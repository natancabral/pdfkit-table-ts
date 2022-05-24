export declare type IPadding = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare type IRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export interface IHeader {
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
    renderer?: (value: any, indexColumn?: number, indexRow?: number, row?: number, rectRow?: IRect, rectCell?: IRect) => string;
}
export interface IDataOptions {
    fontSize: number;
    fontFamily: string;
    separation: boolean;
}
export interface IObjectData {
    label: string;
    options: IDataOptions;
}
export interface IData {
    [key: string]: (string | number | boolean | null | IObjectData);
}
export interface IDividerOptions {
    disabled?: boolean;
    width?: number;
    opacity?: number;
    color?: string;
}
export interface IDivider {
    header: IDividerOptions;
    horizontal: IDividerOptions;
}
export interface ITitle {
    label: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}
export interface ITable {
    title?: string | ITitle;
    subtitle?: string | ITitle;
    headers: (string | IHeader)[];
    datas?: IData[];
    rows?: string[][];
    options?: IOptions;
}
export interface IOptions {
    title?: string | ITitle;
    subtitle?: string | ITitle;
    width?: number;
    x?: number | null;
    y?: number;
    divider?: IDivider;
    columnsSize?: number[];
    padding?: number[] | IPadding;
    hideHeader?: boolean;
    minRowHeight?: number;
    prepareHeader?: () => any;
    prepareRow?: (row: number, indexColumn?: number, indexRow?: number, rectRow?: IRect, rectCell?: IRect) => any;
}
//# sourceMappingURL=types.d.ts.map