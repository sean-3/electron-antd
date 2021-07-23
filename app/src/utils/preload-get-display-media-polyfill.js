const { desktopCapturer } = require('electron')

window.navigator.mediaDevices.getDisplayMedia = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen', 'window'],
      })
      const sourceId = sources.find((source) => source.name === 'MulsanneTiktok')?.id
      const stream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
          },
        },
      })
      resolve(stream)
    } catch (err) {
      console.error('Error displaying desktop capture sources:', err)
      reject(err)
    }
  })
}
