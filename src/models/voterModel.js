const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voterSchema = new Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    grade: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        default: 'voter',
        enum: ['voter', 'admin']
    }, 
    
       
    }, {
    timestamps: true,
    });

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;

// exmaple of a voter
// {
//  _id: "5f9c7b3d9a6b9b1b6c6c0f4d",
//     "full_name": "John Doe",
//     "email": "johndoe@gmail",
//     "password": "password",
//     "title": "Head prefect"
// }