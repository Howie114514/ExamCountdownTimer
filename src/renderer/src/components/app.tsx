import { useEffect, useState } from 'react'
import { Days } from './days'
import { asDate, calcDays, settings, today } from '@renderer/utils'
import { Exam } from '@renderer/types'

export default function () {
  const [zkDate, setZkDate] = useState(settings.readDate('zkDate'))
  const [color, setColor] = useState(settings.read('color', '#ffffff'))
  const [exams, setExams] = useState<Record<string, Exam>>(
    JSON.parse(localStorage['exams'] ?? '{}')
  )
  const [fontSize, setFontSize] = useState(settings.readInt('fontSize', 20))
  useEffect(() => {
    window.addEventListener('storage', (ev) => {
      if (ev.key == 'zkDate') {
        setZkDate(settings.readDate('zkDate'))
      }
      if (ev.key == 'color') {
        setColor(settings.read('color', '#ffffff'))
      }
      if (ev.key == 'exams') {
        setExams(JSON.parse(ev.newValue ?? '{}'))
      }
      if (ev.key == 'fontSize') {
        setFontSize(settings.readInt('fontSize'))
      }
    })
  }, [])
  return (
    <Days
      zkdate={zkDate}
      fontSize={fontSize}
      color={color}
      nextExam={(() => {
        let next: undefined | Exam = undefined
        Object.values(exams).forEach((e) => {
          if (
            calcDays(asDate(new Date(e.date)), today()) > 0 &&
            (!next || asDate(new Date(e.date)) > new Date(next?.date))
          ) {
            next = e
          }
        })
        return next
      })()}
    ></Days>
  )
}
