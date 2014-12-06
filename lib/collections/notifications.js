/**
 * Created by dsichau on 17.11.14.
 */

Notifications = new Mongo.Collection('notifications');

Notifications.allow({
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc) &&
            fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

createCommentNotification = function(commentId) {
    var comment = Comments.findOne({_id: commentId});
    var experiment = Experiments.findOne(comment.experimentId);
    if (comment.userId  !== experiment.userId) {
        Notifications.insert({
            userId: experiment.userId,
            experimentId: experiment._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        });
    }
};