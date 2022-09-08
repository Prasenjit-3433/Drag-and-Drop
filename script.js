const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;
let parentColumn;
let currentColumn;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  for (i=0; i < listArrays.length; i++) {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(listArrays[i]));
  }
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  // Append 
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 0, progressItem, index);
  });
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 0, completeItem, index);
  });
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 0, onHoldItem, index);
  });
  // Run getSavedColumns only once, Update Local Storage


}

// When Item Starts Draging
function drag(event) {
  draggedItem = event.target;
  parentColumn = draggedItem.parentElement.dataset.column;
  console.log(draggedItem);
}

// Column Allows for Item to Drop
function allowDrop(event) {
  event.preventDefault();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  listColumns[column].classList.add('over');
  listColumns[parentColumn].classList.add('over');
  currentColumn = column;
}

// Dropping Item in Column
function drop(event) {
  event.preventDefault();
  // Remove Background Color/Padding
  listColumns[currentColumn].classList.remove('over');
  listColumns[parentColumn].classList.remove('over');
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
}

// On Load
updateDOM();