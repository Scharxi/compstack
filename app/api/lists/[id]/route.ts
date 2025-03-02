import { NextResponse } from 'next/server';
import { updateList, deleteList } from '@/app/services/lists';
import { auth } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, components } = body;

    // Validate input
    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { error: 'Name cannot be empty' },
        { status: 400 }
      );
    }

    if (components !== undefined && !Array.isArray(components)) {
      return NextResponse.json(
        { error: 'Components must be an array' },
        { status: 400 }
      );
    }

    const list = await updateList(params.id, { name, description, components });
    return NextResponse.json(list);
  } catch (error) {
    console.error('Failed to update list:', error);
    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteList(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete list:', error);
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    );
  }
} 