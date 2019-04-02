window.onload = function () {
    var renderer;
    var width, height;
    //three.js使用的是右手坐标系，x轴：拇指 ，左右   y轴：食指 上下    z轴：中指 前后
    function initThree() {
        var canvas = document.getElementById("canvas");
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        renderer = new THREE.WebGLRenderer({ antialias: true });   //new一个渲染器，设置抗锯齿为true
        renderer.setSize(width, height);    //设置渲染器大小
        canvas.appendChild(renderer.domElement);    //把渲染器的文档元素添加到canvas（标签）
        renderer.setClearColor(0xeeeeee, 1.0);  //给渲染器背景设置颜色，透明度。
    }

    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

        camera.position.x = 0;  //可以直接用camera.position.set(x, y, z)，设置相机的具体位置，参照右手坐标系
        camera.position.y = 600;
        camera.position.z = 300;
        camera.up.x = 0;    //设置相机上部的方向
        camera.up.y = 0;    //这里设置相机上部的方向为y轴正方向，是正常方向，如果为x轴正方向，则意味着相机向右旋转90度
        camera.up.z = -1;
        camera.lookAt({ x: 0, y: 0, z: 0 }); //camera.lookAt(new THREE.Vector3(0, 0, 0))
    }

    var scene;
    function initScene() {
        scene = new THREE.Scene();  //构造函数创建新场景     注：THREE下的构造函数第一个字母大写
    }

    var light;
    function initLight() {
        light = new THREE.AmbientLight();   //new 一个新的环境光源，制定对应颜色，环境光没有特定的光源，是模拟漫反射的一种光源，因此不需要指定位置
        light.position.set(100, 100, 200);
        //scene.add(light); //把环境光添加到当前场景
        light = new THREE.PointLight(); //new一个新的点光源
        light.position.set(0, 500, 0);
        scene.add(light);
    }

    var star1mesh;
    var mesh;
    function initObject() {
        var geometry = new THREE.SphereGeometry(50, 100, 100);  //创建一个球体
        var star1 = new THREE.SphereGeometry(30, 100, 100);
        var ground = new THREE.PlaneGeometry(3000, 3000, 100, 100);

        var material = new THREE.MeshLambertMaterial({ color: 0xCD2626 }); //创建材质
        mesh = new THREE.Mesh(geometry, material); //根据物体和材质创建一个网格
        var meshGround = new THREE.Mesh(ground, material);
        star1mesh = new THREE.Mesh(star1, new THREE.MeshLambertMaterial({ color: 0x3A5FCD }));
        //mesh.position = new THREE.Vector3(0, 0, 600);  
        //star1mesh.position = new THREE.Vector3(0, 0, 0);
        mesh.position.set(0, 0, 50);
        star1mesh.position.set(0, 0, -100);
        meshGround.position.set(0, -500, 0);
        //scene.add(meshGround);
        scene.add(mesh);    //把网格添加至场景
        scene.add(star1mesh);
    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        animate();
    }

    var ang = 0;
    function animate() {
        //renderer.clear();
        ang += 0.03;
        var x = 150 * Math.cos(ang);
        var z = 150 * Math.sin(ang);
        star1mesh.position.set(x, 0, z);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    threeStart();
}