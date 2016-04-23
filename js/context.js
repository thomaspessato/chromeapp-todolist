(function(){
  var todoInput = document.getElementById("todo-input"),
    container = document.getElementById("content"),
    todoList = document.getElementById("todo-list"),
    themeBtn = document.getElementById("theme-btn"),
    persistedTodo = [];

  chrome.storage.local.get('todoData',function(result){
    persistedTodo = result.todoData; 
    for(var i = 0; i< persistedTodo.length; i++){
      addItem(persistedTodo[i]);
    }
  });

  todoInput.onkeypress = function(e){
    
    if(!e) e = window.event;
    
    if(e.keyCode != "13"){  
      return;
    }
    
    if(todoInput.value === ""){
      return;
    }

    addItem(todoInput.value);

    persistedTodo.push(todoInput.value);
    chrome.storage.local.set({'todoData':persistedTodo},function () {
      console.log("New data saved");
    });

    todoInput.value = "";
    
  };


  function addItem(data){
    var li = document.createElement("li"),
        closeBtn = document.createElement("span"),
        p = document.createElement("p"),
        editBtn = document.createElement("button"),
        refChild;

    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "x";
    li.className = "todo-item";
    editBtn.className = "edit-btn";
    li.appendChild(closeBtn);
    li.appendChild(editBtn);
    li.appendChild(p);
    
    p.innerHTML = data;
    refChild = todoList.firstChild;
    todoList.insertBefore(li,refChild);

  }

  window.addEventListener("click", function(evt){
    if(evt.target.id == "close-btn") {
      closeWindow();
    }

    if(evt.target.id == "theme-btn") {
      if(container.classList.contains("light")) {
        container.classList.remove("light");  
        container.classList.add("dark"); 
        themeBtn.innerHTML = "Theme: dark";
      } else {
        container.classList.remove("dark");  
        container.classList.add("light");
        themeBtn.innerHTML = "Theme: light";
      }
      
    }
  },false);


  todoList.addEventListener("click",function(evt){
    var deletedItem;
    if(evt.target.innerHTML != "x"){
      return;
    }
    deletedItem = persistedTodo.indexOf(evt.target.nextSibling.innerText);

    persistedTodo.splice(deletedItem,1);
    evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
    chrome.storage.local.set({'todoData':persistedTodo},function () {
      console.log("New data saved");
    });
     
  });
})();