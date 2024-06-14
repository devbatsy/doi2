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

sydDOM.container = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.routeCont()
        },
        [
            sydDOM.optionMainPage(),
            sydDOM.decForm()
        ]
    )
}

sydDOM.optionMainPage = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.gameForm()
        },
        [
            sydDOM.headerTitle(),
            sydDOM.subPage()
        ]
    )
}

sydDOM.subPage = () =>{
    closePage = () =>{
        
        const decFormState = getState('decForm');
        decFormState.req = 'home';
        decFormState.userId = userID;
        useState('decForm',{type:'a',value:decFormState})
        virtualDom['decForm'].submit()

    }

    playerXbot = () =>{

        const decFormState = getState('decForm');
        decFormState.req = 'player2bot';
        decFormState.userID = userID;
        useState('decForm',{type:'a',value:decFormState})
        virtualDom['decForm'].submit()

    }

    invitePlayer = () =>{

        const decFormState = getState('decForm');
        decFormState.req = 'gameInvite';
        decFormState.userID = userID;
        useState('decForm',{type:'a',value:decFormState})
        virtualDom['decForm'].submit()

    }
    return createElement(
        'div',
        {
            style:'height:100%;width:100%;max-height:400px;max-width:500px;background:#F9E2B1;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;row-gap:30px;padding:0 20px;position:relative'
        },
        [
            createElement('div',{style:'height:30px;width:30px;background:red;position:absolute;top:10px;right:10px;border-radius:50%',class:'click',onclick:'closePage()'}),
            createElement(
                'div',
                {
                    style:styleComponent.gameSubBtn({
                        method:'add',
                        style:{padding:'20px',width:'100%',fontSize:'20px',background:'rgba(187, 201, 129)',display:'flex',justifyContent:'center'}
                    })+styleComponent.insetShadow(),
                    class:"press",
                    onclick:'playerXbot()'
                },
                [
                    'You & Computer'
                ]
            ),

            createElement(
                'div',
                {
                    style:styleComponent.gameSubBtn({
                        method:'add',
                        style:{padding:'20px',width:'100%',fontSize:'20px',background:'rgba(187, 201, 129)',display:'flex',justifyContent:'center'}
                    })+styleComponent.insetShadow(),
                    class:"press",
                    onclick:'invitePlayer()'
                },
                [
                    'Multiple Player'
                ]
            ),

            createElement(
                'div',
                {
                    style:styleComponent.gameSubBtn({
                        method:'add',
                        style:{padding:'20px',width:'100%',fontSize:'20px',background:'rgba(187, 201, 129)',display:'flex',justifyContent:'center'}
                    })+styleComponent.insetShadow(),
                    class:"press"
                },
                [
                    'Tournaments'
                ]
            )
        ]
    )
}

mount(sydDOM.container())