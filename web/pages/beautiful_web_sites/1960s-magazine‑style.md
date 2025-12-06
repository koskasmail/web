 # 1960s magazine‑style

### idea
```
Here’s a **1960s magazine‑style layout** in HTML/CSS/JS, with distinct sections for Sports, Movies, Music, and Politics. The design uses psychedelic colors, bold fonts, and groovy dividers to emulate the look and feel of a retro magazine spread:
```

#### code

```html
Here’s a **1960s magazine‑style layout** in HTML/CSS/JS, with distinct sections for Sports, Movies, Music, and Politics. The design uses psychedelic colors, bold fonts, and groovy dividers to emulate the look and feel of a retro magazine spread:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>60s Magazine</title>
  <style>
    /* ====== Psychedelic 60s palette ====== */
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
      font-size: 2.6rem;
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

    /* ====== Sections ====== */
    .container {
      max-width: 1000px;
      margin: 30px auto;
      padding: 0 20px;
    }

    section {
      background: var(--cream);
      border: 6px solid var(--psy-pink);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 8px 8px 0 var(--psy-orange);
    }

    section h2 {
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

    article {
      margin-bottom: 16px;
    }

    article h3 {
      color: var(--psy-orange);
      font-size: 1.4rem;
      margin-bottom: 6px;
    }

    article p {
      line-height: 1.5;
    }

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
    The Groovy Times — 1960s Edition
    <nav>
      <a href="#sports">Sports</a>
      <a href="#movies">Movies</a>
      <a href="#music">Music</a>
      <a href="#politics">Politics</a>
    </nav>
  </header>

  <main class="container">
    <section id="sports">
      <h2>Sports News</h2>
      <div class="divider"></div>
      <article>
        <h3>Baseball Fever</h3>
        <p>The 1960s saw legendary players dominate the diamond, with thrilling pennant races and unforgettable World Series moments.</p>
      </article>
      <article>
        <h3>Olympic Highlights</h3>
        <p>From Rome 1960 to Mexico City 1968, the Games showcased athletic excellence and cultural milestones.</p>
      </article>
    </section>

    <section id="movies">
      <h2>Movies</h2>
      <div class="divider"></div>
      <article>
        <h3>Hollywood Glamour</h3>
        <p>Stars like Audrey Hepburn and Paul Newman lit up the silver screen, while directors pushed boundaries with bold storytelling.</p>
      </article>
      <article>
        <h3>New Wave Cinema</h3>
        <p>European filmmakers introduced avant‑garde styles, influencing global cinema with fresh, experimental techniques.</p>
      </article>
    </section>

    <section id="music">
      <h2>Music</h2>
      <div class="divider"></div>
      <article>
        <h3>Rock Revolution</h3>
        <p>The Beatles, The Rolling Stones, and Jimi Hendrix defined a generation with electrifying performances and iconic albums.</p>
      </article>
      <article>
        <h3>Motown Magic</h3>
        <p>Artists like Diana Ross and Stevie Wonder brought soulful sounds to mainstream audiences, shaping pop culture forever.</p>
      </article>
    </section>

    <section id="politics">
      <h2>Politics</h2>
      <div class="divider"></div>
      <article>
        <h3>Global Shifts</h3>
        <p>The Cold War dominated headlines, with tensions between superpowers shaping international relations and domestic policies.</p>
      </article>
      <article>
        <h3>Civil Rights Movement</h3>
        <p>Historic marches and landmark legislation transformed society, as voices for equality grew louder across the decade.</p>
      </article>
    </section>
  </main>

  <footer>
    Peace • Love • Freedom — Stay Groovy
  </footer>


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
```

✨ This layout mimics a **New York Times‑style magazine from the 1960s**, but with psychedelic colors, rounded shapes, and bold fonts to capture the era’s vibe. Each section (Sports, Movies, Music, Politics) has its own articles, dividers, and retro styling.  

Would you like me to **fill these sections with actual 1960s headlines and summaries** (e.g., real sports events, movie releases, music milestones, political developments), so it feels like a genuine period magazine?
