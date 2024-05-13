export default (anims) => {
    anims.create({
        key: 'sam-idle',
        frames: anims.generateFrameNumbers('samurai', {
          start: 1,
          end: 7
        }),
        frameRate: 10,
        repeat: -1
      })

    anims.create({
      key: 'sam-walk',
      frames: anims.generateFrameNumbers('samurai', {
        start: 9,
        end: 15
      }),
      frameRate: 10,
      repeat: -1
    })

    
  }
