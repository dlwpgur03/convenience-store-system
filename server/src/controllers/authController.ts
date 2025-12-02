import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

// 🔐 회원가입
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        message: '아이디, 이메일, 비밀번호는 필수입니다.',
      })
    }

    // 아이디 중복 체크
    const existUser = await User.findOne({ username })
    if (existUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' })
    }

    // 이메일 중복 체크
    const existEmail = await User.findOne({ email })
    if (existEmail) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' })
    }

    const hashedPw = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPw,
      role: role || 'staff',
    })

    await newUser.save()

    return res.status(201).json({ message: '회원가입 완료!' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: '서버 오류' })
  }
}

// 🔐 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: '존재하지 않는 사용자입니다.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 틀렸습니다.' })
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    return res.json({
      message: '로그인 성공',
      token,
      role: user.role,
      username: user.username,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: '서버 오류' })
  }
}
