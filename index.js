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

// 轮播图逻辑
const carousel = document.querySelector('.carousel');
const inner = document.querySelector('.carousel-inner');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');
let currentIndex = 0;
let isTransitioning = false;

function updateCarousel() {
    if (isTransitioning) return;
    isTransitioning = true;
    inner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function showNext() {
    if (isTransitioning) return;
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}

function showPrev() {
    if (isTransitioning) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
}

// 触摸事件处理
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;
    if (swipeDistance > swipeThreshold) {
        showNext();
    } else if (swipeDistance < -swipeThreshold) {
        showPrev();
    }
}

// 按钮事件
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

// 自动播放
let autoPlayInterval = setInterval(showNext, 5000);

// 初始化显示第一张图片
updateCarousel();

// 当用户交互时暂停自动播放
carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
carousel.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(showNext, 5000);
});

// 过渡结束事件
inner.addEventListener('transitionend', () => {
    isTransitioning = false;
});
