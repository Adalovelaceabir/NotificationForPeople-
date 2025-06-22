import ApiService from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load articles
    try {
        const { articles } = await ApiService.get('/articles', {
            page: 1,
            limit: 8
        });
        
        // Render articles to the page
        renderArticles(articles);
    } catch (error) {
        console.error('Error loading articles:', error);
    }
    
    // Load categories
    try {
        const categories = await ApiService.get('/categories');
        renderCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
    
    // Load ads
    try {
        const ads = await ApiService.get('/ads', { position: 'header' });
        renderAds(ads);
    } catch (error) {
        console.error('Error loading ads:', error);
    }
});

function renderArticles(articles) {
    const gridContainer = document.querySelector('.grid-container');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = articles.map(article => `
        <article class="news-card">
            <div class="card-image">
                <img src="${article.featuredImage}" alt="${article.title}" class="img-responsive">
                <span class="category-badge ${article.category.slug}">${article.category.name}</span>
            </div>
            <div class="card-content">
                <h3><a href="article.html?slug=${article.slug}">${article.title}</a></h3>
                <div class="meta">
                    <span class="author">By ${article.author.name}</span>
                    <span class="date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <p>${article.excerpt}</p>
                <a href="article.html?slug=${article.slug}" class="read-more">Read More</a>
            </div>
        </article>
    `).join('');
}

function renderCategories(categories) {
    // Render to sidebar and footer
    const categoryLists = document.querySelectorAll('.categories-widget ul, .footer-widget.categories-widget ul');
    
    categoryLists.forEach(list => {
        list.innerHTML = categories.map(category => `
            <li><a href="category.html?cat=${category.slug}">${category.name}</a></li>
        `).join('');
    });
}

function renderAds(ads) {
    const adContainers = document.querySelectorAll('.ad-placeholder');
    
    adContainers.forEach(container => {
        const position = container.closest('.ad-banner').classList.contains('top-banner') ? 'header' :
                         container.closest('.ad-banner').classList.contains('mid-banner') ? 'content' :
                         container.closest('.ad-banner').classList.contains('bottom-banner') ? 'footer' :
                         'sidebar';
        
        const ad = ads.find(a => a.position === position);
        
        if (ad) {
            container.innerHTML = `
                <a href="/api/ads/${ad._id}/click" target="_blank" onclick="recordAdClick('${ad._id}')">
                    <img src="${ad.image}" alt="${ad.title}" class="ad-image">
                </a>
            `;
        }
    });
}

// Record ad click
window.recordAdClick = async function(adId) {
    try {
        await ApiService.post(`/ads/${adId}/click`);
    } catch (error) {
        console.error('Error recording ad click:', error);
    }
};
