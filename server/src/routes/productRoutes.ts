import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import Product from '../models/Product'

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { q, category } = req.query

    // 유통기한이 지난 상품은 DB 상 재고를 0으로 강제로 맞춰 일관성 유지
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await Product.updateMany(
      { expiryDate: { $lt: today }, stock: { $gt: 0 } },
      { $set: { stock: 0 } }
    )

    const filter: Record<string, any> = {
      $and: [
        { name: { $exists: true } },
        { name: { $ne: '' } },
        { name: { $ne: '이름 없음' } },
        { name: { $ne: null } },
      ],
    }

    if (category && category !== '전체') {
      filter.category = category
    }

    if (q) {
      filter.name = { $regex: q as string, $options: 'i' }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    console.error('상품 목록 로드 에러:', err)
    res.status(500).json({ message: '상품 목록 로드 실패' })
  }
})

// 재고 증감 (발주 승인 시 사용)
router.patch('/:id/stock', authMiddleware, async (req, res) => {
  try {
    const { quantity, expiryDate } = req.body
    const delta = Number(quantity)

    if (!Number.isFinite(delta) || delta <= 0) {
      return res.status(400).json({ message: '유효한 수량을 입력하세요.' })
    }

    const update: any = { $inc: { stock: delta } }
    if (expiryDate) {
      const parsed = new Date(expiryDate)
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ message: '유통기한 형식이 올바르지 않습니다.' })
      }
      update.$set = { expiryDate: parsed }
    }

    // $inc를 사용해 현재 재고가 없거나 NaN이어도 안전하게 증가시키고, 동시에 최신 값을 반환
    const updated = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })

    if (!updated) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }

    console.log(
      `✅ 재고 증가: ${updated.name || updated._id} +${delta} -> ${updated.stock}${
        expiryDate ? `, expiry -> ${updated.expiryDate?.toISOString?.().slice(0, 10)}` : ''
      }`
    )

    res.json(updated)
  } catch (err) {
    console.error('재고 업데이트 에러:', err)
    res.status(500).json({ message: '재고 업데이트 실패' })
  }
})

export default router
