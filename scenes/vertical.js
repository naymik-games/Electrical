let gameOptions = {
  direction: 'up',
  // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
  firstPlatformPosition: 2 / 10,

  // game gravity, which only affects the hero
  gameGravity: 1200,

  // hero speed, in pixels per second
  heroSpeed: 300,

  // platform speed, in pixels per second
  platformSpeed: 100,

  // platform length range, in pixels
  platformLengthRange: [50, 150],

  platformWidth: ['block1', 'block2', 'block2', 'block3', 'block3', 'block3', 'block4', 'block4'],

  // platform horizontal distance range from the center of the stage, in pixels
  platformHorizontalDistanceRange: [0, 250],

  // platform vertical distance range, in pixels
  platformVerticalDistanceRange: [100, 175]
}

class Verticle extends Phaser.Scene {

  constructor() {
    super('Verticle');
  }
  preload() {
    this.load.image('block1', 'assets/sprites/block1.png');
    this.load.image('block2', 'assets/sprites/block2.png');
    this.load.image('block3', 'assets/sprites/block3.png');
    this.load.image('block4', 'assets/sprites/block4.png');
  }
  create() {
    if (gameOptions.direction == 'up') {
      gameOptions.platformSpeed = 100
    } else {
      gameOptions.platformSpeed = -100
    }
    this.cameras.main.setBackgroundColor(0x161616);
    // this.cameras.main.setZoom(1.5)
    console.log('verticle')
    const { height, width } = game.config;

    this.coinTime = 0
    this.respawnTimePlat = 0;
    this.isGameRunning = true;
    this.firstMove = true
    this.coinCount = 0
    this.score = 0

    // this.ground = this.add.tileSprite(0, height, width, 32, 'ground').setOrigin(0, 1)
    // this.ceiling = this.add.tileSprite(0, 100, width, 87, 'logotitle').setOrigin(0, 1)
    this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x000000).setAlpha(.8).setDepth(1);//0x262626
    this.header.displayWidth = game.config.width;
    this.header.displayHeight = 100;

    this.eText = this.add.text(game.config.width - 100, 35, '0', { fontFamily: 'PixelFont', fontSize: '50px', color: '#fafafa', align: 'left' }).setOrigin(.5).setInteractive().setDepth(2)//C6EFD8
    this.keyIcon = this.add.image(game.config.width - 48, 45, 'tiles', keyFrame).setScale(1.5).setAlpha(1).setDepth(2)
    this.sText = this.add.text(100, 35, '0', { fontFamily: 'PixelFont', fontSize: '50px', color: '#fafafa', align: 'left' }).setOrigin(.5).setDepth(2).setInteractive()//C6EFD8
    this.sIcon = this.add.image(48, 45, 'block1').setScale(1).setAlpha(1).setDepth(2)

    this.coins = this.physics.add.group();
    this.platformGroup = this.physics.add.group();
    this.sparks = this.physics.add.group();

    // create starting platform
    let platform = this.platformGroup.create(game.config.width / 2, game.config.height * gameOptions.firstPlatformPosition, "block3");

    // platform won't physically react to collisions
    platform.setImmovable(true);

    // we are going to create 10 more platforms which we'll reuse to save resources
    for (let i = 0; i < 10; i++) {

      // platform creation, as a member of platformGroup physics group
      let platform = this.platformGroup.create(0, 0, 'block1');

      // platform won't physically react to collisions
      platform.setImmovable(true);

      // position the platform
      this.positionPlatform(platform);
    }


    this.anims.create({
      key: "player-run",
      frames: this.anims.generateFrameNumbers("player", { frames: [6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8] }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: "player-jump",
      frames: this.anims.generateFrameNumbers("player", { start: 12, end: 14 }),
      frameRate: 6,
      repeat: 0
    });
    this.anims.create({
      key: "player-roll",
      frames: this.anims.generateFrameNumbers("player", { start: 18, end: 21 }),
      frameRate: 6,
      repeat: 0
    });
    this.anims.create({
      key: "spark-anim",
      frames: this.anims.generateFrameNumbers("spark-up", { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 0
    });
    this.player = this.physics.add.sprite(game.config.width / 2, (game.config.height * gameOptions.firstPlatformPosition) - 32, 'player').setOrigin(.5, 1).setGravityY(800).setMaxVelocity(200, 600)
    this.player.play('player-run')
    this.player.roll = false

    /* this.obsticles = this.physics.add.group();*/

    this.gameOverScreen = this.add.container(width / 2, height / 2 - 100).setAlpha(0)
    this.gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 80, 'restart').setInteractive();
    this.gameOverScreen.add([
      this.gameOverText, this.restart
    ])
    //this.gameOverScreen.setScrollFactor(0)
    this.restart.on('pointerdown', () => {
      this.player.setPosition(game.config.width / 2, 0)
      this.player.setVelocityY(0);
      this.coinCount = 0
      this.eText.setText(this.coinCount)
      this.score = 0
      this.sText.setText(this.score)
      this.physics.resume();

      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    })


    this.physics.add.collider(this.player, this.platformGroup, null, this.checkOneWay, this)
    /* this.physics.add.collider(this.player, this.obsticles, () => {
    
    }, null, this); */

    this.physics.add.overlap(this.player, this.coins, (player, coin) => {
      coin.disableBody(false, false);
      this.coinCount++
      this.eText.setText(this.coinCount)
      var tween = this.tweens.add({
        targets: coin,
        alpha: 0.3,
        angle: 720,
        //x: scoreCoin.x,
        y: '-=100',
        scaleX: 0.5,
        scaleY: 0.5,
        ease: "Linear",
        duration: 500,
        onCompleteScope: this,
        onComplete: function () {
          this.coins.killAndHide(coin);
        }
      });
    }, null, this);


    this.physics.add.overlap(this.player, this.sparks, (player, coin) => {
      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();

      this.gameOverScreen.setAlpha(1);

    }, null, this);



    this.buildTouchSlider();
  }
  positionPlatform(platform) {
    var ranHeight = this.randomValue(gameOptions.platformVerticalDistanceRange)
    // vertical position
    platform.y = this.getLowestPlatform() + ranHeight;

    // horizontal position
    platform.x = game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign();
    if (Phaser.Math.Between(0, 1) == 0) {
      this.placeCoin(platform.x, platform.y, ranHeight)
    }

    // platform width
    var ran = Phaser.Math.Between(0, gameOptions.platformWidth.length - 1)
    // gameOptions.platformWidth[ran]
    platform.setTexture(gameOptions.platformWidth[ran])
    if (gameOptions.platformWidth[ran] == 'block1') {
      platform.body.setSize(32, 32)
    } else if (gameOptions.platformWidth[ran] == 'block2') {
      platform.body.setSize(64, 32)
    } else if (gameOptions.platformWidth[ran] == 'block3') {
      platform.body.setSize(96, 32)
    } else if (gameOptions.platformWidth[ran] == 'block4') {
      this.placeSpark(platform.x, platform.y, ranHeight)
      platform.body.setSize(128, 32)
    }

  }
  placeCoin(x, y, height) {
    //console.log('create coin ' + x + ', ' + y)
    const enemyHeight = [25, 50, 100];// enemyHeight[Math.floor(Math.random() * 3)]
    let coin;
    coin = this.coins.create(x, y - (height - 48), 'tiles', 24, true, true)
      .setOrigin(0, 1);
    coin.setImmovable();
    if (!this.firstMove) {
      coin.setVelocityY(gameOptions.platformSpeed);
    }

    console.log(coin)
  }
  placeSpark(x, y, height) {
    //console.log('create coin ' + x + ', ' + y)
    const enemyHeight = [25, 50, 100];// enemyHeight[Math.floor(Math.random() * 3)]
    let spark;
    spark = this.sparks.create(x, y - 16, 'spark-up', 0, true, true)
      .setOrigin(0, 1);
    spark.setImmovable();
    spark.play('spark-anim')
    spark.body.setSize(16, 16).setOffset(8, 16)
    if (!this.firstMove) {
      spark.setVelocityY(-gameOptions.platformSpeed);
    }


  }
  getHighestPlatform() {
    let highestPlatform = game.config.height;
    this.platformGroup.getChildren().forEach(function (platform) {
      highestPlatform = Math.min(lowestPlatform, platform.y);

    });
    return highestPlatform;
  }
  getLowestPlatform() {
    let lowestPlatform = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      lowestPlatform = Math.max(lowestPlatform, platform.y);

    });
    return lowestPlatform;
  }
  randomValue(a) {
    return Phaser.Math.Between(a[0], a[1]);
  }

  update(time, delta) {
    if (!this.isGameRunning) { return; }

    this.platformGroup.getChildren().forEach(function (platform) {

      // if a platform leaves the stage to the upper side...
      if (platform.getBounds().bottom < 0) {

        // ... recycle the platform
        this.positionPlatform(platform);
        this.score++
        this.sText.setText(this.score)
      }
    }, this);
    this.coins.getChildren().forEach(function (coin) {

      // if a platform leaves the stage to the upper side...
      if (coin.getBounds().bottom < 0) {

        // ... recycle the platform
        this.coins.killAndHide(coin)
      }
    }, this);
    // if the hero falls down or leaves the stage from the top...
    if (this.player.y > game.config.height || this.player.y < -100) {
      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();

      this.gameOverScreen.setAlpha(1);
    }
    // this.ground.tilePositionX += this.gameSpeed;
    /* this.ceiling.tilePositionX += this.gameSpeed - 2;
    Phaser.Actions.IncX(this.environment.getChildren(), - 0.5);
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.coins.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.platforms.getChildren(), -this.gameSpeed); */


    /* 
        this.coinTime += delta * this.gameSpeed * 0.07;
        if (this.coinTime >= 1500) {
          this.placeCoin();
          this.coinTime = 0;
        }
    
        this.coins.getChildren().forEach(coin => {
          if (coin.getBounds().right < 0) {
            this.coins.killAndHide(coin);
          }
        }) */

    var standing = this.player.body.blocked.down || this.player.body.touching.down;

    if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
      touchSlider.x = this.player.x;
      //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
      touchSlider.y = this.player.y - thumbSizeOffset
      //work out half way point of our game
      var leftHalf = game.config.width * .75;

      //Left hand side - horizontal movement
      //if thumb is on the left hand side of the screen we are dealing with horizontal movement
      if (this.input.pointer1.x < leftHalf || this.input.pointer2.x < leftHalf) {
        //reset pointer variable
        var myMovePointer = null;
        //here we get the pointer that is being used on the left hand side of screen. Depends which thumb they touched screen with first.
        if (this.input.pointer1.x < leftHalf && this.input.pointer1.isDown) {
          myMovePointer = this.input.pointer1;
        }
        if (this.input.pointer2.x < leftHalf && this.input.pointer2.isDown) {
          myMovePointer = this.input.pointer2;
        }

        //if we have an active touch pointer on the left hand side of the screen then...
        if (myMovePointer) {
          //if touchSlide is not already showing then
          if (!touchSlider.alpha) {
            //make it visible
            touchSlider.alpha = 1;
            //position touchSlider to be where the users thumb or finger is
            touchSlider.x = this.player.x;
            //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
            touchSlider.y = this.player.y - thumbSizeOffset
            //set our start point and reset slider display
            startX = myMovePointer.x;
            startY = myMovePointer.y;
            sliderKnob.x = 0;
          }
          if (myMovePointer.y < startY) {
            var movementY = 0;
            if (myMovePointer.y < startY) movementY = startY - myMovePointer.y;
            if (movementY > touchMoveThresholdY && !touchJump) {
              console.log('thumb up')
              touchJump = true;
              startY = myMovePointer.y

            }
          } else if (myMovePointer.y > startY) {
            var movementYDown = 0;
            if (myMovePointer.y > startY) movementYDown = myMovePointer.y - startY;
            if (movementYDown > touchMoveThresholdY && !this.player.roll) {
              console.log('thumb down')
              this.player.roll = true;
              startY = myMovePointer.y

            }
          }
          //if thumb has moved left or right of where we started then move
          if (myMovePointer.x < startX || myMovePointer.x > startX) {
            //work out how far thumb has moved. Is this a big enough movement?
            var movement = 0;
            if (myMovePointer.x < startX) movement = startX - myMovePointer.x;
            if (myMovePointer.x > startX) movement = myMovePointer.x - startX;
            //If move is significant enough then move our character
            if (movement > touchMoveThreshold) {
              //set flag as we are definitely moving
              touchMoving = true;

              //set slider knob position to be half way to edge
              var sliderPos = 0;
              //left
              if (myMovePointer.x < startX) sliderPos = -(sliderBar.width / 4);
              //right
              if (myMovePointer.x > startX) sliderPos = sliderBar.width / 4;

              //set acceleration to be an 8th of normal
              var tmpAcceleration = acceleration / 8;

              //if thumb has moved quite a lot, then go faster
              if (movement > largeThumbMoveAcross) {
                //the knob position should be at the edge as we're at full tilt
                if (myMovePointer.x < startX) sliderPos = -(sliderBar.width / 2);
                if (myMovePointer.x > startX) sliderPos = sliderBar.width / 2;
                //acceleration is normal
                tmpAcceleration = acceleration;
              }

              //tween slider knob to position we just worked out
              var tween = this.tweens.add({
                targets: sliderKnob,
                x: sliderPos,
                ease: "Power1",
                duration: 300
              });
              if (this.firstMove) {
                this.firstMove = false;
                this.platformGroup.setVelocityY(gameOptions.platformSpeed);
                this.coins.setVelocityY(gameOptions.platformSpeed);
                this.sparks.setVelocityY(gameOptions.platformSpeed);
              }
              if (myMovePointer.x < startX) this.moveLeft(tmpAcceleration);
              if (myMovePointer.x > startX) this.moveRight(tmpAcceleration);
            } else {
              //If move is really, really small then we don't count it. Stop moving
              //set moving flag to false
              touchMoving = false;
              //reset slider knob to center position
              var tween = this.tweens.add({
                targets: sliderKnob,
                x: 0,
                ease: "Power1",
                duration: 300
              });
            }
          }
        }
      }

      //Right hand side - Touch Jumping
      //if thumb is on the right hand side of the screen we are dealing with vertical movement - i.e. jumping.
      if (this.input.pointer1.x > leftHalf || this.input.pointer2.x > leftHalf) {
        //reset pointer variable
        var myJumpPointer = null;
        //get active touch pointer for this side of the screen
        if (this.input.pointer1.x > leftHalf && this.input.pointer1.isDown) {
          myJumpPointer = this.input.pointer1;
        }
        if (this.input.pointer2.x > leftHalf && this.input.pointer2.isDown) {
          myJumpPointer = this.input.pointer2;
        }
        //if we have a touch pointer on right hand side of screen...
        if (myJumpPointer) {
          //store last y position of touch pointer
          prevPos = yPos;
          //get new position of touch pointer
          yPos = myJumpPointer.y;

          //if we have moved our thump upwards and it's more than our threshold then we set jump flag to true
          if (prevPos - yPos > touchJumpThreshold) {
            //  touchJump = true;
            console.log('button')
            if (playerData.hasBomb && player.roll && !player.bombSet) {
              // player.bombSet = true
              //  player.setBomb()
            } else if (playerData.hasGun && this.player.canShoot && !this.player.roll) {
              //   player.fire = true
              //  player.shoot()
            }
          }
        }
      }
      //neither thumb is down so reset touch movement variables and hide touchSlider
    } else {
      touchSlider.alpha = 0;
      startX = 0;
      touchMoving = false;
      touchJump = false
    }
    //if not moving left or right via keys or touch device...
    if (!touchMoving) {
      //if hero is close to having no velocity either left or right then set velocity to 0. This stops jerky back and forth as the hero comes to a halt. i.e. as we slow hero down, below a certain point we just stop them moving altogether as it looks smoother
      if (
        Math.abs(this.player.body.velocity.x) < 10 &&
        Math.abs(this.player.body.velocity.x) > -10
      ) {
        this.player.setVelocityX(0);
        this.player.setAccelerationX(0);
      } else {
        //if our hero isn't moving left or right then slow them down
        //this velocity.x check just works out whether we are setting a positive (going right) or negative (going left) number
        this.player.setAccelerationX(
          (this.player.body.velocity.x > 0 ? -1 : 1) * acceleration / 5
        );
      }
    }

    if (
      (standing) &&
      (touchJump) &&
      !jumping
    ) {
      this.player.setVelocityY(-800);
      jumping = true;
      this.player.roll = false
    }

    /////////ANIMATION//////////////////
    if (standing) {
      if (this.player.body.velocity.x !== 0) {

        if (this.player.roll) {
          this.player.anims.play("player-roll", true);
          this.player.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
        } else {
          this.player.anims.play("player-run", true);
          this.player.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        }

      } else {
        if (this.player.body.velocity.y < -300) {
          this.player.anims.play("player-jump", true);
          this.player.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        } else {
          if (this.roll) {
            this.player.anims.play("player-roll", true);
            this.player.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
          } else {
            this.player.anims.play("player-idle", true);
            this.player.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
          }

          // this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)

        }


      }

    } else {
      if (this.roll) {
        this.player.anims.play("player-roll", true);
        //this.player.sprite.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
      } else if (this.player.body.velocity.y < 0) {
        this.player.anims.play("player-jump", true);
        this.player.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
      } else {
        this.player.anims.play("player-idle", true);
      }
    }
    /////////////////////////////////

    //if not pressing up key...
    //if (!cursors.up.isDown) {
    //if player is touching ground / platform then reset jump parametrs
    if (this.player.body.blocked.down || this.player.body.touching.down) {
      jumping = false;
      touchJump = false;
      jumps = 2
      prevPos = 0;
    }
    //}
    wasStanding = standing;


    /* this.environment.getChildren().forEach(env => {
      if (env.getBounds().right < 0) {
        env.x = game.config.width + 30;
      }
    }) */

  }
  moveLeft(acceleration) {
    var standing = this.player.body.blocked.down || this.player.body.touching.down;
    this.player.flipX = true
    //if hero is on ground then use full acceleration
    if (standing) {
      this.player.setAccelerationX(-acceleration);
    } else {
      //if hero is in the air then accelerate slower
      this.player.setAccelerationX(-acceleration / 1.5);
    }
  }

  moveRight(acceleration) {
    var standing = this.player.body.blocked.down || this.player.body.touching.down;
    this.player.flipX = false
    //if hero is on ground then use full acceleration
    if (standing) {
      this.player.setAccelerationX(acceleration);
    } else {
      //if hero is in the air then accelerate slower
      this.player.setAccelerationX(acceleration / 1.5);
    }
  }

  placePlatform() {
    const distance = Phaser.Math.Between(600, 900);
    const enemyHeight = [96, 128, 160];
    let platform;
    platform = this.platforms.create(game.config.width, game.config.height, 'tiles', 20)
      .setOrigin(0, 1);
    platform.setImmovable();
  }
  checkOneWay(player, oneway) {
    if (player.y < oneway.y) {
      return true;
    }
    //otherwise disable collision
    return false;
  }
  buildTouchSlider() {
    sliderBar = this.add.sprite(0, 0, "touch-slider");
    sliderKnob = this.add.sprite(0, 0, "touch-knob");

    touchSlider = this.add.container(100, 450);
    touchSlider.add(sliderBar);
    touchSlider.add(sliderKnob);
    touchSlider.alpha = 0;
    //touchSlider.setScrollFactor(0);
  }
}