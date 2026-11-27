import { NextResponse } from 'next/server';
import { BLOGS } from '@/lib/data';

export async function GET() {
  const blogs = BLOGS.map(b => ({
    slug: b.slug,
    title: b.title,
    preview: b.preview,
    createdAt: new Date(b.date),
    modifiedAt: new Date(b.date),
  }));
  return NextResponse.json({ blogs });
}
