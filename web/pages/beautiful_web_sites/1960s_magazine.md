# 1980s magazine


### idea
```
Here’s a full HTML/CSS/JS page restyled with a **1960s magazine aesthetic** — bold psychedelic colors, playful geometric shapes, groovy fonts, and flower‑power vibes. It keeps the same structure (navbars, panels, quiz) but swaps the cardboard look for a retro 60s spread:
```

#### code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>60s Magazine UI</title>
  <style>
    /* ====== 60s psychedelic palette ====== */
    :root {
      --psy-pink: #ff4fa3;
      --psy-orange: #ff7f11;
      --psy-yellow: #ffe600;
      --psy-green: #3cb371;
      --psy-blue: #1e90ff;
      --cream: #fffbe6;
      --brown: #4b2e2e;
    }

    body {
      margin: 0;
      font-family: "Cooper Black", "Comic Sans MS", cursive;
      background: var(--cream);
      color: var(--brown);
      min-height: 100vh;
      background-image: radial-gradient(circle at top left, #fffbe6, #ffe6cc);
    }

    /* ====== Header ====== */
    header {
      background: linear-gradient(135deg, var(--psy-pink), var(--psy-orange), var(--psy-yellow));
      padding: 20px;
      text-align: center;
      color: var(--cream);
      font-size: 2.4rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      border-bottom: 8px dotted var(--psy-blue);
      font-family: "Cooper Black", cursive;
    }

    nav {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
    }

    nav a {
      text-decoration: none;
      color: var(--cream);
      background: var(--psy-green);
      padding: 10px 18px;
      border-radius: 50px;
      font-weight: bold;
      text-transform: uppercase;
      transition: transform 0.2s ease, background 0.2s ease;
      box-shadow: 0 0 10px var(--psy-green);
    }

    nav a:hover {
      transform: scale(1.2) rotate(-6deg);
      background: var(--psy-blue);
      box-shadow: 0 0 14px var(--psy-blue);
    }

    /* ====== Panels ====== */
    .container {
      max-width: 900px;
      margin: 30px auto;
      padding: 0 20px;
    }

    .panel {
      background: var(--cream);
      border: 6px solid var(--psy-pink);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 8px 8px 0 var(--psy-orange);
      position: relative;
    }

    .panel h2 {
      margin-top: 0;
      font-size: 2rem;
      color: var(--psy-blue);
      text-shadow: 2px 2px var(--psy-yellow);
      font-family: "Cooper Black", cursive;
    }

    .divider {
      height: 10px;
      background: repeating-linear-gradient(
        90deg,
        var(--psy-yellow) 0 20px,
        var(--psy-orange) 20px 40px,
        var(--psy-pink) 40px 60px,
        var(--psy-blue) 60px 80px
      );
      margin: 12px 0;
      border-radius: 6px;
    }

    /* ====== Buttons ====== */
    .btn {
      display: inline-block;
      background: var(--psy-orange);
      color: var(--cream);
      padding: 12px 20px;
      border: none;
      border-radius: 30px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 6px 6px 0 var(--psy-pink);
      transition: transform 0.2s ease, background 0.2s ease;
      font-family: "Cooper Black", cursive;
    }

    .btn:hover {
      transform: scale(1.1) rotate(3deg);
      background: var(--psy-green);
      box-shadow: 6px 6px 0 var(--psy-blue);
    }

    /* ====== Quiz ====== */
    .quiz-item {
      margin-bottom: 16px;
      padding: 12px;
      border: 4px dashed var(--psy-blue);
      border-radius: 16px;
      background: #fff0f5;
    }

    .quiz-item label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: var(--psy-pink);
      font-family: "Cooper Black", cursive;
    }

    .options {
      display: grid;
      gap: 8px;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,0,0,0.05);
      padding: 6px 8px;
      border-radius: 12px;
      transition: background 0.2s ease;
    }

    .option:hover {
      background: rgba(255,255,255,0.2);
    }

    input[type="radio"] {
      accent-color: var(--psy-pink);
    }

    .result {
      display: none;
      margin-top: 14px;
      padding: 12px;
      border-radius: 16px;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      font-family: "Cooper Black", cursive;
    }

    .result.good { color: var(--psy-green); }
    .result.ok   { color: var(--psy-blue); }
    .result.bad  { color: var(--psy-pink); }

    footer {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, var(--psy-yellow), var(--psy-orange), var(--psy-pink));
      color: var(--cream);
      font-weight: bold;
      text-transform: uppercase;
      border-top: 8px dotted var(--psy-blue);
      font-family: "Cooper Black", cursive;
    }
  </style>
</head>
<body>
  <header>
    60s Magazine Vibes
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
      <p>This interface is styled like a groovy 1960s magazine spread — psychedelic colors, bold fonts, and flower‑power vibes.</p>
      <button class="btn" onclick="scrollToId('quiz')">Jump to Quiz</button>
    </section>

    <section id="about" class="panel">
      <h2>About the Style</h2>
      <div class="divider"></div>
      <ul>
        <li>Psychedelic palette: pink, orange, yellow, blue, green</li>
        <li>Chunky retro fonts</li>
        <li>Playful geometric dividers and rounded shapes</li>
      </ul>
    </section>

    <section id="quiz" class="panel">
      <h2>Retro Quiz</h2>
      <div class="divider"></div>
      <form id="quiz-form">
        <div class="quiz-item">
          <label>Q1: Which color combo screams 60s magazine?</label>
          <div class="options">
            <label class="option"><input type="radio" name="q1" value="A" /> Psychedelic pink + orange + yellow</label>
            <label class="option"><input type="radio" name="q1" value="B" /> Burnt orange + mustard yellow</label>
            <label class="option"><input type="radio" name="q1" value="C" /> Neon pink + electric blue</label>
          </div>
        </div>

        <div class="quiz-item">
          <label>Q2: What font style fits the 60s magazine look?</label>
          <div class="options">
            <label class="option"><input type="radio" name="q2" value="A" /> Groovy chunky retro fonts</label>
            <label class="option"><input type="radio" name="q2" value="B" /> Thin serif</label>
            <label class="option"><input type="radio" name="q2" value="C" /> Futuristic neon type</label>
          </div>
        </div>

        <button type="button" class="btn" onclick="submitQuiz()">Check Answers</button>
        <button type="reset" class="btn" onclick="resetResult()">Reset</button>
      </form>
      <div id="result" class="result"></div>
    </section>
  </main>

  <footer
