//this array will hold the todo list items
let todoItems = [];

//this function will create a new todo object based on the 
//text that was entered in the text input, and push it into
//the `todoItems` array
function addTodo(text){

    const todo = {
        text,
        checked: false,
        id: Date.now(),
    };

    todoItems.push(todo);
    renderTodo(todo);
}


//select the form element
const form = document.querySelector('.js-form');
//add a submit event listener
form.addEventListener('submit',event =>{

    //prevent page refresh on form submission
    event.preventDefault();

    //select the text input
    const input = document.querySelector('.js-todo-input');

    //get the value of the input and remove the whitespace
    const text = input.value.trim();

    if (text !== ''){
        addTodo(text);
        input.value='';
        input.focus();
    }

});


//Render the todo items
function renderTodo(todo){
    //to persisit data in the local storage
    localStorage.setItem('todoItemsRef',JSON.stringify(todoItems));

    //select the first element with a class of `js-todo-list`
    const list = document.querySelector('.js-todo-list');

    //select the current todo item in the dom, 
    const item = document.querySelector(`[data-key = '${todo.id}']`);

    //for deleteTodo function 
    if (todo.deleted) {
        // remove the item from the DOM
        item.remove();
        //this line to clear whitespace from the list container
        // when `todoItems` is empty
        if(todoItems.length === 0) list.innerHTML = '';
        return
      }

   // Use the ternary operator to check if `todo.checked` is true
  // if so, assign 'done' to `isChecked`. Otherwise, assign an empty
  const isChecked = todo.checked ? 'done': ' ';

  //create an `li` element and assign it to `node`
  const node = document.createElement("li");

  //set the 'class' attribute to 'todo-item'[a class in stylesheet]
  node.setAttribute('class', `todo-item ${isChecked}`);

  //set the data-key attribute to the id of the todo
  node.setAttribute('data-key', todo.id);

  //set the contents of the `li` element crated above
  node.innerHTML = 
  `<input id = "${todo.id}" type = "checkbox"/>
  <label for = "${todo.id}" class = "tick js-tick"></label>
  <span> ${todo.text}</span>
  <button class = "delete-todo js-delete-todo">
  <svg><use href= "#delete-icon"></use></svg>
  </button>`;

  //if the item already exists in the dom,
  if(item){
      //replace it 
      list.replaceChild(node,item);
  } else {

    //otherwise append it to the end of the list
    list.append(node);
  }

}


// To mark a task as complete
//select the entire list
const list = document.querySelector('.js-todo-list');

//Add a click event listener to the list and its children
list.addEventListener('click', event =>{
if(event.target.classList.contains('js-tick')){

    const itemkey = event.target.parentElement.dataset.key;
    toggleDone(itemkey);
}

 // to delete the item
 if(event.target.classList.contains('js-delete-todo')){
     const itemKey = event.target.parentElement.dataset.key;
     deleteTodo(itemKey);
 }
});

//This function receives the key of the list item that was checked or
// unchecked and finds the corresponding entry in the todoItems array 
//and set it to opposite value
function toggleDone(key){
    //findIndex is an array method that returns the position of an 
    //element in the array. 

    const index = todoItems.findIndex(item => item.id === Number(key));

    //locate the todo item in the todoItems array and set its checked
    //property to the opposite. that means, `true` will become `false` and vice versa
    todoItems[index].checked = !todoItems[index].checked;
    renderTodo(todoItems[index]);
}


//Delete todo
function deleteTodo(key){

    //find the corresponding todo object in the todoItems array

    const index = todoItems.findIndex(item => item.id === Number(key));
    // Create a new object with properties of the current todo item
   // and a `deleted` property which is set to true

   const todo = {
       deleted: true,
       ...todoItems[index]
   };
   //remove the todo item from the array by filtering it out
   todoItems = todoItems.filter(item => item.id !== Number(key));
   renderTodo(todo);
}


// to render any existing todo list items when the page is loaded
//from local storage
document.addEventListener('DOMContentLoaded',()=>{
    const ref = localStorage.getItem('todoItemsRef');
    if(ref){
        todoItems = JSON.parse(ref);
        todoItems.forEach(t =>{
            renderTodo(t);
        });
    }
});





