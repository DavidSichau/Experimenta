/**
 * Created by dsichau on 12.11.14.
 */

Comments = new Mongo.Collection('comments');
Comments.attachSchema(new SimpleSchema({
    experimentId: {
        type: String
    },
    author: {
        type: String,
        autoValue: function() {
            var user = Meteor.user();
            return user.username;
        },
        autoform: {
            omit: true
        }
    },
    userId: {
        type: String,
        denyUpdate: true,
        autoValue: function() {
           return Meteor.userId();
        }
    },
    submitted: {
        type: Date,
        autoValue: function() {
            return new Date();
        }
    },
    body: {
        type: String,
        label: "The comment"
    }
}));

Meteor.methods({
   commentInsert: function(commentAttributes) {
       check(this.userId, String);
       // clean autoForm schema while autoValue is in use
       Comments.simpleSchema().clean(commentAttributes, {
           extendAutoValueContext: {
               isInsert: true,
               isUpdate: false,
               isUpsert: false,
               isFromTrustedCode: false
           }
       });
       check(commentAttributes, Comments.simpleSchema());
       var experiment = Experiments.findOne(commentAttributes.experimentId);
       if(!experiment) {
           throw new Meteor.Error('invalid-comment', i18n.t('errorCommentOnPost'));
       }
       var commentId =  Comments.insert(commentAttributes);
       Experiments.update(commentAttributes.experimentId, {$inc: {commentsCount: 1}});

       //create a notification, informing the user that there's been a comment
       createCommentNotification(commentId);

       return commentId;
   }
});