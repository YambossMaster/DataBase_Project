let demo = document.getElementById("demo");
let myAudio = document.getElementById("myAudio");
let footer = document.querySelector("footer");
demo.addEventListener("click", () => {
    scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
    // myAudio.src = "/static/music/0002.mp3";
});
if(window.location.pathname != "/"){
    setTimeout(function() {
        scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
        footer.classList.add("show");
    }, 1000);
}
if(window.location.pathname == "/"){
    myAudio.autoplay = false;
}

// header的圖片輪播
const banners = ["banner1.png", "banner2.png", "banner3.png", "banner4.png", "banner5.png"];
const banner = document.getElementById("imgs");
let index = 0;
setInterval(() => {
    index = (index + 1) % banners.length;
    banner.src = `/static/images/${banners[index]}`;
}, 10000);

// 音樂區塊的點擊事件
const musicBlocks = document.querySelectorAll('.musicBlock');
musicBlocks.forEach(musicBlock => {
    musicBlock.addEventListener("click", () => {
        myAudio.src = `/static/music/${musicBlock.id}.mp3`;
    });
});