async function detectSpam() {
  const input = document.getElementById("emailInput").value;
  const resultBox = document.getElementById("resultBox");
  resultBox.innerHTML = "Analyzing...";

  const response = await fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: input })
  });

  const data = await response.json();
  if (response.ok) {
    const color = data.prediction === "Spam" ? "text-red-500" : "text-green-500";
    resultBox.innerHTML = `
      Prediction: <span class="${color}">${data.prediction}</span><br/>
      Confidence: <span class="${color}">${data.confidence}</span>
    `;
  } else {
    resultBox.innerHTML = `Error: ${data.error}`;
  }
}

function toggleDarkMode() {
  const root = document.documentElement;
  const btn = document.getElementById("toggleBtn");

  root.classList.toggle("dark");

  if (root.classList.contains("dark")) {
    btn.textContent = "Light Mode";
  } else {
    btn.textContent = "Dark Mode";
  }
}

function loadFromFile(event) {
  const file = event.target.files[0];
  if (file && file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("emailInput").value = e.target.result;
    };
    reader.readAsText(file);
  } else {
    alert("Please upload a valid .txt file.");
  }
}

function clearInput() {
  document.getElementById("emailInput").value = "";
  document.getElementById("resultBox").innerHTML = "";
}
