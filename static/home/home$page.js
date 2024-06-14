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
            style:styleComponent.routeCont({method:'add',style:{
                color:'#fff',
                overflowY:'scroll'
            }})
        },
        [
            createElement(
                'div',
                {
                    style:styleComponent.gameForm({method:'add',style:{justifyContent:'space-between',padding:'10px 0',minHeight:'100%',height:'fit-content'}})
                },
                [
                    sydDOM.headerTitle(),
                    sydDOM.mainImage(),
                    sydDOM.menuButton(),
                    sydDOM.utilsTab(),
                    sydDOM.decForm()
                ]
            ),
        ]
    )
}

sydDOM.mainImage = () =>{
    return createElement(
        'div',
        {
            style:'min-height:200px;min-width:200px;width:50%;height:20%;max-height:250px;max-width:250px;'+styleComponent.bg({
                method:'add',
                style:{
                    backgroundImage:'url("../assets/homeMain.png")'
                }
            })
        }
    )
}

sydDOM.menuButton = () =>{
    playBtn = () =>{
        const decFormState = getState('decForm');
        decFormState.req = 'gameMode';
        decFormState.userID = userID;
        useState('decForm',{type:'a',value:decFormState})
        virtualDom['decForm'].submit()
    }
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;padding:5px 20px;display:flex;flex-direction:column;align-items:center;max-width:400px;row-gap:20px;transform:translateY(-40px)'
        },
        [
            createElement(
                'div',
                {
                    style:styleComponent.gameSubBtn({
                        method:'add',
                        style:{padding:'20px',width:'100%',fontSize:'20px',display:'flex',justifyContent:'center'}
                    }),
                    class:"click"
                },
                [
                    'Daily Challenge'
                ]
            ),
            createElement(
                'div',
                {
                    style:'width:100%;display:flex;justify-content:center;column-gap:15px;text-transform:capitalize'
                },
                [
                    createElement(
                        'div',
                        {
                            style:styleComponent.gameSubBtn({
                                method:'add',
                                style:{padding:'15px',width:'40%',fontSize:'20px',display:'flex',justifyContent:'center'}
                            }),
                            class:'click',
                            onclick:'playBtn()'
                        },
                        [
                            'Play'
                        ]
                    ),
                    createElement(
                        'div',
                        {
                            style:styleComponent.gameSubBtn({
                                method:'add',
                                style:{padding:'15px',width:'60%',fontSize:'20px',display:'flex',justifyContent:'center',position:'relative'}
                            }),
                            class:'click'
                        },
                        [
                            'spin wheel',
                            createElement('div',{style:'height:30px;width:30px;position:absolute;top:0;left:0;transform:translateY(-30%) translateX(-30%);'+styleComponent.bg({
                                method:'add',
                                style:{
                                    backgroundImage:'url("../assets/spin.png")',
                                    backgroundSize:'200%'
                                }
                            })})
                        ]
                    )
                ]
            )
        ]
    )
}

sydDOM.utilsTab = () =>{
    return createElement(
        'div',
        {
            style:'height:60px;width:100%;max-width:400px;padding:0 20px;display:flex;justify-content:space-between;align-items:center'
        },
        [
            createElement(
                'div',
                {
                    style:'height:40px;width:40px;'+styleComponent.bg({
                        method:'add',
                        style:{
                            backgroundImage:'url("../assets/award.png")'
                        }
                    }),
                    onclick:'leaderBoard()',
                    class:'click'
                }
            ),
            createElement(
                'div',
                {
                    style:'height:40px;width:40px;'+styleComponent.bg({
                        method:'add',
                        style:{
                            backgroundImage:'url("../assets/badge.png")'
                        }
                    }),
                    onclick:'something()',
                    class:'click'
                }
            ),
            createElement(
                'div',
                {
                    style:'height:40px;width:40px;'+styleComponent.bg({
                        method:'add',
                        style:{
                            backgroundImage:'url("../assets/setting.png")'
                        }
                    }),
                    onclick:'settings()',
                    class:'click'
                }
            ),
            createElement(
                'div',
                {
                    style:'height:40px;width:40px;'+styleComponent.bg({
                        method:'add',
                        style:{
                            backgroundImage:'url("../assets/bell.png")'
                        }
                    }),
                    onclick:'notification()',
                    class:'click'
                }
            )
        ]
    )
}



mount(sydDOM.container())