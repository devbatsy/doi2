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

ws.addEventListener('open', () =>{
    console.log('we are connected')
})

class serverPackage{
    constructor({post,msg = {}} = {})
    {
        this.type = 'createTournament';
        this.post = post;
        this.msg = msg;
    }
}

sydDOM.container = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.routeCont()
        },
        [
            sydDOM.mainPage()
        ]
    )
}

sydDOM.mainPage = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.gameForm()
        },
        [
            // sydDOM.headerTitle(),
            sydDOM.subPage()
        ]
    )
}

sydDOM.subPage = () =>{
    return createElement(
        'div',
        {
            style:'height:100%;width:100%;border:1px solid grey;padding:10px 0;display:flex;flex-direction:column;row-gap:20px;overflow-y:scroll;align-items:center'
        },
        [
            sydDOM.headTitle(),
            createElement(
                'div',
                {
                    style:styleComponent.inputXdiv()
                },
                [
                    'Tournament Name',
                    sydDOM.inputTag('tournament')
                ]
            ),
            createElement(
                'div',
                {
                    style:styleComponent.inputXdiv({method:'add',style:{
                        border:'2px solid #fff',
                        borderRadius:'10px',
                        rowGap:'20px'
                    }})
                },
                [
                    'Registration End Mode',
                    sydDOM.clickableModel({text:'By Amount Of Registered Players',type:'regModeOne'}),
                    sydDOM.clickableModel({text:'By Registration Deadline',type:'regModeTwo'}),
                ]
            ),
            sydDOM.variableRegChoiceMain(),
            createElement(
                'div',
                {
                    style:styleComponent.inputXdiv({method:'add',style:{
                        border:'2px solid #fff',
                        borderRadius:'10px',
                        rowGap:'20px'
                    }})
                },
                [
                    'Tournament Mode',
                    sydDOM.clickableModel({text:'Fast Pace Tournament',type:'tModeOne'}),
                    sydDOM.clickableModel({text:'Long Duration Tournament',type:'tModeTwo'}),
                ]
            ),
            sydDOM.createTournamentBtn()
        ],
        {
            createState:{
                stateName:'subPage',
                state:{
                    name:'',
                    regMode:'',
                    regModeValue:{},
                    tournamentMode:''
                }
            },
            type:'subPage'
        }
    )
}

sydDOM.headTitle = () =>{
    return createElement(
        'p',
        {
            style:'font-size:25px;text-align:center'
        },
        [
            'Create Tournament'
        ]
    )
}

sydDOM.inputTag = (type) =>{
    inputting = (type,elem) =>{
        const subPage = getState('subPage');
        virtualDom[type] = elem
        switch(type)
        {
            case 'tournament':
                subPage.name = elem.value;
            break;
            case 'dateType':
                subPage.regModeValue[`${type}`] = elem.value;
            break;
            case 'amountType':
                subPage.regModeValue[`${type}`] = elem.value
        }
        useState('subPage',{type:'a',value:subPage})
    }
    return createElement(
        'input',
        {
            style:styleComponent.gameInput({method:'add',style:{textTransform:'capitalize'}}),
            oninput:`inputting('${type}',this)`
        }
    )
}

sydDOM.variableRegChoiceMain = () =>{
    const choiceOfRender = () =>{
        const init = preState(['variableRegChoiceMain','init'],'null')
        let element;
        switch(init)
        {
            case 'date':
                element = sydDOM.dateEndElem()
            break;
            case 'amount':
                element = sydDOM.amountEndElem()
        }
        return element === undefined ? '' : element
    }
    return createElement(
        'div',
        {
            style:styleComponent.inputXdiv({method:'add',style:{
                border:'2px solid #fff',
                borderRadius:'10px',
                rowGap:'20px',
                alignItems:'center',
                padding:'30px'
            }})
        },
        [
            choiceOfRender()
        ],
        {
            createState:{
                stateName:'variableRegChoiceMain',
                state:{init:'null'}
            },
            type:'variableRegChoiceMain'
        }
    )
}

sydDOM.dateEndElem = () =>{
    return createElement(
        'div',
        {
            style:'height:40px;width:100%;max-width:300px;background:#141414;display:flex;justify-content:space-between;align-items:center;padding:0 10px;column-gap:10px'
        },
        [
            sydDOM.dropInput('dateType'),
            sydDOM.dropDown()
        ]
    )
}

sydDOM.amountEndElem = () =>{
    return createElement(
        'div',
        {
            style:'height:40px;width:100%;max-width:300px;background:#141414;display:flex;justify-content:space-between;align-items:center;padding:0 10px;column-gap:10px'
        },
        [
            sydDOM.dropInput('amountType'),
            'Players'
        ]
    )
}

sydDOM.dropInput = (type) =>{
    return createElement(
        'input',
        {
            style:'height:30px;width:100%;background:#333;color:#fff;padding: 0 10px',
            oninput:`inputting('${type}',this)`
        },
        [],
        {
            type:type
        }
    )
}

sydDOM.dropDown = () =>{
    togDropDown = () =>{
        const dropMain = getState('dropMain');
        dropMain.d = 'flex';
        useState('dropMain',{type:'a',value:dropMain})
    }

    dropDownBlur = () =>{
        const dropMain = getState('dropMain');
        dropMain.d = 'none';
        useState('dropMain',{type:'a',value:dropMain})
    }
    return createElement(
        'div',
        {
            style:`height:30px;min-width:80px;background:#333;border:1px solid #171717;position:relative;display:flex;align-items:center;color:#fff;text-transform:capitalize;cursor:pointer`,
            onblur:'dropDownBlur()',
            tabindex:'0'
        },
        [
            createElement(
                'p',
                {style:'padding:0 10px;width:100%',onclick:'togDropDown()'},
                [
                    preState(['dropDown','current'],'select')
                ]
            ),
            sydDOM.dropMain()
        ],
        {
            createState:{
                stateName:'dropDown',
                state:{current:'select'}
            },
            type:'dropDown'
        }
    )
}

sydDOM.dropMain = () =>{
    updateDate = (content) =>{
        const dropDown = getState('dropDown');
        const dropMain = getState('dropMain');
        const subPage = getState('subPage');
        dropMain.d = 'none'
        dropDown.current = content;
        subPage.regModeValue['timeSpec'] = content
        useState('dropDown',{type:'a',value:dropDown})
        useState('dropMain',{type:'a',value:dropMain});
        useState('subPage',{type:'a',value:subPage});

        virtualDom['dateType'].value = ''
    }
    return createElement(
        'div',
        {
            style:'height:60px;width:100%;position:absolute;top:calc(100% + 1px);left:0;'
        },
        [
            createElement(
                'div',
                {
                    style:`height:fit-content;background:#333;padding:5px;min-height:60px;width:100%;display:${preState(['dropMain','d'],'none')};flex-direction:column;row-gap:5px;`
                },
                [
                    createElement('p',{class:'dropList',onclick:`updateDate('hours')`},['hours']),
                    createElement('p',{class:'dropList',onclick:`updateDate('days')`},['days']),
                    createElement('p',{class:'dropList',onclick:`updateDate('weeks')`},['weeks']),
                    createElement('p',{class:'dropList',onclick:`updateDate('months')`},['months']),
                ]
            )
        ],
        {
            createState:{
                stateName:'dropMain',
                state:{d:'none'}
            },
            type:'dropMain'
        }
    )
}

sydDOM.clickableModel = ({text = 'model',type = 'norm'} = {}) =>{
    clickableMod = (type, element) =>{
        let counter;
        counter = type === 'regModeOne' ? 'regModeTwo' : 'regModeOne';
        counter = type === 'tModeOne' || type === 'tModeTwo' ? (type === 'tModeOne' ? 'tModeTwo' : 'tModeOne' ) : counter

        virtualDom[type].children[0].children[0].style.background = '#02f502'
        virtualDom[counter].children[0].children[0].style.background = '#0c0c0c';

        const variableRegChoiceMain = getState('variableRegChoiceMain');
        const subPage = getState('subPage');

        switch(type)//variableRegChoiceMain
        {
            case 'regModeOne':
                variableRegChoiceMain.init = 'amount';
                subPage.regMode = 0;
                subPage.regModeValue = {};
                virtualDom['amountType'] !== undefined ? virtualDom['amountType'].value = '' : '';
            break;
            case 'regModeTwo':
                variableRegChoiceMain.init = 'date'
                subPage.regMode = 1;
                subPage.regModeValue = {}
                virtualDom['dateType'] !== undefined ? virtualDom['dateType'].value = '' : '';
        }

        switch(type)
        {
            case 'tModeOne':
                subPage.tournamentMode = 0;
            break
            case 'tModeTwo':
                subPage.tournamentMode = 1;
        }
        useState('variableRegChoiceMain',{type:'a',value:variableRegChoiceMain})
        useState('subPage',{type:'a',value:subPage})

    }
    return createElement(
        'div',
        {
            style:'height:30px;width:fit-content;padding:0 5px;display:flex;column-gap:10px;justify-content:center;align-items:center;border-radius:10px;text-transform:capitalize;cursor:pointer',
            onclick:`clickableMod('${type}',this)`
        },
        [
            createElement(
                'div',
                {
                    style:`min-height:18px;min-width:18px;background:#141414;border-radius:50%;display:flex;justify-content:center;align-items:center;`
                },
                [
                    createElement('div',{style:`min-height:10px;min-width:10px;background:#0c0c0c;border-radius:inherit;transition:background .2s linear`}),
                ]
            ),
            `${text}`
        ],
        {
            type:type
        }
    )
}

sydDOM.createTournamentBtn = () =>{
    submit = () =>{
        ws.send(
            JSON.stringify(
                new serverPackage({post:'create',msg:getState('subPage')})
            )
        )
    }
    return createElement(
        'div',
        {
            style:styleComponent.gameSubBtn({
                method:"add",
                style:{
                    fontSize:'13px',
                    background:'#02f502'
                }
            }),
            class:'press',
            onclick:'submit()'
        },
        [
            "Create"
        ]
    )
}

mount(sydDOM.container())