const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReplySchema = new Schema (
    {
        //set custom id to avoid confusion with parent comment id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: true,
            trim: true
        },
        writtenBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

const CommentSchema = new Schema (
{
    writtenBy: {
        type: String,
        required: true,
        trim: true
    },
    commentBody: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    //use reply schema to validate data for a reply 
    replies: [ReplySchema]
},
{
    toJSON: {
        getters: true,
        virtuals: true
    },
    id: false
}
);


CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});


const Comment = model('Comment', CommentSchema);


module.exports = Comment;