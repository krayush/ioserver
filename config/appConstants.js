module.exports = {
    FILTERS: {
        ITEM_LIST: 1,
        CHECKBOX_BASED: 2,
        CHECK_SEARCHABLE: 3,
        SLIDER: 4,
        HIERARCHY: 5
    },
    API_LIST: [
        "/category",
        "/banner",
        "/listing",
        "/item",
        "/misc",
    ],
    APP_SECRET: "blargadeeblargblarg",
    appKeys: {
        "session-signature-key": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "session-encryption-key": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab2def",
        "token-key": "23900r8LADKLSKDL@(*@)*!#)(*@JLDAJSLDJASLJFLAF)",
        "secret-key": "01234523900r8LADKLSKDL@(*@)*!#)(*@JLDf0123456789ab2def",
    },
    'AUTH_HEADERS': {
        'TOKEN' : 'X-Api-AuthToken',
        'SIGN' : 'X-Api-Signature'
    },
    PASSWORD_MIN_LENGTH: 6,
    LOCAL_CDN_URL: "http://localhost:9090",
    PUBLIC_CDN_URL: "http://ivokiobucket.s3-website-us-east-1.amazonaws.com",
    FB_APP_SECRET: "24d483ff985095a80aa59bd9e6c7a885"
};