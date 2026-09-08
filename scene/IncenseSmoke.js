import * as THREE from 'three';

export function createIncenseSmoke(scene) {
  const count = 38, positions = new Float32Array(count * 3), offsets = new Float32Array(count);
  for (let i=0;i<count;i++) { const side=i%2?1:-1; positions[i*3]=side*(2.35+(i%5)*.04); positions[i*3+1]=.45+i*.042; positions[i*3+2]=-.35+(i%4)*.04; offsets[i]=i*.31; }
  const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(positions,3)); geometry.setAttribute('offset',new THREE.BufferAttribute(offsets,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{time:{value:0}},vertexShader:'attribute float offset; uniform float time; varying float v; void main(){vec3 p=position; p.x+=sin(time*.0005+offset+p.y*3.)*.18; p.z+=cos(time*.00045+offset)*.1; v=1.-p.y/2.3; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); gl_PointSize=(20.+v*40.)*(1./-gl_Position.z);}',fragmentShader:'varying float v; void main(){float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.08,d)*v*.13; gl_FragColor=vec4(.82,.78,.68,a);}'}); 
  const smoke=new THREE.Points(geometry,material); scene.add(smoke);
  return (time)=>{material.uniforms.time.value=time;};
}
