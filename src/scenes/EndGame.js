import Phaser from 'phaser';

class EndGameScene extends Phaser.Scene {
  constructor(config) {
    super('EndGameScene');
    this.config = config;
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
      console.log('About to fetch leaderboard:', this.config.leaderboardUrl);

      const response = await fetch(this.config.leaderboardUrl, { cache: 'no-store' });
      console.log('Fetch response:', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clone the response so we can read it twice
      const responseClone = response.clone();

      // Log the response body
      const responseBody = await responseClone.text();
      console.log('Response body:', responseBody);

      // Parse the response body as JSON
      const leaderboard = await response.json();
      console.log('Leaderboard data:', leaderboard);

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
    /*console.log('Leaderboard URL:', this.config.leaderboardUrl);

    try {
      console.log('About to fetch leaderboard:', this.config.leaderboardUrl);
  
      const response = await fetch(this.config.leaderboardUrl, { cache: 'no-store' });
      console.log('Fetch response:', response);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const leaderboard = await response.json();
      console.log('Leaderboard data:', leaderboard);
  
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
    }*/
  }    


export default EndGameScene;
