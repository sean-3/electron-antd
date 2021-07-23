import React from 'react'
import $c from 'classnames'
import './app-layout.less'

interface AppLayoutProps {
  createConfig: CreateConfig
  children: JSX.Element
}

export const AppLayout: React.FC<AppLayoutProps> = (props: AppLayoutProps) => {
  const { children } = props
  return (
    <div className={$c('flex app-layout', process.platform)}>
      <div className="flex-1 app-content-wrap">
        <div className="app-content">{children}</div>
      </div>
    </div>
  )
}
