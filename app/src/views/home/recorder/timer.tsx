import * as React from 'react'
import useInterval from 'use-interval'

interface ITimerProps {
  startRecording: () => void
  stopRecording: () => void
  clearBlobUrl: () => void
  setViewStatus: (status: string) => void
}

const Timer: React.FC<ITimerProps> = React.memo((props: ITimerProps) => {
  const { startRecording, stopRecording, setViewStatus } = props
  const [count, changeCount] = React.useState<number>(0)

  useInterval(() => {
    changeCount(count + 1)
  }, 1000)

  React.useEffect(() => {
    if (count === 3) {
      setViewStatus('recording')
      startRecording()
    }
    if (count === 13) {
      setViewStatus('stopped')
      stopRecording()
    }
  }, [count])

  return <h1>{count > 2 ? '' : -count + 3}</h1>
})

export default Timer
