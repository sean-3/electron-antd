/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
class frameAnimate {
  _currentFrame: any
  _onloadLength: any
  frame: any
  _setInterval: any
  loopCount: any
  optsLoopCount: any
  fps: number
  _ctx: any
  _frames: any
  singleMode: any
  loop: any
  callback: any
  canvas: any
  extension: any
  source: any
  seekTo(n: number) {
    this.pause()
    this._currentFrame = n
    if (this._onloadLength < this.frame) {
      this.checkLoad('seekTo', n)
    } else {
      this.draw()
    }
  }

  replay() {
    this.pause()
    this.seekTo(0)
    this.play()
  }

  stop() {
    this.pause()
    this.seekTo(this.frame - 1)
  }

  pause() {
    if (this._setInterval) {
      clearInterval(this._setInterval)
    }
  }

  play() {
    this.loopCount = this.optsLoopCount
    this.pause()
    if (this._onloadLength < this.frame) {
      this.checkLoad('play', 0)
    } else {
      this._setInterval = setInterval(() => {
        if (this._onloadLength === this.frame) {
          this.draw()
        }
      }, 1000 / this.fps)
    }
  }

  checkLoad(next: string, n: number) {
    this._setInterval = setInterval(() => {
      if (this._onloadLength === this.frame) {
        // console.log("==pics load complete==");
        clearInterval(this._setInterval)

        switch (next) {
          case 'draw':
            this.draw()
            break
          case 'seekTo':
            this.seekTo(n)
            break
          default:
            this.play()
        }
      }
    }, 1000 / this.fps)
  }

  draw() {
    this._ctx.clearRect(0, 0, this.width, this.height)
    const f = this._frames[this._currentFrame]
    if (this.singleMode) {
      this._ctx.drawImage(this._img, f.x, f.y, this.width, this.height)
    } else {
      this._ctx.drawImage(f, 0, 0, this.width, this.height)
    }

    if (this._currentFrame === this.frame - 1) {
      this._currentFrame = 0
      if (!this.loop) {
        this.pause()
        if (this.callback) {
          this.callback()
        }
      }
      if (this.loopCount) {
        if (this.loopCount > 1) {
          this.loopCount--
        } else {
          this.pause()
          if (this.callback) {
            this.callback()
          }
        }
      }
    } else {
      this._currentFrame++
    }
  }
  width() {
    throw new Error('Method not implemented.')
  }
  height() {
    throw new Error('Method not implemented.')
  }
  _img() {
    throw new Error('Method not implemented.')
  }

  init() {
    this.canvas.width = this.width
    this.canvas.height = this.height

    this._ctx = this.canvas.getContext('2d')

    if (this.singleMode) {
      singleMode(this)
    } else {
      picsMode(this)
    }
    // 未完成
    function singleMode(self: any) {
      self._img = new Image()
      self._img.src = self.source
      self._img.onload = function () {
        const img_WIDTH = self._img.width / self.width
        const img_HEIGHT = self._img.height / self.height
        for (let i = 0; i < img_HEIGHT; i++) {
          for (let j = 0; j < img_WIDTH; j++) {
            const frame = {
              x: (j % img_WIDTH) * self.width,
              y: i * self.height,
            }
            self.frames.push(frame)
          }
        }
      }
    }

    function picsMode(self: any) {
      for (let i = 0; i < self.frame; i++) {
        const _img = new Image()
        _img.src = self.source + i + self.extension
        self._frames.push(_img)

        _img.onload = function () {
          self._onloadLength++
        }
      }
    }
  }

  constructor(canvas: HTMLCanvasElement | null, opts: any, callback: () => void) {
    this.canvas = canvas

    this.width = opts.width
    this.height = opts.height
    this.frame = opts.frame
    this.fps = opts.fps || 24
    this.loop = opts.loop
    this.loopCount = opts.loopCount
    this.optsLoopCount = opts.loopCount
    this.singleMode = opts.singleMode || false
    this.extension = opts.extension || '.png'

    this.callback = callback

    this._currentFrame = 0
    this.source = this.canvas.getAttribute('data-source')
    this._setInterval
    this._onloadLength = 0

    this._frames = []

    this.init()
  }
}

export default frameAnimate
