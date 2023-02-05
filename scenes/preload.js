class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("particle", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("particle", "assets/particle.png");
    }




    //this.load.image("particle", "assets/sprites/particle.png");
    this.load.bitmapFont('topaz', 'assets/fonts/topaz.png', 'assets/fonts/topaz.xml');


    this.load.spritesheet("particle_color", "assets/particles.png", {
      frameWidth: 6,
      frameHeight: 6
    });

    this.load.spritesheet("player", "assets/sprites/player2.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("enemies", "assets/sprites/enemies.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet("tiles", "assets/sprites/tiles2.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 1
    });
    this.load.spritesheet('explode', 'assets/sprites/explosion.png', {
      frameWidth: 48,
      frameHeight: 48
    });
    this.load.spritesheet('grid', 'assets/sprites/mapgrid.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('boss1', 'assets/sprites/boss1.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('menu', 'assets/sprites/menu.png');
    this.load.image('logotitle', 'assets/sprites/logotitle.png');
    this.load.image('hplatform', 'assets/sprites/hplatform.png');
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('progressBox', 'assets/sprites/progressBox.png');
    this.load.image("touch-slider", "assets/sprites/touch-slider.png");
    this.load.image("touch-knob", "assets/sprites/touch-knob.png");
    this.load.image("bomb", "assets/sprites/bomb.png");
    this.load.image("bullet", "assets/sprites/bullet.png");
    this.load.image("ground", "assets/sprites/ground.png");
    this.load.image("game-over", "assets/sprites/game-over.png");
    this.load.image("restart", "assets/sprites/restart.png");
  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








