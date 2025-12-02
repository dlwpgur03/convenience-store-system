import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Store, Lock, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 기존 임시 로그인 로직
    setTimeout(() => {
      if (username && password) {
        const userRole = username === '사장님' ? 'owner' : 'staff'
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('username', username)

        toast({
          title: '로그인 성공',
          description: `${username}님 환영합니다.`,
        })

        if (userRole === 'owner') {
          navigate('/owner/dashboard')
        } else {
          navigate('/staff/dashboard')
        }
      } else {
        toast({
          title: '로그인 실패',
          description: '아이디와 비밀번호를 입력해주세요.',
          variant: 'destructive',
        })
      }

      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                편의점 관리 시스템
              </CardTitle>
              <CardDescription className="text-base mt-2">
                로그인하여 시작하세요
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            {/* 회원가입 + 비밀번호 찾기 영역 */}
            <div className="mt-6 flex items-center justify-between text-sm text-primary">
              <button
                type="button"
                className="hover:underline"
                onClick={() => navigate('/register')}
              >
                회원가입
              </button>

              <button
                type="button"
                className="hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                비밀번호 찾기
              </button>
            </div>

            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              테스트: 사장님(owner) / 기타(staff)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
