var URL = "http://localhost:3000"

var // DOM controller get by ID
    $$ = function(id) {
        return document.getElementById(id);
    },

    container = $$('table'), // table container
    headers = processess["샘플준비"],
    column_size = 10

var hot = new Handsontable(container, {
    data: Handsontable.helper.createSpreadsheetData(column_size, headers.length),
    colHeaders: headers,
    rowHeaders: true,
    height: 300,
    width: '100%',
    minSpareRows: 1,
    fixedRowsTop : true,
    manualColumnResize: true,
    manualRowResize: false,
    headerTooltips: {
        rows: false,
        columns: true,
        onlyTrimmed: true
    },
    licenseKey: "non-commercial-and-evaluation"
});

hot.clear()