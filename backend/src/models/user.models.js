import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    profileImage:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
}, { timestamps: true });

// Hashing the password
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next // As long as the password is not modified, it should not be hashed
    const genSalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, genSalt);
    next();
})
// Compare password
UserSchema.methods.comparePassword = async function (userPassword){
    return await bcrypt.compare(this.password, userPassword);
}

const User = mongoose.model("User", UserSchema);
export default User