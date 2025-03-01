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
        id: decodeURIComponent(resolvedParams.id),
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
    
    // Handle maintenance protocol if present
    if (data.newMaintenanceProtocol) {
      const { newMaintenanceProtocol, maintenanceHistory, ...componentData } = data;
      
      try {
        // Create the maintenance protocol
        await prisma.maintenanceProtocol.create({
          data: {
            date: new Date(newMaintenanceProtocol.date),
            completedTasks: newMaintenanceProtocol.completedTasks,
            notes: newMaintenanceProtocol.notes,
            componentId: resolvedParams.id
          }
        });

        // Update the component with the new last maintenance date
        const component = await prisma.component.update({
          where: {
            id: resolvedParams.id,
          },
          data: {
            ...componentData,
            specifications: componentData.specifications || {},
            lastMaintenanceDate: new Date()
          },
          include: {
            maintenanceHistory: {
              orderBy: {
                date: 'desc'
              }
            }
          },
        });
        
        return NextResponse.json(component);
      } catch (error) {
        console.error('Failed to save maintenance protocol:', error);
        return NextResponse.json(
          { error: 'Failed to save maintenance protocol' },
          { status: 500 }
        );
      }
    }

    // Regular component update without maintenance
    const { maintenanceHistory, ...updateData } = data;
    const component = await prisma.component.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        ...updateData,
        specifications: updateData.specifications || {},
      },
      include: {
        maintenanceHistory: {
          orderBy: {
            date: 'desc'
          }
        }
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const decodedId = decodeURIComponent(resolvedParams.id);

    // First delete all maintenance protocols for this component
    await prisma.maintenanceProtocol.deleteMany({
      where: {
        componentId: decodedId
      }
    });

    // Then delete the component
    const component = await prisma.component.delete({
      where: {
        id: decodedId
      }
    });

    return NextResponse.json(component);
  } catch (error) {
    console.error('Failed to delete component:', error);
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    );
  }
} 