document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter Form Submission
    const newsletterForms = document.querySelectorAll('#newsletter-form, #footer-newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                // In a real application, you would send this to your server
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    });
    
    // Validate Email Function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Lazy Loading Images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Ad Loading Simulation (in a real app, this would be your ad code)
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');
    
    adPlaceholders.forEach(placeholder => {
        // Simulate ad loading delay
        setTimeout(() => {
            placeholder.innerHTML = `
                <div class="ad-content" style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:#f5f5f5;color:#999;font-size:12px;">
                    Advertisement - ${placeholder.dataset.adSize}
                </div>
            `;
        }, 1000);
    });
    
    // Category Page Detection
    if (window.location.pathname.includes('category.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('cat');
        
        if (category) {
            document.title = `${category.charAt(0).toUpperCase() + category.slice(1)} News - News Portal`;
            
            const categoryTitle = document.querySelector('.category-title');
            if (categoryTitle) {
                categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} News`;
            }
        }
    }
    
    // Article Page Detection
    if (window.location.pathname.includes('article.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        if (articleId) {
            // In a real app, you would fetch the article data based on the ID
            // This is just a simulation
            simulateArticleLoad(articleId);
        }
    }
    
    // Article Loading Simulation
    function simulateArticleLoad(articleId) {
        // Simulate API call delay
        setTimeout(() => {
            const articleData = {
                title: "Global Leaders Meet to Discuss Climate Change Initiatives",
                category: "Politics",
                author: "John Smith",
                date: "June 22, 2023",
                image: "images/featured-news.jpg",
                content: `
                    <p>World leaders gathered at the annual climate summit to announce new measures aimed at reducing carbon emissions by 2030. The proposals include significant investments in renewable energy and stricter regulations for industries with high carbon footprints.</p>
                    
                    <p>The summit, held in Geneva, brought together representatives from over 100 countries to address what many are calling the most pressing issue of our time. "We cannot afford to wait any longer," said UN Secretary-General in his opening remarks. "The science is clear, and the time for action is now."</p>
                    
                    <h2>Key Proposals</h2>
                    
                    <p>The proposed measures include:</p>
                    
                    <ul>
                        <li>A global carbon tax system to incentivize emission reductions</li>
                        <li>Increased funding for developing nations to transition to clean energy</li>
                        <li>Phasing out coal-fired power plants by 2040 in developed nations</li>
                        <li>Stricter fuel efficiency standards for vehicles</li>
                        <li>Large-scale reforestation initiatives</li>
                    </ul>
                    
                    <p>While the proposals were generally well-received, some critics argue they don't go far enough. Environmental activists staged protests outside the summit venue, demanding more aggressive action.</p>
                    
                    <p>The final agreement is expected to be signed by the end of the week, with implementation beginning as early as next year.</p>
                `,
                tags: ["climate change", "environment", "politics", "summit"],
                relatedArticles: [
                    {id: 301, title: "New Study Shows Accelerating Ice Melt in Antarctica", category: "Science"},
                    {id: 302, title: "Renewable Energy Investments Reach Record High", category: "Business"},
                    {id: 303, title: "Youth Climate Activists Plan Global Strike", category: "Politics"}
                ]
            };
            
            // Update the article page with the fetched data
            document.title = `${articleData.title} - News Portal`;
            
            const articleImage = document.querySelector('.article-featured-img');
            if (articleImage) {
                articleImage.src = articleData.image;
                articleImage.alt = articleData.title;
            }
            
            const articleTitle = document.querySelector('.article-title');
            if (articleTitle) {
                articleTitle.textContent = articleData.title;
            }
            
            const articleMeta = document.querySelector('.article-meta');
            if (articleMeta) {
                articleMeta.innerHTML = `
                    <span class="author">By ${articleData.author}</span>
                    <span class="date">${articleData.date}</span>
                    <span class="category ${articleData.category.toLowerCase()}">${articleData.category}</span>
                `;
            }
            
            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
                articleContent.innerHTML = articleData.content;
            }
            
            const tagsContainer = document.querySelector('.article-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = articleData.tags.map(tag => 
                    `<a href="category.html?tag=${tag.toLowerCase()}">${tag}</a>`
                ).join(' ');
            }
            
            const relatedContainer = document.querySelector('.related-articles');
            if (relatedContainer) {
                relatedContainer.innerHTML = articleData.relatedArticles.map(article => `
                    <div class="related-article">
                        <a href="article.html?id=${article.id}">
                            <h4>${article.title}</h4>
                            <span class="category ${article.category.toLowerCase()}">${article.category}</span>
                        </a>
                    </div>
                `).join('');
            }
            
            // Update schema markup
            updateArticleSchema(articleData);
        }
    }
    
    // Update Article Schema Markup
    function updateArticleSchema(articleData) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": articleData.title,
            "image": [
                `https://www.yournewsportal.com/${articleData.image}`
            ],
            "datePublished": new Date(articleData.date).toISOString(),
            "dateModified": new Date(articleData.date).toISOString(),
            "author": {
                "@type": "Person",
                "name": articleData.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "News Portal",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.yournewsportal.com/images/logo.png"
                }
            },
            "description": articleData.content.substring(0, 160).replace(/<[^>]*>?/gm, '')
        });
        
        document.head.appendChild(script);
    }
    
    // Infinite Scroll (optional)
    let isLoading = false;
    
    window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        const scrollPosition = window.pageYOffset;
        const windowSize = window.innerHeight;
        const bodyHeight = document.body.offsetHeight;
        
        if (bodyHeight - (scrollPosition + windowSize) < 500) {
            isLoading = true;
            loadMoreArticles();
        }
    });
    
    function loadMoreArticles() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.textContent = 'Loading more articles...';
        document.querySelector('.news-grid').appendChild(loadingIndicator);
        
        // Simulate API call
        setTimeout(() => {
            // Remove loading indicator
            loadingIndicator.remove();
            
            // Add new articles
            const gridContainer = document.querySelector('.grid-container');
            if (gridContainer) {
                for (let i = 0; i < 2; i++) {
                    const newArticle = document.createElement('article');
                    newArticle.className = 'news-card';
                    newArticle.innerHTML = `
                        <div class="card-image">
                            <img src="images/news${Math.floor(Math.random() * 5) + 1}.jpg" alt="News Image" class="img-responsive">
                            <span class="category-badge ${['politics', 'technology', 'sports', 'business', 'entertainment'][Math.floor(Math.random() * 5)]}">
                                ${['Politics', 'Technology', 'Sports', 'Business', 'Entertainment'][Math.floor(Math.random() * 5)]}
                            </span>
                        </div>
                        <div class="card-content">
                            <h3><a href="article.html?id=${Math.floor(Math.random() * 1000)}">${generateRandomHeadline()}</a></h3>
                            <div class="meta">
                                <span class="author">By ${['John Smith', 'Sarah Johnson', 'Mike Thompson', 'Emily Chen', 'David Wilson'][Math.floor(Math.random() * 5)]}</span>
                                <span class="date">${new Date().toLocaleDateString()}</span>
                            </div>
                            <p>${generateRandomContent()}</p>
                            <a href="article.html?id=${Math.floor(Math.random() * 1000)}" class="read-more">Read More</a>
                        </div>
                    `;
                    gridContainer.appendChild(newArticle);
                }
            }
            
            isLoading = false;
        }, 1500);
    }
    
    function generateRandomHeadline() {
        const subjects = ['Scientists', 'Government', 'Company', 'Team', 'Researchers', 'Experts'];
        const verbs = ['discover', 'announce', 'reveal', 'unveil', 'create', 'develop'];
        const objects = ['new technology', 'breakthrough', 'solution', 'method', 'approach', 'strategy'];
        
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const object = objects[Math.floor(Math.random() * objects.length)];
        
        return `${subject} ${verb} ${object}`;
    }
    
    function generateRandomContent() {
        const sentences = [
            "The discovery could revolutionize the way we approach this long-standing problem.",
            "Early results show promising outcomes that exceed previous expectations.",
            "This development comes after years of research and testing in the field.",
            "Experts believe this could have far-reaching implications across multiple industries.",
            "The announcement was met with both excitement and skepticism from the scientific community.",
            "Further studies are needed to validate these initial findings.",
            "This breakthrough represents a significant step forward in our understanding."
        ];
        
        let content = '';
        for (let i = 0; i < 3; i++) {
            content += sentences[Math.floor(Math.random() * sentences.length)] + ' ';
        }
        
        return content;
    }
});
