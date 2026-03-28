import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


// ✅ ROOT ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
    res.send("Meditron API is running 🚀");
});


// ✅ MEWS API
app.post("/predict-mews", (req, res) => {

const { rr, spo2, pulse, bp, temp, conscious } = req.body;

let score = 0;
let reasons = [];

// ✅ Respiratory Rate
if (rr >= 30) { score += 3; reasons.push("High RR"); }
else if (rr >= 21) { score += 2; }
else if (rr >= 12) { score += 0; }
else if (rr >= 9) { score += 2; }
else { score += 3; reasons.push("Critical RR"); }

// ✅ SpO2
if (spo2 <= 90) { score += 3; reasons.push("Severe hypoxia"); }
else if (spo2 <= 93) { score += 2; }
else if (spo2 <= 95) { score += 1; }
else { score += 0; }

// ✅ Pulse
if (pulse > 130) { score += 3; reasons.push("Critical pulse"); }
else if (pulse >= 111) { score += 2; }
else if (pulse >= 91) { score += 1; }
else if (pulse >= 51) { score += 0; }
else if (pulse >= 41) { score += 2; }
else { score += 3; }

// ✅ Blood Pressure
if (bp >= 220) { score += 3; }
else if (bp >= 100) { score += 0; }
else if (bp >= 90) { score += 2; }
else if (bp >= 80) { score += 2; }
else { score += 3; reasons.push("Critical BP"); }

// ✅ Temperature
if (temp > 40) { score += 3; }
else if (temp >= 38) { score += 2; }
else if (temp >= 37) { score += 0; }
else if (temp >= 35) { score += 1; }
else { score += 2; }

// ✅ Consciousness
if (conscious === "A") score += 0;
else if (conscious === "V") score += 1;
else if (conscious === "P") score += 2;
else score += 3;

// ✅ Risk Levels (from PDF)
let risk = "NORMAL";
let action = "Routine monitoring";

if (score >= 7) {
risk = "HIGH";
action = "Emergency response (ICU / MET)";
} else if (score >= 5) {
risk = "MEDIUM";
action = "Urgent doctor review";
} else if (score >= 1) {
risk = "LOW";
action = "Increase monitoring";
}

res.json({
reply: `Risk: ${risk}
Score: ${score}
Reason: ${reasons.join(", ") || "Vitals normal"}
Action: ${action}`,
score: score
});

});


// ✅ IMPORTANT FOR RAILWAY (PORT FIX)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});