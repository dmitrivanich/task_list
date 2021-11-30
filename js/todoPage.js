// ДОБАВЛЕНИЕ DOM-элементов
const addTodoBtn = document.querySelector(".addTodo-btn")
const inputName = document.querySelector(".inputName")
const inputDiskript = document.querySelector(".inputDiskript")
const todoList = document.querySelector(".todo-list")
const nightMode = document.querySelector(".nightMode-btn")
const filterOption = document.querySelector(".filter")
const clearTagsBtn = document.querySelector(".htClearButton")
const sortTagsBtn = document.querySelector(".htSortButton")

const todoObjArray = []; //массив где хранятся объекты с данными 'задач'
const tagSet = new Set() // уникальные HashTag-и


// ДОБАВЛЕНИЕ СОБЫТИЙ

//клик по textarea
document.onclick = (e) => {

  if (e.target.className === 'inputDiskript' ) {
    inputDiskript.style.height = '100px'

  } else {
    if (!inputDiskript.value) {
      inputDiskript.style.height = '20px'
    }
  }

  if (e.target.className === 'ht' ) {
    console.log(e.target.className)
    tagSet.delete(e.target.innerText)
    if (tagSet.size === 0){
      document.querySelector(".htListBox").classList.remove('block')
    }
    const tags = document.querySelector(".htList").childNodes
    
    for(let item of tags) {
      if(item.innerText === e.target.innerText) {
        item.classList.add('none')
      }
    }
    
  }
}

nightMode.onclick = (e) => {
  if (e.path[5].style.filter == '' || e.path[5].style.filter == 'invert(0)') {
    e.path[5].style.filter = 'invert(1)'
  } else {
    e.path[5].style.filter = 'invert(0)'
  }
}

clearTagsBtn.addEventListener('click', clearTags)

sortTagsBtn.addEventListener('click', sortTags)


document.addEventListener('DOMContentLoaded', downloadTodo)
//Полная загрузка страницы

addTodoBtn.addEventListener('click', addTodo);
//Клик по кнопке добавления задачи

todoList.addEventListener('click', removeAndCheckTodo);
todoList.addEventListener('click', tagFilter);
//Клик по кнопке удаления и по кнопке выполнения

filterOption.addEventListener('click', filter);
//Клик по кнопке фильтра









//НАСТРОЙКА СЧЕТЧИКА


var counterId = -1; //счетчик ID

if (JSON.parse(localStorage.getItem('todo')) !== null) {
  
  const todosLocal = JSON.parse(localStorage.getItem('todo'))
  //если существует localStorage и в нем есть элементы, тогда
  //счетчик будет равен длине localStorage
  if  (todosLocal.length === 0) {
    counterId = todosLocal.length -1 ;
  } else {
    counterId = todosLocal.length - 1
  }
}

// localStorage.clear() - очищает localStorage



//ДОБАВЛЕНИЕ ФУНКЦИЙ



function addTodo(e) {
//Добавление задачи  

  const todo = document.createElement('div');
  todo.classList.add('todo')
  counterId += 1 
  todo.id = counterId


  const todoHead = document.createElement('div');
  todoHead.classList.add('todoHead')

  const todoDownText = document.createElement('p');
  todoDownText.classList.add('todoDown-text')
  todoDownText.innerText = inputDiskript.value; //присваиваем значение инпута
  // Описание задачи
  
  const todoUpText = document.createElement('h3');
  todoUpText.classList.add('todoUp-text')
  // Заголовок задачи
  todoUpText.innerText = `${inputName.value}`;
  
  
  //Хэштеги
  
  let hashTagFilter = (str) => {
    
    let string = str.split('')
    let hashTags = ''
    
    string.map((item, index) =>{
      if (item === '#') {
        for (let i = index; i < string.length; i++) {
          if (string[i+1] === undefined) {
            hashTags += string[i]
            break;
          }
          
          if (string[i+1] === '#' || string[i+1] === ' ') {
            hashTags += string[i] + ' '
            break;
          }
          
          if (string[i] === ' ') {
            hashTags += arr[i]
            break;
          }
          
          hashTags += string[i]
        } 
      }
    })
    
    let filter = hashTags.split(' ').filter(el => el !== '' && el !== '#')
    return(filter)
  }
  
  let tags = [...hashTagFilter(inputName.value), ...hashTagFilter(inputDiskript.value)]

  const hashTagBox = document.createElement('div');
  hashTagBox.classList.add('hashTagBox')
  
  // с помощью SET оставляю в массиве тегов только уникальные теги
  let filterForTags = new Set();
  for(let item of tags) filterForTags.add(item);
  tags = Array.from(filterForTags);

  let hashTag = undefined

  tags.forEach(tag => {
    hashTag = document.createElement('p')
    hashTag.classList.add('hashTag')
    hashTag.innerText = tag;
    hashTagBox.append(hashTag)
  })
  
  
  inputDiskript.value = ''
  inputDiskript.placeholder = 'Введите описание задачи...' 
  //обнуление инпута описания задачи после нажатия кнопки
  
  let todoObj = new Todo(todoUpText.innerText, todoDownText.innerText, tags)
  todoObjArray.push(todoObj)
  //создание объекта, содержащего в себе данные задачи(название, описание)

  inputName.value = ''
  inputName.placeholder = 'Введите название задачи...' 
  //обнуление инпута названия задачи после нажатия кнопки

  const todoTime = document.createElement('p');
  todoTime.classList.add('todoTime')
  todoTime.innerHTML = todoObj.time


  const btnComplete = document.createElement('button');
  btnComplete.classList.add('todo-btn')
  btnComplete.id = 'complete'
  btnComplete.innerHTML = `<img id="tick" src="img/tick.png"/>`
  // Кнопка выполнения задачи

  const btnRemove = document.createElement('button');
  btnRemove.classList.add('todo-btn')
  btnRemove.id = 'remove'
  btnRemove.innerHTML = `<img id="trash" src="img/trash.png"/>`
  // Кнопка удаления задачи


  
  todoHead.append(todoUpText)
  todoHead.append(btnComplete)
  todoHead.append(btnRemove)
  todo.append(todoHead)
  todo.append(todoTime) 
  todo.append(todoDownText) 
  todo.append(hashTagBox) 
  todoList.append(todo)
  //Вкладываем только что созданные элементы

  saveToLocal()//сохраняем todoObjArray в localstorage


  if(todoDownText.innerText === "removeall") {
    localStorage.clear()
  }

}



function removeAndCheckTodo(e) {
  const item = e.target
  const todo = e.path[3];

  function remove(){
    todo.remove();
  }

  if (item.id === 'trash') {
    todo.classList.toggle('removed')
    setTimeout(remove, 200)
    var id = e.target.parentNode.parentNode.parentNode.id;
    todoObjArray[id] = []
    console.log(e.target.parentNode.parentNode.parentNode)
    saveToLocal()
  }


  if (item.id === 'tick') {
    todo.classList.toggle('completed')
  }
}



function filter(e) {
  const todos = todoList.childNodes;
  console.log(todos)

  todos.forEach(todo => {
    switch (e.target.id) {
      case "all": 
        todo.style.display = 'block';
        break;
      case "completed": 
        if(!todo.classList.contains('completed')){
          todo.style.display = 'none';
        } else {
          todo.style.display = 'block';
        }
        break;
      case "uncompleted": 
        if(todo.classList.contains('completed')){
          todo.style.display = 'none';
        } else {
          todo.style.display = 'block';
        }
        break;
    }
  });
}


function Todo(nameUp, nameDown, tags) {
  this.nameUp = nameUp;
  this.nameDown = nameDown;
  this.time = String(new Date().toLocaleTimeString());
  this.tags = tags;
  this.id = counterId;
}



function tagFilter(e) {
  if (e.target.className === 'hashTag') {
    document.querySelector(".htListBox").classList.add('block')
    
    tagSet.add(e.target.innerText)
    let tagArray = Array.from(tagSet)

    document.querySelector(".htList").innerHTML = ''
    for(let tag of tagArray) {
      document.querySelector(".htList").innerHTML += `<li class="ht">${tag}</li>`
    }

  }
}

function clearTags(e) {
  document.querySelector('.htListBox').classList.remove('block')
  tagSet.clear()

  for(let item of todoList.childNodes) {
    item.classList.remove('none')
  }
}

function sortTags(e) {
  // document.querySelector('.htListBox').innerHTML = ''
  let tagArray = Array.from(tagSet) 
  let todoFilter = new Set()
  

  for(let tag of tagArray) {
    for(let item of todoObjArray) {
      if (item.length !== 0) {
        if(item.tags.includes(tag)) {
          todoFilter.add(item.id)
        }
      }
    }
  }
  
  let todoArray = Array.from(todoFilter)

  for(let item of todoList.childNodes) {
    if(!todoArray.includes(+item.id)){
      item.classList.add('none')
    }
  }
}


function saveToLocal() {
  localStorage.setItem('todo', JSON.stringify(todoObjArray))
}



function downloadTodo() {
  if (JSON.parse(localStorage.getItem('todo')) !== null) {
    todoObjArray.push(...JSON.parse(localStorage.getItem('todo')))
  } 
  // с каждой перезагрузкой страницы пушим todo из localstorage в todoObjArray
  // ниже будем создавать todo используя данные todoObjArray 

  
  
  todoObjArray.map(item => {
    if (item.id !== undefined) {
      let tagMaker = ``

      item.tags.forEach(tag => {
        tagMaker += `<p class="hashTag">${tag}</p>`
      })

      todoList.innerHTML += `<div class="todo" id="${item.id}"><div class="todoHead"><h3 class="todoUp-text">${item.nameUp}</h3><button class="todo-btn" id="complete"><img id="tick" src="img/tick.png"></button><button class="todo-btn" id="remove"><img id="trash" src="img/trash.png"></button></div><p class="todoTime">${item.time}</p><p class="todoDown-text">${item.nameDown}</p><div class="hashTagBox">${tagMaker}</div></div>`
    }
        
  })
}





