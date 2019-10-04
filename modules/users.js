const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/letschat', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Number,
        default: 1
    }
});

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;