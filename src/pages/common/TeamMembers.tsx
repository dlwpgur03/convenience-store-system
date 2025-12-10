'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  github: string
  portfolio: string
  avatar?: string
}

const extractGitHubUsername = (url: string): string => {
  const parts = url.split('github.com/')
  return parts[1]?.replace(/\/$/, '') ?? ''
}

const TeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    const data: TeamMember[] = [
      {
        name: '이제혁',
        role: '팀장',
        github: 'https://github.com/dlwpgur03',
        portfolio: 'https://dnpqtjqjqhdksvmfhrmfoaldrodlsrhkwp.vercel.app',
      },
      {
        name: '김민우',
        role: '팀원',
        github: 'https://github.com/vmaca123',
        portfolio:
          'https://ft-kportfolio-qk9k-8fx6t6jo8-vmaca123s-projects.vercel.app/',
      },
      {
        name: '김휘제',
        role: '팀원',
        github: 'https://github.com/Kim-HwiJe',
        portfolio: 'https://hwije-portfolio.vercel.app/',
      },
      {
        name: '박용담',
        role: '팀원',
        github: 'https://github.com/ydam113',
        portfolio: 'https://nextjs-portfolio-flax-delta.vercel.app/',
      },
      {
        name: '양유상',
        role: '팀원',
        github: 'https://github.com/yangyu0330',
        portfolio: 'https://portfolio-ai-alpha-eight.vercel.app/',
      },
    ]

    const updatedData = data.map((member) => {
      const username = extractGitHubUsername(member.github)
      return {
        ...member,
        avatar: username ? `https://github.com/${username}.png` : undefined,
      }
    })

    setMembers(updatedData)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">팀원 소개</h1>
        <p className="text-muted-foreground mt-1">
          알바가기 싫조의 팀원들입니다 🚀
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            👥 Team Members
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, index) => (
            <Card
              key={index}
              className="p-4 flex items-center gap-4 hover:bg-muted/40 transition"
            >
              {/* ⭐ GitHub Profile Image */}
              {member.avatar && (
                <img
                  src={member.avatar}
                  alt={`${member.name} avatar`}
                  className="w-16 h-16 rounded-full border object-cover"
                />
              )}

              <div className="flex-1 flex flex-col gap-2">
                <h2 className="font-bold text-lg">{member.name}</h2>
                <Badge className="w-fit" variant="secondary">
                  {member.role}
                </Badge>

                <div className="flex gap-2 mt-1">
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <a href={member.github} target="_blank" rel="noreferrer">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <a href={member.portfolio} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Portfolio
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default TeamMembers
