var
    submit = $$('submit'),
    file_select = $$('file-select'),
    file_name = $$('file-name'),
    info_id = $$('info-id'),
    info_date = $$('info-date'),
    info_name = $$('info-name'),
    info_board_number = $$('info-board-number'),
    real_id = $$('real_id');

function select_picture(row, column, row2, column2, headers, hot) {

    if((row != row2) || (column != column2)){
        return;
    }
    if(headers[column] == "사진" && (selected_row != row || first_picture_select)){
        first_picture_select = false
        selected_row = row

        sidebar_picture(hot.getData()[row])
    }
    else{
        first_picture_select = true
        selected_row = row
    }
}

function sidebar_picture(data){
    info_id.innerHTML = data[0].slice(13)
    info_date.innerHTML = data[1]
    info_name.innerHTML = data[2]
    info_board_number.innerHTML = data[3]
    real_id.innerHTML = data[0]

    if(data[1] && data[2] && data[3]){
        alert("Go to left tab and save your file.")
    }
    else{
        alert("Please fill in your data for save image")
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

    alert("File Submitting..")
    exampleConsole.innerText = 'Loading ...';

    var req = new FormData();
    var url_tmp = URL + '/file'
    var file_name_tmp = dropdown.options[dropdown.selectedIndex].value + "_" + real_id.innerHTML + "_" + file_name.value

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
            alert("file upload success")
            hot.destroy()
            renderDatafromDB()

            exampleConsole.innerText = 'Click " Update " to save data to server';
        }
        else {
            console.log("fail")
            alert("file upload failed")

            exampleConsole.innerText = 'Click " Update " to save data to server';
        }
    })

    file_name.value = "File Name"
});