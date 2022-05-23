declare module 'pdfkit-table' {
    import PDFDocument from 'pdfkit';
    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    interface Header {
        label?: string;
        property?: string;
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
    interface DataOptions {
        fontSize: number;
        fontFamily: string;
        separation: boolean;
    }
    interface Data {
        [key: string]: string | {
            label: string;
            options: DataOptions;
        };
    }
    interface Table {
        title?: string;
        subtitle?: string;
        headers?: (string | Header)[];
        datas?: Data[];
        rows?: string[][];
        options?: Options;
    }
    interface DividerOptions {
        disabled: boolean;
        width: number;
        opacity: number;
    }
    interface Divider {
        header: DividerOptions;
        horizontal: DividerOptions;
    }
    interface Options {
        title?: string;
        subtitle?: string;
        width?: number;
        x?: number;
        y?: number;
        divider?: Divider;
        columnsSize?: number[];
        columnSpacing?: number;
        padding?: number[];
        addPage?: boolean;
        hideHeader?: boolean;
        minRowHeight?: number;
        prepareHeader?: () => PDFDocumentWithTables;
        prepareRow?: (row: number, indexColumn?: number, indexRow?: number, rectRow?: Rect, rectCell?: Rect) => PDFDocumentWithTables;
    }
    class PDFDocumentWithTables extends PDFDocument {
        table(table: Table, options?: Options): Promise<void>;
    }
    export default PDFDocumentWithTables;
}
//# sourceMappingURL=types-old.d.ts.map