/**
 * Created by dsichau on 30.10.14.
 */

Meteor.publish('experiments', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    options = _.extend(options, {
        fields: {
            largeDescription: 0
        }
    });
    return Experiments.find({}, options);
});

Meteor.publish('authors', function() {
    return Experiments.find({}, {fields: {author: 1, userId: 1}});
});


Meteor.publish('singleExperiment', function(id) {
    check(id, String);
    return Experiments.find(id);
});


Meteor.publish('comments', function(experimentId) {
    check(experimentId, String);
    console.log(Comments.find({experimentId: experimentId}).count())
    return Comments.find({experimentId: experimentId});
});

Meteor.publish('notifications', function() {
    return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('keywords', function() {
    return Keywords.find();
});
Meteor.publish('levels', function() {
    return Levels.find();
});

Facts.setUserIdFilter(function (userId) {
    return true;
    //var user = Meteor.users.findOne(userId);
    //return user && user.admin;
});
