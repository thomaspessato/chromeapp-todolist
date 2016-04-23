var titlebar = document.getElementById("title-bar");
var content = document.getElementById("content");

function updateContentStyle(){

  if (titlebar) {
   
  }

}

function closeWindow() {
  window.close();
}



function focusTitlebars(focus) {
  var bg_color = focus ? "#3a3d3d" : "#7a7c7c";
    
  var titlebar = document.getElementById("top-titlebar");
  if (titlebar)
    titlebar.style.backgroundColor = bg_color;
  titlebar = document.getElementById("bottom-titlebar");
  if (titlebar)
    titlebar.style.backgroundColor = bg_color;
  titlebar = document.getElementById("left-titlebar");
  if (titlebar)
    titlebar.style.backgroundColor = bg_color;
  titlebar = document.getElementById("right-titlebar");
  if (titlebar)
    titlebar.style.backgroundColor = bg_color;
}


window.onload = function() {  
  updateContentStyle();
}

window.onfocus = function() { 
  console.log("focus");
  focusTitlebars(true);
}