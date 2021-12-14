export default (app) => {
    app.get('/', (req, res) => {
        res.render('home');
    }),

    app.get('/login', (req,res)=>{
        res.render('login');
    }),

    app.get('/signup', (req,res)=>{
        res.render('signup');
    }),

    app.get('/about', (req,res)=>{
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

    app.get('/user/product', (req, res) => {
        res.render('product');
    });


    app.get('/user/wishlist', (req, res) => {
        res.render('wishlist');
    });
}

