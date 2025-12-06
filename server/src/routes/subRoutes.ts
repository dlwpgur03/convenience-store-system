import { Router } from 'express'
import { auth } from '../middleware/auth'
import {
  requestSub,
  approveRecruit,
  acceptBySub,
  finalApprove,
  getSubListForOwner,
} from '../controllers/sub.controller'

const router = Router()

// 직원 → 대타 신청
router.post('/:scheduleId/request', auth, requestSub)

// 관리자 → 대타 모집 허가
router.patch('/owner/approve/:id', approveRecruit)

// 직원 → 대타 수락
router.patch('/accept/:id', acceptBySub)

// 관리자 → 최종 승인 (스케줄 교체)
router.patch('/owner/final/:id', finalApprove)

// 관리자 → 목록 조회 (Pending / Approved)
router.get('/owner', getSubListForOwner)

export default router
