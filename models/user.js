const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define the persion schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },

    email: {
        type: String,
        unique: true
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    AadharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});
userSchema.pre('save', async function(next) {
    const user = this;
    // hash the password only if it has been modified ( or is new)
    if (!user.isModified('password')) return next();
    try {
        // hash  password generate
        const salt = await bcrypt.genSalt(10);
        //hash password 
        const hashedpassword = await bcrypt.hash(user.password, salt);
        //override the plain password with hashed one 
        user.password = hashedpassword;
        next();
    } catch (err) {
        return next(err);
    }
})
userSchema.methods.comparePassword = async function(candidatepassword) {
    try {
        const isMatch = await bcrypt.compare(candidatepassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}


// create user Model

const user = mongoose.model('user', userSchema);
module.exports = user;