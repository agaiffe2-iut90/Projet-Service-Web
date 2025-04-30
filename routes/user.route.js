const {authJwt} = require("../middlewares");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Acces-Control-Allow-Headers",
            "x-acces-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/test/all", controller.allAccess);

    app.get("/test/user", [authJwt.verifyToken], controller.userAccess);
};