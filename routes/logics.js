guessBtn = () =>{//A FUNCTION FIRED WHEN THE PLAYER FINISH INPUTTING HIS GUESS
    const guessState = getState('guessBoard')//THIS IS THE PLAYERS GUESS, ITS AN ARRAY OF NUMBERS THAT CONTAINS THE 4 DIGITS THAT THE PLAYER GUESSED (TYPE = ARRAY, LENGTH = 4 , EXAMPLE = ['1','2','3','4'])

    const getBotFate = async () =>{
        let dead = 0;
        let injured = 0;
        let winState = 0;
        const p1State = getState('p1');//THIS IS THE BOTS SECRET CODE , AN ARRAY OF 4 DIGITS THAT CONTAINS BOTS SECRET CODE (TYPE = ARRAY, LENGTH = 4 , EXAMPLE = ['1','2','3','4'])
        for(let i = 0; i < 4; i++)//create a for loop to loop through the arrays
        {
                if(guessState.resime[i] === p1State.vbInitData[i])//first compare if their position and value are equal, then label that position as dead
                {
                    switch(true)
                    {
                        case p1State.box[i] !== 'dead'://confirm that the position is not already dead
                            dead++//if this position is not already dead, increment the variable dead
                            p1State.box[i] = 'dead';//p1State.box[i] is an array with initialisation ['','','','',]
                            /*IGNORE THIS

                                // const vP = getState('vPoint');
                                // vP.data = Number(vP.data) + 5; //change this to a mem value
                                // useState('vPoint',{type:'a',value:vP})

                            */

                    }
                }
                else{
                    const getIndex = p1State.vbInitData.indexOf(guessState.resime[i]);//check if the specific number (guessState.resime[i]) in player guess is included in bots secret code
                    switch(true)
                    {
                        case getIndex !== -1://if this returns -1, it means the number is not in bot secret code
                            if(p1State.box[getIndex] !== 'dead') //confirm that the position is not already dead
                            {
                                switch(true)
                                {
                                    case p1State.box[getIndex] !== 'injured'://check if the position is not already injured
                                        injured++ //if this position is not already injured, increment the variable injured
                                        p1State.box[getIndex] = 'injured';//label that index injured
                                        /*IGNORE THIS

                                            // const vP = getState('vPoint');
                                            // vP.data = Number(vP.data) + 2;//change this to a mem value
                                            // useState('vPoint',{type:'a',value:vP})

                                         */
                                }
                            }
                        break;
                    }
                }
        }


        useState('p1',{type:'a',value:p1State});
        const call = `${guessState.resime.join('')} => ${dead}D ${injured}I`;
        const p2ColState = getState('p2Col');
        p2ColState.data.push(call);
        useState('p2Col',{type:'a',value:p2ColState})

        for(let i = 0; i < 4; i++)
        {
            switch(true)
            {
                case p1State.box[i] === 'dead':
                    winState++
                break;
            }
        }
        winState === 4 ? alert(`You win\n Bot Secret Code : ${p1State.vbInitData.join(' ')}`) : ''//check if player has won, that is, if winstate = 4
    }

    const playerFate = (guessArray) =>{
        //HERE , WERE JUST REPEATING THE LOGIC AS ABOVE, ONLY THAT , INSTEAD ON 'dead', we use '2', and instead of 'injured', we use '1'
        const p2State = getState('p2');
        // let dead = 0;
        // let injured = 0;
        let winState = 0
        for(let i = 0; i < 4; i++)
        {
                if(guessArray[i] === p2State.initData[i])//p2State.initData this is an array of the players secret code
                {
                    switch(true)
                    {
                        case p2State.params[i] !== '2':
                            // dead++
                            p2State.params[i] = '2';
                    }
                }
                else{
                    const getIndex = p2State.initData.indexOf(guessArray[i]);
                    switch(true)
                    {
                        case getIndex !== -1:
                            if(p2State.params[getIndex] !== '2')
                            {
                                switch(true)
                                {
                                    case p2State.params[getIndex] !== '1':
                                        // injured++
                                        p2State.params[getIndex] = '1';
                                }
                            }
                        break;
                    }
                }
        }
        useState('p2',{type:'a',value:p2State});
        // const call = `${guessArray.join('')} => ${dead}D ${injured}I`;
        // const p1ColState = getState('p1Col');
        // p1ColState.data.push(call);
        // useState('p1Col',{type:'a',value:p1ColState})

        for(let i = 0; i < 4; i++)
        {
            switch(true)
            {
                case p2State.params[i] === '2':
                    winState++
                break;
            }
        }
        winState === 4 ? alert(`Bot wins \nGuessed Your Secret Code ${p2State.initData.join('-')}`) : ''


    }

    getBotFate()//this function will set a random guess for the bot
    .then(() =>{
        const botGuess = () =>{
            const customArray = [0,1,2,3,4,5,6,7,8,9];
            const guessArray = ['','','',''];
            for(let i = 0; i < 4; i++)
            {
                const randNumber = Math.round(Math.random()*(customArray.length-1));
                guessArray[i] = `${customArray[randNumber]}`;
                customArray.splice(randNumber,1)
            }
            playerFate(guessArray)
        }
        botGuess()
    })
}