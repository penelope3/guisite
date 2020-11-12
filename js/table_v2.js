function getUserInput(e) {
    document.getElementById("empty").style.display = "block";
    e.preventDefault();
    clearTable();
    var data = [];
    const formData = new FormData(e.target)
    formData.forEach((item, i) => {
        data.push(Number(item))
    });
    renderTable(tableMath(data));
}

function clearTable() {
    $("#results").innerHTML = "";
}

function tableMath(data) {
    //values here are swapped to make x and y on table correlate properly
    var y_low = data[0];
    var y_high = data[1];
    var x_low = data[2];
    var x_high = data[3];

    //swap if range is out of order
    if (x_low > x_high) {
        var temp = x_low;
        x_low = x_high;
        x_high = temp;
        let span = document.getElementById('y_hid');
        span.removeAttribute("hidden");
    }

    if (y_low > y_high) {
        var temp = y_low;
        y_low = y_high;
        y_high = temp;
        let span = document.getElementById('x_hid');
        span.removeAttribute("hidden");
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
