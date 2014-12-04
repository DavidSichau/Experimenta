
Template.filter.created = function() {
    Session.set('filter', {});
    this.errors = new ReactiveVar({});
    this.keywordsFilter = new ReactiveVar([]);
    this.levelsFilter  = new ReactiveVar([]);
    this.authorsFilter  = new ReactiveVar([]);
};


Template.filter.helpers({
    errorMessage: function(field) {
        return Template.instance().errors.get()[field];
    },
    errorClass: function (field) {
        return !!Template.instance().errors.get()[field] ? 'has-error' : '';
    },
    activeFilter: function() {
        return Session.get('filter').keywords || Session.get('filter').levels || Session.get('filter').author;
    }
});


var autoCompleteInit = function() {
    Template.instance().keywordsFilter.set(_.uniq(_.pluck(Keywords.find().fetch(), 'value')));
    Template.instance().levelsFilter.set(_.uniq(_.pluck(Levels.find().fetch(), 'value')));
    Template.instance().authorsFilter.set(_.uniq(_.pluck(Experiments.find().fetch(), 'author')));
    $('input[name=keywordsFilter]').tokenfield({
        autocomplete: {
            source: Template.instance().keywordsFilter.get(),
            delay: 100
        },
        showAutocompleteOnFocus: true,
        beautify: false
    });
    $('input[name=levelsFilter]').tokenfield({
        autocomplete: {
            source: Template.instance().levelsFilter.get(),
            delay: 100
        },
        showAutocompleteOnFocus: true,
        beautify: false
    });

    $('input[name=authorsFilter]').tokenfield({
        autocomplete: {
            source: Template.instance().authorsFilter.get(),
            delay: 100
        },
        showAutocompleteOnFocus: true,
        beautify: false
    });
};


var validateTokens = function(e) {
    var data = e.attrs.value.split('|')[0];
    var target = e.target.id;
    console.log(target)
    console.log(Template.instance());
    if(Template.instance()[target].get().indexOf(data) === -1){
        $(e.relatedTarget).addClass('invalid');
        var errors = Template.instance().errors.get();
        errors[target] = 'invalid field';
        Template.instance().errors.set(errors);
    }
    return true;
};

var clearErrors = function(e) {
    var target = e.target.id;
    var formGroups = $('.form-group.has-error');
    var invalid = formGroups.find('.invalid')
    if(invalid.length === 0) {
        var errors = Template.instance().errors.get();
        errors[target] = null;
        Template.instance().errors.set(errors);
    }
    return true
};

var setFilter = function() {
    var keywords = _.compact(_.uniq($('input[name=keywordsFilter]').tokenfield('getTokensList').split(',')));
    var levels  = _.compact(_.uniq($('input[name=levelsFilter]').tokenfield('getTokensList').split(',')));
    var authors  = _.compact(_.uniq($('input[name=authorsFilter]').tokenfield('getTokensList').split(',')));

    var query = {
    };

    if (keywords.length && _.difference(keywords, Template.instance().keywordsFilter.get()).length === 0) {
        query['keywords'] = {$in: keywords};
    }
    if (levels.length  && _.difference(levels, Template.instance().levelsFilter.get()).length === 0) {
        query['level'] = {$in: levels};
    }
    if (authors.length && _.difference(authors, Template.instance().authorsFilter.get()).length === 0) {
        query['author'] = {$in: authors};
    }
    Session.set('filter', query);
    return true;

};


Template.filter.events({
    'tokenfield:createdtoken': function(e) {
        validateTokens(e);
    },

    'tokenfield:createdtoken, tokenfield:removedtoken': function() {
        setFilter();
    },
    'tokenfield:removedtoken': function(e) {
        clearErrors(e);
    },
    'click a': function() {
        autoCompleteInit();
    },
    'click .dropdown-menu': function(e) {
        e.stopPropagation();
    }

});