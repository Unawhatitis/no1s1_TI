import { Component, OnInit } from '@angular/core';
import * as Rellax from 'rellax';
import {default as Web3} from 'web3';
import {SMCService} from '../../service/smc.service';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private web3:Web3;
  zoom: number = 14;
  lat: number = 44.445248;
  lng: number = 26.099672;
  PVvoltage:any;
  systemenergy:any;
  Bstateofcharge:any;
  no1s1balance:any;
  balance:any;

  styles: any[] = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
    data : Date = new Date();
    focus;
    focus1;
    

    constructor(private _smcService:SMCService) { }

    ngOnInit() {
      var rellaxHeader = new Rellax('.rellax-header');

        var body = document.getElementsByTagName('body')[0];
        body.classList.add('profile-page');
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
        
      let that =this;
      this._smcService.returnLastLog().then(function(data){
        that.PVvoltage=data[0];
        that.systemenergy=data[1];
        that.Bstateofcharge=data[2];
      })
      this._smcService.returnBalance().then(function(data){
        //console.log(data);
        that.no1s1balance=data[0];
        that.balance=data[1]*0.000000000000000001;
      })

///////////////////////////3d tryout//////////////////////////

      const mouse = new THREE.Vector2(1,1);
      const canvas = document.querySelector('#c');
      

      let mesh; 
      let camera, scene, renderer,stats,raycaster; 
      let INTERSECTED;

      prepareAnimate();
      

      animate();

      function prepareAnimate() {

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far =100;  

        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(10, 10, 10);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(2, 0, 2);
        controls.update();

        scene = new THREE.Scene();
        scene.background = new THREE.Color('white');

        const mtlLoader = new MTLLoader();
        mtlLoader.load('../../assets/3dmodel/singleexport_test10.mtl', (mtl) => {
          mtl.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(mtl);
          objLoader.load('../../assets/3dmodel/singleexport_test10.obj', (root) => {
            root.scale.set(2.5,2.5,2.5);
            mesh=root;
            scene.add(mesh);
            //console.log(mesh.userData);
            //console.log(mesh.children);
            initGUI(mesh.children);
          });
        });

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 0.75;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);

        const color = 0xFFFFFF;
        const intensity2 = 0.5;
        const light2 = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light2);
        scene.add(light2.target);

        renderer = new THREE.WebGLRenderer({canvas});
        raycaster = new THREE.Raycaster();

        stats = new Stats();
				document.body.appendChild( stats.dom );

        //document.addEventListener( 'mousemove', onDocumentMouseMove );

        window.addEventListener( 'mousemove', onMouseMove );

        


      }
      
      function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();

      }

      

      function onMouseMove( event ) {

        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      }
      //////////////////////////////


      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }


      function render() {

        raycaster.setFromCamera( mouse, camera );

        //console.log(scene.children);
        //console.log(mesh.children); mesh children are mesh 

        const intersects = raycaster.intersectObjects(mesh.children);

        // if(intersects.length > 0){
        //   if (INTERSECTED != intersects[0].object){
        //     if(INTERSECTED) INTERSECTED.material(INTERSECTED.currentMaterial);

        //     INTERSECTED = intersects[0].object;
        //     INTERSECTED.currentMaterial=INTERSECTED.material;
        //     const selMaterial =  new THREE.MeshBasicMaterial( { color: 'black' } );
        //     INTERSECTED.material = selMaterial;
        //   }
        // }

        for ( let i = 0; i < intersects.length; i ++ ) {

          //const oriMaterial = intersects[ i ].object.material

          const selMaterial =  new THREE.MeshBasicMaterial( { color: 'black' } );

          intersects[ i ].object.material = selMaterial;
          //try setvalues methods, https://threejs.org/docs/#api/en/materials/Material

          //intersects[ i ].object.material = oriMaterial;

        }

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        
        renderer.render(scene, camera);

        //requestAnimationFrame(render);
      }

      function initGUI( layers ) {
        const gui = new GUI( { width: 300 } );
        //gui.domElement.id='gui';
        const layersControl = gui.addFolder( 'layers' );
        layersControl.open();
        for ( let i = 0; i < layers.length; i ++ ) {
          const layer = layers[ i ];
          layersControl.add( layer, 'visible' ).name( layer.name ).onChange( function ( val ) {
            const name = this.object.name;
            scene.traverse( function ( child ) {
              if ( child.userData.hasOwnProperty( 'attributes' ) ) {
                if ( 'layerIndex' in child.userData.attributes ) {
                  const layerName = layers[ child.userData.attributes.layerIndex ].name;
                  if ( layerName === name ) {
  
                    child.visible = val;
                    layer.visible = val;
                  }
                }
              }
            } );
          } );
        }
        const no1s1Data = gui.addFolder('informations');
        no1s1Data.add();

      }

      //requestAnimationFrame(render);


      //window.requestAnimationFrame(render);
      

    }
    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('profile-page');
        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    // lastLog(){
    //   let that =this;
    //   this._smcService.returnLastLog().then(function(data){
    //     that.PVvoltage=data[0];
    //     that.systemenergy=data[1];
    //     that.Bstateofcharge=data[2];
    //   })
    // }

}
