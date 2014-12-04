/**
 * Created by dsichau on 12.11.14.
 */

Comments = new Mongo.Collection('comments');


Meteor.methods({
   commentInsert: function(commentAttributes) {
       check(this.userId, String);
       check(commentAttributes, {
           experimentId: String,
           body: String
       });
       var user = Meteor.user();
       var experiment = Experiments.findOne(commentAttributes.experimentId);
       if(!experiment)
           throw new Meteor.Error('invalid-comment', i18n.t('errorCommentOnPost'));
       comment = _.extend(commentAttributes, {
           userId: user._id,
           author: user.username,
           submitted: new Date()
       });
       // update the post with the number of comments
       Experiments.update(comment.experimentId, {$inc: {commentsCount: 1}});

       comment._id =  Comments.insert(comment);
       //create a notification, informing the user that there's been a comment
       createCommentNotification(comment);

       return comment._id;
   }
});