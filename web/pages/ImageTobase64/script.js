const obj = {
  _base64: '', 
  get base64() {
    return this._base64;
  },
  set base64(newbase64) {
    this._base64 = newbase64;
  }
};

function convertToBase64() {
  var input = document.getElementById('img');
  var file = input.files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    var base = reader.result;
    base = reader.result;
    document.getElementById('output').innerText = base;

    ///console.log("obj.base64 >>> " + obj.base64);
    obj.base64 = base; 
    ///console.log("obj.base64 >>> " + obj.base64);
    ///console.log("base: " + base);
  };
  reader.readAsDataURL(file);
}

function copyToClipboard() {

  var copyText = document.getElementById("output");
  var status = document.getElementById("status");
  var imageOutput = document.getElementById("imageOutput");

  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

//  document.execCommand("copy");

  navigator.clipboard.writeText(copyText.value);
  // console.error(copyText.value); 

  status.innerText = "copied to clipBoard !";
  ///console.log(">>> obj.base64 >>> " + obj.base64);

  document.getElementById("imgOutput").src = obj.base64;
}

function fnShow() {

//   var copyText = document.getElementById("output");
  var status = document.getElementById("status");
//   var imageOutput = document.getElementById("imageOutput");

//   copyText.select();
//   copyText.setSelectionRange(0, 99999); /* For mobile devices */

// //  document.execCommand("copy");

//   navigator.clipboard.writeText(copyText.value);
//   // console.error(copyText.value); 

   status.innerText = "display base64 output !";
//   ///console.log(">>> obj.base64 >>> " + obj.base64);

  document.getElementById("imgOutput").src = obj.base64;
}


/**
 * todo: 
 * 1. check if user select a file.
 * 2. check if base64 is ok
 */
