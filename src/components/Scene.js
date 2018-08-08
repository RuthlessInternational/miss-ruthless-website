import React, { Component } from 'react'
import * as THREE from 'three'

// import peony from '../js/obj/peony_low.json'
// import peony from '../js/obj/peony_low.js';

var mesh = null

class Scene extends Component {
  constructor(props) {
    super(props)

    // this.state = { x: 0, y: 0 };

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    // const width = this.mount.clientWidth
    // const height = this.mount.clientHeight

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, this.props.width / this.props.height, 1, 5000 );
    camera.position.z = 1000;
        
    let path = process.env.PUBLIC_URL + "/images/textures/cube/sky3/";
    let format = '.jpg';
    let urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
      ];
    
    const reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBFormat;
    reflectionCube.minFilter = THREE.LinearFilter;
    scene.background = reflectionCube;

    var ambient = new THREE.AmbientLight( 0xffffff,1.1 );
    scene.add( ambient );

    var sphere = new THREE.SphereGeometry( 100, 16, 8 );

    mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
    mesh.scale.set( 0.02, 0.02, 0.02 );

    var refractionCube = new THREE.CubeTextureLoader().load( urls );
    refractionCube.mapping = THREE.CubeRefractionMapping;
    refractionCube.format = THREE.RGBFormat;
    var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube, } );

    const renderer = new THREE.WebGLRenderer({ antialias: true })
  
    const loader = new THREE.JSONLoader();
    loader.load(process.env.PUBLIC_URL + "/images/peony_low.json", (geometry, materials) => {
      var s = 12;

      mesh = new THREE.Mesh( geometry, cubeMaterial1 );
      mesh.position.z = - 100;
      mesh.position.y = - 1000;
      mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
      scene.add( mesh );
      this.mesh = mesh
    });

    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setPixelRatio( 1 );
    renderer.setSize(this.props.width, this.props.height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  componentWillReceiveProps(props) {
    this.camera.aspect = props.width / props.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( props.width, props.height );
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }
  

  animate() {
    // console.log
    if(this.mesh !== undefined){
      // var timer = -0.0002 * Date.now();
      this.mesh.rotation.y += 0.003;
      if (this.camera.position.x >= 80) {
        this.camera.position.x = 80;
      } else if (this.camera.position.x <= -80) {
        this.camera.position.x = -80;
      }

      this.camera.position.x += ( this.props.mouseX - this.camera.position.x ) * .001;
      this.camera.position.y += ( - this.props.mouseY - this.camera.position.y ) * .001;

      this.camera.lookAt( this.scene.position );
      this.renderer.render( this.scene, this.camera );
    }

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div className="scene" 
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default Scene