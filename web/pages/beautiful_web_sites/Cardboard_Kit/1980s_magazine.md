# 1980s magazine vibe

### idea
```
think neon gradients, chunky sans-serif fonts, glossy textures, and geometric accents. Here’s a full HTML/CSS/JS page with navbars and a quiz, styled like a retro magazine spread:
```

#### code
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>80s Magazine UI</title>
  <style>
    /* ====== Base 80s magazine look ====== */
    :root {
      --neon-pink: #ff2aad;
      --neon-blue: #00d9ff;
      --neon-yellow: #ffe600;
      --black: #111;
      --white: #fff;
      --gradient: linear-gradient(135deg, #ff2aad, #00d9ff, #ffe600);
    }

    body {
      margin: 0;
      font-family: "Impact", "Arial Black", sans-serif;
      background: var(--black);
      color: var(--white);
      min-height: 100vh;
      background-image: repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.05) 0 2px,
        transparent 2px 6px
      );
    }

    /* ====== Header ====== */
    header {
      background: var(--gradient);
      padding: 20px;
      text-align: center;
      color: var(--black);
      text-transform: uppercase;
      font-size: 2rem;
      letter-spacing: 2px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    }

    nav {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
    }

    nav a {
      text-decoration: none;
      color: var(--white);
      background: var(--neon-pink);
      padding: 10px 16px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      transition: transform 0.2s ease, background 0.2s ease;
      box-shadow: 0 0 8px var(--neon-pink);
    }

    nav a:hover {
      transform: scale(1.1) rotate(-2deg);
      background: var(--neon-blue);
      box-shadow: 0 0 12px var(--neon-blue);
    }

    /* ====== Panels ====== */
    .container {
      max-width: 900px;
      margin: 30px auto;
      padding: 0 20px;
    }

    .panel {
      background: rgba(255,255,255,0.05);
      border: 2px solid var(--neon-pink);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 0 12px var(--neon-pink);
      position: relative;
    }

    .panel h2 {
      margin-top: 0;
      font-size: 1.8rem;
      color: var(--neon-yellow);
      text-shadow: 2px 2px var(--neon-blue);
    }

    .divider {
      height: 3px;
      background: var(--gradient);
      margin: 12px 0;
    }

    /* ====== Buttons ====== */
    .btn {
      display: inline-block;
      background: var(--neon-blue);
      color: var(--black);
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 0 10px var(--neon-blue);
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .btn:hover {
      transform: scale(1.1);
      background: var(--neon-pink);
      box-shadow: 0 0 12px var(--neon-pink);
    }

    /* ====== Quiz ====== */
    .quiz-item {
      margin-bottom: 16px;
      padding: 12px;
      border: 2px dashed var(--neon-yellow);
      border-radius: 6px;
      background: rgba(255,255,255,0.08);
    }

    .quiz-item label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: var(--neon-blue);
    }

    .options {
      display: grid;
      gap: 8px;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,0,0,0.4);
      padding: 6px 8px;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .option:hover {
      background: rgba(255,255,255,0.1);
    }

    input[type="radio"] {
      accent-color: var(--neon-pink);
    }

    .result {
      display: none;
      margin-top: 14px;
      padding: 12px;
      border-radius: 6px;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
    }

    .result.good { color: var(--neon-yellow); text-shadow: 0 0 8px var(--neon-yellow); }
    .result.ok   { color: var(--neon-blue); text-shadow: 0 0 8px var(--neon-blue); }
    .result.bad  { color: var(--neon-pink); text-shadow: 0 0 8px var(--neon-pink); }

    footer {
      text-align: center;
      padding: 20px;
      background: var(--gradient);
      color: var(--black);
      font-weight: bold;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <header>
    80s Magazine Vibes
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#quiz">Quiz</a>
    </nav>
  </header>

  <main class="container">
    <section id="home" class="panel">
      <h2>Welcome</h2>
      <div class="divider"></div>
      <p>This interface is styled like a flashy 1980s magazine spread — neon colors, bold fonts, and geometric accents.</p>
      <button class="btn" onclick="scrollToId('quiz')">Jump to Quiz</button>
    </section>

    <section id="about" class="panel">
      <h2>About the Style</h2>
      <div class="divider"></div>
      <ul>
        <li>Neon gradients and glowing shadows</li>
        <li>Chunky sans-serif fonts</li>
        <li>Geometric dividers and bold contrasts</li>
      </ul>
    </section>

    <section id="quiz" class="panel">
      <h2>Retro Quiz</h2>
      <div class="divider"></div>
      <form id="quiz-form">
        <div class="quiz-item">
          <label>Q1: Which color combo screams 80s magazine?</label>
          <div class="options">
            <label class="option"><input type="radio" name="q1" value="A" /> Neon pink + electric blue</label>
            <label class="option"><input type="radio" name="q1" value="B" /> Beige + brown</label>
            <label class="option"><input type="radio" name="q1" value="C" /> Olive green + maroon</label>
          </div>
        </div>

        <div class="quiz-item">
          <label>Q2: What font style fits the 80s magazine look?</label>
          <div class="options">
            <label class="option"><input type="radio" name="q2" value="A" /> Thin serif</label>
            <label class="option"><input type="radio" name="q2" value="B" /> Chunky sans-serif</label>
            <label class="option"><input type="radio" name="q2" value="C" /> Handwritten cursive</label>
          </div>
        </div>

        <button type="button" class="btn" onclick="submitQuiz()">Check Answers</button>
        <button type="reset" class="btn" onclick="resetResult()">Reset</button>
      </form>
      <div id="result" class="result"></div>
    </section>
  </main>

  <footer>
    Stay Rad — 1980s Forever
  </footer>

  <script>
    function scrollToId(id) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }

    const answerKey = { q1: "A", q2: "B" };

    function submitQuiz() {
      const form = document.getElementById("quiz-form");
      const data = new FormData(form);
      let score = 0,
