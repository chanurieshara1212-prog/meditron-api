import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/predict-mews", (req, res) => {

    const { rr, spo2, pulse, bp, temp, conscious } = req.body;

    let score = 0;
    let reasons = [];

    // Respiratory Rate
    if (rr > 30 || rr < 8) { score+=3; reasons.push("Abnormal respiratory rate"); }
    else if (rr > 24) { score+=2; }

    // SpO2
    if (spo2 < 90) { score+=3; reasons.push("Severe hypoxia"); }
    else if (spo2 < 94) { score+=2; }
    else if (spo2 < 96) { score+=1; }

    // Pulse
    if (pulse > 130 || pulse < 40) { score+=3; reasons.push("Critical heart rate"); }
    else if (pulse > 110) { score+=2; }
    else if (pulse > 90) { score+=1; }

    // BP
    if (bp < 90) { score+=2; reasons.push("Low blood pressure"); }

    // Temperature
    if (temp > 38) { score+=1; reasons.push("Fever"); }
    if (temp < 35) { score+=2; reasons.push("Hypothermia"); }

    // Consciousness
    if (conscious !== "A") { score+=2; reasons.push("Reduced consciousness"); }

    let risk = "NORMAL";
    let action = "Routine monitoring";

    if(score >= 7){
        risk="HIGH";
        action="URGENT: Immediate medical attention";
    }else if(score >=5){
        risk="MEDIUM";
        action="Close monitoring required";
    }else if(score >=1){
        risk="LOW";
        action="Observe patient";
    }

    res.json({
        reply:`Risk: ${risk}
Score: ${score}
Reason: ${reasons.join(", ") || "Vitals normal"}
Action: ${action}`,
        score: score
    });

});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});