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
    })
}
