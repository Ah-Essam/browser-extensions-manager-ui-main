let modeBtn = document.getElementById("mode");
let cardsContainer = document.querySelector(".cards");
let dark = false;
let darkStatus = localStorage.getItem("dark");

if (!darkStatus) {
  localStorage.setItem("dark", false);
}

function setMode() {
  if (JSON.parse(darkStatus) == true) {
    document.body.className = "dark";
  } else {
    document.body.className = "light";
  }
}

modeBtn.addEventListener("click", () => {
  dark = !dark;
  localStorage.setItem("dark", dark);
  darkStatus = localStorage.getItem("dark");
  setMode();
});
setMode();

let filter = "all";

let btns = document.querySelectorAll(".btns .btn");
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.innerHTML;
    getData();
  });
});

async function getData() {
  cardsContainer.innerHTML = ``;
  let response = await fetch("data.json");
  let result = await response.json();
  result.forEach((element) => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="info">
        <img src=${element.logo} />
        <div class="text">
          <h3>${element.name}</h3>
          <p>
            ${element.description}
          </p>
        </div>
      </div>
      <div class="events">
        <button class="btn remove">Remove</button>
        <label class="switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
    `;
    if (!localStorage.getItem(element.name)) {
      localStorage.setItem(element.name, element.isActive);
    }
    let removeStatus = localStorage.getItem(`${element.name}.removed`);

    if (!removeStatus) {
      localStorage.setItem(`${element.name}.removed`, false);
    }

    cardsContainer.append(card);

    let switcher = card.querySelector(".switch input");
    let switcherStatus = JSON.parse(localStorage.getItem(element.name));
    switcher.checked = switcherStatus;
    switcher.addEventListener("click", () => {
      localStorage.setItem(element.name, !switcherStatus);
      switcherStatus = !switcherStatus;
      switcher.checked = switcherStatus;
    });

    if (JSON.parse(removeStatus) === true) {
      card.remove();
    }

    let removeBtn = card.querySelector(".remove");
    removeBtn.addEventListener("click", () => {
      localStorage.setItem(`${element.name}.removed`, true);
      card.remove();
    });

    if (filter == "Active" && switcherStatus != true) {
      card.remove();
    } else if (filter == "Inactive" && switcherStatus != false) {
      card.remove();
    }
  });
}
getData();
