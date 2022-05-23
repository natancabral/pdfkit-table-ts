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

// declare module 'pdfkit-table' 
// {
// }

const PDFDocumentSource = require("pdfkit");
import { Data, DataOptions, Divider, DividerOptions, Header, ObjectData, Options, Padding, Rect, Table, Title } from "./types";

export interface IFillAndOpacity
{
  fill: string | undefined; 
  opacity: number | undefined;
}

export interface IOptions
{
  title?: string | Title;
  subtitle?: string | Title;
  width?: number;
  x?: number | null; 
  y?: number; 
  divider?: Divider | undefined;
  columnsSize?: number[];
  // columnSpacing?: number; //default 5
  padding?: number[] | Padding; 
  // addPage?: boolean;
  hideHeader?: boolean;
  minRowHeight?: number;
  prepareHeader: () => any;
  prepareRow: (
    row: any,
    indexColumn?: number,
    indexRow?: number,
    rectRow?: Rect,
    rectCell?: Rect
  ) => any;
}

interface IDividerStroke {
  width?: number | undefined; 
  color?: string | undefined;
  opacity?: number | undefined; 
  disabled?: boolean | undefined;
};

interface ICalcRowHeightOptions {
  align?: string; 
  isHeader?: boolean; 
  preventLongText?: boolean;
}

interface IPdfkitTableCache {
    // cache
    title: string | Title;
    subtitle: string | Title;
    headers: (string | Header)[];
		datas: Data[];
		rows: string[][];
    options: IOptions;
    // table resume
    table: {
      width: number; // px
      pages: number;
      lines: number;
      columns: number;
      summation: any[];
    };
    distanceCorrection: number;
    safelyPageHeight: number;
    safelyPageY: number;
};

class PDFDocument extends PDFDocumentSource 
{
  // variables
  pdfkitTableCache: IPdfkitTableCache = {
    // cache
    title: '',
    subtitle: '',
    headers: [],
    datas: [],
    rows: [],
    options: {
      prepareHeader: () => {},
      prepareRow: () => {},
    },
    // promise return
    table: {
      width: 0, // px
      pages: 1,
      lines: 0,
      columns: 0,
      summation: [],
    },
    distanceCorrection: 1.5,
    safelyPageHeight: 0,
    safelyPageY: 0,
  };

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
  // headerHeightAndFirstLineAndTitleCalc: number = 0;

  // Contructor
  // ------------------------------------------------------------------

  constructor(option: any = {}) 
  {
    super(option);
    this.opt = option;
  }

  // Init validates
  // ------------------------------------------------------------------

  initValidates() 
  {
    // validate
    if(this.isHeaderString === false || !this.pdfkitTableCache.headers || !this.pdfkitTableCache.table.columns)
    {
      new Error('Please, defined headers. Use hideHeader option to hide header.');
      return;
    }
    // header simple header and complex datas
    if(this.isHeaderString && this.pdfkitTableCache.datas.length)
    {
      new Error('Combination simple "header" + complex "datas" dont works.');
      return;
    }
    
  }

  // Init calc
  // ------------------------------------------------------------------
  initCalcs() 
  {
    // reset global values
    this.resetPeerTable();
    // reset peer page
    this.resetPeerPage();
    // columns
    this.initColumns();
  }

  // Reset table
  // ------------------------------------------------------------------
  resetPeerTable() 
  {
    // fixed initial x position 
    this.initialPositionX = this.pdfkitTableCache.options.x;
    // position by cell
    this.positionX        = this.pdfkitTableCache.options.x;
    // position by row
    this.positionY        = (this.pdfkitTableCache.options.y || this.y) + (this.pdfkitTableCache.distanceCorrection * 2);
    // header
    // this.isHeaderString   = this.pdfkitTableCache.table.columns ? (typeof this.pdfkitTableCache.headers[0] === 'string') : false;

    // TODO: Dont works
    // default size to fit new page
    this.titleHeight    = this.pdfkitTableCache.title     ? 15 : (this.pdfkitTableCache.options.title     ? 15 : 0);
    this.subtitleHeight = this.pdfkitTableCache.subtitle  ? 10 : (this.pdfkitTableCache.options.subtitle  ? 10 : 0);

    this.headerHeight = 0; // cache
    this.headerHeightAndFirstLine = 0; // big cell
    this.headerHeightAndFirstLineAndTitleCalc = 0; // big cell with title + subtitle
    this.rowHeight = 0; // default row height
    this.minRowHeight = this.pdfkitTableCache.options.minRowHeight || 0; // default min row height
  }

  // Reset page
  // ------------------------------------------------------------------
  resetPeerPage() 
  {
    this.pdfkitTableCache.safelyPageHeight = this.page.height - (this.page.margins.bottom + this.page.margins.top); // add this.rowHeight
    this.pdfkitTableCache.safelyPageY = this.page.height - (this.page.margins.bottom); // add this.y || this.positionY first calc page
  }

  // Read columns
  // ------------------------------------------------------------------
  initColumns() {
    
    let w: number = 0;  // table width
    let h: number[] = []; // header width
    let p: number[] = []; // position

    // (table width) 1o - Max size table
    w = this.page.width - this.page.margins.right - (this.pdfkitTableCache.options.x || 0);
    // (table width) 2o - Size defined
    // this.pdfkitTableCache.options.width && (w = String(this.pdfkitTableCache.options.width).replace(/\D+/g,'') >> 0);
    this.pdfkitTableCache.options.width && (w = Number(String(this.pdfkitTableCache.options.width).replace(/\D+/g,'')));

    // (table width) if table is percent of page 
    // TODO:

    // (size columns) 1o
    this.pdfkitTableCache.headers.forEach((el: any) => el.width && h.push(el.width >> 0));
    
    // (size columns) 1o
    h.length === 0 && (h = this.pdfkitTableCache.options.columnsSize || []);
    // (size columns) 2o
    h.length === 0 && (h = Array(this.pdfkitTableCache.table.columns).fill((w / this.pdfkitTableCache.table.columns)));

    // if headers has width, apply tables width priority (sum columns width)
    // (table width) 3o
    h.length && (w = h.reduce((prev, curr) => prev + curr, 0));

    // set columnPositions
    h.reduce((prev: number, curr: number) => {
      p.push(prev); // >> 0
      return prev + curr;
    }, this.pdfkitTableCache.options.x || 0); // TODO: zero or padding left ??

    // done
    h.length && (this.columnSizes = h);
    p.length && (this.columnPositions = p);
    this.pdfkitTableCache.table.width = w;

    // // console.log(w, h, p);
  }
  
  // Prepare table data
  // ------------------------------------------------------------------
  prepareTable(table: any) 
  {
    // parse json 
    typeof table === 'string' && (table = JSON.parse(table));

    // validate
    table           || (table = {});
    table.title     || (table.title = '');
    table.subtitle  || (table.subtitle = '');
    table.headers   || (table.headers = []);
    table.datas     || (table.datas = []);
    table.rows      || (table.rows = []);
    table.options   || (table.options = {});

    // TODO: create prepareHeaders
    // header padding default
    this.headerPadding = Array(table.headers.length).fill(this.prepareCellPadding(0));
    // map header
    table.headers.map((el: any, index: number) =>
    {
      // validade
      if(typeof el === 'string')
      {
        this.isHeaderString = true;
        return el;
      }
      // fill
      el.backgroundColor    && (el.columnColor = el.backgroundColor);
      el.backgroundOpacity  && (el.columnOpacity = el.backgroundOpacity);
      el.background         && el.background.color    && (el.columnColor = el.background.color);
      el.background         && el.background.opacity  && (el.columnColor = el.background.opacity);
      // header padding
      el.padding = this.prepareCellPadding(el.padding);
      this.headerPadding[index] = el.padding;

      return el;
    });

    // header length
    this.pdfkitTableCache.table.columns = table.headers.length;
    
    // global
    this.pdfkitTableCache = { ...this.pdfkitTableCache, ...table };

    return table;
  }

  // Prepare options 
  // ------------------------------------------------------------------
  prepareOptions(options?: any) 
  {
    // validate
    options = options           || {};
    options.padding             || (options.padding);
    options.hideHeader          || (options.hideHeader = false);
    options.columnsSize         || (options.columnsSize = []);
    options.addPage             || (options.addPage = false);
    options.absolutePosition    || (options.absolutePosition = false);
    options.minRowHeight        || (options.minRowHeight = 0);
    options.width               || (options.width = 0);
    // TODO: options.hyperlink           || (options.hyperlink = { urlToLink: false, description: null }); // true || false

    // position correction
    if(options.x === null)
    {
      options.x = this.page.margins.left;
    }
    options.x                   || (options.x = this.positionX || this.initialPositionX || this.x || this.page.margins.left || 0);
    // options.x                || (options.x = this.page.margins.left || this.x || 100);
    // options.y                || (options.y = this.page.margins.top);

    // validate padding
    options.padding = this.prepareCellPadding(options.padding);

    // TODO: Remove is 0.2.5x ---------------------------------------------
    // 0.1.x correction
    if(options.columnSpacing && typeof options.columnSpacing === 'number') 
    {
      options.padding.top = options.padding.bottom = options.columnSpacing;
    }
    // --------------------------------------------------------------------

    // divider lines
    options.divider             || (options.divider             = {});
    options.divider.header      || (options.divider.header      = { disabled: false, width: undefined, opacity: undefined });
    options.divider.horizontal  || (options.divider.horizontal  = { disabled: false, width: undefined, opacity: undefined });
    options.divider.vertical    || (options.divider.vertical    = { disabled: true, width: undefined, opacity: undefined });

    options.title               || (options.title = null);
    options.subtitle            || (options.subtitle = null);

    // prepare style
    options.prepareHeader       || (options.prepareHeader = (): Partial<any> => this.fillColor('black').font("Helvetica-Bold").fontSize(8).fill());
    options.prepareRow          || (options.prepareRow = (row?: any, indexRow?: number, rectRow?: any, rectCell?: any): unknown => this.fillColor('black').font("Helvetica").fontSize(8).fill());
    // options.prepareCell      || (options.prepareCell = (cell, indexColumn, indexRow, indexCell, rectCell) => this.fillColor('black').font("Helvetica").fontSize(8).fill());

    // validate
    options.preventLongText === undefined && (options.preventLongText = true);

    // global
    this.pdfkitTableCache = { ...this.pdfkitTableCache, options };

    return options;
  }

  // Prepare row options style
  // ------------------------------------------------------------------
  prepareRowOptions(row: any)
  {    
    // validate
    if(typeof row !== 'object' || !row.hasOwnProperty('options')) return;

    // variables
    const { fontFamily, fontSize, color } = row.options;

    // style
    fontFamily && this.font(fontFamily); 
    fontSize && this.fontSize(fontSize); 
    color && this.fillColor(color);
  };

  // Prepare fill options TO ONLY header
  prepareRowFillOptionsHeader = (object: any): IFillAndOpacity => 
  {
    const undefinedDefault = { fill: undefined, opacity: undefined };

    // validate
    if(typeof object !== 'object')
    {
      return undefinedDefault;
    }

    // variables
    let { fill, opac }:{ fill?: string | undefined, opac?: number | undefined } = {};
    // if options exists
    object.options && (object = object.options);
    // extract
    const { headerColor, headerOpacity, columnColor, columnOpacity } = object;
    
    if(headerColor)
    {
      fill = headerColor; 
      opac = headerOpacity;
    } 
    else if(columnColor) // ^0.1.70
    {
      fill = columnColor; 
      opac = columnOpacity;
    } 

    // values
    return {
      opacity: opac,
      fill
    };    

  }

  // Prepare fill options TO ONLY data
  prepareRowFillOptionsData = (object: any) : IFillAndOpacity => 
  {
    const undefinedDefault = { fill: undefined, opacity: undefined };

    // validate
    if(typeof object !== 'object')
    {
      return undefinedDefault;
    }

    // variables
    let { fill, opac }:{ fill?: string | undefined, opac?: number | undefined } = {};
    // if options exists
    object.options && object.options.backgroundColor && (object = object.options);
    // extract
    const { columnColor, columnOpacity, backgroundColor, backgroundOpacity } = object;
    
    if(backgroundColor)
    {
      fill = backgroundColor; 
      opac = backgroundOpacity;
    }
    else if(columnColor) // ^0.1.70
    {
      fill = columnColor; 
      opac = columnOpacity;
    }

    // values
    return {
      opacity: opac,
      fill
    };
  };

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

  prepareCellPadding(p: number | number[]) : Padding
  {
    // array
    if(Array.isArray(p)){
      switch(p.length){
        case 3: p = [...p, 0]; break;
        case 2: p = [...p, ...p]; break;
        case 1
        : p = Array(4).fill(p[0]); break;
      }
    }
    // number
    else if(typeof p === 'number'){
      p = Array(4).fill(p);
    }
    // object
    else if(typeof p === 'object'){
      const {top, right, bottom, left} = p;
      p = [top, right, bottom, left];
    } 
    // null
    else {
      p = Array(4).fill(0);
    }
    // resolve
    return {
      top:    p[0] >> 0, // int
      right:  p[1] >> 0, 
      bottom: p[2] >> 0, 
      left:   p[3] >> 0,
    };
  };

  // Add page async
  // ------------------------------------------------------------------
  addPageAsync()
  {
    const { layout, size, margins } = this.page;
    this.addPage({ layout, size, margins });
    return Promise.resolve();          
  }

  // Add page event
  // ------------------------------------------------------------------
  // event emitter
  async pageAddedFire()
  {
    // +1
    this.pdfkitTableCache.table.pages += 1;

    // reset peer page (when change direction)
    this.resetPeerPage();

    // reset positions
    this.initialPositionY = this.page.margins.top;
    this.positionY = this.page.margins.top;

    // add header

    if(this.doNotCreateHeader)
    {
      this.doNotCreateHeader = undefined
      return;
    }

    // const { headers } = this.pdfkitTableCache;
    // this.createHeader({ headers });  
    // await this.createHeader();  
  };

  // Row fill (background header, cells and rows)
  // ------------------------------------------------------------------
  createFill(rect: Rect, fillColor?: string, fillOpacity?: number): Promise<void>
  {
    this.logg('createFill');
    return new Promise((resolve, reject) => 
    {
      try 
      {
        const { x, y, width, height }: Rect = rect;
        const distance = this.pdfkitTableCache.distanceCorrection;

        // validate
        fillColor || (fillColor = 'grey');
        fillOpacity || (fillOpacity = 0.1);

        // save current style
        this.save();

        // draw bg
        this
        .fill(fillColor)
        //.stroke(fillColor)
        .fillOpacity(fillOpacity)
        // .rect(x, y, width, height + (distance * 2))
        // .rect(x, y - (distance * 3), width, height + (distance * 2))
        .rect(x, y - (distance * 3), width, height + (distance * 2))
        //.stroke()
        .fill();

        // back to saved style
        this.restore();
        // callback
        // typeof callback === 'function' && callback(this);
        // done
        resolve();
      } 
      catch (error) 
      {
        this.logg(error);
        reject(error);
      }
    });
  }
  // v0.1.x
  addBackground = this.createFill;

  // Divider
  // ------------------------------------------------------------------
  createDivider(type: string, x: number, y: number, strokeWidth?: number, strokeOpacity?: number, strokeDisabled?: boolean, strokeColor?: string)
  {
    const distance = this.pdfkitTableCache.distanceCorrection;
    let direction: DividerOptions | undefined;
    // type || (type = 'horizontal'); // header | horizontal | vertical 

    switch(type)
    {
      case 'horizontal': 
        direction = this.pdfkitTableCache.options.divider?.horizontal
      break;
      case 'header': 
        direction = this.pdfkitTableCache.options.divider?.header
      break;
      default:
        direction = {};
    }

    const { width, color, opacity, disabled }: IDividerStroke = direction || {
      width: undefined, color: undefined, opacity: undefined, disabled: false
    }; 

    strokeWidth     = width    || strokeWidth    || 0.5;
    strokeColor     = color    || strokeColor    || 'black';
    strokeOpacity   = opacity  || strokeOpacity  || 0.5;

    // disabled
    if(disabled !== undefined)
    {
      strokeDisabled = disabled;
    }
    else if(strokeDisabled === undefined)
    {
      strokeDisabled = false;
    }

    const s = (strokeWidth / 2) - distance; // space line and letter
    
    if(strokeDisabled)
    {
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
  }

  // Title key:@title
  // ------------------------------------------------------------------
  createTitles()
  {
    return new Promise( async (resolve, reject) => 
    {
      try 
      {
        // from table
        let { title, subtitle }: { title?: string | Title | undefined; subtitle: string | Title | undefined } = this.pdfkitTableCache; 

        // from options
        title     || (title = this.pdfkitTableCache.options.title);
        subtitle  || (subtitle = this.pdfkitTableCache.options.subtitle);

        // calc
        const calc: number = await this.calcTitleSubtitleHeaderAndFirstLine();      
        // console.log(calc);  
        if(this.calcLimitCellOnPage(0, calc))
        {
          // console.log('calcLimitCellOnPage');
          this.doNotCreateHeader = true;
          await this.addPageAsync();
        }

        // init
        await this.createTitle(title, 12, 1, true);
        await this.createTitle(subtitle, 9, 0.7, false);
        resolve('');
      }
      catch (error) 
      {
        reject('');
      }
    });
  }

  createTitle(data: string | Title | undefined, size?: number, opacity?: number, isTitle?: boolean): Promise<void>
  {
    return new Promise((resolve) => 
    {
      if(!data)
      {
        resolve();
        return;
      } 

      const { x, y } = this.pdfkitTableCache.options;
      let titleHeight;

      // style save
      this.save();

      // if string      
      if(typeof data === 'string' )
      {
        // font size
        this.fillColor('black').fontSize(size).opacity(opacity).fill();

        // calc height
        titleHeight = this.heightOfString(data, 
        {
          width: this.pdfkitTableCache.table.width,
        });
        

        // write 
        this.text(data, x, y, 
        {
          align: 'left'
        });

      } 
      else if(typeof data === 'object')
      {
        let text = data.label || '';

        if(text)
        {
          // aply style
          data.fontFamily && this.font(data.fontFamily);
          data.color && this.fillColor(data.color);
          this.fontSize(data.fontSize || size);

          // calc height
          titleHeight = this.heightOfString(text, 
          {
            width: this.pdfkitTableCache.table.width,
            align: 'left', // TODO: | center | right
          });
          
          // title object
          this.text(data.label, x, y, 
          {
            align: 'left'  // TODO: | center | right
          })
          .fill();
          
        }
      }  

      if(isTitle)
      {
        this.titleHeight = titleHeight;
      }
      else
      {
        this.subtitleHeight = titleHeight;
      }      

      // style restore
      this.opacity(1);
      // position y
      this.positionY += titleHeight + (this.pdfkitTableCache.distanceCorrection * 2);
      // done
      resolve();

    });
  }

  // Init header key:@header
  // ------------------------------------------------------------------

  async createHeader(): Promise<void>
  {
    return new Promise( async (resolve, reject) => 
    {
      try 
      {
        // console.log('Start Header');

        // variables
        const { top, right, left } = Object(this.pdfkitTableCache.options.padding);
        let colIndex: number; // index
        let colLen: number = this.pdfkitTableCache.table.columns || 0; // array columns
        let text: any;
        let padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 }; // header padding

        // x reset
        // this.positionX = this.initialPositionX;

        // apply style
        // this.save();
        await this.pdfkitTableCache.options.prepareHeader();

        // // --------------------------------------------------------------------------------
        // // --------------------------------------------------------------------------------
        // // --------------------------------------------------------------------------------
        // // calc row height
        // if(this.headerHeight === 0)
        // {
        //   if(this.isHeaderString === false)
        //   {
        //     this.headerHeight = await this.calcRowHeightObject(headers, { isHeader: true });
        //   }
        //   else
        //   {
        //     this.headerHeight = await this.calcRowHeightString(headers, { isHeader: true });
        //   }
        // }

        // // calc first table line when init table
        // if(this.headerHeightAndFirstLine === 0)
        // {
        //   if(this.pdfkitTableCache.datas.length > 0)
        //   {
        //     this.headerHeightAndFirstLine = await this.calcRowHeightObject(this.pdfkitTableCache.datas[0], { isHeader: true });
        //     this.logg(this.headerHeightAndFirstLine, 'datas');
        //   }
        //   else if(this.pdfkitTableCache.rows.length > 0)
        //   {
        //     this.headerHeightAndFirstLine = await this.calcRowHeightString(this.pdfkitTableCache.rows[0], { isHeader: true });
        //     this.logg(this.headerHeightAndFirstLine, 'rows');
        //   }
        // }

        // // calc if header + first line fit on last space page
        // this.headerHeightAndFirstLineAndTitleCalc = 0 +
        //   this.positionY + // last y position
        //   this.titleHeight +
        //   this.subtitleHeight +
        //   this.headerHeightAndFirstLine + // + first line height
        //   this.headerHeight; // + header height 
        //   // this.pdfkitTableCache.safelyMarginBottomHeight; // + safe margin

        // // // console.log('headerHeightAndFirstLine', this.headerHeightAndFirstLine, this.headerHeightAndFirstLineAndTitleCalc)
        // // --------------------------------------------------------------------------------
        // // --------------------------------------------------------------------------------
        // // --------------------------------------------------------------------------------

        this.headerHeightAndFirstLineAndTitleCalc = await this.calcTitleSubtitleHeaderAndFirstLine();

        // content is big text (crazy!)
        if(this.headerHeightAndFirstLine > this.pdfkitTableCache.safelyPageY) 
        {
          const err = 'CRAZY! This a big text on cell';
          // console.log(err);
          this.logg(err);
        } 
        else if(this.headerHeightAndFirstLineAndTitleCalc > this.pdfkitTableCache.safelyPageY) 
        {
          this.logg('addPage');
          // // console.log('addPage');
          await this.addPageAsync();
          resolve();
          return;
        }

        // fill header
        const rectRow: Rect = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.headerHeight };
        this.createFill(rectRow);

        // simple header
        if(this.isHeaderString)
        {
          // columns
          for(colIndex = 0; colIndex < colLen; colIndex++) 
          {    
            // validade
            text = this.pdfkitTableCache.headers[colIndex];
            this.logg(text, colIndex);
            this.text(text, this.columnPositions[colIndex] + left, this.positionY + top, 
            {
              width: this.columnSizes[colIndex] - (left + right),
              align: 'left',
            });
          }
        }
        else
        {
          // columns
          for(colIndex = 0; colIndex < colLen; colIndex++) 
          {
            const rectCell = { ...rectRow, x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] };
            let fill: IFillAndOpacity = Object(this.prepareRowFillOptionsHeader(this.pdfkitTableCache.headers[colIndex]));
            fill.fill && this.createFill(rectCell, fill.fill, fill.opacity);

            // # TODO:
            // fontSize: 30, color: 'blue', fontFamily: localType

            // header padding
            padding = Object(this.headerPadding[colIndex]);

            // validade
            text = Object(this.pdfkitTableCache.headers[colIndex]).label;
            this.logg(text, colIndex);
            this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top, 
            {
              width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
              align: 'left',
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
        await this.pdfkitTableCache.options?.prepareRow?.(null);

        // to global
        // this.pdfkitTableCache.table.columns = colLen;

        // console.log('Start Header');

        // done
        resolve();        
      } 
      catch (error)
      {
        // error
        reject(error);
      }
    });
  }

  // Rows - tables.rows key:@rows
  // ------------------------------------------------------------------

  createRowString(data: any): Promise<void>
  {
    this.logg('createRowString');
    return new Promise( async (resolve, reject) => 
    {
      // local
      const { rows } = data;

      // has content
      if(!rows || !rows.length)
      {
        resolve();
        return;
      }

      // is array whith object
      if(!Array.isArray(rows[0]) || typeof rows[0][0] !== 'string')
      {
        reject();
        throw new Error('ROWS need be a Array[] with String"". See documentation.');
      }

      // variables
      const { top, right, left } = Object(this.pdfkitTableCache.options.padding);
      const distance = this.pdfkitTableCache.distanceCorrection / 2;
      let rowIndex: number = 0; 
      let colIndex: number = 0; // index
      let rowLen: number = rows.length || 0; // array lines
      let colLen: number = this.pdfkitTableCache.table.columns || 0; // array columns
      let elm; // element line
      let text;
      let padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 }; // header padding
      let fill: IFillAndOpacity = { opacity: undefined, fill: undefined };

      // style
      await this.pdfkitTableCache.options?.prepareRow?.(null);

      // loop lines
      for(rowIndex = 0; rowIndex < rowLen; rowIndex++) 
      {
        // // style
        // await this.pdfkitTableCache.options?.prepareRow?.(null);

        // row calc
        const { height, veryLongText, haveLongText } = Object(await this.calcRowHeightString(rows[rowIndex], { isHeader: false, preventLongText: true }));
        this.rowHeight = Number(height);

        // // console.log('RowString', height, veryLongText, haveLongText);

        if(haveLongText) this.logg(`CRAZY! This a big text on cell`);

        // Switch to next page if we cannot go any further because the space is over.
        // For safety, consider 1 rows margin instead of just one
        if(haveLongText || this.calcLimitCellOnPage(this.positionY, this.rowHeight))
        {
          // console.log('AddPage calc', rowIndex);
          await this.addPageAsync();
          await this.createHeader();
        }

        // // console.log(this.y, 0, this.pdfkitTableCache.safelyPageHeight, this.page.height);
        // // console.log(rowIndex, 'Y position to writer ', this.positionY + this.rowHeight + 0, 
        // this.y + this.rowHeight + 0);

        // element
        elm = rows[rowIndex];

        // loop columns
        for(colIndex = 0; colIndex < colLen; colIndex++) 
        {
          // validade
          text = elm[colIndex];

          this.positionY || (this.positionY = this.y);
          
          // Prevent break page with long text
          // ----------------------------------------------------
          // big text
          if(haveLongText)
          {
            let lt: any = veryLongText[colIndex];
            // if have value to work
            if(lt)
            {
              const { fitValue, fitHeight } = Object(lt);
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
          // this.isHeaderString || (padding = this.pdfkitTableCache.headers[colIndex].padding);

          // rect
          const rectRow  = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.rowHeight };
          const rectCell = { ...rectRow, x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] };

          // // console.log(rectRow, rectCell, this.positionX, this.x, this.positionY, this.y);
          
          // Block - fill
          // ----------------------------------------------------
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          if(this.isHeaderString === false)
          {  
            // style column by header
            fill = this.prepareRowFillOptionsData(this.pdfkitTableCache.headers[colIndex]);
            fill.fill && await this.createFill(rectCell, fill.fill, fill.opacity);
          }
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // ----------------------------------------------------

          // style
          this.pdfkitTableCache.options?.prepareRow?.(elm, colIndex, rowIndex, rectRow, rectCell);
          // write
          // console.log('text', rowIndex, text);
          this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top - distance,
          {
            width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
            align: 'left',
          });
        }

        // /!\ dont changer order
        // y add
        this.positionY += this.rowHeight;
        // divider
        // this.createDivider('horizontal', this.initialPositionX, this.positionY);
        this.createDivider('horizontal', this.columnPositions[0], this.positionY);
        
        if(haveLongText)
        {
          // await this.addPageAsync();
        }
      }

      // x reset
      // this.positionX = this.initialPositionX;
      // to global
      this.pdfkitTableCache.table.lines += rowLen;

      resolve();
    });
  }

  // Data - tables.datas key:@datas
  // ------------------------------------------------------------------

  createRowObject(data: any) : Promise<void>
  {
    this.logg('createRowObject');
    return new Promise( async (resolve, reject) => 
    {
      // variables
      const { datas } = data;

      // has content
      if(!datas || !datas.length)
      {
        resolve();
        return;
      }

      // is array whith object
      if(Array.isArray(datas[0]) || typeof datas[0] !== 'object')
      {
        reject();
        throw new Error('Datas need be a Array[] with Objects{}. See documentation.');
        return;
      }

      // variables
      const { top, right, bottom, left } = Object(this.pdfkitTableCache.options.padding);
      const distance = this.pdfkitTableCache.distanceCorrection/2;
      let rowIndex, colIndex; // index
      let rowLen = datas.length || 0; // array lines
      let colLen = this.pdfkitTableCache.table.columns || 0; // array columns
      let elm; // element line
      let text;
      let fill: IFillAndOpacity = { opacity: undefined, fill: undefined };

      // loop lines
      for(rowIndex = 0; rowIndex < rowLen; rowIndex++) 
      {
        // // style
        // this.pdfkitTableCache.options?.prepareRow?.(datas[rowIndex]);

        // row calc
        const { height, veryLongText, haveLongText } = Object(await this.calcRowHeightObject(datas[rowIndex], { isHeader: false, preventLongText: true }));
        this.rowHeight = Number(height);

        if(haveLongText) this.logg(`CRAZY! This a big text on cell`);

        // Switch to next page if we cannot go any further because the space is over.
        // For safety, consider 1 rows margin instead of just one
        if(haveLongText || this.calcLimitCellOnPage(this.positionY, this.rowHeight))
        {
          await this.addPageAsync();
        }

        // element
        elm = datas[rowIndex];

        // style row
        // style
        this.pdfkitTableCache.options?.prepareRow?.(elm);
        // row options
        // allow the user to override style for rows
        this.prepareRowOptions(elm);

        // loop columns
        for(colIndex = 0; colIndex < colLen; colIndex++) 
        {
          // variables
          let {property, width, align, valign, padding, renderer} = Object(this.pdfkitTableCache.headers[colIndex]);

          // validade
          text = elm[property];
          typeof text === 'object' && (text = String(text.label).trim() || '');      

          // Apply cell style options 
          // ----------------------------------------------------

          // Prevent break page with long text
          // ----------------------------------------------------
          // big text
          if(haveLongText)
          {
            let lt: any = veryLongText[colIndex];
            // if have value to work
            if(lt)
            {
              const { fitValue, fitHeight } = Object(lt);
              // fit text
              text = fitValue;
              // row calc
              this.rowHeight = fitHeight; // this.rowHeight / percent;
              // restValue
              // // console.log(veryLongText[colIndex]);              
            }            
          }
          // ----------------------------------------------------

          // rect row
          const rectRow = { x: this.columnPositions[0], y: this.positionY, width: this.pdfkitTableCache.table.width, height: this.rowHeight };
          // rect cell
          const rectCell = { ...rectRow, x: this.columnPositions[colIndex], width: this.columnSizes[colIndex] };

          // Block - fill
          // ----------------------------------------------------
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // creeat fill row
          if(colIndex === 0) 
          {
            fill = Object(this.prepareRowFillOptionsData(elm));
            fill.fill && await this.createFill(rectCell, fill.fill, fill.opacity);
          }
          // style fill cell
          if(typeof elm[property] === 'object') // TODO: remove
          {
            // options if text cell is object
            if(elm[property].hasOwnProperty('options'))
            {  
              // set font style
              this.prepareRowOptions(elm[property]);
              fill = this.prepareRowFillOptionsData(elm[property]);
              fill.fill && await this.createFill(rectCell, fill.fill, fill.opacity);
            }
          } 
          else 
          {  
            // style column by header
            fill = this.prepareRowFillOptionsData(this.pdfkitTableCache.headers[colIndex]);
            fill.fill && await this.createFill(rectCell, fill.fill, fill.opacity);
          }
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // ############################## BACKGROUND
          // ----------------------------------------------------

          // TODO: REMOVER 
          // Apply string style
          // ----------------------------------------------------

          // bold
          if(String(text).substring(0, 5) === 'bold:')
          {
            this.font('Helvetica-Bold');
            text = text.replace('bold:', '');
          }
  
          // size
          if(String(text).substring(0, 4) === 'size')
          {
            let size: number = Number(String(text).substring(4,4).replace(/\D+/g, ''));
            this.fontSize(size < 7 ? 7 : size);
            text = text.replace(`size${size}:`, '');
          }

          // 
          width = width || this.columnSizes[colIndex];
          align = align || 'left';
          
          // renderer
          if(typeof renderer === 'function')
          {
            text = renderer(text, colIndex, rowIndex, elm, rectRow, rectCell); // value, index-column, index-row, row, doc[this]
          }
          // style
          this.pdfkitTableCache.options?.prepareRow?.(elm, colIndex, rowIndex, rectRow, rectCell);
          // write
          this.text(text, this.columnPositions[colIndex] + left + padding.left, this.positionY + top + padding.top- distance,
          {
            width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
            align: 'left',
          });
        }

        // /!\ dont changer order
        // y add
        this.positionY += this.rowHeight;
        // divider
        // this.createDivider('horizontal', this.initialPositionX, this.positionY);
        this.createDivider('horizontal', this.columnPositions[0], this.positionY);
        
        // if(haveLongText)
        // {
        //   // await this.addPageAsync();
        // }
      }

      // this.positionY += this.y;
      // x reset
      // this.positionX = this.initialPositionX;
      // to global
      this.pdfkitTableCache.table.lines += rowLen;

      resolve();
    });
  }



  // Calc row height (from array)
  // ------------------------------------------------------------------

  calcRowHeightString(row: any, opt: ICalcRowHeightOptions): Promise<number | any>
  {
    return new Promise( async (resolve) => 
    {
      // extract
      let { align, isHeader, preventLongText }: ICalcRowHeightOptions = opt;
      const { left, top, right, bottom }: Padding = Object(this.pdfkitTableCache.options.padding);

      // validate
      isHeader === undefined && (isHeader = false);
      align || (align = 'left');

      // variables
      let text: string | ObjectData = '';
      let height = isHeader ? 0 : (this.minRowHeight || 0);
      let heightCompute = 0;
      let len = row.length || 0;
      let haveLongText = false;
      let veryLongText = [];
      let padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 }; // header padding

      // loop var
      let colIndex = 0;

      // style
      if(isHeader)
      {
        await this.pdfkitTableCache.options?.prepareHeader?.();
      }
      else
      {
        await this.pdfkitTableCache.options?.prepareRow?.(null);
      }

      // loop
      for(colIndex = 0; colIndex < len; colIndex++) 
      {
        // value
        text = row[colIndex];
        text = String(text).replace('bold:','').replace('size',''); // .replace(/^:/g,'');

        // header padding
        padding = Object(this.headerPadding[colIndex]);
        // this.isHeaderString || (padding = this.pdfkitTableCache.headers[i].padding);

        // calc height size of string
        heightCompute = this.heightOfString(text, 
        {
          lineGap: 0,
          width: this.columnSizes[colIndex] - (left + right) - (padding.left + padding.right),
          align,
        });
        
        // stay max height
        height = Math.max(height, heightCompute + (padding.top + padding.bottom));

        // register long text
        if(preventLongText)
        {
          // // console.log('preventLongText', heightCompute, this.pdfkitTableCache.safelyPageHeight);
          // console.log('AAAA', heightCompute, height);

          // if row height is bigger 
          if(heightCompute > this.pdfkitTableCache.safelyPageHeight) 
          {

            haveLongText = true;

            // // console.log('Sooo big', heightCompute, this.pdfkitTableCache.safelyPageHeight);

            // variables
            let safeHeight  = this.pdfkitTableCache.safelyPageHeight - this.headerHeight - (this.pdfkitTableCache.distanceCorrection * 4);
            let percent     = heightCompute / (safeHeight) + 0.01; // 0.3 safe
            let fitHeight   = safeHeight; // - this.page.margins.top; //heightCompute / percent;
            let lenTextTest = text.length / percent - 70; // 50
            let fitValue    = '';

            // console.log('BBBB', fitHeight, safeHeight, percent);

            // // console.log('fitHeight', fitHeight, percent)

            // pt-br: veja bem, dependendo do tamanho da font esse recurso ajuda o 
            // text a não pular de página ou evitar o text ficar muito encolhido em relação 
            // a página quando a fonte for muito pequena
            // 
            // fontSize(17)   fontSize(7)    fontSize(x)
            // very long      very short     perfect correction
            // ___________    ___________    ___________
            // | -- | -- |    | -- | -- |    | -- | -- |
            // | -- |    |    | -- |    |    | -- |    |
            // | -- |    |    |    |    |    | -- |    |
            // | -- |    |    |    |    |    | -- |    |
            // | -- |    |    |    |    |    |    |    |
            //   -- 
            // correction/recalc text to new row height
            let maxLoop = 14;
            for(let ilen = 0; ilen < maxLoop; ilen++) {

              lenTextTest = lenTextTest + (10 * ilen);
              lenTextTest = (lenTextTest > text.length ? text.length: lenTextTest) -7;
              const fitValueTest = String(text).substring(0, lenTextTest);
              let heightComputeFit = this.heightOfString(fitValueTest, 
              {
                lineGap: 0,
                width: this.columnSizes[ilen] - (left + right) - (padding.left + padding.right),
                align,
              });

              // add header padding
              heightComputeFit += (padding.top + padding.bottom); 
              // console.log('>>', heightComputeFit, fitHeight, safeHeight);

              if(heightComputeFit < fitHeight) {
                // console.log('no break', fitValueTest);
                fitValue = fitValueTest;
                fitHeight = heightComputeFit;
              } else {
                // console.log('break');
                ilen = maxLoop;
              }
            }
      
            // // console.log(heightComputeFit, fitHeight, safeHeight, this.page.height, heightCompute, percent);

            const fitValueLength: number = fitValue.length;

            // push prevent
            veryLongText.push({
              index: colIndex,
              key: null,
              value: text,
              fitValue: `${fitValue} +${text.length - fitValueLength - 7}...`,
              restValue: String(text).substring(text.length - fitValueLength - 7),
              fitHeight, // or height (try more columns)
            });      
          }
          // null if normal row size
          else
          {
            veryLongText.push(null);
          }
        }
      }
      
      // minimum row height 
      // height = Math.max(height, this.pdfkitTableCache.minRowHeight || 0);
      height = height + this.pdfkitTableCache.distanceCorrection + top + bottom;
      
      // return array
      if(preventLongText) 
      {
        resolve({
          height,
          veryLongText,
          haveLongText
        });  
      } 
      else 
      {
        resolve(height);
      }
      
    });
  };

  // Calc row height (from object)
  // ------------------------------------------------------------------

  calcRowHeightObject(row: any, opt: ICalcRowHeightOptions): Promise<number | any[]>
  {
    return new Promise( async (resolve) => 
    {
      // extract
      let { align, isHeader, preventLongText }: ICalcRowHeightOptions = opt;
      const { left, top, right, bottom }: Padding = Object(this.pdfkitTableCache.options.padding);

      // validate
      isHeader === undefined && (isHeader = false);
      align || (align = 'left');
      
      // variables
      let text: string | ObjectData = '';
      let height = isHeader ? 0 : (this.minRowHeight || 0);
      let heightCompute = 0;
      let len = this.pdfkitTableCache.table.columns || 0;
      let haveLongText = false;
      let veryLongText = [];
      let padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 }; // header padding

      // loop var
      let i = 0;

      // style
      if(isHeader)
      {
        await this.pdfkitTableCache.options?.prepareHeader?.();
      }
      else
      {
        await this.pdfkitTableCache.options?.prepareRow?.(null);
      }

      // loop
      for(i = 0; i < len; i++) 
      {
        // variables
        const { property } = Object(this.pdfkitTableCache.headers[i]);
        padding = Object(this.headerPadding[i]);

        // // console.log('A', i, padding, left, top, right, bottom);

        // value
        text = row[property];
        typeof text === 'object' && (text = text.label || '');
        text = String(text).replace('bold:','').replace('size',''); // .replace(/^:/g,'');

        // calc height size of string
        heightCompute = this.heightOfString(text, 
        {
          lineGap: 0,
          width: this.columnSizes[i] - (left + right) - (padding.left + padding.right),
          align,
        });
        
        // stay max height
        height = Math.max(height, heightCompute + (padding.top + padding.bottom));

        // // console.log('B', heightCompute, this.columnSizes[i], height);

        // register long text
        if(preventLongText)
        {
          // console.log('preventLongText');
          // // console.log('preventLongText', heightCompute, this.pdfkitTableCache.safelyPageHeight);

          // if row height is bigger 
          if(heightCompute > this.pdfkitTableCache.safelyPageHeight) 
          {
            haveLongText = true;
            // console.log('haveLongText');

            // // console.log('Sooo big', heightCompute, this.pdfkitTableCache.safelyPageHeight);

            // variables
            let safeHeight  = this.pdfkitTableCache.safelyPageHeight - this.headerHeight - (this.pdfkitTableCache.distanceCorrection * 4);
            let percent     = heightCompute / (safeHeight) + 0.01; // 0.3 safe
            let fitHeight   = safeHeight; // - this.page.margins.top; //heightCompute / percent;
            let lenTextTest = text.length / percent - 70; // 50
            let fitValue    = '';

            // // console.log('fitHeight', fitHeight, percent)

            // pt-br: veja bem, dependendo do tamanho da font esse recurso ajuda o 
            // text a não pular de página ou evitar o text ficar muito encolhido em relação 
            // a página quando a fonte for muito pequena
            // 
            // fontSize(17)   fontSize(7)    fontSize(x)
            // very long      very short     perfect correction
            // ___________    ___________    ___________
            // | -- | -- |    | -- | -- |    | -- | -- |
            // | -- |    |    | -- |    |    | -- |    |
            // | -- |    |    |    |    |    | -- |    |
            // | -- |    |    |    |    |    | -- |    |
            // | -- |    |    |    |    |    |    |    |
            //   -- 
            // correction/recalc text to new row height
            let maxLoop = 14;
            for(let ilen = 0; ilen < maxLoop; ilen++) {

              lenTextTest = lenTextTest + (10 * ilen);
              lenTextTest = (lenTextTest > text.length ? text.length: lenTextTest) -7;
              const fitValueTest = String(text).substring(0, lenTextTest);
              let heightComputeFit = this.heightOfString(fitValueTest, 
              {
                lineGap: 0,
                width: this.columnSizes[i] - (left + right) - (padding.left + padding.right),
                align,
              });

              // // console.log('C', heightComputeFit);

              // add header padding
              heightComputeFit += (padding.top + padding.bottom); 

              // // console.log('D', heightComputeFit);

              if(heightComputeFit < fitHeight) 
              {
                fitValue = fitValueTest;
                // console.log('E', fitValue);
              } 
              else 
              {
                ilen = maxLoop;
              }
            }
      
            // // console.log(heightComputeFit, fitHeight, safeHeight, this.page.height, heightCompute, percent);

            const fitValueLength: number = fitValue.length;

            // // console.log('E', fitValue);

            // push prevent
            veryLongText.push({
              index: i,
              key: null,
              value: text,
              fitValue: `${fitValue} +${text.length - fitValueLength - 7}...`,
              restValue: String(text).substring(text.length - fitValueLength - 7),
              fitHeight, // or height (try more columns)
            });      
          }
          // null if normal row size
          else
          {
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
      if(preventLongText) 
      {
        resolve([
          height,
          veryLongText,
          haveLongText
        ]);
      } 
      else 
      {
        resolve(height);
      }
      return;
      
    });
  }

  async calcTitleSubtitleHeaderAndFirstLine(): Promise<number>
  {
    return new Promise( async (resolve, reject) => 
    {
      try 
      {
        const { headers, datas, rows } = this.pdfkitTableCache;

        if(this.headerHeight === 0)
        {
          if(this.isHeaderString === false)
          {
            this.headerHeight = Number(await this.calcRowHeightObject(headers, { isHeader: true }));
          }
          else
          {
            this.headerHeight = Number(await this.calcRowHeightString(headers, { isHeader: true }));
          }
        }
    
        // calc first table line when init table
        if(this.headerHeightAndFirstLine === 0)
        {
          if(datas.length > 0)
          {
            this.headerHeightAndFirstLine = Number(await this.calcRowHeightObject(datas[0], { isHeader: true }));
            this.logg(this.headerHeightAndFirstLine, 'datas');
          }
          else if(rows.length > 0)
          {
            this.headerHeightAndFirstLine = Number(await this.calcRowHeightString(rows[0], { isHeader: true }));
            this.logg(this.headerHeightAndFirstLine, 'rows');
          }
        }
    
        // calc if header + first line fit on last space page
        this.headerHeightAndFirstLineAndTitleCalc =
          this.titleHeight +
          this.subtitleHeight +
          this.headerHeightAndFirstLine + // + first line height
          this.headerHeight + // + header height 
          (this.pdfkitTableCache.distanceCorrection * 2); // space between titles and lines
    
        resolve(this.headerHeightAndFirstLineAndTitleCalc);
        return;
      }
      catch(err)
      {
        reject(0);
        return;
      }
    });
  }

  // Calc last position y + new row height
  // ------------------------------------------------------------------
  calcLimitCellOnPage(y: number, height: number) 
  {
    if(y === 0)
    {
      y = Math.max(this.y, this.positionY);
    }
    // this.y
    return (y + height >= this.pdfkitTableCache.safelyPageY);
  }

  // Init loop key:@data
  // ------------------------------------------------------------------

  async createTable(data: any): Promise<void>
  {
    this.logg('createTable');
    return new Promise(async (resolve) => 
    {
      // variables
      const { table } = data;
      const { datas, rows } = table;

      // lopps
      await this.createRowObject({ datas });
      await this.createRowString({ rows });

      resolve();
    });
  }


  // Resume
  // ------------------------------------------------------------------

  tableResume() {
    return {
      ...this.pdfkitTableCache.table,
      y: this.positionY,
      x: this.positionX,  
    }
  }

  // Table - THE MAGIC key:@table
  // ------------------------------------------------------------------

  async table(table: Table, options: Options, callback?: Function) 
  {
    // prepare
    table   = this.prepareTable(table);
    options = { ...options, ...table.options }; // merge options
    options = this.prepareOptions(options);

    this.initCalcs();
    this.initValidates();

    // on fire
    this.on('pageAdded', this.pageAddedFire);

    // init
    this.logg('table');
    try 
    {
      // the big magic
      await this.createTitles();
      await this.createHeader();
      await this.createTable({ table });
      // update position
      this.y = this.positionY;
      // break
      this.moveDown();
    } 
    catch (error: unknown) 
    {
      this.logg(error);
      throw new Error(String(error));
    }

    // off fire
    this.off('pageAdded', this.pageAddedFire);

    // this.logg(resolve);
    typeof callback === 'function' && callback(this.tableResume()); // TODO: remove
    return Promise.resolve(this.tableResume());
  }

  // Join tables key:@tables
  // ------------------------------------------------------------------

  async tables(tables: Table[], callback?: Function) {
    return new Promise( async (resolve, reject) => 
    {
      try 
      {
        if(Array.isArray(tables)) 
        {
          // many tables
          for(let i = 0; i < tables.length; i++) 
          {
            await this.table(tables[i], tables[i].options || {});
          }
        }
        else if(typeof tables === 'object') 
        {
          // else is tables is a unique table object
          await this.table(tables, {});
        }
      
        // callback
        typeof callback === 'function' && callback(this.tableResume()); // TODO: remove
        // done!
        resolve(this.tableResume());
      } 
      catch (error: any) 
      {
        // ops!
        reject(error);
      }
    });
  }

  logg(...args: any[]) 
  {
    // // console.log(args);
  }

}

export default PDFDocument;
export { PDFDocument };