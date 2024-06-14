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

import '../routeStatic/socketConnect.js'
import '../routeStatic/route1.js'

let iCode = '';
let socketConnection = false;

class serverPack{
    constructor(post , msg)
    {
        this.post = post;
        this.msg = msg
    }
}

sydDOM.container = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.routeCont({
                method:'add',
                style:{
                    display:'flex',
                    flexDirection:'column',
                    rowGap:'20px',
                    justifyContent:'center',
                    textAlign:'center',
                    alignItems:'center'
                }
            })
        },
        [
            createElement('p',{style:'font-size:20px;color:#fff;'},['Enter Your Invitation Code']),
            createElement(
                'input',
                {
                    oninput:'inputting(this)',
                    style:'max-width:400px;width:80%',
                    type:'text'
                }
            ),
            createElement(
                'button',
                {
                    style:'padding:10px 15px',
                    onclick:'joinGame()',
                    class:'click'
                },
                [
                    'Join Game'
                ]
            ),
            createElement(
                'button',
                {
                    style:'padding:10px 15px',
                    class:'click',
                    onclick:'generateInvite()'
                },
                [
                    "Create Invite Link"
                ]
            ),
            sydDOM.code(),
            sydDOM.link(),
            sydDOM.decForm()
        ]
    )
}   

sydDOM.code = () =>{
    return createElement(
        'div',
        {},
        [
            `CODE : ${preState(['code','info'],'')}`
        ],
        {
            createState:{
                stateName:'code',
                state:{info:''}
            },
            type:'code'
        }
    )
}

sydDOM.link = () =>{
    return createElement(
        'div',
        {},
        [
            `LINK : ${preState(['link','info'],'')}`
        ],
        {
            createState:{
                stateName:'link',
                state:{info:''}
            },
            type:'link'
        }
    )
}

inputting = (elem) =>{
    iCode = elem.value;
    console.log(elem.value)
    console.log(iCode)
}

joinGame = () =>{
    switch(true)
    {
        case socketConnection:
            ws.send(JSON.stringify(new serverPack('reqJoinGame',{jC:iCode})))
    }
}

generateInvite = () =>{
    switch(true)
    {
        case socketConnection:
            ws.send(JSON.stringify(new serverPack('reqCreateGame',{userID:userID})))
    }
}

ws.addEventListener('open',() =>{
    socketConnection = true;

    ws.addEventListener('message',({data}) =>{
        const parsed = JSON.parse(data)
        switch(true)
        {
            case parsed.post === 'reqCreateGame':
                console.log(parsed.msg)
                const codeState = getState('code');
                const linkState = getState('link');
                codeState.info = parsed.msg.code;
                linkState.info = parsed.msg.link
                useState('code',{type:'a',value:codeState})
                useState('link',{type:'a',value:linkState})
            break;
            case parsed.post === 'reqJoinGame':
                switch(true)
                {
                    case parsed.msg.status:
                        console.log('code validation success');
                        const gameID = parsed.msg.gameId;
                        const decForm = getState('decForm');
                        decForm.userID = userID;
                        decForm.gameID = gameID;
                        decForm.req = 'multiPlayerRoom'
                        useState('decForm',{type:'a',value:decForm})
                        virtualDom['decForm'].submit()
                    break;
                    default:
                        console.log('code validation failed')
                }
        }
    })
})

ws.addEventListener('close',() =>{
    socketConnection = false
})

mount(sydDOM.container())