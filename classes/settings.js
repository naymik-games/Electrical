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
  reappearBlocks,
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
  upgrades,
  transports,
  sparks,
  blockSparks,
  batteryPacks,
  startX,
  startY;

let currentWorld = 0
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
let sparkUpFrame = 17
let sparkUpFrames = [0, 17, 18, 19]
let sparkDownFrame = 146
let sparkDownFrames = [0, 146, 147, 148]
let sparkRightFrame = 118
let sparkRightFrames = [0, 118, 128, 138]
let sparkLeftFrame = 117
let sparkLeftFrames = [0, 117, 127, 137]
let blockSparkFrame = 115
let blockSparkFrames = [0, 1, 2, 3]

let hPlatformFrame = 21
let beamFrame = 22
let hBeamFrame = 96
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
let upgradePowerFrame = 103
let upgradeBeamFrame = 104
let upgradeBombFrame = 105
let upgradeLongFrame = 106
let upgradeBodyFrame = 107
let upgrade3Frame = 108
let reappearFrame = 7
let to0TransportFrame = 150
let to1TransportFrame = 151
let to2TransportFrame = 152
let to3TransportFrame = 160
let to4TransportFrame = 161
let to5TransportFrame = 162

let upgradeTeleportFrame = 109
let upgradeTopFrame = 91
let upgradeTopAnim = [91, 92, 93, 94]



let acceleration = 600
let maxVelocityX = 200
let superMaxVelocityX = 300
let jumpVelocity = -700
let jumping = false;
wasStanding = false,
  edgeTimer = 0;

var playerStandBodyX = 26
var playerStandBodyY = 34
var playerStandBodyXOffset = 3
var playerStandBodyYOffset = -2
var playerRollBodyX = 26
var playerRollBodyY = 20
var playerRollBodyXOffset = 3
var playerRollBodyYOffset = 12



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

let playerData

let playerDataDefault = {}
playerDataDefault.health = 100
playerDataDefault.roomsCompleted = [[], [], [], [], [], [], [], [], [], []]
playerDataDefault.worldsCompleted = []
playerDataDefault.currentRoom = 0
playerDataDefault.currentWorld = 0
playerDataDefault.range = 75
playerDataDefault.damage = 1
playerDataDefault.hasGun = false
playerDataDefault.hasLong = false
playerDataDefault.hasBomb = false
playerDataDefault.hasBody = false
playerDataDefault.has3Way = false




let gridCols = 6
let gridRows = 8
// 2,3 6*3 + 2 = 20
//var ind = (gridCols * y) + x
//var mapColumn = value % gridCols
//var mapRow = Math.floor(value / gridCols)
let worlds = [
  {
    id: 0,
    name: 'White Board',
    cols: 3,
    rows: 3,
    transportRoomID: 6,
    tilesKey: 'tiles'
  },
  {
    id: 1,
    name: 'Blue Board',
    cols: 5,
    rows: 7,
    transportRoomID: 0,
    tilesKey: 'tiles2'
  }
]

let rooms =

{
  0:
    [{
      id: 0,
      roomKey: 'level0-0', //json
      leftID: null,//room id connected to room
      rightID: 1,
      upID: null,
      downID: null,
      doorConfig: 4
    },
    {
      id: 1,
      roomKey: 'level0-1', //json
      leftID: 0,//room id connected to room
      rightID: 2,
      upID: null,
      downID: null,
      doorConfig: 8
    },
    {
      id: 2,
      roomKey: 'level0-2', //json
      leftID: 1,//room id connected to room
      rightID: null,
      upID: null,
      downID: 5,
      doorConfig: 16
    },
    {
      id: 3,
      roomKey: 'level0-3', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: 6,
      doorConfig: 6
    },
    {
      id: 4,
      roomKey: 'level0-4', //json
      leftID: null,//room id connected to room
      rightID: 5,
      upID: null,
      downID: 7,
      doorConfig: 18
    },
    {
      id: 5,
      roomKey: 'level0-5', //json
      leftID: 4,//room id connected to room
      rightID: null,
      upID: 2,
      downID: 8,
      doorConfig: 14
    },
    {
      id: 6,
      roomKey: 'level0-6', //json
      leftID: null,//room id connected to room
      rightID: 7,
      upID: 3,
      downID: null,
      doorConfig: 19
    },
    {
      id: 7,
      roomKey: 'level0-7', //json
      leftID: 6,//room id connected to room
      rightID: 8,
      upID: 4,
      downID: null,
      doorConfig: 13
    },
    {
      id: 8,
      roomKey: 'level0-8', //json
      leftID: 7,//room id connected to room
      rightID: null,
      upID: 5,
      downID: null,
      doorConfig: 17
    }
    ],
  1: [
    {
      id: 0,
      roomKey: 'level1-0', //json DONE
      leftID: null,//room id connected to room
      rightID: 1,
      upID: null,
      downID: null,
      doorConfig: 4
    },
    {
      id: 1,
      roomKey: 'level1-1', //json DONE
      leftID: 0,//room id connected to room
      rightID: 2,
      upID: null,
      downID: null,
      doorConfig: 8
    },
    {
      id: 2,
      roomKey: 'level1-2', //json DONE
      leftID: 1,//room id connected to room
      rightID: null,
      upID: null,
      downID: 7,
      doorConfig: 16
    },
    {
      id: 3,
      roomKey: 'level1-3', //json
      leftID: null,//room id connected to room
      rightID: 4,
      upID: null,
      downID: 8,
      doorConfig: 18
    },
    {
      id: 4,
      roomKey: 'level1-4', //json DONE
      leftID: 3,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 5
    },
    {
      id: 5,
      roomKey: 'level1-5', //DONE
      leftID: null,//room id connected to room
      rightID: 6,
      upID: null,
      downID: 10,
      doorConfig: 18
    },
    {
      id: 6,
      roomKey: 'level1-6', //jso
      leftID: 5,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 5
    },
    {
      id: 7,
      roomKey: 'level1-7', //json DONE
      leftID: null,//room id connected to room
      rightID: null,
      upID: 2,
      downID: 12,
      doorConfig: 10
    },
    {
      id: 8,
      roomKey: 'level1-8', //json
      leftID: null,//room id connected to room
      rightID: 9,
      upID: 3,
      downID: null,
      doorConfig: 19
    },
    {
      id: 9,
      roomKey: 'level1-9', //json
      leftID: 8,//room id connected to room
      rightID: null,
      upID: null,
      downID: 14,
      doorConfig: 16
    },
    {
      id: 10,
      roomKey: 'level1-10', //json
      leftID: null,//room id connected to room
      rightID: 11,
      upID: 5,
      downID: 15,
      doorConfig: 15
    },
    {
      id: 11,
      roomKey: 'level1-11', //json
      leftID: 1,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 8
    },
    {
      id: 12,
      roomKey: 'level1-12', //json DONE
      leftID: null,//room id connected to room
      rightID: null,
      upID: 7,
      downID: null,
      doorConfig: 2
    },
    {
      id: 13,
      roomKey: 'level1-13', //json
      leftID: 1,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 16
    },
    {
      id: 14,
      roomKey: 'level1-14', //json
      leftID: 1,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 10
    },
    {
      id: 15,
      roomKey: 'level1-15', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 19
    },
    {
      id: 16,
      roomKey: 'level1-16', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 5
    },
    {
      id: 17,
      roomKey: 'level1-17', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 10
    },
    {
      id: 18,
      roomKey: 'level1-18', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 19
    },
    {
      id: 19,
      roomKey: 'level1-19', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 17
    },
    {
      id: 20,
      roomKey: 'level1-20', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 18
    },
    {
      id: 21,
      roomKey: 'level1-21', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 5
    },
    {
      id: 22,
      roomKey: 'level1-22', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 19
    },
    {
      id: 23,
      roomKey: 'level1-23', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 8
    },
    {
      id: 24,
      roomKey: 'level1-24', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 16
    },
    {
      id: 25,
      roomKey: 'level1-25', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 10
    },
    {
      id: 26,
      roomKey: 'level1-26', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 4
    },
    {
      id: 27,
      roomKey: 'level1-27', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 12
    },
    {
      id: 28,
      roomKey: 'level1-28', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 5
    },
    {
      id: 29,
      roomKey: 'level1-29', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 10
    },
    {
      id: 30,
      roomKey: 'level1-30', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 19
    },
    {
      id: 31,
      roomKey: 'level1-31', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 8
    },
    {
      id: 32,
      roomKey: 'level1-32', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 13
    },
    {
      id: 33,
      roomKey: 'level1-33', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 8
    },
    {
      id: 34,
      roomKey: 'level1-34', //json
      leftID: null,//room id connected to room
      rightID: null,
      upID: null,
      downID: null,
      doorConfig: 17
    }
  ]
}


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
  return playerData.roomsCompleted[currentWorld].indexOf(currentRoom) > -1
}