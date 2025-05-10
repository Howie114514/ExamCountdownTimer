import '../assets/settings.css'
import ReactDOM from 'react-dom/client'
import '../assets/main.css'
import React from 'react'
import DateInput from './components/settings/dateInput'
import Button from './components/settings/button'
import { IoIosSettings } from 'react-icons/io'
import { IoIosTime } from 'react-icons/io'
import { PiExam } from 'react-icons/pi'
import { VscDebug } from 'react-icons/vsc'
import { IoIosColorPalette } from 'react-icons/io'
import ColorInput from './components/settings/colorInput'
import { IoIosColorFill } from 'react-icons/io'
import ExamListDialog from './components/settings/examListDialog'
import SettingsMain from './settingsMain'

let dialog: null | HTMLDialogElement = null

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsMain></SettingsMain>
  </React.StrictMode>
)
