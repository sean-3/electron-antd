import { MenuItemConstructorOptions } from 'electron'

export const trayMenus: MenuItemConstructorOptions[] = [
  {
    label: 'Home',
    click: (): void => {
      $tools.createWindow('Home')
    },
  },
  { type: 'separator' },

  { label: 'Quit', role: 'quit' },
]
