import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const Register = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: '오류',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      })
      return
    }

    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
      })

      toast({
        title: '회원가입 성공',
        description: '로그인 페이지로 이동합니다.',
      })

      navigate('/')
    } catch (error: any) {
      toast({
        title: '회원가입 실패',
        description: error?.response?.data?.message || '다시 시도해주세요.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <Label>아이디</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>이메일</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>비밀번호</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button className="w-full">회원가입</Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              로그인으로 돌아가기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
