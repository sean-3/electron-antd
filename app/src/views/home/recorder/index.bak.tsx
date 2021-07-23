import * as React from 'react'
import { Button } from 'antd'
import { useReactMediaRecorder } from 'react-media-recorder'
import Timer from './timer'
import FrameAnimate from '@/src/utils/frame-animate'
import './style.less'

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])
  return stream ? <video ref={videoRef} autoPlay /> : null
}

interface IRecorderProps {}

const bgTemplates = ['dtsn', 'fxdyr', 'jdft', 'rmws', 'wxlg']

const Recorder: React.FC<IRecorderProps> = React.memo(() => {
  const { status, startRecording, stopRecording, mediaBlobUrl, ...rest } = useReactMediaRecorder({
    screen: true,
  })
  const { previewStream } = useReactMediaRecorder({ video: true })
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>(bgTemplates[0])
  const [frame, setFrame] = React.useState<any>(null)
  const intervalRef = React.useRef<any>(null)
  const [count, changeCount] = React.useState<number>(0)

  const handleRecorder = () => {}

  React.useEffect(() => {
    const canvasEle = document.getElementById('frameAnimate')
    if (!canvasEle) return
    const framePlayer = new FrameAnimate(
      canvasRef.current,
      {
        width: 1080,
        height: 1920,
        frame: 104,
        loop: true,
        fps: 20,
      },
      () => {
        frame.stop()
      }
    )
    framePlayer.play()
    setFrame(framePlayer)
  }, [selectedTemplate])

  return (
    <div className="record-wrapper">
      {status === 'stopped' && mediaBlobUrl ? (
        <video src={mediaBlobUrl} controls autoPlay loop />
      ) : (
        <div className="record-screen">
          <VideoPreview stream={previewStream} />
          <img src="assets/video/67.gif" alt="" width="100%" height="100%" className="frame-animate" />
          {/* <canvas
            ref={canvasRef}
            className="frame-animate"
            id="frameAnimate"
            data-source={`assets/template-sequence/${selectedTemplate}/`}
          /> */}
        </div>
      )}
      <div className="template-selector">
        <p>添加贴图</p>
        {bgTemplates.map((item) => (
          <div
            key={item}
            className={`template-item ${selectedTemplate === item ? 'selected' : ''}`}
            onClick={() => {
              frame.stop()
              setSelectedTemplate(item)
            }}
          ></div>
        ))}
      </div>

      <div className="record-action">
        <Button onClick={() => handleRecorder}>随心拍</Button>
        <Button onClick={() => stopRecording()}>结束拍摄</Button>
      </div>
    </div>
  )
})

export default Recorder
