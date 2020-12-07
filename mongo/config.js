const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/{db_name}', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db_name = mongoose.connection;

growmax.on('error', console.error.bind(console, 'connection error: '));
growmax.once('open', function() {
    console.log('Connected to the database');
});

module.exports = db_name;