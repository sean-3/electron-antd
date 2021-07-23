import * as React from 'react'
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

import { Button, Drawer } from 'antd'
import { VideoCameraFilled } from '@ant-design/icons'
import Slider from 'react-slick'
import random from '@/src/utils/random'
import ReactPlayer from 'react-player'
import Recorder from './recorder'
import './style.less'

const randomVideoIndex = (currentArray: number[], range: number) => {
  let randomNumber = random(range - 1)
  while (currentArray.includes(randomNumber)) {
    randomNumber = random(range - 1)
  }
  return randomNumber
}

const buildVideoIndexArray = (length: number, range: number, currentArray: number[] = []) => {
  const tempArray: number[] = [...currentArray]
  while (tempArray.length < length) {
    tempArray.push(randomVideoIndex(tempArray, range))
  }
  return tempArray
}

const INIT_VIDEO_NUMBER = 3

const VIDEOS_PATH = `${path.join(remote.app.getPath('documents'), 'mulsanne')}`

const Home: React.FC = () => {
  const [allVideoFileNames, setAllVideoFileNames] = React.useState<string[]>([])
  const [showVideoIndexArray, setShowVideoIndexArray] = React.useState<number[]>([])
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [activePlaying, setActivePlaying] = React.useState<boolean>(true)
  const [visible, setVisible] = React.useState<boolean>(false)

  React.useEffect(() => {
    fs.readdir(VIDEOS_PATH, (_: any, files: string[]) => {
      setShowVideoIndexArray(buildVideoIndexArray(INIT_VIDEO_NUMBER, files.length))
      setAllVideoFileNames(files.filter((item) => item.indexOf('mov') !== -1))
    })
  }, [])

  const hanldeSubmit = (fileName: string) => {
    setAllVideoFileNames((preFileNames) => [...preFileNames, fileName])
    setVisible(false)
  }

  const settings = {
    dots: false,
    touchMove: true,
    swipeToSlide: true,
    arrows: false,
    draggable: true,
    adaptiveHeight: true,
    infinite: false,
    className: 'video-slider',
    afterChange: (index: number) => {
      setActivePlaying(true)
      setActiveIndex(index)
      if (index + 1 === showVideoIndexArray.length && showVideoIndexArray.length !== allVideoFileNames.length) {
        setShowVideoIndexArray((preArray) => [
          ...preArray,
          randomVideoIndex(preArray, allVideoFileNames.length),
        ])
      }
      // if (index + 1 === showVideoCount) {
      //   setActiveIndex(activeIndex - 3)
      //   setShowVideoIds(buildVideoIdArray(allVideoCount, showVideoCount, showVideoIds.slice(4, 7)))
      // } else {
      //   setActiveIndex(index)
      // }
    },
  }

  return (
    <div className="layout-padding">
      {allVideoFileNames.length > 0 && (
        <Slider {...settings} initialSlide={activeIndex}>
          {showVideoIndexArray.map((item, index) => {
            return (
              <div className="slider-item" key={item} onClick={() => setActivePlaying((preState) => !preState)}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={`atom:///${VIDEOS_PATH}/${allVideoFileNames[item]}`}
                  loop
                  playing={activePlaying && index === activeIndex}
                  playsInline
                />
              </div>
            )
          })}
        </Slider>
      )}
      <div className="record-entry">
        <Button
          icon={<VideoCameraFilled />}
          size="large"
          type="primary"
          onClick={() => {
            setVisible(true)
            setActivePlaying(false)
          }}
        >
          拍同款
        </Button>
      </div>
      {visible && (
        <Drawer
          placement="bottom"
          closable
          visible={visible}
          bodyStyle={{ padding: 0 }}
          height="100%"
          onClose={() => setVisible(false)}
        >
          <Recorder onSubmit={hanldeSubmit} />
        </Drawer>
      )}
    </div>
  )
}

export default Home
