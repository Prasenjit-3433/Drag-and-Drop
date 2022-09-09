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

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let parentColumn;
let currentColumn;


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
  for (let i=0; i < listArrays.length; i++) {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(listArrays[i]));
  }
}

// Filter Array to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
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
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if blank, or update Array value
function updateItem(idOfItem, column) {
  const selectedArray = listArrays[column];
  const selectedColumnElement = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnElement[idOfItem].textContent) {
      delete selectedArray[idOfItem];
    }else {
      selectedArray[idOfItem] = selectedColumnElement[idOfItem].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {

  // Reset arrays before adding data from DOM into them
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];

  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();
}

// When Item Starts Draging
function drag(event) {
  draggedItem = event.target;
  parentColumn = draggedItem.parentElement.dataset.column;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(event) {
  event.preventDefault();
}

// When Item Enters Column Area
function dragEnter(column) {
  // Each time remove Background Color/Padding from all columns before adding color
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });

  // Then add Background Color/Padding to Parent element, Current Element 
  listColumns[column].classList.add('over');
  listColumns[parentColumn].classList.add('over');
  currentColumn = column;
}

// Dropping Item in Column
function drop(event) {
  event.preventDefault();
  // Remove Background Color/Padding from Parent element, Current Element 
  listColumns[currentColumn].classList.remove('over');
  listColumns[parentColumn].classList.remove('over');
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging Complete
  dragging = false;

  // Update global arrays
  rebuildArrays();
}

// On Load
updateDOM();