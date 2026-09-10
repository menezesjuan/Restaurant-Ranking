'use server';

import { prisma } from '@/lib/prisma';
import { Place, PlaceStatus } from '@/types/place';
import { rebalancePositions, needsRebalancing } from '@/lib/ranking-calc';

export async function getDatabasePlaces(): Promise<Place[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const places = await prisma.place.findMany({
      orderBy: { rankingPosition: 'asc' },
    });
    return places.map((p) => ({
      ...p,
      status: p.status as PlaceStatus,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn('PostgreSQL não acessível, caindo para modo local/guest:', error);
    return null;
  }
}

export async function createDatabasePlace(place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!process.env.DATABASE_URL) return null;
  try {
    // Garante que o usuário guest exista se userId for 'guest_user'
    const userId = place.userId || 'guest_user';
    await prisma.user.upsert({
      where: { email: 'guest@tastemap.app' },
      update: {},
      create: {
        id: userId,
        email: 'guest@tastemap.app',
        name: 'Guest Explorer',
      },
    });

    const created = await prisma.place.create({
      data: {
        userId,
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        cuisine: place.cuisine,
        priceRange: place.priceRange,
        status: place.status,
        rankingPosition: place.rankingPosition,
        notes: place.notes,
        tags: place.tags,
      },
    });

    return created;
  } catch (error) {
    console.error('Erro ao salvar no PostgreSQL:', error);
    return null;
  }
}

export async function rebalanceDatabasePlaces(userId: string = 'guest_user') {
  if (!process.env.DATABASE_URL) return false;
  try {
    const rankedPlaces = await prisma.place.findMany({
      where: { userId, status: 'BEEN', rankingPosition: { not: null } },
      orderBy: { rankingPosition: 'asc' },
    });

    if (!needsRebalancing(rankedPlaces)) {
      return false;
    }

    const rebalanced = rebalancePositions(rankedPlaces);
    await prisma.$transaction(
      rebalanced.map((item) =>
        prisma.place.update({
          where: { id: item.id },
          data: { rankingPosition: item.rankingPosition },
        })
      )
    );

    return true;
  } catch (error) {
    console.error('Erro ao rebalancear banco:', error);
    return false;
  }
}
