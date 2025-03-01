import { NextResponse } from 'next/server';
import { fetchLists, createList } from '@/app/services/lists';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lists = await fetchLists();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Failed to fetch lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const list = await createList({ name, description });
    return NextResponse.json(list);
  } catch (error) {
    console.error('Failed to create list:', error);
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    );
  }
} 