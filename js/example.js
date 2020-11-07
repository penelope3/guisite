// ADD NEW ITEM TO END OF LIST

var node = document.createElement('li');
node.setAttribute("id", "five");
node.appendChild(document.createTextNode('cream'));

document.querySelector('ul').appendChild(node);


// ADD NEW ITEM START OF LIST
var node = document.createElement('li');
node.setAttribute("id", "zero");
node.prepend(document.createTextNode('kale'));

document.querySelector('ul').prepend(node);

// ADD A CLASS OF COOL TO ALL LIST ITEMS

var list = new Array(
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five"
);

for(var i = 0; i < 6; i++){
  var list_item = list[i];
  var element = document.getElementById(list_item);
  element.classList.add("cool");
}



// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
var list_total = list.length
var node = document.createElement('span');
node.appendChild(document.createTextNode(list_total));

document.querySelector('h2').appendChild(node);
