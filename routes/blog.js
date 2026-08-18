const { Router } = require("express");
const multer = require('multer');
// const path = require('path') // for multer
const { storage } = require("../utils/cloudinary"); // changed

const Blog = require('../models/blog')
const Comment = require("../models/comment");

const router = Router();

//  storing image using multer
/*
const storage = multer.diskStorage({ // store image using multer
  destination: function (req, file, cb) { // to store image
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})
*/

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
        tinymceApiKey: process.env.TINYMCE_API_KEY, // for tinyMCE real time text editor
    })
});

router.get('/:id', async (req, res) => {
    // const blog = await Blog.findById(req.params.id);
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    // console.log(blog);
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    if (!blog) {
        return res.status(404).send('Blog not found');
    }
    // console.log("comments", comments);
    return res.render('blog', {
        user: req.user,
        blog, 
        comments,
    })
})

router.post('/comment/:blogId',async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post('/', upload.single("coverImage"), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    /*
    [Object: null prototype] { title: 'My title', body: 'abcedfghijklm ' }
    {
        fieldname: 'coverImage',
        originalname: 'pexels-czapp-arpad-3647289-11208031.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        path: 'C:\\Users\\Sachin Mishra\\Desktop\\Nodejs\\Blogify\\public\\uploads\\1786378480082-pexels-czapp-arpad-3647289-11208031.jpg',
        destination: 'C:\\Users\\Sachin Mishra\\Desktop\\Nodejs\\Blogify\\public\\uploads',
        filename: '1786378480082-pexels-czapp-arpad-3647289-11208031.jpg',
        size: 1237394
    }
  */
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        // coverImageURL: `/uploads/${req.file.filename}` // using multer 
        coverImageURL: req.file.path // changed — Cloudinary already gives the full hosted URL here
    })

    return res.redirect(`/blog/${blog._id}`);
})

// Show edit form pre-filled with existing data
router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');
    return res.render('editBlog', { user: req.user, blog });
});

// Handle the actual update
router.post('/edit/:id', async (req, res) => {
    const { title, body } = req.body;
    await Blog.findByIdAndUpdate(req.params.id, { title, body });
    return res.redirect(`/blog/${req.params.id}`);
});

// delete a blog with given id
router.post('/delete/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect('/');
});

module.exports = router;