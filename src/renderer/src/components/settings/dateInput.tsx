import { ReactNode, useEffect, useId, useRef } from 'react'

export default (({ label, cfgKey: key, defaultValue }) => {
  let id = useId()
  let inputRef = useRef<HTMLInputElement | null>(null)
  if (!localStorage[key]) {
    localStorage[key] = defaultValue
  }
  return (
    <div className="settings-item-container">
      <label htmlFor={id}>{label}</label>
      <div className="item">
        <input
          id={id}
          type="date"
          ref={inputRef}
          defaultValue={localStorage[key] ?? defaultValue}
          onChange={(e) => {
            localStorage.setItem(key, e.target.value)
          }}
        ></input>
      </div>
    </div>
  )
}) as React.FC<{ label: string | ReactNode; cfgKey: string; defaultValue: string }>
