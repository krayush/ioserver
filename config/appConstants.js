module.exports = {
    appKeys: {
        "public-key-test": "private-key-test"
    },
    authHeaders: {
        "token": "x-api-authtoken"
    },
    messages: {
        "authFailed": "Request authorization failed",
        "invalidDataFromServer": "Invalid JSON received from application server",
        "invalidDataFromClient": "Invalid subscription request from client",
        "noValidSession": "Invalid session token from application server",
        "invalidAction": "Invalid action from application server"
    },
    ioServerPort: 5151,
    appServerURL: "http://localhost:5252"
};