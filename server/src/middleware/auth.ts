import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 🔹 기존 타입에 맞게 userId 유지
export interface UserRequest extends Request {
  user?: { userId: string; role: string }
}

// 🔹 기존 코드 유지 + 타입 호환
export const authMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 없습니다.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    if (typeof decoded === 'object' && 'userId' in decoded) {
      req.user = {
        userId: (decoded as any).userId,
        role: (decoded as any).role,
      }
    }

    next()
  } catch {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' })
  }
}

// 🔹 모든 로그인 사용자 접근 가능
export const auth = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token missing' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded as { userId: string; role: string }
    next()
  } catch {
    return res.status(401).json({ message: 'Token invalid' })
  }
}

// 🔹 사장 전용 API 접근 제한
export const ownerOnly = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Owner only' })
  }
  next()
}
