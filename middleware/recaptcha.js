import request from "request";

export default (req, res, next) => {
    if (req.body['g-recaptcha-response']) {

        // Secret key
        const secretKey = '6LcHauMdAAAAAG79dfUHE7Q42SrFAPFm4oMqqnUK';

        // Verify URL
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}
        &response=${req.body['g-recaptcha-response']}
        &remoteip=${req.connection.remoteAddress}`;

        request(verificationUrl, (err, response, body) => {
            body = JSON.parse(body);

            if (body.success) {

                next();
            } else {
                req.flash('error', 'Lỗi xác thực captcha');
                res.redirect('back');
            }
        })
    } else {
        req.flash('error', 'Chưa xác thực recaptcha');
        res.redirect('back');
    }
}