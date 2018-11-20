import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.audio('pon', ['assets/audio/impact_1.mp3', 'assets/audio/impact_1.ogg']);
    this.load.audio('music_back', ['assets/audio/VGMA Challenge - July 5th.mp3', 'VGMA Challenge - July 5th.ogg']);

    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('background', 'assets/images/background_space.jpg')
    this.load.image('bar_1', 'assets/images/bar_1.png')
    this.load.image('bar_2', 'assets/images/bar_2.png')
  }

  create () {
    this.state.start('Game')
  }
}
