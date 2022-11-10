const { Comment, Pizza } = require('../models');

const CommentController = {
    //add comment to Pizza
    addComment({ params, body }, res) {
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: {comments: _id } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No Pizza found with that ID.'});
                    return;
                }

                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    //remove comment
    removeComment( { params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    res.status(404).json({ message: 'No Comment found with that ID!'});
                    return;
                }

                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No Pizza found with that ID!'});
                    return;
                }

                res.json(dbPizzaData);
            })
            .catch(err => res.json(err))
    },

    //add reply to comment 
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No Pizza found with that ID!'});
                    return;
                }

                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err =>  res.json(err));
    }
};


module.exports = CommentController;