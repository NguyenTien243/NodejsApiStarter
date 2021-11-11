const passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy
var LocalStrategy = require('passport-local').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt;
//onst {ExtractJwt} = require('passport-jwt')
const {JWT_SECRET} = require('../configs')
const User = require('../models/User')


passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET,
}, async (jwt_payload, done)=>{
    try {
        console.log('payload',jwt_payload)
        const user = await User.findById(jwt_payload.sub)
        if(!user) {
            return done(null, false )
        }
        done ( null,user)
    }
    catch (err) {
        done(err, false)
    }

}))

passport.use(new LocalStrategy({
    usernameField: 'email',
  },async function(email, password, done) {
     await User.findOne({ email }, async function (err, user) {
        if (err) { return done(err,false); }
        if (!user) { return done(null, false); }
        const check = await user.isValidPassword(password);
        if (! check) { return done(null, false) }
        return done(null, user);
      });

    // try{ 
    //     const user = await User.findOne({email});
    //     if(!user) return done(null, false);
    //     const isCorrectPassword = await user.isValidPassword(password);
    //     if(!isCorrectPassword) return done(null, false);
    //     done(null, user);
    // }catch (err) {
    //     done(err, false)
    // }
    }
  ));





// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = JWT_SECRET;
// passport.use(new JwtStrategy(opts, async (jwt_payload, done)=>{
//     try {
//         console.log('payload',jwt_payload)
//         //const user = await.u
//     }
//     catch (err) {
//         done(err, false)
//     }

// }))