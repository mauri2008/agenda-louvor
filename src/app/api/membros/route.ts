import { NextRequest, NextResponse } from 'next/server';
import { membrosService } from '@/lib/services/membros';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // 'cantores' ou 'musicos'
    const nome = searchParams.get('nome');
    const funcao = searchParams.get('funcao');

    let membros;

    if (tipo === 'cantores') {
      if (nome) {
        membros = await membrosService.searchCantoresPorNome(nome);
      } else if (funcao) {
        membros = await membrosService.getCantoresPorFuncao(funcao);
      } else {
        membros = await membrosService.getCantores();
      }
    } else if (tipo === 'musicos') {
      if (nome) {
        membros = await membrosService.searchMusicosPorNome(nome);
      } else if (funcao) {
        membros = await membrosService.getMusicosPorFuncao(funcao);
      } else {
        membros = await membrosService.getMusicos();
      }
    } else {
      // Retornar ambos os tipos se não especificado
      const cantores = await membrosService.getCantores();
      const musicos = await membrosService.getMusicos();
      membros = { cantores, musicos };
    }

    return NextResponse.json(membros);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar membros' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const novoMembro = await request.json();
    const { tipo, ...dados } = novoMembro;
    
    let membroSalvo;

    if (tipo === 'cantor') {
      membroSalvo = await membrosService.createCantor({
        nome: dados.nome,
        funcao: dados.funcao
      });
    } else if (tipo === 'musico') {
      membroSalvo = await membrosService.createMusico({
        nome: dados.nome,
        funcao: dados.funcao
      });
    } else {
      throw new Error('Tipo de membro inválido');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${tipo === 'cantor' ? 'Cantor' : 'Músico'} salvo com sucesso!`,
      membro: membroSalvo 
    });
    
  } catch (error) {
    console.error('Erro ao salvar membro:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao salvar membro' },
      { status: 500 }
    );
  }
}

