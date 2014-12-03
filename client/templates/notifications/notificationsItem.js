Template.notificationItem.helpers({
    notificationPostPath: function() {
        return Router.routes.experimentPage.path({_id: this.experimentId});
    }
});

Template.notificationItem.events({
    'click a': function() {
        Notifications.update(this._id, {$set: {read: true}});
    }
});