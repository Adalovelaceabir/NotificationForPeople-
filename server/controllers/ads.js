const Ad = require('../models/Ad');

// @desc    Get all ads
// @route   GET /api/ads
// @access  Public
exports.getAds = async (req, res) => {
    try {
        const { position } = req.query;
        const query = { isActive: true };
        
        if (position) {
            query.position = position;
            // Only return ads that are currently active (between start and end dates)
            query.startDate = { $lte: new Date() };
            query.endDate = { $gte: new Date() };
        }
        
        const ads = await Ad.find(query).sort({ createdAt: -1 });
        
        // Increment impressions for active ads
        if (position) {
            ads.forEach(async ad => {
                ad.impressions += 1;
                await ad.save();
            });
        }
        
        res.json(ads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get single ad
// @route   GET /api/ads/:id
// @access  Public
exports.getAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        res.json(ad);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create ad
// @route   POST /api/ads
// @access  Private/Admin
exports.createAd = async (req, res) => {
    try {
        const { title, url, position, startDate, endDate } = req.body;
        
        const ad = new Ad({
            title,
            image: req.file ? req.file.path : '',
            url,
            position,
            startDate,
            endDate
        });
        
        await ad.save();
        
        res.status(201).json(ad);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private/Admin
exports.updateAd = async (req, res) => {
    try {
        const { title, url, position, startDate, endDate, isActive } = req.body;
        
        let ad = await Ad.findById(req.params.id);
        
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        ad.title = title || ad.title;
        ad.url = url || ad.url;
        ad.position = position || ad.position;
        ad.startDate = startDate || ad.startDate;
        ad.endDate = endDate || ad.endDate;
        ad.isActive = isActive !== undefined ? isActive : ad.isActive;
        
        if (req.file) {
            ad.image = req.file.path;
        }
        
        await ad.save();
        
        res.json(ad);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
exports.deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        await ad.remove();
        
        res.json({ message: 'Ad removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Record ad click
// @route   POST /api/ads/:id/click
// @access  Public
exports.recordClick = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        ad.clicks += 1;
        await ad.save();
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
