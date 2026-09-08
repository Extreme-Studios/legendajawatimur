import * as THREE from 'three';

function leatherTexture() {
  const c=document.createElement('canvas'); c.width=c.height=512; const x=c.getContext('2d');
  x.fillStyle='#241408'; x.fillRect(0,0,512,512);
  for(let i=0;i<2100;i++){const a=Math.random()*512,b=Math.random()*512,s=Math.random()*2; x.strokeStyle=Math.random()>.65?'#74502733':'#08040244';x.lineWidth=s;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.random()*18-9,b+Math.random()*5-2);x.stroke();}
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}
function titleTexture() {
  const c=document.createElement('canvas'); c.width=1024;c.height=1024; const x=c.getContext('2d'); x.clearRect(0,0,1024,1024);
  x.strokeStyle='#bd8d38'; x.globalAlpha=.8; x.lineWidth=8; x.strokeRect(80,80,864,864); x.lineWidth=3; x.strokeRect(105,105,814,814);
  x.textAlign='center';x.textBaseline='middle'; x.font='600 92px Cinzel, serif'; x.fillStyle='#d3ad59';
  ['KISAH','LEGENDA','JAWA TIMUR'].forEach((line,i)=>{x.fillText(line,512,390+i*115);});
  x.font='48px serif'; x.fillText('❖  ✦  ❖',512,230); x.fillText('❖  ✦  ❖',512,760);
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}
export function createBookModel(scene) {
  const root=new THREE.Group(); root.position.set(0,.45,0); root.rotation.set(-.18,-.43,.05);
  const leather=new THREE.MeshStandardMaterial({map:leatherTexture(),color:0x70451f,roughness:.78,metalness:.06});
  const gold=new THREE.MeshStandardMaterial({color:0xc79c45,roughness:.34,metalness:.72});
  const pages=new THREE.MeshStandardMaterial({color:0xc8ad76,roughness:.92});
  const page=new THREE.Mesh(new THREE.BoxGeometry(3.05,.44,4.25),pages);page.position.y=.24;page.castShadow=true;root.add(page);
  for(let i=0;i<12;i++){const line=new THREE.Mesh(new THREE.BoxGeometry(3.1,.012,4.28),new THREE.MeshStandardMaterial({color:i%2?0xb69865:0xd0bb8b,roughness:1}));line.position.y=.03+i*.035;root.add(line);}
  const back=new THREE.Mesh(new THREE.BoxGeometry(3.35,.22,4.55),leather);back.position.y=-.1;back.castShadow=true;root.add(back);
  const hinge=new THREE.Group();hinge.position.set(-1.68,.48,0);root.add(hinge);
  const cover=new THREE.Mesh(new THREE.BoxGeometry(3.35,.18,4.55),leather);cover.position.set(1.675,0,0);cover.castShadow=true;hinge.add(cover);
  const emboss=new THREE.Mesh(new THREE.PlaneGeometry(2.95,4.14),new THREE.MeshBasicMaterial({map:titleTexture(),transparent:true,side:THREE.DoubleSide,toneMapped:false}));emboss.rotation.x=-Math.PI/2;emboss.scale.y=-1;emboss.position.set(1.675,.125,0);hinge.add(emboss);
  const spine=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,4.55,18),leather);spine.rotation.x=Math.PI/2;spine.position.set(-1.68,.05,0);root.add(spine);
  const bands=[-1.15,0,1.15];bands.forEach(z=>{const b=new THREE.Mesh(new THREE.TorusGeometry(.2,.027,8,18),gold);b.rotation.y=Math.PI/2;b.position.set(-1.69,.05,z);root.add(b);});
  scene.add(root);
  return {root,hinge,cover,open(value){hinge.rotation.z=-value*Math.PI*.92;},hover(value){root.position.y=.45+value*.09;root.scale.setScalar(1+value*.012);}};
}
