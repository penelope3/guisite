/*
File: slider.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on November 25, 2020 at 8:16pm

Description: This file contains code for the input sliders to update the table in real time.
*/

//places the slider positions halfway to the max on either end.
$(function () {
    $("#x_slider").slider({
        range: true,
        min: -50,
        max: 50,
        step: 1,
        values: [-25, 25],
        slide: x_change,
    });
});
$(function () {
    $("#y_slider").slider({
        range: true,
        min: -50,
        max: 50,
        step: 1,
        values: [-25, 25],
        slide: y_change,
    });
});

//in realtime changes the values according to the slider in the side text boxes
function x_change(event, ui) {
    $(".range input")[ui.handleIndex].value = ui.value;
    $("input[name='x1']").valid();
    $("input[name='x2']").valid();
    getUserInput($("#input")[0]);
}
function y_change(event, ui) {
    $(".range input")[2 + ui.handleIndex].value = ui.value;
    $("input[name='y1']").valid();
    $("input[name='y2']").valid();
    getUserInput($("#input")[0]);
}

//reflects the changes in input on the actual slider
function inputChange(target) {
    if (target.name == "x1" || target.name == "x2") {
        if (!$("input[name='x1']").valid() || !$("input[name='x2']").valid())
            return;
        var x_low = Number($("input[name='x1']").val());
        var x_high = Number($("input[name='x2']").val());
        $("#x_slider").slider("values", [x_low, x_high]);
    } else {
        if (!$("input[name='y1']").valid() || !$("input[name='y2']").valid())
            return;
        var y_low = Number($("input[name='y1']").val());
        var y_high = Number($("input[name='y2']").val());
        $("#y_slider").slider("values", [y_low, y_high]);
    }
}

//updates the values and then validates(although should already be valid)
function update_inputs(data) {
    $("#x_slider").slider("values", data.slice(0, 2));
    $("#y_slider").slider("values", data.slice(2, 4));
    $("input[name='x1']").val(data[0]);
    $("input[name='x2']").val(data[1]);
    $("input[name='y1']").val(data[2]);
    $("input[name='y2']").val(data[3]);
    $("input[name='x1']").valid();
    $("input[name='x2']").valid();
    $("input[name='y1']").valid();
    $("input[name='y2']").valid();
}