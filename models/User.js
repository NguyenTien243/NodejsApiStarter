const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})
UserSchema.pre('save',async function (next){
    try {
        console.log('password chưa hash ', this.password)
        // generate a salt ( dùng để kết hợp mk)
        const salt = await bcrypt.genSalt(10)
        console.log('giá trị salt: ', salt)
        // generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(this.password,salt)
        console.log('password đã hash ', passwordHashed)
        // Re-assign password hashed
        this.password = passwordHashed
        next()
    } catch (err) {
        next(err)
    }
})

// https://www.npmjs.com/package/bcryptjs  
UserSchema.methods.isValidPassword = async function (newPassword) {
    try{
        return await bcrypt.compare(newPassword,this.password)
    }catch (err) {

    }
}

const User = mongoose.model('User', UserSchema)
module.exports = User