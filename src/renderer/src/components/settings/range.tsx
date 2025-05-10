import { ReactNode, useEffect, useId, useRef } from 'react'

export default (({ label, cfgKey: key, defaultValue, min, max, dataList }) => {
  let id = useId()
  let inputRef = useRef<HTMLInputElement | null>(null)
  if (!localStorage[key]) {
    localStorage[key] = defaultValue
  }
  let dlid = useId()
  return (
    <div className="settings-item-container">
      <label htmlFor={id}>{label}</label>
      <div className="item range">
        <datalist id={dlid}>
          {dataList?.map((d) => {
            return <option value={d[1]} label={d[0]}></option>
          })}
        </datalist>
        <input
          list={dlid}
          id={id}
          type="range"
          ref={inputRef}
          min={min}
          max={max}
          defaultValue={localStorage[key] ?? defaultValue}
          onChange={(e) => {
            localStorage.setItem(key, e.target.value)
          }}
        ></input>
      </div>
    </div>
  )
}) as React.FC<{
  label: string | ReactNode
  cfgKey: string
  defaultValue: string
  min: number
  max: number
  dataList?: [string, number][]
}>
