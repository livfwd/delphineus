var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var User = require('./models').User;

module.exports = passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: 'http://glacial-inlet-40419.herokuapp.com/auth/github/callback'
},
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      where: { githubId: profile.id }
    })
    .then(function(foundUser) {
      if (!foundUser) {
        User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profileUrl: profile.profileUrl,
          avatarUrl: profile._json.avatar_url
        })
        .then(function(newUser) {
          done(null, newUser);
        });
      } else {
        done(null, foundUser);
      }
    })
    .catch(function(err) {
      console.error(err);
    });
  }
));
