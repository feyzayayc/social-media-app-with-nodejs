const Post = require('../model/post_models');
const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const { post } = require('../router/admin_router');
const bcrypt = require("bcryptjs");

const showIndex = function (req, res, next) {
    res.redirect('/admin/timeline');
}

const showTimeline = async function (req, res, next) {
    const user = await User.findById({ _id: req.user_id });
    const allPosts = await Post.find().then(posts => { return posts });
    res.render('index', {
        layout: './layout/admin_layouts.ejs',
        allPosts: allPosts.reverse(),
        id: user.id, user: user
    });

}

const timeline = async (req, res, next) => {
    try {
        if (req.body.shareText.trim() == '') {
            req.flash('validation_error', [{ msg: 'Boş bırakılamaz' }]);
            res.redirect('/admin/timeline');
        }
        else {
            const user = await User.findById({ _id: req.user_id });
            const newPost = new Post({
                text: req.body.shareText,
                authorId: user._id,
                authorName: user.name,
                authorUsername: user.username,
                like: '0',
                dislike: '0'

            });
            await newPost.save();
            res.redirect('/admin/timeline');
        }
    } catch (error) {
        console.log(error);
    }


}

const deletePost = async (req, res, next) => {
    const id = req.params.id;
    await Post.deleteOne({ _id: id })
    res.redirect('/admin/timeline');
}

const showEditpost = async (req, res, next) => {
    const post = await Post.findOne({ _id: req.params.id });
    res.render('edit', {
        layout: './../views/layout/admin_layouts.ejs',
        post: post,
        // id: userId
    });

}

const editPost = async (req, res, next) => {
    const id = String(req.param.id);
    if (!req.body.shareText) {
        throw new Error('Please provided a text');
    }
    else {
        await Post.updateOne({ _id: req.params.id }, { $set: { text: req.body.shareText } });
        req.flash('success_validation', [{ msg: 'Güncelleme başarılı' }]);
        res.redirect('/admin/timeline');
    }
}

const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById({ _id: req.params.id });
        const user = await User.findById({ _id: req.user_id });

        const resultLike = post.like.indexOf(req.user_id);
        const resultDislike = post.dislike.indexOf(req.user_id);

        const userLikes = user.likePosts.indexOf(post.id);
        const userDislikes = user.dislikePosts.indexOf(post.id);
        if (userLikes == -1) {
            user.likePosts.push(post.id);
            await User.updateOne({ _id: req.user_id }, { $set: { likePosts: user.likePosts } });
        }

        if (userDislikes != -1) {
            user.dislikePosts.splice(userDislikes, 1);
            await User.updateOne({ _id: req.user_id }, { $set: { dislikePosts: user.dislikePosts } });
        }

        if (resultLike == -1) {
            post.like.push(req.user_id);
            await Post.updateOne({ _id: req.params.id }, { $set: { like: post.like } });
        }

        if (resultDislike != -1) {
            post.dislike.splice(resultDislike, 1);
            await Post.updateOne({ _id: req.params.id }, { $set: { dislike: post.dislike } });
        }

        res.redirect('/admin/timeline');
    } catch (error) {
        console.log(error);
    }

};


const dislikePost = async (req, res, next) => {
    try {
        const post = await Post.findById({ _id: req.params.id });
        const user = await User.findOne({ _id: req.user_id });

        const resultLike = post.like.indexOf(req.user_id);
        const resultDislike = post.dislike.indexOf(req.user_id);

        const userLikes = user.likePosts.indexOf(post.id);
        const userDislikes = user.dislikePosts.indexOf(post.id);


        if (userDislikes == -1) {
            user.dislikePosts.push(post.id);
            await User.updateOne({ _id: req.user_id }, { $set: { dislikePosts: user.dislikePosts } });
        }

        if (userLikes != -1) {
            user.likePosts.splice(userDislikes, 1);
            await User.updateOne({ _id: req.user_id }, { $set: { likePosts: user.likePosts } });
        }

        if (resultDislike == -1) {
            post.dislike.push(req.user_id);
            await Post.updateOne({ _id: req.params.id }, { $set: { dislike: post.dislike } });
        }
        if (resultLike != -1) {
            post.like.splice(resultLike, 1);
            await Post.updateOne({ _id: req.params.id }, { $set: { like: post.like } });
        }

        res.redirect('/admin/timeline');
    } catch (error) {
        console.error(error);
    }

}

const showSettings = async (req, res, next) => {
    const user = await User.findById({ _id: req.user_id })
    res.render('settings', { layout: './../views/layout/admin_layouts.ejs', user: user })
}
const settings = async (req, res, next) => {
    const user = await User.findById({ _id: req.user_id })
    if (req.body.name == '' || req.body.oldPassword == '' || req.body.newPassword == '' || req.body.newPasswordAgain == '') {
        req.flash('validation_error', [{ msg: 'Alanlar boş bırakılamaz' }]);
        res.redirect('settings');
    }
    const hashPassword = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!hashPassword) {
        req.flash('validation_error', [{ msg: 'Şifre hatalı!!' }]);
        res.redirect('settings');
    }
    else if (req.body.newPassword !== req.body.newPasswordAgain) {
        req.flash('validation_error', [{ msg: 'Şifreler aynı değil!' }]);
        res.redirect('settings');
    }
    else {
        const newPassword = await bcrypt.hash(req.body.newPassword, 10);
        await User.updateOne({ _id: req.user_id }, {
            $set: {
                name: req.body.name,
                password: newPassword
            }
        });
        req.flash('success_validation', [{ msg: 'Güncelleme başarılı' }]);
        res.redirect('/admin/timeline');
    }
}
module.exports = {
    showIndex,
    showTimeline,
    timeline,
    showEditpost,
    deletePost,
    editPost,
    likePost,
    dislikePost,
    showSettings,
    settings
}