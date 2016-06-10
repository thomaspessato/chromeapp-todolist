(function(){

  var DOM = {
    todoInput: document.getElementById("todo-input"),
    container: document.getElementById("content"),
    todoList: document.getElementById("todo-list"),
    themeBtn: document.getElementById("theme-btn"),
    checkedCounter: document.getElementById("checked-counter"),
    tabList: document.getElementById("tab-list"),
    tabInput: document.getElementById("tab-input"),
  },
    persistedTodo = {},
    currentTheme,
    checkedItens = 0,
    currentTab;

  getTabList();
  getDataTheme();


  chrome.storage.local.get('persistedTab',function(result){
    if(result) {
      currentTab = result.persistedTab;
      console.log("HAS PERSISTED TAB");
      DOM.tabList.value = currentTab;
    } else {
      currentTab = getCurrentTab();
    }
    getDataList();
  });


  chrome.storage.local.get('todoData',function(result){
    if(result.todoData) {
      persistedTodo = result.todoData;
    } 
  });

  function getTabList(){
    var tabList = [];
    chrome.storage.local.get('todoData',function(result){
      if(result.todoData) {
        for(var key in result.todoData){
          if(key) {
            addTab(key);
          }
        }
      }
    });
  }

  function getDataList(){
    console.log("CALLING DATA LIST");
    DOM.todoList.innerHTML = "";

    chrome.storage.local.get('todoData',function(result){
      if(result.todoData && result.todoData[currentTab]) {
        persistedTodo[currentTab] = result.todoData[currentTab];

        var itemList = result.todoData[currentTab].itemList;

        if(itemList) {
          for(var i = 0; i< itemList.length; i++){
            addItem(itemList[i]);
          }
        }
      } else {
        persistedTodo[currentTab] = {};
        persistedTodo[currentTab].itemList = [];  
      }
    });
  }

  

  function getCurrentTab () {
    return DOM.tabList.options[DOM.tabList.selectedIndex].value;
  }

  function getDataTheme(){
      chrome.storage.local.get('theme',function(result){
      if(result) {
        console.log(result);
        currentTheme = result.theme;
        setTheme(result.theme);
        DOM.themeBtn.innerHTML = "Theme: "+currentTheme;
      }
    });
  }

  

  DOM.tabList.addEventListener("change",function(evt){
    currentTab = evt.target.value;
    console.log(DOM.todoList);
    DOM.todoList.innerHTML = "";
    
    getDataList();

  },false);

  DOM.todoInput.onkeypress = function(e){

    currentTab = getCurrentTab();
    
    if(!e) e = window.event;

    if(e.keyCode != "13"){  
      return;
    }

    if(DOM.todoInput.value === ""){
      return;
    }

    addItem(DOM.todoInput.value);
    persistedTodo[currentTab].itemList.push(DOM.todoInput.value);
    chrome.storage.local.set({"todoData":persistedTodo});

    DOM.todoInput.value = "";
  };

  DOM.tabInput.onkeypress = function(e) {
    if(!e) e = window.event;

    if(e.keyCode != "13"){  
      return;
    }
    
    if(DOM.tabInput.value === ""){
      return;
    }

    addTab(DOM.tabInput.value);

    // persistedTodo.push(DOM.todoInput.value);
    // chrome.storage.local.set({"todoData":persistedTodo});

    DOM.tabInput.value = "";
  }


  window.addEventListener("click", function(evt){
    if(evt.target.id == "close-btn") {
      var persistedTab = getCurrentTab();
      chrome.storage.local.set({"persistedTab":persistedTab});
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

  function addTab(data) {
    var newOption = document.createElement("option");
    newOption.innerHTML = data;
    console.log(data);
    DOM.tabList.appendChild(newOption);
    persistedTodo[data] = {};
    persistedTodo[data].itemList = [];
  }

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
    deletedItem = persistedTodo[currentTab].itemList.indexOf(evt.target.nextSibling.innerText);

    persistedTodo[currentTab].itemList.splice(deletedItem,1);
    evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
    chrome.storage.local.set({"todoData":persistedTodo});
    
  });



})();