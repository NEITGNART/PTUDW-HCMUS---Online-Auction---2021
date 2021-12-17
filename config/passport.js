import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

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
                    authId: username
                });
                if (!user) {
                    return done(null, false, {
                        message: 'Tài khoản không tồn tại!'
                    });

                }
                const matched = await bcrypt.compare(password, user.secret);
                if (matched) {
                    req.session.user = user;
                    req.session.auth = true;
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
}