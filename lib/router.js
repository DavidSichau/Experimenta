Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [
            Meteor.subscribe('notifications'),
            Meteor.subscribe('keywords'),
            Meteor.subscribe('levels'),
            Meteor.subscribe('authors')
        ]
    }
});

ExperimentListController = RouteController.extend({
    template: 'experimentList',
    increment: 6,
    experimentLimit: function() {
        return parseInt(this.params.experimentLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: this.sort, limit: this.experimentLimit()};
    },
    subscriptions: function() {
        this.experimentsSub = Meteor.subscribe('experiments', this.findOptions());
        this.authorsSub = Meteor.subscribe('authors');
        this.levelsSub = Meteor.subscribe('levels');
        this.keywordsSub = Meteor.subscribe('keywords');
    },
    experiments: function() {
        return Experiments.find(Session.get('filter'), this.findOptions());
    },
    data: function() {
        var hasMore = this.experiments().count() === this.experimentLimit();
        return {
            experiments: this.experiments(),
            keywords: Keywords.find(),
            levels: Levels.find(),
            ready: this.experimentsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});

NewExperimentController = ExperimentListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.newExperiments.path({experimentLimit: this.experimentLimit() + this.increment})
    }
});

BestExperimentController = ExperimentListController.extend({
    sort: {votes: -1, submitted: -1, _id: -1},
    nextPath: function() {
        return Router.routes.bestExperiments.path({experimentLimit: this.experimentLimit() + this.increment})
    }
});

Router.route('/', {
    name: 'home',
    controller: NewExperimentController
});

Router.route('/new/:experimentLimit?', {
    name: 'newExperiments',
    controller: NewExperimentController
});

Router.route('/best/:experimentLimit?', {
    name: 'bestExperiments',
    controller: BestExperimentController
});


Router.route('/experiment/:_id', {
    name: 'experimentPage',
    waitOn: function() {
        return [
            Meteor.subscribe('singleExperiment', this.params._id),
            Meteor.subscribe('comments', this.params._id)
        ];
    },
    data: function() { return Experiments.findOne(this.params._id); }
});

Router.route('/experiment/:_id/edit', {
    name: 'experimentEdit',
    waitOn: function() {
        return Meteor.subscribe('singleExperiment', this.params._id);
    },
    data: function() { return Experiments.findOne(this.params._id); }
});

Router.route('/submit', {
    name: 'experimentSubmit'
});

Router.route('/contact', {
    name: 'contact'
});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

Router.onBeforeAction('dataNotFound', {only: 'experimentPage'});
Router.onBeforeAction(requireLogin, {only: ['experimentSubmit', 'experimentPage']});
