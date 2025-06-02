module.exports = {
    expo: {
        extra: {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
            apiBaseUrl: process.env.API_BASE_URL,
        },
    },
};