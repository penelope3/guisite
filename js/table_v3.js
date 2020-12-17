/*
File: table_v3.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on November 25, 2020 at 8:14pm

Description: This file contains code for creating tables.
*/

$(function () {
    $("#input").change(function () {
        if (!$("#input").valid()) return;
        getUserInput(this);
    });
});

var tab_values = {};

function getUserInput(form) {
    var data = [];
    const formData = new FormData(form);
    formData.forEach((item, i) => {
        data.push(Number(item));
    });
    tab_values[current_tab] = data;
    renderTable(tableMath(data));
}

function tableMath(data) {
    var y_low = data[0];
    var y_high = data[1];
    var x_low = data[2];
    var x_high = data[3];

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

function renderTable(data) {
    var table_data = data.data;
    var height = data.height;
    var width = data.width;
    var table = document.getElementById("results-" + current_tab);
    $(".empty#tab-" + current_tab).hide();
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
