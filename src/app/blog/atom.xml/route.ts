import { getFeedResponse } from '@/app/blog/feeds/feed'

export async function GET() {
  return getFeedResponse('atom.xml')
}
