/**
 * Created by dsichau on 30.10.14.
 */


Meteor.startup(function() {
    var lang = navigator.language || navigator.userLanguage;
    if (Meteor.user()) {
        lang = Meteor.user().profile.language;
    }
    TAPi18n.setLanguage(lang);
});
