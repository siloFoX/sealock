var
    submit = $$('submit'),
    file_select = $$('file-select'),
    file_name = $$('file-name'),
    info_id = $$('info-id'),
    info_date = $$('info-date'),
    info_name = $$('info-name'),
    info_board_number = $$('info-board-number'),
    real_id = $$('real_id'),
    info_file_info = $$('info-file-info');

function select_picture(row, column, row2, column2, headers, hot) {

    if((row != row2) || (column != column2)){
        return;
    }
    if((headers[column] == "사진" || 
        headers[column] == "3D 프린팅 후 시편 사진" || 
        headers[column] == "양생 후 시편 사진" ||
        headers[column] == "시험 전 사진" ||
        headers[column] == "시험 후 사진" ||
        headers[column] == "기계적 특성 자료"))
    {
        sidebar_picture(hot.getData()[row], headers[column])
    }
    else{
        
        adviceConsole.innerText = 'Click " Update " or Click below of " 사진 " cells';

        if(update_container_changed) {
            adviceConsole.style = "color : red;"
        }
        else {
            adviceConsole.style = ""
        }
    }
}

function sidebar_picture(data, column_name){
    if(data[0] === null) {
        info_id.innerHTML = ""
    }
    else {
        info_id.innerHTML = data[0].slice(13)
    }
    real_id.innerHTML = data[0]
    info_date.innerHTML = data[1]
    info_name.innerHTML = data[2]
    info_board_number.innerHTML = data[3]   
    info_file_info.innerHTML = column_name

    if(data[1] && data[2] && data[3]){
        adviceConsole.innerText = "Go to left tab & select file."
        adviceConsole.style = "color : red;"
    }
    else{
        adviceConsole.innerText = "fill in cell for upload file"
        adviceConsole.style = "color : red;"
    }
}

file_select.addEventListener('change', function() {
    file_name.value = this.files[0].name;
});

submit.addEventListener('click', function() {
    if(!file_select.files[0]){
        alert("Input the file and submit please")
        return;
    }
    if(real_id.innerHTML === "") {
        alert("Select the column please")
        return;
    }

    // alert("File Submitting..")
    adviceConsole.innerText = 'Loading ...';
    adviceConsole.style = ""

    var req = new FormData();
    var url_tmp = URL + '/file'
    var file_name_tmp = dropdown.options[dropdown.selectedIndex].value + "_" + real_id.innerHTML + "_" + info_file_info.innerHTML + "_" + file_name.value

    req.append('file', file_select.files[0], file_name_tmp)

    var config = {
        crossOrigin : true,
        url : url_tmp,
        method : 'POST',
        data : req,
        responseType : 'json',
        headers: { 'Content-Type': 'multipart/form-data' }
    }

    axios(config).then(res => {
        var response = res["data"];

        if (response["result"] === 'ok') {
            console.log("success")
            // alert("file upload success")

            adviceConsole.innerText = 'File upload success';
            adviceConsole.style = "color : red;"

            hot.destroy()
            renderDatafromDB()
        }
        else {
            console.log("fail")
            alert("file upload failed")
            
            adviceConsole.innerText = 'File upload Failed';
            adviceConsole.style = "color : red;"
        }
    })

    update_container_changed = false
    file_select.form.reset()
    file_name.value = "File Name"
    info_id.innerHTML = ""
    info_date.innerHTML = ""
    info_name.innerHTML = ""
    info_board_number.innerHTML = ""
    info_file_info.innerHTML = ""
    real_id.innerHTML = ""
});