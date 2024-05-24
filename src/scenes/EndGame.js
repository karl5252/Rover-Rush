import Phaser from 'phaser';

class EndGameScene extends Phaser.Scene {
  constructor() {
    super('EndGameScene');
  }

  init(data) {
    this.message = data.message;
    this.score = data.score || 0;
    this.leaderboardUpdated = false; // Flag to check if leaderboard is updated
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

    // Input field for initials
    this.initialsInput = this.add.dom(this.cameras.main.centerX, this.cameras.main.centerY + 100).createFromHTML(`
      <input type="text" id="initials" name="initials" maxlength="3" placeholder="Initials">
    `);

    // Submit button
    const submitButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'Submit', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();

    submitButton.on('pointerdown', async () => {
      const initials = document.getElementById('initials').value.toUpperCase();
      if (initials.length === 3) {
        await this.updateLeaderboard(initials, this.score);
        this.displayLeaderboard();
      }
    });

    // Restart button
    const restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Restart', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.start('PlayScene');
    });

    // Main Menu button
    const menuButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 250, 'Main Menu', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  async updateLeaderboard(initials, score) {
    try {
      const response = await fetch('/leaderboard', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initials, score })
      });
      if (response.ok) {
        this.leaderboardUpdated = true;
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  async displayLeaderboard() {
    if (!this.leaderboardUpdated) return;

    try {
      const response = await fetch('/leaderboard');
      const leaderboard = await response.json();

      this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 300, 'Leaderboard:', {
        fontSize: '32px',
        color: '#ffffff'
      }).setOrigin(0.5);

      leaderboard.forEach((entry, index) => {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 350 + (index * 30), `${entry.initials}.......${entry.score}`, {
          fontSize: '28px',
          color: '#ffffff'
        }).setOrigin(0.5);
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }
}

export default EndGameScene;
