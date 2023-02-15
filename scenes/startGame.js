class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');
    this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

  }
  create() {
    this.new = false
    var text = 'Continue Game'
    playerData = JSON.parse(localStorage.getItem('ElectricalSave'));
    if (playerData === null || playerData.length <= 0) {
      localStorage.setItem('ElectricalSave', JSON.stringify(playerDataDefault));
      playerData = playerDataDefault;
      this.new = true
      text = 'Start Game'
    }

    this.cameras.main.setBackgroundColor(0x161616);
    //   this.title = this.add.text(game.config.width / 2, 100, 'ELECTRICAL', { fontFamily: 'PixelFont', fontSize: '125px', color: '#C6EFD8', align: 'center' }).setOrigin(.5)//C6EFD8
    this.title = this.add.image(game.config.width / 2, 100, 'logotitle')
    //  var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'Electrical', 100).setOrigin(.5).setTint(0xc76210);

    this.startTime = this.add.bitmapText(game.config.width / 2, 250, 'topaz', text, 50).setOrigin(.5).setTint(0xffffff);
    this.startTime.setInteractive();
    this.startTime.on('pointerdown', this.clickHandler, this);

    // currentRoom = playerData.currentRoom
    //  currentWorld = playerData.currentWorld

    var text = '('
    text += 'World ' + playerData.currentWorld
    text += ', Level ' + playerData.currentRoom
    text += ')'
    this.gameState = this.add.bitmapText(game.config.width / 2, 310, 'topaz', text, 30).setOrigin(.5).setTint(0xE7EFD5);


    this.jumpText = this.add.bitmapText(game.config.width / 2 - 100, 400, 'topaz', 'Jump To:', 30).setOrigin(.5).setTint(0xffffff);
    this.jumpText.setInteractive();
    this.jumpText.on('pointerdown', this.clickHandler4, this);

    this.worldText = this.add.rexInputText(400, 405, 10, 10, {
      id: 'worldinput',
      type: 'number',
      text: '0',
      fontSize: '36px',
      color: '#E7EFD5',
    })
      .resize(100, 100)
      .setOrigin(0.5)
    /*  .on('textchange', function (inputText) {
       printText.text = inputText.text;
     }) */

    this.levelText = this.add.rexInputText(450, 405, 10, 10, {
      id: 'levelinput',
      type: 'number',
      text: '0',
      fontSize: '36px',
      color: '#E7EFD5',
    })
      .resize(100, 100)
      .setOrigin(0.5)






    this.startRunner = this.add.bitmapText(game.config.width / 2, 875, 'topaz', 'Runner', 50).setOrigin(.5).setTint(0xffffff);
    this.startRunner.setInteractive();
    this.startRunner.on('pointerdown', this.clickHandler2, this);
    this.startVerticle = this.add.bitmapText(game.config.width / 2, 925, 'topaz', 'Verticle', 50).setOrigin(.5).setTint(0xffffff);
    this.startVerticle.setInteractive();
    this.startVerticle.on('pointerdown', this.clickHandler3, this);

    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player", { frames: [0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "player-run",
      frames: this.anims.generateFrameNumbers("player", { frames: [6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,] }),
      frameRate: 12,
      repeat: 0
    });
    this.tempPlayer = this.add.sprite(game.config.width / 2, game.config.height / 2, 'player', 2).setScale(3)
    this.tempPlayer.play('player-idle')

    var deleteGame = this.add.bitmapText(game.config.width / 2, game.config.height - 50, 'topaz', 'Delete Game', 30).setOrigin(.5).setTint(0xfafafa);
    deleteGame.setInteractive();
    deleteGame.on('pointerdown', function () {
      localStorage.removeItem('PTSave');
      localStorage.setItem('ElectricalSave', JSON.stringify(playerDataDefault));
      playerData = playerDataDefault;
      deleteGame.setText('Deleted')
      this.startTime.setText('Start Game')
    }, this);



  }
  clickHandler2() {
    this.scene.start('Runner');
  }
  clickHandler3() {
    this.scene.start('Verticle');
  }
  clickHandler() {
    console.log(playerData)
    currentRoom = playerData.currentRoom
    currentWorld = playerData.currentWorld


    var t = this.tweens.add({
      targets: this.tempPlayer,
      x: game.config.width + 96,
      duration: 400
    })
    // this.tempPlayer.amims.stop('player-idle')
    this.tempPlayer.anims.play("player-run", true).once('animationcomplete', function () {
      console.log('current room ' + currentRoom + ', current world ' + currentWorld)

      this.scene.start('playGame');
      this.scene.launch('UI');
    }, this)

  }
  clickHandler4() {


    currentRoom = parseInt(this.levelText.text)
    currentWorld = parseInt(this.worldText.text)
    // currentRoom = playerData.currentRoom
    //  currentWorld = playerData.currentWorld

    var t = this.tweens.add({
      targets: this.tempPlayer,
      x: game.config.width + 96,
      duration: 400
    })
    // this.tempPlayer.amims.stop('player-idle')
    this.tempPlayer.anims.play("player-run", true).once('animationcomplete', function () {
      console.log('current room ' + currentRoom + ', current world ' + currentWorld)

      this.scene.start('playGame');
      this.scene.launch('UI');
    }, this)

  }
}