/**
 * Created by dsichau on 18.11.14.
 */

Accounts.onCreateUser(function(options, user) {
    var lang = 'de';
    options.profile = _.extend(options.profile, {
        language: lang
    });
    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;
    return user;
});