const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    // redirect: { to: '/home?form=home' },
    windowOptions: {
      title: 'MulsanneTiktok',
      width: 1080,
      height: 1920,
    },
    createConfig: {
      showSidebar: true,
      saveWindowBounds: true,
      // openDevTools: true,
    },
  },
]

export default routes
