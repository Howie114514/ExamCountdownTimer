import { MutableRefObject, useEffect, useReducer, useRef } from 'react'
import ReactDOM from 'react-dom/client'

function Confirm(props: {
  title: string
  text: string
  callback: () => void
  dialog: HTMLDialogElement
}) {
  return (
    <div className="confirm">
      <p className="title">{props.title}</p>
      <p>{props.text}</p>
      <div className="msg-button-box">
        <button onClick={() => props.dialog.close()}>取消</button>
        <button
          onClick={() => {
            props.callback()
            props.dialog.close()
          }}
        >
          确认
        </button>
      </div>
    </div>
  )
}

export function showConfirmDialog(props: { title: string; text: string; callback: () => void }) {
  const dialog = document.createElement('dialog')
  dialog.className = 'confirm'
  document.body.append(dialog)
  dialog.showModal()
  let root = ReactDOM.createRoot(dialog)
  root.render(<Confirm {...props} dialog={dialog}></Confirm>)
  dialog.addEventListener('close', () => {
    root.unmount()
    setTimeout(() => dialog.remove(), 1)
  })
}
