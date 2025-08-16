import { NextRequest, NextResponse } from 'next/server';
import { louvoresService } from '@/lib/services/louvores';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const nome = searchParams.get('nome');

    let louvores;

    if (nome) {
      louvores = await louvoresService.searchByNome(nome);
    } else if (categoria) {
      louvores = await louvoresService.getByCategoria(categoria);
    } else {
      louvores = await louvoresService.getAtivos();
    }

    return NextResponse.json(louvores, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar louvores:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar louvores' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const novoLouvor = await request.json();
    
    const louvorSalvo = await louvoresService.create({
      nome: novoLouvor.nome,
      tom: novoLouvor.tom,
      duracao: novoLouvor.duracao,
      categoria: novoLouvor.categoria,
      letra: novoLouvor.letra || '',
      status: 'ativo',
      link_louvor: novoLouvor.linkLouvor || '',
      link_cifra: novoLouvor.linkCifra || '',
      tipo_link: novoLouvor.tipoLink || 'youtube'
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Louvor salvo com sucesso!',
      louvor: louvorSalvo 
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Erro ao salvar louvor:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao salvar louvor' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}

