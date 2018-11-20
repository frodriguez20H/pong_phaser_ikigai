/* globals __DEV__ */
import Phaser from "phaser";
// import Mushroom from '../sprites/Mushroom'
// import lang from '../lang'

export default class extends Phaser.State {

  init() {}

  preload() { }

  create() {
    this.ponSound = this.add.audio('pon');
    this.musicBack = this.add.audio('music_back', 1, true);
    this.musicBack.play();

    this.onScore = new Phaser.Signal();

    this.player1Score = 0;
    this.player2Score = 0;

    this.ballSpeed = 5;

    const H = game.height;
    const W = game.width;


    this.uKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.W,
      Phaser.Keyboard.S,
      Phaser.Keyboard.SPACEBAR
    ]);

    const createSprite = (x, y, width, height, key, parent) => {
      const sprite = game.add.sprite(x, y, key);
      sprite.width = width;
      sprite.height = height;

      if (parent) {
        parent.add(sprite);
      }

      return sprite;
    }

    createSprite(0, 0, W, H, "background");
    const walls = game.add.group();

    this.globalScore = this.add.text(this.world.centerX, 80, ` ${this.player1Score} - ${this.player2Score} `, {
      font: '60px Bangers',
      fill: '#1111111'
    })

    this.globalScore.stroke = '#000000'
    this.globalScore.strokeThickness = 6
    this.globalScore.fill = '#ffffff'

    this.globalScore.anchor.setTo(0.5, 0.5);

    const createRectangle = (x, y, width, height, color, parent) => {
      const graphics = game.add.graphics(x, y);
      graphics.beginFill(color);
      graphics.drawRect(0,0, width, height);
      graphics.endFill();

      if (parent) {
        parent.add(graphics);
      }

      return graphics;
    }

    createRectangle(0, 0, W, 20, 0x000000, walls);
    createRectangle(0, H - 20, W, 20, 0X000000, walls);

    // Change color por sprite.
    this.player1 = createSprite(40, (H/2) - 50, 20, 100, 'bar_1');
    this.player2 = createSprite(W - 40 - 20, (H/2) - 50, 20, 100, 'bar_2');

    this.ball = createRectangle((W/2) - 20, (H/2) - 20, 40 , 40, 0xffffff);

    this.prepareGame();

  }

  update() {
    const H = game.height;
    const W = game.width;

    //PLAYER 1
    if (this.wKey.isDown && this.player1.y >= 20) {
      this.player1.y -= 10;
    } else if (this.sKey.isDown && this.player1.y <= H - 20 - 100) {
      this.player1.y += 10;
    }

    //PLAYER 2
    if (this.uKey.isDown && this.player2.y >= 20) {
      this.player2.y -= 10;
    } else if (this.dKey.isDown && this.player2.y <= H - 20 - 100) {
      this.player2.y += 10;
    }

    // BALL
    if (this.ball.y <= 20 || this.ball.y >= H - 20 - 40) {
      this.ballMoveY *= -1;
    }

    const leftBounded = this.ball.x <= 40 + 20;
    const rightBounded = this.ball.x >= W - 20 - 40 - 40;

    const p1Hits = this.player1.y < this.ball.y + this.ball.height && this.player1.y + this.player1.height > this.ball.y;
    const p2Hits = this.player2.y < this.ball.y + this.ball.height && this.player2.y + this.player2.height > this.ball.y;

    if ((leftBounded && p1Hits || rightBounded && p2Hits) && !this.scored) {
      this.ponSound.play();
      this.ballMoveX *= -1;
    } else if (leftBounded && !p1Hits) {
      this.scored = true;
      this.onScore.dispatch(2);
    } else if (rightBounded && !p2Hits) {
      this.scored = true;
      this.onScore.dispatch(1);
    }

    this.ball.x += this.ballMoveX;
    this.ball.y += this.ballMoveY;
  }

  setScore(player) {
    if (player === 1) {
      this.player1Score++;
    } else {
      this.player2Score++;
    }

    this.globalScore.setText(` ${this.player1Score} - ${this.player2Score} `);

    game.time.events.add(900, this.prepareGame, this);
  }

  prepareGame() {
    this.ball.position.setTo((game.width / 2) - 20, (game.height / 2) - 20);
    this.ballMoveX = 0;
    this.ballMoveY = 0;
    this.onScore.addOnce(this.setScore, this);
    this.scored = false;

    // Reset bar positions when start to center.

    // Count Back
    this.spaceKey.onDown.addOnce(() => {
      this.ballMoveX = Math.round(Math.random(1)) ? this.ballSpeed : -this.ballSpeed;
      this.ballMoveY = Math.round(Math.random(1)) ? this.ballSpeed : -this.ballSpeed;
    }, this);
  }
}
