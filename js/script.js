// Function to create a bento grid card
function createCard(item) {
    // 使用div而不是a元素，移除链接功能
    const cardElement = document.createElement('div');
    cardElement.className = `card-container ${item.colSpan === 2 ? 'col-span-2' : 'col-span-1'}`;
    
    // 生成直达按钮HTML（如果有links字段）
    const directLinkButton = item.links ? 
        `<a href="${item.links.startsWith('http') ? item.links : 'http://' + item.links}" class="card-direct-link" target="_blank">点击直达</a>` : '';
    
    const cardHTML = `
        <div class="card ${item.hasPersistentHover ? 'persistent-hover' : ''}">
            <div class="card-pattern"></div>
            
            <div class="card-header">
                <div class="card-header-content">
                    <div class="icon-wrapper">
                        <i class='bx ${item.icon || 'bx-file'}' style="color: ${item.iconColor || '#3b82f6'}; font-size: 16px;"></i>
                    </div>
                    <span class="status-badge">${item.status || 'Blog'}</span>
                </div>
            </div>
            
            <div class="card-content">
                <h3 class="card-title">
                    ${item.title}
                    ${item.meta ? `<span class="card-meta">${item.meta}</span>` : ''}
                </h3>
                <p class="card-description">${item.description}</p>
            </div>
            
            <div class="card-footer">
                <div class="card-tags">
                    ${item.tags ? item.tags.map(tag => `<span class="card-tag">#${tag.name}</span>`).join('') : ''}
                </div>
                ${directLinkButton}
            </div>
            
            <div class="card-border"></div>
        </div>
    `;
    
    cardElement.innerHTML = cardHTML;
    return cardElement;
}

// Initialize the bento grid with Hexo posts
function initBentoGrid() {
    if (!window.HEXO_POSTS || !window.HEXO_POSTS.length) return;
    
    const bentoGrid = document.querySelector('.bento-grid');
    if (!bentoGrid) return;
    
    // Clear any existing content
    bentoGrid.innerHTML = '';
    
    // Process posts to create bento items
    let posts = window.HEXO_POSTS.slice(0, 10); // Limit to 10 posts
    
    const bentoItems = posts.map((post, index) => {
        // 提取文章摘要的更可靠方法
        let description = '';
        
        // 调试信息
        console.log('处理文章:', post.title);
        console.log('摘要数据:', post.excerpt);
        console.log('链接数据:', post.links);
        
        // 1. 尝试使用excerpt
        if (post.excerpt && post.excerpt.trim().length > 0) {
            // 去除HTML标签
            description = post.excerpt.replace(/<[^>]*>/g, '');
            console.log('使用摘要:', description);
        } 
        // 2. 尝试从内容中提取
        else if (post.content) {
            // 尝试查找 <!-- more --> 标记
            const moreSplit = post.content.split('<!-- more -->');
            if (moreSplit.length > 1) {
                // 使用 more 标记前的内容作为摘要
                description = moreSplit[0].replace(/<[^>]*>/g, '');
                console.log('使用more标记提取:', description);
            } else {
                // 去除HTML标签
                const plainText = post.content.replace(/<[^>]*>/g, '');
                // 取前200个字符
                description = plainText.substring(0, 200);
                // 如果内容被截断，添加省略号
                if (plainText.length > 200) {
                    description += '...';
                }
                console.log('使用内容提取:', description);
            }
        } 
        // 3. 如果都没有，使用默认文本
        else {
            description = '这篇文章没有摘要...';
            console.log('使用默认文本');
        }

        return {
            title: post.title,
            meta: moment(post.date).format('YYYY-MM-DD'),
            description: description,
            path: post.path,
            tags: post.tags,
            status: 'Post',
            colSpan: index % 5 === 0 ? 2 : 1, // Make every 5th post span 2 columns
            hasPersistentHover: index === 0, // First post has persistent hover
            icon: getIconForPost(index),
            iconColor: getColorForPost(index),
            links: post.links || '' // 添加links字段
        };
    });
    
    // Add each card to the grid
    bentoItems.forEach(item => {
        bentoGrid.appendChild(createCard(item));
    });
}

// Helper function to get a consistent icon for a post based on its index
function getIconForPost(index) {
    const icons = [
        'bx-file', 'bx-book-open', 'bx-news', 'bx-message-square-detail', 
        'bx-edit', 'bx-notepad', 'bx-book-content', 'bx-message-dots'
    ];
    return icons[index % icons.length];
}

// Helper function to get a consistent color for a post based on its index
function getColorForPost(index) {
    const colors = [
        '#3b82f6', '#10b981', '#ef4444', '#f59e0b', 
        '#8b5cf6', '#0ea5e9', '#6366f1', '#ec4899'
    ];
    return colors[index % colors.length];
}

// 主题切换功能
function initThemeSwitch() {
    const themeSwitch = document.querySelector('.theme-switch');
    if (!themeSwitch) return;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 如果有保存的主题设置，应用它
    if (savedTheme) {
        document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 如果用户系统偏好深色模式，应用深色主题
        document.documentElement.classList.add('dark');
    } else {
        // 默认为浅色模式
        document.documentElement.classList.add('light');
    }
    
    // 切换主题
    themeSwitch.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBentoGrid();
    initThemeSwitch();
}); 