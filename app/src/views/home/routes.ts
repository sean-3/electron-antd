const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/home',
    createConfig: {
      single: false,
    },
    windowOptions: {
      width: 450,
      height: 800,
      minWidth: 450,
      minHeight: 800,
    },
  },
]

export default routes
