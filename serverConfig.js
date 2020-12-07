const express = require('express'),
        bodyParser = require('body-parser'),
            multer  = require('multer'),
                xlsx = require('xlsx'),
                    path = require('path'),
                        file = require('fs');
 
                

const port = 3005;

const app = express();

const storage = multer.diskStorage({
    destination: '.',
    filename: function (request, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

module.exports = {
    app,
    upload,
    xlsx,
    file
}