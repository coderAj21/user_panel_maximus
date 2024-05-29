import * as THREE from "three";
import { OrbitControls,GLTFLoader,RGBELoader } from "three/examples/jsm/Addons.js"


export class ThreeJsInitialiser{

  //Intializing variables for THREE.js Scene
  constructor(path)
  {
    this.fov=30
    this.camera=null
    this.scene=null
    this.controls=null
    this.renderer=null    
    this.objects=[]
    this.loaderManager=null    
    this.path=path
    this.carouselArray=[]
  }   

  FunctionCreateDivWithId(id)
  {
    let div=document.createElement('div')
    div.setAttribute('id',id)
    return div
  }
  FunctionCreateDivWithClass(clas)
  {
    let div=document.createElement('div')
    div.setAttribute('class',clas)
    return div
  }
  
  //To dynamically intialize HTML
  IntializeHTML()
  {
    return new Promise((resolve,reject)=>{
      try{
        
        let loader=this.FunctionCreateDivWithId('loader')        
        loader.class='loading'
        let load=this.FunctionCreateDivWithClass('load')
        let box1=this.FunctionCreateDivWithClass('box1')
        let box2=this.FunctionCreateDivWithClass('box2')
        let box3=this.FunctionCreateDivWithClass('box3')

        loader.appendChild(load)
        load.appendChild(box1)
        load.appendChild(box2)
        load.appendChild(box3)

        document.body.appendChild(loader)


        let ThreeContent=this.FunctionCreateDivWithId('ThreeContent')
        let ThreeTop=this.FunctionCreateDivWithId('ThreeTop')
        let ThreeHeadingTab=this.FunctionCreateDivWithId('ThreeHeadingTab')
        let ThreeHeading=this.FunctionCreateDivWithId('ThreeHeading')
        let ThreeSubHeading=this.FunctionCreateDivWithId('ThreeSubHeading')
        let ThreePriceTab=this.FunctionCreateDivWithId('ThreePriceTab')
        let ThreePrice=this.FunctionCreateDivWithId('ThreePrice')
        let ThreeAddonsPrice=this.FunctionCreateDivWithId('ThreeAddonsPrice')

        
        let ThreeCarouselContainer=this.FunctionCreateDivWithClass('carousel-container')
        let ThreeCarouselView=this.FunctionCreateDivWithClass('carousel-view')

        let lftImg=document.createElement("img")
        lftImg.src='/doubleLeft.png'
        lftImg.id='carousel-prev-btn'

        let ThreeItemList=this.FunctionCreateDivWithClass('item-list')
        ThreeItemList.id='item-list'

        let rgtImg=document.createElement("img")
        rgtImg.src='/doubleRight.png'
        rgtImg.id='carousel-next-btn'

        document.body.appendChild(ThreeContent)
          ThreeContent.appendChild(ThreeTop)
            ThreeTop.appendChild(ThreeHeadingTab)
              ThreeHeadingTab.appendChild(ThreeHeading)
              ThreeHeadingTab.appendChild(ThreeSubHeading)
            ThreeTop.appendChild(ThreePriceTab)
              ThreePriceTab.appendChild(ThreePrice)
              ThreePriceTab.appendChild(ThreeAddonsPrice)
          
          ThreeContent.appendChild(ThreeCarouselContainer)
            ThreeCarouselContainer.appendChild(ThreeCarouselView)
              ThreeCarouselView.appendChild(lftImg)
              ThreeCarouselView.appendChild(ThreeItemList)
              ThreeCarouselView.appendChild(rgtImg)  
          


        let link=document.createElement('link')
        link.setAttribute('rel','stylesheet')
        link.setAttribute('href','./style.css')
        document.getElementsByTagName('head')[0].appendChild(link)

        let loaderStyle=document.createElement('link')
        loaderStyle.setAttribute('rel','stylesheet')
        loaderStyle.setAttribute('href','./loader.css')
        document.getElementsByTagName('head')[0].appendChild(link)
        
        resolve(console.log("Intialise HTML"))
      }
      catch(err){
        console.log(err)
        reject()
      }
    })
  }
  //Intializing the Three js scene
  intializeThreeJS()
  {
    return new Promise((resolve,reject)=>{
      if(THREE){
        
        //Camera
        this.camera=new THREE.PerspectiveCamera(
          this.fov,
          window.innerWidth/window.innerHeight,
          0.1,
          1000)
        this.camera.position.z=5
        //Scene
        this.scene=new THREE.Scene()
        //Renderer
        this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
        this.renderer.setSize(
          window.innerWidth,
          window.innerHeight
        )
        this.renderer.setPixelRatio(window.devicePixelRatio)    
        this.renderer.outputEncoding=THREE.sRGBEncoding;    
        this.renderer.physicallyCorrectLights=true;

        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure=1.25
        //Appendidng renderer to the body
        document.body.appendChild(this.renderer.domElement)
        //Lights
        let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
        this.scene.add(hemiLight);    
        
        this.light = new THREE.SpotLight(0xffa95c,4);
        this.light.position.set(-50,50,50);
        this.light.castShadow = true;
        this.scene.add( this.light );
        //Controls
        this.controls=new OrbitControls(this.camera,document.querySelector("body"))
        this.controls.enableDamping=true
        this.controls.dampingFactor=0.05             
        //Repeatition of the Renderer Scene
        const animate=()=>{
          requestAnimationFrame(animate)
          this.light.position.set( 
            this.camera.position.x + 10,
            this.camera.position.y + 10,
            this.camera.position.z + 10,
          );
          this.renderer.render(this.scene,this.camera)
        }

        window.addEventListener('resize',this.OnWindowResize)

        this.loaderManager=new THREE.LoadingManager()

        this.loaderManager.onStart=()=>{
          document.querySelector('.loading').style.display="flex";
        }
        
        this.loaderManager.onLoad=()=>{
          // document.querySelector('.loading').style.display="none";
          document.querySelector('.loading').style.display="none";
          console.log("Model Success")
          
        }        

        animate()

        resolve("Three js Scene")
      }
      else
      {
        reject(new Error('Three.js Library not Loaded'))
      }
    })
  }

  OnWindowResize()
  {
    this.camera.aspect=window.innerWidth/window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth,window.innerHeight)
  }

  InitENVMap()
  {
    return new Promise((resolve,reject)=>{
        const textureLoader=new RGBELoader(this.loaderManager)
        const pmremGenrator=new THREE.PMREMGenerator(this.renderer)
        pmremGenrator.compileEquirectangularShader()
        
        textureLoader.load('/Textures/resting_place_2k.hdr',texture=>{          
          let envMap=pmremGenrator.fromEquirectangular(texture).texture
          pmremGenrator.dispose()                    
          this.scene.environment=envMap
          texture.mapping=THREE.EquirectangularReflectionMapping;
          resolve(console.log("Env Map Success"))
        },undefined,err=>reject(err))
    })
  }

  //Loading 3D Model
  async Loader()
  {
    return new Promise((resolve,reject)=>{
      if(GLTFLoader)
      {
          
        const loader=new GLTFLoader(this.loaderManager)
        loader.load(this.path,(child)=>{
          child.scene.position.set(0,-0.3,0)
          this.scene.add(child.scene)         
          child.scene.traverse(children=>{
            
            if(children.name.split('_')[0]=='parent' && children.type=='Object3D' && children.name.split('_').length==2)
              this.objects.push(children)            

            if(children.isMesh){
              children.isMesh=false
              children.needsUpdate=true
            }
          })          
          resolve(this.objects)
        },undefined,err=>{
          console.log(err)
          reject(err)
        })        
        
      }
      else
      {
        reject("GLTFLoader Not Loaded")
      }
    })
  }

  ShowAllMeshesFromObject(object)
  {
    return new Promise((resolve,reject)=>{
      if(object)
      {
        let arr=[]
        object.traverse(i=>{
          if(i.type=="Mesh"){
            i.isMesh=true            
            arr.push(i)            
          }
        })
        arr.length>0?resolve(arr):reject("No Data Found")      
      }
      
    })  
  }

  GetAllObjects()
  {
    return new Promise((resolve)=>{
      resolve(this.objects)
    })
  }

  GetOneObjectByIndex(index)
  {
    return new Promise((resolve)=>{
      resolve(this.objects[index])
    })
  }

  GetObjectByName(name)
  {
    return new Promise((resolve)=>{
      resolve(this.scene.getObjectByName(name))
    })
  }

  ShowAllMeshesFromAllObjects()
  {
    return new Promise((resolve)=>{
      this.scene.traverse(child=>{
        if(child.type=='Mesh')
          child.isMesh='true'
      })  
      resolve()
    })
  }

  ShowAllMeshesFromObject(object)
  {
    return new Promise((resolve,reject)=>{
      if(object)
      {
        let arr=[]
        object.traverse(i=>{
          if(i.type=="Mesh"){
            i.isMesh=true            
            arr.push(i)
          }
        })
        

        resolve(arr)
      }
      else
      {
        reject()
      }
    })
  }

  HideAllMeshesFromAllObjects(){
    return new Promise((resolve,reject)=>{
      this.scene.traverse(child=>{
        if(child.type=="Mesh")
          child.isMesh=false
      })
      resolve()
    })
  }

  HideMeshFromObjects(object)
  {
    return new Promise((resolve,reject)=>{
      object.traverse(child=>{
        if(child.type=="Mesh")
            child.isMesh=false
      })
      resolve()
    })
  }
  
  GetALLMeshesFromObject(object)
  {
    return new Promise((resolve,reject)=>{
      if(object)
      {
        let arr=[]
        object.traverse(i=>{
          if(i.type=="Mesh")
            arr.push(i)
        })
        resolve(arr)
      }
      else
      {
        reject()
      }
    })
  }

  SetColor(mesh,color)
  {
    return new Promise((resolve,reject)=>{
      
      mesh.material.color=new THREE.Color(color)
      resolve()
    })
  }

  async start(){    
    await this.IntializeHTML()
      .then(await this.intializeThreeJS()
        .then(await this.InitENVMap()))
          .then(await this.Loader())
  } 
  
}