import { settings } from '@renderer/utils'
import { ReactNode, useEffect, useId, useRef } from 'react'

export default (({ label, cfgKey: key, defaultValue, onChange }) => {
  let id = useId()
  let inputRef = useRef<HTMLInputElement | null>(null)
  let onchange = (e) => {
    localStorage.setItem(key, e.target.checked.toString())
    onChange(e.target.checked)
  }
  if (!localStorage[key]) {
    localStorage[key] = defaultValue
    onchange({ target: { checked: true } })
  }
  return (
    <div className="settings-item-container">
      <label htmlFor={id}>{label}</label>
      <div className="item">
        <input
          className="switch"
          id={id}
          type="checkbox"
          ref={inputRef}
          onChange={onchange}
          defaultChecked={localStorage[key] ?? defaultValue}
        ></input>
        <label htmlFor={id} className="_switch"></label>
      </div>
    </div>
  )
}) as React.FC<{
  label: string | ReactNode
  cfgKey: string
  defaultValue: string
  onChange(v: boolean): void
}>
