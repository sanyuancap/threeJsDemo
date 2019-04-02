(function (window, undefined) {
    function Space(mode) {
        this.mode = mode;
        this.size = 0;
        this.stars = [];
        this.selected = null;
        this.intersected;
        this.intersects;
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            far: false,
            near: false
        };
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.loader = new THREE.TextureLoader();
        this.group = new THREE.Group();
        this.init();
    }
    Space.prototype = {
        init: function () { 
            this.threeStart();
            this.scene.add(this.group);
            this.addListener();
        },
        add: function (star) {
            let self = this;
            self.loader.load(
                star.imgSrc,
                function (texture) {
                    let geometry = new THREE.SphereGeometry(star.radius, 100, 100);  //创建一个球体
                    let material = new THREE.MeshLambertMaterial({ map: texture }); //创建材质
                    let curStar = new THREE.Mesh(geometry, material); //根据物体和材质创建一个网格
                    curStar.position.set(0, 0, star.distance);
                    curStar.selfRotateSpeed = star.selfRotateSpeed;
                    curStar.publicRotateSpeed = star.publicRotateSpeed;
                    curStar.distance = star.distance;
                    curStar.name = star.name;
                    curStar.isMainStar = star.isMainStar;
                    self.group.add(curStar);
                }
            );
            return self;
        },
        threeStart: function () {
            this.initThree();
            this.initScene();
            this.initLight();
            this.initCamera();
            this.update();
        },
        initThree: function () {
            let canvas = document.getElementById("canvas");
            this.width = canvas.clientWidth;
            this.height = canvas.clientHeight;
            let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });   //new一个渲染器，设置抗锯齿为true
            renderer.setSize(this.width, this.height);    //设置渲染器大小
            canvas.appendChild(renderer.domElement);    //把渲染器的文档元素添加到canvas（标签）
            renderer.setClearAlpha(0.8);  //给渲染器背景设置颜色，透明度。
            this.renderer = renderer;
        },
        initScene: function () {
            let scene = new THREE.Scene();  //构造函数创建新场景 
            this.scene = scene;
        },
        initCamera: function () {
            let camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
            camera.position.x = 0;  //可以直接用camera.position.set(x, y, z)，设置相机的具体位置，参照右手坐标系
            camera.position.y = 600;
            camera.position.z = 900;
            camera.up.x = 0;    //设置相机上部的方向
            camera.up.y = 0;    //这里设置相机上部的方向为y轴正方向，是正常方向，如果为x轴正方向，则意味着相机向右旋转90度
            camera.up.z = -1;
            camera.lookAt({ x: 0, y: 0, z: 0 });
            this.camera = camera;
        },
        initLight: function () {
            let light = new THREE.PointLight(); //new一个新的点光源
            if (this.mode === 0) {
                light.position.set(0, 500, 500);
            } else if (this.mode === 1) {
                light.position.set(0, 0, 0);
            }
            this.scene.add(light);
            this.light = light;
        },
        initObject: function () {

        },
        update: function () {
            this.cameraMoveControl(this.camera);
            let stars = this.group.children;
            for(let i = 0; i < stars.length; i++){
                let curStar = stars[i];
                if(curStar){
                    curStar.rotation.y += curStar.selfRotateSpeed;
                    if(!curStar.isMainStar){
                        curStar.curAng = curStar.curAng || 0;
                        curStar.curAng += curStar.publicRotateSpeed;
                        let x = curStar.distance * Math.cos(curStar.curAng);
                        let z = curStar.distance * Math.sin(curStar.curAng);
                        curStar.position.set(x, 0, z);
                    }
                }
            }
            this.raycaster.setFromCamera(this.mouse, this.camera);

            // calculate objects intersecting the picking ray
            this.intersects = this.raycaster.intersectObjects(this.group.children);
            this.renderer.render(this.scene, this.camera);
            let theUpdate = this.update.bind(this);
            requestAnimationFrame(theUpdate);
        },
        cameraMoveControl: function (camera) {
            let speed = 1;
            let position = camera.position;
            let keys = this.keys;
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
        },
        addListener: function () {
            document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
            window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
            window.addEventListener("keydown", this.onKeyDown.bind(this), false);
            window.addEventListener('keyup', this.onKeyUp.bind(this), false);
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        },
        onKeyDown: function (event) {
            let key = event.key;
            let moveDistance = 5;
            let keys = this.keys;
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
        },
        onKeyUp: function (event) {
            let key = event.key,
                keys = this.keys;
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
        },
        onMouseMove: function (event) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        },
        onMouseDown: function (event) {
            if (this.intersects.length > 0) {
                let mode = this.mode;
                if (!this.intersected) {
                    this.intersected = this.intersects[0].object;
                    this.intersected.curHex = this.intersected.material.emissive.getHex();
                    this.intersected.material.emissive.setHex(0xff0000);
                    if (mode === 1) {
                        this.intersected.add(this.light);
                    }
                } else if (this.intersected !== this.intersects[0].object) {
                    if (this.intersected) this.intersected.material.emissive.setHex(this.intersected.curHex);
                    this.intersected = this.intersects[0].object;
                    this.intersected.curHex = this.intersected.material.emissive.getHex();
                    this.intersected.material.emissive.setHex(0xff0000);
                    if (mode === 1) {
                        this.intersected.add(this.light);
                    }
                } else {
                    this.intersected.material.emissive.setHex(this.intersected.curHex);
                    this.intersected = null;
                }
            }
        }
    }

window.Space = Space;

})(window);