const fs = require('fs');
const path = require('path');
const tempConnectionObject = {
    //format
    /*
        '56765-7657-567dfgdfg-456-4df':{
            player1:[],
            player2:[]
        }
    */
}

class connectionInit{
    constructor()
    {
        this.player1 = [];
        this.player2 = [];
    }
}


class createClientMultiplayer{
    constructor({msg = {},post = ''} = {})
    {
        this.type = 'multiplayer';
        this.post = post;
        this.msg = msg
    }
}





const fsRead = async ({id = ''}) =>{
    const sessionData = fs.readFileSync(path.join(__dirname,'../gameSession.json'))

    return JSON.parse(sessionData.toString())[`${id}`] === undefined ? [] : [JSON.parse(sessionData.toString())[`${id}`]]
}





const fsUpdate = async ({id = '',data = {}}) =>{
    const sessionData = fs.readFileSync(path.join(__dirname,'../gameSession.json'))
    const updatedData = JSON.parse(sessionData.toString());
    let err = false
    updatedData[`${id}`] = data;

    try{fs.writeFileSync(path.join(__dirname,'../gameSession.json'),JSON.stringify(updatedData))}
    catch(err)
    {
        err = true
    }

    return err;
}

const fsUnlink = async ({id}) =>{
    console.log(id)
    const sessionData = fs.readFileSync(path.join(__dirname,'../gameSession.json'))

    const updatedData = JSON.parse(sessionData.toString());

    let err = false

    delete updatedData[`${id}`];

    try{fs.writeFileSync(path.join(__dirname,'../gameSession.json'),JSON.stringify(updatedData))}
    catch(err)
    {
        err = true
    }

    return err;

}



const generateConnectionInfo = ({id}) =>{
    const outMail = {}
    Object.keys(tempConnectionObject[`${id}`]).forEach(val =>{
        switch(tempConnectionObject[`${id}`][`${val}`].length)
        {
            case 0:
                outMail[`${val}`] = false
            break;
            default:
                outMail[`${val}`] = true
        }
    })
    return outMail
}

const generateSecretCodeInfo = async ({id,host}) =>{
    const dataObj = await fsRead({id:id});
    const outMail = {}

    Object.keys(dataObj[0].secretCode).forEach(val =>{
        console.log(dataObj[0].secretCode[`${val}`].length)
        switch(dataObj[0].secretCode[`${val}`].length)
        {
            case 0:
                outMail[`${val}`] = false
            break;
            default:
                outMail[`${val}`] = true
        }
    })

    outMail['prim'] = host.split('').join('%').slice(0,8);
    return outMail
}



const sendJointParcel = ({parcel,id,post}) =>{
    Object.keys(tempConnectionObject[`${id}`]).forEach(val =>{
        switch(tempConnectionObject[`${id}`][`${val}`].length > 0)
        {
            case true:
                tempConnectionObject[`${id}`][`${val}`][0].send(JSON.stringify(
                    new createClientMultiplayer({msg:parcel,post:post})
                ))
        }
    })

    console.log('sent')
}


const processCalls = ({guess,sCode,antiPlayer}) =>{
    const paramsObject = {
        dead:0,
        injured:0,
        counterPlayer:antiPlayer
    }

    for(let i = 0; i < 4; i++)
        {
                if(guess[i] === sCode[i])
                {
                    switch(true)
                    {
                        case paramsObject.counterPlayer[i] !== 'dead':
                            paramsObject.dead++
                            paramsObject.counterPlayer[i] = 'dead';
                            // const vP = getState('vPoint');
                            // vP.data = Number(vP.data) + 5; //change this to a mem value
                            // useState('vPoint',{type:'a',value:vP})

                    }
                }
                else{
                    const getIndex = sCode.indexOf(guess[i]);
                    switch(true)
                    {
                        case getIndex !== -1:
                            if(paramsObject.counterPlayer[getIndex] !== 'dead')
                            {
                                switch(true)
                                {
                                    case paramsObject.counterPlayer[getIndex] !== 'injured':
                                        paramsObject.injured++
                                        paramsObject.counterPlayer[getIndex] = 'injured';
                                        // const vP = getState('vPoint');
                                        // vP.data = Number(vP.data) + 2;//change this to a mem value
                                        // useState('vPoint',{type:'a',value:vP})
                                }
                            }
                        break;
                    }
                }
        }

        return {
           process : paramsObject,
           guess:guess,
           calls:`${guess.join('')} => ${paramsObject.dead}D ${paramsObject.injured}I`
        }
}


const mainBoard = ({reqData,ws}) =>{
    switch(reqData.post)
    {
        case 'connection':
            sendNupdateConnection(reqData.msg,ws);
        break;
        case 'secretCode':
            sendUpdateSecretCode(reqData.msg,ws);
        break;
        case 'playerGuess':
            getCallsNupdate(reqData.msg,ws);
        break;
        case 'client-time-out':
            initiateEndGameSeq(reqData.msg,ws)
    }
}




module.exports = mainBoard;


async function sendNupdateConnection(msg,connection)
{
    const {userID,gameID} = msg;
    //get game session from fs and update session;
    const dataQuery = await fsRead({id:gameID});

    switch(dataQuery.length)
    {
        case 0:
            console.log('invalid game session');
            // connection.send()
        break;
        default:
            // console.log(dataQuery);
            let userName = ''
            const hostID = dataQuery[0].host.id;
            switch(hostID === userID)
            {
                case true:
                    userName = 'player1'
                break;
                default:
                    userName = 'player2'
            }

            switch(tempConnectionObject[`${gameID}`] === undefined)
            {
                case true:
                    tempConnectionObject[`${gameID}`] = new connectionInit()
            }

            switch(tempConnectionObject[`${gameID}`][userName].length === 0 && dataQuery[0].playerId[userName].length === 0)
            {
                case true:
                    tempConnectionObject[`${gameID}`][userName].push(connection)
                    dataQuery[0].playerId[userName].push(userID);

                    const updateFeed = await fsUpdate({id:gameID,data:dataQuery[0]});

                    switch(true)
                    {
                        case !updateFeed:
                            //send connection information to both gamers
                            const parcel = generateConnectionInfo({id:gameID});

                            sendJointParcel({parcel:parcel,id:gameID,post:'connection-init'})
                        break;
                        default:
                            console.log('proceeds failed')
                    }


                break;
                default:
                    console.log('sorry room is filled')
            }
    }
    
}

async function sendUpdateSecretCode (msg,connection)
{
    const {userID,gameID,sCode} = msg;

    const dataQuery = await fsRead({id:gameID});

    switch(dataQuery.length){
        case 0:
            console.log('seems game session doesnt exist')
        break;
        default:
            let userName = ''
            const hostID = dataQuery[0].host.id;

            switch(hostID === userID)
            {
                case true:
                    userName = 'player1'
                break;
                default:
                    userName = 'player2'
            }

            switch(dataQuery[0].secretCode[userName].length === 0)
            {
                case true:
                    dataQuery[0].secretCode[userName].push(sCode);

                    const updateFeed = await fsUpdate({id:gameID,data:dataQuery[0]});

                    switch(true)
                    {
                        case !updateFeed:
                            //send connection information to both gamers
                            const run = async() =>{
                                const parcel = await generateSecretCodeInfo({id:gameID,host:hostID});

                                sendJointParcel({parcel:parcel,id:gameID,post:'secretCode-init'})
                            }
                            run()
                        break;
                        default:
                            console.log('proceeds failed')
                    }
            }
    }
}


async function getCallsNupdate(msg,connection)
{
    const {userID,gameID,guess,clockSpeed} = msg;


    const dataQuery = await fsRead({id:gameID});

    switch(dataQuery.length){
        case 0:
            console.log('seems game session doesnt exist')
        break;
        default:
            let userName = '';
            let counterPart = ''
            const hostID = dataQuery[0].host.id;

            switch(hostID === userID)
            {
                case true:
                    userName = 'player1';
                    counterPart = 'player2'
                break;
                default:
                    userName = 'player2';
                    counterPart = 'player1'
            }

        const counterPartCode = dataQuery[0].secretCode[`${counterPart}`][0];

        const processResult = processCalls({guess:guess,sCode:counterPartCode,           antiPlayer:dataQuery[0].gameRec[`${counterPart}`]})

        dataQuery[0].gameRec[`${counterPart}`] = processResult.process.counterPlayer;
        dataQuery[0].deadpoints[`${counterPart}`] += processResult.process.dead;
        dataQuery[0].clockSpeed[`${userName}`].push(clockSpeed)
        // console.log(dataQuery[0])
        //console.log(processResult.calls)

        const updateFeed = await fsUpdate({id:gameID,data:dataQuery[0]});

        switch(updateFeed)
        {
            case false:
                sendJointParcel({parcel:{
                    player1:true,
                    player2:true,
                    prim:dataQuery[0].playerId[`${counterPart}`][0].split('').join('%').slice(0,8),
                    clockSpeed:clockSpeed
                },post:'secretCode-init',id:gameID})


                tempConnectionObject[`${gameID}`][`${userName}`][0].send(
                    JSON.stringify(
                        new createClientMultiplayer({post:'player-calls',msg:{calls:processResult.calls}})
                    )
                )

            break;
            default:
                console.log('proceeds failed')
        }

        switch(true)
        {
            case dataQuery[0].deadpoints[`${counterPart}`] === 4:
                initiateEndGameSeqAlpha({
                    userID:userID,
                    gameID:gameID
                },connection)
        }
    }
}

async function initiateEndGameSeq(msg,connection)
{
    const {userID,gameID} = msg;


    const dataQuery = await fsRead({id:gameID});

    switch(dataQuery.length){
        case 0:
            console.log('seems game session doesnt exist')
        break;
        default:
            let userName = '';
            let counterPart = ''
            const hostID = dataQuery[0].host.id;

            switch(hostID === userID)
            {
                case true:
                    userName = 'player1';
                    counterPart = 'player2'
                break;
                default:
                    userName = 'player2';
                    counterPart = 'player1'
            }

            sendJointParcel({parcel:{
                passCode:dataQuery[0].playerId[`${counterPart}`][0].split('').join('%').slice(0,8),
                docs:'_time_'
            },post:'client-end-game',id:gameID})
            //AWARD WINNER WITH SOME POINTS
            //DELETE GAME SESSION
            const delresult = await fsUnlink({id:gameID});
            switch(true)
            {
                case !delresult:
                    console.log(`GAME SESSION : ${gameID} HAS BEEN DELETED SUCCESSFULLY`)
                break;
                default:
                    console.log('an error occured while deleting session')
            }
    }
}

async function initiateEndGameSeqAlpha(msg,connection)
{
    const {userID,gameID} = msg;


    const dataQuery = await fsRead({id:gameID});

    switch(dataQuery.length){
        case 0:
            console.log('seems game session doesnt exist')
        break;
        default:
            let userName = '';
            let counterPart = ''
            const hostID = dataQuery[0].host.id;

            switch(hostID === userID)
            {
                case true:
                    userName = 'player1';
                    counterPart = 'player2'
                break;
                default:
                    userName = 'player2';
                    counterPart = 'player1'
            }

            sendJointParcel({parcel:{
                passCode:dataQuery[0].playerId[`${userName}`][0].split('').join('%').slice(0,8),
                docs:'_defeat_',
                sCode:dataQuery[0].secretCode[`${counterPart}`][0].join(' ')
            },post:'client-end-game',id:gameID})
            //AWARD WINNER WITH SOME POINTS
            //DELETE GAME SESSION
            const delresult = await fsUnlink({id:gameID});
            switch(true)
            {
                case !delresult:
                    console.log(`GAME SESSION : ${gameID} HAS BEEN DELETED SUCCESSFULLY`)
                break;
                default:
                    console.log('an error occured while deleting session')
            }
    }
}