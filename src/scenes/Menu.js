import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    // Load any assets needed for the menu here
  }

  create() {
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Ninja Rage', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start Game', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();


    startButton.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    // add below text with controls information and game goals
    //arrow keys for moving and space for jump
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Arrow keys for moving and space for jump', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // ninja has to gather dragon eggs, reach far right end and avoid samurais

    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'Ninja has to gather dragon eggs, reach blue flag at the end and avoid samurais', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Optionally, add more buttons or menu items here
    this.add.image(this.cameras.main.centerX - 200, this.cameras.main.centerY, 'player')
    .setOrigin(0.5)
    .setScale(2);

    this.add.image(this.cameras.main.centerX + 200, this.cameras.main.centerY, 'samurai')
    .setOrigin(0.5)
    .setScale(2)
    .flipX = true;
    
  }
}

export default MenuScene;
