module.exports = {
    CREATE_USER: "INSERT INTO subscribers (user_id, session_token, app_key) values (?, ?, ?)",
    END_ALL_SESSIONS_BY_USER: "DELETE e.* FROM subscribers e where user_id IN (select user_id from (select user_id from subscribers where session_token = ?) x) AND app_key = ?",
    END_CURRENT_SESSION: "DELETE FROM subscribers where session_token = ?",
    END_ALL_SESSIONS: "DELETE FROM subscribers where app_key = ?",
    GET_ALL_SESSIONS_BY_ID: "SELECT session_token from subscribers where user_id IN (SELECT user_id from subscribers where session_token = ?) x AND app_key = ?"
};