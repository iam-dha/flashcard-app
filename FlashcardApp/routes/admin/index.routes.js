const systemConfig = require("../../config/system");
const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
module.exports = (app) => {
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/auth`, authRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/users`, userRoute);
}