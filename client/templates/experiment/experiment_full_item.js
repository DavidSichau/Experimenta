Template.experimentFullItem.helpers({
    ownPost: function() {
        return this.userId === Meteor.userId();
    }
});

Template.experimentFullItem.events({
    'click .upvotable': function(e){
        e.preventDefault();
        Meteor.call('upvoteExperiment', this._id);
    }
});