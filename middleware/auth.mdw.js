export default function auth(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.retUrl = req.originalUrl;
        return res.redirect(`/login?retUrl=${req.originalUrl}`);
    }
    next();
}