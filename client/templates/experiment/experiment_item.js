Template.experimentItem.helpers({
    ownPost: function() {
        return this.userId === Meteor.userId();
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if(userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    }
});

Template.experimentItem.events({
    'click .upvotable': function(e){
        e.preventDefault();
        Meteor.call('upvoteExperiment', this._id);
    }
});