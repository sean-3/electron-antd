const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    // redirect: { to: '/home?form=home' },
    windowOptions: {
      title: 'MulsanneTiktok',
      width: 450,
      height: 800,
      minWidth: 450,
      minHeight: 800,
    },
    createConfig: {
      showSidebar: true,
      saveWindowBounds: true,
      // openDevTools: true,
    },
  },
]

export default routes
