import { NextRequest, NextResponse } from 'next/server';
import { searchOrResolvePlace } from '@/lib/google-maps/resolver';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const queryOrUrl = body?.queryOrUrl || body?.input || body?.url || body?.query;

    if (!queryOrUrl || typeof queryOrUrl !== 'string' || queryOrUrl.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Por favor, informe uma URL do Google Maps ou termo de busca.' },
        { status: 400 }
      );
    }

    if (queryOrUrl.length > 2048) {
      return NextResponse.json(
        { success: false, error: 'Entrada excede o limite máximo permitido de caracteres.' },
        { status: 400 }
      );
    }

    const places = await searchOrResolvePlace(queryOrUrl);

    return NextResponse.json({
      success: true,
      places,
    });
  } catch (error: any) {
    console.error('Erro na rota /api/places/google-maps:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Falha ao processar dados do Google Maps.',
      },
      { status: 400 }
    );
  }
}
