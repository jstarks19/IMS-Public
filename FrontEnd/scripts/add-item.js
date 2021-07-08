let selector = document.querySelector(".selector");
let currOption;

// Generate Product Form
function createProductForm() {
  let form = document.createElement("form");
  form.classList.add("dynamic-form");
  form.id = "product-form";

  // inputLabel(name, id, placeholder, label)
  let group = createInputLabel("group", "group", "HTL", "Group");
  let series = createInputLabel("series", "series", "9", "Series");
  let rowOne = wrapInDiv("inp-2", group, series);

  let sns = createInputLabel("serialStart", "serialStart", "001", "SN Start");
  let sne = createInputLabel("serialEnd", "serialEnd", "003", "SN End");
  let qty = createInputLabel("quantity", "quantity", "3", "Qty.");
  qty.children[1].type = "number";

  let rowTwo = wrapInDiv("inp-3", sns, sne, qty);

  let dos = createInputLabel("dateEntry", "dateEntry", "", "Assoc. Date");
  dos.children[1].type = "date";
  let aos = createInputLabel("amtOfSale", "amtOfSale", "", "Amount of Sale");
  aos.children[1].placeholder = "$";
  let rowThree = wrapInDiv("inp-2", dos, aos);

  let divDesc = createDescLabel();

  form.append(rowOne, rowTwo, rowThree, divDesc); //, sns, sne, qty, dos, aos,);

  return form;
}

// Generate Inventory Form
function createInventoryForm() {
  let form = document.createElement("form");
  form.classList.add("dynamic-form");
  form.id = "inventory-form";

  // inputLabel(name, id, placeholder, label)
  let itemName = createInputLabel("itemName", "itemName", "Heat Trace", "Item Name");
  let sn = createInputLabel("serialNumber", "serialNumber", "A123456", "Serial Number");
  let rowOne = wrapInDiv("inp-2", itemName, sn);

  let dos = createInputLabel("dateEntry", "dateEntry", "", "Assoc. Date");
  dos.children[1].type = "date";

  let qty = createInputLabel("quantity", "quantity", "0", "Qty.");
  qty.children[1].type = "number";
  
  
  let rowTwo = wrapInDiv("inp-2", dos, qty);



  let divDesc = createDescLabel();

  form.append(rowOne, rowTwo, divDesc); //, sns, sne, qty, dos, aos,);

  return form;
}

// Event Listener
//     - Changes form on Add Item page to either Product or Inventory

selector.addEventListener("click", (evt) => {
  if (!evt.target.classList.contains("selected") && evt.target.classList.contains("selection")) {
    let [child1, child2] = selector.children;

    let addItem = document.querySelector(".add-item-footer #add-item button");

    if (child1 === evt.target) {
      addForm("Product");
      addItem.innerText = "Add Product";
    } else {
      addForm("Inventory");
      addItem.innerText = "Add Inventory";
    }

    child1.classList.toggle("selected");
    child2.classList.toggle("selected");
  }
});

// Create Input Label
//  given attributes name, id, placeholder, and the text for the label
//  this function creates an input with the label attatched w/ class "label-w-input"
function createInputLabel(name, id, placeholder, label) {
  let div = document.createElement("div");
  div.classList.add("label-w-input");

  let nameInp = document.createElement("input");
  nameInp.type = "text";
  nameInp.name = name;
  nameInp.id = id;
  nameInp.placeholder = placeholder;
  nameInp.classList.add("form-inp");

  let nameLab = document.createElement("label");
  nameLab.for = id;
  nameLab.innerText = label;

  div.append(nameLab);
  div.append(nameInp);

  return div;
}

function createDescLabel() {
  let divDesc = document.createElement("div");
  divDesc.classList.add("itemDescription");

  let desc = document.createElement("textarea");
  desc.style.resize = "none";
  desc.name = "itemDescription";
  desc.id = "itemDescription";
  desc.placeholder = "Description..."
  desc.classList.add("form-inp");

  let labelDesc = document.createElement("label");
  labelDesc.for = "itemDescription";
  labelDesc.innerText = "Item Description";
  

  divDesc.append(labelDesc);
  divDesc.append(desc);
  return divDesc;
}

// Add Form
//  given the type of 'Product' or 'Inventory'
//     - it removes the older form and adds the new one to the container
function addForm(type) {
  let currForm = document.querySelector(".form-container");

  if (currForm.children.length > 1) {
    let currChild = currForm.children[1];
    currChild.remove();
  }

  switch (type) {
    case "Product":
      currForm.append(createProductForm());
      break;
    case "Inventory":
      currForm.append(createInventoryForm());
      break;
  }
  currOption = type;
}

function wrapInDiv(divClass, ...elemsToAdd) {
  let newDiv = document.createElement("div");
  newDiv.classList.add(divClass);
  newDiv.append(...elemsToAdd);
  return newDiv;
}

let btnAddItem = document.querySelector("#add-item");
btnAddItem.addEventListener("click", async () => {
  let formInputs = document.querySelectorAll(".form-inp");
  let inpObject = {};
  for (let inp of formInputs) {
    inpObject[inp.name] = inp.value;
  }

  if (currOption === "Product") {
    // PRODUCT


    const { group, series, serialStart, serialEnd, quantity, dateEntry, amtOfSale, itemDescription } = inpObject;

    let objToSend = {
      serials: [serialStart, serialEnd],
      group,
      series,
      quantity,
      dateEntry,
      amountOfSale: amtOfSale,
      description: itemDescription,
    };

    try {
      const resp = await postData(objToSend, "products");

      if (resp.status === 200) {
        console.log(`%c${resp}`, "color:green");
        popup("Product", true);
      } else {
        console.log(`%c${resp}`, "color:red");
        popup("Product", false);
        window.location.replace('../index.html');
      }
    } catch (err) {
      console.log(err);
    }
  } else {

    const { itemName, serialNumber, dateEntry, quantity, itemDescription } = inpObject;

    let objToSend = {
      name: itemName,
      serial: serialNumber,
      quantity,
      dateEntry,
      description: itemDescription,
    };

    try {
      const resp = await postData(objToSend, "inventory");
      if (resp.status === 200) {
        console.log(`%c${resp}`, "color:green");
        popup("Inventory", true);
      } else {
        console.log(`%c${resp}`, "color:red");
        popup("Inventory", false);
        window.location.replace('../index.html');
      }
    } catch (err) {
      console.log(err);
    }
  }
});

function deletePop() {
  document.querySelector(".popup").remove();
}

function popup(type, success) {
  const div = document.createElement("div");
  div.classList.add("popup");
  div.classList.add(success ? "popup-success" : "popup-error");

  const span = document.createElement("span");
  span.innerText = success ? "SUCCESSFULLY ADDED ITEM" : "ERROR ADDING ITEM";
  div.append(span);

  document.querySelector("body").append(div);
  setTimeout(deletePop, 2000);
  addForm(type);
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
// Product is the Default
addForm("Product");
// https://aerico-ims.dev/api/${route}