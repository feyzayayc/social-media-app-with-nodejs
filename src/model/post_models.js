const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: {
        type: String,
        require: [true, 'İçerik alanı boş olamaz.'],
        maxLength: 140
    },
    // image:{
    //     type:Image,
    // },
    authorId: {
        type: String,
    },
    authorName: {
        type: String,
    },
    authorUsername: {
        type: String,
    },
    like: {
        type: Array,
    },
    dislike: {
        type: Array,
    }

}, { collection: 'posts', timestamps: true });

const Post = mongoose.model('Post', PostSchema)

module.exports = Post;