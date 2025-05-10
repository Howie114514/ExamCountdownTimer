import { calcDays, today } from '@renderer/utils'
import { ReactNode, useEffect, useId, useRef, useState } from 'react'
import { IoIosAdd } from 'react-icons/io'
import { LiaFileImportSolid } from 'react-icons/lia'
import { TiExport } from 'react-icons/ti'
import { TiTick } from 'react-icons/ti'
import { IoIosRemoveCircle } from 'react-icons/io'
import { CiEdit } from 'react-icons/ci'
import { IoIosRemove } from 'react-icons/io'
import { MdCleaningServices } from 'react-icons/md'
import showEditExamDialog from '../dialogs/editExam'
import { Exam } from '@renderer/types'
import { v4 } from 'uuid'
import { showConfirmDialog } from '../dialogs/confirmDialog'

export function ExamListItem(props: {
  date: string
  name: string
  uuid: string
  rmCallback(): void
  editCallback(): void
}) {
  return (
    <div className="item">
      <p>
        <span>{props.name}</span>&nbsp;
        <span className="date">{props.date}&nbsp;</span>
        {calcDays(new Date(props.date), today()) <= 0 ? (
          <span className="outdated">
            <TiTick className="icon" style={{ color: '#fff', paddingRight: 0 }}></TiTick>已完成
          </span>
        ) : (
          ''
        )}
      </p>
      <div className="button-box">
        <button
          title="删除"
          onClick={() => {
            showConfirmDialog({
              title: '确认',
              text: `你确定要删除考试${props.name}吗？`,
              callback: () => {
                props.rmCallback()
              }
            })
          }}
        >
          <IoIosRemove size="30px"></IoIosRemove>
        </button>
        <button title="编辑" onClick={props.editCallback}>
          <CiEdit size="25px"></CiEdit>
        </button>
      </div>
    </div>
  )
}

export default ((p) => {
  let id = useId()
  let ref = useRef<HTMLDialogElement | null>(null)
  let [exams, setExams] = useState<Record<string, Exam>>(JSON.parse(localStorage['exams'] ?? '{}'))
  useEffect(() => {
    p.onReady(ref.current as HTMLDialogElement)
  }, [])
  useEffect(() => {
    localStorage['exams'] = JSON.stringify(exams)
  }, [exams])
  return (
    <dialog ref={ref} id={id}>
      <h4>考试列表</h4>
      <div className="list">
        {Object.values(exams).map((exam) => {
          return (
            <ExamListItem
              name={exam.name}
              date={exam.date}
              uuid={exam.uuid}
              rmCallback={() => {
                setExams(() => {
                  let e = Object.assign({}, exams)
                  delete e[exam.uuid]
                  return e
                })
              }}
              editCallback={() => {
                showEditExamDialog({
                  create: false,
                  callback(_exam) {
                    setExams(() => {
                      let e = Object.assign({}, exams)
                      e[exam.uuid] = _exam
                      return e
                    })
                  },
                  uuid: exam.uuid,
                  exam: exam
                })
              }}
            ></ExamListItem>
          )
        })}
      </div>
      <div className="el-button-box">
        <button
          title="添加考试"
          onClick={() => {
            showEditExamDialog({
              create: true,
              uuid: v4(),
              callback(exam) {
                setExams({ ...exams, [exam.uuid]: exam })
              }
            })
          }}
        >
          <IoIosAdd size="30px"></IoIosAdd>
        </button>
        <button
          title="清理已完成的考试"
          onClick={() => {
            showConfirmDialog({
              title: '确认',
              text: '你确定要移除所有已完成的考试吗？',
              callback() {
                let _exams = Object.assign({}, exams)
                let i = 0
                Object.values(exams).forEach((e) => {
                  if (new Date(e.date) < new Date()) {
                    delete _exams[e.uuid]
                    i++
                  }
                })
                setExams(_exams)
                showConfirmDialog({ title: '完成', text: `已清除${i}个过期考试`, callback() {} })
              }
            })
          }}
        >
          <MdCleaningServices size="23px"></MdCleaningServices>
        </button>
        <button
          title="导入列表"
          onClick={async () => {
            let exams: string | false = await window.electron.ipcRenderer.invoke('import-exams')
            if (exams) {
              let e = JSON.parse(exams)
              if (e._format != 'zkdjs') {
                showConfirmDialog({
                  title: '错误',
                  text: `格式不正确`,
                  callback() {}
                })
                return
              } else
                showConfirmDialog({
                  title: '确认',
                  text: `导入的日期数据会覆盖当前日期数据。你确定要导入文件中的${Object.keys(e).length - 1}个数据吗？`,
                  callback() {
                    delete e['_format']
                    setExams(e)
                  }
                })
            }
          }}
        >
          <LiaFileImportSolid size="23px"></LiaFileImportSolid>
        </button>
        <button
          title="导出列表"
          onClick={() => {
            let _exams: any = Object.assign({}, exams)
            _exams['_format'] = 'zkdjs'
            window.electron.ipcRenderer.send('export-exams', JSON.stringify(_exams))
          }}
        >
          <TiExport size="23px"></TiExport>
        </button>
      </div>
      <div className="closebtn-container">
        <button
          className="closebtn"
          onClick={() => {
            ref.current?.classList.add('fadeout')
            setTimeout(() => {
              ref.current?.classList.remove('fadeout')
              ref.current?.close()
            }, 90)
          }}
        >
          关闭
        </button>
      </div>
    </dialog>
  )
}) as React.FC<{ onReady(element: HTMLDialogElement): void }>
