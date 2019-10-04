const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/letschat', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, function(err, res, next) {
    if(err) {
        console.log('There is error in connecting with mongodb');
    }
    console.log('Connection has been established.');
});
var conn = mongoose.Collection;
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_NAME);
var messageSchema = new mongoose.Schema({
    senderEmail:{
        type:String
    },
    receiverEmail: {
        type: String
    },
    senderID:{
        type:String
    },
    receiverID: {
        type: String
    },
    message: {
        type: String
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

var messageModel = mongoose.model('messages', messageSchema);
module.exports = messageModel;