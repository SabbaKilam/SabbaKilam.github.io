//Version 2 of Todo App

// 0.) Make a todo liat as an array.
var todos = ["item 1", "item 2"];

// 1.) A function that displays todos
function displayTodos(){
	console.log("My todos: ", todos);
}

// 2.) A function that adds a todo
function addTodo(aTodo){
	todos.push(aTodo);
	displayTodos();
}

// 3.) A function that changes a todo
function changeTodo(index, revision){
	todos[index] = revsion;
	displayTodos();
}

// 4.) A function that deletes a todo
function deleteTodo(index){
	todos.splice(index,1);
	displayTodos();
}