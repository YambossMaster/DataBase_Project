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
if(window.location.pathname != "/home"){
    setTimeout(function() {
        scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
        // footer.classList.add("show");
    }, 1000);
}
if(window.location.pathname == "/home"){
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
    let musicCover = musicBlock.querySelector('.musicCover');
    let functionBar = musicBlock.querySelector('.functionBar');
    let storeButton = functionBar.querySelector('.store-button');
    let confirmForm = functionBar.querySelector('.confirm-form');
    let form = confirmForm.querySelector('form');

    // 最右邊儲存按鈕的點擊事件
    functionBar.addEventListener("click", () => {
        storeButton.style.display = "none";
        confirmForm.style.display = "block";
        
    });
    // 儲存至...輸入欄位提交事件
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let storeListInput = confirmForm.querySelector('#store-list');
        console.log(storeListInput.value);
        let addConfirm = confirm(`要將歌曲加入 「${storeListInput.value}」 ㄇ?`);
        if(addConfirm){
            fetch('http://localhost:3000/addMusicToList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({musicBlockId : musicBlock.id, storeList : storeListInput.value})
            })
            .then(response => {
                console.log('Success:', response);
                return response.json();
            })
            .then(data => {
                console.log(data);
                alert(data.message);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        storeListInput.value = "";
        confirmForm.style.display = "none";
        storeButton.style.display = "block";
    });

    musicCover.addEventListener("click", () => {
        footer.classList.add("show");
        myAudio.autoplay = true;
        myAudio.src = `/static/music/${musicBlock.id}.mp3`;

        console.log(JSON.stringify(musicBlock.id));

        // 使用fetch方法傳遞被點擊的音樂ID給後端，更新播放紀錄與播放次數
        fetch('http://localhost:3000/PlayingUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({musicBlockId : musicBlock.id})
        })
        .then(response => {
            console.log('Success:', response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    });
});

// 播放清單的點擊事件
const lists = document.querySelectorAll('.list');
lists.forEach(list => {
    list.addEventListener("click", () => {
        window.location.href = `/playlist/list?listID=${list.id}`;
    })
})
