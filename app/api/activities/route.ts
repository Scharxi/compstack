import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        date: 'desc'
      },
      take: 100 // Begrenze auf die letzten 100 Aktivitäten
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validiere die erforderlichen Felder
    if (!data.type || !data.componentId || !data.componentName || !data.user || !data.details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const activity = await prisma.activity.create({
      data: {
        type: data.type,
        componentId: data.componentId,
        componentName: data.componentName,
        user: data.user,
        details: data.details
      }
    });
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 