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

var curUserID;
var curUserName;

// db.query('SELECT * FROM Singer', function(error, results, fields){
//     if(error) throw error;
//     singer = results;
// });
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
        let user = results;
        res.render('login',{
            'title' : '登入',
            'user' : user
        })
    });
})
app.get('/register',function(req,res){
    db.query('SELECT * FROM User', function(error, results, fields){
        if(error) throw error;
        let user = results;
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
    db.query(`SELECT newTable.*, singername FROM
        (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
        FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
        FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
        GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
        GROUP BY Song.song_id) AS newTable, Singer
        WHERE newTable.singer_id = Singer.singer_id
        ORDER BY rand() LIMIT 5`, function(error, results, fields){
        if(error) throw error;
        let recommendSong = results;
        res.render('musiclist', {
            'title': `安安，${curUserName}`,
            'song' : recommendSong
            //'title': data[0].name
        });
    });
})
app.get('/trend', function(req, res) {
    db.query(`SELECT newTable.*, singername FROM
    (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
	FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
	FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
	GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
	GROUP BY Song.song_id) AS newTable, Singer
    WHERE newTable.singer_id = Singer.singer_id
    ORDER BY playtime DESC`, function(error, results, field){
        if(error) throw error;
        let sortByPlaytime = results;
        res.render('musiclist', {
            'title': '熱門',
            'song' : sortByPlaytime
        });
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
        res.render('musiclist', {
            'title': '播放紀錄',
            'song' : playRecord
        });
    });
})
app.get('/playlist', function(req, res) {
    db.query(`SELECT PlayList.*, count(*) AS songCounts FROM AddRecord, PlayList WHERE PlayList.list_id = AddRecord.list_id AND PlayList.user_id = ${curUserID} GROUP BY PlayList.list_id ORDER BY createdate DESC;`, function(error, results, field){
        if(error) throw error;
        let lists = results;
        res.render('playlist', {
            'title': '你的清單',
            'lists': lists,
        });
    });
})
app.post('/search', function(req, res) {
    db.query(`SELECT newTable.*, singername FROM
    (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
    FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
    FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
    GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
    GROUP BY Song.song_id) AS newTable, Singer
    WHERE (newTable.songname LIKE '%${req.body.search}%' OR newTable.music_types LIKE '%${req.body.search}%' OR newTable.music_languages LIKE '%${req.body.search}%' OR singername LIKE '%${req.body.search}%') AND newTable.singer_id = Singer.singer_id`, function(error, results, fields){
        if(error) throw error;
        const searchResult = results;
        res.render('musiclist', {
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
    curUserName = req.body.login_username;
    console.log(curUserName);
    db.query(`SELECT user_id FROM User WHERE nickname = "${curUserName}"`, function(error, results, fields){
        if(error) throw error;
        curUserID = results[0].user_id;
        console.log(curUserID);
    });
    res.send(`<script>console.log("login success");window.location.href = '/home'</script>`);
})

app.get('/playlist/list', function(req, res) {
    let listID = Number(req.query.listID);
    db.query(`SELECT newTable.*, singername, PlayList.list_id, PlayList.listname, AddRecord.add_time FROM
    (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
    FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
    FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
    GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
    GROUP BY Song.song_id) AS newTable, Singer, AddRecord, PlayList
    WHERE newTable.singer_id = Singer.singer_id AND newTable.song_id = Addrecord.song_id AND PlayList.list_id = AddRecord.list_id AND PlayList.list_id = ${listID}
    ORDER BY AddRecord.add_time DESC;`, function(error, results, field){
        if(error) throw error;
        const song = results;
        res.render('musiclist', {
            title: `儲存於"${song[0].listname}"的歌曲`,
            song: song
        });
    });
})

app.post('/api/PlayingUpdate', function(req, res) {
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
app.post('/api/addMusicToList', function(req, res){
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

// 刪除目前使用者的全部播放紀錄
app.post('/api/clearHistory', function(req, res){
    db.query(`DELETE FROM PlayRecord WHERE user_id = ${curUserID}`, function(error, results, field){
        if(error) throw error;
    });
})

// db.end();

const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});