// 初始化lightbox
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'fadeDuration': 300,
    'imageFadeDuration': 300,
    'showImageNumberLabel': false
});

// 添加保存按钮
const saveBtn = document.createElement('button');
saveBtn.className = 'lb-save-btn';
saveBtn.innerHTML = '<i class="fas fa-download"></i>保存图片';
saveBtn.style.display = 'none'; // 初始状态隐藏
document.body.appendChild(saveBtn);

// 保存图片功能
saveBtn.addEventListener('click', () => {
    const activeImage = document.querySelector('.lb-image');
    if (activeImage) {
        const imgSrc = activeImage.src;
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = 'shinelens_poster.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// 使用MutationObserver监听lightbox状态变化，包括DOM变动和样式属性变化
const observer = new MutationObserver((mutations) => {
    // 每次检测时获取lightbox容器
    const lightboxContainer = document.querySelector('.lightbox');
    if (lightboxContainer && getComputedStyle(lightboxContainer).display !== 'none') {
        // 预览模式下，显示保存按钮且确保在最顶层
        saveBtn.style.display = 'block';
        saveBtn.style.zIndex = '10000';
    } else {
        // 非预览模式下，隐藏保存按钮
        saveBtn.style.display = 'none';
    }
});

// 开始观察body元素的变化，并监听子节点和style属性的变化
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
});

// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    const totalItems = items.length;

    // 设置轮播图宽度
    carousel.style.width = `${totalItems * 100}%`;
    items.forEach(item => item.style.width = `${100 / totalItems}%`);

    // 下一张
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    // 上一张
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    // 更新轮播图位置
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * (100 / totalItems)}%)`;
    }

    // 绑定按钮事件
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 处理二维码点击事件
    const xhsQR = document.getElementById('xhs-qr');
    const gzhQR = document.getElementById('gzh-qr');

    let pressTimer;
    let isLongPress = false;

    function handleQRTouchStart(event) {
        isLongPress = false;
        pressTimer = setTimeout(() => {
            isLongPress = true;
            // 创建新的Image对象用于全屏显示
            const fullscreenImg = document.createElement('div');
            fullscreenImg.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;

            const img = document.createElement('img');
            img.src = event.target.src;
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;

            fullscreenImg.appendChild(img);
            document.body.appendChild(fullscreenImg);

            // 点击关闭全屏显示
            fullscreenImg.addEventListener('click', () => {
                document.body.removeChild(fullscreenImg);
            });
        }, 500); // 500ms长按阈值
    }

    function handleQRTouchEnd(event) {
        clearTimeout(pressTimer);
        // 如果不是长按，则让系统处理默认行为（如长按菜单）
        if (!isLongPress) {
            return;
        }
        event.preventDefault();
    }

    // 绑定触摸事件
    [xhsQR, gzhQR].forEach(qr => {
        qr.addEventListener('touchstart', handleQRTouchStart);
        qr.addEventListener('touchend', handleQRTouchEnd);
        qr.addEventListener('touchcancel', () => clearTimeout(pressTimer));
        qr.addEventListener('touchmove', () => clearTimeout(pressTimer));
    });
});
