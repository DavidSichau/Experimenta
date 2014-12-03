/**
 *
 * Created by dsichau on 02.11.14.
 */



Template.experimentSubmit.events({
    'submit form': function(e) {
        e.preventDefault();
        var code = $(e.target).find('[name=largeDescription]').code();
        //as code is empty with this tag
        if(code === '<p><br></p>') {
            code='';
        }
        var experiment = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            shortDescription: $(e.target).find('[name=shortDescription]').val(),
            largeDescription: code,
            keywords: _.uniq($(e.target).find('[name=keywords]').tokenfield('getTokensList').split(',')),
            level: _.uniq($(e.target).find('[name=level]').tokenfield('getTokensList').split(','))
        };


        var errors = validateExperiment(experiment);
        if (errors.title || errors.url || errors.shortDescription || errors.largeDescription || errors.keywords || errors.level) {
            return Session.set('experimentSubmitErrors', errors);
        }

        Meteor.call('experimentInsert', experiment, function(error, result) {
            if(error)
                throwError(error.message);
            if(result.experimentExists)
                throwError('This Title has already been posted');

            Router.go('experimentPage', {_id: result._id});
        });
    }
});

Template.experimentSubmit.created = function() {
    Session.set('experimentSubmitErrors', {});
};

Template.experimentSubmit.rendered = function() {
    $('textarea[name=largeDescription]').summernote({
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'hr']],
            ['view', ['fullscreen', 'codeview']],
            ['help', ['help']]
        ]
    });


    $('input[name=keywords]').tokenfield({
        autocomplete: {
            source: _.pluck(Keywords.find().fetch(), 'value'),
            delay: 100
        },
        showAutocompleteOnFocus: true
    })
    .on('tokenfield:createtoken', function (e) {
        var value = e.attrs.value;
        if(!Keywords.findOne({value: value})) {
            bootbox.prompt("Please provide a description for the new keyword " + value + "?", function(result) {
                if (result !== null) {
                    Keywords.insert({
                        value: value,
                        description: result
                    });
                }
            });
        }
    });


    $('input[name=level]').tokenfield({
        autocomplete: {
            source: _.pluck(Levels.find().fetch(), 'value'),
            delay: 100
        },
        showAutocompleteOnFocus: true
    })
    .on('tokenfield:createtoken', function (e) {
        var value = e.attrs.value;
        if(!Levels.findOne({value: value})) {
            bootbox.prompt("Please provide a description for the new level " + value + "?", function(result) {
                if (result !== null) {
                    Levels.insert({
                        value: value,
                        description: result
                    });
                }
            });
        }
    });

};

Template.experimentSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('experimentSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('experimentSubmitErrors')[field] ? 'has-error' : '';
    }
});