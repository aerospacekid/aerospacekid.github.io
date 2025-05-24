/**
 * 主题脚本文件
 * 包含网站的主要交互功能
 */

// 错误处理函数 - 防止单个组件错误导致整个页面崩溃
function safeExecute(fn, fallback = () => {}) {
    try {
        return fn();
    } catch (error) {
        console.error('执行脚本出错:', error);
        return fallback();
    }
}

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 安全地执行各个初始化函数
    safeExecute(initFadeInAnimations);
    safeExecute(initMobileMenu);
    safeExecute(initLightningEffect);
    safeExecute(initPageTransitions);
    safeExecute(initTocNavigation);
});

// 初始化页面过渡效果
function initPageTransitions() {
    const transitionOverlay = document.getElementById('page-transition-overlay');
    if (!transitionOverlay) return;
    
    // 延迟一小段时间后隐藏过渡层，确保CSS加载完成
    setTimeout(function() {
        transitionOverlay.style.opacity = '0';
    }, 300);
    
    // 为所有站内链接添加过渡效果
    document.querySelectorAll('a').forEach(link => {
        // 只处理站内链接
        if (link.hostname === window.location.hostname || !link.hostname) {
            link.addEventListener('click', function(e) {
                // 不處理錨點鏈接
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    console.log("跳過錨點鏈接:", href);
                    return;
                }
                
                // 不處理目錄鏈接
                if (link.closest('.toc-content')) {
                    console.log("跳過目錄鏈接");
                    return;
                }
                
                // 检查是否是特殊链接
                if (!href || href === '' || href === '#' || href.startsWith('javascript:') || 
                    href.startsWith('mailto:') || href.startsWith('tel:') || 
                    link.target === '_blank' || e.ctrlKey || e.metaKey) {
                    return; // 不处理特殊链接或新窗口打开的链接
                }
                
                // 防止链接被多次点击，添加一个标记
                if (link.dataset.navigating === 'true') {
                    return;
                }
                link.dataset.navigating = 'true';
                
                e.preventDefault();
                transitionOverlay.style.opacity = '1';
                
                // 确保导航会执行
                setTimeout(function() {
                    window.location.href = href;
                }, 400);
                
                // 添加安全保障，5秒后如果还没跳转，强制跳转
                setTimeout(function() {
                    if (document.visibilityState !== 'hidden') {
                        window.location.href = href;
                    }
                }, 5000);
            });
        }
    });
}

// 初始化渐入动画
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}

// 初始化移动端菜单
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            // 计算菜单内容的高度
            if (mobileMenu.style.height === '0px' || mobileMenu.style.height === '') {
                mobileMenu.style.opacity = '0';
                mobileMenu.style.display = 'block';
                const height = mobileMenu.scrollHeight + 'px';
                mobileMenu.style.height = '0px';
                
                // 使用setTimeout确保过渡效果生效
                setTimeout(() => {
                mobileMenu.style.height = height;
                mobileMenu.style.opacity = '1';
                }, 10);
            } else {
                mobileMenu.style.height = '0px';
                mobileMenu.style.opacity = '0';
                
                // 动画结束后隐藏菜单
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 300);
            }
        });
    }
}

// 初始化技能雷达图
function initMiniSkillsChart() {
    const chartCanvas = document.getElementById('mini-skills-chart');
    if (!chartCanvas) return;

    // 获取当前主题
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth < 768;
    
    // 适配移动设备的技能标签
    const skillLabels = isMobile ? 
        ['Python', 'React', 'SQL', 'PyTorch', 'HF', 'LangChain'] : 
        ['Python', 'React', 'PostgreSQL', 'PyTorch', 'HuggingFace', 'LangChain'];
    
    // 根据主题设置颜色
    const chartColors = {
        backgroundColor: currentTheme === 'dark' ? 'rgba(100, 116, 139, 0.25)' : 'rgba(100, 116, 139, 0.2)',
        borderColor: currentTheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
        pointBackgroundColor: currentTheme === 'dark' ? 'rgba(148, 163, 184, 1)' : 'rgba(100, 116, 139, 1)',
        gridColor: currentTheme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.2)',
        angleLineColor: currentTheme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.2)',
        labelColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
    };
    
    // 创建雷达图
    const ctx = chartCanvas.getContext('2d');
    const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: skillLabels,
            datasets: [{
                label: '技能水平',
                data: [95, 90, 85, 88, 80, 85],
                backgroundColor: chartColors.backgroundColor,
                borderColor: chartColors.borderColor,
                borderWidth: 2,
                pointBackgroundColor: chartColors.pointBackgroundColor,
                pointBorderColor: currentTheme === 'dark' ? '#121212' : '#fff',
                pointHoverBackgroundColor: currentTheme === 'dark' ? '#121212' : '#fff',
                pointHoverBorderColor: chartColors.pointBackgroundColor
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        color: chartColors.angleLineColor
                    },
                    grid: {
                        color: chartColors.gridColor
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        display: false,
                        stepSize: 20
                    },
                    pointLabels: {
                        font: {
                            size: isMobile ? 10 : 11,
                            family: "'Noto Sans SC', sans-serif"
                        },
                        color: chartColors.labelColor,
                        padding: isMobile ? 2 : 5,
                        centerPointLabels: false
                    },
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + '%';
                        },
                        title: function(tooltipItems) {
                            // 在移动端显示完整的技能名称
                            if (isMobile) {
                                const index = tooltipItems[0].dataIndex;
                                const fullLabels = ['Python', 'React', 'PostgreSQL', 'PyTorch', 'HuggingFace', 'LangChain'];
                                return fullLabels[index];
                            }
                            return tooltipItems[0].label;
                        }
                    },
                    backgroundColor: currentTheme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    titleColor: chartColors.labelColor,
                    bodyColor: chartColors.labelColor,
                    borderColor: chartColors.borderColor,
                    borderWidth: 1
                }
            }
        }
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile) {
            // 重新加载图表，使用不同的标签
            radarChart.data.labels = newIsMobile ? 
                ['Python', 'React', 'SQL', 'PyTorch', 'HF', 'LangChain'] : 
                ['Python', 'React', 'PostgreSQL', 'PyTorch', 'HuggingFace', 'LangChain'];
                
            radarChart.options.scales.r.pointLabels.font.size = newIsMobile ? 10 : 11;
            radarChart.options.scales.r.pointLabels.padding = newIsMobile ? 2 : 5;
            radarChart.update();
        }
    });
    
    // 监听主题变化事件
    document.addEventListener('themeChanged', function(e) {
        const newTheme = e.detail.theme;
        
        // 更新颜色配置
        const newColors = {
            backgroundColor: newTheme === 'dark' ? 'rgba(100, 116, 139, 0.25)' : 'rgba(100, 116, 139, 0.2)',
            borderColor: newTheme === 'dark' ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)',
            pointBackgroundColor: newTheme === 'dark' ? 'rgba(148, 163, 184, 1)' : 'rgba(100, 116, 139, 1)',
            gridColor: newTheme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.2)',
            angleLineColor: newTheme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.2)',
            labelColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
        };
        
        // 更新图表配置
        radarChart.data.datasets[0].backgroundColor = newColors.backgroundColor;
        radarChart.data.datasets[0].borderColor = newColors.borderColor;
        radarChart.data.datasets[0].pointBackgroundColor = newColors.pointBackgroundColor;
        radarChart.data.datasets[0].pointBorderColor = newTheme === 'dark' ? '#121212' : '#fff';
        radarChart.data.datasets[0].pointHoverBackgroundColor = newTheme === 'dark' ? '#121212' : '#fff';
        radarChart.options.scales.r.angleLines.color = newColors.angleLineColor;
        radarChart.options.scales.r.grid.color = newColors.gridColor;
        radarChart.options.scales.r.pointLabels.color = newColors.labelColor;
        radarChart.options.plugins.tooltip.backgroundColor = newTheme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        radarChart.options.plugins.tooltip.titleColor = newColors.labelColor;
        radarChart.options.plugins.tooltip.bodyColor = newColors.labelColor;
        
        // 更新图表
        radarChart.update();
    });
}

// Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            
            if (rect.top <= viewHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check on page load
    checkFade();
    
    // Check on scroll
    window.addEventListener('scroll', checkFade);
});

// Fix iOS 100vh issue
document.addEventListener('DOMContentLoaded', function() {
    function setDocHeight() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    
    // Set on initial load
    setDocHeight();
    
    // Set on resize
    window.addEventListener('resize', setDocHeight);
});

// 初始化闪电效果
function initLightningEffect() {
    // 获取闪电容器
    const lightningContainer = document.getElementById('lightning-container');
    if (!lightningContainer) return;
    
    // 闪电路径元素
    const lightningPaths = document.querySelectorAll('.lightning-path');
    if (lightningPaths.length === 0) return;
    
    // 随机显示闪电效果的函数
    function createLightning() {
        // 随机选择一个闪电路径
        const randomIndex = Math.floor(Math.random() * lightningPaths.length);
        const path = lightningPaths[randomIndex];
        
        // 设置动画效果
        path.style.stroke = 'rgba(255, 255, 255, 0.9)';
        path.style.opacity = '1';
        
        // 快速闪烁后消失
        setTimeout(() => {
            path.style.opacity = '0.7';
            setTimeout(() => {
                path.style.opacity = '0.9';
                setTimeout(() => {
                    path.style.opacity = '0';
                    path.style.stroke = 'rgba(255, 255, 255, 0)';
                }, 80);
            }, 50);
        }, 80);
    }
    
    // 定时调用闪电效果
    function scheduleLightning() {
        // 随机时间间隔
        const interval = Math.random() * 15000 + 5000; // 5-20秒间隔
        
        setTimeout(() => {
            // 创建闪电效果
            createLightning();
            
            // 有30%的概率快速连续闪两次
            if (Math.random() < 0.3) {
                setTimeout(createLightning, 300);
            }
            
            // 安排下一次闪电
            scheduleLightning();
        }, interval);
    }
    
    // 启动闪电效果
    scheduleLightning();
}

// 初始化目录导航功能
function initTocNavigation() {
    const tocLinks = document.querySelectorAll('.article-toc-link');
    
    if (tocLinks.length === 0) {
        return;
    }
    
    // 为每个TOC链接添加点击事件
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            // 获取目标标题ID（移除开头的#）
            const id = href.substring(1);
            
            // 解码URL编码的ID
            const decodedId = decodeURIComponent(id);
                
            // 尝试查找目标标题元素
                let targetHeading = document.getElementById(decodedId);
                
            // 如果找不到解码后的ID，尝试使用原始ID
                if (!targetHeading) {
                targetHeading = document.getElementById(id);
                }
                
                if (targetHeading) {
                // 计算滚动位置，考虑固定导航栏的高度
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetHeading.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                // 平滑滚动到目标位置
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                // 更新URL，但不触发滚动
                    history.pushState(null, null, href);
                    
                // 高亮当前选中的目录项
                tocLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 如果URL中包含锚点，初始滚动到对应位置
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const targetHeading = document.getElementById(id);
        
        if (targetHeading) {
            setTimeout(() => {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetHeading.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
            }, 200);
            }
    }
} 