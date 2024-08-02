const { body, validationResult } = require('express-validator');
const asyncHandler = require("express-async-handler");
const pool = require('../db/pool.js');


exports.message_post = [
    body('message', 'Message should have at least 1 character!').trim().isLength({ min: 1 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('views/new-message', { user: req.user, errors: errors.array() });
        }
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
]

exports.message_delete = asyncHandler(async (req, res, next) => {
    if (req.user.admin) {
        await pool.query("DELETE FROM messages WHERE id = $1", [req.body.message_id]);
        res.redirect("/home");
    }
})