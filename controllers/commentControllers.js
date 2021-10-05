const AsyncHandler = require('../utilities/AsyncHandler.js');
const Comment = require('../models/commentModel.js');

exports.getComments = AsyncHandler(async function (req, res, next) {
  let obj = {};
  if (req.params.commentId) {
    obj.comment = req.params.commentId;
  }
  const comments = await Comment.find(obj);
  obj = {};
  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = AsyncHandler(async function (req, res, next) {
  const obj = {
    rating: req.body.rating,
    description: req.body.description,
    book: req.params.bookId,
    user: req.body.user,
  };
  const comment = await Comment.create(obj);
  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = AsyncHandler(async function (req, res, next) {
  await Comment.findByIdAndUpdate(req.params.commentId, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Comment is updated successfully',
  });
});

exports.deleteComment = AsyncHandler(async function (req, res, next) {
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(204).json({
    status: 'success',
    message: 'Comment is deleted successfully',
  });
});
