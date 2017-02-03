/*
    The goal: place our todolist on the screen
*/
let CHECK = '&#x02713;';
let SPACE = '&nbsp;';
let carrier = document.getElementById('carrier');
let todos = [
    {
        todo: "Do math homework",
        completed: false
    },
    {
        todo: "File my tax return",
        completed: false
    },
    {
        todo: "Wash the car",
        completed: false
    },
    {
        todo: "Do the laundry",
        completed: false
    }
];

//add another todo, just to test things
todos.push({todo: "Something else to do", completed: false});

function showTodos(){
  carrier.innerHTML = '';
  todos.forEach(placeTodoOnScreen);
  function placeTodoOnScreen(todoObject, index){
      let circleClass = "circleDiv";
      let todoClass = "todoDiv";
      if(todoObject.completed){
          circleClass = "circleDivCompleted";
          todoClass = "todoDivCompleted";
      }      
      //For the todoObject that we are given:    
      /**
       * 1.) Create a circle div
       * 2.) Create a todo div
       * 3.) Put the circle div into the circleClass class
       * 4.) Put the todo div into the todoClass class
      */
      //1.
      let cd = document.createElement('div');
      //2.
      let td = document.createElement('div');
      //3.
      cd.setAttribute('class', circleClass);
      //4.
      td.setAttribute('class', todoClass);      
      /**
       * 5.) Put the CHECK character in the circle div
       * 6.) Put the todoObject's todo text in the todoDiv
       * 7.) make a private holder for these two div
       * 8.) Place the circle div and the todo div inside their own private holder div
       * 9.) Finally, place the private holder div inside the carrier div on the screen
      */
      //5.
      cd.innerHTML = CHECK;
      //6.
      td.innerHTML = todoObject.todo ;
      //7.
      let holder = document.createElement('div');
      holder.setAttribute("id",index);
      cd.setAttribute("id",index);
      td.setAttribute("id",index);
      
      //8.
      holder.appendChild(cd);
      holder.innerHTML += SPACE + SPACE;
      holder.appendChild(td);
      //9.
      carrier.appendChild(holder);
  }  
}//----| END of showTodos() |--------//

//invoke ("call") the showTodos function
showTodos();

// We need to make function that toggles the completed property
// when we click a todo on the screen.

window.onclick = toggleTodo;

function toggleTodo(eventObject){
  let id = eventObject.target.id;
  //let's toggle the "completed property"
  // of the clicked todo
  todos[id].completed =  ! todos[id].completed;  
  showTodos();
}
