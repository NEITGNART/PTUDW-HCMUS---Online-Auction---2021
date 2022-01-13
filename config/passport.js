import LocalStrategy from 'passport-local';
import fbStrategy from 'passport-facebook';
import ggStrategy from 'passport-google-oauth20';
import githubStrategy from 'passport-github2';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import config from './config.js';
import validate from 'express-validator';
import transporter from "../config/transporter.js";
import otpGenerator from 'otp-generator'

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
                        },
                        stauts: 'Active',
                        confirmationCode: otpGenerator.generate(30, {
                            upperCaseAlphabets: false,
                            specialChars: false
                        }),
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
                        },
                        stauts: 'Active',
                        confirmationCode: otpGenerator.generate(30, {
                            upperCaseAlphabets: false,
                            specialChars: false
                        }),
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
                        },
                        stauts: 'Active',
                        confirmationCode: otpGenerator.generate(30, {
                            upperCaseAlphabets: false,
                            specialChars: false
                        }),
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
    }, async (req, username, password, done) => {

        const errors = validate.validationResult(req);
        if (!errors.isEmpty()) {
            return done(null, false, {
                message: errors.array()[0].msg
            });
        }
        const fname = req.body.name;
        const email = req.body.email;
        const address = req.body.address;
        try {
            const user = await User.findOne({
                method: 'local',
                authId: username
            });
            if (user) {
                return done(null, false, {
                    message: 'Tài khoản đã tồn tại'
                });
            }
            const emailUser = await User.findOne({
                method: 'local',
                'profile.email': email
            });
            if (emailUser) {
                return done(null, false, {
                    message: 'Email đã được sử dụng'
                });
            }



            const salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);

            // node mailer

            var otp = otpGenerator.generate(30, {
                upperCaseAlphabets: false,
                specialChars: false
            });
            console.log(otp);
            // get localhost url

            var url = req.protocol + '://' + req.get('host') + "/user/verify?otp=" + otp;

            var mailOptions = {
                to: email,
                subject: "Otp for registration is: ",
                html: `<h3>OTP for account verification is </h3>"> 
                    <a href=${url}>Visit Aution Online!</a>
                "<h1 style='font-weight:bold;'></h1>" `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });


            const newUser = new User({
                authId: username,
                secret: password,
                profile: {
                    name: fname,
                    email: email,
                    address: address
                },
                confirmationCode: otp,

            });
            await newUser.save();
            done(null, newUser);
        } catch (err) {
            console.log(err);
        }

    }))
}