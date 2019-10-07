// 반응형으로 + DB works

var
    $$ = function(id) {
    return document.getElementById(id);
    },

    container = $$('table'),
    exampleConsole = $$('tableconsole'),
    dropdown = $$('dropdown'),
    save = $$('save'),
    // spreadsheet = $$('spreadsheet'),
    hot;

var URL = "http://localhost:3000/ajax";
// var URL = "https://f28e2e69.ngrok.io/ajax";

var headers = processess["샘플준비"] 

hot = new Handsontable(container, {
    data: Handsontable.helper.createSpreadsheetData(10, headers.length),
    colHeaders: headers,
    rowHeaders: false,
    minSpareRows: 1,
    height: 300,
    width: '100%',
    manualColumnResize: true,
    manualRowResize: false,
    headerTooltips: {
        rows: false,
        columns: true,
        onlyTrimmed: true
    },
    licenseKey: "non-commercial-and-evaluation",
});

hot.clear()
// spreadsheet.className = 'spreadsheet'
// container.classList.add('spreadsheet')

  
Handsontable.dom.addEvent(save, 'click', function() {

    var process = dropdown.options[dropdown.selectedIndex].value
    var headers = processess[process] 

    var req = "[[\"" + process + "\"]," + JSON.stringify(headers) + "," + JSON.stringify(hot.getData()) + "]"

    // console.log(req)

    $.ajax({
        crossOrigin : true,
        url : URL,
        type : 'POST',
        dataType : 'text',
        data : req,
        contentType : 'application/json',
        success : function (res) {
            // console.log(JSON.parse(res));
            var response = JSON.parse(res);

            if (response["result"] === 'ok') {
                exampleConsole.innerText = 'Data saved';
                alert('Data saved')
            }
            else {
                exampleConsole.innerText = 'Save error';
                alert('Save error')
            }
        }
    })

    alert("Save query sended")
    hot.clear()
});

container.onchange = function () {
    exampleConsole.innerText = 'Click "Save" to save data to server';
}

function dropChange() {
    var process = dropdown.options[dropdown.selectedIndex].value 
    var headers = processess[process] 

    hot.destroy()

    hot = new Handsontable(container, {
        data: Handsontable.helper.createSpreadsheetData(10, headers.length),
        colHeaders: headers,
        rowHeaders: false,
        height: 300,
        width: '100%',
        minSpareRows: 1,
        manualColumnResize: true,
        manualRowResize: false,
        headerTooltips: {
            rows: false,
            columns: true,
            onlyTrimmed: true
        },
        licenseKey: "non-commercial-and-evaluation",
    });

    hot.clear()
    // spreadsheet.className = 'spreadsheet'
    // container.classList.add('spreadsheet')
}

