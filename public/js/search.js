// URL for client 223.194.70.112
var URL = "http://223.194.70.112:3000"

var // DOM controller get by ID
    $$ = function(id) {
        return document.getElementById(id);
    },

    backBtn = $$("back-btn"),
    nameInput = $$("name-input"),
    startInput = $$("start-input"),
    endInput = $$("end-input"),
    searchBtn = $$("search-btn")

backBtn.addEventListener("click", () => {
    location.href = URL;
})

searchBtn.addEventListener("click", onClickSearchBtn)

function onClickSearchBtn() {
    
    if(isDataGood())
        postSearch();
}

function isDataGood() {
    
    if(isNameGood() && isStartDateGood() && isEndDateGood()) {
        
        if(transformToDate(startInput.value).getTime() <= transformToDate(endInput.value).getTime())
            return true;
        else 
            alert("Start Date is over than End Date! Please check the dates.")
    }
    else
        return false;
}

function isNameGood () {
    
    if(nameInput.value)
        return true;
    else {
        alert("Name space is empty")
        return false;
    }
}

function isStartDateGood() {

    if(isDateGood(startInput.value))
        return true;
    else {
        alert("Invalid Start Date")
        return false;
    }
}


function isEndDateGood() {

    if(isDateGood(endInput.value))
        return true;
    else {
        alert("Invalid End Date")
        return false;
    }
}

function isDateGood(date) {

    if(!date) {

        alert("Date is empty now")
        return false;
    }
    var transformedDate = transformToDate(date)

    if (transformedDate instanceof Date) 
        if(transformedDate.toString() != "Invalid Date") 
            return true;
     
    return false;
}

function transformToDate (date) {

    if(date.length != 8) {
        alert("Invalid Date format")
        return null;
    }

    var currentDate = new Date();

    var year = date.substr(0, 4)
    var month = date.substr(4, 2)
    var day = date.substr(6, 2)

    var searchDate = new Date(year, month - 1, day)

    if(searchDate.getTime() > currentDate.getTime() 
        || searchDate.getFullYear() > currentDate.getFullYear()
        || month < 0 || 12 < month
        || day < 0 || 31 < day)
        return null;

    return searchDate;
}

function postSearch() {

    var url_tmp = URL + "/search"

    var req = {
        "name" : nameInput.value,
        "start-date" : startInput.value,
        "end-date" : endInput.value
    }

    var config = {
        crossOrigin : true,
        url : url_tmp,
        method : "POST",
        dataType : "json",
        data : req,
        responseType : "json"
    }

    axios(config)
    .then(res =>{

        var response = res["data"]

        if(response["result"] === "ok") {

            new_window = window.open(URL + "/print", "연구노트", resizable = true)
            new_window.resizeTo(width = screen.height * 21 / 29 + 10, height = screen.height)

            alert("Print the PDF file")
        }
        else {
            alert("There's no data about that Name & Dates")
        }
    })
}