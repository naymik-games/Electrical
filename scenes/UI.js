let progressBox, progressBar


class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {
    /*  var url;
 
     url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
     this.load.plugin('rexvirtualjoystickplugin', url, true); */


  }
  create() {


    this.Main = this.scene.get('playGame');
    this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x000000).setAlpha(.8);//0x262626
    this.header.displayWidth = game.config.width;
    this.header.displayHeight = 100;


    var health = playerData.health
    var value = health / 100
    progressBox = this.add.graphics();
    progressBox.fillStyle(0x454545, .8);
    progressBox.fillRect(50, 25, 150, 35);


    progressBar = this.add.graphics();
    progressBar.clear()
    progressBar.fillStyle(0x00ff00, 1);
    progressBar.fillRect(55, 35, 140 * value, 15)
    this.progressBox = this.add.image(50, 25, 'progressBox').setScale(1).setOrigin(0)

    this.eText = this.add.text(game.config.width - 100, 35, rooms[worlds[currentWorld].id][currentRoom].id, { fontFamily: 'PixelFont', fontSize: '50px', color: '#fafafa', align: 'left' }).setOrigin(.5).setInteractive()//C6EFD8

    this.keyIcon = this.add.image(game.config.width - 48, 45, 'tiles', keyFrame).setScale(1.5).setAlpha(0)
    if (roomComplete()) {
      this.keyIcon.setAlpha(1)
    }
    this.Main.events.on('roomstatus', function () {
      // console.log('current room ' + currentRoom + ', current world ' + currentWorld)

      this.eText.setText(rooms[worlds[currentWorld].id][currentRoom].id)
      if (roomComplete()) {
        this.keyIcon.setAlpha(1)
      } else {
        this.keyIcon.setAlpha(0)
      }
    }, this)
    this.Main.events.on('key', function () {
      /* this.keyIcon.setAlpha(1)
      var t = this.tweens.add({
        targets: this.keyIcon,
        scale: 8,
        yoyo: true,
        duration: 300
      }) */
    }, this);
    this.Main.events.on('complete', function () {
      playerData.roomsCompleted[currentWorld].push(currentRoom)
      this.keyIcon.setAlpha(1)
      var t = this.tweens.add({
        targets: this.keyIcon,
        scale: 8,
        yoyo: true,
        duration: 300
      })
    }, this)
    this.Main.events.on('score', function (amount) {

      if (Math.sign(amount) == -1) {//losing health

        if (playerData.health + amount < 1) { //if new health less than zero
          playerData.health = 0
          this.updateHealthBar()
          console.log('die')
          // tankCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0 don't have, 1 empth, 2 full
        } else { //lose health but not less than zero, deduct and move on
          playerData.health += amount
          this.updateHealthBar()
        }
      } else {//gain health
        if (playerData.health + amount > 100) {//move 100 health to tank
          // tankCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0 don't have, 1 empth, 2 full

          playerData.health = 100 //no empty tanks just max out health and move on
          this.updateHealthBar()
          return

        } else {//other wise add health and move on
          playerData.health += amount
          this.updateHealthBar()
        }
      }

    }, this);


    /*  var tallyBG = this.add.image(300, 550, 'blank').setTint(0x046307).setAlpha(.8)
     tallyBG.displayWidth = 550
     tallyBG.displayHeight = 650
     this.tallyContainer.add(tallyBG) */

    this.makeMenu()
  }

  update(timestamp, delta) {
    /* this.joyStickState();
    this.cursor.x += 0.001 * delta * this.joystick.forceX;
    this.cursor.y += 0.001 * delta * this.joystick.forceY;
    this.cursor.rotation = this.joystick.rotation; */
  }
  updateHealthBar() {
    var health = playerData.health
    var value = health / 100
    progressBar.clear()
    progressBar.fillStyle(0x00ff00, 1);
    progressBar.fillRect(55, 32.5, 140 * value, 20)
  }

  toggleMenu() {

    if (this.menuGroup.y == 0) {
      this.makeMap()
      this.scene.pause('playGame')

      // console.log('Open menu')
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: -125,
        duration: 500,
        ease: 'Bounce'
      })
      var menuTween = this.tweens.add({
        targets: this.tallyContainer,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })

    }
    if (this.menuGroup.y == -125) {

      this.scene.resume('playGame')
      // console.log('close menu')dd
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })
      var menuTween = this.tweens.add({
        targets: this.tallyContainer,
        y: -1640,
        duration: 500,
        ease: 'Bounce',
        onCompleteScope: this,
        onComplete: function () {
          this.tallyContainer.destroy()
        }
      })
    }
  }
  makeMenu() {
    ////////menu
    this.menuGroup = this.add.container().setDepth(5);
    var menuBG = this.add.image(game.config.width / 2, game.config.height - 50, 'blank').setOrigin(.5, 0).setTint(0x333333).setAlpha(.8)
    menuBG.displayWidth = 200;
    menuBG.displayHeight = 600
    this.menuGroup.add(menuBG)
    var menuButton = this.add.image(game.config.width / 2, game.config.height - 25, "menu").setInteractive().setDepth(3);
    menuButton.on('pointerdown', this.toggleMenu, this)
    menuButton.setOrigin(0.5);
    this.menuGroup.add(menuButton);
    var homeButton = this.add.bitmapText(game.config.width / 2, game.config.height + 50, 'topaz', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    homeButton.on('pointerdown', function () {

      this.scene.stop()
      this.scene.stop('playGame')
      this.scene.start('startGame')

    }, this)
    this.menuGroup.add(homeButton);

    ////////end menu
  }

  makeMap() {
    this.tallyContainer = this.add.container()

    var dotSize = 550 / worlds[currentWorld].cols
    var xOffset = (game.config.width - (worlds[currentWorld].cols * dotSize)) / 2
    var yOffset = 150


    var tallyBG = this.add.image(300, yOffset - 15, 'blank').setTint(0x046307).setAlpha(1).setOrigin(.5, 0)
    tallyBG.displayWidth = 600
    tallyBG.displayHeight = (worlds[currentWorld].cols * dotSize) + 30
    this.tallyContainer.add(tallyBG)




    for (let y = 0; y < worlds[currentWorld].rows; y++) {
      for (let x = 0; x < worlds[currentWorld].cols; x++) {
        let xpos = xOffset + dotSize * x + dotSize / 2;
        let ypos = yOffset + dotSize * y + dotSize / 2
        var ind = (worlds[currentWorld].cols * y) + x
        var grid = this.add.image(xpos, ypos, 'grid', rooms[worlds[currentWorld].id][ind].doorConfig)

        if (playerData.roomsCompleted[currentWorld].indexOf(ind) > -1) {
          grid.setTint(0xBABAA6)
        }
        grid.displayWidth = dotSize
        grid.displayHeight = dotSize

        this.tallyContainer.add(grid)
        if (ind != currentRoom) {
          var num = this.add.text(xpos, ypos - 5, ind, { fontFamily: 'PixelFont', fontSize: (dotSize * .35) + 'px', color: '#fafafa', align: 'center' }).setOrigin(.5)//C6EFD8
          this.tallyContainer.add(num)
        }

      }
    }

    var mapColumn = currentRoom % worlds[currentWorld].cols
    var mapRow = Math.floor(currentRoom / worlds[currentWorld].cols)
    let xpos = xOffset + dotSize * mapColumn + dotSize / 2;
    let ypos = yOffset + dotSize * mapRow + dotSize / 2



    var play = this.add.sprite(xpos, ypos, 'player', 2)
    play.displayWidth = dotSize * .35
    play.scaleY = play.scaleX
    this.tallyContainer.add(play)
  }


}


function toString(obj, keys) {
  return JSON.stringify(obj, keys, 2);
}
