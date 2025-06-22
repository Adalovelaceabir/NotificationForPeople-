const Article = require('../models/Article');
const Category = require('../models/Category');
const { createSlug } = require('../utils/helpers');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const query = { status: 'published' };
        
        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) query.category = cat._id;
        }
        
        if (search) {
            query.$text = { $search: search };
        }
        
        const articles = await Article.find(query)
            .populate('category', 'name slug')
            .populate('author', 'name avatar')
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            
        const count = await Article.countDocuments(query);
        
        res.json({
            articles,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticle = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
            .populate('category', 'name slug')
            .populate('author', 'name avatar');
            
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        
        // Increment view count
        article.views += 1;
        await article.save();
        
        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private/Admin/Editor
exports.createArticle = async (req, res) => {
    try {
        const { title, content, category, excerpt, tags } = req.body;
        
        const slug = createSlug(title);
        const existingArticle = await Article.findOne({ slug });
        
        if (existingArticle) {
            return res.status(400).json({ error: 'Article with this title already exists' });
        }
        
        const article = new Article({
            title,
            slug,
            content,
            excerpt,
            tags,
            category,
            author: req.user.id,
            featuredImage: req.file ? req.file.path : '',
            status: req.body.status || 'draft',
            seoTitle: req.body.seoTitle || title,
            seoDescription: req.body.seoDescription || excerpt,
            seoKeywords: req.body.seoKeywords || tags
        });
        
        if (article.status === 'published') {
            article.publishedAt = new Date();
        }
        
        await article.save();
        
        res.status(201).json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin/Editor
exports.updateArticle = async (req, res) => {
    try {
        const { title, content, category, excerpt, tags } = req.body;
        
        let article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        
        // Check if title changed and update slug
        if (title && title !== article.title) {
            const slug = createSlug(title);
            const existingArticle = await Article.findOne({ slug, _id: { $ne: article._id } });
            
            if (existingArticle) {
                return res.status(400).json({ error: 'Article with this title already exists' });
            }
            
            article.slug = slug;
            article.title = title;
        }
        
        article.content = content || article.content;
        article.excerpt = excerpt || article.excerpt;
        article.tags = tags || article.tags;
        article.category = category || article.category;
        article.seoTitle = req.body.seoTitle || article.seoTitle;
        article.seoDescription = req.body.seoDescription || article.seoDescription;
        article.seoKeywords = req.body.seoKeywords || article.seoKeywords;
        
        if (req.file) {
            article.featuredImage = req.file.path;
        }
        
        // Handle status change
        if (req.body.status && req.body.status !== article.status) {
            article.status = req.body.status;
            if (req.body.status === 'published' && !article.publishedAt) {
                article.publishedAt = new Date();
            }
        }
        
        article.updatedAt = new Date();
        
        await article.save();
        
        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin/Editor
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        
        await article.remove();
        
        res.json({ message: 'Article removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
