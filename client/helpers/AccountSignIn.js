Deps.autorun(function() {
    if(Meteor.user()){
        var lang = Meteor.user().profile.language;
        TAPi18n.setLanguage(lang);
    }
});
