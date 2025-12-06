import { Request, Response } from 'express'
import Schedule from '../models/Schedule'
import dayjs from 'dayjs'

// 시간 겹침 체크
function isOverlap(
  date1: string,
  st1: string,
  et1: string,
  date2: string,
  st2: string,
  et2: string
) {
  const d1 = dayjs(date1)
  const d2 = dayjs(date2)

  const start1 = dayjs(`${d1.format('YYYY-MM-DD')} ${st1}`)
  let end1 = dayjs(`${d1.format('YYYY-MM-DD')} ${et1}`)
  if (!end1.isAfter(start1)) end1 = end1.add(1, 'day')

  const start2 = dayjs(`${d2.format('YYYY-MM-DD')} ${st2}`)
  let end2 = dayjs(`${d2.format('YYYY-MM-DD')} ${et2}`)
  if (!end2.isAfter(start2)) end2 = end2.add(1, 'day')

  return start1.isBefore(end2) && start2.isBefore(end1)
}

// 📌 스케줄 추가 API
export const addSchedule = async (req: Request, res: Response) => {
  try {
    const { staffId, date, startTime, endTime } = req.body
    if (!staffId || !date || !startTime || !endTime)
      return res.status(400).json({ message: '필수 값 누락' })

    // DB에는 YYYY-MM-DD 문자열로 저장
    const formattedDate = dayjs(date).format('YYYY-MM-DD')

    // 해당 날짜의 기존 스케줄 조회
    const exist = await Schedule.find({ staff: staffId, date: formattedDate })

    const conflict = exist.some((s) =>
      isOverlap(
        formattedDate,
        s.startTime,
        s.endTime,
        formattedDate,
        startTime,
        endTime
      )
    )
    if (conflict)
      return res.status(400).json({ message: '근무시간이 겹칩니다.' })

    const newSchedule = await Schedule.create({
      staff: staffId,
      date: formattedDate,
      startTime,
      endTime,
      status: 'scheduled',
    })

    res.json(newSchedule)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '스케줄 생성 실패' })
  }
}

// 📌 주간 스케줄 조회 API
export const getWeekSchedule = async (_req: Request, res: Response) => {
  try {
    const start = dayjs().startOf('week').format('YYYY-MM-DD')
    const end = dayjs().endOf('week').format('YYYY-MM-DD')

    const schedules = await Schedule.find({
      date: { $gte: start, $lte: end },
    })
      .populate('staff', 'name')
      .lean()

    const result = schedules.map((s: any) => ({
      _id: s._id,
      staffId: s.staff._id,
      staffName: s.staff.name,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
    }))

    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '조회 실패' })
  }
}
