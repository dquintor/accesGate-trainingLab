/***********************
 * VALIDATION HELPERS
 ***********************/

function validateName(name) {
  const trimmed = name.trim();
  if (trimmed.length > 0) {
    return { valid: true, value: trimmed };
  }
  return { valid: false, message: "Name cannot be empty. Please enter your name." };
}

function validateNumber(number) {
  const normalized = Number(number);
  if (isNaN(normalized)) {
    return { valid: false, message: "Invalid number. Please enter a valid number." };
  }
  return { valid: true, value: normalized };
}

function validateRole(role) {
  const normalized = role.trim().toLowerCase();
  const validRoles = ["coder", "tutor", "visitor"];
  if (validRoles.includes(normalized)) {
    return { valid: true, value: normalized };
  }
  return {
    valid: false,
    message: "Invalid role. Please enter: coder / tutor / visitor."
  };
}

function validateHoursAvailable(hours) {
  const hoursNum = Number(hours);
  if (hoursNum < 1 || hoursNum > 12) {
    return {
      valid: false,
      message: "Please enter a number between 1 and 12."
    };
  }
  return { valid: true, value: hoursNum };
}

function validateAcceptRules(input) {
  const normalized = input.trim().toLowerCase();
  if (normalized === "yes") return { valid: true, value: true };
  if (normalized === "no") return { valid: true, value: false };
  return {
    valid: false,
    message: "Please answer with yes or no."
  };
}

function promptWithValidation(message, validationFn) {
  while (true) {
    const input = prompt(message);
    const result = validationFn(input);
    if (result.valid) return result.value;
    alert(result.message);
  }
}

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
    return { decision: "DENY", reason: "User is not an adult" };
  }

  if (!user.acceptedRules) {
    return { decision: "DENY", reason: "Rules were not accepted" };
  }

  const validRoles = ["coder", "tutor", "visitor"];
  if (!validRoles.includes(user.role)) {
    return { decision: "DENY", reason: "Invalid role" };
  }

  if (riskScore >= 2) {
    return { decision: "REVIEW", reason: "High risk score" };
  }

  return { decision: "ALLOW", reason: "All checks passed" };
}

/***********************
 * SYSTEM FLOW
 ***********************/

const systemSteps = [
  "Validating data",
  "Calculating risk score",
  "Generating decision"
];

function collectUserInfo() {
  const user = {
    fullName: promptWithValidation("Enter your full name:", validateName),
    age: promptWithValidation("Enter your age:", validateNumber),
    role: promptWithValidation("Enter your role (coder / tutor / visitor):", validateRole),
    acceptedRules: promptWithValidation("Do you accept the lab rules? (yes / no):", validateAcceptRules),
    availableHours: promptWithValidation("How many hours are you available today? (1–12):", validateHoursAvailable
    )
  };

  console.log("User Object:", user);
  alert("Processing your check-in...");

  for (const step of systemSteps) {
    console.log(`Step: ${step}`);
  }

  const riskScore = calculateRiskScore(user);
  const result = finalDecision(user, riskScore);

  console.log("Risk Score:", riskScore);
  console.log("Final Decision:", result.decision);

  if (result.decision === "DENY") {
    alert(
      `ACCESS DENIED\nReason: ${result.reason}\nRole: ${user.role}`
    );
  }

  if (result.decision === "REVIEW") {
    alert(
      `ACCESS UNDER REVIEW\nReason: ${result.reason}\nRole: ${user.role}`
    );
  }

  if (result.decision === "ALLOW") {
    alert(
      `WELCOME TO THE TRAINING LAB\nRole: ${user.role}\nEnjoy your session!`
    );
  }
}

/***********************
 * START SYSTEM
 ***********************/

collectUserInfo();
