// 获取所有缩略图和主图
const thumbnails = document.querySelectorAll('.thumbnail-list img');
const mainImage = document.querySelector('.main-image');

// 为每个缩略图添加点击事件
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        // 更新主图的src为被点击的缩略图的src
        mainImage.src = this.src.replace('100x100', '600x400');
        
        // 移除所有缩略图的active类
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        // 给当前点击的缩略图添加active类
        this.classList.add('active');
    });
}); 