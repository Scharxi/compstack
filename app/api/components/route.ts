import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const components = await prisma.component.findMany({
      include: {
        maintenanceHistory: true,
      },
    });
    return NextResponse.json(components);
  } catch (error) {
    console.error('Failed to fetch components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const component = await prisma.component.create({
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
    console.error('Failed to create component:', error);
    return NextResponse.json(
      { error: 'Failed to create component' },
      { status: 500 }
    );
  }
} 