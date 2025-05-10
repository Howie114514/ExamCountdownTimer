import { Exam } from '@renderer/types'
import React, { MutableRefObject, useId, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

type InputRef = MutableRefObject<HTMLInputElement | null>

function Edit(props: {
  create: boolean
  dialog: HTMLDialogElement
  uuid: string
  exam?: Exam
  callback(e: Exam): void
}) {
  let nameInput = useId()
  let dateInput = useId()
  let refs: Record<string, MutableRefObject<null | HTMLInputElement>> = {
    name: useRef(null),
    date: useRef(null)
  }
  let [isValid, setIsValid] = useState(true)
  function save() {
    let name = refs.name.current?.value ?? ''
    let date = refs.date.current?.value ?? ''
    if (!(date.length > 0 && name.length > 0)) {
      setIsValid(false)
      return false
    } else {
      props.callback({ uuid: props.uuid, date: date, name: name })
      return true
    }
  }
  return (
    <div className="edit-exam-container">
      <p>{props.create ? '添加考试' : '编辑考试'}</p>
      {isValid ? '' : <small className="invalid">请检查您填写的内容并使其合理。</small>}
      <label htmlFor={nameInput}>名字</label>
      <input id={nameInput} ref={refs.name} defaultValue={props.exam?.name} type="text"></input>
      <label htmlFor={dateInput}>日期</label>
      <input id={dateInput} type="date" ref={refs.date} defaultValue={props.exam?.date}></input>
      <br></br>
      <div className="msg-button-box">
        <button
          onClick={() => {
            props.dialog.close()
          }}
        >
          取消
        </button>
        <button
          onClick={() => {
            save() ? props.dialog.close() : undefined
          }}
        >
          {props.create ? '添加' : '保存'}
        </button>
      </div>
    </div>
  )
}

export default function showEditExamDialog({
  create = false,
  callback,
  uuid,
  exam
}: {
  create: boolean
  callback(e: Exam): void
  uuid: string
  exam?: Exam
}) {
  let dialog = document.createElement('dialog')
  dialog.classList.add('edit-exam')
  document.body.append(dialog)
  dialog.showModal()
  let root = ReactDOM.createRoot(dialog)
  root.render(
    <Edit create={create} dialog={dialog} uuid={uuid} callback={callback} exam={exam}></Edit>
  )
  dialog.addEventListener('close', () => {
    root.unmount()
  })
}
