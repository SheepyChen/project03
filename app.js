let section = document.querySelector("section");
let add = document.querySelector("form button");

add.addEventListener("click", e => {
    e.preventDefault();

    //get the input value
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;
    //console.log(todoText, todoMonth, todoDate);

    if (todoText === "" || todoMonth === "" || todoDate === "") {
        alert("Please fill in the blanks.")
        return;
        //return => stop callback function
    }

    //create todo list section
    let todoBlock = document.createElement("div");
    todoBlock.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todoText")
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todoTime");
    time.innerText = todoMonth + "/" + todoDate;
    todoBlock.appendChild(text);
    todoBlock.appendChild(time);
    //create check and trash
    let completeButton = document.createElement("button");
    completeButton.classList.add("completed");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
            //remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray))
                }
            })
            todoItem.remove();
        })
        todoBlock.style.animation = "scaleDown 0.3s forwards";


    })
    todoBlock.appendChild(completeButton);
    todoBlock.appendChild(trashButton);

    todoBlock.style.animation = "scaleUp 0.3s forwards";
    //create an object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    //store data into array of objects
    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray))
    }

    //clear text input
    form.children[0].value = "";
    section.appendChild(todoBlock);



})
loadData();


function loadData() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        //use storage data to create todo list section
        myListArray.forEach(item => {
            let todoBlock = document.createElement("div");
            todoBlock.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todoText")
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todoTime");
            time.innerText = item.todoMonth + "/" + item.todoDate;

            todoBlock.appendChild(text);
            todoBlock.appendChild(time);

            let completeButton = document.createElement("button");
            completeButton.classList.add("completed");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
            completeButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            })

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.addEventListener("animationend", () => {
                    //remove from local storage
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray))
                        }
                    })
                    todoItem.remove();
                })
                todoBlock.style.animation = "scaleDown 0.3s forwards";


            })
            todoBlock.appendChild(completeButton);
            todoBlock.appendChild(trashButton);

            todoBlock.style.animation = "scaleUp 0.3s forwards";

            section.appendChild(todoBlock);


        });
    }
}

function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    // load data
    loadData();
})