// leader model
// voter 
// position
// photo

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    voter: {
        type: Schema.Types.ObjectId,
        ref: 'Voter'
    },
    photo: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },

    vote: {
        type : Number,
        default: 0  
    }
    }, {


    timestamps: true,
    });

const Leader = mongoose.model('Leader', leaderSchema);

module.exports = Leader;

// example of a leader

// {
//    _id: "5f9c7b3d9a6b9b1b6c6c0f4d",
//     "voter": "5f9c7b3d9a6b9b1b6c6c0f4d",
//     "photo": "https://res.cloudinary.com/djxhcwowp/image/upload/v1604118725/akanvoting/leaders/1604118724854.jpg",
//     "position": "Head prefect"
// }
