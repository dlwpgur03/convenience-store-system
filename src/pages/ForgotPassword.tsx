import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post('/auth/forgot-password', { email })

      toast({
        title: '메일 발송 완료',
        description: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
      })
    } catch (error: any) {
      toast({
        title: '요청 실패',
        description: error?.response?.data?.message || '다시 시도해주세요.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>비밀번호 찾기</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>등록된 이메일</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button className="w-full">요청하기</Button>

            <Button
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

export default ForgotPassword
