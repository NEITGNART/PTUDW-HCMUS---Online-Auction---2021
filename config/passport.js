import LocalStrategy from 'passport-local';
import fbStrategy from 'passport-facebook';
import ggStrategy from 'passport-google-oauth20';
import githubStrategy from 'passport-github2';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import config from './config.js';
import validate from 'express-validator';

export default (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });


    // Local Login
    passport.use('login', new LocalStrategy.Strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
            session: false
        },
        async (req, username, password, done) => {
            try {
                const user = await User.findOne({
                    authId: username,
                    method: 'local'
                });
                if (!user) {
                    return done(null, false, {
                        message: 'Tài khoản không tồn tại!'
                    });

                }
                const matched = await bcrypt.compare(password, user.secret);
                if (matched) {
                    done(null, user);
                } else {
                    done(null, false, {
                        message: 'Tài khoản hoặc mật khẩu không chính xác!'
                    })
                }
            } catch (err) {
                console.log(err.message);
            }
        }
    ));

    // Facebook Login
    passport.use('login-facebook', new fbStrategy.Strategy({
            clientID: config.FB_CLIENT_ID,
            clientSecret: config.FB_CLIENT_SECRET,
            callbackURL: config.FB_CALLBACK_URL,
            profileFields: ['email', 'displayName', 'picture.type(large)'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({
                    authId: profile.id,
                    method: 'facebook'
                });
                if (!user) {
                    const newLogin = new User({
                        method: 'facebook',
                        authId: profile.id,
                        profile: {
                            name: profile.displayName,
                            email: profile._json.email,
                            avatar: profile.photos[0].value,
                        }
                    });
                    await newLogin.save();
                    return done(null, newLogin);
                }
                done(null, user);
            } catch (err) {
                console.log(err);
            }
        }
    ));

    // Google Login
    passport.use('login-google', new ggStrategy.Strategy({
            clientID: config.GG_CLIENT_ID,
            clientSecret: config.GG_CLIENT_SECRET,
            callbackURL: config.GG_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({
                    authId: profile.id,
                    method: 'google'
                });
                if (!user) {
                    const newLogin = new User({
                        method: 'google',
                        authId: profile.id,
                        profile: {
                            name: profile._json.name,
                            email: profile._json.email,
                            avatar: profile._json.picture,
                        }
                    });
                    await newLogin.save();
                    return done(null, newLogin);
                }
                done(null, user);
            } catch (err) {
                console.log(err);
            }
        }
    ));

    // Github Login
    passport.use('login-github', new githubStrategy.Strategy({
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                const user = await User.findOne({
                    authId: profile.id,
                    method: 'github'
                });
                if (!user) {
                    const newLogin = new User({
                        method: 'github',
                        authId: profile.id,
                        profile: {
                            name: profile.displayName,
                            email: profile._json.id + '+' + profile._json.login + '@users.noreply.github.com',
                            avatar: profile._json.avatar_url,
                        }
                    });
                    await newLogin.save();
                    return done(null, newLogin);
                }
                done(null, user);
            } catch (err) {
                console.log(err);
            }
        }
    ));

    passport.use('signup', new LocalStrategy.Strategy({
        usernameField: 'username',
        emailField: 'email',
        passwordField: 'password',
        fullnameField: 'name',
        addressField: 'address',
        passReqToCallback: true
    }, (req, username, password, done) => {
        console.log(req.body);

        const errors = validate.validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return done(null, false, {
                message: errors.array()[0].msg
            });
        }
    }))
}