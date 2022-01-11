export default {
    PORT: process.env.PORT || 8888,
    URI: process.env.MONGODB_URL || '?',

    FB_CLIENT_ID: process.env.FB_CLIENT_ID || '?',
    FB_CLIENT_SECRET: process.env.FB_CLIENT_SECRET || '?',
    FB_CALLBACK_URL: process.env.FB_CALLBACK_URL || '?',

    GG_CLIENT_ID: process.env.GG_CLIENT_ID || '?',
    GG_CLIENT_SECRET: process.env.GG_CLIENT_SECRET || '?',
    GG_CALLBACK_URL: process.env.GG_CALLBACK_URL || '?',

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '?',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '?',
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || '?',

    CLOUND_API_KEY: process.env.CLOUND_API_KEY || '?',
    CLOUND_API_SECRET: process.env.CLOUND_API_SECRET || '?',
    CLOUNDINARY_URL: process.env.CLOUNDINARY_URL || '?',

    EMAIL_USER: process.env.EMAIL_USER || '?',
    EMAIL_PASS: process.env.EMAIL_PASS || '?',

    SECRET: 'verySecret'
};