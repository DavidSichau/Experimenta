/**
 * Created by dsichau on 12.11.14.
 */


Template.experimentPage.helpers({
    comments: function() {
        return Comments.find({experimentId: this._id})
    }
});
