import * as React from 'react'
import { Button } from 'antd'
import { VideoCameraFilled, UploadOutlined } from '@ant-design/icons'
import { useReactMediaRecorder } from 'react-media-recorder'
import Slider from 'react-slick'
import ReactAudioPlayer from 'react-audio-player'
import '@brainhubeu/react-carousel/lib/style.css'
import '@/src/utils/preload-get-display-media-polyfill.js'
import Timer from './timer'
import './style.less'

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])
  return stream ? <video ref={videoRef} autoPlay /> : null
}

const bgTemplates = [0, 1, 2, 3, 4]

type Props = {
  onSubmit: (fileName: string) => void
  setClosable: (status: boolean) => void
}

const Recorder: React.FC<Props> = React.memo((props: Props) => {
  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
    screen: true,
  })
  const [templateIndex, setTemplateIndex] = React.useState<number>(0)
  const { previewStream } = useReactMediaRecorder({ video: true })
  const [viewStatus, setViewStatus] = React.useState<string>('idle')

  // console.log(status)

  const settings = {
    fade: true,
    dots: true,
    lazyLoad: 'ondemand' as 'ondemand' | 'progressive',
    dotsClass: 'slick-dots slick-thumb',
    arrows: false,
    adaptiveHeight: true,
    infinite: false,
    className: 'gif-slider',
    customPaging: function (i: number) {
      return (
        <a className="template-item">
          <img key={i} src={`assets/template/poster/${i}.png`} alt="poster" width="100%" height="100%" />
        </a>
      )
    },
    beforeChange: (_preIndex: number, nextIndex: number) => {
      setTemplateIndex(nextIndex)
    },
  }

  const slides = bgTemplates.map((item) => {
    return <img key={item} src={`assets/template/gif/${item}.gif`} alt="" />
  })

  const downloadBlob = (blobUrl: string) => {
    const fileName = new Date().valueOf()
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `${fileName}.mp4`
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    )
    props.onSubmit((`${fileName}.mp4` as unknown) as string)
  }

  React.useEffect(() => {
    if (viewStatus === 'pending' || viewStatus === 'recording') {
      props.setClosable(false)
    } else {
      props.setClosable(true)
    }
  }, [viewStatus])

  return (
    <div className="record-wrapper">
      {/* 停止录制视频 */}
      {viewStatus === 'stopped' && mediaBlobUrl && (
        <div className="video-preview">
          <video src={mediaBlobUrl} autoPlay loop />
          <div className="record-action">
            <div>
              <Button
                icon={<VideoCameraFilled />}
                size="large"
                type="primary"
                onClick={() => setViewStatus('idle')}
              >
                重新拍摄
              </Button>
            </div>
            <div>
              <Button
                icon={<UploadOutlined />}
                size="large"
                type="primary"
                onClick={() => downloadBlob(mediaBlobUrl)}
                style={{ marginTop: 30 }}
              >
                发布上传
              </Button>
            </div>
          </div>
        </div>
      )}

      {viewStatus !== 'stopped' && (
        <div className="record-screen">
          <VideoPreview stream={previewStream} />
          <div
            className={`template-animate ${
              viewStatus === 'recording' || viewStatus === 'pending' ? 'recording' : ''
            }`}
          >
            <Slider {...settings}>{slides}</Slider>
          </div>
        </div>
      )}

      {(viewStatus === 'pending' || viewStatus === 'recording') && (
        <div className="timer-wrapper">
          <Timer
            startRecording={startRecording}
            stopRecording={stopRecording}
            clearBlobUrl={clearBlobUrl}
            setViewStatus={setViewStatus}
          />
        </div>
      )}

      {viewStatus === 'idle' && (
        <div className="record-action">
          <Button
            icon={<VideoCameraFilled />}
            size="large"
            type="primary"
            onClick={() => setViewStatus('pending')}
          >
            开始录制
          </Button>
        </div>
      )}

      {viewStatus !== 'stopped' && (
        <ReactAudioPlayer
          src={`assets/template/mp3/${viewStatus === 'pending' ? 'pending' : templateIndex}.mp3`}
          autoPlay
        />
      )}
    </div>
  )
})

export default Recorder
