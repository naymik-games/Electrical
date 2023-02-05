class Runner extends Phaser.Scene {

  constructor() {
    super('Runner');
  }

  create() {
    this.cameras.main.setBackgroundColor(0x161616);
    this.cameras.main.setZoom(1.5)
    const { height, width } = game.config;
    this.gameSpeed = 5;
    this.respawnTime = 0;
    this.isGameRunning = true;
    this.ground = this.add.tileSprite(0, height, width, 32, 'ground').setOrigin(0, 1)

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
    this.player = this.physics.add.sprite(50, height - 32, 'player').setOrigin(0, 1).setGravityY(800)
    this.player.play('player-run')
    this.player.roll = false
    this.cameras.main.startFollow(this.player, true, 0.65, 0, -150, 300);

    this.groundBody = this.add.rectangle(0, height - 16, 600, 32, 0x9966ff, 0).setStrokeStyle(1, 0xefc53f);

    this.physics.add.existing(this.groundBody);
    this.groundBody.body.setImmovable(true)

    this.obsticles = this.physics.add.group();


    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0)
    this.gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 80, 'restart').setInteractive();
    this.gameOverScreen.add([
      this.gameOverText, this.restart
    ])

    this.restart.on('pointerdown', () => {
      this.player.setVelocityY(0);
      //   this.dino.body.height = 92;
      //  this.dino.body.offset.y = 0;
      this.physics.resume();
      this.obsticles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    })


    this.physics.add.collider(this.player, this.groundBody)
    this.physics.add.collider(this.player, this.obsticles, () => {
      //  this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

      //const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
      // const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

      // this.highScoreText.setText('HI ' + newScore);
      // this.highScoreText.setAlpha(1);

      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();
      // this.dino.setTexture('dino-hurt');
      this.respawnTime = 0;
      this.gameSpeed = 5;
      this.gameOverScreen.setAlpha(1);
      //  this.score = 0;
      //  this.hitSound.play();
    }, null, this);


    this.buildTouchSlider();
  }
  update(time, delta) {
    if (!this.isGameRunning) { return; }


    this.ground.tilePositionX += this.gameSpeed;

    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach(obsticle => {
      if (obsticle.getBounds().right < 0) {
        this.obsticles.killAndHide(obsticle);
      }
    })
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
              ////  if (myMovePointer.x < startX) this.moveLeft(tmpAcceleration);
              ///   if (myMovePointer.x > startX) this.moveRight(tmpAcceleration);
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
            } else if (playerData.hasGun && player.canShoot && !player.roll) {
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


    if (
      (standing) &&
      (touchJump) &&
      !jumping
    ) {
      this.player.setVelocityY(-500);
      jumping = true;
      this.player.roll = false
    }


    if (this.player.body.velocity.y < 0) {
      this.player.anims.play("player-jump", true);
      this.player.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
    } else {
      if (this.player.roll) {
        this.player.anims.play("player-roll", true);
        this.player.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
      } else {
        this.player.anims.play("player-run", true);
        this.player.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
      }

      // this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)

    }


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


  }
  placeObsticle() {
    // const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const obsticleNum = 1
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;
    if (obsticleNum > 6) {
      const enemyHeight = [20, 50];
      obsticle = this.obsticles.create(game.config.width + distance, game.config.height - enemyHeight[Math.floor(Math.random() * 2)], `enemy-bird`)
        .setOrigin(0, 1)
      obsticle.play('enemy-dino-fly', 1);
      obsticle.body.height = obsticle.body.height / 1.5;
    } else if (obsticleNum == 1) {
      console.log('crete obstacle')
      obsticle = this.obsticles.create(game.config.width + distance, game.config.height - 64, 'tiles', 7)
        .setOrigin(0, 1);

      obsticle.body.offset.y = +10;
    } else {
      console.log('crete obstacle')
      obsticle = this.obsticles.create(game.config.width + distance, game.config.height - 32, 'tiles', 7)
        .setOrigin(0, 1);

      obsticle.body.offset.y = +10;
    }

    obsticle.setImmovable();
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