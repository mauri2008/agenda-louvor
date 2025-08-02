import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const novoCulto = await request.json();
    
    // Ler o arquivo JSON atual
    const dataPath = join(process.cwd(), 'src', 'data', 'agenda-louvores.json');
    const data = JSON.parse(readFileSync(dataPath, 'utf8'));
    
    // Gerar novo ID
    const novoId = Math.max(...data.cultos.map((culto: any) => culto.id)) + 1;
    
    // Adicionar o novo culto
    const cultoCompleto = {
      ...novoCulto,
      id: novoId
    };
    
    data.cultos.push(cultoCompleto);
    
    // Salvar no arquivo
    writeFileSync(dataPath, JSON.stringify(data, null, 4), 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Culto salvo com sucesso!',
      culto: cultoCompleto 
    });
    
  } catch (error) {
    console.error('Erro ao salvar culto:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao salvar culto' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataPath = join(process.cwd(), 'src', 'data', 'agenda-louvores.json');
    const data = JSON.parse(readFileSync(dataPath, 'utf8'));
    
    return NextResponse.json(data.cultos);
  } catch (error) {
    console.error('Erro ao ler cultos:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao ler cultos' },
      { status: 500 }
    );
  }
} 