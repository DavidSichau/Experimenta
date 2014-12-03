/**
 * Created by dsichau on 03.11.14.
 */



Accounts.config({
    restrictCreationByEmailDomain: function(email) {
        var domain = email.slice(email.lastIndexOf("@")+1); // or regex
        var allowed = ["inf.ethz.ch", "school.edu.br"];
        return _.contains(allowed, domain);
    }
});