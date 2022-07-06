const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        require: [true, 'İsim alanı boş olamaz.'],
        trim: true,
        maxLength: 20
    },
    email: {
        type: String,
        require: [true, 'Mail alanı boş olmaz.'],
        unique: [true, 'Bu mail kayıtlı!'],
        trim: true,
    },
    username: {
        type: String,
        require: [true, 'Kullanıcı adı alanı boş olamaz.'],
        unique: [true, 'Kullanıcı adını alamazsınız.'],
        trim: true,
        maxLength: 15
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    likePosts: {
        type: Array
    },
    dislikePosts: {
        type: Array
    }
}, { collection: 'users', timestamps: true });

const User = mongoose.model('User', UserSchema)

module.exports = User;