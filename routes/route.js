class route{
    constructor({express,path,websocket,urlencoded})
    {
        this.router = express.Router();
        // this.mongooose = require('mongoose');
        this.path = path;
        this.socketModule = require('./socket')({wss:websocket});
        this.urlencoded = urlencoded
        
        route.start(this)
    }
    static start(params)
    {
        const {router,path,urlencoded} = params;

        router
        .get('/',(req,res) =>{
            res.sendFile(path.join(__dirname,'../static/signUp/createAcc.html'))
        })
        .post('/player2bot',urlencoded, (req,res) =>{
            console.log(req.body)
            res.sendFile(path.join(__dirname,'../static/botGame/bot$player.html'))
        })
        .get('/login',(req,res) =>{
            res.sendFile(path.join(__dirname,'../static/login/login$doi.html'))
        })
        .get('/invite',(req,res) =>{
            // console.log(req.query.code);
            // console.log(req.query.joined);

            res.sendFile(path.join(__dirname,'../static/login/login$doi.html'))
        })
        .post('/gameMode',urlencoded, (req,res) =>{
            // console.log(req.body,' this is the game mode')
            // res.sendFile(path.join(__dirname,'../static/multiGame/multi$game.html'))
            res.render(path.join(__dirname,'../static/multiGame/multi$game.ejs'),{
                userID:req.body.userID
            })
        })
        .post('/gameInvite',urlencoded,(req,res) =>{
            // console.log(req.body, ' this is the invite player section')
            // res.sendFile(path.join(__dirname,'../static/invite/invite$game.html'))
            res.render(path.join(__dirname,'../static/invite/invite$game.ejs'),{
                userID:req.body.userID
            })
        })
        .post('/home',urlencoded,(req,res) =>{
            // console.log(req.body);
            res.render(path.join(__dirname,'../static/home/home$page.ejs'),{
                userID:req.body.userID
            })
            //save this data to the dataBase;
            // res.sendFile() send them the main game page
        })
        .post('/multiPlayerRoom',urlencoded,(req,res) =>{
            // console.log('this is the multi player room section')
            // console.log(req.body)

            res.render(path.join(__dirname,'../static/gameRoom/game$room.ejs'),{
                userID:req.body.userID,
                gameID:req.body.gameID,
            })
        })
        .get('/tournament',urlencoded,(req,res) =>{
            res.sendFile(path.join(__dirname,'../static/tournament/tour$main.html'))
        })
    }
}

module.exports = route;