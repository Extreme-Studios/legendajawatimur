import * as THREE from 'three';

const mat = (color, roughness = .75) => new THREE.MeshStandardMaterial({ color, roughness, metalness: .03 });

export function createOfferingObjects(scene) {
  const group = new THREE.Group();
  const clay = mat(0x5c2711), leaf = mat(0x293517), jasmine = mat(0xf0dfb4), rose = mat(0x8f2020);
  const bowl = new THREE.TorusGeometry(.52, .12, 10, 28);
  [[-3.1, .1, .7], [3.1, .1, .7]].forEach(([x, y, z], side) => {
    const offering = new THREE.Group(); offering.position.set(x, y, z);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(.62, .55, .12, 24), clay); plate.castShadow = true; offering.add(plate);
    const ring = new THREE.Mesh(bowl, mat(0xbc7430)); ring.rotation.x = Math.PI / 2; ring.position.y = .1; offering.add(ring);
    for (let i=0;i<13;i++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(.09 + (i%3)*.012, 8, 6), i%3 ? jasmine : rose);
      const a = i * 2.399; petal.position.set(Math.cos(a)*(.16+(i%4)*.07), .18, Math.sin(a)*(.16+(i%4)*.07)); petal.scale.set(1,.35,1); offering.add(petal);
    }
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(.09, .11, .48, 12), mat(0xe0b96b)); candle.position.set(side ? -.21 : .21,.34,0); offering.add(candle);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), new THREE.MeshBasicMaterial({color:0xffbd52})); flame.position.set(candle.position.x,.65,0); flame.scale.y=1.7; offering.add(flame);
    group.add(offering);
  });
  const jar = new THREE.Mesh(new THREE.SphereGeometry(.35, 18, 12), clay); jar.scale.y=1.35; jar.position.set(2.15,.47,-.7); group.add(jar);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.13,.18,.45,14), clay); neck.position.set(2.15,.92,-.7); group.add(neck);
  for (let i=0;i<9;i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.11,8,6), leaf); const a=i*.69; p.position.set(-2.15+Math.cos(a)*.48,.17,-.65+Math.sin(a)*.28); p.scale.set(1.7,.22,.8); group.add(p); }
  scene.add(group); return group;
}
