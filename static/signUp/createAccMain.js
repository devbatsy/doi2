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


let socketConnection = false
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
            style:styleComponent.routeCont({method:'add',style:{overflow:'hidden'}}) + styleComponent.bg({method:'add',style:{backgroundSize:'cover'}})
        },
        [
            sydDOM.form(),
            sydDOM.avatarPage()
        ]
    )
}

sydDOM.form = () =>{
    return createElement(
        'form',
        {
            style:styleComponent.gameForm(),
            method:'POST',
            action:'/home'
        },
        [
            sydDOM.headerTitle(),
            sydDOM.inputs({name:'userName',ph:'User Name',type:'text'}),
            sydDOM.inputs({name:'eMail',ph:'E-mail',type:'email'}),
            sydDOM.inputs({name:'phone',ph:'Phone number',type:'number'}),
            sydDOM.inputs({name:'password',ph:'Password',type:'password'}),
            createElement(
                'input',
                {
                    style:'position:absolute;top:-1000px',
                    name:'userID'
                },
                [],
                {
                    type:'userID'
                }
            ),
            sydDOM.avatarInput(),
            sydDOM.chooseAv(),
            sydDOM.doneBtn()
        ],
        {
            createState:{
                stateName:'form',
                state:{data:{userName:'',eMail:'',phone:''}}
            },
            type:'form'
        }
    )
}

sydDOM.avatarInput = () =>{
    return createElement(
        'input',
        {style:'height:0;width:0;opacity:0;position:absolute;',name:'avatar',value:preState(['avatarInput','val'],'')},
        [],
        {
            createState:{
                stateName:"avatarInput",
                state:{val:''}
            },
            type:'avatarInput'
        }
    )
}

sydDOM.avatarPage = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;width:100%;background:rgba(0,0,0,.8);display:${preState(['avatarPage','d'],'none')};justify-content:center;align-items:center;opacity:${preState(['avatarPage','o'],'0')};position:absolute;top:50%;left:50%;transform:translateY(-50%) translateX(-50%);transition:all linear .3s`,
        },
        [
            sydDOM.mainPage()
        ],
        {
            createState:{
                stateName:'avatarPage',
                state:{d:'none',o:'0'}
            },
            type:'avatarPage'
        }
    )
}

sydDOM.mainPage = () =>{
    closeAvatar = () =>{
        const avatarState = getState('avatarPage');
        avatarState.o = '0';
        useState('avatarPage',{type:'a',value:avatarState})
        const timer = setTimeout(() => {
            const avatarState = getState('avatarPage');
            avatarState.d = 'none';
            useState('avatarPage',{type:'a',value:avatarState})
            clearTimeout(timer)
        }, 300);
    }
    return createElement(
        'div',
        {
            style:'height:100%;max-height:500px;width:100%;background:#F9E2B1;max-width:300px;display:flex;flex-wrap:wrap;column-gap:10px;justify-content:center;align-items:center;padding-top:30px;position:relative;'
            //+styleComponent.bg({method:'add',style:{backgroundImage:'url("../assets/upScroll.png")',backgroundSize:'108% 108%'}}),
        },
        [
            createElement('p',{style:'font-style:cursive;font-size:18px;color:#171717;position:absolute;top:10px;left:50%;transform:translateX(-50%);width:100%;text-align:center'},['Choose Your Avartar']),
            createElement('div',{style:'height:30px;width:30px;background:red;position:absolute;top:10px;left:10px;border-radius:50%',class:'click',onclick:'closeAvatar()'}),
            sydDOM.avatars(1),
            sydDOM.avatars(2),
            sydDOM.avatars(3),
            sydDOM.avatars(4),
            sydDOM.avatars(5),
            sydDOM.avatars(6),
            sydDOM.avatars(7),
            sydDOM.avatars(8),
            sydDOM.avatars(9),


        ]
    )
}

sydDOM.avatars = (id) =>{
    addAvatar = (id) =>{
        const state = getState('avatarInput');
        state.val = `${id}`
        useState('avatarInput',{type:'a',value:state});
        virtualDom['avaBtn'].style.color = 'green'
        closeAvatar()
    }
    return createElement(
        'div',
        {
            style:'height:100px;min-width:calc((100% / 3) - 10px);background:green'+styleComponent.bg({method:'add',style:{
                backgroundImage:`url('../assets/a${id}.png')`,
            }}),
            class:'click',
            onclick:`addAvatar('${id}')`
        }
    )
}

sydDOM.inputs = ({name,ph,type}) =>{
    inputting = (elem,name) =>{
        const formState = getState('form');
        formState.data[name] = elem.value;
        useState('form',{type:"a",value:formState})
    }
    return createElement(
        'input',
        {
            style:styleComponent.gameInput(),
            placeholder:ph,
            type:type,
            name:name,
            oninput:`inputting(this,'${name}')`
        }
    )
}

sydDOM.chooseAv = () =>{
    return createElement(
        'div',
        {
            style:'width:100%;max-width:400px;'
        },
        [
            sydDOM.avaBtn()
        ]
    )
}

sydDOM.avaBtn = () =>{
    avatar = () =>{
        const avatarState = getState('avatarPage');
        avatarState.d = 'flex';
        useState('avatarPage',{type:'a',value:avatarState})
        const timer = setTimeout(() => {
            const avatarState = getState('avatarPage');
            avatarState.o = '1';
            useState('avatarPage',{type:'a',value:avatarState})
            clearTimeout(timer)
        }, 100);
    }
    return createElement(
        'p',
        {
            onclick:'avatar()',
            class:'click',
            style:'text-decoration:underline;color:#fff;font-size:14px'
        },
        [
            'Choose Your Avatar'
        ],
        {
            type:'avaBtn'
        }
    )
}

sydDOM.doneBtn = () =>{
    submit = () =>{
        const formData = getState('form').data;
        const isEmpty = () =>{
            let bool = false
            for(let i = 0; i < Object.keys(formData).length;i++)
            {
                console.log(formData[Object.keys(formData)[i]].length)
                if(formData[Object.keys(formData)[i]].length === 0)
                {
                    bool = true;
                    break
                }
            }
            return bool;
        }
        switch(true)
        {
            case isEmpty():
                alert('Please Enter All Feilds')
            break;
            default:
                switch(true)
                {
                    case socketConnection:
                        ws.send(JSON.stringify(new serverPack('accCreate',formData)))
                    break;
                    default:
                        alert('you are disconnected, page will be reloaded shortly')
                        location.reload()
                }
        }
    }
    return createElement(
        'div',
        {
            style:styleComponent.gameSubBtn(),
            class:'click',
            onclick:'submit()'
        },
        [
            'create account'
        ]
    )
}


ws.addEventListener('open', () =>{
    socketConnection = true;
    ws.addEventListener('message',({data}) =>{
        const parsed = JSON.parse(data);
        switch(true)
        {
            case parsed.post === 'accCreate':
                switch(true)
                {
                    case parsed.msg.status:
                        console.log(parsed.msg);
                        virtualDom['userID'].value = parsed.msg.userID
                        virtualDom['form'].submit()
                }
        }
    })
})


ws.addEventListener('close', () =>{
    console.log('connection closed')
    socketConnection = false
})

mount(sydDOM.container())