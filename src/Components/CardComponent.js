function CardTemplate(heading,price,color,name)
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
        font-weight:500;
    }
    .price{
        border:1px solid #b5b5b5;
        border-radius:100px;
        display:flex;
        justify-content:center;
        align-items:center;
        padding:10px 15px;
        
    }
    .cardImage{        
        background-image:url('/transparent.png');
        width:100px;
        height:100px;
        border-radius:30%;
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
        <div class="price">
            ₹ ${price}
        </div>
    </div>
    <div class="middle">
        <img class="lftBtn" src="/left.png">   
        <div width="100" class="cardImage"></div>
        <img class="rgtBtn" src="/right.png">   
    </div>
    <div class="bottom">
        <p class="cardContentName">${name}</p>
    </div>

</div>
`
    return cardTemplate.content.cloneNode(true)
}
export class CardComponent extends HTMLElement{
    
    constructor(intializer,heading,price,color,name,objectName){
        
        super()  
        this.intializer=intializer
        this.heading=heading;
        this.price=price;
        this.color=color;
        this.name=name;     
        this.objectName=objectName   
        this.index=0;        
        this.contentArray=[]
        this.prev=0;
        const shadowRoot=this.attachShadow({mode:'open'})        

        if(this.heading[this.index]=='default')
        {
            shadowRoot.appendChild(CardTemplate(this.heading[this.index+1],'price',`background-image:url('../public/transparent.png')`,""))
        }  
        else
        {
            shadowRoot.appendChild(CardTemplate(this.heading[this.index],this.price[this.index],this.color[this.index],this.name[this.index]))
        }
        
        this.leftButton=shadowRoot.querySelector('.lftBtn')

        this.leftButton.addEventListener('click',()=>{
            
            if(0==this.index)
                this.index=this.price.length-1;
            else
                this.index--;
            
            this.ChangeContent(shadowRoot,this.heading[this.index],this.price[this.index],this.color[this.index],this.name[this.index],this.objectName[this.index])    
            
        })

        this.rightButton=shadowRoot.querySelector('.rgtBtn')
        this.rightButton.addEventListener("click",()=>{
            
            if(this.price.length-1==this.index)
                this.index=0
            else
                this.index++;            
                
            this.ChangeContent(shadowRoot,this.heading[this.index],this.price[this.index],this.color[this.index],this.name[this.index],this.objectName[this.index])
        })                     
    }    

    async ChangeContent(shadowRoot,heading,price,color,name,meshName)
    {
        window.accessories-=this.prev
        
        if(heading=='default')
        {
            price=0
            shadowRoot.querySelector('.cardHeading').innerHTML=this.heading[this.index+1];
            document.querySelector("#ThreeAddonsPrice").innerHTML=`+ ₹ ${window.accessories} accessories`
            shadowRoot.querySelector('.price').innerHTML='₹ '+"price";
            shadowRoot.querySelector('.cardImage').setAttribute('style',`background-image:url('/transparent.png');`)
            shadowRoot.querySelector('.cardContentName').innerHTML="default";                
            let mesh=await this.intializer.GetObjectByName(meshName)
            mesh.material.color.set(1,1,1)
        }
        else
        {
            shadowRoot.querySelector('.cardHeading').innerHTML=heading;
            window.accessories+=parseInt(price)        
            document.querySelector("#ThreeAddonsPrice").innerHTML=`+ ₹ ${window.accessories} accessories`
            shadowRoot.querySelector('.price').innerHTML='₹ '+price;
            shadowRoot.querySelector('.cardImage').setAttribute('style',`background:${color};`)
            shadowRoot.querySelector('.cardContentName').innerHTML=name;                
            let mesh=await this.intializer.GetObjectByName(meshName)        
            await this.intializer.SetColor(mesh,color)
        }
        this.prev=price
    }

    NavigationButtons()
    {
        
    }    
    connectedCallback(){
        // console.log("Added to the page")
    }

    disconnectedCallback(){
        
        // console.log("disconnected with page")
    }
    
    static get observedAttributes(){
        return ['content'];
    }

    get content()
    {
        return this.getAttribute('content')
    }

    set content(value)
    {
        this.setAttribute('content',value)
    }

    attributeChangedCallback(attrName,oldVal,newVal)
    {
        if(attrName.toLowerCase()=='content')
        {
            console.log(newVal)          
        }        
    }


}
customElements.define('card-component',CardComponent)