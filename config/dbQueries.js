module.exports = {
    SUBSCRIBE_USER: "INSERT INTO subscribers (user_id, session_token) values (?, ?)",
    END_ALL_SESSIONS: "DELETE e.* FROM subscribers e where user_id IN (select user_id from (select user_id from subscribers where session_token = ?) x)",
    END_CURRENT_SESSION: "DELETE FROM subscribers where session_token = ?"
};