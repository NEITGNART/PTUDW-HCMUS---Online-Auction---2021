export default (app) => {
    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/user/dashboard', (req, res) => {
        res.render('dashboard');
    });

    app.get('/user/profile', (req, res) => {
        res.render('profile');
    });

    app.get('/user/wishlist', (req, res) => {
        res.render('wishlist');
    });
}