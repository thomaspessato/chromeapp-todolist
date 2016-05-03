(function(){

  var todoInput = document.getElementById("todo-input"),
    container = document.getElementById("content"),
    todoList = document.getElementById("todo-list"),
    themeBtn = document.getElementById("theme-btn"),
    persistedTodo = [],
    currentTheme;

  chrome.storage.local.get('todoData',function(result){
    if(result.todoData) {
      persistedTodo = result.todoData; 
      for(var i = 0; i< persistedTodo.length; i++){
        addItem(persistedTodo[i]);
      }  
    };
  });

  chrome.storage.local.get('theme',function(result){
    if(result) {
      console.log(result);
      currentTheme = result.theme;
      setTheme(result.theme);
      themeBtn.innerHTML = "Theme: "+currentTheme;
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
    chrome.storage.local.set({"todoData":persistedTodo});

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
      changeTheme();
    }
  },false);

  function setTheme(theme){
    container.classList.add(theme);
  }

  function changeTheme(){

    if(container.classList.contains("light")) {
      currentTheme = "dark";
      container.classList.remove("light");
    } else {
      currentTheme = "light";
      container.classList.remove("dark");
    }

    themeBtn.innerHTML = "Theme: "+currentTheme;
    container.classList.add(currentTheme);
    chrome.storage.local.set({"theme":currentTheme}); 
  }

  todoList.addEventListener("click",function(evt){
    var deletedItem;
    if(evt.target.innerHTML != "x"){
      return;
    }
    deletedItem = persistedTodo.indexOf(evt.target.nextSibling.innerText);

    persistedTodo.splice(deletedItem,1);
    evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
    chrome.storage.local.set({"todoData":persistedTodo});
    
  });
})();