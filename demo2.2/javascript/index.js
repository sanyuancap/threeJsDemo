(function (window, undefined) {
    let qString = getQueryString("mode");
    let mode = qString ? +qString : 0;
    let renderer;
    let width, height;
    //three.js使用的是右手坐标系，x轴：拇指 ，左右   y轴：食指 上下    z轴：中指 前后
    function initThree() {
        let canvas = document.getElementById("canvas");
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });   //new一个渲染器，设置抗锯齿为true
        renderer.setSize(width, height);    //设置渲染器大小
        canvas.appendChild(renderer.domElement);    //把渲染器的文档元素添加到canvas（标签）
        renderer.setClearAlpha(0.8);  //给渲染器背景设置颜色，透明度。
    }

    let camera;
    function initCamera() {
        /*相机分为正交投影相机和透视投影相机*/
        //camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
        /*正交投影相机，无论距离多远，看到的都是物体实际大小*/
        /*构造函数OrthographicCamera(left, right, top, bottom, near, far)*/
        /* 参数分别为 左右上下前后的距离范围，在这个范围（长方体）内的物体才可看到*/
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        /*透视投影相机，类似于到点的投影，所有的投影线最后都将汇聚于一点，透视投影的特点就是近大远小。*/
        /*构造函数PerspectiveCamera(fov, aspect, near, far) 
            fov:可视角度,角度越大，可看到的范围越大，内容越多，每个物体都缩小。一般45度。  aspect:width/height一般为canvas宽高比 near:近端距离，离相机近的那一端距离    far:远端距离，离相机远的那一端距离
            物体离相机的距离介于near和far之间才会被看到，可以看做是可视距离范围
        */
        camera.position.x = 0;  //可以直接用camera.position.set(x, y, z)，设置相机的具体位置，参照右手坐标系
        camera.position.y = 600;
        camera.position.z = 900;
        camera.up.x = 0;    //设置相机上部的方向
        camera.up.y = 0;    //这里设置相机上部的方向为y轴正方向，是正常方向，如果为x轴正方向，则意味着相机向右旋转90度
        camera.up.z = -1;
        camera.lookAt({ x: 0, y: 0, z: 0 }); //camera.lookAt(new THREE.Vector3(0, 0, 0)) 注：Vector3是含有3个量的向量,2就是2个
        /*相机默认的方向为指向z轴负方向，也就是屏幕前的人看屏幕的方向，相机位置更改后，需要把相机方向设置为指向原点的方向，否则看不到原点附近的物体*/
    }

    let scene;
    function initScene() {
        scene = new THREE.Scene();  //构造函数创建新场景     注：THREE下的构造函数第一个字母大写
    }

    let light;
    function initLight() {
        //light = new THREE.AmbientLight();   //new 一个新的环境光源，制定对应颜色，环境光没有特定的光源，是模拟漫反射的一种光源，因此不需要指定位置
        //scene.add(light); //把环境光添加到当前场景
        light = new THREE.PointLight(); //new一个新的点光源
        if (mode === 0) {
            light.position.set(0, 500, 500);
        } else if (mode === 1) {
            light.position.set(0, 0, 0);
        }
        scene.add(light);
    }

  
    let jinxing,
        muxing,
        haiwangxing,
        earth;
    let group = new THREE.Group();
    let loader = new THREE.TextureLoader();
    let loader1 = new THREE.TextureLoader();
    let test = loader === loader1;
    function initObject() {
        scene.add(group);
        loader.load(
            'texture/diqiu.jpg',
            function (texture) {
                let geometry = new THREE.SphereGeometry(100, 100, 100);  //创建一个球体
                let material = new THREE.MeshLambertMaterial({ map: texture }); //创建材质
                earth = new THREE.Mesh(geometry, material); //根据物体和材质创建一个网格
                earth.position.set(0, 0, 50);
                group.add(earth);
            }
        )
        loader.load(
            'texture/jinxing.jpg',
            function (texture) {
                let star1 = new THREE.SphereGeometry(50, 100, 100);
                let material = new THREE.MeshLambertMaterial({ map: texture }); //创建材质
                jinxing = new THREE.Mesh(star1, material); //根据物体和材质创建一个网格
                jinxing.position.set(0, 0, -250);
                group.add(jinxing);
            }
        )
        loader.load(
            'texture/muxing.jpg',
            function (texture) {
                let star2 = new THREE.SphereGeometry(70, 100, 100);
                let material = new THREE.MeshLambertMaterial({ map: texture }); //创建材质
                muxing = new THREE.Mesh(star2, material); //根据物体和材质创建一个网格
                muxing.position.set(0, 0, -450);
                group.add(muxing);
            }
        )
        loader.load(
            'texture/haiwangxing.jpg',
            function (texture) {
                let star3 = new THREE.SphereGeometry(60, 100, 100);
                let material = new THREE.MeshLambertMaterial({ map: texture }); //创建材质
                haiwangxing = new THREE.Mesh(star3, material); //根据物体和材质创建一个网格
                haiwangxing.position.set(0, 0, -350);
                group.add(haiwangxing);
            }
        )


        let ground = new THREE.PlaneGeometry(3000, 3000, 100, 100);
        let material = new THREE.MeshLambertMaterial({ color: 0xff0000 }); //创建材质
        let meshGround = new THREE.Mesh(ground, material);
        //mesh.position = new THREE.Vector3(0, 0, 600);     //设置位置属性 所有属性：position, rotation, scale, translateX, translateY, translateZ, visible
        //star1mesh.position = new THREE.Vector3(0, 0, 0);

        meshGround.position.set(0, -500, 0);
        //scene.add(meshGround);
        //scene.add(mesh);    //把网格添加至场景
    }

    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initLight();
        initObject();
        animate();
    }

    let ang1 = ang2 = ang3 = ang4 = 0;
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let isMouseDown = false;
    function animate() {
        cameraMoveControl(camera);
        if (earth) {
            earth.rotation.y += 0.01;
        }
        if (jinxing) {
            jinxing.rotation.y += 0.01;
            ang1 += 0.01;
            let x = 250 * Math.cos(ang1);
            let z = 250 * Math.sin(ang1);
            jinxing.position.set(x, 0, z);
        }
        if (muxing) {
            muxing.rotation.y += 0.008;
            ang2 += 0.006;
            let x = 400 * Math.cos(ang2);
            let z = 400 * Math.sin(ang2);
            muxing.position.set(x, 0, z);
        }
        if (haiwangxing) {
            haiwangxing.rotation.y += 0.008;
            ang3 += 0.003;
            let x = 600 * Math.cos(ang3);
            let z = 600 * Math.sin(ang3);
            haiwangxing.position.set(x, 0, z);
        }
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        intersects = raycaster.intersectObjects(group.children);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }


    function onMouseMove(event) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    let intersected,
        intersects;
    function onMouseDown(event) {
        isMouseDown = true;
        if (intersects.length > 0) {
            if (!intersected) {
                intersected = intersects[0].object;
                intersected.curHex = intersected.material.emissive.getHex();
                intersected.material.emissive.setHex(0xff0000);
                if (mode === 1) {
                    intersected.add(light);
                }
            } else if (intersected !== intersects[0].object) {
                if (intersected) intersected.material.emissive.setHex(intersected.curHex);
                intersected = intersects[0].object;
                intersected.curHex = intersected.material.emissive.getHex();
                intersected.material.emissive.setHex(0xff0000);
                if (mode === 1) {
                    intersected.add(light);
                }
            } else {
                intersected.material.emissive.setHex(intersected.curHex);
                intersected = null;
            }
        }
    }

    function onMouseUp(event) {
        isMouseDown = false;
    }

    let keys = {
        left: false,
        right: false,
        up: false,
        down: false,
        far: false,
        near: false
    };
    function onKeyDown(event) {
        let key = event.key;
        let moveDistance = 5;
        switch (key) {
            case 'w': {
                keys.near = true;
                break;
            }
            case 's': {
                keys.far = true;
                break;
            }
            case 'a': {
                keys.left = true;
                break;
            }
            case 'd': {
                keys.right = true;
                break;
            }
            case 'z': {
                keys.up = true;
                break;
            }
            case 'x': {
                keys.down = true;
                break;
            }
            default: break;
        }
    }

    function onKeyUp(event) {
        let key = event.key;
        let moveDistance = 5;
        switch (key) {
            case 'w': {
                keys.near = false;
                break;
            }
            case 's': {
                keys.far = false;
                break;
            }
            case 'a': {
                keys.left = false;
                break;
            }
            case 'd': {
                keys.right = false;
                break;
            }
            case 'z': {
                keys.up = false;
                break;
            }
            case 'x': {
                keys.down = false;
                break;
            }
            default: break;
        }
    }

    function cameraMoveControl(camera) {
        let speed = 1;
        let position = camera.position;
        if (keys.near) {
            position.z -= speed;
        }
        if (keys.far) {
            position.z += speed;
        }
        if (keys.left) {
            position.x -= speed;
        }
        if (keys.right) {
            position.x += speed;
        }
        if (keys.up) {
            position.y += speed;
        }
        if (keys.down) {
            position.y -= speed;
        }
    }

    function starsMoveControl() {

    }

    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    threeStart();
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
})(window);