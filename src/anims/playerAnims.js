export default (anims) => {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {
          start: 1,
          end: 7
        }),
        frameRate: 10,
        repeat: -1
      })

    anims.create({
      key: 'walk',
      frames: anims.generateFrameNumbers('player', {
        start: 9,
        end: 15
      }),
      frameRate: 10,
      repeat: -1
    })

    anims.create({
      key: 'jump',
      frames: anims.generateFrameNumbers('player', {
        start: 16,
        end: 21
      }),
      frameRate: 1,
      repeat: 1
    })

    anims.create({
      key: 'hide',
      frames: anims.generateFrameNumbers('player', {
        start: 25,
        end: 38
      }),
      frameRate: 6,
      repeat: 0
    })
  }
