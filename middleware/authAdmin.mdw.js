export default function auth(req, res, next) {
    req.session.retUrl = req.originalUrl;
    if (req.isAuthenticated() && req.user.type === 'admin') {
        return next();
    }
    res.redirect(`/login?retUrl=${req.originalUrl}`);
}