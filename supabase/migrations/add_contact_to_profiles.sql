-- profiles 테이블에 contact 컬럼 추가
-- Supabase 대시보드 → SQL Editor 에서 실행하세요.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS contact_email   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_kakao   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_line    TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_wechat  TEXT DEFAULT '';
