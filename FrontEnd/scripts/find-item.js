
let filterSearchSelected = document.querySelector(".filter-search .selected");
let filterSearch = filterSearchSelected.parentElement;

let filterDisplaySelected = document.querySelector(".filter-display .selected");
let filterDisplay = filterDisplaySelected.parentElement;

let currentCardData = [];
let tab_index = 0;

// Event Listener
//     - Changes form on Add Item page to either Product or Inventory

filterSearch.addEventListener("click", (evt) => {
  if (!evt.target.classList.contains("selected") && evt.target.classList.contains("filter")) {
    let [child1, child2, child3] = filterSearch.children;

    filterSearchSelected.classList.toggle("selected");

    switch (evt.target) {
      case child1:
        filterSearchSelected = child1;
        child1.classList.toggle("selected");
        break;
      case child2:
        filterSearchSelected = child2;
        child2.classList.toggle("selected");
        break;
      case child3:
        filterSearchSelected = child3;
        child3.classList.toggle("selected");
        break;
    }
  }
});

filterDisplay.addEventListener("click", (evt) => {
  if (!evt.target.classList.contains("selected") && evt.target.classList.contains("display-option")) {
    let [child1, child2] = filterDisplay.children;

    filterDisplaySelected.classList.toggle("selected");

    switch (evt.target) {
      case child1:
        filterDisplaySelected = child1;
        child1.classList.toggle("selected");
        break;
      case child2:
        filterDisplaySelected = child2;
        child2.classList.toggle("selected");
        break;
    }

    const cards = document.querySelector("#searchRes");
    cards.classList.toggle("shape-grid");
  }
});

// Models 

// Inventory
  // name: String,
  // serial: String,
  // quantity: Number,
  // date: String,
  // description: String,

// Product
  // group: String,
  // series: String,
  // name: String,
  // serials: [String],
  // quantity: Number,
  // date: String,
  // amountOfSale: Number,
  // description: String,


function constructCard(cardData, type) {
  const toReturn = document.createElement("div");
  toReturn.classList.add("res-card");
  toReturn.classList.add((type === "product") ? "product-card" : "invent-card");

  const cardTop = document.createElement("div");
  cardTop.classList.add("card-top");

  const cardBottom = document.createElement("div");
  cardBottom.classList.add("card-bottom");

  const spanTopTitle = document.createElement("span");
  spanTopTitle.classList.add("card-title");
  spanTopTitle.innerText = (type === "product") ? "PRODUCT" : "INVENTORY";

  const spanTopDate = document.createElement("span");
  spanTopDate.classList.add("item-date"); 
  spanTopDate.innerText = cardData.date;

  const spanBottomName = document.createElement("span");
  spanBottomName.classList.add("item-name");
  spanBottomName.innerText = cardData.name;

  const spanBottomSerial = document.createElement("span");
  spanBottomSerial.classList.add("item-serial");
  spanBottomSerial.innerText = "Serial: " + ((type === "product") ?  cardData.serials[0] : cardData.serial);

  const spanBottomQty = document.createElement("span");
  spanBottomQty.classList.add("item-qty");
  spanBottomQty.innerText = "Qty. x" + cardData.quantity;

  cardTop.append(spanTopTitle, spanTopDate);
  cardBottom.append(spanBottomName, spanBottomSerial, spanBottomQty);

  // Main Div => Card Top, Card Bottom
  toReturn.append(cardTop, cardBottom);
  toReturn.tabIndex = tab_index++;

  toReturn.addEventListener('click', createInfoBox);

  // Final Constructed Card
  return toReturn;
}


function updateCard() {

}


function displaySearchResults(jsonResults) {
  const objToParse = JSON.parse(jsonResults);
  const searchResults = document.querySelector("#searchRes");
  searchResults.innerHTML = "";

  for (let prodData of objToParse.products) {
    currentCardData.push(prodData);
    const newCard = constructCard(prodData, "product");
    searchResults.append(newCard);
  }

  for (let invData of objToParse.inventory) {
    currentCardData.push(invData);
    const newCard = constructCard(invData, "inventory");
    searchResults.append(newCard);
  }
}



let searchBtn = document.querySelector(".search-btn");
searchBtn.addEventListener("click", searchFiltered);



function createInfoForm(cardData, type) {
  console.log(cardData);
  let formToRet = document.createElement('form');
  if (type === 'products') {
    let {group, series, serials, quantity, date, amountOfSale, description} = cardData;
    // Now we add the data to our info box

    // name, id, value, type = "text", label
    
    let groupi  = createInputLabel("group", "fm-group", group, "text", "Group");
    let seriesi = createInputLabel("series", "fm-series", series, "text", "Series");
    let snsi    = createInputLabel("serialStart", "fm-serialStart", serials[0], "text",  "SN Start");
    let snei    = createInputLabel("serialEnd", "fm-serialEnd", serials[1],"text","SN End");
    let qtyi    = createInputLabel("quantity", "fm-quantity", quantity, "number", "Qty.");
    let dosi    = createInputLabel("dateEntry", "fm-dateEntry", date, "date", "Assoc. Date");
    let aosi    = createInputLabel("amtOfSale", "fm-amtOfSale", amountOfSale, "number", "Amount of Sale");


    let rowOne = wrapInDiv("inp-row", groupi, seriesi);
    let rowTwo = wrapInDiv("inp-row", snsi, snei, qtyi);
    let rowThree = wrapInDiv("inp-row", dosi, aosi);
    let divDesc = createDescLabel(description);

    formToRet.append(rowOne, rowTwo, rowThree, divDesc);
    formToRet.classList.add('info-form-pd');

  } else {
    let {name, serial, date, quantity, description} = cardData;
    console.log(cardData);
    // Now we add the data to our info box

    // name, id, value, type = "text", label

    let itemName = createInputLabel("itemName", "fm-itemName", name,"text","Item Name");
    let sn = createInputLabel("serialNumber", "fm-serialNumber", serial, "text", "Serial Number");
    let dos = createInputLabel("dateEntry", "fm-dateEntry", date,  "date", "Assoc. Date");
    let qty = createInputLabel("quantity", "fm-quantity", quantity, "number", "Qty.");

    let rowOne = wrapInDiv("inp-row", itemName, sn);
    let rowTwo = wrapInDiv("inp-row", dos, qty);
    let divDesc = createDescLabel(description);

    formToRet.append(rowOne, rowTwo, divDesc); //, sns, sne, qty, dos, aos,);
    formToRet.classList.add('info-form-in');

  }
  formToRet.classList.add('info-form');
  
  return formToRet;
}

// Create Input Label
//  given attributes name, id, placeholder, and the text for the label
//  this function creates an input with the label attatched w/ class "label-w-input"
function createInputLabel(name, id, value, type = "text", label) {
  let div = document.createElement("div");
  div.classList.add("label-input");
  div.classList.add("label-w-input");


  let nameInp = document.createElement("input");
  nameInp.type = type; // default is text
  nameInp.name = name;
  nameInp.id = id;
  nameInp.classList.add("form-inp");
  nameInp.value = value;

  let nameLab = document.createElement("label");
  nameLab.for = id;
  nameLab.innerText = label;

  div.append(nameLab);
  div.append(nameInp);

  return div;
}

function wrapInDiv(divClass, ...elemsToAdd) {
  let newDiv = document.createElement("div");
  newDiv.classList.add(divClass);
  newDiv.append(...elemsToAdd);
  return newDiv;
}

function createDescLabel(value) {
  let divDesc = document.createElement("div");
  divDesc.classList.add("itemDescription");

  let desc = document.createElement("textarea");
  desc.style.resize = "none";
  desc.name = "itemDescription";
  desc.id = "itemDescription";
  desc.value = value;
  desc.classList.add("form-inp");

  let labelDesc = document.createElement("label");
  labelDesc.for = "itemDescription";
  labelDesc.innerText = "Item Description";
  
  divDesc.append(labelDesc);
  divDesc.append(desc);
  return divDesc;
}

function createInfoBox() {
  const over = document.querySelector('.overlay');
  over.classList.toggle('invisible');
  
  this.focus();

  let ind = this.tabIndex;
  let type = (this.classList[1] === "product-card") ? "products" : "inventory";
  let bgColor = type === 'products' ?   '#3b4a65' : '#3a3e46'; 
  
  let infoDiv = document.createElement("div");
  infoDiv.classList.add('info-div');

  let exitBtn = document.createElement("button");
  exitBtn.classList.add('info-div-exit-btn');
  exitBtn.innerHTML = "&#10005";
  exitBtn.addEventListener('click', removeInfoBox);

  let contentDiv = document.createElement("div");
  contentDiv.classList.add('info-div-content-div');
  console.dir(this);
  contentDiv.style.backgroundColor = bgColor;

  // Content Div : contains all of the data
  const formToAdd = createInfoForm(currentCardData[ind], type);
  contentDiv.append(formToAdd);

  let optionsDiv = document.createElement('div');
  optionsDiv.classList.add('info-div-options-div');

  let updateBtn = document.createElement("button");
  updateBtn.classList.add('info-div-edit-btn');
  updateBtn.innerText = "Update Item";

  updateBtn.addEventListener('click', async function() {
    await updateItem(currentCardData[ind]._id, type);
  });

  let removeBtn = document.createElement("button");
  removeBtn.classList.add('info-div-rmv-btn');
  removeBtn.innerText = "Remove Item";

  removeBtn.addEventListener('click', async function() {
    await removeItem(currentCardData[ind]._id, type);
  });

  optionsDiv.append(updateBtn, removeBtn);
  infoDiv.append(exitBtn, contentDiv, optionsDiv);
  document.querySelector('.main-content').append(infoDiv);
}

function removeInfoBox() {
  document.querySelector('.info-div').remove();
  document.querySelector('.overlay').classList.toggle('invisible');
}


async function searchFiltered() {
  let searchInp = document.querySelector("#search-input");

  const searchVal = searchInp.value;
  const filter = filterSearchSelected.id;

  const result = await fetch(`http://localhost:3000/search?term=${searchVal}&filter=${filter}`, {credentials: "include"});
  if (result.status === 200) {
    const finalRes = await result.json();
    displaySearchResults(finalRes, filter);
  } else {
    window.location.replace('../index.html');
  }
}

// https://aerico-ims.dev/api/search?term=${searchVal}&filter=${filter}


async function updateItem(id, type) {

  const formInputs = (type === "products") ? document.querySelector('.info-form-pd') : document.querySelector('.info-form-in');
  const inpObject = {};
  for (let inp of formInputs) {
    inpObject[inp.name] = inp.value;
  }

  let objToSend = {};

  if (type === 'products') {
    const { group, series, serialStart, serialEnd, quantity, dateEntry, amtOfSale, itemDescription } = inpObject;
    
    objToSend = {
      serials: [serialStart, serialEnd],
      group,
      series,
      quantity,
      date: dateEntry,
      amountOfSale: amtOfSale,
      description: itemDescription,
    };

  } else {
    const { itemName, serialNumber, dateEntry, quantity, itemDescription } = inpObject;

    objToSend = {
      name: itemName,
      serial: serialNumber,
      quantity,
      date: dateEntry,
      description: itemDescription,
    };

  }


  const response = await fetch(`http://localhost:3000/${type}/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(objToSend), // body data type must match "Content-Type" header
  });
  const result = await response.text();


  removeInfoBox();
  searchFiltered();
}

async function removeItem(id, type) {
  // remove item from database
  const response = await fetch(`http://localhost:3000/${type}/${id}`, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });

  const result = await response;

  removeInfoBox();
  searchFiltered();
}

async function postData(data = {}, route) {
  // Default options are marked with *
  const response = await fetch(`http://localhost:3000/${route}`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  
  return response;
}