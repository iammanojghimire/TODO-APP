const url = "https://infodev-server.herokuapp.com/api/todos/";

const taskName = document.getElementById("name");
const priority = document.getElementById("priority");
const description = document.getElementById("description");

//function for rendering the todo list
function todoList(dataFromApi) {
  const textLine = dataFromApi.completed ? "text-decoration:line-through;" : "";
  const buttonHide = dataFromApi.completed ? "opacity:0;" : "";

  // for set the priority in badge
  const priorityBadge =
    dataFromApi.priority == 2
      ? "ml-2 badge badge-info"
      : dataFromApi.priority == 1
      ? "ml-2 badge badge-warning"
      : "ml-2 badge badge-danger";

  let htmlTag = `
        <ul>
          <li>
              <div>
                  <h6 class="title" style = "${textLine}">${dataFromApi.name}
                      <span class="${priorityBadge}">
                      ${
                        dataFromApi.priority === 2
                          ? "high"
                          : dataFromApi.priority === 1
                          ? "medium"
                          : "low"
                      }
                      </span>   
                  </h6>
                  <p class="description">${dataFromApi.description}</p>
              </div>
              <div>
              <button class="btn btn-success" style = "${buttonHide}" onclick="todoTaskCompleted('${dataFromApi._id}','${dataFromApi.name}','${dataFromApi.priority}','${dataFromApi.description}')"><i class="fas fa-check"></i></i></button>
              <button class="btn btn-warning" style = "${buttonHide}" onclick="editTodoDetails('${dataFromApi._id}')"><i class="fas fa-pencil"></i></i></button>
              <button class="btn btn-danger" onclick="deleteTodoDetails('${dataFromApi._id}')"><i class="far fa-trash-alt"></i></button>
              </div>
          </li>
        <ul>
        `;

  document
    .getElementById("lecture-list")
    .insertAdjacentHTML("beforeend", htmlTag);
}

//async function to GET the data from api
async function fetchTodoApi() {
  try {
    const response = await fetch(url, {
      method: "GET",
      Headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dataFromApi = await response.json();
    dataFromApi.forEach((element) => {
      todoList(element);
    });
    // console.log(dataFromApi);
  } catch (error) {
    console.log(error);
  }
}
fetchTodoApi();

//function to POST the data to the api
async function addTodoDetails(event) {
  event.preventDefault();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: taskName.value,
      priority: priority.value,
      description: description.value,
    }),
  });
  const data = await response.json();
  todoList(data);
  taskName.value = "";
  description.value = "";
}

//function to DELETE the Api data
async function deleteTodoDetails(id) {
  const response = await fetch(url + id, {
    method: "DELETE",
  });
  const data = await response.json();
  alert(`Are you sure you want to delete ${data.message}?`);

  //refresh the page
  location.reload();
}

//edit list by id but we need to provide the info in the input section
async function editTodoDetails(id) {
  const response = await fetch(url + id, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: taskName.value,
      priority: priority.value,
      description: description.value,
    }),
  });
  const data = await response.json();
  // console.log(data);
  location.reload();
}

//change status to completed
async function todoTaskCompleted(id, name, priority, description) {
  const response = await fetch(url + id, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      priority: priority,
      description: description,
      completed: true,
    }),
  });
  const data = await response.json();
  // console.log(data);
  location.reload()
}
