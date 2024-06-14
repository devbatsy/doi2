import {
    createElement,
    mount,
    sydDOM,
    preState,
    useState,
    setStyle,
    styleComponent,
    getState
} from '../../sydneyDom.js'

guessBtn = () =>{
    const guessState = getState('guessBoard')

    const getBotFate = async () =>{
        let dead = 0;
        let injured = 0;
        let winState = 0;
        const p1State = getState('p1');
        for(let i = 0; i < 4; i++)
        {
                if(guessState.resime[i] === p1State.vbInitData[i])
                {
                    switch(true)
                    {
                        case p1State.box[i] !== 'dead':
                            dead++
                            p1State.box[i] = 'dead';
                            // const vP = getState('vPoint');
                            // vP.data = Number(vP.data) + 5; //change this to a mem value
                            // useState('vPoint',{type:'a',value:vP})

                    }
                }
                else{
                    const getIndex = p1State.vbInitData.indexOf(guessState.resime[i]);
                    switch(true)
                    {
                        case getIndex !== -1:
                            if(p1State.box[getIndex] !== 'dead')
                            {
                                switch(true)
                                {
                                    case p1State.box[getIndex] !== 'injured':
                                        injured++
                                        p1State.box[getIndex] = 'injured';
                                        // const vP = getState('vPoint');
                                        // vP.data = Number(vP.data) + 2;//change this to a mem value
                                        // useState('vPoint',{type:'a',value:vP})
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
        winState === 4 ? alert(`You win\n Bot Secret Code : ${p1State.vbInitData.join(' ')}`) : ''
    }

    const playerFate = (guessArray) =>{
        const p2State = getState('p2');
        // let dead = 0;
        // let injured = 0;
        let winState = 0
        for(let i = 0; i < 4; i++)
        {
                if(guessArray[i] === p2State.initData[i])
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

    getBotFate()
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



initOk = () =>{
    const changePlayBoard = () =>{
        const initState = getState('initState');
        const cBoardState = getState('callsBoard');
        const guessState = getState('guessBoard');
        guessState.d = 'flex'
        initState.d = 'none';
        cBoardState.d = 'flex';
        const timer = setTimeout(() =>{
            const cBoardState = getState('callsBoard');
            const guessState = getState('guessBoard');
            guessState.o = '1'
            cBoardState.h = '100%';
            useState('callsBoard',{type:'a',value:cBoardState})
            useState('guessBoard',{type:'a',value:guessState})
            clearTimeout(timer)
        },200)
        useState('initState',{type:'a',value:initState})
        useState('callsBoard',{type:'a',value:cBoardState})
        useState('guessBoard',{type:'a',value:guessState})
    }

    const initBotData = () =>{
        const p1State = getState('p1');
        const customArray = [0,1,2,3,4,5,6,7,8,9];
        const selected = []
        for(let i = 0; i < 4; i++)
        {
            const randNumber = Math.round(Math.random()*(customArray.length-1));
            p1State.vbInitData[i] = `${customArray[randNumber]}`;
            customArray.splice(randNumber,1)
        }
        console.log(p1State.vbInitData)
        useState('p1',{type:'a',value:p1State})
    }

    const initStateArr = getState('initState').resime
    const checkEmpty = () =>{
        let bool = true;
        for(let i = 0; i < 4;i++)
        {
            if(initStateArr[i].length === 0)
            {
                bool = false;
                break
            }
        }
        return bool
    }
    const checkRepeated = () =>{
        let bool = true;
        return new Set(initStateArr).size !== initStateArr.length ? true : false
    }

    switch(true)
    {
        case !checkEmpty():
            console.log('hey')
            alert('please enter all input feilds')
        break;
        default:
            switch(true)
            {
                case checkRepeated():
                    alert('Repeated codes are no allowed')
                break;
                default:
                    const p2State = getState('p2');
                    const playerCodeState = getState('playerCode');
                    playerCodeState.sCode = initStateArr.join(' ')
                    p2State.initData = initStateArr;
                    useState('p2',{type:'a',value:p2State});
                    useState('playerCode',{type:'a',value:playerCodeState});
                    changePlayBoard();
                    initBotData()
            }

    }
}


// const clock = {
//     timeStamp:new Date().getSeconds(),
//     min:10,
//     sec:0
// }

// function clockAnimate()
// {
//     requestAnimationFrame(clockAnimate);
//     const secondTimer = new Date().getSeconds()
//     switch(true)
//     {
//         case clock.timeStamp !== secondTimer:
//             clock.timeStamp = secondTimer
//             clock.sec--;
//             switch(true)
//             {
//                 case clock.sec < 0:
//                     clock.sec = 59;
//             }

//             switch(true)
//             {
//                 case clock.sec === 59:
//                     clock.min--;
//             }

//             console.log(`${clock.min} : ${clock.sec}`)
//     }
// }

// clockAnimate()