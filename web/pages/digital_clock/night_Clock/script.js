// Twinkling Stars
const starsContainer = document.querySelector('.stars');
for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = Math.random() * 100 + '%';
  star.style.left = Math.random() * 100 + '%';
  star.style.animationDelay = Math.random() * 5 + 's';
  star.style.animationDuration = Math.random() * 3 + 2 + 's';
  starsContainer.appendChild(star);
}

// Floating Hearts
const hearts = document.querySelectorAll('.heart');
hearts.forEach((heart, index) => {
  heart.style.left = `${20 + index * 30}%`;
  heart.style.animationDelay = `${Math.random() * 3}s`;
});

        const clockContainer = document.getElementById('clock-container');
        const digitalClock = document.getElementById('digital-clock');


        function updateClock() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            let backgroundClass = '';

            if (hours >= 6 && hours < 8) {
                backgroundClass = 'sunrise';
            } else if (hours >= 8 && hours < 12) {
                backgroundClass = 'morning';
            } else if (hours >= 12 && hours < 14) {
                backgroundClass = 'noon';
            } else if (hours >= 14 && hours < 17) {
                backgroundClass = 'afternoon';
            } else if (hours >= 17 && hours < 19) {
                backgroundClass = 'evening';
            } else if (hours >= 19 && hours < 21) {
                backgroundClass = 'sunset';
            } else {
                backgroundClass = 'night';
            }

            document.body.className = backgroundClass;

            const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            displayDigitalTime(timeString);
        }

        function displayDigitalTime(timeString) {
            digitalClock.innerHTML = '';
            for (const char of timeString) {
                const digitDiv = document.createElement('div');
                digitDiv.classList.add('digit');
                digitalClock.appendChild(digitDiv);
                const dotPattern = getDotPattern(char);
                for (const row of dotPattern) {
                    const rowDiv = document.createElement('div');
                    rowDiv.classList.add('row');
                    digitDiv.appendChild(rowDiv);
                    for (const dot of row) {
                        const squareDot = document.createElement('div');
                        squareDot.classList.add('square-dot');
                        if (dot === 0) {
                            squareDot.style.backgroundColor = 'transparent';
                        }
                        rowDiv.appendChild(squareDot);
                    }
                }
            }
        }

        function getDotPattern(char) {
            const patterns = {
                '0': [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]],
                '1': [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
                '2': [[1, 1, 1], [0, 0, 1], [1, 1, 1], [1, 0, 0], [1, 1, 1]],
                '3': [[1, 1, 1], [0, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
                '4': [[1, 0, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [0, 0, 1]],
                '5': [[1, 1, 1], [1, 0, 0], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
                '6': [[1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 1], [1, 1, 1]],
                '7': [[1, 1, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
                '8': [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 1, 1]],
                '9': [[1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
                ':': [[0, 1, 0], [0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 1, 0]],
            };
            return patterns[char] || [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; // Default to blank if char not found
        }

        updateClock();
        setInterval(updateClock, 1000);
