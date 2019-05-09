var colorsAsHex = {
	blue:	0xff0000,
	green:	0x00cc00,
	red:	0x0000ff,
	orange:	0xe9a300,
	white:	0xffffff,
	yellow:	0xffff00,
	black:	0x000000,
	gray:	0x555555,
	grey:	0x555555,
	cyan:	0xcce6ff
}

var colorsAsRgb = {
	blue:	{r:0, g:0, b:1},
	green:	{r:0, g:0.8, b:0},
	red:	{r:1, g:0, b:0},
	orange:	{r:0.91, g:0.64, b:0},
	white:	{r:1, g:1, b:1},
	yellow:	{r:1, g:1, b:0},
	black:	{r:0, g:0, b:0},
	gray:	{r:0.3, g:0.3, b:0.3},
	grey:	{r:0.3, g:0.3, b:0.3},
	cyan:	{r:0.8, g:0.9, b:1}
}

var sides = {
	front:	0,
	back:	1,
	left:	2,
	right:	3,
	top:	4,
	bottom:	5
}

var axis = {
	x: 0,
	y: 1,
	z: 2
}


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(colorsAsHex.white);
document.body.appendChild(renderer.domElement);


this.rcScene = new RubiksCubeScene(window.innerWidth, window.innerHeight);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  this.rcScene.camera.aspect = window.innerWidth / window.innerHeight;
  this.rcScene.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  this.rcScene.sceneWidth = window.innerWidth;
  this.rcScene.sceneHeight = window.innerHeight;
}

function animate(){
	this.rcScene.update();
    renderer.render(this.rcScene.scene, this.rcScene.camera);
	requestAnimationFrame( animate );
}
this.rcScene.update();

animate();