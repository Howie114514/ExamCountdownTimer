import { IoIosColorFill, IoIosColorPalette, IoIosSettings, IoIosTime } from 'react-icons/io'
import ExamListDialog from './components/settings/examListDialog'
import DateInput from './components/settings/dateInput'
import Button from './components/settings/button'
import { PiExam } from 'react-icons/pi'
import ColorInput from './components/settings/colorInput'
import { VscDebug } from 'react-icons/vsc'
import { useRef } from 'react'
import Switch from './components/settings/switch'
import { CiLogin } from 'react-icons/ci'
import Range from './components/settings/range'
import { MdOutlineFormatSize } from 'react-icons/md'

export default function () {
  let dialog: undefined | HTMLDialogElement = undefined
  return (
    <>
      <ExamListDialog
        onReady={(e) => {
          dialog = e
        }}
      ></ExamListDialog>
      <h5>
        <IoIosSettings className="icon"></IoIosSettings>通用
      </h5>
      <DateInput
        cfgKey="zkDate"
        label={
          <>
            <IoIosTime className="icon"></IoIosTime>中考时间
          </>
        }
        defaultValue="2025-1-1"
      ></DateInput>
      <Button
        label={
          <>
            <PiExam className="icon"></PiExam>其他考试
          </>
        }
        onClick={(ev) => {
          dialog?.showModal()
        }}
      >
        管理
      </Button>
      <Switch
        onChange={(e) => {
          window.electron.ipcRenderer.send('switch-autorun', e)
        }}
        label={
          <>
            <CiLogin className="icon"></CiLogin>开机自启
          </>
        }
        cfgKey="autorun"
        defaultValue="true"
      ></Switch>
      <h5>
        <IoIosColorPalette className="icon"></IoIosColorPalette>外观
      </h5>
      <ColorInput
        cfgKey="color"
        label={
          <>
            <IoIosColorFill className="icon"></IoIosColorFill>字体颜色
          </>
        }
        defaultValue="#ffffff"
      ></ColorInput>
      <Range
        label={
          <>
            <MdOutlineFormatSize className="icon"></MdOutlineFormatSize>字体大小
          </>
        }
        min={1}
        max={80}
        cfgKey="fontSize"
        defaultValue="20"
        dataList={[
          ['非常小', 1],
          ['正常', 20],
          ['中等', 40],
          ['偏大', 60],
          ['巨大', 80]
        ]}
      ></Range>
      <h5>
        <VscDebug className="icon"></VscDebug>调试信息
      </h5>
      <small>
        Nodejs版本:{window.electron.process.versions.node}/electron版本:
        {window.electron.process.versions.electron}/chrome版本:
        {window.electron.process.versions.chrome}
      </small>
    </>
  )
}
