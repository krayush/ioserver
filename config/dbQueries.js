module.exports = {
    SUBSCRIBE_USER: "INSERT INTO users (user, session_token, subscription_date) values (?, ?, DATE(NOW()))"
};