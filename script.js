const display = document.getElementById("display");
const preview = document.getElementById("preview");
const historyList = document.getElementById("historyList");

/* =========================
   APPEND
========================= */
function append(value){

  playSound();

  if(display.value === "0"){
    display.value = "";
  }

  const start = display.selectionStart;
  const end = display.selectionEnd;

  display.value =
    display.value.substring(0,start)
    + value
    + display.value.substring(end);

  const cursorPos =
    start + value.length;

  display.focus();

  display.setSelectionRange(
    cursorPos,
    cursorPos
  );

  updatePreview();
}

/* =========================
   BACKSPACE
========================= */
function backspace(){

  const start =
    display.selectionStart;

  const end =
    display.selectionEnd;

  if(start === end && start > 0){

    display.value =
      display.value.slice(0,start-1)
      + display.value.slice(end);

    display.setSelectionRange(
      start-1,
      start-1
    );
  }

  else{

    display.value =
      display.value.slice(0,start)
      + display.value.slice(end);

    display.setSelectionRange(
      start,
      start
    );
  }

  display.focus();

  updatePreview();
}

/* =========================
   CLEAR DISPLAY
========================= */
function clearDisplay(){

  display.value = "";

  preview.innerText = "";

  display.focus();

  display.setSelectionRange(0,0);
}
function clearEntry(){

  display.value = "";

  preview.innerText = "";

  display.focus();

  display.setSelectionRange(0,0);
}
/* =========================
   FACTORIAL
========================= */
function factorial(n){

  if(n < 0) return "Error";

  let result = 1;

  for(let i = 2; i <= n; i++){
    result *= i;
  }

  return result;
}

/* =========================
   TRIG FUNCTIONS
========================= */

function sin(value){
  return Math.sin(value * Math.PI / 180);
}

function cos(value){
  return Math.cos(value * Math.PI / 180);
}

function tan(value){
  return Math.tan(value * Math.PI / 180);
}

/* =========================
   TOGGLE SIGN
========================= */

function toggleSign(){

  try{

    display.value =
      String(eval(display.value) * -1);

    updatePreview();

  }catch{}
}

/* =========================
   CALCULATE
========================= */

function calculate(){

  try{

    let expression = display.value;

    expression = expression.replace(
      /(\d+)!/g,
      (_,n)=>factorial(Number(n))
    );

    expression =
      expression.replace(/%/g,"/100");

    let result = eval(expression);

    result = Number(result.toFixed(10));

    addToHistory(
      display.value + " = " + result
    );

    display.value = result;

    preview.innerText = "";

  }catch{

    display.value = "";

    preview.innerText = "Error";
  }
}

/* =========================
   PREVIEW
========================= */

function updatePreview(){

  try{

    let expression = display.value;

    expression = expression.replace(
      /(\d+)!/g,
      (_,n)=>factorial(Number(n))
    );

    expression =
      expression.replace(/%/g,"/100");

    let result = eval(expression);

    result = Number(result.toFixed(10));

    preview.innerText = result;

  }catch{

    preview.innerText = "";
  }
}

/* =========================
   HISTORY
========================= */

function addToHistory(text){

  const li = document.createElement("li");

  li.textContent = text;

  historyList.prepend(li);
}

function clearHistory(){

  historyList.innerHTML = "";
}

/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
  "keydown",
  (e)=>{

    const allowed =
      "0123456789+-*/.%()";

    if(
      allowed.includes(e.key)
    ){

      e.preventDefault();

      append(e.key);
    }

    else if(e.key === "Enter"){

      e.preventDefault();

      calculate();
    }

    else if(e.key === "Backspace"){

      e.preventDefault();

      backspace();
    }

    else if(e.key === "Escape"){

      clearDisplay();
    }
  }
);

/* =========================
   SETTINGS
========================= */

function toggleSettings(){

  document
    .getElementById("settingsPanel")
    .classList.toggle("show-settings");
}

/* =========================
   SOUND
========================= */

function playSound(){

  const sound =
    document.getElementById("clickSound");

  sound.currentTime = 0;

  sound.play().catch(()=>{});
}

/* =========================
   THEMES
========================= */

function setTheme(theme){

  localStorage.setItem("theme", theme);

  if(theme === "dark"){

    document.body.classList.remove("light");
  }

  else if(theme === "light"){

    document.body.classList.add("light");
  }

  else{

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    if(prefersDark){

      document.body.classList.remove("light");

    }else{

      document.body.classList.add("light");
    }
  }
}

/* =========================
   CLOSE SETTINGS
========================= */

document.addEventListener("click",(e)=>{

  const settings =
    document.getElementById("settingsPanel");

  const settingsBtn =
    document.querySelector(".settings-btn");

  if(
    settings &&
    settingsBtn &&
    !settings.contains(e.target) &&
    !settingsBtn.contains(e.target)
  ){
    settings.classList.remove("show-settings");
  }
});

/* =========================
   ON LOAD
========================= */

window.addEventListener("load",()=>{

  display.focus();

  const savedTheme =
    localStorage.getItem("theme");

  if(savedTheme){

    setTheme(savedTheme);
  }
});