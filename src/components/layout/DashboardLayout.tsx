import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Button } from '@/components/ui/button'
import { Bell, LogOut, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  // 🔥 초기 렌더링에서 role=null → staff로 잘못 인식되는 것을 방지
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    const storedRole = localStorage.getItem('role') // 🔥 통일된 key

    if (!token || !storedUsername || !storedRole) {
      navigate('/', { replace: true })
      return
    }

    setUsername(storedUsername)
    setRole(storedRole)

    // 이제 렌더링해도 됨
    setReady(true)
  }, [navigate])

  // 🔥 초기화 완료 전에는 아무것도 렌더링하지 않음
  if (!ready) return null

  const handleLogout = () => {
    localStorage.clear()
    toast({
      title: '로그아웃 완료',
      description: '안전하게 로그아웃되었습니다.',
    })
    navigate('/')
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="-ml-2" />

              <div className="flex-1"></div>

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{username}</p>
                  <p className="text-xs text-muted-foreground">
                    {role === 'owner' ? '관리자' : '근무자'}
                  </p>
                </div>

                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
