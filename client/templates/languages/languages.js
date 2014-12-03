Template.languages.helpers({
    languages: function() {
        var l = TAPi18n.getLanguages();
        var result = [];
        for (var key in l) {
            result.push({key:key,value:l[key]});
        }
        return result;
    },
    currentLanguage: function() {
        if(TAPi18n.getLanguage() === this.key) {
            return 'disabled';
        } else {
            return '';
        }
    }
});


Template.languages.events({
    'click a': function(e) {
        e.preventDefault();
        TAPi18n.setLanguage(this.key);
    }
});