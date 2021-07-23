import * as React from 'react'
import { Button } from 'antd'
import { VideoCameraFilled, UploadOutlined } from '@ant-design/icons'
import { useReactMediaRecorder } from 'react-media-recorder'
import Slider from 'react-slick'
import '@brainhubeu/react-carousel/lib/style.css'
import '@/src/utils/preload-get-display-media-polyfill.js'
import Timer from './timer'
import './style.less'

type Props = {
  onSubmit: (fileName: string) => void
}

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])
  return stream ? <video ref={videoRef} autoPlay /> : null
}

const bgTemplates = [0, 1, 2, 3, 4]

const Recorder: React.FC<Props> = React.memo((props: Props) => {
  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
    screen: true,
  })
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
    className: 'video-slider',
    customPaging: function (i: number) {
      return <a className="template-item">{i}</a>
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
    props.onSubmit((fileName as unknown) as string)
  }

  return (
    <div className="record-wrapper">
      {/* 停止录制视频 */}
      {viewStatus === 'stopped' && mediaBlobUrl && (
        <div className="video-preview">
          <video src={mediaBlobUrl} autoPlay loop />
          <div className="record-action">
            <Button
              icon={<VideoCameraFilled />}
              size="large"
              type="primary"
              onClick={() => setViewStatus('idle')}
            >
              重新拍摄
            </Button>
            <Button
              icon={<UploadOutlined />}
              size="large"
              type="primary"
              onClick={() => downloadBlob(mediaBlobUrl)}
            >
              发布上传
            </Button>
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
    </div>
  )
})

export default Recorder
