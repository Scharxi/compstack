import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const component = await prisma.component.findUnique({
      where: {
        id: resolvedParams.id,
      },
      include: {
        maintenanceHistory: true,
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error('Failed to fetch component:', error);
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const data = await request.json();
    const component = await prisma.component.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        ...data,
        specifications: data.specifications || {},
      },
      include: {
        maintenanceHistory: true,
      },
    });
    return NextResponse.json(component);
  } catch (error) {
    console.error('Failed to update component:', error);
    return NextResponse.json(
      { error: 'Failed to update component' },
      { status: 500 }
    );
  }
} 