///script.js
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
