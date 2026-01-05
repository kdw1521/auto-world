# AutoWorld 자동화 커뮤니티

사무업무 자동화를 공유하고 공감받는 커뮤니티 서비스입니다. 이메일/비밀번호 로그인 기반으로 글을 작성하고, 좋아요/댓글을 통해 피드백을 주고받습니다.

## 주요 기능

- 이메일/비밀번호 로그인 및 회원가입
- Tiptap 기반 글 작성, 조회수/좋아요, 댓글/대댓글(1단계)
- 공지사항, 버그/요청 등록, 문의하기
- 마이페이지에서 닉네임 변경 및 요청 답변 확인
- 토스트 알림, Vercel Analytics, SEO 메타데이터/사이트맵/robots 제공

## 기술 스택

- Next.js 16 (App Router) + React 19
- Supabase (Auth + Database + RLS)
- shadcn/ui + Tailwind CSS
- Tiptap Editor

## 시작하기

1. 의존성 설치

```bash
npm install
```

2. `.env.local` 설정

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain
```

3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인합니다.

## 배포

- Vercel에 배포하고 환경변수를 동일하게 등록합니다.
- `NEXT_PUBLIC_SITE_URL`은 실제 도메인으로 설정해야 sitemap/OG가 정상 생성됩니다.
