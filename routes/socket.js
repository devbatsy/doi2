const {v4:uuidv4} = require('uuid');

const fs = require('fs');
const path = require('path')

const createGameSession = require('../functionals/setSession');
const handleMultiplayer = require('../functionals/multiplayer');
const handleInitTournament = require('../functionals/initTournament')

const socketModule = ({wss}) =>{

        wss.on('connection', ws =>{
            console.log('connection made')
            ws.on('message',data =>{
                let parsed;
                try{
                    parsed = JSON.parse(data);
                    switch(true)
                    {
                        case parsed.type === 'multiplayer':
                            handleMultiplayer({reqData:parsed,ws:ws})
                        break;
                        case parsed.type === 'createTournament':
                            handleInitTournament({reqData:parsed,ws:ws})
                        break;
                        default:
                            processData(parsed,ws)
                    }
                }
                catch(err)
                {
                    console.log(err)
                }
            })
        })

}


function processData(data,ws)
{
    switch(true)
    {
        case data.post === 'accCreate':
            console.log(data)



            const processData = async(data) =>{
                console.log('verifying your signup details')
                return{
                    status:true,
                    userID:uuidv4()
                }
            }   




            processData(data)
            .then((response) =>{
                ws.send(JSON.stringify(
                    {
                        post:'accCreate',
                        msg:response
                    }
                ))
            }).catch(err =>{console.log(err)})



        break;
        case data.post === 'accLogin':



            const processGetId = async(data) =>{
                console.log('time to process login details')
                return {
                    status:true,
                    userId:'0000'
                }
            }


            processGetId(data)
            .then((res) =>{
                ws.send(JSON.stringify(
                    {
                        post:'accLogin',
                        msg:res
                    }
                ))
            }).catch(err =>{console.log(err)})


        break;
        case data.post === 'reqJoinGame':


            const validateJoinCode = async(data) =>{
                
                const partGameId = data.msg.jC;
                let match = false

                fs.readFile(path.join(__dirname,'../gameSession.json'),(err,data) =>{
                    if(err) console.log(err)
                    else{
                        const mainFetch = JSON.parse(data.toString());
                        for(let i = 0; i < Object.keys(mainFetch).length; i++)
                        {
                            if(mainFetch[`${Object.keys(mainFetch)[i]}`]['getInvitable'] === partGameId)
                            {

                                ws.send(JSON.stringify(
                                    {
                                        post:'reqJoinGame',
                                        msg:{
                                            status:true,
                                            gameId:Object.keys(mainFetch)[i]
                                        }
                                    }
                                ))

                                console.log('found a match');
                                console.log(Object.keys(mainFetch)[i])
                                match = true
                                break;
                            }
                        }

                        switch(true)
                        {
                            case !match:
                                ws.send(JSON.stringify(
                                    {
                                        post:'reqJoinGame',
                                        msg:{
                                            status:false
                                        }
                                    }
                                ))
                        }
                    }
                })
            }

            validateJoinCode(data)

        break;
        case data.post === 'reqCreateGame':

        const result = createGameSession({gameID:uuidv4(),userID:data.msg.userID})
        .then((res) =>{
            switch(true)
            {
                case res !== null:
                    ws.send(JSON.stringify(
                        {
                            post:'reqCreateGame',
                            msg:res
                        }
                    ))
                break;
                default:
                    console.log('an error occured while trying to save data to file')
            }
        }).catch(err =>{console.log(err)})

            
    }
}


module.exports = socketModule