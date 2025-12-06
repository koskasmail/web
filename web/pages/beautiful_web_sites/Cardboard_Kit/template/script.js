function scrollToId(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Simple answer key
const answerKey = { q1: "A", q2: "B", q3: "B" };

function submitQuiz() {
    const form = document.getElementById("quiz-form");
    const data = new FormData(form);
    let score = 0, total = 0, missing = [];

    for (const key of Object.keys(answerKey)) {
        total++;
        const given = data.get(key);
        if (!given) missing.push(key);
        else if (given === answerKey[key]) score++;
    }

    const resultEl = document.getElementById("result");
    resultEl.className = "result"; // reset classes

    if (missing.length) {
        resultEl.textContent = `You skipped ${missing.length} question(s). Fill them in and try again.`;
        resultEl.style.display = "block";
        return;
    }

    const pct = Math.round((score / total) * 100);
    let tone = "ok";
    let msg = "";

    if (pct >= 80) {
        tone = "good";
        msg = `Nice work! You scored ${score}/${total} (${pct}%). Your cardboard instincts are solid.`;
    } else if (pct >= 50) {
        tone = "ok";
        msg = `Not bad—${score}/${total} (${pct}%). Notice how texture + tiny imperfections sell the feel.`;
    } else {
        tone = "bad";
        msg = `You got ${score}/${total} (${pct}%). Peek at the details above: matte fibers, dashed lines, slight tilt.`;
    }

    resultEl.classList.add(tone);
    resultEl.textContent = msg;
    resultEl.style.display = "block";
}

function resetResult() {
    const resultEl = document.getElementById("result");
    resultEl.style.display = "none";
    resultEl.className = "result";
    resultEl.textContent = "";
}
