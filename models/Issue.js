const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const issueSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

issueSchema.plugin(AutoIncrement, {
    inc_field: 'id',
    id: 'idNums',
    start_seq: 100
})

module.exports = mongoose.model('Issue', issueSchema);