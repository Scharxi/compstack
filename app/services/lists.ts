import { prisma } from '@/lib/prisma';
import type { List } from '@/app/types/lists';

export async function fetchLists() {
  const lists = await prisma.list.findMany({
    include: {
      _count: {
        select: { items: true }
      },
      items: {
        include: {
          component: true
        }
      }
    }
  });

  return lists.map(list => ({
    id: list.id,
    name: list.name,
    description: list.description,
    createdAt: list.createdAt,
    itemCount: list._count.items,
    components: list.items.map(item => item.componentId)
  }));
}

export async function createList(data: Omit<List, 'id' | 'createdAt' | 'itemCount' | 'components'>) {
  const list = await prisma.list.create({
    data: {
      name: data.name,
      description: data.description
    }
  });

  return {
    ...list,
    itemCount: 0,
    components: []
  };
}

export async function updateList(id: string, data: { name?: string; description?: string; components?: string[] }) {
  // Update list details if provided
  if (data.name || data.description) {
    await prisma.list.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description
      }
    });
  }

  // Update components if provided
  if (data.components) {
    // First, delete all existing items
    await prisma.listItem.deleteMany({
      where: { listId: id }
    });

    // Then create new items
    await prisma.listItem.createMany({
      data: data.components.map(componentId => ({
        listId: id,
        componentId
      }))
    });
  }

  // Get updated list
  const updatedList = await prisma.list.findUnique({
    where: { id },
    include: {
      _count: {
        select: { items: true }
      },
      items: true
    }
  });

  if (!updatedList) {
    throw new Error('List not found');
  }

  return {
    id: updatedList.id,
    name: updatedList.name,
    description: updatedList.description,
    createdAt: updatedList.createdAt,
    itemCount: updatedList._count.items,
    components: updatedList.items.map(item => item.componentId)
  };
}

export async function deleteList(id: string) {
  await prisma.list.delete({
    where: { id }
  });
} 