import Phaser from 'phaser';

class InputScoreScene extends Phaser.Scene {
  constructor(config) {
    super('InputScoreScene');
    this.config = config;
    this.initials = '';
  }

  init(data) {
    this.message = data.message;
    this.score = data.score || 0;
  }

  create() {
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Congratulations!', {
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

    // Display initials input as "Name: _ _ _"
    this.initialsText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Name: _ _ _', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Submit button
    const submitButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'Submit', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }).setOrigin(0.5).setPadding(10).setInteractive();

    submitButton.on('pointerdown', async () => {
      if (this.initials.length === 3) {
        await this.updateLeaderboard(this.initials, this.score);
        this.scene.start('EndGameScene', { message: 'Thanks for playing!', score: this.score });
      }
    });

    // Add keyboard input event listener
    this.input.keyboard.on('keydown', this.handleKeyInput, this);
  }

  handleKeyInput(event) {
    if (this.initials.length < 3 && /^[a-zA-Z]$/.test(event.key)) {
      this.initials += event.key.toUpperCase();
    } else if (event.key === 'Backspace' && this.initials.length > 0) {
      this.initials = this.initials.slice(0, -1);
    }

    this.updateInitialsText();
  }

  updateInitialsText() {
    let displayText = 'Name: ';
    for (let i = 0; i < 3; i++) {
      displayText += (this.initials[i] || '_') + ' ';
    }
    this.initialsText.setText(displayText.trim());
  }

  async updateLeaderboard(initials, score) {
    try {
      const response = await fetch(this.config.leaderboardUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initials, score })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.leaderboardUpdated = true;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }
}

export default InputScoreScene;
