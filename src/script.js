import {ThreeJsInitialiser} from "./ThreeJsMain";
import { SegmentComponent} from "./Components/SegmentComponent";

const API=import.meta.env.VITE_BACKEND_URL
let product_id=parseInt(sessionStorage.getItem('id'));
console.log(product_id);


async function get_product_details_by_id(product_id){
    try{
        let data=await fetch(`${API}api/v1/get_product_details/${product_id}`);
        let response=await data.json();
        return response.data;
    }catch(error){
        return error;
    }
}
async function getFile(id){
    try{
        let data=await fetch(`${API}api/v1/get_product/${id}`);
        let response=await data.json();
        return `${API}${response.file_name}`;
    }catch(error){
        console.log(error);
    }
}

let t1=Date.now();
let time1=Date.now();
let model=await get_product_details_by_id(product_id);
let time2=Date.now();



console.log("API Fetched  : ",Math.abs(time2-time1)/1000)

let time3=Date.now();
let url=await getFile(product_id)
// let url="./Model/table.glb"
let time4=Date.now();
console.log("Model get : ",Math.abs(time4-time3)/1000);


window.DefaultMeshes=[]
window.intializer=new ThreeJsInitialiser(url);
await intializer.start()
let t2= Date.now();
console.log("Total Time : ",(Math.abs(t2-t1)/1000));

const list = document.getElementById('item-list')
const itemWidth = 350
const padding = 10

window.accessories=0


document.querySelector('#carousel-next-btn').addEventListener('click',()=>{
    
    list.scrollLeft += itemWidth + padding
})

document.querySelector('#carousel-prev-btn').addEventListener('click',()=>{
    
    list.scrollLeft -= itemWidth + padding
})

document.querySelector('#ThreeHeading').innerHTML=model.name
document.querySelector("#ThreeSubHeading").innerHTML=model.description
document.querySelector("#ThreePrice").innerHTML=model.price
document.querySelector("#ThreeAddonsPrice").innerHTML=`+ ₹ ${window.accessories} accessories`


function getAllDataFromKey(Key)
{
    let keys=Object.keys(Key)
    let data=[]
    keys.map(i=>{
        let heading=[]
        let name=[]
        let image=[]
        let objectName=[]
        Key[i].forEach(item=>{
            
            if(model[item.parts_name]!=undefined)
            {   
                heading.push(i)
                name.push(model[item.parts_name].name)
                image.push(API+model[item.parts_name].image)
                objectName.push(item.parts_name)
            }
            
        })

        data.push({heading,name,image,objectName})
        
        
    })

    let counter=0;

    data.map(i=>{
        
        let card=new SegmentComponent(intializer,i.heading,i.image,i.name,i.objectName,model);
        card.setAttribute('id',counter)
        document.querySelector('.item-list').appendChild(card)
        counter++;

    })
}

function DefaultMeshes()
{
    if(model.default!=null)
    {        
        window.DefaultMeshes=model.default;    
    }
}

window.ShowDefaultMeshes= function(Key)
{
    if(window.DefaultMeshes)
    {
        let keys=Object.keys(Key);
        let data=[]
        keys.map(i=>{
            let heading=[]
            let name=[]
            let image=[]
            let objectName=[]
            
            Key[i].forEach(item=>{
                
                if(model[item.parts_name]!=undefined)
                {   
                    heading.push(i)
                    name.push(model[item.parts_name].name)
                    image.push(API+model[item.parts_name].image)
                    objectName.push(item.parts_name)
                }
                
            })

            data.push({heading,name,image,objectName})
            
            
        })
        let counter=0;    
        data.map(i=>{
            
            let card=new SegmentComponent(intializer,i.heading,i.image,i.name,i.objectName,model)
            card.setAttribute('id',counter)
            document.querySelector('.item-list').appendChild(card)
            counter++;

        })
    }

}


// DefaultMeshes()/
// window.ShowDefaultMeshes(window.DefaultMeshes)
getAllDataFromKey(model.segment)