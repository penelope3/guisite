/*
File: js/table.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on October 29, 2020 at 6:51pm

Description: This file contains table making via javascript for HW5. This code
receives input from the UI form in HW5.html and then creates a table from the
input ranges. The table is then rendered back in the renderTable(data) function by 
adding the relevant table elements.
*/

//This function reseives input from the form in the html file
//and checks for input error before creating the table.
function getUserInput(e) {
    document.getElementById("empty").style.display = "block";
    var error = false;
    e.preventDefault();
    clearTable();
    var all_num = ["y1", "y2", "x1", "x2"];
    const formData = new FormData(e.target);
    for (var i = 0; i < all_num.length; i++) {
        const data = Number(formData.get(all_num[i]));
        const valid = validateInput(data);

        if (valid.isValid) {
            clearError(all_num[i])
            all_num[i] = data;
        }
        else {
            handleError(all_num[i], valid.reason)
            all_num[i] = NaN;
            error = true;
        }
    }
    if (!error) {
        renderTable(table_math(all_num));
    }
}

//This function makes sure the table is clear before adding data.
function clearTable() {
    document.getElementById("results").innerHTML = "";
}

//This function gets rid of any error messages once the data
//has been validated.
function clearError(id) {
    let element = document.getElementById(id + '_error');
    element.innerHTML = "";
    if (!element.classList.contains("hidden")) {
        element.classList.add("hidden");
    }
}

//This function is for making the errors visible if the
//data was not valid.
function handleError(id, message) {
    let element = document.getElementById(id + '_error');
    console.log(id + '_error');
    element.innerHTML = message;
    element.classList.remove("hidden");
}

//This is the validate function that determines whether
//handlError() or clearError() are needed.
function validateInput(data) {
    if (Number.isInteger(data)) {
        if (data < -100 || data > 100) {
            return { isValid: false, reason: "Please enter inputs between -100 and 100." }
        }
        return { isValid: true }
    }
    return { isValid: false, reason: "Please enter only integers." }
}


//This function does all the multiplying for the table
function table_math(data) {
    var x_low = data[0];
    var x_high = data[1];
    var y_low = data[2];
    var y_high = data[3];

    //swap if range is out of order
    if (x_low > x_high) {
        var temp = x_low;
        x_low = x_high;
        x_high = temp;
    }

    if (y_low > y_high) {
        var temp = y_low;
        y_low = y_high;
        y_high = temp;
    }

    var col_total = x_high - x_low + 2;
    var row_total = y_high - y_low + 2;
    var table = [];

    //empty pushes
    for (var i = 0; i < col_total; i++) {
        table.push([]);
        for (var j = 0; j < row_total; j++) {
            table[i].push(0);
        }
    }

    //fill the correct data
    table[0][0] = "";
    for (var i = 1; i < col_total; i++)
        table[i][0] = x_low + i - 1;
    for (var i = 1; i < row_total; i++)
        table[0][i] = y_low + i - 1;
    for (var i = 1; i < col_total; i++) {
        for (var j = 1; j < row_total; j++)
            table[i][j] = table[0][j] * table[i][0];
    }

    //return the table as well as some table display info
    return { data: table, height: col_total, width: row_total };
}

//This renders the Table visually using table elements tr/th/td.
function renderTable(data) {
    var table_data = data.data;
    var height = data.height;
    var width = data.width;
    var table = document.getElementById("results");
    document.getElementById("empty").style.display = "none";
    table.innerHTML = "";

    for (var i = 0; i < height; i++) {
        let row = document.createElement("tr");
        for (var j = 0; j < width; j++) {
            let col;
            if (i == 0 || j == 0)
                col = document.createElement("th");
            else
                col = document.createElement("td");
            col.appendChild(document.createTextNode(table_data[i][j]));
            row.appendChild(col);
        }
        table.appendChild(row);
    }
}

