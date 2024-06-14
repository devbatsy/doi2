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


setStyle(
    [
        {
            nameTag:'headerFunc',
            style:{
                height:'fit-content',
                width:'100%',
                // border:'1px solid green',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                padding:'5px 10px 5px 20px',
                position:'sticky',
                top:'0px',
                zIndex:'900'
            }
        },
        {
            nameTag:'routeCont',
            style:{
                height:'100vh',
                width:'100vw',
                background:'#333',
                position:'relative',
                overflowX:'hidden',
                color:'#fff',
                backgroundImage:'url("../assets/newbg.png")',
                fontFamily:'ubuntu',
                fontSize:'14px'
            }
        },
        {
            nameTag:'scoreCred',
            style:{
                minWidth:'150px',
                width:'50%',
                display:'flex',
                flexWrap:'wrap',
                columnGap:'20px',
                rowGap:'10px',
                height:'fit-content',
                // background:'red',
                padding:'5px',
                color:'#fff',
                justifyContent:'flex-end'
            }
        },
        {
            nameTag:'vCash',
            style:{
                height:'fit-content',
                width:'fit-content',
                minWidth:'80px',
                display:'flex',
                columnGap:'10px',
                padding:'5px',
                background:'#171717',
                border:'1px solid #fff',
                borderRadius:'10px',
                alignItems:'center',
                justifyContent:'space-between',
            }
        },
        {
            nameTag:'gameForm',
            style:{
                display:'flex',
                justifyContent:'flex-start',
                alignItems:'center',
                flexDirection:'column',
                rowGap:'30px',
                height:'100%',
                width:'100%',
                padding:'0 20px',
                paddingTop:'20px',
                background:'rgba(0,0,0,.7)',
                overflowY:'scroll'
            }
        },
        {
            nameTag:'gameSubBtn',
            style:{
                height:'fit-content',
                width:'fit-content',
                padding:'15px 30px',
                background:'rgba(187, 201, 129, 0.8)',
                textTransform:'capitalize',
                color:'#fff',
                borderRadius:'15px'
            }
        },
        {
            nameTag:"gameInput",
            style:{
                height:'50px',
                width:'100%',
                maxWidth:'400px',
                minHeight:'50px',
                border:'2px solid #fff',
                outline:'none',
                background:'unset',
                borderRadius:'10px',
                paddingLeft:'15px',
                color:'#fff'
            }
        },
        {
            nameTag:'inputXdiv',
            style:{
                height:'fit-content',
                width:'100%',
                maxWidth:'400px',
                display:'flex',
                flexDirection:'column',
                rowGap:'10px',
                padding:'10px'
            }
        },
        {
            nameTag:'insetShadow',
            style:{
                boxShadow:'2px 2px 5px rgba(0,0,0,.6) inset'
            }
        },
        {
            nameTag:'shadow',
            style:{
                // boxShadow:'-2px -2px 5px #171717,2px 2px 5px 1.5px #333 inset'
            }
        },
        {
            nameTag:'shadowIn',
            style:{
                boxShadow:'2px 2px 3px #000000bc inset'
            }
        },
        {
            nameTag:'bg',
            style:{
                backgroundSize:'contain',
                backgroundPosition:'center',
                backgroundRepeat:'no-repeat'
            }
        }
    ]
)

sydDOM.headerFunc = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.headerFunc(),
            class:'headerFunc'
        },
        [
            sydDOM.homeButton(),
            sydDOM.scoreCred()
        ]
    )
}

sydDOM.scoreCred = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.scoreCred()
        },
        [
            sydDOM.vCash(),
            sydDOM.vPoint()
        ]
    )
}

sydDOM.vCash = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.vCash()
        },
        [
            createElement('p',{style:''},[`${preState(['vCash','data'],'0')}`]),
            createElement('img',{style:'height:25px;width:25px;',src:'../assets/vcash.png'})
        ],
        {
            createState:{
                stateName:'vCash',
                state:{data:'0'}
            },
            type:'vCash'
        }
    )
}

sydDOM.vPoint = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.vCash()
        },
        [
            createElement('p',{style:''},[`${preState(['vPoint','data'],'0')}PT`]),
            createElement('img',{style:'height:25px;width:25px;',src:'../assets/vpoint.png'})
        ],
        {
            createState:{
                stateName:'vPoint',
                state:{data:'0'}
            },
            type:'vPoint'
        }
    )
}

sydDOM.decForm = () =>{
    return createElement(
        'form',
        {
            style:'position:absolute;top:-300px;pointer-events: none;height:0;width:0;cursor:pointer',
            action:`/${preState(['decForm','req'],'')}`,
            method:"POST"
        },
        [
            createElement('input',{name:'userID',value:preState(['decForm','userID'],'0000')}),
            createElement('input',{name:'gameID',value:preState(['decForm','gameID'],'')})
        ],
        {
            createState:{
                stateName:'decForm',
                state:{req:'',userID:'0000',gameID:''}
            },
            type:'decForm'
        }
    )
}

sydDOM.homeButton = () =>{
    returnHome = () =>{
        const decFormState = getState('decForm');
        decFormState.req = 'home';
        decFormState.userId = '0000';
        useState('decForm',{type:'a',value:decFormState})
        virtualDom['decForm'].submit()
    }
    return createElement(
        'div',
        {
            style:'min-height:40px;min-width:40px;border-radius:50%;background-image:url("../assets/home.png");'+styleComponent.bg(),
            class:'click',
            onclick:'returnHome()'
        }
    )
}


sydDOM.headerTitle = () =>{
    return createElement(
        'div',
        {
            style:'display:flex;flex-direction:column;row-gap:10px;text-align:center'
        },
        [
            createElement('h1',{style:'font-family:helvetica sans serif;font-style:italic;text-align:center;font-size:70px;line-height:50px;'},['****']),
            createElement('p',{style:'font-size:25px;text-transform:capitalize;display:flex'},[
                'deador',createElement('p',{style:'color:red'},['injured'])
            ])
        ]
    )
}