import Phaser from 'phaser';

class EndGameScene extends Phaser.Scene {
  constructor() {
    super('EndGameScene');
  }

  init(data) {
    this.message = data.message;
    this.score = data.score || 0;
  }

  create() {
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Thanks for playing!', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, this.message, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, `Your Score: ${this.score}`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Restart', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    const menuButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Main Menu', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}

export default EndGameScene;
