
function isMSIE1() {
   // Check if the browser is Internet Explorer
   if (navigator.userAgent.indexOf('MSIE') !== -1 ) {
      // The browser is Internet Explorer
      console.log('This is Internet Explorer');
   } else {
      // The browser is not Internet Explorer
      console.log('This is not Internet Explorer');
   }
}

function isMSIE2() {
   // Check if the browser is Internet Explorer
   if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
      // The browser is Internet Explorer
      console.log('This is Internet Explorer');
   } else {
      // The browser is not Internet Explorer
      console.log('This is not Internet Explorer');
   }
}

isMSIE1();