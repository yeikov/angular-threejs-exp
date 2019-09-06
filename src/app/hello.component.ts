import { Component, Input, OnInit, ContentChild } from '@angular/core';
import * as THREE from 'three';

import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';



@Component({
  selector: 'hello',
  template: `<!--<h1>Hello {{name}}!</h1>-->`,
  styles: [`h1 { font-family: Lato; font-size: 8 }`]
})


export class HelloComponent {
  @Input() name: string;
  

  chivato;
  container;
  camera;
  scene;
  renderer;
  mouseX;
  mouseY;
  windowHalfX;
  windowHalfY;

  materialLoader;
  animate;
  onProgress;
  onError;

  constructor() {

    this.container = null;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.mouseX = null;
    this.mouseY = null;
    this.windowHalfX = 500;// window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.materialLoader = new MTLLoader();


    this.renderer = new THREE.WebGLRenderer();
    
    let scope = this;
    this.animate = function () {
      //console.log('this: ' + scope);
      requestAnimationFrame(scope.animate);
      scope.render();

    }

    this.onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete) + '% downloaded');
      }
    };

    this.onError = function () { };
    this.init();
    this.animate();

    console.log(this.windowHalfX);
  }


  init() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 250;

    // scene

    this.scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);
    this.scene.add(this.camera);

    THREE.Loader.Handlers.add(/\.dds$/i, new DDSLoader());

    let scope = this;

    this.materialLoader
      .setPath('assets/')
      .load('cubedefrom.mtl', function (materials) {

        materials.preload();

        new OBJLoader()
          .setMaterials(materials)
          .setPath('assets/')
          .load('cubedefrom.obj', function (object) {
            object.position.y = 3;
            object.scale.set(5, 5, 5);
            scope.scene.add(object);
          }, scope.onProgress, scope.onError);

      });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    console.log(this.windowHalfX);
    
    document.addEventListener('mousemove', function onDocumentMouseMove(event){
       {

        console.log('mousemove '+scope.windowHalfX);
        scope.mouseX = (event.clientX - scope.windowHalfX) / 2;
        scope.mouseY = (event.clientY - scope.windowHalfY) / 2;
    
      }
    }, true);
    window.addEventListener('resize', function (){

      scope.windowHalfX = window.innerWidth / 2;
      scope.windowHalfY = window.innerHeight / 2;
      scope.camera.aspect = window.innerWidth / window.innerHeight;
      scope.camera.updateProjectionMatrix();
      scope.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

  }

  render() {
    this.camera.position.x += (this.mouseX - this.camera.position.x) * .05;
    this.camera.position.y += (- this.mouseY - this.camera.position.y) * .05;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }
};





