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

const curTime = date.format(new Date(), 'YYYY-MM-DD');

db.query('SELECT * FROM Singer', function(error, results, fields){
    if(error) throw error;
    singer = results;
});
// db.query('SELECT * FROM Song', function(error, results, fields){
//     if(error) throw error;
//     song = results;
// });
db.query(
    `SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
    FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
    FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
    GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
    GROUP BY Song.song_id;`, function(error, results, fields){
    if(error) throw error;
    song = results;
});
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
    let userName = req.body.userName;
    let email = req.body.email;
    let gender = req.body.gender;
    let password = req.body.password;
    let birthday  =req.body.birthday;
    db.query(`INSERT INTO User(nickname, password, email, gender, birthday, regDate) VALUE("${userName}", "${password}", "${email}", "${gender}", "${birthday}", "${regDate}");`, function(error, results, fields){
        if(error) throw error;
        res.render('regfinish',{
            'title':'註冊',
            'user' : user,
            'userName' : userName,
            'email' : email,
            'genter' : gender,
            'password' : password,
            'birthday' : birthday,
            'regDate' : curTime
        })
    });
})
app.get('/home', function(req, res) {
    res.render('index', {
        'title': '首頁',
        'singer' : singer,
        'song' : song
        //'title': data[0].name
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
    res.render('history', {
        'title': '播放紀錄'
        // 'title': data[2].name
    });
})
app.get('/playlist', function(req, res) {
    res.render('playlist', {
        'title': '你的清單'
    });
})
app.post('/search', function(req, res) {
    db.query(`SELECT * FROM
    (SELECT Song.*, GROUP_CONCAT(music_type SEPARATOR ', ') AS music_types, music_languages
    FROM Song INNER JOIN MusicType ON Song.song_id = MusicType.song_id INNER JOIN (SELECT Song.*, GROUP_CONCAT(language SEPARATOR ', ') AS music_languages
    FROM Song INNER JOIN MusicLanguage ON Song.song_id = MusicLanguage.song_id
    GROUP BY Song.song_id) AS songAndLanguages ON Song.song_id = songAndLanguages.song_id
    GROUP BY Song.song_id) AS newTable
    WHERE newTable.songname LIKE '%${req.body.search}%' OR newTable.music_types LIKE '%${req.body.search}%' OR newTable.music_languages LIKE '%${req.body.search}%';`, function(error, results, fields){
        if(error) throw error;
        const searchResult = results;
        res.render('search', {
            'title': '搜尋結果',
            'song' : searchResult,
            'singer' : singer
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

app.post('/PlayRecordUpdate', function(req, res) {
    let playingSongID = Number(req.body.musicBlockId);
    console.log(playingSongID);
    db.query(`SELECT COUNT(*) AS counts FROM PlayRecord WHERE user_id = "${curUserID}" AND song_id = "${playingSongID}"`, function(error, results, fields){
        if(error) throw error;
        let counts = results[0].counts;
        console.log(counts);
        if(counts != 0){
            db.query(`UPDATE PlayRecord SET record = "${curTime}" WHERE user_id = "${curUserID}" AND song_id = "${playingSongID}"`, function(error, results, fields){
                if(error) throw error;
            });
        }
        else {
            db.query(`INSERT INTO PlayRecord VALUE("${curUserID}", "${playingSongID}", "${curTime}")`, function(error, results, fields){
                if(error) throw error;
            });
        }
    });
    res.send('Success');
})

// db.end();

const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});