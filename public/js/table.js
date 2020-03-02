// URL for client localhost
var URL = "http://localhost:3000"

var // DOM controller get by ID
    $$ = function(id) {
        return document.getElementById(id);
    },

    container = $$('table'), // table container
    adviceConsole = $$('tableconsole'),
    dropdown = $$('dropdown'), // process dropdown
    parentDropdown = $$('parent-dropdown'), // SmartProcess dropdown
    save = $$('save'), // upload and update button
    dummy_btn = $$('default'), // dummy
    mode = $$('mode-select-dropdown'), // mode selector dropdown
    hot;

var update_container_changed = false
var upload_container_changed = false

// why it didn't work??

// function clone(obj) {
    
//     if(obj == null || typeof(obj !== 'object'))
//         return obj;

//     // var copy = obj.constructor()
//     var copy = {}

//     for(var attr in obj) {

//         if(obj.hasOwnProperty(attr)) {

//             copy[attr] = clone(obj[attr])
//         }
//     }

//     return copy
// }

function clone(obj) {

    // todo : if obj is undefined or null

    return JSON.parse(JSON.stringify(obj))
}

function render_table(Data = null) {
    var process = dropdown.options[dropdown.selectedIndex].value
    var headers = processess[process]
    var column_size = 10

    if(!Data || Data.hasOwnProperty("result")) {

        if(mode.value == "Update-mode")
            column_size = 1

        hot = new Handsontable(container, {
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
        return;
    }

    var headers_except_id = Object.keys(Data[0]).slice(1)
    var table_data = Data

    var columns = []
    if(mode.value == "Update-mode") {    

        headers = Object.keys(Data[0])
        columns.push({ data : "_id", readOnly : true })
        update_container_changed = false
    }
    else {
        var row = {}
        var rows = []

        for (var idx = 0; idx < headers.length; idx++) {

            var header = headers[idx]

            if(header == "실험날짜" || header == "해당실험기판번호" || header == "실험자명" || header == "사진")
                row[header] = null
            else    
                row[header] = table_data[table_data.length - 1][header]
        }

        for (var idx = 0; idx < column_size; idx++) {
            
            rows.push(clone(row))
        }
            
        table_data = rows
        upload_container_changed = false
    }

    for (var colHeaderIdx in headers_except_id) 
        columns.push({ data : headers_except_id[colHeaderIdx] })

    hot = new Handsontable(container, {
        data: table_data,
        colHeaders: headers,
        columns: columns,
        rowHeaders: true,
        height: 520,
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
        afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
            if(mode.value === "Update-mode")
                select_picture(row, column, row2, column2, headers, hot)
        }
    });
}

Handsontable.dom.addEvent(save, 'click', function() {

    if (mode.value === "Upload-mode") {
        var process = dropdown.options[dropdown.selectedIndex].value
        var headers = processess[process] 
        var url_tmp = URL + "/table"

        var req = { 
                    "process" : process,
                    "headers" : JSON.stringify(headers),
                    "data" : JSON.stringify(hot.getData())
                    }

        adviceConsole.innerText = 'Loading ...';
        adviceConsole.style = ""
        
        var config = {
            crossOrigin : true,
            url : url_tmp,
            method : 'POST',
            dataType : 'json',
            data : req,
            responseType : 'json'
        }
        axios(config)
        .then(res => {
            var response = res["data"];

            if (response["result"] === 'ok') {
                adviceConsole.innerText = 'Data saved';
                adviceConsole.style = "color : red"
                // alert('Data saved')
            }
            else {
                adviceConsole.innerText = 'Save error';
                adviceConsole.style = "color : red"
                alert('Save error')
            }
        })

        // alert("Save query sended")
        hot.clear()
    }
    else if(mode.value === "Update-mode") {
        var process = dropdown.options[dropdown.selectedIndex].value
        var headers = hot.getColHeader()
        var url_tmp = URL + "/update"

        var req = { 
            "process" : process,
            "headers" : JSON.stringify(headers),
            "data" : JSON.stringify(hot.getData())
            }
        
            adviceConsole.innerText = 'Loading ...';
            adviceConsole.style = ""
        
        var config = {
            crossOrigin : true,
            url : url_tmp,
            method : 'POST',
            dataType : 'json',
            data : req,
            responseType : 'json'
        }
        axios(config)
        .then(res => {
            var response = res["data"];

            if (response["result"] === 'ok') {
                adviceConsole.innerText = 'Data saved';
                adviceConsole.style = "color : red"
                // alert('Data saved')
            }
            else {
                adviceConsole.innerText = 'Upload error';
                adviceConsole.style = "color : red"
                alert('Upload error')
            }
        })

        // alert("Upload query sended")
    }
});

container.onchange = function () {
    if (mode.value === "Upload-mode") {
        adviceConsole.innerText = 'Click " Upload " to save data to server';
        adviceConsole.style = "color : red;"
        upload_container_changed = true
    }
    else if (mode.value === "Update-mode") {
        adviceConsole.innerText = 'Click " Update " or Click below of " 사진 " cells';
        adviceConsole.style = "color : red;"
        update_container_changed = true
    }
}

function dropChange() {

    if(mode.value === "Upload-mode")
        render_memo()

    hot.destroy()
    renderDatafromDB()

    if (mode.value === "Upload-mode") {
        adviceConsole.innerText = 'Click " Upload " to save data to server';
        adviceConsole.style = ""
    }
    else if (mode.value === "Update-mode") {
        adviceConsole.innerText = 'Click " Update " or Click below of " 사진 " cells';
        adviceConsole.style = ""
    }
}