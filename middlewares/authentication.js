const { validateToken } = require("../services/authentication");

// checks for every log in
function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            // means no user
            return next();
        }

        try {
            // if useer is there validate him
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;

        } catch (error) { 
            console.log(error);
        }
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
};