import { CardComponent } from "./CardComponent"
function SegmentTemplate(heading,name,image)
{
    const cardTemplate=document.createElement('template')
    cardTemplate.innerHTML=`
    <style>
        :host{
            background-color:#f7f7f7;
            min-width: 325px;        
            height: 30vh;
            pointer-events: inherit;
            border-top-left-radius: 50px;
            border-top-right-radius: 50px;
            scroll-snap-align:center;    
            transition: all 0.25s ease-in;
            z-index:9;
        }
        :host(:hover){
            backgroud-color:red;
            pointer-events: inherit;
        }
        .cardComponent{
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:space-evenly;
            align-items:center;
            padding:0px 0px;
            scroll-snap-align:center;    
        }
        .top{
            width:100%;
            display:flex;
            justify-content:space-around;
            align-items:center;
            padding:10px 0px;
            gap:10px;

        }
        .middle{
            display:flex;
            width:100%;
            justify-content:space-around;
        }

        .bottom{
            display:flex;
            width:100%;
            justify-content:center;
            align-items:center;
        }
        
        .cardHeading{
            font-weight:bold;
        }
        .price{
            border:1px solid #b5b5b5;
            border-radius:100px;
            display:flex;
            justify-content:center;
            align-items:center;
            padding:10px 15px;
            
        }

        .lftBtn:hover{
            cursor: pointer;
        }
        .rgtBtn:hover{
            cursor: pointer;
        }
        
    </style>
    <div class="cardComponent">    
        <div class="top">
            <div class="cardHeading">
                ${heading}
            </div>            
        </div>
        <div class="middle">
            <img class="lftBtn" src="/left.png">   
            <img src="${image}" width="100" class="cardImage">
            <img class="rgtBtn" src="/right.png">   
        </div>
        <div class="bottom">
            <p class="cardContentName">${name}</p>
        </div>

    </div>
    `
    return cardTemplate.content.cloneNode(true)

}

export class SegmentComponent extends HTMLElement
{
    constructor(intializer,heading,img,name,objectName,model){        
        super()  
        this.model=model;
        this.heading=heading;        
        this.img=img;
        this.name=name;        
        this.index=0;         
        this.objectName=objectName        
        this.intializer=intializer
        this.CardId=[]
        
        this.contentArray=[]
        const shadowRoot=this.attachShadow({mode:'open'})  
        
        shadowRoot.appendChild(SegmentTemplate(this.heading[this.index],this.name[this.index],this.img[this.index]))

        this.showData(this.objectName[this.index])

        this.leftButton=shadowRoot.querySelector('.lftBtn')

        this.leftButton.addEventListener('click',()=>{
            this.clearAllValue(this.objectName[this.index])
            if(0==this.index)
                this.index=this.heading.length-1;
            else
                this.index--;

            this.ChangeContent(shadowRoot,this.heading[this.index],this.img[this.index],this.name[this.index])                
            this.showData(this.objectName[this.index])
        })

        this.rightButton=shadowRoot.querySelector('.rgtBtn')

        this.rightButton.addEventListener("click",()=>{
            
            this.clearAllValue(this.objectName[this.index])            
            if(this.heading.length-1==this.index)
                this.index=0
            else
                this.index++;

            
            this.ChangeContent(shadowRoot,this.heading[this.index],this.img[this.index],this.name[this.index])
            this.showData(this.objectName[this.index])
        })
        
    }    

    async clearAllValue(prev)
    {
        await this.intializer.HideMeshFromObjects(await this.intializer.GetObjectByName(prev))
        
        this.CardId.map(i=>{
            document.querySelector(`#s${i}`).remove()            
        })
        this.CardId=[]
    }
    async showData(name)
    {
        let value=this.model[name];      
        await this.intializer.ShowAllMeshesFromObject(await this.intializer.GetObjectByName(name))

        value=Object.keys(value).filter((item)=>{
            if(item=='image')return false            
            if(item=="name")return false;                
            return true;
        })

        value.map(i=>{
            Object.keys(this.model[name][i]).filter(item=>{
                if(item!="heading")return true;                
                else return false;
            })
        })
        let objData=[]
        value.map(i=>{
            
            let price=[],objName=[],objColor=[],heading=[],objectName=[]
            price.push('default')
            objName.push('default')
            objColor.push('default')
            heading.push('default')
            objectName.push(i)            
            
            if(this.model[name][i].color)
            {
                this.model[name][i].color.map(j=>{
                    objColor.push(j.attribute_value)
                    price.push(j.attribute_price)
                    objName.push(j.attribute_name)
                    heading.push(this.model[name][i].heading)
                    objectName.push(i)
            })
            }

            objData.push({heading,price,objColor,objName,objectName})
        })
        
        let counter=0;
        objData.map(i=>{
            let card=new CardComponent(this.intializer,i.heading,i.price,i.objColor,i.objName,i.objectName)

            this.CardId.push(this.getAttribute('id').toString()+counter.toString());
            card.setAttribute('id','s'+this.CardId[this.CardId.length-1])

            document.querySelector(".item-list").appendChild(card)

            counter++;
        })
        
    }

    ChangeContent(shadowRoot,heading,img,name)
    {
        shadowRoot.querySelector('.cardHeading').innerHTML=heading;        
        shadowRoot.querySelector('.cardImage').src=img;
        shadowRoot.querySelector('.cardContentName').innerHTML=name;
    }

    
    connectedCallback(){
        // console.log("Added to the page")
    }

    disconnectedCallback(){
        // console.log("disconnected with page")
    }
    
    static get observedAttributes(){
        return ['id'];
    }

    get id()
    {
        return this.getAttribute('id')
    }

    set id(value)
    {
        this.setAttribute('id',value)
    }

    attributeChangedCallback(attrName,oldVal,newVal)
    {
        if(attrName.toLowerCase()=='content')
        {
            console.log(newVal)          
        }        
    }


}

customElements.define('segment-card',SegmentComponent)