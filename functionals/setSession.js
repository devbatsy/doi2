const fs = require('fs');
const path = require('path');
class createSession{
    constructor({userID,gameID})
    {
        this.host = {id:userID};
        this.clockSpeed = {
            player1:[],
            player2:[]
        }
        this.playerId = {
            player1:[],
            player2:[]
        };
        this.secretCode = {
            player1:[],
            player2:[]
        };
        this.gameRec = {
            player1:['','','',''],
            player2:['','','','']
        }
        this.deadpoints = {
            player1:0,
            player2:0
        }
        this.getInvitable = gameID.split('-').join('').slice(0,10)

    }
}
const func = async({gameID,userID}) =>{
    const readData = await fs.readFileSync(path.join(__dirname,'../gameSession.json'))
    let error = false

    let data1 = {}
    Object.assign(data1,JSON.parse(readData.toString()));
    // const appendable = {}
    data1[`${gameID}`] = new createSession({userID:userID,gameID:gameID});
    // Object.assign(data1,appendable)

    try{
        const result = await fs.writeFileSync(path.join(__dirname,'../gameSession.json'),JSON.stringify(data1))
    }
    catch(err)
    {
        console.log(err)
        error = true
    }

    const processCodeNLink = () =>{
        const parcel = {}

        parcel['code'] = gameID.split('-').join('').slice(0,10);
        parcel['link'] = process.env.serverUrl + `invite?code=${parcel['code']}&joined=false`
        return parcel
    }

    return error === true ? null : processCodeNLink()
    
}

module.exports = func