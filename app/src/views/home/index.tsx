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

const INIT_VIDEO_NUMBER = 2

const VIDEOS_PATH = `${path.join(remote.app.getPath('documents'), 'mulsanne')}`

const Home: React.FC = () => {
  const [allVideoFileNames, setAllVideoFileNames] = React.useState<string[]>([])
  const [showVideoIndexArray, setShowVideoIndexArray] = React.useState<number[]>([])
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [activePlaying, setActivePlaying] = React.useState<boolean>(true)
  const [visible, setVisible] = React.useState<boolean>(false)
  const [closable, setClosable] = React.useState<boolean>(true)

  React.useEffect(() => {
    fs.readdir(VIDEOS_PATH, (_: any, files: string[]) => {
      const filterFiles = files.filter((item) => item.indexOf('mp4') !== -1)
      setShowVideoIndexArray(buildVideoIndexArray(INIT_VIDEO_NUMBER, filterFiles.length))
      setAllVideoFileNames(filterFiles)
    })
  }, [])

  const hanldeSubmit = (fileName: string) => {
    setAllVideoFileNames((preFileNames) => [...preFileNames, fileName])
    closeDrawer()
  }

  const settings = {
    dots: false,
    touchMove: true,
    swipeToSlide: true,
    arrows: false,
    draggable: true,
    adaptiveHeight: true,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 10000,
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
    },
  }

  const closeDrawer = () => {
    setVisible(false)
    setActivePlaying(true)
  }

  return (
    <div className="layout-padding">
      <div className="banner-icon">
        <img src="assets/app-icon/logo@2x.png" alt="logo" width="400px" height="auto" />
        <img src="assets/app-icon/与我同行@2x.png" alt="slogen" width="240px" height="auto" />
      </div>
      {allVideoFileNames.length > 0 && (
        <Slider {...settings} initialSlide={activeIndex}>
          {showVideoIndexArray.map((item, index) => {
            return (
              <div
                className="slider-item"
                key={item}
                // onClick={() => setActivePlaying((preState) => !preState)}
              >
                <ReactPlayer
                  width={800}
                  height={1430}
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
          closable={closable}
          visible={visible}
          bodyStyle={{ padding: 0 }}
          height="100%"
          onClose={closeDrawer}
        >
          <Recorder onSubmit={hanldeSubmit} setClosable={setClosable} />
        </Drawer>
      )}
    </div>
  )
}

export default Home
