module.exports = {
    LOGIN_QUERY: 'SELECT id, full_name, email, mobile FROM users WHERE email = "{email}" AND password = "{password}" AND status = "ACTIVE"',
    REGISTER_QUERY: 'INSERT INTO users (email, password, registration_date) values ("{email}", "{password}", DATE(NOW()))',
    USER_EXISTS: "SELECT count(*) AS count from users WHERE email = '{email}' "
};