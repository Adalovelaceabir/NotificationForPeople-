const Category = require('../models/Category');
const { createSlug } = require('../utils/helpers');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const slug = createSlug(name);
        const existingCategory = await Category.findOne({ slug });
        
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        
        const category = new Category({
            name,
            slug,
            description,
            featuredImage: req.file ? req.file.path : '',
            seoTitle: req.body.seoTitle || name,
            seoDescription: req.body.seoDescription || description
        });
        
        await category.save();
        
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        let category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if name changed and update slug
        if (name && name !== category.name) {
            const slug = createSlug(name);
            const existingCategory = await Category.findOne({ slug, _id: { $ne: category._id } });
            
            if (existingCategory) {
                return res.status(400).json({ error: 'Category with this name already exists' });
            }
            
            category.slug = slug;
            category.name = name;
        }
        
        category.description = description || category.description;
        category.seoTitle = req.body.seoTitle || category.seoTitle;
        category.seoDescription = req.body.seoDescription || category.seoDescription;
        
        if (req.file) {
            category.featuredImage = req.file.path;
        }
        
        await category.save();
        
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if category has articles
        const articlesCount = await Article.countDocuments({ category: category._id });
        if (articlesCount > 0) {
            return res.status(400).json({ 
                error: 'Category has articles. Please delete or move them first.' 
            });
        }
        
        await category.remove();
        
        res.json({ message: 'Category removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
