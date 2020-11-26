/*
File: tabs.js
91.61 GUI Programming I
Pooja K Patel, UMass Lowell Computer Science Undergrad Student, pkpatel@cs.uml.edu
Pooja_Patel@student.uml.edu
Copyright(c) 2020 by Pooja K.Patel.All rights reserved.
Updated by PKP on November 25, 2020 at 8:15pm

Description: This file contains code for creating and deleting tabs.
*/


var tab_index = 1;
var tab_count = 0;
var current_tab = 1;
var delete_tabs = [];

//main tabs function
$(function () {
    $("#tabs").tabs({
        //updates inputs and changes active status when shifting tabs
        activate: function (event, ui) {
            current_tab = Number(
                ui.newTab[0].getAttribute("aria-controls").substring(5)
            );
            if (tab_values[current_tab]) update_inputs(tab_values[current_tab]);
        },
    });
    //Adds the first tab
    addTab(true);
    $("#add-tab").click(addTab);
    $("#delete-tab").click(deleteTab);
});

function handleDelete(event) {
    const numb = event.target.id.substring(6);
    if (event.target.checked) {
        delete_tabs.push(numb);
        if (delete_tabs.length == 1) $("#delete-tab").prop("disabled", false);
    } else {
        const index = delete_tabs.indexOf(numb);
        if (index > -1) delete_tabs.splice(index, 1);
        if (delete_tabs.length == 0) $("#delete-tab").prop("disabled", true);
    }
}

//creates 'empty table' message on new tab
function generateNodes() {
    var tab_template = `
  <li>
    <a href="#tabs-${tab_index}">Tab ${tab_index}</a>
    <input type='checkbox' id="check-${tab_index}" onchange='handleDelete(event)'/>
  </li>`;
    var body_template = `
  <div id="tabs-${tab_index}">
    <div class="empty" id="tab-${tab_index}">
      <p>Please input data for the multiplication table to be generated.</p>
    </div>
    <!-- Table to render -->
    <div class="table-wrapper">
      <table id="results-${tab_index}"></table>
    </div>
  </div>
  `;
    return { tab: tab_template, body: body_template };
}

//creates a new active tab
function addTab() {
    var elements = generateNodes();
    $(elements.tab).appendTo("#tabs ul");
    $(elements.body).appendTo("#tabs");
    $("#tabs").tabs("refresh");
    $("#tabs").tabs({ active: tab_count });
    tab_index++;
    tab_count++;
    if (tab_count == 1) {
        $("#input :input").prop("disabled", false);
        if (delete_tabs.length == 0) $("#delete-tab").prop("disabled", true);
        $("#x_slider").slider({ disabled: false });
        $("#y_slider").slider({ disabled: false });
    }
}

//removes active tab and sets the last created tab to active
function deleteTab() {
    delete_tabs.forEach((item, i) => {
        $("#tabs-" + item).remove();
        var hrefStr = "a[href='" + "#tabs-" + item + "']";
        $(hrefStr).closest("li").remove();
        tab_count--;
    });
    if (tab_count == 0) {
        $("#x_slider").slider({ disabled: true });
        $("#y_slider").slider({ disabled: true });
        $("#input :input").prop("disabled", true);
        $("#add-tab").prop("disabled", false);
    }
    $("#tabs").tabs("refresh");
    $("#tabs").tabs({ active: current_tab });
    console.log("Remove", current_tab, tab_count);
    delete_tabs = [];
    $("#delete-tab").prop("disabled", true);
}