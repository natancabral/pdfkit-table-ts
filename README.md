# pdfkit-table-ts
TypeScript - Helps to draw informations in simple tables using pdfkit. #server-side. Generate pdf tables with javascript (PDFKIT plugin) 

```js
const fs = require("fs");
const { PDFDocument } = require("./../lib/index");

const doc = new PDFDocument({
  margin: 30, 
});

;(async function(){
 
  // to save on server
  doc.pipe(fs.createWriteStream("./example-1.pdf"));

  // -----------------------------------------------------------------------------------------------------
  // Simple Table with Array
  // -----------------------------------------------------------------------------------------------------
  const table = {
    headers: ["Country Country Country", "Conversion rate", "Trend"],
    rows: [
      ["Switzerland", "12%", "+1.12%"],
      ["France", "67%", "-0.98%"],
      ["England", "33%", "+4.44%"],
      ["England of England of England", "33%", "+4.44%"],
      ["Switzerland", "12%", "+1.12%"],
      ["France", "67%", "-0.98%"],
      ["England", "33%", "+4.44%"],
      ["England of England of England", "33%", "+4.44%"],
      ["Switzerland", "12%", "+1.12%"],
      ["France", "67%", "-0.98%"],
      ["England", "33%", "+4.44%"],
      ["England of England of England", "33%", "+4.44%"],
      ["Switzerland", "12%", "+1.12%"],
      ["France", "67%", "-0.98%"],
      ["England", "33%", "+4.44%"],
      ["England of England of England", "33%", "+4.44%"],
      ["Switzerland", "12%", "+1.12%"],
      ["France", "67%", "-0.98%"],
    ],
  };

  const options = {
    width: 300,
    x: 150,
    y: 100,
    padding: {
      top: 1, bottom: 1, left: 5, right: 5, 
    },
  };
  
  await doc.table(table, options);
  doc.end();
 
})();

```