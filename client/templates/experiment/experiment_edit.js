/**
 * Created by dsichau on 02.11.14.
 */


Template.experimentEdit.created = function() {
    Session.set('experimentEditErrors', {});
};
Template.experimentEdit.helpers({
    errorMessage: function(field) {
        return Session.get('experimentEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('experimentEditErrors')[field] ? 'has-error' : '';
    },
    keywordsHelper: function() {
        return this.keywords.toString();
    },
    levelsHelper: function() {
        return this.level.toString();
    }
});

Template.experimentEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentExperimentId = this._id;
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
            return Session.set('experimentEditErrors', errors);
        }

        Experiments.update(currentExperimentId, {$set: experiment}, function(error) {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                Router.go('experimentPage', {_id: currentExperimentId});
            }
        });
    },
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this Expriment?")) {
            var currentExperimentId = this._id;
            Experiments.remove(currentExperimentId);
            Router.go('home');
        }
    }
});



Template.experimentEdit.rendered = function() {
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