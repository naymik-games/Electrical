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

class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", { frames: [0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] }),
      frameRate: 6,
      repeat: -1
    });
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNumbers("player", { frames: [6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8] }),
      frameRate: 12,
      repeat: -1
    });
    /* anims.create({
      key: "player-attack",
      frames: anims.generateFrameNumbers("player", { start: 12, end: 14 }),
      frameRate: 22,
      repeat: 0
    });
    anims.create({
      key: "player-roll",
      frames: anims.generateFrameNumbers("player", { start: 16, end: 19 }),
      frameRate: 12,
      repeat: -1
    }); */
    anims.create({
      key: "player-jump",
      frames: anims.generateFrameNumbers("player", { start: 12, end: 14 }),
      frameRate: 6,
      repeat: 0
    });
    anims.create({
      key: "player-roll",
      frames: anims.generateFrameNumbers("player", { start: 18, end: 21 }),
      frameRate: 6,
      repeat: 0
    });
    /* anims.create({
      key: "player-shoot",
      frames: anims.generateFrameNumbers("player", { start: 24, end: 26 }),
      frameRate: 12,
      repeat: 0
    }); */
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setGravityY(800)
      .setScale(1)
      //.setDrag(3000, 0)
      .setMaxVelocity(200, 400)
    this.roll = false
    this.bombSet = false
    this.launched = false
    this.invulnerable = false;
    this.invincible = false
    this.canShoot = true
    this.hasKey = false
    this.keys = []
    this.controlsActivated = 0
    this.dpad = {}
    this.dpad.isUp = false
    this.dpad.isDown = false
    this.dpad.isLeft = false
    this.dpad.isRight = false
    this.dpad.isLeft = false
    this.dpad.isA = false
    this.dpad.isB = false
    this.dpad.isY = false

    this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset);//15,15 24.5, 17
  }
  update() {
    var standing = this.sprite.body.blocked.down || this.sprite.body.touching.down;
    bullets.getChildren().forEach(this.updateBullet, this);

    //animation
    if (standing) {
      if (this.sprite.body.velocity.x !== 0) {

        if (this.roll) {
          this.sprite.anims.play("player-roll", true);
          this.sprite.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
        } else if (this.sprite.body.velocity.y < 0) {
          this.sprite.anims.play("player-jump", true);
          this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        } else {
          this.sprite.anims.play("player-run", true);
          this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        }

      } else {
        if (this.sprite.body.velocity.y < 0) {
          this.sprite.anims.play("player-jump", true);
          this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        } else {
          if (this.roll) {
            this.sprite.anims.play("player-roll", true);
            this.sprite.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
          } else {
            this.sprite.anims.play("player-idle", true);
            this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
          }

          // this.sprite.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)

        }


      }

    } else {
      if (this.roll) {
        this.sprite.anims.play("player-roll", true);
        //this.player.sprite.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
      } else {
        this.sprite.anims.play("player-idle", true);
      }
    }


    /*   if (this.dpad.isLeft) {
        this.sprite.setFlipX(true);
        this.moveLeft(acceleration);
      }
      //same deal but for right arrow
      else if (this.dpad.isRight) {
        this.sprite.setFlipX(false);
        this.moveRight(acceleration);
      }
   */

  }
  moveLeft(acceleration) {
    var standing = this.sprite.body.blocked.down || this.sprite.body.touching.down;

    //if hero is on ground then use full acceleration
    if (standing) {
      this.sprite.setAccelerationX(-acceleration);

    }
    //if hero is in the air then accelerate slower
    else {
      this.sprite.setAccelerationX(-acceleration / 2.5);
    }
  }

  moveRight(acceleration) {
    var standing = this.sprite.body.blocked.down || this.sprite.body.touching.down;

    //if hero is on ground then use full acceleration
    if (standing) {
      this.sprite.setAccelerationX(acceleration);
    }
    //if hero is in the air then accelerate slower
    else {
      this.sprite.setAccelerationX(acceleration / 2.5);
    }
  }
  updateBullet(bullet) {
    bullet.state -= bullet.body.newVelocity.length();

    if (bullet.state <= 0) {
      //bullet.disableBody(true, true);
      this.killBullet(bullet)
    }
  }
  shoot() {

    if (bullets.maxSize - bullets.getTotalUsed() > 0) {
      if (this.canShoot) {
        this.canShoot = false
        var bullet = bullets.get().setActive(true);

        console.log('shoot')
        // Place the explosion on the screen, and play the animation.
        bullet.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
        //bullet.setSize(8, 8).setOffset(8, 4)
        /* if (this.missleActive) {

          bullet.setTexture('missle')
          playerData.missleCount--
          this.scene.updateMissle()
        } else {
          bullet.setTexture('bullet')
        } */

        bullet.x = this.sprite.x;
        bullet.y = this.sprite.y - 0;
        bullet.state = playerData.range
        //bullet.play('bullet-fired')
        if (this.sprite.flipX) {
          bullet.setFlipX(true);
          bullet.body.setVelocityX(-bulletSpeed)
        } else {
          bullet.setFlipX(false);
          bullet.body.setVelocityX(bulletSpeed)
        }
        var timer = this.scene.time.delayedCall(150, function () {
          this.canShoot = true
        }, null, this);
        // var timer2 = this.scene.time.delayedCall(playerData.range, this.killBullet, [bullet], this);
      }

    }
  }
  killBullet(bullet) {
    bullets.killAndHide(bullet)
    bullet.setPosition(-50, -50)
  }
  playerHit(damage) {

    //if you are not already invulnerable
    if (!this.invulnerable && !this.invincible) {
      //set player as invulnerable
      this.invulnerable = true;

      this.scene.addScore(damage * 1)//playerData.damageMultiplier
      //if hearts is 0 or less you're dead as you are out of lives
      if (playerData.health <= 0) {
        //remove physics from player
        this.sprite.disableBody(false, false);
        //and play death animation
        var tween = this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0.3,
          scaleX: 1.1,
          scaleY: 1.1,
          angle: 90,
          x: this.sprite.x - 20,
          y: this.sprite.y - 20,
          ease: 'Linear',
          duration: 1000,
          onComplete: function () {
            //restartGame(this);
            this.scene.scene.stop()
            this.scene.scene.stop('UI')
            this.scene.scene.start('startGame')
          },
          onCompleteScope: this
        });
      }
      //otherwise you're not dead you've just lost a life so...
      else {
        //make the player stop in their tracks and jump up
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = -220;
        //tween the players alpha to 30%
        var tween = this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0.3,
          ease: 'Linear',
          duration: 200,
          onCompleteScope: this
        });

        //set a timer for 1 second. When this is up we tween player back to normal and make then vulnerable again
        var timer = this.scene.time.delayedCall(1000, this.playerVulnerable, null, this);
      }
    }
  }
  playerVulnerable() {
    //tween player back to 100% opacity and reset invulnerability flag
    var death = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      ease: 'Linear',
      duration: 200,
      onComplete: function () {
        this.invulnerable = false;
      },
      onCompleteScope: this
    });
  }
  setBomb() {
    console.log('set bomb')

    var bomb = bombs.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    bomb.setOrigin(0.5, 0).setScale(1).setDepth(3).setVisible(true);
    bomb.x = this.sprite.x;
    bomb.y = this.sprite.y - 4;
    // this.sprite.body.velocity.y = -220;

    bomb.getBounds()

    var timer = this.scene.time.delayedCall(1000, this.explodeBomb, [bomb], this);
  }
  explodeBomb(bomb) {
    bombBody.setPosition(bomb.x, bomb.y + 16)
    //bombBody.body.enable = true
    this.scene.explode(bomb.x, bomb.y)
    bomb.setActive(false);
    bomb.setVisible(false);
    /* this.bombHitBoxDown.x = bomb.x
    this.bombHitBoxDown.y = bomb.y + 20

    this.bombHitBoxRight.x = bomb.x + 12
    this.bombHitBoxRight.y = bomb.y + 10

    this.bombHitBoxLeft.x = bomb.x - 12
    this.bombHitBoxLeft.y = bomb.y + 10

    this.bombHitBoxUp.x = bomb.x
    this.bombHitBoxUp.y = bomb.y */

    this.bombSet = false
    /*  bombRadius.getChildren().forEach(function (bomb) {
       bomb.body.enable = true
     }, this)
    
 
     var timer = this.scene.time.delayedCall(500, function () {
       bombRadius.getChildren().forEach(function (bombhit) {
         bombhit.body.enable = false
       }, this)
     }, null, this); */
    //check if player is over bomb and jump hero
    if (Math.abs(bomb.x - this.sprite.x) <= 16 && Math.abs(bomb.y - this.sprite.y) < 10) {
      this.sprite.body.velocity.y = -350;
    }

  }
}