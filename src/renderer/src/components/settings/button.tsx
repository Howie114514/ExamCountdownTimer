import { ReactNode, useId } from 'react'

export default (({ label, onClick: onclick, children }) => {
  let id = useId()
  return (
    <div className="settings-item-container">
      <label htmlFor={id}>{label}</label>
      <div className="item">
        <button id={id} onClick={onclick}>
          {children}
        </button>
      </div>
    </div>
  )
}) as React.FC<{
  label: string | ReactNode
  children?: ReactNode | string
  onClick?(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}>
