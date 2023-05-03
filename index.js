const express = require('express');
const engine = require('ejs-locals');
const app = express();
app.use(express.urlencoded({extended: false}))

const db = require('./db');
db.connect();

app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

let singer;
let song;
let user;

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
db.query('SELECT * FROM User', function(error, results, fields){
    if(error) throw error;
    user = results;
});

app.get('/',function(req, res){
    res.render('login',{
        'title' : '登入',
        'user' : user
    })
})
app.get('/register',function(req,res){
    res.render('register',{
        'title':'註冊'
    })
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

// db.end();

const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});