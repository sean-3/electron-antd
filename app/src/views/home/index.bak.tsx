import * as React from 'react'
import { Button, Drawer } from 'antd'
import Carousel, { Dots } from '@brainhubeu/react-carousel'
import '@brainhubeu/react-carousel/lib/style.css'
import random from '@/src/utils/random'
import ReactPlayer from 'react-player'
// import Recorder from './recorder'
import './style.less'

const randomVideoId = (currentArray: number[], range: number) => {
  let randomNumber = random(range - 1)
  while (currentArray.includes(randomNumber)) {
    randomNumber = random(range - 1)
  }
  return randomNumber
}

const buildVideoIdArray = (length: number, range: number, currentArray: number[] = []) => {
  const tempArray: number[] = [...currentArray]
  while (tempArray.length < length) {
    tempArray.push(randomVideoId(tempArray, range))
  }
  return tempArray
}

const Home: React.FC = () => {
  const allVideoCount = 11
  const showVideoCount = 8
  const [showVideoIds, setShowVideoIds] = React.useState<number[]>(
    buildVideoIdArray(showVideoCount, allVideoCount)
  )
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [activePlaying, setActivePlaying] = React.useState<boolean>(true)
  const [visible, setVisible] = React.useState<boolean>(false)

  const handleOnChange = (index: number) => {
    setActivePlaying(true)
    if (index + 1 === showVideoCount) {
      setActiveIndex(activeIndex - 3)
      setShowVideoIds(buildVideoIdArray(allVideoCount, showVideoCount, showVideoIds.slice(4, 7)))
    } else {
      setActiveIndex(index)
    }
  }

  const slides = showVideoIds.map((item, index) => {
    return (
      <div className="slider-item" key={item} onClick={() => setActivePlaying((preState) => !preState)}>
        <ReactPlayer
          width="100%"
          height="100%"
          url={`assets/video/${item}.mov`}
          loop
          playing={activePlaying && index === activeIndex}
          playsInline
          controls
        />
      </div>
    )
  })

  return (
    <div className="layout-padding">
      <Carousel value={activeIndex} onChange={handleOnChange} slides={slides} plugins={['arrows']} />
      <Dots value={activeIndex} onChange={handleOnChange} number={slides.length} />

      <div className="record-entry">
        <Button
          onClick={() => {
            setVisible(true)
            setActivePlaying(false)
          }}
        >
          进入录制
        </Button>
      </div>

      <Drawer
        placement="bottom"
        closable
        visible={visible}
        bodyStyle={{ padding: 0 }}
        height="100%"
        onClose={() => setVisible(false)}
      ></Drawer>
    </div>
  )
}

export default Home
