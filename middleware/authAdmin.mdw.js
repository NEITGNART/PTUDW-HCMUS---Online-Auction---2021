export default function auth(req, res, next) {
    if (req.isAuthenticated() && req.user.type === 'admin') {
        req.session.retUrl = req.originalUrl;
        return next();
    }
    res.redirect(`/login?retUrl=${req.originalUrl}`);
}