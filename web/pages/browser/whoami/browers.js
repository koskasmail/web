
console.log('----[All browser check]------------');
// Check what browser is being used
if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1 ) {
    // The browser is Opera
    console.log('This is Opera');
} else if(navigator.userAgent.indexOf("Chrome") !== -1 ) {
    // The browser is Chrome
    console.log('This is Chrome');
} else if(navigator.userAgent.indexOf("Safari") !== -1) {
    // The browser is Safari
    console.log('This is Safari');
} else if(navigator.userAgent.indexOf("Firefox") !== -1 ) {
    // The browser is Firefox
    console.log('This is Firefox');
} else if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.DOCUMENT_TYPE_NODE === true)) {
    // The browser is Internet Explorer
    console.log('This is Internet Explorer');
} else {
    // The browser is unknown
    console.log('This is an unknown browser');
}
