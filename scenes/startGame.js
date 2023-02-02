class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

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

    this.cameras.main.setBackgroundColor(0x000000);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'Electrical', 100).setOrigin(.5).setTint(0xc76210);

    this.startTime = this.add.bitmapText(game.config.width / 2, 275, 'topaz', text, 50).setOrigin(.5).setTint(0xffffff);
    this.startTime.setInteractive();
    this.startTime.on('pointerdown', this.clickHandler, this);
    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player", { frames: [0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "player-run",
      frames: this.anims.generateFrameNumbers("player", { frames: [6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8] }),
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
  clickHandler() {
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

}