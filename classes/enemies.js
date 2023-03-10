///////////////////////////////////////////////////////////////////////////
// BASE ENEMY CLASS
///////////////////////////////////////////////////////////////////////////


class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, kind, frame) {

    super(scene, x, y, enemeyConfigs[kind].key, enemeyConfigs[kind].frame);
    this.scene = scene
    this.kind = kind
    scene.add.existing(this);
    scene.physics.add.existing(this);
    enemies.add(this)
    this.setOrigin(.5, .5);
    this.setCollideWorldBounds(true);
    this.setBounce(0)


  }

  switchDirection() {

    //reverse velocity so baddie moves are same speed but in opposite direction
    this.body.velocity.x *= -1;
    this.direction *= -1
    //reset count
    this.previousX = this.x;
  }
  enemyFollowsOnce() {
    if (!this.launched) {
      this.launched = true
      this.body.setAllowGravity(true)
      this.scene.physics.moveToObject(this, player.sprite, 50);
    }

  }
  enemyFollowsContinuous() {
    this.scene.physics.moveToObject(this, player.sprite, 25);
  }
  enemyHit(damage) {
    this.strength -= damage
    if (this.strength > 0) {


      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.1,
        scale: 1.5,
        yoyo: true,
        ease: 'Linear',
        duration: 100,
      });
      this.hit = false
    } else {
      this.disableBody(false, false);
      //make player jump up in the air a little bit
      this.scene.explode(this.x, this.y)

      //animate baddie, fading out and getting bigger
      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.3,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: 'Linear',
        duration: 200,
        onCompleteScope: this,
        onComplete: function () {
          //remove the game object
          this.scene.addPellet(this.x, this.y)
          destroyGameObject(this);

        },
      });
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 1
////////////////////////////////////////////////////////////////////////////////////
class Enemy01 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = 3
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);


    if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
      this.toggleFlipX()
      this.body.velocity.y = -200
      this.switchDirection();
    } else {
      if (this.direction == -1 && this.body.blocked.left) {
        // console.log('blocked left')
        this.setFlipX(false)
        this.body.velocity.x = 200;
        this.direction = 1
        this.previousX = this.x;
        //this.switchDirection();
      }
      if (this.direction == 1 && this.body.blocked.right) {
        //console.log('blocked right')
        this.setFlipX(true)
        this.body.velocity.x = -200
        this.direction = -1
        this.previousX = this.x;
        //this.switchDirection();
      }
    }

  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 2
////////////////////////////////////////////////////////////////////////////////////
class Enemy02 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(10, 35)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.body.setAllowGravity(false)

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.direction == -1 && this.body.blocked.left) {
      // console.log('blocked left')
      this.setFlipX(false)
      this.body.velocity.x = this.vx;
      this.direction = 1
      this.previousX = this.x;
      //this.switchDirection();
    }
    if (this.direction == 1 && this.body.blocked.right) {
      //console.log('blocked right')
      this.setFlipX(true)
      this.body.velocity.x = -this.vx;
      this.direction = -1
      this.previousX = this.x;
      //this.switchDirection();
    }


  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 3
////////////////////////////////////////////////////////////////////////////////////
class Enemy03 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(45, 65)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);


    if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
      this.toggleFlipX()
      // this.body.velocity.y = -200
      this.switchDirection();
    } else {
      if (this.direction == -1 && this.body.blocked.left) {
        // console.log('blocked left')
        this.setFlipX(false)
        this.body.velocity.x = this.vx;
        this.direction = 1
        this.previousX = this.x;
        //this.switchDirection();
      }
      if (this.direction == 1 && this.body.blocked.right) {
        //console.log('blocked right')
        this.setFlipX(true)
        this.body.velocity.x = -this.vx;
        this.direction = -1
        this.previousX = this.x;
        //this.switchDirection();
      }
    }

  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 4
////////////////////////////////////////////////////////////////////////////////////
class Enemy04 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(35, 65)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    //this.body.setAllowGravity(false)

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')
    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
      this.toggleFlipX()
      this.body.velocity.y = -200
      this.switchDirection();
    } else {
      if (this.direction == -1 && this.body.blocked.left) {
        // console.log('blocked left')
        this.setFlipX(false)
        this.body.velocity.x = this.vx;
        this.direction = 1
        this.previousX = this.x;
        //this.switchDirection();
      }
      if (this.direction == 1 && this.body.blocked.right) {
        //console.log('blocked right')
        this.setFlipX(true)
        this.body.velocity.x = -this.vx;
        this.direction = -1
        this.previousX = this.x;
        //this.switchDirection();
      }
    }
    /* if (Math.abs(this.x - player.sprite.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    } */


  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 5
////////////////////////////////////////////////////////////////////////////////////
class Enemy05 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(50, 100)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.body.setAllowGravity(false)

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (Math.abs(this.x - player.sprite.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    }
    /* if (Math.abs(this.x - player.sprite.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    } */


  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 6
////////////////////////////////////////////////////////////////////////////////////
class Enemy06 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    //  var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(50, 100)
    //var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.speed = 100

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    //this.setGravityY(800)
    this.body.setAllowGravity(false)
    this.body.velocity.x = -this.speed;
    //this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.body.blocked.left) {
      this.body.velocity.x = 0;
      this.body.velocity.y = -this.speed;
    } else if (this.body.blocked.up) {
      this.body.velocity.x = this.speed;
      this.body.velocity.y = 0;
    } else if (this.body.blocked.right) {
      this.body.velocity.x = 0;
      this.body.velocity.y = this.speed;
    } else if (this.body.blocked.down) {
      this.body.velocity.x = -this.speed;
      this.body.velocity.y = 0;
    }
    /* if (this.body.blocked.down && this.body.blocked.left) {
      this.setGravityY(0)
      this.setGravityX(-800)
      this.body.velocity.x = 0;
      this.body.velocity.y = -this.speed;
    } else if (this.body.blocked.left && this.body.blocked.up) {
      this.setGravityY(-800)
      this.setGravityX(0)
      this.body.velocity.x = this.speed;
      this.body.velocity.y = 0;
    } else if (this.body.blocked.up && this.body.blocked.right) {
      this.setGravityY(0)
      this.setGravityX(800)
      this.body.velocity.x = 0;
      this.body.velocity.y = this.speed;
    } else if (this.body.blocked.right && this.body.blocked.down) {
      this.setGravityY(800)
      this.setGravityX(0)
      this.body.velocity.x = -this.speed;
      this.body.velocity.y = 0;
    }  */
    /* if (Math.abs(this.x - player.sprite.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    } */


  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 7 boss 1
////////////////////////////////////////////////////////////////////////////////////
class Enemy07 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    //  var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(50, 100)
    //var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.speed = 100

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    //this.setGravityY(800)
    this.body.setAllowGravity(false)
    this.body.velocity.x = -this.speed;
    this.direction = -1
    //this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.direction == -1 && this.body.blocked.left) {
      // console.log('blocked left')
      // this.setFlipX(false)
      this.body.velocity.x = this.vx;
      this.direction = 1
      this.previousX = this.x;
      //this.switchDirection();
    }
    if (this.direction == 1 && this.body.blocked.right) {
      //console.log('blocked right')
      // this.setFlipX(true)
      this.body.velocity.x = -this.vx;
      this.direction = -1
      this.previousX = this.x;
      //this.switchDirection();
    }
    /* if (this.body.blocked.down && this.body.blocked.left) {
      this.setGravityY(0)
      this.setGravityX(-800)
      this.body.velocity.x = 0;
      this.body.velocity.y = -this.speed;
    } else if (this.body.blocked.left && this.body.blocked.up) {
      this.setGravityY(-800)
      this.setGravityX(0)
      this.body.velocity.x = this.speed;
      this.body.velocity.y = 0;
    } else if (this.body.blocked.up && this.body.blocked.right) {
      this.setGravityY(0)
      this.setGravityX(800)
      this.body.velocity.x = 0;
      this.body.velocity.y = this.speed;
    } else if (this.body.blocked.right && this.body.blocked.down) {
      this.setGravityY(800)
      this.setGravityX(0)
      this.body.velocity.x = -this.speed;
      this.body.velocity.y = 0;
    }  */
    /* if (Math.abs(this.x - player.sprite.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    } */


  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 9
////////////////////////////////////////////////////////////////////////////////////
class Enemy09 extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;


    this.launched = false
    //this.play('thrust');
    var tiles = Phaser.Math.Between(3, 6)
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.body.setAllowGravity(false)

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { start: 0, end: 1 }),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.play('enemy-run')

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.frozen) {
      this.scene.physics.add.collider(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    } else {
      this.scene.physics.add.overlap(this.scene.player.sprite, this, this.scene.hitEnemy, null, this.scene);
    }
    if (Math.abs(this.x - this.scene.player.sprite.x) < this.maxDistance) {
      this.enemyFollowsOnce()
    }


  }

}
////////////////////////////////////////////////////////////////////////////////

const enemeyConfigs = [{
  //enemy 1 walks side to side jump on direction change
  strength: 1,
  key: 'enemies',
  frame: 50,
  fr: 8,
  frames: { start: 50, end: 55 },
  damage: 5
},
{
  //eneny 2 flies side to side
  strength: 1,
  key: 'enemies',
  frame: 0,
  frames: { start: 0, end: 3 },
  fr: 4,
  damage: 5
},

{
  //enemy 3 flies
  strength: 1,
  key: 'enemies',
  frame: 10,
  frames: { start: 10, end: 11 },
  fr: 8,
  damage: 5
},

{
  //Enemy4 attracked to player withing range
  strength: 1,
  key: 'enemies',
  frame: 30,
  frames: { start: 30, end: 33 },
  fr: 12,
  damage: 5
},

{// Enemy 5 attracked to player
  strength: 1,
  key: 'enemies',
  frame: 60,
  frames: { start: 60, end: 63 },
  fr: 6,
  damage: 5
},

{//6 wall crawler
  strength: 1,
  key: 'enemies',
  fr: 6,
  frame: 4,
  frames: { start: 4, end: 5 },
  damage: 5
},

{//7boos 1
  strength: 2,
  key: 'boss1',
  frame: 0,
  frames: { start: 0, end: 3 },
  fr: 6,
  damage: 5
},

{
  strength: 0,
  key: 'enemies',
  fr: 6,
  damage: 5
},

{
  //Enemy9 flies down to ground towards payer when near
  strength: 6,
  key: 'enemies',
  fr: 8,
  damage: 7
}
]