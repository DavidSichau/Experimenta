
Template.header.helpers({
    activeRouteClass: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name;
        });

        return active && 'active';
    },
    showFilter: function() {
        return Router.current() && ['home', 'bestExperiments', 'newExperiments'].indexOf(Router.current().route.getName()) !== -1;
    }
});