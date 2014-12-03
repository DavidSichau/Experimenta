
var makeSearchQuery = function() {
    var searchValue = $('input[name=search]').val();
    var query = Session.get('filter');
    if(searchValue) {
        query["title"] = searchValue;
    } else {
        delete query.title;
    }
    console.log(query);
    Session.set('filter', query);
};

Template.search.events({
    'click button': function(e) {
        e.preventDefault();
        makeSearchQuery();

    },
    'keypress input': function (e) {
        if (e.which === 13) {
            e.preventDefault();
            makeSearchQuery();
        }
    }
});