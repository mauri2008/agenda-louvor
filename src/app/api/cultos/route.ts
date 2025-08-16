import { NextRequest, NextResponse } from 'next/server';
import { cultosService } from '@/lib/services/cultos';
import { louvoresService } from '@/lib/services/louvores';
import { membrosService } from '@/lib/services/membros';
import { Culto } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const novoCulto = await request.json();
    
    // Processar novos louvores, cantores e músicos
    const novosLouvores = novoCulto.novosLouvores || [];
    const novosCantores = novoCulto.novosCantores || [];
    const novosMusicos = novoCulto.novosMusicos || [];

    // Adicionar novos louvores à base de dados
    for (const louvor of novosLouvores) {
      try {
        await louvoresService.create({
          nome: louvor.nome,
          tom: louvor.tom,
          duracao: louvor.duracao,
          categoria: louvor.categoria,
          letra: louvor.letra || '',
          status: 'ativo',
          link_louvor: louvor.linkLouvor || '',
          link_cifra: louvor.linkCifra || '',
          tipo_link: louvor.tipoLink || 'youtube'
        });
      } catch (error) {
        console.error('Erro ao criar louvor:', error);
      }
    }

    // Adicionar novos cantores à base de dados
    for (const cantor of novosCantores) {
      try {
        await membrosService.createCantor({
          nome: cantor.nome,
          funcao: cantor.funcao
        });
      } catch (error) {
        console.error('Erro ao criar cantor:', error);
      }
    }

    // Adicionar novos músicos à base de dados
    for (const musico of novosMusicos) {
      try {
        await membrosService.createMusico({
          nome: musico.nome,
          funcao: musico.funcao
        });
      } catch (error) {
        console.error('Erro ao criar músico:', error);
      }
    }

    // Preparar dados do culto para salvar
    const cultoParaSalvar: Omit<Culto, 'id' | 'created_at' | 'updated_at'> = {
      data: novoCulto.data,
      dia_semana: novoCulto.diaSemana,
      horario: novoCulto.horario,
      tipo: novoCulto.tipo,
      status: novoCulto.status,
      cantores: novoCulto.cantores,
      banda: novoCulto.banda,
      louvores: novoCulto.louvores
    };

    // Salvar o culto no Supabase
    const cultoSalvo = await cultosService.create(cultoParaSalvar);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Culto salvo com sucesso!',
      culto: cultoSalvo 
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Erro ao salvar culto:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao salvar culto' },
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

export async function GET() {
  try {
    const cultos = await cultosService.getAll();
    return NextResponse.json(cultos, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
      },
    });
  } catch (error) {
    console.error('Erro ao ler cultos:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao ler cultos' },
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