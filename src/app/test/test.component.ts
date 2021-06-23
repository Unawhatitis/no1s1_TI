import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  name = 'Angular';

  constructor() { }

  ngOnInit(){
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color('black');
//     THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );

//     ///////////////////////////////////BOX EXAMPLE///////////////////////////////////////////////////
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);
//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

// ////////////////////////////////CAMERA/////////////////////////////////////////////
//     const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,5000);
//     camera.rotation.y = 45/180*Math.PI;
//     camera.position.x = 1800;
//     camera.position.y = 500;
//     camera.position.z = 500;
// ////////////////////////////////RENDERER/////////////////////////////////////////////
//     const renderer = new THREE.WebGLRenderer({antialias:true});
//     renderer.setSize(window.innerWidth,window.innerHeight);
//     document.body.appendChild(renderer.domElement);
// ////////////////////////////////LIGHT/////////////////////////////////////////////
//     const hlight = new THREE.AmbientLight (0x404040,100);
//     scene.add(hlight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff,100);
//     directionalLight.position.set(0,1,0);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);
//     const light = new THREE.PointLight(0xc4c4c4,10);
//     light.position.set(0,300,500);
//     scene.add(light);
//     const light2 = new THREE.PointLight(0xc4c4c4,10);
//     light2.position.set(500,100,0);
//     scene.add(light2);
//     const light3 = new THREE.PointLight(0xc4c4c4,10);
//     light3.position.set(0,100,-500);
//     scene.add(light3);
//     const light4 = new THREE.PointLight(0xc4c4c4,10);
//     light4.position.set(-500,300,500);
//     scene.add(light4);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.25;
//     controls.enableZoom = false;

//     ////////////////////////////////ANIMATE/////////////////////////////////////////////
//     function animate0() {
//       requestAnimationFrame(animate0);
//       controls.update();
//       renderer.render(scene,camera);
//     }

//     ////////////////////////////////GUI for 3DM/////////////////////////////////////////////

    // function initGUI( layers ) {
    //   const gui = new GUI( { width: 300 } );
    //   const layersControl = gui.addFolder( 'layers' );
    //   layersControl.open();
    //   for ( let i = 0; i < layers.length; i ++ ) {
    //     const layer = layers[ i ];
    //     layersControl.add( layer, 'visible' ).name( layer.name ).onChange( function ( val ) {
    //       const name = this.object.name;
    //       scene.traverse( function ( child ) {
    //         if ( child.userData.hasOwnProperty( 'attributes' ) ) {
    //           if ( 'layerIndex' in child.userData.attributes ) {
    //             const layerName = layers[ child.userData.attributes.layerIndex ].name;
    //             if ( layerName === name ) {

    //               child.visible = val;
    //               layer.visible = val;
    //             }
    //           }
    //         }
    //       } );
    //     } );
    //   }
    // }

    //////////////////////////////////GLTF LOADER/////////////////////////////////////////////
    // const loader = new GLTFLoader();
    // loader.load( '../../assets/3dmodel/singlemodel.gltf', function ( gltf ) {
    //   const galaxy = gltf.scene.children[0];
    //   galaxy.scale.set(20000,20000,20000);
    //   scene.add( gltf.scene );
    //   initGUI( gltf.userData.layers );
    //   animate0();

    // }, function(xhr){
    //     console.log((xhr.loaded/xhr.total*100)+'% loaded');
    //   }, function ( error ) {
    //   console.error( error );
    // } );
    //////////////////////////////////3DM LOADER new attempt/////////////////////////////////////////////

    // const mtlLoader = new MTLLoader();
    // mtlLoader.load('../../assets/3dmodel/singleexport_test10.mtl', (mtl) => {
    //   mtl.preload();
    //   const loader = new Rhino3dmLoader();
    //   loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' );
    //   loader.setMaterials(mtl);
    //   loader.load('../../assets/3dmodel/single_render_0617.3dm', (root) => {
    //     root.scale.set(2,2,2);
    //     scene.add(root);
    //     initGUI(root.userData.layers );
    //     animate0();
    //   },
    //   function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded');
    //   },
    //   function ( error ) {console.error( error );
    //   });
    // });


    //////////////////////////////////3DM LOADER Archeive/////////////////////////////////////////////
    // const loader = new Rhino3dmLoader();
    // loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' );
    // var material = new THREE.MeshBasicMaterial( { color: 0xE69138 } );
    // loader.load( '../../assets/3dmodel/single_render_0617.3dm', function ( rhino ) {
    //   rhino.traverse( function ( child ) {
    //     if ( child instanceof THREE.Mesh ) {
    //         child.material = material;
    //     }
    // } );

    //   rhino.scale.set(200,200,200);
    //   scene.add(rhino);
    //   initGUI( rhino.userData.layers );
    //   animate0();

    // }, function(xhr){
    //   console.log((xhr.loaded/xhr.total*100)+'% loaded');
    // }, function ( error ) {

    //   console.error( error );

    // } );
    //////////////////////////////////OBJ LOADER/////////////////////////////////////////////
    let camera, scene, renderer, stats;

    let mesh;
    const amount = parseInt( window.location.search.substr( 1 ) ) || 10;
    const count = Math.pow( amount, 3 );

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2( 1, 1 );

    const color = new THREE.Color();

    init();
    animate();

    function init() {

      camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
      camera.position.set( amount, amount, amount );
      camera.lookAt( 0, 0, 0 );

      scene = new THREE.Scene();

      const light1 = new THREE.HemisphereLight( 0xffffff, 0x000088 );
      light1.position.set( - 1, 1.5, 1 );
      scene.add( light1 );

      const light2 = new THREE.HemisphereLight( 0xffffff, 0x880000, 0.5 );
      light2.position.set( - 1, - 1.5, - 1 );
      scene.add( light2 );

      const geometry = new THREE.IcosahedronGeometry( 0.5, 3 );
      const material = new THREE.MeshPhongMaterial();

      mesh = new THREE.InstancedMesh( geometry, material, count );

      let i = 0;
      const offset = ( amount - 1 ) / 2;

      const matrix = new THREE.Matrix4();

      for ( let x = 0; x < amount; x ++ ) {

        for ( let y = 0; y < amount; y ++ ) {

          for ( let z = 0; z < amount; z ++ ) {

            matrix.setPosition( offset - x, offset - y, offset - z );

            mesh.setMatrixAt( i, matrix );
            mesh.setColorAt( i, color );

            i ++;

          }

        }

      }

      scene.add( mesh );

      //

      const gui = new GUI();
      gui.add( mesh, 'count', 0, count );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      new OrbitControls( camera, renderer.domElement );

      stats = new Stats();
      document.body.appendChild( stats.dom );

      window.addEventListener( 'resize', onWindowResize );
      document.addEventListener( 'mousemove', onMouseMove );

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onMouseMove( event ) {

      event.preventDefault();

      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    function animate() {

      requestAnimationFrame( animate );

      render();

    }

    function render() {

      raycaster.setFromCamera( mouse, camera );

      const intersection = raycaster.intersectObject( mesh );

      if ( intersection.length > 0 ) {

        const instanceId = intersection[ 0 ].instanceId;

        mesh.setColorAt( instanceId, color.setHex( Math.random() * 0xffffff ) );
        mesh.instanceColor.needsUpdate = true;

      }

      renderer.render( scene, camera );

      stats.update();

    }
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2(1,1);
    // const canvas = document.querySelector('#c');
    // const renderer = new THREE.WebGLRenderer({canvas});

    // let mesh; 
    // let camera, scene; 

    // const mtlLoader = new MTLLoader();
    // mtlLoader.load('../../assets/3dmodel/singleexport_test10.mtl', (mtl) => {
    //   mtl.preload();
    //   const objLoader = new OBJLoader();
    //   objLoader.setMaterials(mtl);
    //   objLoader.load('../../assets/3dmodel/singleexport_test10.obj', (root) => {
    //     root.scale.set(2,2,2);
    //     mesh=root;
    //     scene.add(mesh);
    //     //initGUI(root.userData.layers );
    //   });
    // });

    // prepareAnimate();
    
    // console.log(scene);
    // console.log(camera);
    

    // Animate();

    // function prepareAnimate() {

    //   const fov = 45;
    //   const aspect = 2;  // the canvas default
    //   const near = 0.1;
    //   const far =100;  

    //   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //   camera.position.set(10, 10, 10);

    //   const controls = new OrbitControls(camera, canvas);
    //   controls.target.set(2, 0, 2);
    //   controls.update();

    //   const scene = new THREE.Scene();
    //   scene.background = new THREE.Color('white');

    //   const skyColor = 0xB1E1FF;  // light blue
    //   const groundColor = 0xB97A20;  // brownish orange
    //   const intensity = 1;
    //   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    //   scene.add(light);

    //   const color = 0xFFFFFF;
    //   const intensity2 = 0.5;
    //   const light2 = new THREE.DirectionalLight(color, intensity);
    //   light.position.set(5, 10, 2);
    //   scene.add(light2);
    //   scene.add(light2.target);

    //   window.addEventListener( 'mousemove', onMouseMove );

      


    // }
    
    // function Animate() {
    //   requestAnimationFrame(Animate);
    //   render();

    // }

    

    // function onMouseMove( event ) {

    //   event.preventDefault();

    //   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    //   mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // }
    // //////////////////////////////


    // function resizeRendererToDisplaySize(renderer) {
    //   const canvas = renderer.domElement;
    //   const width = canvas.clientWidth;
    //   const height = canvas.clientHeight;
    //   const needResize = canvas.width !== width || canvas.height !== height;
    //   if (needResize) {
    //     renderer.setSize(width, height, false);
    //   }
    //   return needResize;
    // }


    // function render() {

    //   //raycaster.setFromCamera( mouse, camera );

    //   // console.log(camera);
    //   // console.log(camera.isPerspectiveCamera);

    //   // const intersects = raycaster.intersectObjects(mesh, true);

    //   // // for ( let i = 0; i < intersects.length; i ++ ) {

    //   // //   intersects[ i ].object.material.color.set( 0xff0000 );

    //   // // }

    //   // for ( let i = 0; i < intersects.length; i ++ ) {

    //   //   intersects[ i ].object.material.color.set( 0xff0000 );

    //   // }

    //   if (resizeRendererToDisplaySize(renderer)) {
    //     const canvas = renderer.domElement;
    //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //     camera.updateProjectionMatrix();
    //   }

      

    //   renderer.render(scene, camera);

    //   //requestAnimationFrame(render);
    // }

    //requestAnimationFrame(render);


    //window.requestAnimationFrame(render);
    


    // const animate1 = function () {
    //   requestAnimationFrame(animate1);
    //   galaxy.rotation.x += 0.03;
    //   galaxy.rotation.y += 0.03;

    //   renderer.render(scene, camera);
    // };
    // camera.position.z = 5;
    //renderer.render(scene, camera);
    //animate();

  
  }

}
