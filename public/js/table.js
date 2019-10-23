// URL for client
var URL = "http://localhost:3000"
// var URL = "http://223.194.70.112:3000"

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

render_table()

function render_table(Data = null) {
    var process = dropdown.options[dropdown.selectedIndex].value 
    var headers = processess[process]
    var inner_data = Data

    if(inner_data) {
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
    else {
        hot = new Handsontable(container, {
            data: Handsontable.helper.createSpreadsheetData(10, headers.length),
            colHeaders: headers,
            rowHeaders: true,
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
                alert('Data saved')
            }
            else {
                adviceConsole.innerText = 'Save error';
                adviceConsole.style = "color : red"
                alert('Save error')
            }
        })

        alert("Save query sended")
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
                alert('Data saved')
            }
            else {
                adviceConsole.innerText = 'Upload error';
                adviceConsole.style = "color : red"
                alert('Upload error')
            }
        })

        alert("Upload query sended")
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

    if(mode.options[mode.selectedIndex].value === "Upload-mode"){
        render_memo()

        hot.destroy()
        render_table()
    }
    else{
        hot.destroy()
        renderDatafromDB()
    }

    if (mode.options[mode.selectedIndex].value === "Upload-mode") {
        adviceConsole.innerText = 'Click " Upload sheet to DB " to save data to server';
        adviceConsole.style = ""
    }
    else if (mode.options[mode.selectedIndex].value === "Update-mode") {
        adviceConsole.innerText = 'Click " Update " or Click below of " 사진 " cells';
        adviceConsole.style = ""
    }
}

// function parentDropChange() {
//     if(parentDropdown.options[parentDropdown.selectedIndex].value == "SmartProcess"){
        
//     alert(parentDropdown.options[parentDropdown.selectedIndex].value)

//         dropdown.innerHTML = `
//             <option value = '샘플준비'>샘플준비</option>
//             <option value = '세정1'>세정1</option>
//             <option value = '세정2'>세정2</option>
//             <option value = '세정3'>세정3</option>
//             <option value = '세정블로윙'>세정블로윙</option>
//             <option value = '프리스퍼터링'>프리스퍼터링</option>
//             <option value = '스퍼터링'>스퍼터링</option>
//             <option value = '열처리'>열처리</option>
//             <option value = 'PR핸드블로윙'>PR핸드블로윙</option>
//             <option value = 'HDMS코팅'>HDMS코팅</option>
//             <option value = 'PR코팅'>PR코팅</option>
//             <option value = 'PR베이킹'>PR베이킹</option>
//             <option value = '클로로벤젠처리'>클로로벤젠처리</option>
//             <option value = '클로로벤젠세정후블로윙'>클로로벤젠세정후블로윙</option>
//             <option value = '노광'>노광</option>
//             <option value = '현상'>현상</option>
//             <option value = '현상액세정후블로윙'>현상액세정후블로윙</option>
//             <option value = '이베포레이션샘플거치'>이베포레이션샘플거치</option>
//             <option value = '스트립-담그기'>스트립-담그기</option>
//             <option value = '스트립-뿌리기'>스트립-뿌리기</option>
//             <option value = '산화막제거'>산화막제거</option>
//             <option value = '실버페이스트도포'>실버페이스트도포</option>
//             <option value = '실버페이스트건조'>실버페이스트건조</option>
//             <option value = '측정'>측정</option>
//             <optgroup label = '=========================='></optgroup>
//             <option value = 'Add'>Add</option>`
//     }
//     else{
//         alert("Add mode is not supported in this version.")
//         dropdown.innerHTML = `
//             <option value = 'dummy'>dummy</option>
//             <optgroup label = '=========================='></optgroup>
//             <option value = 'Add'>Add</option>`
//     }
// }

// dummy_btn.addEventListener('click', function () {
//     alert("There is no PRO version now.")
// });
