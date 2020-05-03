var url = "http://localhost:3000"

var // DOM controller get by ID
    $$ = function(id) {
        return document.getElementById(id);
    },

    researcher = $$("researcher"),
    memo_controller = $$("memo-controller"),
    body = $$("body"),
    image_form = $$("image-form"),
    memo_form = $$("memo-form"),
    print_info_path = "./json/print.json",
    record_picture_name = {},
    record_each_memos = {},
    global_info,
    count_memo = 0

$.getJSON(print_info_path, (info) => {

    researcher.innerHTML = info[0]["실험자명"] + `<small class="text-muted" style = "margin-left : 5px;">연구원</small>`

    global_info = info
    
    let table_data = []
    let table_num = 0
    let previous_process = ""
    let count_num_one_process = 0
    let idx = 0

    do {

        let each_data = info[idx]
        
        if(each_data["사진"]) {
            record_picture_name[each_data["공정"] + "_#" + String(count_num_one_process)] = each_data["사진"] + "_" + each_data["_id"]
        }
        
        if(each_data["비고"]){
            record_each_memos[each_data["공정"] + "_#" + String(count_num_one_process)] = each_data["비고"]
            count_memo++
        }

        delete each_data["사진"]
        delete each_data["_id"]
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
    renderPictures(record_picture_name)
    // getPicture()
})

function renderMemos(memos) {

    if(count_memo) 
        memo_form.className = "memo-form"

    let all_comment = ""
    for (let key in memos) {
        
        let comment = "<li>" + key + " : " + memos[key] + "</li>"
        all_comment += comment 
    }
    
    memo_controller.innerHTML = all_comment
}

function renderPictures(picture_names) {

    let count = 0

    for (let key in picture_names) {
        
        let form_adder = document.createElement("div")
        
        // ObjectId 로 사진 검색
        let objectid = picture_names[key].split('_')[1]
        let url_tmp = url + "/img?name=" + objectid
        let img = document.createElement("img")
        
        let img_name = document.createElement("p")
        img_name.innerHTML = key
        img_name.className = "img-name"

        // 이미지 기본 css
        img.className = "img"

        // 링크로 처리
        img.src = url_tmp

        if(count++ % 2 === 0) 
            form_adder.className = "even-picture"
        else 
            form_adder.className = "odd-picture"
        
        image_form.appendChild(form_adder)
        form_adder.appendChild(img)
        form_adder.appendChild(img_name)
    }
}

function getPicture () {

    html2canvas(document.body).then(function(canvas) {

        let imgData = canvas.toDataURL("image/png");

        let file_name = global_info[0]["실험자명"] +  " 연구원 연구노트 (" + global_info[0]["실험날짜"] + "-" + global_info[global_info.length - 1]["실험날짜"] + ").pdf"
        let doc = new jsPDF({orientation : 'landscape'})

        let imgProps = doc.getImageProperties(imgData)

        var width = doc.internal.pageSize.getWidth();
        var height = (imgProps.height * width) / imgProps.width;
        doc.addImage(imgData, 'PNG', 0, 0, width, height);

        doc.save(file_name)
    })
}
