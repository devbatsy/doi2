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
            style:styleComponent.routeCont({method:'add',style:{overflow:'hidden'}})
        },
        [
            sydDOM.form()
        ]
    )
}

sydDOM.form = () =>{
    return createElement(
        'form',
        {
            style:styleComponent.gameForm({method:'add',style:{rowGap:'50px'}}),
            action:'/home',
            method:'POST'
        },
        [
            sydDOM.inputs('username','User Name','text'),
            sydDOM.inputs('password','Password','password'),
            createElement('input',{style:'position:absolute;height:0;width:0;border:none;opacity:0',name:'userId',type:'text'},[],{type:'uId'}),
            sydDOM.loginBtn()
        ],
        {
            createState:{
                stateName:'form',
                state:{data:{username:'',password:''}}
            },
            type:'form'
        }
    )
}

sydDOM.inputs = (name,ph,type) =>{
    inputting = (elem,name) =>{
        const formState = getState('form');
        formState.data[name] = elem.value;
        useState('form',{type:'a',value:formState})
    }
    return createElement(
        'input',
        {
            style:styleComponent.gameInput(),
            type:type,
            placeholder:ph,
            name:name,
            oninput:`inputting(this,'${name}')`
        }
    )
}

sydDOM.loginBtn = () =>{
    loginBtn = () =>{
        const formData = getState('form').data

        const isEmpty = () =>{
            let bool = false
            for(let i = 0; i < Object.keys(formData).length;i++)
            {
                // console.log(formData[Object.keys(formData)[i]].length)
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
                alert('Please Enter All Feilds');
            break;
            default:
                switch(true)
                {
                    case socketConnection:
                        ws.send(JSON.stringify(new serverPack('accLogin',formData)))
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
            onclick:'loginBtn()'
        },
        [
            'Login'
        ]
    )
}

ws.addEventListener('open',() =>{
    socketConnection = true
    ws.addEventListener('message',({data}) =>{
        const parsed = JSON.parse(data)
        switch(true)
        {
            case parsed.post === 'accLogin':
                switch(true)
                {
                    case parsed.msg.status:
                        virtualDom['uId'].value = parsed.msg.userId
                        virtualDom['form'].submit()
                }
        }
    })
})

ws.addEventListener('close',() =>{
    socketConnection = false
})

mount(sydDOM.container())