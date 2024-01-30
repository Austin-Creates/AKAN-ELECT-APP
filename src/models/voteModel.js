const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    voter: {
        type: Schema.Types.ObjectId,
        ref: 'Voter'
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'Leader'
    },
    position:{
        type: String,
        required: true,
    }
    }, {
    timestamps: true,
    });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;

// example of a vote
// {
//    _id: "5f9c7b3d9a6b9b1b6c6c0f4d",
//     "voter": "5f9c7b3d9a6b9b1b6c6c0f4d",
//     "leader": "5f9c7b3d9a6b9b1b6c6c0f4d",
//     "position": "president",
// }
