/*
    The goal: place our todolist on the screen
*/
let carrier = document.getElementById('carrier');
let todos = [
    {
        todo: "Do math homework",
        completed: false
    },
    {
        todo: "File my tax return",
        completed: true
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

todos.forEach(placeOnScreen);

function placeOnScreen(todoObject){
    carrier.innerHTML += todoObject.todo + '<br>';
    
}