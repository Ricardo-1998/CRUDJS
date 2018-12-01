const mongoose =  require('mongoose');

let PostModel = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        index: true
    },
    autor: String
});



module.exports = mongoose.model('Post', PostModel);