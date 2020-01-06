// URL for client
var URL = "http://localhost:3000"
// var URL = "http://localhost:3000"

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

function render_table(Data = null) {
    var process = dropdown.options[dropdown.selectedIndex].value
    var headers = processess[process]
    var inner_data = Data

    if(mode.value == "Update-mode") { // update mode setting

        if(!inner_data) {

            hot = new Handsontable(container, {
                data: Handsontable.helper.createSpreadsheetData(1, headers.length),
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

        headers = Object.keys(inner_data[0])
        var headers_except_id = headers.slice(1)

        var columns = []
        columns.push({ data : "_id", readOnly : true })

        for (var colHeaderIdx in headers_except_id) {
            columns.push({ data : headers_except_id[colHeaderIdx] })
        }

        update_container_changed = false

        hot = new Handsontable(container, {
            data: inner_data,
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
                    select_picture(row, column, row2, column2, headers, hot)
            }
        });
    }
    else if(inner_data) { // in upload mode 
        
        const column_size = 10
        var last_data = inner_data[inner_data.length - 1]

        var columns = []
        var row = []

        console.log(last_data)

        for (var i = 0; i < headers.length; i++) {
        
            var header = headers[i]

            if(header == "실험날짜" || header == "해당실험기판번호" || header == "실험자명" || header == "사진") 
                row.push("")
            else
                row.push(last_data[header])
        }

        for (var i = 0; i < column_size; i++) {
            columns.push(row)
        }

        hot = new Handsontable(container, {
            data: columns,
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
    }
    else { // upload mode that no data

        hot = new Handsontable(container, {
            data: Handsontable.helper.createSpreadsheetData(10, headers.length),
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
    }
}

Handsontable.dom.addEvent(save, 'click', function() {

    if(dropdown.options[dropdown.selectedIndex].value === "Add" || dropdown.options[dropdown.selectedIndex].value === "dummy"){
        alert("This mode is not supported in this version.")
        return;
    }

    if (mode.options[mode.selectedIndex].value === "Upload-mode") {
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
    else if(mode.options[mode.selectedIndex].value === "Update-mode") {
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
    if (mode.options[mode.selectedIndex].value === "Upload-mode") {
        adviceConsole.innerText = 'Click " Upload sheet to DB " to save data to server';
        adviceConsole.style = "color : red;"
    }
    else if (mode.options[mode.selectedIndex].value === "Update-mode") {
        adviceConsole.innerText = 'Click " Update " or Click below of " 사진 " cells';
        adviceConsole.style = "color : red;"
        update_container_changed = true
    }
}

function dropChange() {
    if(dropdown.options[dropdown.selectedIndex].value === "Add" || dropdown.options[dropdown.selectedIndex].value === "dummy"){
        alert("This mode is not supported in this version.")
        return;
    }

    if(mode.options[mode.selectedIndex].value === "Upload-mode")
        render_memo()

    hot.destroy()
    renderDatafromDB()

    if (mode.options[mode.selectedIndex].value === "Upload-mode") {
        adviceConsole.innerText = 'Click " Upload sheet to DB " to save data to server';
        adviceConsole.style = ""
    }
    else if (mode.options[mode.selectedIndex].value === "Update-mode") {
        adviceConsole.innerText = 'Click " Update " or Click below of " 사진 " cells';
        adviceConsole.style = ""
    }
}