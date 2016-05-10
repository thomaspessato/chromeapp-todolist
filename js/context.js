(function(){

  var DOM = {
    todoInput: document.getElementById("todo-input"),
    container: document.getElementById("content"),
    todoList: document.getElementById("todo-list"),
    themeBtn: document.getElementById("theme-btn"),
    checkedCounter: document.getElementById("checked-counter")
  },
    persistedTodo = [],
    currentTheme,
    checkedItens = 0;

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
      DOM.themeBtn.innerHTML = "Theme: "+currentTheme;
    }
  });

  DOM.todoInput.onkeypress = function(e){
    
    if(!e) e = window.event;

    if(e.keyCode != "13"){  
      return;
    }
    
    if(DOM.todoInput.value === ""){
      return;
    }

    addItem(DOM.todoInput.value);

    persistedTodo.push(DOM.todoInput.value);
    chrome.storage.local.set({"todoData":persistedTodo});

    DOM.todoInput.value = "";
    
  };


  function addItem(data){
    var li = document.createElement("li"),
        checkbox = document.createElement("input"),
        closeBtn = document.createElement("span"),
        p = document.createElement("p"),
        editBtn = document.createElement("button"),
        refChild;



    closeBtn.className = "close-btn"; 
    closeBtn.innerHTML = "x";
    li.className = "todo-item";
    editBtn.className = "edit-btn";
    checkbox.className = "todo-checkbox";
    p.className = "todo-text";

    checkbox.setAttribute("type","checkbox");


    li.appendChild(checkbox);
    li.appendChild(editBtn);
    li.appendChild(closeBtn);
    li.appendChild(p);

    p.innerHTML = data;
    refChild = DOM.todoList.firstChild;
    DOM.todoList.insertBefore(li,refChild);

  }

  window.addEventListener("click", function(evt){
    if(evt.target.id == "close-btn") {
      closeWindow();
    }

    if(evt.target.id == "theme-btn") {
      changeTheme();
    }
  },false);

  DOM.todoList.addEventListener("click", function(evt){
    if(evt.target.classList.contains("checked")){
      evt.target.classList.remove("checked");
      checkedItens--;
      DOM.checkedCounter.innerHTML = "Completed tasks: "+checkedItens;
      
    } else if (evt.target.classList.contains("todo-text")) {
      evt.target.classList.add("checked");
      checkedItens++;
      DOM.checkedCounter.innerHTML = "Completed tasks: "+checkedItens;
    }
  });

  function setTheme(theme){
    DOM.container.classList.add(theme);
  }

  function changeTheme(){

    if(DOM.container.classList.contains("light")) {
      currentTheme = "dark";
      DOM.container.classList.remove("light");
    } else {
      currentTheme = "light";
      DOM.container.classList.remove("dark");
    }

    DOM.themeBtn.innerHTML = "Theme: "+currentTheme;
    DOM.container.classList.add(currentTheme);
    chrome.storage.local.set({"theme":currentTheme}); 
  }

  DOM.todoList.addEventListener("click",function(evt){
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