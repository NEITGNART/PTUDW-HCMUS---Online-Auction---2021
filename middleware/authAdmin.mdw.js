export default function auth(req, res, next) {
    if (req.session.auth === true && req.session.type === 'admin') {
        return next();
    }
    res.redirect(`/login?retUrl=${req.originalUrl}`);
}