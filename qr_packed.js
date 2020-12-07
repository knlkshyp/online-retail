if (devices && devices.length) {
           var cameraId = devices[0].id;
            
        }
   }).catch(err => {
          
});

const html5QrCode = new Html5Qrcode(“reader”);
html5QrCode.start(
   cameraId,
   {
      fps: 10,
      qrbox: 250 
 },
 qrCodeMessage => {
     
     console.log(`QR Code detected: ${qrCodeMessage}`);
 },
 errorMessage => {
     
     console.log(`QR Code no longer in front of camera.`);
 })
 .catch(err => {
      
     console.log(`Unable to start scanning, error: ${err}`);
 });
 
 html5QrCode.stop().then(ignore => {
   
  console.log(“QR Code scanning stopped.”);
}).catch(err => { 
  
  console.log(“Unable to stop scanning.”);
 });