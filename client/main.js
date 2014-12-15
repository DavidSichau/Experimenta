/**
 * Created by dsichau on 30.10.14.
 */

Meteor.startup(function() {
    var $head, $tags, tag, _i, _len, _ref, _results;
    $head = $('head');
    _ref = ['meta', 'title'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        $tags = $(tag);
        $head.append($tags.clone());
        _results.push($tags.remove());
    }
    //remove the loader and all styles
    $('.spinnerLoad').remove();
    $('style').remove();

    return _results;
});

Meteor.startup(function() {
    var lang = navigator.language || navigator.userLanguage;
    if (Meteor.user()) {
        lang = Meteor.user().profile.language;
    }
    TAPi18n.setLanguage(lang);
});
