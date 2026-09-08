import * as THREE from 'three';
import { createBookModel } from './BookModel.js';
import { createOfferingObjects } from './OfferingObjects.js';
import { createIncenseSmoke } from './IncenseSmoke.js';
import { createCinematicLights } from './CinematicLights.js';

export function createAncientBookScene(host,{onOpen}) {
  const scene=new THREE.Scene(); scene.background=new THREE.Color(0x090705); scene.fog=new THREE.FogExp2(0x0b0806,.1);
  const camera=new THREE.PerspectiveCamera(33,1,.1,60); camera.position.set(5.4,6.1,7.5); camera.lookAt(0,.3,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(host.clientWidth,host.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.8;renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
  const table=new THREE.Mesh(new THREE.BoxGeometry(15,.45,11),new THREE.MeshStandardMaterial({color:0x1d0e05,roughness:.88,metalness:0}));table.position.y=-.38;table.receiveShadow=true;scene.add(table);
  const grooveMat=new THREE.MeshStandardMaterial({color:0x45210c,roughness:.9});for(let i=-7;i<8;i++){const g=new THREE.Mesh(new THREE.BoxGeometry(.035,.01,10.6),grooveMat);g.position.set(i,-.145,0);scene.add(g);}
  const book=createBookModel(scene); createOfferingObjects(scene); const smoke=createIncenseSmoke(scene),lights=createCinematicLights(scene);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),clock=new THREE.Clock();let raf,opened=0,targetOpen=0,hover=0,approaching=false,menuShown=false,openAt=0,disposed=false;
  const resize=()=>{const {clientWidth:w,clientHeight:h}=host;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};
  const pointerMove=e=>{const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);hover=raycaster.intersectObject(book.cover).length?1:0;renderer.domElement.style.cursor=hover?'pointer':'default';};
  const click=()=>{if(hover&&!approaching){approaching=true;openAt=performance.now()+720;}};
  renderer.domElement.addEventListener('pointermove',pointerMove);renderer.domElement.addEventListener('click',click);window.addEventListener('resize',resize);resize();
  const animate=()=>{if(disposed)return;raf=requestAnimationFrame(animate);const t=performance.now(),d=clock.getDelta();if(approaching&&t>openAt)targetOpen=1;opened+=(targetOpen-opened)*Math.min(1,d*3.2);book.open(opened);book.hover(hover);camera.position.x=5.4+Math.sin(t*.00013)*.13;camera.position.y=6.1+Math.cos(t*.00011)*.08;if(approaching){camera.position.lerp(new THREE.Vector3(4.6,5.5,6.4),.012);}if(opened>.86&&!menuShown){menuShown=true;onOpen();}camera.lookAt(0,.25,0);smoke(t);lights(t);renderer.render(scene,camera);};animate();
  return ()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);renderer.domElement.removeEventListener('pointermove',pointerMove);renderer.domElement.removeEventListener('click',click);scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map?.dispose();m.dispose();});}});renderer.dispose();renderer.domElement.remove();};
}
