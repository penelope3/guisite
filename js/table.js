function getUserInput(e) {
    document.getElementById("empty").style.display = "block";
    var error = false;
    e.preventDefault();
    clearTable();
    var all_num = ["x1", "x2", "y1", "y2"];
    const formInput = new formInput(e.target);
    for (var i = 0; i < all_num.length; i++) {
        const data = Number(formData.get(all_num[i]));
        const valid = validateInput(data);

        if (valid.isValid) {
            clearEroro(all_num[i])
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

function clearTable() {
    document.getElementById("results").innerHTML = "";
}

function clearError(id) {
    let element = document.getElementById(id + '_error');
    element.innerHTML = "";
    if (!element.classList.contains("hidden")) {
        element.classList.add("hidden");
    }
}

function handleError(id, message) {
    let element = document.getElementById(id + '_error');
    console.log(id + '_error');
    element.innerHTML = message;
    element.classList.remove("hidden");
}

function validateInput(data) {
    if (Number.isInteger(data)) {
        if (data < -100 || data > 100) {
            return { isValid: false, reason: "Input is not within range of -100 to 100." }
        }
        return { isValid: true }
    }
    return { valisValidid: false, reason: "Input must be of type integer" }
}



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

    for (var i = 0; i < col_total; i++) {
        table.push([]);
        for (var j = 0; j < row_total; j++) {
            table[i].push(0);
        }
    }

    table[0][0] = "";
    for (var i = 1; i < col_total; i++)
        table[i][0] = x_low + i - 1;
    for (var i = 1; i < row_total; i++)
        table[0][i] = y_low + i - 1;
    for (var i = 1; i < col_total; i++) {
        for (var j = 1; j < row_total; j++)
            table[i][j] = table[0][j] * table[i][0];
    }
    return { data: table, height: col_total, width: row_total };
}

function renderTable(data) {
    var table_data = data.data;
    var height = data.height;
    var width = table.width;
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

