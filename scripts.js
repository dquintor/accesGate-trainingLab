/***********************
 * CORE LOGIC 
 ***********************/

function isAdult(user) {
  return user.age >= 18;
}


function calculateRiskScore(user) {
  let score = 0;

  if (user.availableHours < 2) score++;
  if (user.role === "visitor") score++;
  if (user.age >= 18 && user.age <= 20) score++;
  if (user.role === "coder" && user.availableHours >= 4) score--;

  return Math.max(score, 0);
}

function finalDecision(user, riskScore) {
  if (!isAdult(user)) {
    return { decision: "denied", reason: "User is not an adult" };
  }

  if (!user.acceptedRules) {
    return { decision: "denied", reason: "Rules were not accepted" };
  }

  const validRoles = ["coder", "tutor", "visitor"];
  if (!validRoles.includes(user.role)) {
    return { decision: "denid", reason: "Invalid role" };
  }

  if (riskScore >= 2) {
    return { decision: "review", reason: "High risk score" };
  }

  return { decision: "allowed", reason: "All checks passed" };
}

/***********************
 * DOM + FLOW 
 ***********************/

const form = document.getElementById("checkin-form");
const output = document.getElementById("output");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const user = {
    fullName: document.getElementById("fullName").value.trim(),
    age: Number(document.getElementById("age").value),
    role: document.getElementById("role").value.toLowerCase(),
    acceptedRules: document.getElementById("acceptRules").checked,
    availableHours: Number(document.getElementById("hours").value)
  };

  console.log("User Object:", user);

  if (
    !user.fullName ||
    isNaN(user.age) ||
    user.availableHours < 1 ||
    user.availableHours > 12
  ) {
    output.className = "alert alert-danger";
    output.textContent = "Please complete all fields with valid values.";
    return;
  }

  const riskScore = calculateRiskScore(user);
  const result = finalDecision(user, riskScore);

  const styles = {
    allowed: "alert alert-success",
    review: "alert alert-warning",
    denied: "alert alert-danger"
  };

  output.className = styles[result.decision];
  output.innerHTML = `
    <strong>Decision:</strong> ${result.decision}<br>
    <strong>Risk score:</strong> ${riskScore}<br>
    <strong>Reason:</strong> ${result.reason}
  `;

  console.log("Risk Score:", riskScore);
  console.log("Final Decision:", result.decision);
});
