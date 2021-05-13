const mongoose = require("mongoose");

//  To do
const Schema = mongoose.Schema;

const userSchmea = new Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    phone : {
        type: String,
        required : true
    },
    imgUrl : {
        type: String,
        required : true
    },
})

module.exports = mongoose.model('User', userSchmea);