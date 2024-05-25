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
    this.add.text(this.cameras.main.centerX, 100, 'Thanks for playing!', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(this.cameras.main.centerX, 180, `Your Score: ${this.score}`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.displayLeaderboard();
  }

  async displayLeaderboard() {
    try {
      const response = await fetch('/.netlify/functions/leaderboard');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const leaderboard = await response.json();

      this.add.text(this.cameras.main.centerX, 250, 'Leaderboard:', {
        fontSize: '32px',
        color: '#ffffff'
      }).setOrigin(0.5);

      // Limit the leaderboard display to top 7 results
      leaderboard.slice(0, 7).forEach((entry, index) => {
        this.add.text(this.cameras.main.centerX, 300 + (index * 30), `${entry.initials}.......${entry.score}`, {
          fontSize: '28px',
          color: '#ffffff'
        }).setOrigin(0.5);
      });

      const buttonY = 300 + (Math.min(leaderboard.length, 7) * 30) + 50;

      const restartButton = this.add.text(this.cameras.main.centerX - 100, buttonY, 'Restart', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#000000'
      }).setOrigin(0.5).setPadding(10).setInteractive();

      restartButton.on('pointerdown', () => {
        this.scene.start('PlayScene');
      });

      const menuButton = this.add.text(this.cameras.main.centerX + 100, buttonY, 'Main Menu', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#000000'
      }).setOrigin(0.5).setPadding(10).setInteractive();

      menuButton.on('pointerdown', () => {
        this.scene.start('MenuScene');
      });

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }
}

export default EndGameScene;
