import * as THREE from 'three';

export function createCinematicLights(scene) {
  scene.add(new THREE.HemisphereLight(0x3d2612, 0x080605, 1.45));
  const key = new THREE.DirectionalLight(0xffbf68, 2.4);
  key.position.set(-3, 8, 6);
  key.intensity = 3.8; key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -7; key.shadow.camera.right = 7;
  key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
  scene.add(key);
  const leftFlame = new THREE.PointLight(0xff8e30, 35, 8, 2);
  leftFlame.position.set(-3.2, 1.3, 1.4); scene.add(leftFlame);
  const rightFlame = new THREE.PointLight(0xff8e30, 35, 8, 2);
  rightFlame.position.set(3.2, 1.3, 1.4); scene.add(rightFlame);
  const rim = new THREE.PointLight(0x9d672d, 18, 12, 2);
  rim.position.set(0, 5, -4); scene.add(rim);
  return (time) => {
    leftFlame.intensity = 30 + Math.sin(time * .008) * 4;
    rightFlame.intensity = 30 + Math.sin(time * .009 + 2) * 4;
  };
}
