const { Menu, app } = require('electron').remote
const { ipcRenderer, shell } = require('electron')
const isDev = require('electron-is-dev')
const { getInitialStateRenderer } = require('electron-redux')

// TODO subscribe to store, update menu when keymap changes
const configureStore = require('./shared/store/configureStore')
const store = configureStore(getInitialStateRenderer(), 'renderer')
let keystrokeFor = command => store.getState().entities.keymap[command]

// TODO remove unused
// const observeStore = require('./shared/helpers/observeStore')


let SubMenuFragments = {}
SubMenuFragments.View = [
  ...isDev
    ? [
        {
          label: '重新加载 / Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        }
      ]
    : [],
  {
    label: '开发者工具 / Toggle Developer Tools',
    accelerator: keystrokeFor('menu:view:toggle-developer-tools'),
    click (item, focusedWindow) {
      if (focusedWindow) focusedWindow.webContents.toggleDevTools()
    }
  }
]
SubMenuFragments.help = [
  {
    label: 'Learn More',
    click () { shell.openExternal('https://wonderunit.com/storyboarder') }
  },
  {
    label: 'Getting Started…',
    click () { shell.openExternal('https://wonderunit.com/storyboarder/faq/#How-do-I-get-started') }
  },
  {
    label: 'Shot Generator Tutorial…',
    click () {
      ipcRenderer.send('shot-generator:menu:help:tutorial')
    }
  },
  {
    label: 'Frequently Asked Questions…',
    click () { shell.openExternal('https://wonderunit.com/storyboarder/faq') }
  },
  {
    label: 'Found a bug? Submit an issue!!!',
    click () { shell.openExternal('https://github.com/wonderunit/storyboarder/issues/new') }
  }
]
SubMenuFragments.windowing = [
  {
    label: '最小化 / Minimize',
    accelerator: keystrokeFor("menu:window:minimize"),
    role: 'minimize'
  },
  {
    label: '关闭窗口 / Close Window',
    accelerator: keystrokeFor("menu:window:close"),
    role: 'close'
  }
]

let AppMenu = {}
AppMenu.File = () => ({
  label: '文件',
  submenu: [
    {
      label: '打开文件 / Open…',
      accelerator: keystrokeFor('menu:file:open'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('openDialogue')
      }
    },
    {
      type: 'separator'
    },
    {
      label: '保存 / Save',
      accelerator: keystrokeFor('menu:file:save'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('save')
      }
    },
    {
      label: '另存为 / Save As …',
      accelerator: keystrokeFor('menu:file:save-as'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('saveAs')
      }
    },
    {
      type: 'separator'
    },
    {
      label: '导出 GIF 动画 / Export Animated GIF',
      accelerator: keystrokeFor('menu:file:export-animated-gif'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportAnimatedGif')
      }
    },
    {
      label: '导出为 FCPX 和 PR 序列 / Export Scene for Final Cut Pro X and Premiere',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportFcp')
      }
    },
    {
      label: '导出图片序列 / Export Scene as Images',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportImages')
      }
    },
    {
      label: '导出视频 / Export Video',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportVideo')
      }
    },
    {
      label: '导出至 Web / Export to Web …',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportWeb')
      }
    },
    {
      label: '导出 ZIP 压缩包 / Export Project as ZIP',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportZIP')
      }
    },
    {
      type: 'separator'
    },
    {
      label: '清理场景 / Clean Up Scene…',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportCleanup')
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor('menu:file:print'),
      label: '打印或导出至 PDF / Print or export to PDF…',
      click (item, focusedWindow, event) {
        ipcRenderer.send('exportPDF')
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor("menu:file:print-worksheet"),
      label: '打印故事板工作表 / Print a Storyboarder worksheet…',
      click (item, focusedWindow, event) {
        ipcRenderer.send('printWorksheet')
      }
    },
    {
      accelerator: keystrokeFor("menu:file:import-worksheets"),
      label: '导入工作表 / Import worksheets…',
      click (item, focusedWindow, event) {
        ipcRenderer.send('importWorksheets')
      }
    },
    {
      type: 'separator'
    },
    {
      label: '导入图片至新的故事板中 / Import Images to New Boards…',
      accelerator: keystrokeFor("menu:file:import-images"),
      click (item, focusedWindow, event) {
        ipcRenderer.send('importImagesDialogue', false)
      }
    },
    {
      label: '导入图片并替换 / Import Image and Replace…',
      accelerator: keystrokeFor("menu:file:import-image-replace"),
      click (item, focusedWindow, event) {
        ipcRenderer.send('importImagesDialogue', true)
      }
    }
  ]
})
AppMenu.Edit = () => ({
  label: '编辑',
  submenu: [
    {
      label: '撤销 / Undo',
      accelerator: keystrokeFor('menu:edit:undo'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('undo')
      }
    },
    {
      label: '恢复 / Redo',
      accelerator: keystrokeFor('menu:edit:redo'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('redo')
      }
    },
    {
      type: 'separator'
    },
    {
      label: '剪切 / Cut',
      accelerator: keystrokeFor('menu:edit:cut'),
      role: 'cut'
    },
    {
      label: '复制 / Copy',
      accelerator: keystrokeFor('menu:edit:copy'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('copy')
      }
    },
    {
      label: '粘贴 / Paste',
      accelerator: keystrokeFor('menu:edit:paste'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('paste')
      }
    },
    {
      label: '粘贴并替换 / Paste and Replace',
      accelerator: keystrokeFor('menu:edit:paste-replace'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('paste-replace')
      }
    },
    {
      label: '全选 / Select All',
      accelerator: keystrokeFor('menu:edit:select-all'),
      role: 'selectall'
    },

    // add Edit > Preferences on Windows and Linux
    ...(process.platform !== 'darwin')
    ? [
        {
          type: 'separator'
        },
        {
          label: '性能 / Preferences',
          accelerator: keystrokeFor('menu:edit:preferences'),
          click: () => ipcRenderer.send('preferences')
        }
      ]
    : []

    // {
    //   type: 'separator'
    // },
    // {
    //   label: 'Speech',
    //   submenu: [
    //     {
    //       role: 'startspeaking'
    //     },
    //     {
    //       role: 'stopspeaking'
    //     }
    //   ]
    // }
  ]
})
AppMenu.Navigation = () => ({
  label: '导航',
  value: 'Navigation',
  submenu: [
    {
      label: '播放 / Play',
      click (item, focusedWindow, event) {
        ipcRenderer.send('togglePlayback')
      }
    },
    {
      type: 'separator'
    },
    {
      // commented out. we don't route this through the menu.
      // accelerator: keystrokeFor('menu:navigation:previous-board'),
      label: '上一个 / Previous Board',
      click (item, focusedWindow, event) {
        ipcRenderer.send('goPreviousBoard')
      }
    },
    {
      // commented out. we don't route this through the menu.
      // accelerator: keystrokeFor('menu:navigation:next-board'),
      label: '下一个 / Next Board',
      click (item, focusedWindow, event) {
        ipcRenderer.send('goNextBoard')
      }
    },
    {
      // NOTE for some reason, this accelerator does not trigger a click (CmdOrCtrl+Left)
      accelerator: keystrokeFor('menu:navigation:previous-scene'),
      label: '第一个 / Previous Scene',
      click (item, focusedWindow, event) {
        ipcRenderer.send('previousScene')
      }
    },
    {
      // NOTE for some reason, this accelerator does not trigger a click (CmdOrCtrl+Right)
      accelerator: keystrokeFor('menu:navigation:next-scene'),
      label: '最后一个 / Next Scene',
      click (item, focusedWindow, event) {
        ipcRenderer.send('nextScene')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Stop All Board Audio',
      // NOTE: menu won't send this, we have to listen for it explicitly in the key handler
      accelerator: keystrokeFor('menu:navigation:stop-all-sounds'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('stopAllSounds')
      }
    },
    {
      label: 'Toggle speaking',
      type: 'checkbox',
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleSpeaking')
      }
    },
    {
      label: 'Audition Board Audio',
      type: 'checkbox',
      accelerator: keystrokeFor('menu:navigation:toggle-audition'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleAudition')
      }
    }
  ]
})
AppMenu.Boards = () => ({
  label: '故事板',
  submenu: [
    {
      accelerator: keystrokeFor('menu:boards:new-board'),
      label: '创建新故事板 / New Board',
      click (item, focusedWindow, event) {
        ipcRenderer.send('newBoard', 1)
      }
    },
    {
      accelerator: keystrokeFor('menu:boards:new-board-before'),
      label: '在当前位置前创建 / New Board Before',
      click (item, focusedWindow, event) {
        ipcRenderer.send('newBoard', -1)
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor('menu:boards:delete-boards'),
      label: '删除当前故事板 / Delete Board(s)',
      click (item, focusedWindow, event) {
        ipcRenderer.send('deleteBoards')
      }
    },
    {
      accelerator: keystrokeFor('menu:boards:delete-boards-go-forward'),
      label: '删除前一个故事板 / Delete Board(s) - Go Forward',
      click (item, focusedWindow, event) {
        ipcRenderer.send('deleteBoards', 1)
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor('menu:boards:duplicate'),
      label: '重复 / Duplicate Board',
      click (item, focusedWindow, event) {
        ipcRenderer.send('duplicateBoard')
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor('menu:boards:reorder-left'),
      label: '往前移动 / Reorder Left',
      click (item, focusedWindow, event) {
        ipcRenderer.send('reorderBoardsLeft')
      }
    },
    {
      accelerator: keystrokeFor('menu:boards:reorder-right'),
      label: '往后移动 / Reorder Right',
      click (item, focusedWindow, event) {
        ipcRenderer.send('reorderBoardsRight')
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor("menu:boards:add-audio-file"),
      label: '添加音频文件 / Add Audio File…',
      click (item, focusedWindow, event) {
        ipcRenderer.send('addAudioFile')
      }
    },
    {
      accelerator: keystrokeFor("menu:boards:toggle-new-shot"),
      label: '转换为镜头 / Toggle Board as New Shot',
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleNewShot')
      }
    }
  ]
})
AppMenu.Tools = () => ({
  label: '工具',
  submenu: [
    {
      accelerator: keystrokeFor('menu:tools:light-pencil'),
      label: 'Light Pencil',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'light-pencil')
      }
    },
    {
      accelerator: keystrokeFor('menu:tools:brush'),
      label: 'Brush',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'brush')
      }
    },
    {
      accelerator: keystrokeFor('menu:tools:tone'),
      label: 'Tone',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'tone')
      }
    },
    {
      accelerator: keystrokeFor('menu:tools:pencil'),
      label: 'Pencil',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'pencil')
      }
    },
    {
      accelerator: keystrokeFor('menu:tools:pen'),
      label: 'Pen',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'pen')
      }
    },
    {
      accelerator: keystrokeFor('menu:tools:note-pen'),
      label: 'Note Pen',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'note-pen')
      }
    },
    {
      accelerator: keystrokeFor('menu:tools:eraser'),
      label: 'Eraser',
      click (item, focusedWindow, event) {
        ipcRenderer.send('setTool', 'eraser')
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor("menu:tools:clear-all-layers"),
      label: 'Clear All Layers',
      click (item, focusedWindow, event) {
        ipcRenderer.send('clear')
      }
    },
    {
      accelerator: keystrokeFor("menu:tools:clear-layer"),
      label: 'Clear Layer',
      click (item, focusedWindow, event) {
        ipcRenderer.send('clear', true)
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor('drawing:brush-size:dec'),
      label: 'Smaller Brush',
      click (item, focusedWindow, event) {
        ipcRenderer.send('brushSize', -1)
      }
    },
    {
      accelerator: keystrokeFor('drawing:brush-size:inc'),
      label: 'Larger Brush',
      click (item, focusedWindow, event) {
        ipcRenderer.send('brushSize', 1)
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor("menu:tools:palette-color-1"),
      label: 'Use Palette Color 1',
      click (item, focusedWindow, event) {
        ipcRenderer.send('useColor', 1)
      }
    },
    {
      accelerator: keystrokeFor("menu:tools:palette-color-2"),
      label: 'Use Palette Color 2',
      click (item, focusedWindow, event) {
        ipcRenderer.send('useColor', 2)
      }
    },
    {
      accelerator: keystrokeFor("menu:tools:palette-color-3"),
      label: 'Use Palette Color 3',
      click (item, focusedWindow, event) {
        ipcRenderer.send('useColor', 3)
      }
    },
    {
      type: 'separator'
    },
    {
      accelerator: keystrokeFor("menu:tools:flip-horizontal"),
      label: '水平翻转 / Flip Horizontal',
      click (item, focusedWindow, event) {
        ipcRenderer.send('flipBoard')
      }
    },
    {
      label: '垂直翻转 / Flip Vertical',
      click (item, focusedWindow, event) {
        ipcRenderer.send('flipBoard', true)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '镜头生成器 / Shot Generator',
      click (item, focusedWindow, event) {
        ipcRenderer.send('revealShotGenerator')
      }
    },
    {
      label: '在 PhotoShop 中编辑 / Edit in Photoshop',
      accelerator: keystrokeFor('menu:tools:edit-in-photoshop'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('openInEditor')
      }
    }
  ]
})
AppMenu.View = () => ({
  label: '视图',
  submenu: [
    {
      label: '顺序切换显示模式 / Cycle View Mode',
      accelerator: keystrokeFor('menu:view:cycle-view-mode'),
      click (item, focusedWindow, event) {
        // NOTE this is only triggered by menu directly, not by key
        ipcRenderer.send('cycleViewMode', +1)
      }
    },
    {
      label: '逆序切换显示模式 / Reverse Cycle View Mode',
      accelerator: keystrokeFor('menu:view:cycle-view-mode-reverse'),
      click (item, focusedWindow, event) {
        // NOTE this is only triggered by menu directly, not by key
        ipcRenderer.send('cycleViewMode', -1)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '显示网格 / Toggle Grid Guide',
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleGuide', 'grid')
      }
    },
    {
      label: '显示中心线 / Toggle Center Guide',
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleGuide', 'center')
      }
    },
    {
      label: '显示三分线 / Toggle Thirds Guide',
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleGuide', 'thirds')
      }
    },
    // {
    //   label: 'Toggle 3D Guide',
    //   click (item, focusedWindow, event) {
    //     ipcRenderer.send('toggleGuide', 'perspective')
    //   }
    // },
    {
      label: '显示描边 / Toggle Onion Skin',
      accelerator: keystrokeFor('menu:view:onion-skin'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleOnionSkin')
      }
    },
    {
      label: '显示字幕说明 / Toggle Captions',
      accelerator: keystrokeFor('menu:view:toggle-captions'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleCaptions')
      }
    },
    {
      type: 'separator'
    },
    {
      label: '切换故事板/时间线模式 / Toggle Boards/Timeline Mode',
      accelerator: keystrokeFor('menu:view:toggle-timeline'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('toggleTimeline')
      }
    },
    {
      type: 'separator'
    },
    ...SubMenuFragments.View,
    {
      type: 'separator'
    },
    {
      label: '全屏模式 / Toggle Full Screen',
      accelerator: keystrokeFor("menu:view:toggle-full-screen"),
      role: 'togglefullscreen'
    },
    {
      label: '实际大小 / Actual Size',
      accelerator: keystrokeFor("menu:view:zoom-reset"),
      click (item, focusedWindow, event) {
        ipcRenderer.send('zoomReset')
      }
    },
    {
      label: '放大 / Zoom In',
      accelerator: keystrokeFor("menu:view:zoom-in"),
      click (item, focusedWindow, event) {
        ipcRenderer.send('zoomIn')
      }
    },
    {
      label: '缩小 / Zoom Out',
      accelerator: keystrokeFor("menu:view:zoom-out"),
      click (item, focusedWindow, event) {
        ipcRenderer.send('zoomOut')
      }
    }
  ]
})
AppMenu.window = () => {
  let extension = process.platform == 'darwin'
    ? [
        {
          label: '缩放 / Zoom',
          role: 'zoom'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          role: 'front'
        }
      ]
    : []

  return {
    label: '窗口',
    role: 'window',
    submenu: [
      ...SubMenuFragments.windowing,
      ...extension
    ]
  }
}
AppMenu.help = () => ({
  label: '帮助',
  role: 'help',
  submenu: [
    ...SubMenuFragments.help,
    {
      type: 'separator'
    },
    {
      label: 'Key Commands…',
      accelerator: keystrokeFor('menu:help:show-key-commands'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('showKeyCommands')
      }
    },
    {
      label: 'Show me a story tip!',
      accelerator: keystrokeFor('menu:help:show-story-tip'),
      click (item, focusedWindow, event) {
        ipcRenderer.send('showTip')
      }
    }
  ]
})

// macOS only
AppMenu.about = (options = { includePreferences: false }) => {
  if (process.platform !== 'darwin')
    return []

  let optionalPreferences = options.includePreferences
    ? [
        {
          type: 'separator'
        },
        {
          label: 'Preferences',
          accelerator: keystrokeFor('menu:about:preferences'),
          click: () => ipcRenderer.send('preferences')
        }
      ]
    : []

  return [
    {
      label: app.getName(),
      submenu: [
        {
          role: 'about',
        },
        ...optionalPreferences,
        // {
        //   label: 'Registration…',
        //   click: () => ipcRenderer.send('registration:open')
        // },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    }
  ]
}

const template = [
  ...AppMenu.about({ includePreferences: true }),
  AppMenu.File(),
  AppMenu.Edit(),
  AppMenu.Navigation(),
  AppMenu.Boards(),
  AppMenu.Tools(),
  AppMenu.View(),
  AppMenu.window(),
  AppMenu.help()
]

const welcomeTemplate = [
  ...AppMenu.about({ includePreferences: false }),
  {
    label: '文件',
    submenu: [
      {
        label: '打开 / Open…',
        accelerator: keystrokeFor('menu:file:open'),
        click (item, focusedWindow, event) {
          ipcRenderer.send('openDialogue')
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      // {role: 'undo'},
      // {role: 'redo'},
      // {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      // {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: '视图',
    submenu: [
      ...SubMenuFragments.View
    ]
  },
  {
    role: 'window',
    submenu: [
      ...SubMenuFragments.windowing
    ]
  },
  {
    role: 'help',
    submenu: [
      ...SubMenuFragments.help
    ]
  }
]

const shotGeneratorMenu = [
  ...AppMenu.about({ includePreferences: false }),
  {
    label: '文件',
    submenu: [
      {
        label: 'Open…',
        accelerator: keystrokeFor('menu:file:open'),
        click (item, focusedWindow, event) {
          ipcRenderer.send('openDialogue')
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      // {role: 'undo'},
      // {role: 'redo'},
      // {type: 'separator'},

      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      
      {
        accelerator: 'CommandOrControl+d',
        label: '重复 / Duplicate',
        click () {
          ipcRenderer.send('shot-generator:object:duplicate')
        }
      },
      
      // {role: 'pasteandmatchstyle'},
      {role: 'delete'},

      {role: 'selectall'}
    ]
  },
  {
    label: '视图',
    submenu: [
      ...SubMenuFragments.View,
      {
        label: 'Enable FPS Meter',
        type: 'checkbox',
        click (item, focusedWindow, event) {
          ipcRenderer.send('shot-generator:menu:view:fps-meter')
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      ...SubMenuFragments.windowing
    ]
  },
  {
    role: 'help',
    submenu: [
      ...SubMenuFragments.help
    ]
  }
]

const setWelcomeMenu = () => {
  let welcomeMenuInstance = Menu.buildFromTemplate(welcomeTemplate)
  Menu.setApplicationMenu(welcomeMenuInstance)
}

const setMenu = () => {
  let menuInstance = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menuInstance)
}

const setShotGeneratorMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(shotGeneratorMenu))
}

const setEnableAudition = value =>
  Menu
    .getApplicationMenu().items.find(n => n.value === 'Navigation')
    .submenu.items.find(n => n.label === 'Audition Board Audio')
    .checked = value

module.exports = {
  setWelcomeMenu,
  setShotGeneratorMenu,
  setMenu,

  setEnableAudition
}
