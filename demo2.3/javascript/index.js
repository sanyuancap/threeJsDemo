let qString = getQueryString("mode");
let mode = qString ? +qString : 0;

let 
jinxing = new Star({
    name: 'jinxing',
    imgSrc: 'texture/jinxing.jpg',
    selfRotateSpeed: 0.01,
    publicRotateSpeed: 0.01,
    radius: 50,
    distance: 250
}),
muxing = new Star({
    name: 'muxing',
    imgSrc: 'texture/muxing.jpg',
    selfRotateSpeed: 0.008,
    publicRotateSpeed: 0.006,
    radius: 70,
    distance: 450
}),
haiwangxing = new Star({
    name: 'haiwangxing',
    imgSrc: 'texture/haiwangxing.jpg',
    selfRotateSpeed: 0.008,
    publicRotateSpeed: 0.003,
    radius: 60,
    distance: 350
}),
diqiu = new Star({
    name: 'diqiu',
    isMainStar: true,
    imgSrc: 'texture/diqiu.jpg',
    selfRotateSpeed: 0.01,
    radius: 100,
    distance: 50
})

let space = new Space(mode);
space.add(diqiu).add(muxing).add(haiwangxing).add(jinxing);

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
