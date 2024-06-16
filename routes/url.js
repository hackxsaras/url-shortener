const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Url = require('../models/Url');
const shortid = require('shortid');

router.get('/user', auth, async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user.id }).sort({date:-1});
        res.json(urls);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
})

// @route   POST /shorten
// @desc    Create a short URL
router.post('/shorten', auth, async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ msg: 'Please provide a URL' });
    }

    try {
        const urlCode = shortid.generate();

        let url = new Url({
            longUrl,
            urlCode,
            user: req.user.id,
            date: new Date()
        });

        await url.save();

        res.json(url);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT /:id
// @desc    Update a short URL
router.put('/:id', auth, async (req, res) => {
    const { longUrl, urlCode } = req.body;

    if ((!longUrl) || (!urlCode)) {
        return res.status(400).json({ msg: 'Please provide a longUrl and urlCode' });
    }

    try {
        let url = await Url.findById(req.params.id);

        if (!url) {
            return res.status(404).json({ msg: 'URL not found' });
        }

        if (url.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        if (! shortid.isValid(url.urlCode)) {
            return res.status(400).json({ msg: 'Code can only contain alphanumeric words' });
        }
        url.longUrl = longUrl;
        url.urlCode = urlCode;
        url.date = new Date();

        await url.save();

        res.json({
            msg: "Updated Successfully"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: err.message });
    }
});

// @route   DELETE /:id
// @desc    Delete a short URL
router.delete('/:id', auth, async (req, res) => {
    try {
        let url = await Url.findOne({ _id: req.params.id });

        if (!url) {
            return res.status(404).json({ msg: 'URL not found' });
        }

        if (url.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await url.deleteOne({ _id: req.params.id });

        res.json({ msg: 'URL removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;
