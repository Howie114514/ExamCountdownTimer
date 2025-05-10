import { Exam } from '@renderer/types'
import { calcDays, today } from '@renderer/utils'

export const Days: React.FC<{ zkdate?: Date; nextExam?: Exam; color: string; fontSize: number }> = (
  props
) => {
  let notInitialized = (
    <div className="days-container" style={{ color: props.color }}>
      <h3>[中考倒计时]&nbsp;双击桌面图标或右键任务栏以进行初始化。</h3>
      <p>请确保您设置了一个有效的日期。</p>
    </div>
  )
  return props.zkdate && calcDays(props.zkdate, today()) >= 0 ? (
    <div
      className="days-container"
      style={{ color: props.color, fontSize: props.fontSize.toString() + 'pt' }}
    >
      <p>
        距离中考还有
        {calcDays(props.zkdate, today())}天
      </p>
      {props.nextExam ? (
        <p>
          下一次考试{props.nextExam.name}距今{calcDays(new Date(props.nextExam.date), today())}天
        </p>
      ) : (
        ''
      )}
    </div>
  ) : (
    notInitialized
  )
}
