var url = "http://223.194.70.112:3000"

var // DOM controller get by ID
    $$ = function(id) {
        return document.getElementById(id);
    },

    // researcher = $$("researcher"),
    memo_controller = $$("memo-controller"), // memo controller in print.ejs file
    body = $$("body"),
    image_form = $$("image-form"), // img form downside of tables
    memo_form = $$("memo-form"),
    image_div_class = $$("picture-body"),
    container = $$("container"),
    print_info_path = "./json/print.json", // table data from json file
    record_picture_name = {},
    record_each_memos = {},
    global_info,
    count_memo = 0, // count meta-data
    count_table = 0

$.getJSON(print_info_path, (info) => {

    // read json data from print.json file

    global_info = info
    
    let table_data = []
    let table_num = 0
    let previous_process = ""
    let count_num_one_process = 0
    let idx = 0

    do { // minimum iteration for do-while

        let each_data = info[idx]

        if(each_data["사진"]) { // for picture data searching
            record_picture_name[each_data["공정"] + "_#" + String(count_num_one_process)] = each_data["사진"] + "_" + each_data["_id"]
        }
        
        if(each_data["비고"]){ // for memo data searching
            record_each_memos[each_data["공정"] + "_#" + String(count_num_one_process)] = each_data["비고"]
            count_memo++
        }

        // delete data which not contained tables
        delete each_data["사진"]
        delete each_data["_id"]
        delete each_data["비고"]
        
        // in json file, there is table which is enumerated every process data.
        // So, This if-condition works seperating each process data
        // There isn't need so much understanding of works
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
        count_table++

    } while(idx++ < info.length - 1)

    // render work downside of the tables
    renderMemos(record_each_memos) // memos
    renderPictures(record_picture_name) // pictures
    
    // *** There is other different meaning of pictures ***
    // So Be careful

    // make A4 size real pdf file from this page
    getPicture()
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

        form_adder.className = "picture"
        
        image_form.appendChild(form_adder)
        form_adder.appendChild(img)
        form_adder.appendChild(img_name)
    }
}

function getPicture () {
    
    let heads = document.getElementsByClassName("wtHider")
    let max_length = 0

    for (let idx = 0; idx < heads.length; idx++) {
        
        let width_num = heads[idx].style.width.slice(0, -2)
        width_num = parseInt(width_num)

        if (width_num > max_length)
            max_length = width_num
    }
    
    // For feating A4 size
    memo_form.style.width = max_length + 100 + "px"
    max_length += 200
    image_div_class.style.width = max_length + "px"
    image_div_class.style.height = max_length * 29 / 21 + "px"

    document.body.style.zoom = 0.6

    // Capture work for page
    html2canvas(image_div_class).then(function(canvas) {

        let file_name = global_info[0]["실험자명"] +  " 연구원 연구노트 (" + global_info[0]["실험날짜"] + "-" + global_info[global_info.length - 1]["실험날짜"] + ").png"

        // Change raw base64 format data to blob data
        // To print this page
        canvas.toBlob(function (blob) {
            var url = window.URL || window.webkitURL;
            var imgSrc = url.createObjectURL(blob);
            var img = new Image();
            img.src = imgSrc;
            img.onload = function () {
                var pdf = new jsPDF('p', 'px', [img.height, img.width]);

                pdf.addImage(img, 0, 0, img.width - 350, img.height - 350);
                pdf.save(file_name + '.pdf');
            }; 
        })
    })
}
