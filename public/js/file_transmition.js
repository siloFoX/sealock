// todo :

var 
    test = $$('test')

function modeDropChange() {
    var file_uploader = $$('file-uploader')

    if (mode.options[mode.selectedIndex].value == "Upload-mode"){
        file_uploader.className = "hide"
        test.className = ""
    }
    else{
        file_uploader.className = ""
        test.className = "hide"
    }
}