let game;


window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 600,
      height: 1100
    },
    // pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    backgroundColor: 0x222222,
    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {
    console.log('current room ' + currentRoom + ', current world ' + currentWorld)
    console.log(rooms[worlds[currentWorld].id][currentRoom].roomKey)
    this.load.tilemapTiledJSON(rooms[worlds[currentWorld].id][currentRoom].roomKey, 'assets/maps/' + rooms[worlds[currentWorld].id][currentRoom].roomKey + '.json')

  }
  create() {

    this.saveGame()
    this.cameras.main.setBackgroundColor(0x161616);//0x161616 0x046307

    //this.cameras.main.setBackgroundColor(0xAFB0B3);

    this.map = this.make.tilemap({ key: rooms[worlds[currentWorld].id][currentRoom].roomKey });
    this.tiles = this.map.addTilesetImage('tiles', 'tiles');
    const layerDec = this.map.createLayer('layer1', this.tiles);
    //this.createAntennas(layerDec)
    layer = this.map.createLayer('layer0', this.tiles);



    // const layer2 = map2.createLayer(0, tiles, 0, 0);
    layer.setCollisionByExclusion([-1, switchFrame, upgradeTopFrame, hBeamFrame, upgradePowerFrame, upgradeBeamFrame, upgradeBombFrame, upgradeLongFrame, upgradeBodyFrame, upgrade3Frame, upgradeTeleportFrame, switchBlockFrame, questionFrame, oneWayUpFrame, doorLFrame, doorRFrame, doorUFrame, doorDFrame, keyFrame, controlFrame, sparkFrame, oneWayDownFrame, lavaFrame, oneWayLeftFrame, oneWayRightFrame, collapseFrame, hPlatformFrame, launchUpFrameUp, launchUpFrameRight, launchUpFrameLeft, beamFrame, bombBlockFrame]);


    this.createOneWay(layer)
    this.createCollapse(layer)
    this.createHPlatforms(layer)
    this.createLaunchers(layer)
    this.createBeams(layer)
    this.createBombBlocks(layer)
    this.createControls(layer)
    this.createLava(layer)
    this.createLavaLauncher(layer)
    this.createSparks(layer)
    this.createDoors(layer)
    this.createSwitches(layer)
    this.createSwitchBlocks(layer)
    this.createQuestions(layer)
    this.createUpgrader(layer)


    this.thinglayer = this.map.getObjectLayer('things')['objects'];
    this.keyCount = 0
    if (!roomComplete()) {
      this.createKeys()
    }

    this.createEnemies()

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);// 
    this.cameras.main.setViewport(0, 100, game.config.width, game.config.height);
    // this.cameras.main.setDeadzone(game.config.width / 8, game.config.height / 4);
    this.createPlayer()
    // player.sprite.setTint(0xBABAA6)
    //this.cameras.main.startFollow(player.sprite);
    this.cameras.main.startFollow(player.sprite, true, 0.65);


    bombs = this.add.group({
      defaultKey: 'bomb',
      maxSize: 30
    });
    bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 5,
      allowGravity: false,
      immovable: true
    });
    powerupGroup = this.physics.add.group({
      defaultKey: 'tiles',
      defaultFrame: 84,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    lavaBall = this.physics.add.group({
      defaultKey: 'tiles',
      defaultFrame: lavaBallFrame,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    this.anims.create({
      key: 'effect-explode',
      frames: 'explode',
      frameRate: 20,
      repeat: 0
    });

    //Groups
    this.bursts = this.add.group({
      defaultKey: 'explode',
      maxSize: 30
    });
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
    cursors = this.input.keyboard.createCursorKeys();



    bombBody = this.add.rectangle(0, 0, 32, 32, 0x9966ff, 0).setStrokeStyle(1, 0xefc53f);

    this.physics.add.existing(bombBody);


    this.collectUpgrade = false

    this.buildTouchSlider();
    this.cameras.main.setZoom(1.5)
    this.physics.world.addCollider(player.sprite, layer, function () {
      player.launched = false
      player.sprite.body.setGravityY(800);
    }, null, this);
    this.physics.add.collider(player.sprite, oneWayBlocks, null, this.checkOneWay, this);
    this.physics.add.collider(player.sprite, bombBlocks);
    this.physics.add.collider(player.sprite, questions, this.hitQuestionMarkBlock, null, this);
    this.physics.add.collider(player.sprite, switchBlocks, null, this.checkSwitchBlock,);
    this.physics.add.collider(player.sprite, collapsingBlocks, this.shakeBlock, this.checkOneWay, this);
    this.physics.add.collider(player.sprite, hPlatforms);
    this.physics.add.overlap(player.sprite, launchers, this.launchPlayer, null, this);
    this.physics.add.overlap(player.sprite, beams, this.hitBeam, null, this);
    this.physics.add.overlap(player.sprite, lavas, this.hitLava, null, this);
    this.physics.add.overlap(player.sprite, sparks, this.hitSpark, null, this);
    this.physics.add.overlap(player.sprite, lavaBall, this.hitLavaBall, null, this);
    this.physics.add.overlap(player.sprite, powerupGroup, this.collectObject, null, this);
    this.physics.add.overlap(player.sprite, upgrades, this.hitUpgrade, null, this);
    if (!roomComplete()) {
      this.physics.add.overlap(player.sprite, keys, this.collectObject, null, this);

    }
    this.physics.add.collider(player.sprite, controls, this.hitControl, null, this);
    this.physics.add.collider(player.sprite, switches, this.hitSwitch, null, this);
    this.physics.add.overlap(player.sprite, enemies, this.hitEnemy, null, this);
    this.physics.add.collider(player.sprite, doors, this.hitDoor, null, this);
    this.physics.add.overlap(bombBody, bombBlocks, this.blowBombBlock, null, this);
    this.physics.add.overlap(bombBody, enemies, this.bombHitEnemy, null, this);


    this.physics.add.collider(hPlatforms, layer);

    this.physics.add.collider(powerupGroup, layer);

    this.physics.add.collider(enemies, layer);
    this.physics.add.collider(enemies, bombBlocks);
    this.physics.add.collider(enemies, lavas);
    this.physics.add.collider(enemies, sparks);
    this.physics.add.collider(enemies, collapsingBlocks);
    this.physics.add.collider(enemies, controls);
    this.physics.add.collider(enemies, switches);
    this.physics.add.collider(enemies, switchBlocks);

    this.physics.world.addCollider(lavaBall, layer, this.lavaHitLayer, null, this);
    this.physics.world.addCollider(bullets, layer, this.bulletHitLayer, null, this);

    player.sprite.anims.play("player-idle", true);

    var particles = this.add.particles('particle');
    emitter = particles.createEmitter();
    emitter.setPosition(player.sprite.x, player.sprite.y);
    emitter.setSpeed(50);
    emitter.setScale(.5)
    emitter.setBlendMode(Phaser.BlendModes.ADD);
    emitter.setTint(0xBABAA6)
    emitter.pause();


    this.input.addPointer(1);
  }
  update() {
    player.update()
    emitter.setPosition(player.sprite.x, player.sprite.y);
    var standing = player.sprite.body.blocked.down || player.sprite.body.touching.down;

    var onWall = (player.sprite.body.blocked.left || player.sprite.body.blocked.right) && !player.sprite.body.blocked.down
    //if left key is down then move left
    if (cursors.left.isDown) {
      this.moveLeft(acceleration);
    } else if (cursors.right.isDown) {
      //same deal but for right arrow
      this.moveRight(acceleration);
    } else if (cursors.down.isDown) {
      //same deal but for right arrow
      player.roll = true
    }

    //if either touch pointer is down. Two thumbs, two pointers
    if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
      touchSlider.x = player.sprite.x;
      //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
      touchSlider.y = player.sprite.y - thumbSizeOffset
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
            touchSlider.x = player.sprite.x;
            //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
            touchSlider.y = player.sprite.y - thumbSizeOffset
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
            if (movementYDown > touchMoveThresholdY && !player.roll) {

              player.roll = true;
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
              player.bombSet = true
              player.setBomb()
            } else if (playerData.hasGun && player.canShoot && !player.roll) {
              player.fire = true
              player.shoot()
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
    if (!cursors.right.isDown && !cursors.left.isDown && !touchMoving) {
      //if hero is close to having no velocity either left or right then set velocity to 0. This stops jerky back and forth as the hero comes to a halt. i.e. as we slow hero down, below a certain point we just stop them moving altogether as it looks smoother
      if (
        Math.abs(player.sprite.body.velocity.x) < 10 &&
        Math.abs(player.sprite.body.velocity.x) > -10
      ) {
        player.sprite.setVelocityX(0);
        player.sprite.setAccelerationX(0);
      } else {
        //if our hero isn't moving left or right then slow them down
        //this velocity.x check just works out whether we are setting a positive (going right) or negative (going left) number
        player.sprite.setAccelerationX(
          (player.sprite.body.velocity.x > 0 ? -1 : 1) * acceleration / 3
        );
      }
    }

    //get current time in seconds
    var d = new Date();
    var time = d.getTime();

    //if we have just left the ground set edge time for 100ms time
    if (!standing && wasStanding) {
      edgeTimer = time + 100;
    }

    //if player is standing, or just fallen off a ledge (within our allowed grace time) and...
    //either up key is press, or touchjump flag is set AND they are not already jumping then jump! !jumping
    if (
      (standing || time <= edgeTimer) &&
      (cursors.up.isDown || touchJump) &&
      !jumping
    ) {
      player.sprite.setVelocityY(jumpVelocity);
      jumping = true;
      player.roll = false
    }

    //if not pressing up key...
    if (!cursors.up.isDown) {
      //if player is touching ground / platform then reset jump parametrs
      if (player.sprite.body.blocked.down || player.sprite.body.touching.down) {
        jumping = false;
        touchJump = false;
        jumps = 2
        prevPos = 0;
      }
    }
    wasStanding = standing;

    /*  if (player.sprite.body.touching) {
       player.sprite.body.setGravityY(800);
     } */



  }
  launchPlayer(playersprite, launcher) {
    if (!player.launched) {
      player.launched = true
      player.sprite.body.setGravityY(100);
      player.sprite.body.setVelocityY(-800);
    }
  }
  moveLeft(acceleration) {
    var standing = player.sprite.body.blocked.down || player.sprite.body.touching.down;
    player.sprite.flipX = true
    //if hero is on ground then use full acceleration
    if (standing) {
      player.sprite.setAccelerationX(-acceleration);
    } else {
      //if hero is in the air then accelerate slower
      player.sprite.setAccelerationX(-acceleration / 3);
    }
  }

  moveRight(acceleration) {
    var standing = player.sprite.body.blocked.down || player.sprite.body.touching.down;
    player.sprite.flipX = false
    //if hero is on ground then use full acceleration
    if (standing) {
      player.sprite.setAccelerationX(acceleration);
    } else {
      //if hero is in the air then accelerate slower
      player.sprite.setAccelerationX(acceleration / 3);
    }
  }
  ////////////////////////////////////////////////////////////////////
  // COLLISIONS
  /////////////////////////////////////////////////////////////////////////
  hitBeam(playersprite, beam) {
    player.playerHit(-10)
  }
  hitLava(playersprite, lava) {
    player.playerHit(-10)
  }
  hitSpark(playersprite, spark) {
    player.playerHit(-10)
  }
  hitLavaBall(playersprite, ball) {
    player.playerHit(-10)
  }
  hitEnemy_(playersprite, enemy) {
    player.playerHit(-10)
  }
  bulletHitLayer(bullet, layer) {
    player.killBullet(bullet)
  }
  hitEnemy(playersprite, baddie) {
    //if the collision is on the baddies head
    if ((baddie.body.touching.up || player.invincible) && !player.invulnerable) {
      // set baddie as being hit and remove physics
      baddie.disableBody(false, false);
      //make player jump up in the air a little bit
      player.sprite.setVelocityY(jumpVelocity);

      //animate baddie, fading out and getting bigger
      var tween = this.tweens.add({
        targets: baddie,
        alpha: 0.3,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: 'Linear',
        duration: 200,
        onCompleteScope: this,
        onComplete: function () {
          //remove the game object
          this.destroyGameObject(baddie);
        },
      });
    }
    //otherwise you've hit baddie, but not on the head. This makes you die
    else {
      //set player to dead
      player.playerHit(-10)
    }
  }
  bombHitEnemy(bomb, baddie) {
    baddie.disableBody(false, false);


    //animate baddie, fading out and getting bigger
    var tween = this.tweens.add({
      targets: baddie,
      alpha: 0.3,
      scaleX: 1.5,
      scaleY: 1.5,
      ease: 'Linear',
      duration: 200,
      onCompleteScope: this,
      onComplete: function () {
        //remove the game object
        this.destroyGameObject(baddie);
      },
    });
  }
  hitControl(playerSprite, control) {
    if (roomComplete()) { return }
    if (player.keys.indexOf(control.id) > -1 && player.roll && control.state == 'off') {// 
      console.log('hit control')
      control.state = 'on'
      player.controlsActivated++
      control.setFrame(29)
      control.antenna.anims.play('layer-antenna', true);
      if (this.keyCount == player.controlsActivated) {
        this.controlsComplete()
      }
    }
  }
  hitSwitch(playerSprite, toggle) {

    if (player.roll && toggle.state == 'off') {// player.keys.indexOf(toggle.id) > -1 && 
      console.log('hit switch')
      toggle.state = 'on'
      //player.controlsActivated++
      toggle.setFrame(44)
      player.roll = false
      player.sprite.body.velocity.y = -220;
      console.log(toggle.id)
      if (toggle.id == 0) {
        Phaser.Actions.Call(switchBlocks.getChildren(), plat => {
          // plat.setAlpha(0);
          plat.setFrame(69)
          plat.state = 'off'
        }, this);
      }
    } else if (player.roll && toggle.state == 'on') {
      toggle.state = 'off'
      toggle.setFrame(43)
      player.roll = false
      player.sprite.body.velocity.y = -220;
      if (toggle.id == 0) {
        Phaser.Actions.Call(switchBlocks.getChildren(), plat => {
          //plat.setAlpha(1);
          plat.setFrame(switchBlockFrame)
          plat.state = 'on'
        }, this);
      }
    }
  }
  checkSwitchBlock(player, block) {
    if (block.state == 'on') {

      return true;

    }
    return false
  }
  checkOneWay(player, oneway) {
    if (oneway.kind == 'up') {
      if (player.y < oneway.y) {
        return true;
      }
    }
    if (oneway.kind == 'down') {
      if (player.y > oneway.y) {
        return true;
      }
    }
    if (oneway.kind == 'left') {
      if (player.x < oneway.x) {
        return true;
      }
    }
    if (oneway.kind == 'right') {
      if (player.x > oneway.x) {
        return true;
      }
    }
    //otherwise disable collision
    return false;
  }
  shakeBlock(playersprite, block) {
    //only make platform shake if player is standing on it
    if (playersprite.body.blocked.down) {//|| playersprite.body.touching.down
      //do a little camera shake to indicate something bad is going to happen
      this.cameras.main.shake(50, 0.001);
      //we need to store the global scope here so we can keep it later
      var ourScene = this;
      //do a yoyo tween shaking the platform back and forth and up and down
      var tween = this.tweens.add({
        targets: block,
        yoyo: true,
        repeat: 10,
        x: {
          from: block.x,
          to: block.x + 2 * 1,
        },
        ease: 'Linear',
        duration: 50,
        onComplete: function () {
          ourScene.destroyPlatform(block)
        }
      });
    }
  }
  destroyPlatform(platform) {
    var tween = this.tweens.add({
      targets: platform,
      alpha: 0,
      y: "+=25",
      ease: 'Linear',
      duration: 100,
      onCompleteScope: this,
      onComplete: function () {
        this.destroyGameObject(platform);
      }
    });
  }

  blowBombBlock(bomb, box) {
    var tween = this.tweens.add({
      targets: box,
      alpha: 0.3,
      //angle: 720,
      //x: scoreCoin.x,
      //  y: '-=50',
      //scaleX: 0.5,
      // scaleY: 0.5,
      ease: "Linear",
      duration: 250,
      onCompleteScope: this,
      onComplete: function () {
        this.destroyGameObject(box);
      }
    }, this);
  }
  lavaHitLayer(ball, layer) {
    lavaBall.killAndHide(ball)
    ball.setPosition(-50, -50)
  }
  hitUpgrade(playersprite, gameObject) {

    if (gameObject.kind == 'beam' && !playerData.hasGun) {

      if (Math.abs(player.sprite.x - gameObject.x) < 5 && !this.collectUpgrade) {

        gameObject.body.destroy()
        player.sprite.setVelocityX(0);
        player.sprite.setVelocityY(0);
        player.sprite.x = gameObject.x - 1.5
        playerData.hasGun = true
        gameObject.setFrame(101)
        this.scene.pause()
        setTimeout(() => {
          this.scene.resume();
          this.collectUpgrade = false
        }, 1500);
      }

    } else if (gameObject.kind == 'bomb' && !playerData.hasBomb) {
      if (Math.abs(player.sprite.x - gameObject.x) < 5 && !this.collectUpgrade) {
        this.collectUpgrade = true
        gameObject.body.destroy()
        player.sprite.setVelocityX(0);
        player.sprite.setVelocityY(0);
        player.sprite.x = gameObject.x
        playerData.hasBomb = true
        gameObject.setFrame(101)
        this.scene.pause()
        setTimeout(() => {
          this.scene.resume();
          this.collectUpgrade = false
        }, 1500);
      }
    } else if (gameObject.kind == 'long' && !playerData.hasLong) {
      if (Math.abs(player.sprite.x - gameObject.x) < 5 && !this.collectUpgrade) {
        this.collectUpgrade = true
        gameObject.body.destroy()
        player.sprite.setVelocityX(0);
        player.sprite.setVelocityY(0);
        player.sprite.x = gameObject.x
        playerData.hasLong = true
        playerData.range = 300
        gameObject.setFrame(101)
        this.scene.pause()
        setTimeout(() => {
          this.scene.resume();
          this.collectUpgrade = false
        }, 1500);
      }
    } else if (gameObject.kind == 'body' && !playerData.hasBody) {
      if (Math.abs(player.sprite.x - gameObject.x) < 5 && !this.collectUpgrade) {
        this.collectUpgrade = true
        gameObject.body.destroy()
        player.sprite.setVelocityX(0);
        player.sprite.setVelocityY(0);
        player.sprite.x = gameObject.x
        playerData.hasBody = true
        playerData.damage = .5

        gameObject.setFrame(101)
        this.scene.pause()
        setTimeout(() => {
          this.scene.resume();
          this.collectUpgrade = false
          player.sprite.setTint(0xBABAA6)
        }, 1500);
      }
    } else if (gameObject.kind == 'power') {
      if (Math.abs(player.sprite.x - gameObject.x) < 5 && !this.collectUpgrade) {
        this.collectUpgrade = true
        gameObject.body.destroy()
        player.sprite.setVelocityX(0);
        player.sprite.setVelocityY(0);
        player.sprite.x = gameObject.x



        gameObject.setFrame(101)
        this.scene.pause()
        setTimeout(() => {
          this.scene.resume();
          this.collectUpgrade = false
          this.addScore(100)
        }, 1500);
      }
    }

  }
  collectObject(playersprite, gameObject) {
    //stop coin for being collected twice, as it will stick around on the screen as it animnates
    gameObject.disableBody(false, false);
    if (gameObject.type == 'Coin') {
      playerData.coinCount++
      this.updateCoin(gameObject.kind)
    }
    if (gameObject.type == 'pellet') {
      //playerData.health += gameObject.amount
      this.addScore(gameObject.amount)
    }
    if (gameObject.type == 'missle') {
      if (playerData.missleCount + gameObject.amount > playerData.missleCapacity) {
        playerData.missleCount = playerData.missleCapacity
        this.collectMissle()
      } else {
        playerData.missleCount += gameObject.amount
        this.collectMissle()
      }

    }
    if (gameObject.type == 'Key') {
      player.hasKey = true
      player.keys.push(gameObject.id)
      this.updateKey()
    }
    if (gameObject.type == 'invincible') {
      console.log('invincible')
      //this.player.hasKey = true
      //this.updateKey()
      player.invincible = true
      player.sprite.body.maxVelocity.x = superMaxVelocityX;
      //start our emitter
      emitter.resume();
      var t = this.tweens.add({
        targets: player.sprite,
        alpha: .2,
        duration: 750,
        repeat: 5,
        yoyo: true,
        onCompleteScope: this,
        onComplete: function () {
          player.invincible = false
          player.sprite.body.maxVelocity.x = maxVelocityX;
          emitter.pause()
          emitter.killAll();
        }
      })
    }
    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
      targets: gameObject,
      alpha: 0.3,
      angle: 720,
      //x: scoreCoin.x,
      y: '-=50',
      scaleX: 0.5,
      scaleY: 0.5,
      ease: "Linear",
      duration: 500,
      onCompleteScope: this,
      onComplete: function () {
        this.destroyGameObject(gameObject);
      }
    });


  }
  hitQuestionMarkBlock(player, block) {
    //if the block has been hit from the bottom and is not already hit then...
    if (block.body.touching.down && !block.hit) {
      //mark block as hit
      block.hit = true;
      var powerup = powerupGroup.get().setActive(true);
      powerup.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
      powerup.enableBody = true;
      powerup.x = block.x;
      powerup.y = block.y;
      powerup.type = 'invincible'
      powerup.body.setVelocityY(-300);
      powerup.body.setVelocityX(80)
      powerup.setGravityY(800)

      powerup.body.setAllowGravity(true);

      //this.emptyQuestionBlock(powerup)


      // powerup.enableBody = true;
      //animate the rising of the mushroom powerup
      /* var tween = this.tweens.add({
        targets: powerup,
        y: "-=24",
        ease: 'Linear',
        duration: 300,
        onCompleteScope: this,
        onComplete: function () {
          // powerup.enableBody = true;
          //when the animation completes call this function
          //this.emptyQuestionBlock(block, powerup);

        },
      }); */

      //animate the box being hit and jumping up slightly
      var tween = this.tweens.add({
        targets: block,
        y: "-=5",
        ease: 'Linear',
        yoyo: true,
        duration: 100
      });
    }
  }
  hitDoor(player, door) {
    //console.log(door)

    if (door.open) {

      if (door.direction == 'right') {
        if (rooms[worlds[currentWorld].id][currentRoom].rightID == null) { return }
        player.disableBody(false, false);
        this.input.enabled = false
        currentRoom = rooms[worlds[currentWorld].id][currentRoom].rightID
        enteredFrom = 'right'
        console.log('current room ' + currentRoom + ', entered from ' + enteredFrom + ', door direction ' + door.direction)
        setTimeout(() => {
          this.scene.restart();
        }, 150);

      } else if (door.direction == 'up') {
        if (rooms[worlds[currentWorld].id][currentRoom].upID == null) { return }
        console.log('going up')
        player.disableBody(false, false);
        this.input.enabled = false
        currentRoom = rooms[worlds[currentWorld].id][currentRoom].upID
        enteredFrom = 'up'
        setTimeout(() => {
          this.scene.restart();
        }, 150);

      } else if (door.direction == 'left') {
        if (rooms[worlds[currentWorld].id][currentRoom].leftID == null) { return }
        console.log('going left 1')
        player.disableBody(false, false);
        this.input.enabled = false
        currentRoom = rooms[worlds[currentWorld].id][currentRoom].leftID
        enteredFrom = 'left'
        setTimeout(() => {
          this.scene.restart();
        }, 150);

      } else if (door.direction == 'down') {
        if (rooms[worlds[currentWorld].id][currentRoom].downID == null) { return }
        console.log('going down')
        player.disableBody(false, false);
        this.input.enabled = false
        currentRoom = rooms[worlds[currentWorld].id][currentRoom].downID
        enteredFrom = 'down'
        setTimeout(() => {
          this.scene.restart();
        }, 150);
      }

    }

  }
  //////////////////////////////////////////////////////////////////////
  // CREATES
  ///////////////////////////////////////////////////////////////////////
  createPlayer() {
    this.rooomCheck()

    console.log('next room ' + currentRoom)
    console.log('connecting door ' + enteredFrom)
    var startX
    var startY

    player = new Player(this, 0, 0)
    // console.log(this.player)
    player.sprite.enableBody(false, false);
    player.sprite.setPushable(false)
    player.sprite.setDepth(3)

    /*   for (var i = 0; i < this.thinglayer.length; i++) {
        if (this.thinglayer[i].name == 'Player') {
          var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
  
          startX = worldXY.x + (this.map.tileWidth / 2)
          startY = worldXY.y - (this.map.tileHeight / 2)
        }
      } */

    if (enteredFrom == 'none') {
      for (var i = 0; i < this.thinglayer.length; i++) {
        if (this.thinglayer[i].name == 'Player') {
          var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)

          startX = worldXY.x + (this.map.tileWidth / 2)
          startY = worldXY.y - (this.map.tileHeight / 2)
        }
      }
    } else {

      Phaser.Actions.Call(doors.getChildren(), function (door) {

        if (enteredFrom == 'right') {
          console.log(door)
          if (door.direction == 'left') {
            console.log(door.x + ', ' + door.y + 'door d ' + door.direction)
            startX = door.x + this.map.tileWidth * 2
            startY = door.y - 5
            // player.sprite.setFlipX(true)
          }
        } else if (enteredFrom == 'down') {
          if (door.direction == 'up') {
            startX = door.x
            startY = door.y + this.map.tileWidth * 2
          }
        } else if (enteredFrom == 'left') {
          if (door.direction == 'right') {
            console.log(door.x + ', ' + door.y + 'door d ' + door.direction)
            startX = door.x - this.map.tileWidth * 2
            startY = door.y
            player.sprite.setFlipX(true)
          }
        } else if (enteredFrom == 'up') {
          if (door.direction == 'down') {
            startX = door.x - this.map.tileWidth * 1
            startY = door.y - this.map.tileWidth * 2
          }
        }

      }, this);
    }


    console.log(startX + ', ' + startY)

    player.sprite.x = startX
    player.sprite.y = startY

    //   

  }
  createQuestions(layer) {
    questions = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(questionFrame, 0, { key: 'tiles', frame: questionFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      questions.add(sprites[i])
    }
  }

  createOneWay(layer) {

    oneWayBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(oneWayUpFrame, 0, { key: 'tiles', frame: oneWayUpFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'up'
      oneWayBlocks.add(sprites[i])
    }
    var sprites = this.map.createFromTiles(oneWayDownFrame, 0, { key: 'tiles', frame: oneWayDownFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'down'
      oneWayBlocks.add(sprites[i])
    }
    var sprites = this.map.createFromTiles(oneWayLeftFrame, 0, { key: 'tiles', frame: oneWayLeftFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'left'
      oneWayBlocks.add(sprites[i])
    }
    var sprites = this.map.createFromTiles(oneWayRightFrame, 0, { key: 'tiles', frame: oneWayRightFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'right'
      oneWayBlocks.add(sprites[i])
    }
  }
  createCollapse(layer) {
    collapsingBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(collapseFrame, 0, { key: 'tiles', frame: collapseFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'up'
      collapsingBlocks.add(sprites[i])
    }
  }
  createSwitchBlocks(layer) {
    switchBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(switchBlockFrame, 0, { key: 'tiles', frame: switchBlockFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].state = 'on'
      switchBlocks.add(sprites[i])
    }
  }
  createLaunchers(layer) {
    launchers = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(launchUpFrameUp, 0, { key: 'tiles', frame: launchUpFrameUp }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'up'
      launchers.add(sprites[i])
    }
  }
  createBombBlocks(layer) {
    bombBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(bombBlockFrame, 0, { key: 'tiles', frame: bombBlockFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      bombBlocks.add(sprites[i])
      console.log('bomb block')
    }
  }
  createControls(layer) {
    this.anims.create({
      key: "layer-antenna",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [60, 61, 62, 63] }),
      frameRate: 8,
      repeat: -1
    });
    antennas = this.add.group({ allowGravity: false, immovable: true });
    controls = this.physics.add.group({ allowGravity: false, immovable: true });
    if (roomComplete()) {
      var f = controlFrame + 1
    } else {
      var f = controlFrame
    }
    var sprites = this.map.createFromTiles(controlFrame, 0, { key: 'tiles', frame: f }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].state = 'off'
      sprites[i].id = i
      var ant = this.add.sprite(sprites[i].x, sprites[i].y - this.map.tileHeight, 'tiles', antennaFrame).setDepth(2)
      ant.id = i
      sprites[i].antenna = ant
      if (roomComplete()) {
        sprites[i].antenna.anims.play('layer-antenna', true);
      }
      //antennas.add(ant)
      controls.add(sprites[i])
    }
    /*     Phaser.Actions.Call(antennas.getChildren(), child => {
          //child.body.setSize(8, 32).setOffset(12, 0)
          child.anims.play('layer-antenna', true);
        }); */
  }
  createAntennas(layer) {
    this.anims.create({
      key: "layer-antenna",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [60, 61, 62, 63] }),
      frameRate: 8,
      repeat: -1
    });
    antennas = this.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(antennaFrame, 0, { key: 'tiles', frame: antennaFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      antennas.add(sprites[i])
    }
    Phaser.Actions.Call(antennas.getChildren(), child => {
      //child.body.setSize(8, 32).setOffset(12, 0)
      child.anims.play('layer-antenna', true);
    });
  }
  createSwitches(layer) {
    switches = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(switchFrame, 0, { key: 'tiles', frame: switchFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].state = 'off'
      sprites[i].id = i
      switches.add(sprites[i])
    }
  }
  createHPlatforms() {
    hPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(hPlatformFrame, 0, { key: 'hplatform' }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      hPlatforms.add(sprites[i])

    }

    Phaser.Actions.Call(hPlatforms.getChildren(), plat => {
      plat.setOrigin(.5, .5);
      plat.body.setFriction(1);
      plat.body.setBounce(1);
      plat.body.setVelocityX(50);
    }, this);


    /* for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Hplatform') {
        console.log(this.thinglayer[i])
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var plat = hPlatforms.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'platform')//99
        plat.type = this.thinglayer[i].name
        plat.setOrigin(.5, .5);
        plat.setFriction(1);
        plat.setBounce(1);
        plat.setVelocityX(50);
      }
    } */

  }
  createLava(layer) {
    this.anims.create({
      key: "layer-lava",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [46, 47, 48] }),
      frameRate: 8,
      repeat: -1
    });
    lavas = this.physics.add.group({ allowGravity: false, immovable: true });

    var sprites = this.map.createFromTiles(lavaFrame, 0, { key: 'tiles', frame: lavaFrame }, null, null, layer)//lavaframes[Phaser.Math.Between(0, 2)]
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(4)
      sprites[i].damage = 6
      lavas.add(sprites[i])

    }
    Phaser.Actions.Call(lavas.getChildren(), child => {
      //child.body.setSize(8, 32).setOffset(12, 0)
      child.anims.play('layer-lava', true);
    });
    //sparks.playAnimation('layer-spark')
  }
  createBeams(layer) {
    this.anims.create({
      key: "layer-beam",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [22, 26, 23] }),
      frameRate: 8,
      repeat: -1
    });
    beams = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(beamFrame, 0, { key: 'tiles', frame: beamFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(3)
      sprites[i].damage = 6
      beams.add(sprites[i])
      sprites[i].body.setSize(8, 32).setOffset(12, 0)
      sprites[i].anims.play('layer-beam', true);
    }
    //sparks.playAnimation('layer-spark')
    /*     Phaser.Actions.Call(beams.getChildren(), child => {
    
        }); */
    ////////////////////////////////////////
    this.anims.create({
      key: "layer-beam-h",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [96, 97, 98] }),
      frameRate: 8,
      repeat: -1
    });

    var sprites = this.map.createFromTiles(hBeamFrame, 0, { key: 'tiles', frame: hBeamFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(3)
      sprites[i].damage = 6
      beams.add(sprites[i])
      sprites[i].body.setSize(32, 8).setOffset(0, 12)
      sprites[i].anims.play('layer-beam-h', true);
    }

  }
  createLavaLauncher(layer) {
    this.anims.create({
      key: "layer-lavaball",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [86, 87, 88, 89] }),
      frameRate: 8,
      repeat: -1
    });

    lavaLaunchers = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaLauncherFrame, 0, { key: 'tiles', frame: lavaLauncherFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lavaLaunchers.add(sprites[i])
    }
    var launchTimes = [1500, 2000, 2500, 3000]//
    lavaLaunchers.getChildren().forEach(function (box) {
      //box.launcher = this.time.delayedCall(2000, this.launch, [box], this);
      var ranTime = Phaser.Math.Between(0, launchTimes.length - 1)
      box.launcher = this.time.addEvent({
        delay: launchTimes[ranTime],                // ms
        callback: this.launch,
        args: [box],
        callbackScope: this,
        repeat: -1
      });



    }, this);
  }
  launch(box) {
    var t = this.tweens.add({
      targets: box,
      yoyo: true,
      scale: .5,
      //repeat: 10,
      /* x: {
        from: box.x,
        to: box.x + 2 * 1,
      }, */
      ease: 'Linear',
      duration: 50,

    })
    var bomb = lavaBall.get().setActive(true);
    bomb.play('layer-lavaball')
    // Place the explosion on the screen, and play the animation.
    bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
    bomb.body.setSize(16, 32).setOffset(8, 0)
    bomb.x = box.x;
    bomb.y = box.y;
    bomb.damage = 10
    bomb.body.velocity.y = 100;
  }
  createSparks(layer) {
    this.anims.create({
      key: "layer-spark",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [0, 17, 18, 19] }),
      frameRate: 12,
      repeat: -1
    });
    sparks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(sparkFrame, 0, { key: 'tiles', frame: sparkFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(3)
      sprites[i].damage = 4
      sparks.add(sprites[i])

    }
    //sparks.playAnimation('layer-spark')
    Phaser.Actions.Call(sparks.getChildren(), child => {
      child.body.setSize(15, 9).setOffset(8, 23)
      child.anims.play('layer-spark', true);
    });
  }
  createUpgrader(layer) {
    /*     let upgradePowerFrame = 103
    let upgradeBeamFrame = 104
    let upgradeBombFrame = 105
    let upgradeLongFrame = 106
    let upgradeBodyFrame = 107
    let upgrade3Frame = 108
    let upgradeTeleportFrame = 109
    let upgradeTopFrame = 91
    let upgradeTopAnim = [91,92,93,94] */
    upgrades = this.physics.add.group({ allowGravity: false, immovable: true });

    this.anims.create({
      key: "layer-upgrade-top",
      frames: this.anims.generateFrameNumbers('tiles', { frames: upgradeTopAnim }),
      frameRate: 8,
      repeat: -1
    });
    /////////////
    var sprites = this.map.createFromTiles(upgradeTopFrame, 0, { key: 'tiles', frame: upgradeTopFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].play('layer-upgrade-top')
    }
    ////////////////////
    if (!playerData.hasGun) {
      var sprites = this.map.createFromTiles(upgradeBeamFrame, 0, { key: 'tiles', frame: upgradeBeamFrame }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)
        sprites[i].kind = 'beam'
        upgrades.add(sprites[i])
      }
    } else if (playerData.hasGun) {
      var sprites = this.map.createFromTiles(upgradeBeamFrame, 0, { key: 'tiles', frame: 101 }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)

      }
    }
    ///////////////////////////////////////
    if (!playerData.hasBomb) {
      var sprites = this.map.createFromTiles(upgradeBombFrame, 0, { key: 'tiles', frame: upgradeBombFrame }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)
        sprites[i].kind = 'bomb'
        upgrades.add(sprites[i])
      }
    } else if (playerData.hasBomb) {
      var sprites = this.map.createFromTiles(upgradeBombFrame, 0, { key: 'tiles', frame: 101 }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)

      }
    }
    ///////////////////////////////////////
    if (!playerData.hasLong) {
      var sprites = this.map.createFromTiles(upgradeLongFrame, 0, { key: 'tiles', frame: upgradeLongFrame }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)
        sprites[i].kind = 'long'
        upgrades.add(sprites[i])
      }
    } else if (playerData.hasLong) {
      var sprites = this.map.createFromTiles(upgradeLongFrame, 0, { key: 'tiles', frame: 101 }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)

      }
    }
    ///////////////////////////////////////
    if (!playerData.hasbody) {
      var sprites = this.map.createFromTiles(upgradeBodyFrame, 0, { key: 'tiles', frame: upgradeBodyFrame }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)
        sprites[i].kind = 'body'
        upgrades.add(sprites[i])
      }
    } else if (playerData.hasbody) {
      var sprites = this.map.createFromTiles(upgradeBodyFrame, 0, { key: 'tiles', frame: 101 }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)

      }
    }
    ///////////////////////////////////////
    if (!playerData.has3Way) {
      var sprites = this.map.createFromTiles(upgrade3Frame, 0, { key: 'tiles', frame: upgrade3Frame }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)
        sprites[i].kind = '3way'
        upgrades.add(sprites[i])
      }
    } else if (playerData.has3Way) {
      var sprites = this.map.createFromTiles(upgrade3Frame, 0, { key: 'tiles', frame: 101 }, null, null, layer)
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        sprites[i].y += (this.map.tileHeight / 2)

      }
    }

    ///////////////////////////////////////

    var sprites = this.map.createFromTiles(upgradePowerFrame, 0, { key: 'tiles', frame: upgradePowerFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'power'
      upgrades.add(sprites[i])
    }

    ///////////////////////////////////////

  }
  createDoors(layer) {
    doors = null
    doors = this.physics.add.group({ allowGravity: false, immovable: true });

    //left door 1
    var sprites = this.map.createFromTiles(doorLFrame, 0, { key: 'tiles', frame: doorLFrame }, null, null, layer)

    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].direction = 'left'
      sprites[i].open = true
      //  
      doors.add(sprites[i])


    }

    //right door 1
    var sprites = this.map.createFromTiles(doorRFrame, 0, { key: 'tiles', frame: doorRFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].direction = 'right'
      sprites[i].open = true

      doors.add(sprites[i])
      console.log(sprites[i].direction)
    }


    //up door 1
    var sprites = this.map.createFromTiles(doorUFrame, 0, { key: 'tiles', frame: doorUFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].direction = 'up'
      sprites[i].open = true
      //  
      doors.add(sprites[i])
    }
    //down door 1
    var sprites = this.map.createFromTiles(doorDFrame, 0, { key: 'tiles', frame: doorDFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].direction = 'down'
      sprites[i].open = true
      //  
      doors.add(sprites[i])
    }
    Phaser.Actions.Call(doors.getChildren(), child => {
      if (child.direction == 'right') {
        child.body.setSize(16, 32).setOffset(8, 0)
      } else if (child.direction == 'left') {
        child.body.setSize(16, 32).setOffset(8, 0)
      } else if (child.direction == 'up') {
        child.body.setSize(32, 16).setOffset(0, 8)
      } else if (child.direction == 'down') {
        child.body.setSize(32, 16).setOffset(0, 8)
      }


    });
    //console.log(doors)
  }
  /* createKeys() {
    keys = this.physics.add.group({ allowGravity: false, immovable: true });
 
    var sprites = this.map.createFromTiles(keyFrame, 0, { key: 'tiles', frame: keyFrame }, null, null, layer)//lavaframes[Phaser.Math.Between(0, 2)]
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].setDepth(4)
      sprites[i].type = 'Key'
      keys.add(sprites[i])
 
    }
  } */
  createKeys() {
    keys = this.physics.add.group({ allowGravity: false });
    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Key') {
        // console.log(this.thinglayer[i])
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var key = keys.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'tiles', keyFrame)//99
        key.type = this.thinglayer[i].name
        key.id = this.keyCount
        key.setOrigin(.5, .5);
        this.keyCount++
      }
    }

  }
  createEnemies() {

    enemies = this.physics.add.group({ immovable: true });
    for (var i = 0; i < this.thinglayer.length; i++) {
      var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
      if (this.thinglayer[i].name == 'Enemy1') {
        var enemey = new Enemy01(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 0)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Enemy2') {
        var enemey = new Enemy02(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 1)
        // console.log('make enemy 2')
      } else if (this.thinglayer[i].name == 'Enemy3') {
        var enemey = new Enemy03(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 2)
        // console.log('make enemy 2')
      } else if (this.thinglayer[i].name == 'Enemy4') {
        var enemey = new Enemy04(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 4), 3)
        // console.log('make enemy 2')
      } else if (this.thinglayer[i].name == 'Enemy5') {
        var enemey = new Enemy05(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 4)
        // console.log('make enemy 2')
      } else if (this.thinglayer[i].name == 'Enemy6') {
        var enemey = new Enemy06(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 5)
        // console.log('make enemy 2')
      }
    }

  }
  ////////////////////////////////////////////////////
  destroyGameObject(gameObject) {
    // Removes any game object from the screen
    gameObject.destroy();
  }
  explode(x, y) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(1).setDepth(3);
    explosion.x = x;
    explosion.y = y;
    explosion.play('effect-explode');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);

    }, this);
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
  saveGame() {
    playerData.currentRoom = currentRoom
    playerData.currentWorld = currentWorld
    localStorage.setItem('ElectricalSave', JSON.stringify(playerData));
  }
  /////////////////////////////////////////////////////////////
  // EVENTS
  //////////////////////////////////////////////////////////
  addScore(amount) {
    this.events.emit('score', amount);
  }
  updateKey() {
    this.events.emit('key');
  }
  controlsComplete() {
    this.events.emit('complete');
  }
  rooomCheck() {
    this.events.emit('roomstatus');
  }
}
