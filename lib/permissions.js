/**
 *
 * Created by dsichau on 02.11.14.
 */


ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
};
