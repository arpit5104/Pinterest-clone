const mongoose = require('mongoose');

// mongoose.connect("mongodb://127.0.0.27017/");

const postSchema = new mongoose.Schema({
    imageText:{
        type: String,
        required: false,
    },
    image:[{
        type: String
    }],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    likes:{
        type:Array,
        default:0,
    },

});

module.exports = mongoose.model("Post", postSchema);