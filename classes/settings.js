var layer
let player
let cursors,
  prevPos = 0,
  yPos = 0,
  jumps = 2,
  touchJump = false,
  touchJumpThreshold = 5,
  touchSlider,
  sliderBar,
  sliderKnob,
  touchMoving = false,
  touchMoveThreshold = 3,
  touchMoveThresholdY = 50,
  largeThumbMoveAcross = 25,
  collapsingBlocks,
  thumbSizeOffset = 60,
  oneWayBlocks,
  hPlatforms,
  launchers,
  beams,
  bombs,
  keys,
  bombBody,
  bombBlocks,
  lavas,
  lavaLaunchers,
  lavaBall,
  controls,
  enemies,
  doors,
  switches,
  switchBlocks,
  questions,
  powerupGroup,
  antennas,
  emitter,
  bullets,
  bulletSpeed = 350,
  sparks,
  startX,
  startY;

let currentRoom = 0
let enteredFrom = 'none'

let collapseFrame = 4
let launchUpFrameUp = 1
let launchUpFrameLeft = 3
let launchUpFrameRight = 2
let oneWayUpFrame = 13
let oneWayDownFrame = 12
let oneWayRightFrame = 11
let oneWayLeftFrame = 10
let lavaFrame = 5
let lavaLauncherFrame = 14
let lavaBallFrame = 15
let sparkFrame = 17
let hPlatformFrame = 21
let beamFrame = 22
let bombBlockFrame = 6
let keyFrame = 24
let controlFrame = 28
let doorRFrame = 67
let doorLFrame = 77
let doorUFrame = 68
let doorDFrame = 78
let switchFrame = 43
let switchBlockFrame = 33//69
let questionFrame = 34
let antennaFrame = 60

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
    document.fonts.add(loaded);
  }).catch(function (error) {
    return error;
  });
}
loadFont("PixelFont", "assets/fonts/mago1.ttf");
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");


let playerData = {}
playerData.health = 100
playerData.roomsCompleted = []
playerData.currentRoom = 0
playerData.range = 75
playerData.hasGun = true

let gridCols = 6
let gridRows = 8
// 2,3 6*3 + 2 = 20
//var ind = (gridCols * y) + x
//var mapColumn = value % gridCols
//var mapRow = Math.floor(value / gridCols)
let rooms = [
  {
    id: 0,
    roomKey: 'level0', //json
    leftID: null,//room id connected to room
    rightID: 1,
    upID: null,
    downID: null,
  },
  {
    id: 1,
    roomKey: 'level1', //json
    leftID: 0,//room id connected to room
    rightID: 2,
    upID: null,
    downID: 4,
  },
  {
    id: 2,
    roomKey: 'level2', //json
    leftID: 1,//room id connected to room
    rightID: null,
    upID: null,
    downID: 5,
  },
  {
    id: 3,
    roomKey: 'level3', //json
    leftID: null,//room id connected to room
    rightID: 4,
    upID: null,
    downID: null,
  },
  {
    id: 4,
    roomKey: 'level4', //json
    leftID: 3,//room id connected to room
    rightID: 5,
    upID: 1,
    downID: null,
  },
  {
    id: 5,
    roomKey: 'level5', //json
    leftID: 4,//room id connected to room
    rightID: null,
    upID: 4,
    downID: null,
  }
]

let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}
function roomComplete() {
  return playerData.roomsCompleted.indexOf(currentRoom) > -1
}