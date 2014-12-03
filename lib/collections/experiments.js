Experiments = new Mongo.Collection('experiments');

Experiments.allow({
    update: function(userId, experiment) { return ownsDocument(userId, experiment); },
    remove: function(userId, experiment) { return ownsDocument(userId, experiment); }
});

Experiments.deny({
    update: function(userId, experiment, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'url', 'title', 'shortDescription', 'largeDescription', 'keywords', 'level').length > 0);
    }
});

Experiments.deny({
    update: function(userId, experiment, fieldNames, modifier) {
        var errors = validateExperiment(modifier.$set);
        return errors.title || errors.url || errors.shortDescription || errors.largeDescription || errors.keywords || errors.level;
    }
});

validateExperiment = function (experiment) {
    var errors = {};

    if (!experiment.title)
        errors.title = "Please fill in a headline";

    if (!experiment.url)
        errors.url =  "Please fill in a URL";

    if (!experiment.shortDescription)
        errors.shortDescription =  "Please fill in a short description";

    if (!experiment.largeDescription)
        errors.largeDescription =  "Please fill in a large description";

    if (!experiment.keywords || !experiment.keywords.length)
        errors.keywords =  "Please fill in a keywords";

    if (!experiment.level || !experiment.level.length)
        errors.level =  "Please fill in a Level";

    return errors;
};

Meteor.methods({
    experimentInsert: function(experimentAttributes) {
        check(this.userId, String);
        check(experimentAttributes, {
            title: String,
            url: String,
            shortDescription: String,
            largeDescription: String,
            keywords: [String],
            level: [String]
        });

        var errors = validateExperiment(experimentAttributes);
        if (errors.title || errors.url || errors.shortDescription || errors.largeDescription || errors.keywords || errors.level) {
            throw new Meteor.Error('invalid-post', "You must set up all fields of your post");
        }

        var experimentWithSameTitle = Experiments.findOne({title: experimentAttributes.title});
        if (experimentWithSameTitle) {
            return {
                experimentExists: true,
                _id: experimentWithSameTitle._id
            }
        }

        var user = Meteor.user();
        var experiment = _.extend(experimentAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var experimentId = Experiments.insert(experiment);

        return {
            _id: experimentId
        };
    },

    upvoteExperiment: function(experimentId) {
        check(this.userId, String);
        check(experimentId, String);

        var affected = Experiments.update({
            _id: experimentId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });

        if (! affected)
            throw new Meteor.Error('invalid', "You weren't able to upvote that post");
    }
});
