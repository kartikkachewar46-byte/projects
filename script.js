let display = document.getElementById("display");

/* SWITCH */
function show(id) {
  document.querySelectorAll(".box").forEach(b => b.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* CURSOR INSERT */
function press(val) {
  let start = display.selectionStart;
  let end = display.selectionEnd;

  let text = display.value;

  display.value = text.slice(0, start) + val + text.slice(end);

  display.setSelectionRange(start + val.length, start + val.length);
  display.focus();
}

/* CLEAR BASIC */
function clearDisplay() {
  display.value = "";
}

/* CALCULATE */
function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Error";
  }
}

/* AGE */
function calcAge() {
  let b = new Date(document.getElementById("birth").value);
  let t = new Date();

  let age = t.getFullYear() - b.getFullYear();

  document.getElementById("ageResult").innerText =
    "Your Age: " + age;
}

function clearAge() {
  document.getElementById("birth").value = "";
  document.getElementById("ageResult").innerText = "";
}

/* SALARY */
function calcSalary() {
  let basic = parseFloat(document.getElementById("basicSalary").value);

  let hra = basic * 0.2;
  let da = basic * 0.1;
  let ta = basic * 0.05;

  let gross = basic + hra + da + ta;

  document.getElementById("salaryResult").innerText =
    "HRA: " + hra +
    " | DA: " + da +
    " | TA: " + ta +
    " | Gross: " + gross;
}

function clearSalary() {
  document.getElementById("basicSalary").value = "";
  document.getElementById("salaryResult").innerText = "";
}