// Smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });


// // Reload link
// document.getElementById('reloadLink').addEventListener('click', function(e) {
//     e.preventDefault();
//     location.reload();
//   });
