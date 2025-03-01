        const clockContainer = document.getElementById('clock-container');
        const digitalClock = document.getElementById('digital-clock');
        const bk = document.getElementById('currentIcon');

        function updateClock() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const moodIconsDiv = document.getElementById("mood-icons");

             // element.style.backgroundColor = newColor;
            let backgroundClass = '';

            if (hours >= 6 && hours < 8) {
                backgroundClass = 'sunrise';
                moodIconsDiv.innerHTML = '<div class="sun1"></div>';
            } else if (hours >= 8 && hours < 12) {
                backgroundClass = 'morning';
                moodIconsDiv.innerHTML = '<div class="sun2"></div>';
            } else if (hours >= 12 && hours < 14) {
                backgroundClass = 'noon';
                moodIconsDiv.innerHTML = '<div class="sun3"></div>';
            } else if (hours >= 14 && hours < 17) {
                backgroundClass = 'afternoon';
                moodIconsDiv.innerHTML = '<div class="sun4"></div>';
            } else if (hours >= 17 && hours < 19) {
                backgroundClass = 'evening';
                moodIconsDiv.innerHTML = '<div class="sun5"></div>';
            } else if (hours >= 19 && hours < 21) {
                backgroundClass = 'sunset';
                moodIconsDiv.innerHTML = '<div class="sun6"></div>';
            } else {
                backgroundClass = 'night';
                moodIconsDiv.innerHTML = '<div class="sun7"></div>';
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

        
        // function replaceMoodIconsContent(number) {
        //     const moodIconsDiv = document.getElementById("mood-icons");
          
        //     if (!moodIconsDiv) {
        //       console.error("Element with ID 'mood-icons' not found.");
        //       return;
        //     }

        //     switch (number) {
        //         case 1:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';
        //             break;
        //         case 2:
        //             moodIconsDiv.innerHTML = '<div class="s2"></div>';                    
        //             break;
        //         case 3:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
        //         case 4:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
        //         case 5:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
        //         case 6:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
        //         case 7:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
        //         case 8:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
        //         case 6:
        //             moodIconsDiv.innerHTML = '<div class="s1"></div>';                    
        //             break;
                                                                                
        //         default:
        //             break;
        //     }

        //     // moodIconsDiv.innerHTML = '<div class="s1"></div>';
        //     return number;
        //   }

        //   function replaceMoodIconsImage(number) {
        //     const moodIconsDiv = document.getElementById("mood-icons");
          
        //     if (!moodIconsDiv) {
        //       console.error("Element with ID 'mood-icons' not found.");
        //       return;
        //     }

        //     moodIconsDiv.innerHTML = `<div class="s${number}"></div>`;
        // }


        //   replaceMoodIconsImage(1);
          

        updateClock();
        setInterval(updateClock, 1000);
