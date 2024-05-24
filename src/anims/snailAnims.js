export default (anims) => {
    anims.create({
        key: 'snail-idle',
        frames: anims.generateFrameNumbers('snail', {
          start: 1,
          end: 7
        }),
        frameRate: 10,
        repeat: -1
      })

    anims.create({
      key: 'snail-walk',
      frames: anims.generateFrameNumbers('snail', {
        start: 9,
        end: 15
      }),
      frameRate: 10,
      repeat: -1
    })

    
  }
