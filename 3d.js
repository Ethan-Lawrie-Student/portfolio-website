// import * as THREE from 'three';


// gsap.registerPlugin(ScrollTrigger);

// // Setup Three.js scene, camera, and renderer
// const canvas = document.getElementById("hero-canvas");
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);

// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// camera.position.z = 5;

// // Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(10, 10, 10);
// scene.add(directionalLight);


// const textureLoader = new THREE.TextureLoader();
// // Assuming textureLoader is already created:
// const marbleTexture = textureLoader.load('assets/images/marble.jpg');
// const marbleNormal  = textureLoader.load('assets/images/NormalMap.jpg');
// const aoTexture     = textureLoader.load('assets/images/AO.jpg'); // Your AO map with darker cracks

// // Define your random color options:
// const colorOptions = [ 0xfc977e, 0xfaf3d9, 0x5195bf,0xfc977e];

// function createRandomShapes(count) {
//   const shapes = [];
  
//   for (let i = 0; i < count; i++) {
//     let geometry;
//     const type = Math.floor(Math.random() * 5);
    
//     switch (type) {
//       case 0: // Cube
//         geometry = new THREE.BoxGeometry(
//           Math.random() * 1 + 0.5,
//           Math.random() * 1 + 0.5,
//           Math.random() * 1 + 0.5
//         );
//         break;
//       case 1: // Sphere
//         geometry = new THREE.SphereGeometry(
//           Math.random() * 0.5 + 0.5,
//           32,
//           32
//         );
//         break;
//       case 2: // Cone
//         geometry = new THREE.ConeGeometry(
//           Math.random() * 0.5 + 0.5,
//           Math.random() * 1 + 1,
//           32
//         );
//         break;
//       case 3: // Cylinder
//         geometry = new THREE.CylinderGeometry(
//           Math.random() * 0.5 + 0.3,
//           Math.random() * 0.5 + 0.3,
//           Math.random() * 1 + 1,
//           32
//         );
//         break;
//       case 4: // Torus
//         geometry = new THREE.TorusGeometry(
//           Math.random() * 0.5 + 0.5,
//           Math.random() * 0.2 + 0.1,
//           16,
//           100
//         );
//         break;
//     }
    
//     // Make sure the geometry has a second set of UVs for the AO map:
//     if (geometry.attributes.uv) {
//       geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
//     }
    
//     // Pick a random base color
//     const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    
//     // Create a material that uses the random base color along with the marble texture, normal map, and AO map.
//     const material = new THREE.MeshStandardMaterial({
//       color: randomColor,          // This tints the marble texture with your chosen color
//       map: marbleTexture,          // Marble texture overlay
//       normalMap: marbleNormal,     // For surface detail
//       aoMap: aoTexture,            // AO map to darken the cracks
//       aoMapIntensity: 0.6,         // Increase intensity as needed to emphasize the cracks
//       metalness: 0,              // Adjust for a semi-shiny look
//       roughness: 0.3               // Controls the roughness of the surface
//     });
    
//     const mesh = new THREE.Mesh(geometry, material);
    
//     // Random position between -10 and 10 on each axis
//     mesh.position.set(
//       Math.random() * 20 - 10,
//       Math.random() * 20 - 10,
//       Math.random() * 20 - 10
//     );
    
//     // Random rotation on each axis (0 to 2π)
//     mesh.rotation.set(
//       Math.random() * Math.PI * 2,
//       Math.random() * Math.PI * 2,
//       Math.random() * Math.PI * 2
//     );
    
//     // Optionally store initial data for later scroll animations
//     mesh.userData.initialPosition = mesh.position.clone();
//     mesh.userData.initialRotation = mesh.rotation.clone();
//     mesh.userData.offset = new THREE.Vector3(
//       Math.random() * 4 - 2,
//       Math.random() * 4 - 2,
//       Math.random() * 4 - 2
//     );
//     mesh.userData.rotationFactor = new THREE.Vector3(
//       Math.random() * Math.PI * 2,
//       Math.random() * Math.PI * 2,
//       Math.random() * Math.PI * 2
//     );
    
//     scene.add(mesh);
//     shapes.push(mesh);
//   }
  
//   return shapes;
// }

// const randomShapes = createRandomShapes(20);



  
  

// // Handle window resize
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();


// ScrollTrigger.create({
//   trigger: "#hero-content", // or any element that defines the scroll range
//   start: "top top",
//   end: "bottom top",
//   scrub: true,
//   onUpdate: self => {
//     const progress = self.progress; // progress ranges from 0 to 1

//     randomShapes.forEach(shape => {
//       // Update rotations: based on stored initial rotation and random rotation factor
//       shape.rotation.x = shape.userData.initialRotation.x + progress * shape.userData.rotationFactor.x;
//       shape.rotation.y = shape.userData.initialRotation.y + progress * shape.userData.rotationFactor.y;
//       shape.rotation.z = shape.userData.initialRotation.z + progress * shape.userData.rotationFactor.z;
      
//       // Update positions: starting from the stored initial position plus a random offset scaled by progress
//       shape.position.x = shape.userData.initialPosition.x + progress * shape.userData.offset.x;
//       shape.position.y = shape.userData.initialPosition.y + progress * shape.userData.offset.y;
//       shape.position.z = shape.userData.initialPosition.z + progress * shape.userData.offset.z;
//     });
//   }
// });

