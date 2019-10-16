// todo :

var 
    memo = $$('memo')

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