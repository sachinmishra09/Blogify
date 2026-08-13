const { createHmac, randomBytes } = require('node:crypto');
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},
    { timestamps: true }
)

userSchema.pre('save', function (next) {
    const user = this; // this is pointing to current user

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString(); // generate random string
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    // next();
})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found!!!');

    // console.log(user);
 
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");

        if(hashedPassword !== userProvidedHash) throw new Error('Incorrect password!!!');

    const token = createTokenForUser(user);
    return token;
    // return user;
    // return {...user._doc, password: undefined , salt: undefined };

    // return hashedPassword === userProvidedHash;
})

const User = model('user', userSchema); // name of model is user

module.exports = User;