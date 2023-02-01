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


    var value = 1
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
      console.log('current room ' + currentRoom + ', current world ' + currentWorld)

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
      playerData.roomsCompleted.push(currentRoom)
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

    /* this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 400,
      y: 700,
      radius: 100,
      forceMin: 16,
      base: this.add.circle(0, 0, 100, 0x333333),
      thumb: this.add.circle(0, 0, 50, 0xff0000)
    })
     .on("update", this.dumpJoyStickState, this); 
    this.cursor = this.add.rectangle(400, 650, 50, 50, 0x0000ff);
    // this.text = this.add.text(50, 500)
    this.joyStickState();
    //this.dumpJoyStickState();

    console.log("joystick", this.joystick);
 */
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
  dumpJoyStickState() {
    this.text.setText(
      toString(this.joystick, [
        "angle",
        "down",
        "enable",
        "force",
        "forceX",
        "forceY",
        "left",
        "noKey",
        "pointerX",
        "pointerY",
        "right",
        "rotation",
        "up",
        "visible",
        "x",
        "y"
      ])
    );
  }

  joyStickState() {
    var cursorKeys = this.joystick.createCursorKeys();
    //console.log(cursorKeys.right.isDown)
    if (cursorKeys.right.isDown) {
      player.dpad.isRight = true
      console.log(this.Main.player.dpad.isRight)
    } else if (cursorKeys.left.isDown) {
      player.dpad.isLeft = true
    } else if (cursorKeys.up.isDown) {
      player.dpad.isUp = true
    } else if (cursorKeys.down.isDown) {
      player.dpad.isDown = true
    } else {
      //this.Main.player.dpad.isDown = false
      //this.Main.player.dpad.isUp = false
      player.dpad.isRight = false
      player.dpad.isLeft = false
      player.dpad.isUp = false
    }
  }
  toggleMenu() {

    if (this.menuGroup.y == 0) {
      this.scene.pause('playGame')

      // console.log('Open menu')
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: -270,
        duration: 500,
        ease: 'Bounce'
      })
      /* var menuTween = this.tweens.add({
        targets: this.tallyContainer,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      }) */

    }
    if (this.menuGroup.y == -270) {

      this.scene.resume('playGame')
      // console.log('close menu')dd
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })
      /*  var menuTween = this.tweens.add({
         targets: this.tallyContainer,
         y: -1640,
         duration: 500,
         ease: 'Bounce'
       }) */
    }
  }
  makeMenu() {
    ////////menu
    this.menuGroup = this.add.container().setDepth(5);
    var menuBG = this.add.image(game.config.width / 2, game.config.height - 85, 'blank').setOrigin(.5, 0).setTint(0x333333).setAlpha(.8)
    menuBG.displayWidth = 300;
    menuBG.displayHeight = 600
    this.menuGroup.add(menuBG)
    var menuButton = this.add.image(game.config.width / 2, game.config.height - 40, "menu").setInteractive().setDepth(3);
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




}


function toString(obj, keys) {
  return JSON.stringify(obj, keys, 2);
}
