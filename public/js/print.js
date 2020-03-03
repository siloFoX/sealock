var URL = "http://223.194.70.112:3000"

var // DOM controller get by ID
    $$ = function(id) {
        return document.getElementById(id);
    },

    researcher = $$("researcher"),
    memo_controller = $$("memo-controller"),
    print_info_path = "./json/print.json",
    record_picture_path = {},
    record_each_memos = {}

$.getJSON(print_info_path, (info) => {
    
    researcher.innerHTML = info[0]["실험자명"] + `<small class="text-muted" style = "margin-left : 5px;">연구원</small>`
    
    let table_data = []
    let table_num = 0
    let previous_process = ""
    let count_num_one_process = 0
    let idx = 0

    do {

        let each_data = info[idx]

        if(each_data["사진"]) {
            record_picture_path[each_data["공정"] + "_#" + String(count_num_one_process)] = each_data["사진"]
        }
        
        if(each_data["비고"]){
            record_each_memos[each_data["공정"] + "_#" + String(count_num_one_process)] = each_data["비고"]
        }

        delete each_data["사진"]
        delete each_data["비고"]
        
        if((!(info.length - 1) || previous_process) && (each_data["공정"] != previous_process || idx == info.length - 1)) {

            if(idx == info.length - 1) {

                table_data.push(each_data)
                count_num_one_process++
            }
            
            if(!(info.length - 1))
                previous_process = each_data["공정"]

            let header = processess[reallocater[previous_process]].slice(0, -2)
            let table_tag = `<div class = "spreadsheet"><div id = "table` + String(table_num) +`" class = "hot"></div></div>`

            header.unshift("공정")

            $("#sheet-controller").append(table_tag)

            let table_location = $$("table" + String(table_num++))
            
            new Handsontable(table_location, {
                data: table_data,
                colHeaders: header,
                rowHeaders: true,
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

            table_data = []
            count_num_one_process = 0
        }

        table_data.push(each_data)
        previous_process = each_data["공정"]
        count_num_one_process++

    } while(idx++ < info.length - 1)

    renderMemos(record_each_memos)
})

function renderMemos(memos) {

    let all_comment = ""
    for (let key in memos) {
        
        let comment = "<li>" + key + " : " + memos[key] + "</li>"
        all_comment += comment 
    }
    
    memo_controller.innerHTML = all_comment
}

function getPicture (paths) {

}