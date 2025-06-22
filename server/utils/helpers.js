// Create URL-friendly slug from string
exports.createSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/--+/g, '-') // Replace multiple - with single -
        .trim();
};

// Format date to readable string
exports.formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

// Truncate text to specified length
exports.truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substr(0, text.lastIndexOf(' ', length)) + '...';
};
