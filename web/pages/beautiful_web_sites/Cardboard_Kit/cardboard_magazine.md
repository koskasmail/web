<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cardboard UI — Nav + Test</title>
  <style>
    /* ========= Base: cardboard vibe ========= */
    :root {
      --cardboard: #c7a979;
      --cardboard-dark: #a58557;
      --ink: #2b251b;
      --marker: #1f1a13;
      --tape: #d9d2c5;
      --accent: #6f4f28;
      --red: #b34b3c;
      --green: #4b7d3c;
      --blue: #3c5b8f;
    }

    /* Handwritten-ish font fallback */
    body {
      font-family: "Patrick Hand", "Comic Sans MS", "Segoe Print", "Bradley Hand", cursive;
      margin: 0;
      color: var(--ink);
      /* Layered gradients to fake cardboard fibers + uneven tone */
      background:
        radial-gradient(1200px 800px at 10% 20%, rgba(255,255,255,0.08), transparent 70%),
        radial-gradient(800px 600px at 90% 80%, rgba(0,0,0,0.08), transparent 65%),
        repeating-linear-gradient(5deg, rgba(0,0,0,0.03) 0 6px, transparent 6px 12px),
        linear-gradient(180deg, #d2b587, #c7a979 50%, #b89360);
      min-height: 100vh;
      /* Inset shadows for “sheet” feel */
      box-shadow: inset 0 0 80px rgba(0,0,0,0.18);
    }

    /* Subtle texture noise using shadow speckles */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        radial-gradient(circle at 30% 40%, rgba(0,0,0,0.04) 0 1px, transparent 1px),
        radial-gradient(circle at 70% 60%, rgba(0,0,0,0.035) 0 1px, transparent 1px);
      background-size: 120px 120px, 180px 180px;
      mix-blend-mode: multiply;
      opacity: 0.6;
    }

    /* ========= Header “label” strip ========= */
    header {
      position: sticky;
      top: 0;
      z-index: 5;
      padding: 18px 20px;
      background:
        repeating-linear-gradient(180deg, var(--tape) 0 18px, #cdc6b9 18px 36px);
      border-bottom: 2px dashed rgba(0,0,0,0.2);
      box-shadow:
        0 6px 0 rgba(0,0,0,0.08),
        inset 0 -10px 30px rgba(0,0,0,0.12);
      transform: rotate(-0.2deg);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 0.5px;
      font-size: 1.4rem;
      color: var(--marker);
    }

    .brand::before {
      content: "";
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #6b6b6b 0 4px, #2c2c2c 4px 9px, #0000 9px);
      box-shadow: 0 2px 0 rgba(0,0,0,0.4);
      transform: rotate(3deg);
    }

    /* ========= Nav tabs like taped tags ========= */
    nav {
      display: flex;
      gap: 12px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    .tab {
      position: relative;
      background: #e2d9cc;
      color: var(--marker);
      padding: 10px 14px;
      border-radius: 4px;
      border: 1px dashed rgba(0,0,0,0.35);
      box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
      text-decoration: none;
      transform: rotate(-0.8deg);
      transition: transform 160ms ease, box-shadow 160ms ease;
    }

    .tab:hover {
      transform: rotate(-0.2deg) translateY(-1px);
      box-shadow: 3px 3px 0 rgba(0,0,0,0.26);
    }

    .tab::after {
      content: "";
      position: absolute;
      top: -8px;
      left: 10px;
      width: 28px;
      height: 12px;
      background: linear-gradient(180deg, #f3f1ec, #d9d2c5);
      border: 1px solid rgba(0,0,0,0.15);
      transform: rotate(6deg);
      box-shadow: 0 1px 0 rgba(0,0,0,0.2);
    }

    /* ========= Main cardboard panels ========= */
    .container {
      max-width: 980px;
      margin: 26px auto 40px;
      padding: 0 16px;
    }

    .panel {
      background:
        linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.06)),
        linear-gradient(180deg, #caa977, #c29b68);
      border: 2px solid rgba(0,0,0,0.15);
      border-radius: 6px;
      box-shadow:
        4px 4px 0 rgba(0,0,0,0.22),
        inset 0 0 45px rgba(0,0,0,0.14);
      padding: 18px;
      margin-bottom: 18px;
      transform: rotate(0.4deg);
    }

    .panel h2 {
      margin: 0 0 8px;
      color: var(--accent);
      letter-spacing: 0.5px;
    }

    /* Divider drawn like pencil line */
    .divider {
      height: 1px;
      background: repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 8px, transparent 8px 14px);
      margin: 10px 0 16px;
      transform: rotate(-0.3deg);
    }

    /* ========= Buttons: duct tape/marker ========= */
    .btn {
      display: inline-block;
      background: linear-gradient(180deg, #f0eee9, #dcd7cb);
      color: var(--marker);
      padding: 10px 14px;
      border: 1px solid rgba(0,0,0,0.2);
      border-radius: 6px;
      box-shadow: 2px 2px 0 rgba(0,0,0,0.22);
      text-decoration: none;
      cursor: pointer;
      transform: rotate(-0.6deg);
      transition: transform 140ms ease, box-shadow 140ms ease;
    }
    .btn:hover {
      transform: rotate(0deg) translateY(-1px);
      box-shadow: 3px 3px 0 rgba(0,0,0,0.28);
    }
    .btn.primary {
      background: linear-gradient(180deg, #e9e5d9, #cfc7b6);
      border-style: dashed;
    }

    /* ========= Quiz sheet ========= */
    .quiz-item {
      padding: 10px 12px;
      margin: 8px 0;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.05)),
        linear-gradient(180deg, #d1b387, #c7a979);
      border: 1px dashed rgba(0,0,0,0.25);
      border-radius: 5px;
      transform: rotate(0.3deg);
    }

    .quiz-item label {
      display: block;
      margin-bottom: 8px;
    }

    .options {
      display: grid;
      gap: 6px;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 4px;
      transition: background 120ms ease;
    }
    .option:hover {
      background: rgba(0,0,0,0.06);
    }

    input[type="radio"] {
      accent-color: #7c5a33;
      transform: rotate(-1deg);
    }

    /* ========= Result sticky note ========= */
    .result {
      display: none;
      margin-top: 14px;
      padding: 12px 14px;
      max-width: 420px;
      background:
        repeating-linear-gradient(180deg, #ffe9a8 0 22px, #ffd97a 22px 44px);
      border: 1px solid rgba(0,0,0,0.25);
      border-radius: 6px;
      box-shadow: 3px 3px 0 rgba(0,0,0,0.22);
      transform: rotate(-0.8deg);
    }
    .result.good { outline: 3px solid rgba(75,125,60,0.35); }
    .result.ok   { outline: 3px solid rgba(60,91,143,0.35); }
    .result.bad  { outline: 3px solid rgba(179,75,60,0.35); }

    /* ========= Footer kraft tape ========= */
    footer {
      margin-top: 24px;
      padding: 14px 18px;
      background:
        linear-gradient(180deg, #e5dfd3, #cbc4b6);
      border-top: 2px dashed rgba(0,0,0,0.2);
      box-shadow: inset 0 10px 25px rgba(0,0,0,0.12);
      transform: rotate(0.2deg);
    }

    /* Small screen tweaks */
    @media (max-width: 600px) {
      .brand { font-size: 1.2rem; }
      .container { padding: 0 12px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Cardboard Kit</div>
    <nav aria-label="Main">
      <a href="#home" class="tab">Home</a>
      <a href="#about" class="tab">About</a>
      <a href="#quiz" class="tab">Quiz</a>
    </nav>
  </header>

  <main class="container">
    <section id="home" class="panel" aria-labelledby="home-title">
      <h2 id="home-title">Welcome</h2>
      <div class="divider"></div>
      <p><strong>Note:</strong> This whole interface is styled to feel like it’s sketched on cardboard—rough fibers, penciled lines, and taped tags. Imperfections are deliberate.</p>
      <p><strong>Tip:</strong> Try the navigation above; each tab feels like a taped label. Hover to see subtle tilt changes.</p>
      <button class="btn primary" onclick="scrollToId('quiz')">Jump to quiz</button>
    </section>

    <section id="about" class="panel" aria-labelledby="about-title">
      <h2 id="about-title">About this look</h2>
      <div class="divider"></div>
      <ul>
        <li><strong>Texture:</strong> Layered gradients mimic cardboard fibers and scuffs.</li>
        <li><strong>Edges:</strong> Inset shadows give a sheet-of-cardboard feel.</li>
        <li><strong>Tape tabs:</strong> Nav items look like masking tape labels with a “pushpin” dot.</li>
        <li><strong>Ink lines:</strong> Dashed borders + slight rotations emulate hand-drawn edges.</li>
      </ul>
    </section>

    <section id="quiz" class="panel" aria-labelledby="quiz-title">
      <h2 id="quiz-title">Quick cardboard quiz</h2>
      <div class="divider"></div>

      <form id="quiz-form">
        <div class="quiz-item">
          <label for="q1"><strong>Q1:</strong> Corrugated cardboard typically has a fluted inner layer between flat liners. What’s the benefit?</label>
          <div class="options">
            <label class="option">
              <input type="radio" name="q1" value="A" /> Better cushioning and rigidity
            </label>
            <label class="option">
              <input type="radio" name="q1" value="B" /> Makes it waterproof by default
            </label>
            <label class="option">
              <input type="radio" name="q1" value="C" /> Enhances color printing
            </label>
          </div>
        </div>

        <div class="quiz-item">
          <label for="q2"><strong>Q2:</strong> Which finish best matches a “cardboard” aesthetic for UI?</label>
          <div class="options">
            <label class="option">
              <input type="radio" name="q2" value="A" /> High-gloss glassmorphism
            </label>
            <label class="option">
              <input type="radio" name="q2" value="B" /> Matte, fibrous textures with dashed lines
            </label>
            <label class="option">
              <input type="radio" name="q2" value="C" /> Neon gradients with blur
            </label>
          </div>
        </div>

        <div class="quiz-item">
          <label for="q3"><strong>Q3:</strong> What small detail helps sell the “handmade” feel?</label>
          <div class="options">
            <label class="option">
              <input type="radio" name="q3" value="A" /> Perfectly straight edges
            </label>
            <label class="option">
              <input type="radio" name="q3" value="B" /> Slight rotations and dashed borders
            </label>
            <label class="option">
              <input type="radio" name="q3" value="C" /> Monospaced fonts everywhere
            </label>
          </div>
        </div>

        <div style="margin-top: 10px;">
          <button type="button" class="btn" onclick="submitQuiz()">Check answers</button>
          <button type="reset" class="btn" style="margin-left:8px;" onclick="resetResult()">Reset</button>
        </div>
      </form>

      <div id="result" class="result" role="status" aria-live="polite"></div>
    </section>

    <footer>
      <p><strong>Reminder:</strong> Imperfections make it feel real—embrace the tilt, the texture, the sketched lines.</p>
    </footer>
  </main>

  <script>
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
  </script>
</body>
</html>
