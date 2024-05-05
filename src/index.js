import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: {
        preload,
        create,
        update: update,
    },

};

function preload() {debugger};
function create() {debugger};


new Phaser.Game(config);
