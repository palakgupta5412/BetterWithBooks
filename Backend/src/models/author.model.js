import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    books : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Book",
        default : []
    }
} , {
    timestamps : true
})

export const Author = mongoose.model('Author', authorSchema);