const passport = require('passport');
const localAPIKey = require('passport-localapikey-update').Strategy;
const ApiKey = require('./apikey');

passport.use(new localAPIKey(
    (apikey, done) => {
        ApiKey.findOne({apikey: apikey}, (err,user) => {
            if(err){return done(err);}
            if(! user) {
                return done(null, false,{message: 'Unknow apikey ' + apikey});
            }else{
                console.log("Logged as: " + user.user);
                return done(null, user);
            }
        })
    }
));