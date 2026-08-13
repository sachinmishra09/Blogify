const { Router } = require("express");
const User = require("../models/user");
const multer = require('multer');
const path = require('path')

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.get("/signin", (req, res) => {
    res.render("signin");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        return res.cookie("token", token).redirect("/");
        // console.log('User', user);
        // console.log('token ', token);
        // res.redirect("/");
    } catch {
        return res.render('signin',{
            error: 'Incorrect email or password',
        })
    }
})

router.get('/logout', (req, res) => {
    // logout clear the cookie
    // console.log(res);
    res.clearCookie("token").redirect("/");
})

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    await User.create({
        fullName,
        email,
        password,
    });

    res.redirect("/");
});

router.get('/profile-image', (req, res) => {
    if (!req.user) return res.redirect('/user/signin');
    return res.render('profileChange', { user: req.user });
});

router.post("/profile-image", upload.single("profileImage"), async (req, res) => { // route to change the profile image of the user using multer
    if (!req.user) return res.redirect("/user/signin");

    const imagePath = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, {
        profileImageURL: imagePath,
    });

    return res.redirect("/");
});

module.exports = router;