const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => { console.log('DB Connection') })
    .catch(err => console.error(err))