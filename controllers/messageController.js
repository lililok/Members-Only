const asyncHandler = require("express-async-handler");
const pool = require('../db/pool.js');


exports.message_post = asyncHandler(async (req, res, next) => {
    try {
        await pool.query("INSERT INTO messages (id_sender, main_text, send_date) VALUES ($1, $2, $3)", [
            req.user.id,
            req.body.message,
            new Date(),
        ]);
        res.redirect("/home");
    } catch (err) {
        return next(err);
    }
})

exports.message_delete = asyncHandler(async (req, res, next) => {
    try {
        await pool.query("DELETE FROM messages WHERE id = $1", [req.body.message_id]);
        res.redirect("/home");
    } catch (err) {
        return next(err);
    }
})