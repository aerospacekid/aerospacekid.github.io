document.addEventListener('DOMContentLoaded', function() {
    // 站点启动日期：2025年3月31日
    const startDate = new Date(2025, 2, 31); // 月份是从0开始的，所以2代表3月
    
    // 获取当前日期
    const currentDate = new Date();
    
    // 若当前时间早于站点启动日期，则使用站点启动日期作为参考
    const referenceDate = currentDate < startDate ? startDate : currentDate;
    
    // 计算已经运行的天数
    const diffTime = Math.abs(referenceDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 初始访问量
    const initialVisits = 1019;
    
    // 每天随机增加19-50个访问量
    function calculateTotalVisits(days) {
        let totalVisits = initialVisits;
        for (let i = 0; i < days; i++) {
            totalVisits += Math.floor(Math.random() * (50 - 19 + 1)) + 19;
        }
        return totalVisits;
    }
    
    // 计算总访问量
    const totalVisits = calculateTotalVisits(diffDays);
    
    // 更新Uptime
    document.getElementById('uptime-value').textContent = `${diffDays} days`;
    
    // 更新访问量
    document.getElementById('total-visits-value').textContent = totalVisits.toLocaleString();
    
    // 随机生成响应时间（60-120ms）
    const responseTime = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
    document.getElementById('response-time-value').textContent = `${responseTime} ms`;
    
    // 随机生成服务器负载（8-25%）
    const serverLoad = Math.floor(Math.random() * (25 - 8 + 1)) + 8;
    document.getElementById('server-load-value').textContent = `${serverLoad}%`;
    
    // 随机生成可用性（99.5-100%）
    const availability = (99.5 + Math.random() * 0.5).toFixed(2);
    document.getElementById('availability-value').textContent = `${availability}%`;
    
    // 随机生成构建时间（1.1-3.5秒）
    const buildTime = (1.1 + Math.random() * 2.4).toFixed(1);
    document.getElementById('build-time-value').textContent = `${buildTime} sec`;
    
    // SSL状态 - 始终显示Valid
    document.getElementById('ssl-status-value').textContent = 'Valid';
    
    // CDN状态 - 偶尔显示性能评级
    if (Math.random() > 0.7) {
        const ratings = ["Fast", "Optimal", "Excellent"];
        const rating = ratings[Math.floor(Math.random() * ratings.length)];
        document.getElementById('cdn-status-value').textContent = `${rating}`;
    } else {
        document.getElementById('cdn-status-value').textContent = `Active`;
    }
    
    // 每30秒刷新一次响应时间和服务器负载
    setInterval(function() {
        // 随机更新响应时间
        const newResponseTime = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
        document.getElementById('response-time-value').textContent = `${newResponseTime} ms`;
        
        // 随机更新服务器负载
        const newServerLoad = Math.floor(Math.random() * (25 - 8 + 1)) + 8;
        document.getElementById('server-load-value').textContent = `${newServerLoad}%`;
    }, 30000);
}); 