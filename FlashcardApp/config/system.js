const ADMIN_PATH = "/admin";
const API_PATH = "/api";
const REFRESH_TOKEN_EXPIRATION = 7; // days
const ACCESS_TOKEN_EXPIRATION = 15; // minutes
const MAX_SESSIONS = 3;
const OTP_EXPIRATION = 5; // minutes
const OTP_RESEND_LIMIT = 1; // minutes
module.exports = {
    prefixAdmin: ADMIN_PATH,
    refreshTokenExpiration: {
        inNumber: REFRESH_TOKEN_EXPIRATION,
        inString: `${REFRESH_TOKEN_EXPIRATION}d`
    },
    accessTokenExpiration: {
        inNumber: ACCESS_TOKEN_EXPIRATION,
        inString: `${ACCESS_TOKEN_EXPIRATION}m`
    },
    maxSessions: MAX_SESSIONS,
    apiPath: API_PATH,
    otpExpiration: OTP_EXPIRATION,
    otpResendLimit: OTP_RESEND_LIMIT
};