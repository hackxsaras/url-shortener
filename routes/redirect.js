const express = require('express');
const router = express.Router();
const Url = require('../models/url');

// @route   GET /:code
// @desc    Redirect to the long URL
router.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json({ msg: 'No URL found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;