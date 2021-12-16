import passport from 'passport';

export default (app) => {
    app.get('/', (req, res) => {
        res.render('home'
            // , {
            //     local: {
            //         user: {
            //             name: 'e'
            //         }
            //     }
            // }
        );
    });


    app.route('/login')
        .get((req, res) => {
            res.render('login');
        })
        .post(passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));



    app.get('/signup', (req, res) => {
        res.render('signup');
    });

    app.get('/about', (req, res) => {
        res.render('about');
    });

    app.get('/user/dashboard', (req, res) => {
        res.render('dashboard');
    });

    app.get('/user/profile', (req, res) => {
        res.render('profile');
    });

    app.get('/register', (req, res) => {
        res.render('register');
    });

    app.get('/product', (req, res) => {
        res.render('product');
    });

    app.get('/user/wishlist', (req, res) => {
        res.render('wishlist');
    });
}