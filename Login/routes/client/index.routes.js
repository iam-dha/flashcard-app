const systemConfig = require("../../config/system");
const loginRoute = require("./login.route");
const authRoute = require("./auth.routes");
module.exports = (app) => {
    app.use("/login", loginRoute);

    app.use(`${systemConfig.apiPath}/v1/auth`, authRoute);
}