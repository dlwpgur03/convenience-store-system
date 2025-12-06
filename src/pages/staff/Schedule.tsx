'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'

type MyShiftStatus = 'completed' | 'today' | 'off' | 'upcoming'

interface MyShift {
  _id: string
  date: string
  startTime: string
  endTime: string
  hours?: number
  status: MyShiftStatus
}

// 시간 계산
const calcHours = (startTime: string, endTime: string): number => {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)

  const start = sh * 60 + sm
  let end = eh * 60 + em
  if (end <= start) end += 24 * 60

  return (end - start) / 60
}

const Schedule = () => {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [substituteReason, setSubstituteReason] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<MyShift | null>(null)

  const [mySchedule, setMySchedule] = useState<MyShift[]>([])
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)

  // 나의 스케줄 불러오기
  const fetchMySchedule = async () => {
    try {
      setIsLoadingSchedule(true)
      const res = await api.get<MyShift[]>('/schedule/my')

      setMySchedule(
        res.data.map((item) => ({
          ...item,
          hours: item.hours ?? calcHours(item.startTime, item.endTime),
        }))
      )
    } catch {
      toast({
        title: '오류',
        description: '근무 스케줄 불러오기 실패',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingSchedule(false)
    }
  }

  useEffect(() => {
    fetchMySchedule()
  }, [])

  // 대타 요청 API
  const handleRequestSubstitute = async () => {
    if (!selectedShift) return
    if (!substituteReason.trim()) {
      toast({ title: '사유를 입력하세요', variant: 'destructive' })
      return
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}')

      await api.post(`/sub/${selectedShift._id}/request`, {
        requesterId: user._id,
        reason: substituteReason,
      })

      toast({
        title: '대타 요청 완료!',
        description: '대타 요청이 완료되었습니다.',
      })

      setSubstituteReason('')
      setSelectedShift(null)
      setIsDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast({
        title: '요청 실패',
        description: '대타 요청 중 오류 발생',
        variant: 'destructive',
      })
    }
  }

  const weeklyHours = mySchedule.reduce((acc, d) => acc + (d.hours ?? 0), 0)
  const upcomingShifts = mySchedule.filter(
    (d) => d.status === 'upcoming'
  ).length

  return (
    <div className="space-y-6">
      {/* 대타 요청 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>대타 요청</DialogTitle>
            <DialogDescription>
              선택한 근무에 대한 대타 사유를 입력하세요
            </DialogDescription>
          </DialogHeader>

          {selectedShift && (
            <div className="space-y-3">
              <p className="text-sm">
                📅 {new Date(selectedShift.date).toLocaleDateString()} •{' '}
                {selectedShift.startTime} - {selectedShift.endTime}
              </p>

              <Textarea
                placeholder="사유 입력"
                value={substituteReason}
                onChange={(e) => setSubstituteReason(e.target.value)}
              />

              <Button className="w-full" onClick={handleRequestSubstitute}>
                요청 보내기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 상단 요약 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex gap-2">
              <Clock className="w-4 h-4" /> 이번 주 근무
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weeklyHours}시간</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex gap-2">
              <CalendarIcon className="w-4 h-4" /> 다가오는 근무
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcomingShifts}일</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">대타 가능</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">0건</p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 내 스케줄 */}
        <Card>
          <CardHeader>
            <CardTitle>나의 근무 스케줄</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSchedule && (
              <p className="py-6 text-center">불러오는 중...</p>
            )}

            {mySchedule.map((day) => (
              <div key={day._id} className="p-3 border rounded-lg mb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {new Date(day.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.startTime} - {day.endTime}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedShift(day)
                      setIsDialogOpen(true)
                    }}
                  >
                    대타 요청
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 달력 */}
        <Card>
          <CardHeader>
            <CardTitle>달력 보기</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Schedule
