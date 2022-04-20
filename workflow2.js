class util {

  static findTarget(evt, targetNode, container) {
    let currentNode = evt.target;
    while (currentNode && currentNode !== container) {  
      if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) { return currentNode; }
      else { currentNode = currentNode.parentNode; }
    }
    return false;
  }

  static sendRequest(url, func, postData) {
 
    const xhr = new XMLHttpRequest();
    if (!xhr) { return; }
    const method = (postData) ? "POST" : "GET";
    xhr.open(method, url, true);
    if (postData) {
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) { return; }
      if (xhr.status !== 200 && xhr.status !== 304) {
        alert('HTTP error ' + xhr.status); return;
      }
      func(xhr);
    }
    if (xhr.readyState === 4) { return; }
    xhr.send(postData);
 
  }

}


class dataTable {

  constructor(theTableRef) {

    this.theTable = document.querySelector(theTableRef);
    this.dataRowHolder = this.theTable.getElementsByTagName('tbody')[0];
    this.dataRows = this.theTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    this.totalCols = this.theTable.rows[0].cells.length;
    this.totalRows = this.theTable.rows.length;
    this.totalDataRows = this.dataRows.length;

  }

  // determining what controls the user has activated/deactivated
  setDisplay(evt) {

    const btn = util.findTarget(evt, 'input', this);

    if (!btn) { return; }
  
    // use button value to determine what to do
    switch(btn.value) {
    
      case 'Hide Low Priority': 
      
        this.theTable.classList.add('hidePriority');
        btn.value = 'Show Low Priority';
        localStorage.setItem('hidePriority', '1');
        break;
      
      case 'Show Low Priority': 
      
        this.theTable.classList.remove('hidePriority');
        btn.value = 'Hide Low Priority';
        localStorage.setItem('hidePriority', '0');
        break;
      
      case 'Highlight Current Row': 
      
        this.theTable.classList.add('allowHighlight');
        btn.value = 'Remove Row Highlight';
        localStorage.setItem('allowHighlight', '1');
        break;
    
      case 'Remove Row Highlight': 
      
        this.theTable.classList.remove('allowHighlight');
        btn.value = 'Highlight Current Row';
        localStorage.setItem('allowHighlight', '0');
        break;
      
      case 'Hide Type Column': 
      
        this.theTable.classList.add('hideColumn');
        btn.value = 'Show Type Column';
        localStorage.setItem('hideColumn', '1');
        break;
      
      case 'Show Type Column':

        this.theTable.classList.remove('hideColumn');
        btn.value = 'Hide Type Column';
        localStorage.setItem('hideColumn', '0');
        break;     
      
    }
  
  }
  
  // highlighting rows based on mouse events, if that setting is enabled
  rowHighlight(evt) {

    const row = util.findTarget(evt, 'tr', this);
    if (!row) { return; }
    row.id = (row.id) ? '' : 'currentRow';
  
  }

  // insert controls
  insertButtons(holder) {

    holder.innerHTML = '<input type="button" name="actionButton" id="hidePriority" value="Hide Low Priority" /> <input type="button" name="actionButton" id="allowHighlight" value="Highlight Current Row" /> <input type="button" name="actionButton" id="hideColumn" value="Hide Type Column" />';

  }

  // request recent changes
  getRecentChanges() {

    util.sendRequest('recent-changes.json?' + Math.random(), this.showRecentChanges);

  }

  // populate recent changes
  showRecentChanges(xhr) {

    const data = JSON.parse(xhr.responseText);
    let str = '<ul>';
 
    for (const change of data.changes) {
      str += '<li><a href="' + change.id + '.html" title="' + change.txt + '">';
      str += change.id + '</a>';
      str += ' (' + change.status + ')</li>';
    }
    
    str += '</ul>';

    // append the recent changes list
    document.getElementById('recentChanges').insertAdjacentHTML('beforeend', str);    

  }

  // restore saved control settings for table
  loadStoredButtonSettings(idVal) {

    const storedSetting = localStorage.getItem(idVal);

    if (storedSetting && storedSetting === '1') {
    
      const btnRef = document.getElementById(idVal);
      
      switch(idVal) {

        case 'hidePriority' :
          btnRef.value = 'Show Low Priority';
          this.theTable.classList.add('hidePriority');
          break;

        case 'allowHighlight' :
          btnRef.value = 'Remove Row Highlight';
          this.theTable.classList.add('allowHighlight');
          break;

        case 'hideColumn' :
          btnRef.value = 'Show Type Column';
          this.theTable.classList.add('hideColumn');
          break;

      }
    
    }

  }

  // restore saved sorting for table
  loadStoredTableSettings() {

    const storedSetting = localStorage.getItem('sortBy');

    if (storedSetting) {
    
      // split apart the value into an array
      // the first position is a number indicating column to sort on
      // the second position is the direction of the sort (up / down)
      const sortDetails = storedSetting.split('-');
       
      // convert string to number for the column index
      sortDetails[0] = parseInt(sortDetails[0]);
       
      // sort the table
      this.sortTable(sortDetails[0], sortDetails[1]);
       
      // display the correct arrow direction
      this.theTable.rows[0].cells[sortDetails[0]].className = sortDetails[1] + 'Arrow';
    
    }
    
    else {
    
      this.sortTable(0, 'up');
      this.theTable.rows[0].cells[0].className = 'upArrow';
      
    }

  }

  // trigger proper appearance for clicked header cells, sort table,
  // and store sorting selection
  toggleArrow(evt) {
  
    const theHdrCell = util.findTarget(evt, 'th', this);
        
    // if no header cell found then stop processing
    if (!theHdrCell) { return; }

    evt.preventDefault();
    
    // set an id on the cell clicked so we can ignore it when we reset the arrow 
    // that is shown for another cell
    theHdrCell.id = 'sortBy';
    
    const theCellIndex = theHdrCell.cellIndex;
   
    switch (theHdrCell.className) {
    
      case '' :    
      case 'downArrow' :
      
        theHdrCell.className = 'upArrow';
        this.sortTable(theCellIndex, 'up');
        localStorage.setItem('sortBy', theCellIndex + '-up');
        break;
    
      case 'upArrow' :
    
        theHdrCell.className = 'downArrow';
        this.sortTable(theCellIndex, 'down');   
        localStorage.setItem('sortBy', theCellIndex + '-down');
    
    }
   
    // remove the up/down array from the other cell
    this.removeOtherArrow();
    
    // remove the id from the cell you clicked
    theHdrCell.id = '';
    
  }
  
  sortTable(columnNumber, sortDirection) {
  
    const dataToSort = [], removedRows = [];
    
    // build the array of cell values and append their current row number to their value
    for (let i=0; i<this.totalDataRows; i++) {
        
      // start from the 1 row rather than the 0 row
      const adjustedRowUp = i + 1;
      dataToSort[i] = this.theTable.rows[adjustedRowUp].cells[columnNumber].innerText + '.' + i;
    
    }
    
    // sort differently for numbers
    if (columnNumber === 0) {
    
      dataToSort.sort(function(num1,num2) {  
        return num1 - num2;
      });
    
    }
    
    else {
      
      // sort the array values in ascending order
      dataToSort.sort();
    
    }
    
    // flip sequence to descending order as necessary
    if (sortDirection === 'down') { 
        
      dataToSort.reverse(); 
    
    }
    
    // remove the rows in the table; populate an array with their values    
    for (let counter=0, allDataRows=dataToSort.length; counter<allDataRows; counter++) {        
        
      removedRows[counter] = this.dataRowHolder.removeChild(this.dataRows[0]);
    
    }
       
    // rebuild the table
    for (let x=0, allDataRows=dataToSort.length; x<allDataRows; x++) {
    
      // extract the original (pre-sort) row number
      const rowNum = dataToSort[x].substring(dataToSort[x].lastIndexOf(".") + 1);
        
      // pull out that row and insert it into the table
      this.dataRowHolder.appendChild(removedRows[rowNum]);
        
    }
  
  }
  
  removeOtherArrow() {
    
    // loop through header cells to remove up/down arrows
    for (let i=0; i<this.totalCols; i++) {
    
      const currentCell = this.theTable.rows[0].cells[i];
      
      // skip the cell that was just clicked
      if (currentCell.id === 'sortBy') { continue; }

      currentCell.classList.remove('downArrow','upArrow');

    }
    
  }

}

// [0] is a node reference to the button holder
// [1] is a node reference to tbody
// [2] is a node reference to thead
const elementRefs = [
  document.querySelector('#actionForm'),
  document.querySelector('#projectsTbl tbody'),
  document.querySelector('#projectsTbl thead')  
];

const openItems = new dataTable('#projectsTbl');

// add the control buttons
openItems.insertButtons(elementRefs[0]);

// request recent changes
openItems.getRecentChanges();

// event listener assignment
elementRefs[0].addEventListener('click', (evt) => openItems.setDisplay(evt), false);
elementRefs[1].addEventListener('mouseover', (evt) => openItems.rowHighlight(evt), false);
elementRefs[1].addEventListener('mouseout', (evt) => openItems.rowHighlight(evt), false);
elementRefs[2].addEventListener('click', (evt) => openItems.toggleArrow(evt), false);

// load previous settings
openItems.loadStoredButtonSettings('hidePriority');
openItems.loadStoredButtonSettings('allowHighlight');    
openItems.loadStoredButtonSettings('hideColumn');
openItems.loadStoredTableSettings();