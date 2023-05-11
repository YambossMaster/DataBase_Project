const express = require('express');
const engine = require('ejs-locals');
const date = require('silly-datetime');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const db = require('./db');
db.connect();

app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

let singer;
let song;
let user;
var curUserID;

db.query('SELECT * FROM Singer', function(error, results, fields){
    if(error) throw error;
    singer = results;
});
// db.query('SELECT * FROM Song', function(error, results, fields){
//     if(error) throw error;
//     song = results;
// });

// db.query('SELECT * FROM User', function(error, results, fields){
//     if(error) throw error;
//     user = results;
// });

app.get('/',function(req, res){
    db.query('SELECT * FROM User', function(error, results, fields){
        if(error) throw error;
        user = results;
        res.render('login',{
            'title' : '登入',
            'user' : user
        })
    });
})
app.get('/register',function(req,res){
    db.query('SELECT * FROM User', function(error, results, fields){
        if(error) throw error;
        user = results;
        res.render('register',{
            'title':'註冊',
            'user' : user
        })
    });
})
app.post('/regfinish',function(req,res){
    let curDate = date.format(new Date(), 'YYYY-MM-DD');
    let userName = req.body.userName;
    let email = req.body.email;
    let gender = req.body.gender;
    let password = req.body.password;
    let birthday  =req.body.birthday;
    db.query(`INSERT INTO User(nickname, password, email, gender, birthday, regDate) VALUE("${userName}", "${password}", "${email}", "${gender}", "${birthday}", "${curDate}");`, function(error, results, fields){
        if(error) throw error;
        res.render('regfinish',{
            'title':'註冊',
            'user' : user,
            'userName' : userName,
            'email' : email,
            'genter' : gender,
            'password' : password,
            'birthday' : birthday,
            'regDate' : curDate
        })
    });
})
app.get('/home', function(req, res) {
    db.query(
        `SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
        FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
        FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
        GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
        GROUP BY Song.song_id;`, function(error, results, fields){
        if(error) throw error;
        song = results;
        res.render('index', {
            'title': '首頁',
            'singer' : singer,
            'song' : song
            //'title': data[0].name
        });
    });
})
app.get('/trend', function(req, res) {
    res.render('trend', {
        'title': '熱門',
        // 'title': data[1].name
        // 'singer' : singer,
        // 'song' : song
    });
})
app.get('/history', function(req, res) {
    db.query(`SELECT newTable.*, record, singername FROM
    (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
        FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
        FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
        GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
        GROUP BY Song.song_id) AS newTable, PlayRecord, Singer
        WHERE newTable.song_id = PlayRecord.song_id AND newTable.singer_id = Singer.singer_id AND PlayRecord.user_id = ${curUserID}
        ORDER BY record desc`, function(error, results, fields){
        if(error) throw error;
        let playRecord = results;
        res.render('history', {
            'title': '播放紀錄',
            'song' : playRecord
        });
    });
})
app.get('/playlist', function(req, res) {
    res.render('playlist', {
        'title': '你的清單'
    });
})
app.post('/search', function(req, res) {
    db.query(`SELECT newTable.*, singername FROM
    (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
    FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
    FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
    GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
    GROUP BY Song.song_id) AS newTable, Singer
    WHERE (newTable.songname LIKE '%${req.body.search}%' OR newTable.music_types LIKE '%${req.body.search}%' OR newTable.music_languages LIKE '%${req.body.search}%') AND newTable.singer_id = Singer.singer_id`, function(error, results, fields){
        if(error) throw error;
        const searchResult = results;
        res.render('search', {
            'title': '搜尋結果',
            'song' : searchResult,
            // 'title': data[2].name
        });
    });
    // if(req.body.search == "魔法禁書目錄"){
    //     res.render('search', {
    //         'title': 'haha'
    //         // 'title': data[2].name
    //     });
    // }
    // else {
    //     res.render('search', {
    //         'title': '菜逼八'
    //         // 'title': data[2].name
    //     });
    // }
})
app.post('/loginBuffer', function(req, res) {
    let userName = req.body.login_username;
    console.log(userName);
    db.query(`SELECT user_id FROM User WHERE nickname = "${userName}"`, function(error, results, fields){
        if(error) throw error;
        curUserID = results[0].user_id;
        console.log(curUserID);
    });
    res.send(`<script>console.log("login success");window.location.href = '/home'</script>`);
})

app.post('/PlayingUpdate', function(req, res) {
    let playingSongID = Number(req.body.musicBlockId);
    let curTime = date.format(new Date(), 'YYYY-MM-DD HH-mm-ss');
    console.log(playingSongID);

    // 更新點擊歌曲之播放次數
    db.query(`UPDATE Song SET playtime = playtime + 1 WHERE song_id = ${playingSongID}`, function(error, results, fields){
        if(error) throw error;
    });

    // 確認此音樂是否已經存在於播放紀錄中
    db.query(`SELECT COUNT(*) AS counts FROM PlayRecord WHERE user_id = "${curUserID}" AND song_id = "${playingSongID}"`, function(error, results, fields){
        if(error) throw error;
        let counts = results[0].counts;
        console.log(counts);
        if(counts != 0){ //若存在，則更新播放時間
            db.query(`UPDATE PlayRecord SET record = "${curTime}" WHERE user_id = "${curUserID}" AND song_id = "${playingSongID}"`, function(error, results, fields){
                if(error) throw error;
            });
        }
        else { //若不存在，新增此筆紀錄
            db.query(`INSERT INTO PlayRecord VALUE("${curUserID}", "${playingSongID}", "${curTime}")`, function(error, results, fields){
                if(error) throw error;
            });
        }
    });
    res.send('Success');
})

// 音樂加入清單請求
app.post('/addMusicToList', function(req, res){
    let curTime = date.format(new Date(), 'YYYY-MM-DD HH-mm-ss');
    let playingSongID = Number(req.body.musicBlockId);
    let storeList = req.body.storeList;
    console.log(typeof(storeList));
    console.log(playingSongID + " " + storeList);

    // 確認輸入的清單是否存在
    db.query(`SELECT count(*) AS counts FROM PlayList WHERE user_id = "${curUserID}" AND listname = "${storeList}"`, function(error, results, field){
        if(error) throw error;
        let playlistExist = results[0].counts;
        console.log("playlistExist" + playlistExist);
        if(!playlistExist){ //若清單不存在，則新建立一個
            db.query(`INSERT INTO PlayList(listname, createdate, user_id) VALUE("${storeList}", "${curTime}", "${curUserID}")`, function(error, results, field){
                if(error) throw error;
            });
        }
        // 取得輸入清單的編號
        db.query(`SELECT list_id FROM PlayList WHERE listname = "${storeList}"`, function(error, results, field){
            if(error) throw error;
            let listID = results[0].list_id;
            // 確認歌曲是否存在於輸入清單中
            db.query(`SELECT count(*) AS counts FROM AddRecord WHERE list_id = ${listID} AND song_id = ${playingSongID}`, function(error, results, field){
                let musicExistInList = results[0].counts;
                if(!musicExistInList){ //若不存在，將歌曲加入清單
                    db.query(`INSERT INTO AddRecord VALUE("${listID}", "${playingSongID}", "${curTime}")`, function(error, results, field){
                        if(error) throw error;
                    });
                    res.json({message: `已成功將歌曲加入 「${storeList}」`});
                }
                else {
                    res.json({message: `該歌曲已經在「${storeList}」中摟`});
                }
            });
        });
    });
})

// db.end();

const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});