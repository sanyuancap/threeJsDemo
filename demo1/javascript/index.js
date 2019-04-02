(function(window, undefined) {
    let qString = getQueryString("mode");
    let mode = qString ? +qString : 0;
    //init renderer
    let renderer, width, height;
    function initThree() {
        let canvas = document.getElementById("canvas");
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        canvas.appendChild(renderer.domElement);
        renderer.setClearColor(0x222222, 0.5);
    }

    //init scene
    let scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    //init camera
    let camera;
    function initCamera() {
        if(mode === 0){
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        } else if(mode === 1){
            camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 1, 10000);
        }
        camera.position.set(0, 600, 700);
        camera.up.set(0, 1, 0);
        camera.lookAt({x: 0, y: 0, z: 0});
    }

    //init light
    let light, bulbLight;
    function initLight() {
        light = new THREE.PointLight();
        light.position.set(0, 500, 500);
        scene.add(light);
        bulbLight = new THREE.PointLight(0x22ee88, 1, 100, 2);
        bulbLight.position.set(0, 0, 0);
        bulbLight.castShadow = true;
        //scene.add(bulbLight);
    }

    //init object
    let cube;
    function initObject() {
        // let bulbGeometry = new THREE.SphereGeometry(1, 50, 50);
        // let bulbMat = new THREE.MeshStandardMaterial({
        //     color: 0x000000,
        //     emissive: 0xffee88,
        //     emissiveIntensity: 1
        // });
        // let mesh = new THREE.Mesh(bulbGeometry, bulbMat);
        // scene.add(mesh);
        //mesh.add(bulbLight);

        let cubeGeometry = new THREE.BoxGeometry(300, 300, 300);
        let cubeMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            wireframe: true,
            wireframeLinewidth: 1
        });
        cube = new THREE.Mesh(cubeGeometry, cubeMat);
        let outline = new THREE.BoxHelper(cube);
        scene.add(outline);
        let cubeVertices = cubeGeometry.vertices;
        for(let i = 0; i < cubeVertices.length; i++){
            let verticePointGeo = new THREE.SphereGeometry(5, 10, 10);
            let verticeMat = new THREE.MeshStandardMaterial({
                color: 0x000000,
                emissive: 0xff0000,
                emissiveIntensity: 1
            })
            let verticeObj = new THREE.Mesh(verticePointGeo, verticeMat);
            let curVertice = cubeVertices[i];
            verticeObj.position.set(curVertice.x, curVertice.y, curVertice.z);
            verticeObj.name = 'vertice'
            scene.add(verticeObj);
        }
        //scene.add(cube);
        // var lineGeometry = new THREE.Geometry();
        // lineGeometry.vertices.push(new THREE.Vector3(-200, -200, -200));
        // lineGeometry.vertices.push(new THREE.Vector3(200, 200, 200));
        // //lineGeometry.computeLineDistances();
        // //定义线的基本材料，我们可以使用LineBasicMaterial（实线材料）和LineDashedMaterial（虚线材料）
        // var lineMaterial = new THREE.LineDashedMaterial({
        //     color : 0x9B30FF
        // });
        // var line = new THREE.Line(lineGeometry, lineMaterial);
        // // 计算线条间的距离
        // scene.add(line);

    }

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let intersects, selected;
    function onMouseMove(event) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onMouseDown(event) {
        if(event.button === 0){
            if(intersects.length > 0 && intersects[0].object.name === "vertice"){
                let intersect = intersects[0];
                if(!selected){
                    selected = intersect.object;
                    selected.curHex = selected.material.emissive.getHex();
                    selected.material.emissive.setHex(0x00ff00);
                } else if(selected !== intersect.object){
                    let pointA = new THREE.Vector3().copy(selected.position),
                        pointB = new THREE.Vector3().copy(intersect.object.position);
                    drawLine(pointA, pointB);
                    selected.material.emissive.setHex(selected.curHex);
                    selected = null;
                } else {
                    selected.material.emissive.setHex(selected.curHex);
                    selected = null;
                }
            }
        }
        event.preventDefault();
    }

    function onKeyDown(event){
        if(event.key === 'z' && event.ctrlKey && lineStack.length > 0){
            scene.remove(lineStack.pop());
        }
    }

    let lineStack = [];
    function drawLine(pointA, pointB) {
        let lineGeometry = new THREE.Geometry();
        if(pointA instanceof THREE.Vector3 && pointB instanceof THREE.Vector3){
            lineGeometry.vertices.push(
                pointA,
                pointB
            );
        }
        lineGeometry.computeLineDistances();
        let line = new THREE.Line(lineGeometry, new THREE.LineDashedMaterial({
            color: 0x00ff00,
            gapSize: 3,
            dashSize: 6
        }))
        scene.add(line);
        lineStack.push(line);
    }

    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        let r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    }

    function animate() {
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(scene.children);
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    }

    function threeStart() {
        initThree();
        initScene();
        initCamera();
        initLight();
        initObject();
        animate();
    }

    threeStart();

    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("keydown", onKeyDown, false);
    let control = new THREE.OrbitControls(camera, renderer.domElement)
})(window);