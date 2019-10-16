// todo :

var 
    memo = $$('memo'),
    memo_text = $$('memo-text'),
    memo_button = $$('memo-button')

function modeDropChange() {
    var file_uploader = $$('file-uploader')

    if (mode.options[mode.selectedIndex].value == "Upload-mode"){
        file_uploader.className = "hide"
        memo.className = ""



        alert('Upload mode is activated')
    }
    else{
        file_uploader.className = ""
        memo.className = "hide"

        
        alert('Update mode is activated')
    }
}


var memo_path = './json/memo.json'
let memo_file

function getMemo() {
    return new Promise((resolve, reject) => {
        $.getJSON(memo_path, function(data) {
            if(data) {
                memo_file = data
                render_memo()
            }
            else{
                reject(new Error("Error : failed get memo"));
            }
        });
    });
}

getMemo()

memo_button.addEventListener('click', function () {
    if(memo_button.innerHTML == "Modify"){
        memo_text.removeAttribute("disabled")
        memo_button.innerHTML = "Save"
    }
    else{
        memo_text.setAttribute("disabled", "")
        memo_button.innerHTML = "Modify"

        save_memo()
    }
    
})

function render_memo() {
    memo_text.value = memo_file[dropdown.options[dropdown.selectedIndex].value]
}

function save_memo() {
    var text = memo_text.value
    var process = dropdown.options[dropdown.selectedIndex].value

    memo_file[process] = text

    var url_tmp = URL + "/memo"
    var req = { "process" : process, "data" : text }

    var config = {
        crossOrigin : true,
        url : url_tmp,
        method : 'POST',
        dataType : 'json',
        data : req,
        responseType : 'json'
    }

    axios(config).then(res => {
        var response = res["data"];

        if (response["result"] === 'ok') {
            console.log("success")
        }
        else {
            console.log("fail")
        }
    })
}