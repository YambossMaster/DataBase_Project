const express = require('express');
const engine = require('ejs-locals');
const app = express();
/*
const db = require('./db');
db.connect();
*/
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

let singer;
let song;
/*
db.query('SELECT * FROM Singer', function(error, results, fields){
    if(error) throw error;
    singer = results;
});
db.query('SELECT * FROM Song', function(error, results, fields){
    if(error) throw error;
    song = results;
});
*/
app.get('/',function(req, res){
    res.render('login',{
        'title' : '登入'
        //'User' : user
    })
})
app.get('/register',function(req,res){
    res.render('register',{
        'title':'註冊'
    })
})
app.post('/home', function(req, res) {
    res.render('index', {
        'title': '首頁'
        // 'title': data[0].name
    });
})
app.get('/trend', function(req, res) {
    res.render('trend', {
        'title': '熱門',
        // 'title': data[1].name
        //'singer' : singer,
        //'song' : song
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

//db.end();

const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});