import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Fixed import name

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, // Automatically converts to lowercase
        validate: {
            validator: function(v) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    pfp: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    tbr: [{ 
       googleBookId: String,
       bookName: String,
       author: String,
       coverImage: String,
       totalPages: Number,
       addedAt: Date
   }],
   reading: [{ 
       googleBookId: String, 
       bookName: String,
       author: String,
       coverImage: String,
       totalPages: Number,
       pagesRead: { type: Number, default: 0 }, // <--- Important for progress!
       addedAt: Date
   }],
   finished: [{ 
       googleBookId: String,
       bookName: String,
       author: String,
       coverImage: String,
       totalPages: Number,
       addedAt: Date
   }],

    refreshToken: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function () { // ❌ Remove 'next' parameter
    
    // 1. If password wasn't changed, return immediately
    if(!this.isModified("password")) return;

    // 2. Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    // next();
    // ❌ Do NOT call next(). The function ends here automatically.
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { _id: this._id, name: this.name, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

export const User = mongoose.model('User', userSchema);