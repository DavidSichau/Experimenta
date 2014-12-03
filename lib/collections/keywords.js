/**
 * Created by dsichau on 17.11.14.
 */

Keywords = new Mongo.Collection('keywords');

Keywords.allow({
    insert: function(userId, doc) {
        check(userId, String);
        return userId && _.isString(doc.value) && _.isString(doc.description);
    }
});

