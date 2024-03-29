
if(Keywords.find().count() === 0) {
    Keywords.insert({
        value: "Physik",
        label: "Physik"
    });
    Keywords.insert({
        value: "Chemie",
        label: "Chemie"
    });

    Keywords.insert({
        value: "Bio",
        label: "Bio"
    });
    Keywords.insert({
        value: "Strom",
        label: "Strom"
    });
}



if (Experiments.find().count() === 5) {
    var now = new Date().getTime();
// create two users
    var tomId = Meteor.users.insert({
        profile: { name: 'Tom Coleman' }
    });
    var tom = Meteor.users.findOne(tomId);
    var sachaId = Meteor.users.insert({
        profile: { name: 'Sacha Greif' }
    });
    var sacha = Meteor.users.findOne(sachaId);
    var telescopeId = Experiments.insert({
        title: 'Introducing Telescope',
        userId: sacha._id,
        author: sacha.profile.name,
        url: 'http://sachagreif.com/introducing-telescope/',
        submitted: new Date(now - 7 * 3600 * 1000),
        commentsCount: 2,
        upvoters: [],
        votes: 0
    });
    Comments.insert({
        experimentId: telescopeId,
        userId: tom._id,
        author: tom.profile.name,
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'Interesting project Sacha, can I get involved?'
    });
    Comments.insert({
        experimentId: telescopeId,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'You sure can Tom!'
    });
    Experiments.insert({
        title: 'Meteor',
        userId: tom._id,
        author: tom.profile.name,
        url: 'http://meteor.com',
        submitted: new Date(now - 10 * 3600 * 1000),
        commentsCount: 0,
        upvoters: [],
        votes: 0
    });
    Experiments.insert({
        title: 'The Meteor Book',
        userId: tom._id,
        author: tom.profile.name,
        url: 'http://themeteorbook.com',
        submitted: new Date(now - 12 * 3600 * 1000),
        commentsCount: 0,
        upvoters: [],
        votes: 0
    });
    for (var i = 0; i < 10; i++) {
        Experiments.insert({
            title: 'Test post #' + i,
            author: sacha.profile.name,
            userId: sacha._id,
            url: 'http://google.com/?q=test-' + i,
            submitted: new Date(now - i * 3600 * 1000),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
    }


}