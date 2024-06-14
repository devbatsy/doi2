const fs = require('fs');
const path = require('path');
const {v4:uuidv4} = require('uuid');

class createTournament{
    constructor({data,tournamentID} ={})
    {
        this.name = data.name;
        this.regMode = data.regMode === 1 ? 'mode-deadline' : 'mode-maxUsers';
        this.tournamentMode = data.tournamentMode === 0 ? 'mode-fast' : 'mode-long';
        this.regModeValue = data.regModeValue;
        this.tID = tournamentID;
    }
}

const fsCreate = async ({data1,tournamentID}) =>{
    const readData = await fs.readFileSync(path.join(__dirname,'../tournamentSession.json'))
    let error = false

    let data2 = {}
    Object.assign(data2,JSON.parse(readData.toString()));

    data2[`${tournamentID}`] = new createTournament({data:data1,tournamentID:tournamentID})
    
    try{
        const result = await fs.writeFileSync(path.join(__dirname,'../tournamentSession.json'),JSON.stringify(data2))
    }
    catch(err)
    {
        console.log(err)
        error = true
    }

    return error
}

const main = ({reqData,ws}) =>{
    switch(true)
    {
        case reqData.post === 'create':
            processCreateTournament(reqData.msg,ws)
    }
}

module.exports = main;

async function processCreateTournament(msg,connection)
{
    const createResult = await fsCreate({data1:msg,tournamentID:uuidv4()});

    switch(createResult)
    {
        case false:
            console.log('tournament created successfully')
    }
}