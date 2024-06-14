import {
    createElement,
    mount,
    sydDOM,
    preState,
    useState,
    setStyle,
    styleComponent,
    getState,
    virtualDom
} from '../../sydneyDom.js'

import '../routeStatic/route1.js';
import '../routeStatic/socketConnect.js'

class serverPackage{
    constructor({post,msg = {}} = {})
    {
        this.type = 'multiplayer';
        this.post = post;
        this.msg = msg;
    }
}

const clockInit = {
    clockAnimator:null
}
// import './bot$player$func.js';
//Functions Section


const checkEmpty = (initStateArr) =>{
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


const checkRepeated = (initStateArr) =>{
    let bool = true;
    return new Set(initStateArr).size !== initStateArr.length ? true : false
}


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

function updateConnectionScreen(connectionData)
{
    const player1Connect = getState('player1Connect')
    const player2Connect = getState('player2Connect');
    const coverPage = getState('coverPage')
    let count = 0


    switch(true)
    {
        case connectionData.player1:
            player1Connect.bg = 'green';
            count++
        break;
        default:
            player1Connect.bg = 'red'
    }

    switch(true)
    {
        case connectionData.player2:
            player2Connect.bg = 'green';
            count++
        break;
        default:
            player2Connect.bg = 'red'
    }

    switch(count)
    {
        case 2:
            console.log('open the page to start game')
            coverPage.d = 'none'
        break;
        default:
            console.log('we are going to close game panel')
            coverPage.d = 'flex'
    }

    useState('player1Connect',{type:'a',value:player1Connect})
    useState('player2Connect',{type:'a',value:player2Connect})
    useState('coverPage',{type:'a',value:coverPage})
}

function updateClock({minute,seconds})
{
    const timer2 = getState('timer2');
    timer2.minute = minute;
    timer2.seconds = seconds;
    useState('timer2',{type:"a",value:timer2})
}

function updateSecretCodeScreen(connectionData)
{
    // changePlayBoard()
    const {player1, player2, prim, clockSpeed = {minute:0,seconds:30}} = connectionData
    switch(player1 && player2)
    {
        case true:
            changePlayBoard();
            const guessBoard = getState('guessBoard');

            const timerTab = getState('timerTab')
            switch(prim === userID.split('').join('%').slice(0,8))
            {
                case true:
                    console.log('its your turn to play')
                    guessBoard.pe = 'auto';
                    // setTimeout(() => {
                        Array.from(virtualDom['guessSubPanel'].children).forEach(val =>{
                            val.style.background = '#fff'
                            val.style.cursor = 'auto'
                        })
                    // }, 200);
                    //
                    timerTab.current = '1',
                    useState('timerTab',{type:'a',value:timerTab})
                    updateClock(clockSpeed)
                break;
                default:
                    console.log('not your turn to play');
                    guessBoard.pe = 'none';
                        Array.from(virtualDom['guessSubPanel'].children).forEach(val =>{
                            val.style.background = '#fb7676a1'
                            val.style.cursor = 'not-allowed';
                            val.value = '';
                            val.blur();
                        });

                        guessBoard.resime = ['','','',''];
                        timerTab.current = '2',
                        useState('timerTab',{type:'a',value:timerTab})
            }
            useState('guessBoard',{type:'a',value:guessBoard});
        break;
        default:
            console.log('we are not ready to open')
    }
}


function guessBtn(){
    const guessState = getState('guessBoard');

    const timerTab = getState('timerTab');
    const currentTimer = getState('timer1')
    timerTab.current = '0',
    useState('timerTab',{type:'a',value:timerTab})

    ws.send(JSON.stringify(
        new serverPackage({post:'playerGuess',msg:{
            userID:userID,
            gameID:gameID,
            guess:guessState.resime,
            clockSpeed:{
                minute:currentTimer.minute,
                seconds:currentTimer.seconds
            }
        }})
    ))
}


function updateCallsPage(calls)
{
    const p2ColState = getState('p2Col');
    p2ColState.data.push(calls.calls);
    useState('p2Col',{type:'a',value:p2ColState})
}



function initOk()
{
    const initStateArr = getState('initState').resime;
    switch(true)
    {
        case !checkEmpty(initStateArr):
            console.log('hey')
            alert('please enter all input feilds')
        break;
        default:
            switch(true)
            {
                case checkRepeated(initStateArr):
                    alert('Repeated codes are no allowed')
                break;
                default:
                    ws.send(
                        JSON.stringify(new serverPackage({post:'secretCode',msg:{
                            sCode:initStateArr,
                            userID:userID,
                            gameID:gameID
                        }}))
                    )

                    const playerCodeState = getState('playerCode');
                    playerCodeState.sCode = initStateArr.join(' ');
                    useState('playerCode',{type:'a',value:playerCodeState})
            }
    }
}

function clockAnimate()
{
    // requestAnimationFrame(clockAnimate);

    const timerTab = getState('timerTab');

    const secondTimer = new Date().getSeconds()
    switch(true)
    {
        case timerTab.timeStamp !== secondTimer:

        timerTab.timeStamp = secondTimer

        switch(true)
        {
            case timerTab.current !== '0':
                const currentTimer = getState(`timer${timerTab.current}`)
                currentTimer.seconds--;
                switch(true)
                {
                    case currentTimer.seconds < 0:
                        currentTimer.seconds = 59;
                }
    
                switch(true)
                {
                    case currentTimer.seconds === 59:
                        currentTimer.minute--;
                }

                switch(currentTimer.minute === 0 && currentTimer.seconds === 0)
                {
                    case true:
                        switch(timerTab.current === '1'){
                            case true:
                                ws.send(
                                    JSON.stringify(
                                        new serverPackage({post:'client-time-out',msg:{
                                            userID:userID,
                                            gameID:gameID
                                        }})
                                    )
                                )
                        }
                }

                switch(true)
                {
                    case currentTimer.minute < 0:
                        currentTimer.minute = 0;
                        currentTimer.seconds = 0
                        clearInterval(clockInit.clockAnimator)
                }
    
                useState(`timer${timerTab.current}`,{type:'a',value:currentTimer})
        }

        useState('timerTab',{type:'a',value:timerTab})
    }
}

function endGame({passCode,docs,sCode = ''})
{
    const timerTab = getState('timerTab');
    timerTab.current = '0';
    useState('timerTab',{type:'a',value:timerTab})
    switch(passCode === userID.split('').join('%').slice(0,8))
    {
        case true:
            switch(docs)
            {
                case '_time_':
                    alert('YOU WIN \n Your opponent ran out of time')
                break;
                case '_defeat_':
                    alert(`YOU WIN \n You guessed your opponent secret code : ${sCode}`)
            }
        break;
        default:
            switch(docs)
            {
                case '_time_':
                    alert('YOU LOSE \n You ran out of time')
                break;
                case '_defeat_':
                    alert('YOU LOSE \n Your opponent guess your secret code')
            }
    }
}

const timeStampTimeOut = setTimeout(() => {
    clockInit.clockAnimator = setInterval(() => {
        clockAnimate()
    }, 50);
    clearTimeout(timeStampTimeOut)
}, 1000);





//WEBSOCKET CONNECTION SECTION
ws.addEventListener('open',() =>{
    //send the server a hasMadeConnection message
    ws.send(
        JSON.stringify(
            new serverPackage({post:'connection',
                msg:{
                    userID:userID,
                    gameID:gameID
                }
            })
        )
    )

    ws.addEventListener('message', ({data}) =>{
        const parsed = JSON.parse(data);
        switch(parsed.type)
        {
            case 'multiplayer':
                switch(parsed.post)
                {
                    case 'connection-init':
                        updateConnectionScreen(parsed.msg)
                    break;
                    case 'disconnect-init':
                        updateConnectionScreen(parsed.msg)
                    break;
                    case 'secretCode-init':
                        updateSecretCodeScreen(parsed.msg)
                    break;
                    case 'player-calls':
                        updateCallsPage(parsed.msg);
                    break;
                    case 'client-end-game':
                        endGame(parsed.msg)
                }
        }
    })
})

setStyle([
    {
        nameTag:'gameBtn',
        style:{
            border:'none',
            background:'green',
            fontWeight:'500',
            fontSize:'18px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            height:'40px',
            color:'#fff',
            borderRadius:'10px',
            cursor:'pointer',
            padding:'0 15px'
        }
    },
    {
        nameTag:'callRowDesign',
        style:{
            height:'fit-content',
            width:'100%',
            background:'green',
            padding:'5px',
            display:'flex',
            justifyContent:'space-between'
        }
    },
    {
        nameTag:'coverPage',
        style:{
            height:'100%',
            width:'100%',
            position:'fixed',
            top:'0',
            left:'0',
            zIndex:'1200',
            background:'#171717',
            justifyContent:'center',
            alignItems:'center',
            borderRadius:'10px'
        }
    }
])

sydDOM.routeContainer = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.routeCont()
        },
        [
            createElement('div',{style:'height:100%;width:100%;background:rgba(0,0,0,.7)'},[
                sydDOM.headerFunc(),
                sydDOM.main(),
                sydDOM.decForm(),
                sydDOM.coverPage()
            ]),
        ]
    )
}

sydDOM.coverPage = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.coverPage({
                method:'add',
                style:{
                    display:preState(['coverPage','d'],'flex')
                }
            })
        },
        [
            sydDOM.connectionTab()
        ],
        {
            createState:{
                stateName:'coverPage',
                state:{
                    d:'flex'
                }
            },
            type:'coverPage'
        }
    )
}

sydDOM.connectionTab = () =>{
    return createElement(
        'div',
        {
            style:'background:#141414;border-radius:inherit;padding:10px;display:flex;flex-direction:column;row-gap:20px;width:80%;max-width:400px'
        },
        [
            createElement(
                'p',
                {

                },
                [
                    'CONNECTION TAB',
                ]
            ),
            createElement(
                'div',
                {
                    style:'display:flex;flex-direction:column;row-gap:15px;'
                },
                [
                    sydDOM.player1Connect(),
                    sydDOM.player2Connect(),
                ]
            )
        ]
    )
}

sydDOM.player1Connect = () =>{
    return createElement(
        'div',
        {
            style:'display:flex;align-items:center;column-gap:10px;padding:10px;width:100%;min-width:200px;justify-content:space-between;'
        },
        [
            'Player 1 (Host)',
            createElement(
                'div',
                {
                    style:`height:10px;width:10px;background:${preState(['player1Connect','bg'],'red')};border:0.5px solid #000;box-shadow:0 0 15px ${preState(['player1Connect','bg'],'red')};border-radius:50%;`
                }
            )
        ],
        {
            createState:{
                stateName:'player1Connect',
                state:{bg:'red'}
            },
            type:'player1Connect'
        }
    )
}

sydDOM.player2Connect = () =>{
    return createElement(
        'div',
        {
            style:'display:flex;align-items:center;column-gap:10px;padding:10px;width:100%;min-width:200px;justify-content:space-between;'
        },
        [
            'Player 2',
            createElement(
                'div',
                {
                    style:`height:10px;width:10px;background:${preState(['player2Connect','bg'],'red')};border:0.5px solid #000;box-shadow:0 0 15px ${preState(['player2Connect','bg'],'red')};border-radius:50%;`
                }
            )
        ],
        {
            createState:{
                stateName:'player2Connect',
                state:{bg:'red'}
            },
            type:'player2Connect'
        }
    )
}

sydDOM.main = () =>{
    return createElement(
        'div',
        {
            style:'min-height:500px;height:fit-content;width:100%;display:flex;padding:10px 25px;align-items:center;justify-content:center;align-items:center;row-gap:15px;position:relative;column-gap:20px',
            class:'main'
        },
        [
            createElement(
                'div',
                {
                    style:'display:flex;width:100%;padding:0 20px;justify-content:space-between;align-items:center;max-width:500px'
                },
                [
                    sydDOM.p2(),
                    sydDOM.p1(),
                ]
            ),
            sydDOM.timerTab(),
            sydDOM.guessBoard(),
            sydDOM.playDashBoard(),
        ]
    )
}

sydDOM.timerTab = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;display:flex;padding:0 20px;justify-content:space-between;align-items:center;max-width:500px'
        },
        [
            sydDOM.timer1(),
            sydDOM.timer2()
        ],
        {
            createState:{
                stateName:'timerTab',
                state:{timeStamp:new Date().getSeconds(),current:'0'}
            },
            type:'timerTab'
        }
    )
}

sydDOM.timer1 = () =>{
    const def = {
        min:0,
        sec:30
    }
    return createElement(
        'div',
        {
            style:styleComponent.vCash({method:'add',style:{height:'30px',display:'flex',justifyContent:'center',alignItems:'center'}})
        },
        [
            `0${preState(['timer1','minute'],def.min)}  :  ${`${preState(['timer1','seconds'],def.sec)}`.length === 1 ? '0' + preState(['timer1','seconds'],def.sec) : preState(['timer1','seconds'],def.sec)}`
        ],
        {
            createState:{
                stateName:'timer1',
                state:{minute:def.min,seconds:def.sec}
            },
            type:'timer1'
        }
    )
}

sydDOM.timer2 = () =>{
    const def = {
        min:0,
        sec:30
    }
    return createElement(
        'div',
        {
            style:styleComponent.vCash({method:'add',style:{height:'30px',display:'flex',justifyContent:'center',alignItems:'center'}})
        },
        [
            `0${preState(['timer2','minute'],def.min)}  :  ${`${preState(['timer2','seconds'],def.sec)}`.length === 1 ? '0' + preState(['timer2','seconds'],def.sec) : preState(['timer2','seconds'],def.sec)}`
        ],
        {
            createState:{
                stateName:'timer2',
                state:{minute:def.min,seconds:def.sec}
            },
            type:'timer2'
        }
    )
}

sydDOM.p1 = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:fit-content;max-width:400px;display:flex;flex-direction:column;align-items:center;row-gap:10px;padding:5px',
            class:'p1Move'
        },
        [
            createElement('p',{style:'font-size:20px;text-transform:capitalize'},[preState(['p1','opponentCred','name'],'opponent')]),
            createElement('img',{style:'min-height:50px;min-width:50px;max-height:50px;max-width:50px;border-radius:50%;background:blue',src:`../assets/${preState(['p1','opponentCred','avatar'],'a2')}.png`}),
            // createElement(
            //     'div',
            //     {
            //         style:'width:fit-content;height:fit-content;padding:5px 0;display:flex;column-gap:10px'
            //     },
            //     [
            //         sydDOM.boxP1({type:preState(['p1','box'],['alive','alive','alive','alive'])[0]}),
            //         sydDOM.boxP1({type:preState(['p1','box'],['alive','alive','alive','alive'])[1]}),
            //         sydDOM.boxP1({type:preState(['p1','box'],['alive','alive','alive','alive'])[2]}),
            //         sydDOM.boxP1({type:preState(['p1','box'],['alive','alive','alive','alive'])[3]}),
            //     ]
            // )
        ],
        {
            createState:{
                stateName:'p1',
                state:{box:['alive','alive','alive','alive'],vbInitData:['','','',''],opponentCred:{name:'bot',avatar:'a2'}}
            },
            type:'p1'
        }
    )
}
//0 => Alive
//1 => injured
//2 => Dead
sydDOM.p2 = () =>{
    const structure = () =>{
        const array = [];
        const state = preState(['p2','params'],['0','0','0','0']);
        const number = preState(['p2','initData'],['','','','']);
        state.forEach((val,id) =>{
            switch(val)
            {
                case '0':
                    array.push(sydDOM.boxP2({num:number[id]}))
                break;
                case '1':
                    array.push(sydDOM.boxP1({type:'injured'}))
                break;
                case '2':
                    array.push(sydDOM.boxP1({type:'dead'}))
            }
        })
        return array
    }
    return createElement(
        'div',
        {
            style:'height:fit-content;width:fit-content;max-width:400px;display:flex;flex-direction:column;align-items:center;row-gap:10px;padding:5px',
            class:'p2Move'
        },
        [
            createElement('p',{style:'font-size:20px;text-transform:capitalize'},['you']),
            createElement('img',{style:'min-height:50px;min-width:50px;max-height:50px;max-width:50px;border-radius:50%;background:blue',src:`../assets/a1.png`}),
            // createElement(
            //     'div',
            //     {
            //         style:'width:fit-content;height:fit-content;padding:5px 0;display:flex;column-gap:10px'
            //     },
            //     [
            //         ...structure()
            //     ]
            // )

        ],
        {
            createState:{
                stateName:'p2',
                state:{params:['0','0','0','0'],initData:['','','','']}
            },
            type:'p2'
        }
    )
}


sydDOM.boxP1 = ({type} = {}) =>{
    return createElement(
        'div',
        {
            style:`height:30px;width:30px;border-radius:5px;background:lightgrey;background-image:url('../assets/${type}.png');`+styleComponent.shadow()+styleComponent.bg()
        }
    )
}

sydDOM.boxP2 = ({num} = {}) =>{
    console.log(num)
    return createElement(
        'div',
        {
            style:`height:30px;width:30px;border-radius:5px;background:lightgrey;display:flex;justify-content:center;align-items:center;font-size:18px;`+styleComponent.shadow()
        },
        [
            `${num}`
        ]
    )
}

setStyle([
    {
        nameTag:'playDashBoard',
        style:{
            height:'300px',
            width:'100%',
            padding:'15px 5px',
            borderRadius:'20px',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            position:'relative',
            minHeight:'200px',
            background:' #F9E2B1',
            // backgroundImage:'url("../assets/scroll.png")',
            maxWidth:'350px',
        }
    }
])

sydDOM.playDashBoard = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.playDashBoard()
        },
        [
            sydDOM.initState(),
            sydDOM.callsBoard()
        ]
    )
}

sydDOM.initState = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;min-height:200px;width:100%;max-width:350px;display:${preState(['initState','d'],'flex')};row-gap:15px;flex-direction:column;align-items:center;justify-content:center;position:absolute;`
        },
        [
            createElement('p',{style:'font-size:18px;color:red;'},['Hi player, input your secret code']),
            createElement(
                'div',
                {
                    style:'width:fit-content;height:fit-content;padding:5px 0;display:flex;column-gap:10px'
                },
                [
                    sydDOM.initInput({type:'0',parent:'initState'}),
                    sydDOM.initInput({type:'1',parent:'initState'}),
                    sydDOM.initInput({type:'2',parent:'initState'}),
                    sydDOM.initInput({type:'3',parent:'initState'}),
                ]
            ),
            // sydDOM.okButton()
        ],
        {
            createState:{
                stateName:'initState',
                state:{d:'flex',resime:['','','',''],focus:'0'}
            },
            type:'initState'
        }
    )
}

sydDOM.guessBoard = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;width:100%;display:${preState(['guessBoard','d'],'none')};row-gap:15px;flex-direction:column;align-items:center;justify-content:center;opacity:${preState(['guessBoard','o'],'0')};transition:opacity .3s linear;z-index:50;pointer-events:${preState(['guessBoard','pe'],'none')}`
        },
        [
            // createElement('p',{style:'font-size:18px;color:red;'},['Enter your guess']),
            createElement(
                'div',
                {
                    style:'width:fit-content;height:fit-content;padding:5px 0;display:flex;column-gap:10px'
                },
                [
                    sydDOM.initInput({type:'0',parent:'guess'}),
                    sydDOM.initInput({type:'1',parent:'guess'}),
                    sydDOM.initInput({type:'2',parent:'guess'}),
                    sydDOM.initInput({type:'3',parent:'guess'}),
                ],
                {
                    type:'guessSubPanel'
                }
            ),
            // createElement(
            //     'div',
            //     {
            //         style:'display:flex;column-gap:10px;justify-content:center;width:100%;height:fit-content'
            //     },
            //     [
            //         sydDOM.gButton(),
            //         sydDOM.callsButton()
            //     ]
            // )
        ],
        {
            createState:{
                stateName:'guessBoard',
                state:{d:'none',resime:['','','',''],o:'0',pe:'none'}
            },
            type:'guessBoard'
        }
    )
}

sydDOM.callsBoard = () =>{
    // const renderCalls = () =>{
    //     const children = [];
    //     const in1 = preState(['callsBoard','data','p2'],[]).length;
    //     const in2 = preState(['callsBoard','data','p2'],[]).length
    // }
    // const secretCode = 
    return createElement(
        'div',
        {
            style:`height:${preState(['callsBoard','h'],'0%')};width:100%;display:${preState(['callsBoard','d'],'none')};row-gap:15px;flex-direction:column;align-items:center;position:absolute;top:0px;transition:height .3s linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%);z-index:60;border-radius:inherit;padding:10px 25px 0px 25px ;`+styleComponent.bg({method:'add',style:{backgroundSize:'100% 110%'}})//background-image:url('../assets/oldPage.png');
        },
        [
            createElement('p',{style:'font-size:25px;text-transform:uppercase;font-weight:700'},['calls']),
            sydDOM.playerCode(),
            createElement(
                'div',
                {
                    style:'height:100%;width:100%;display:flex;padding:10px'
                },
                [
                    sydDOM.p2Col(),
                    // sydDOM.p1Col(),
                ],
                {
                    type:'callsChild'
                }
            ),

        ],
        {
            createState:{
                stateName:'callsBoard',
                state:{
                    d:'none',
                    h:'0%',
                    data:{
                        p1:[],
                        p2:[]
                    }
                }
            },
            type:'callsBoard'
        }
    )
}

sydDOM.playerCode = () =>{
    return createElement(
        'p',
        {style:'font-size:18px;color:#171717;text-transform:capitalize'},
        [
            'secret code: ',createElement('p',{style:'font-weight:900;display:inline-block'},[preState(['playerCode','sCode'],'')])
        ],
        {
            createState:{
                stateName:'playerCode',
                state:{sCode:''}
            },
            type:'playerCode'
        }
    )
}

// sydDOM.defRow = () =>{
//     return createElement(
//         'div',
//         {
//             style:styleComponent.callRowDesign()
//         },
//         [
//             // createElement('p',{style:'text-transform:uppercase'},['favour']),
//             // createElement('p',{style:'text-transform:uppercase'},[preState(['p1','opponentCred','name'],'bot')])
            
//         ]
//     )
// }

sydDOM.p1Col = () =>{
    const childrenFunc = () =>{
        const array = [];
        array.push(sydDOM.txtNode(preState(['p1','opponentCred','name'],'bot')))
        const getVchild = preState(['p1Col','data'],[])
        getVchild.forEach(val =>{
            array.push(sydDOM.txtNode(val))
        })
        return array
    }
    return createElement(
        'div',
        {
            style:'height:fit-content;min-height:100%;width:50%;display:flex;flex-direction:column;row-gap:10px;align-items:flex-end;color:#171717'
        },
        [
            ...childrenFunc()
        ],
        {
            createState:{
                stateName:'p1Col',
                state:{data:[]}
            },
            type:'p1Col'
        }
    )
}

sydDOM.txtNode = (text) =>{
    return createElement(
        'p',
        {style:'text-transform:uppercase;display:flex;font-weight:900;font-size:14px'},[
            `${text}`
        ]
    )
}

sydDOM.p2Col = () =>{
    const childrenFunc = () =>{
        const array = [];
        // array.push(sydDOM.txtNode('favour'))
        const getVchild = preState(['p2Col','data'],[])
        getVchild.forEach(val =>{
            array.push(sydDOM.txtNode(val))
        })
        return array
    }
    return createElement(
        'div',
        {
            style:'height:fit-content;max-height:200px;flex-wrap:wrap;column-gap:30px;width:100%;display:flex;flex-direction:column;align-items:flex-start;overflow-x:scroll;row-gap:10px;color:#171717'
        },
        [
            ...childrenFunc()
        ],
        {
            createState:{
                stateName:'p2Col',
                state:{data:[]}
            },
            type:'p2Col'
        }
    )
}

sydDOM.rowElem = (id) =>{

}

sydDOM.initInput = ({type,parent} = {}) =>{
    inputting = (elem,type,parent) =>{
        const inputs = Array.from(document.querySelectorAll('.gamePrimeInput'));

        // check empty input code section

        const checkEmpty = (initStateArr) =>{
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

        // check empty input code section

        if(parent === 'initState')
        {
            const initState = getState('initState');
            initState.resime[type] = elem.value
            initState.focus = `${Number(type) + 1}`
            useState('initState',{type:'a',value:initState});

            switch(true)
            {
                case elem.value.length > 0:
                    switch(true)
                    {
                        case checkEmpty(initState.resime):
                            initOk()
                        break;
                        case Number(type) + 1 < 4:
                            inputs[4 + Number(type)].blur()
                            inputs[5 + Number(type)].focus();
                        break;
                        // case Number(type) + 1 === 4:
                    }
            }
        }
        else{
            const initState = getState('guessBoard');
            initState.resime[type] = elem.value
            useState('guessBoard',{type:'a',value:initState})
            switch(true)
            {
                case elem.value.length > 0:
                    switch(true)
                    {
                        case checkEmpty(initState.resime):
                            guessBtn()
                        break;
                        case Number(type) + 1 < 4:
                            inputs[Number(type)].blur()
                            inputs[1 + Number(type)].focus();
                        break;
                        // case Number(type) + 1 === 4:
                    }
            }
        }
    }
    return createElement(
        'input',
        {
            style:'height:35px;width:35px;border-radius:5px;background:#fff;border:none;outline:none;text-align:center;font-size:18px;'+styleComponent.shadowIn(),
            maxlength:'1',
            oninput:`inputting(this,${type},'${parent}')`,
            class:'gamePrimeInput',
            // type:'number'
        }
    )
}

sydDOM.okButton = () =>{
    return createElement(
        'button',
        {
            style:styleComponent.gameBtn(),
            // onclick:'initOk()'
        },
        [
            'OK'
        ]
    )
}
sydDOM.gButton = () =>{
    return createElement(
        'button',
        {
            style:styleComponent.gameBtn(),
            onclick:'guessBtn()'
        },
        [
            'GUESS'
        ]
    )
}

sydDOM.callsButton = () =>{
    callBtn = () =>{
        const callState = getState('callsBoard');
        const guessState = getState('guessBoard');
        guessState.o = '0';
        callState.d = 'flex'
        useState('callsBoard',{type:'a',value:callState});
        useState('guessBoard',{type:'a',value:guessState})
        const timer = setTimeout(() =>{
            const callState = getState('callsBoard');
            callState.h = '110%'
            useState('callsBoard',{type:'a',value:callState});
        },200)
    }
    return createElement(
        'button',
        {
            style:styleComponent.gameBtn(),
            // onclick:'callBtn()'
        },
        [
            'CALLS'
        ]
    )
}
mount(sydDOM.routeContainer())