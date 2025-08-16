const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
  console.log('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Ler dados do JSON
const dataPath = path.join(process.cwd(), 'public', 'data', 'agenda-louvores.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function migrateData() {
  console.log('🚀 Iniciando migração de dados para o Supabase...\n');

  try {
    // 1. Migrar configurações
    console.log('📝 Migrando configurações...');
    if (data.configuracoes) {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          id: 1,
          igreja_nome: data.configuracoes.igreja.nome,
          igreja_endereco: data.configuracoes.igreja.endereco,
          igreja_telefone: data.configuracoes.igreja.telefone,
          igreja_email: data.configuracoes.igreja.email,
          cultos_dias: data.configuracoes.cultos.dias,
          cultos_horarios: data.configuracoes.cultos.horarios
        });

      if (error) {
        console.error('❌ Erro ao migrar configurações:', error.message);
      } else {
        console.log('✅ Configurações migradas com sucesso!');
      }
    }

    // 2. Migrar louvores
    console.log('\n🎵 Migrando louvores...');
    if (data.louvores && data.louvores.length > 0) {
      const louvoresParaMigrar = data.louvores.map(louvor => ({
        nome: louvor.nome,
        tom: louvor.tom,
        duracao: louvor.duracao,
        categoria: louvor.categoria,
        letra: louvor.letra || '',
        status: louvor.status || 'ativo',
        link_louvor: louvor.linkLouvor || '',
        link_cifra: louvor.linkCifra || '',
        tipo_link: louvor.tipoLink || 'youtube'
      }));

      const { error } = await supabase
        .from('louvores')
        .upsert(louvoresParaMigrar, { onConflict: 'nome' });

      if (error) {
        console.error('❌ Erro ao migrar louvores:', error.message);
      } else {
        console.log(`✅ ${louvoresParaMigrar.length} louvores migrados com sucesso!`);
      }
    }

    // 3. Migrar cantores
    console.log('\n🎤 Migrando cantores...');
    if (data.membros && data.membros.cantores && data.membros.cantores.length > 0) {
      const cantoresParaMigrar = data.membros.cantores.map(cantor => ({
        nome: cantor.nome,
        funcao: cantor.funcao
      }));

      const { error } = await supabase
        .from('cantores')
        .upsert(cantoresParaMigrar, { onConflict: 'nome' });

      if (error) {
        console.error('❌ Erro ao migrar cantores:', error.message);
      } else {
        console.log(`✅ ${cantoresParaMigrar.length} cantores migrados com sucesso!`);
      }
    }

    // 4. Migrar músicos
    console.log('\n🎸 Migrando músicos...');
    if (data.membros && data.membros.musicos && data.membros.musicos.length > 0) {
      const musicosParaMigrar = data.membros.musicos.map(musico => ({
        nome: musico.nome,
        funcao: musico.funcao
      }));

      const { error } = await supabase
        .from('musicos')
        .upsert(musicosParaMigrar, { onConflict: 'nome' });

      if (error) {
        console.error('❌ Erro ao migrar músicos:', error.message);
      } else {
        console.log(`✅ ${musicosParaMigrar.length} músicos migrados com sucesso!`);
      }
    }

    // 5. Migrar cultos
    console.log('\n⛪ Migrando cultos...');
    if (data.cultos && data.cultos.length > 0) {
      const cultosParaMigrar = data.cultos.map(culto => ({
        data: culto.data,
        dia_semana: culto.diaSemana,
        horario: culto.horario,
        tipo: culto.tipo,
        status: culto.status,
        cantores: culto.cantores,
        banda: culto.banda,
        louvores: culto.louvores,
        novos_louvores: culto.novosLouvores || [],
        novos_cantores: culto.novosCantores || [],
        novos_musicos: culto.novosMusicos || []
      }));

      const { error } = await supabase
        .from('cultos')
        .upsert(cultosParaMigrar);

      if (error) {
        console.error('❌ Erro ao migrar cultos:', error.message);
      } else {
        console.log(`✅ ${cultosParaMigrar.length} cultos migrados com sucesso!`);
      }
    }

    // 6. Migrar bandas
    console.log('\n🎼 Migrando bandas...');
    if (data.bandas && data.bandas.length > 0) {
      const bandasParaMigrar = data.bandas.map(banda => ({
        nome: banda.nome,
        descricao: banda.descricao,
        status: banda.status
      }));

      const { error } = await supabase
        .from('bandas')
        .upsert(bandasParaMigrar, { onConflict: 'nome' });

      if (error) {
        console.error('❌ Erro ao migrar bandas:', error.message);
      } else {
        console.log(`✅ ${bandasParaMigrar.length} bandas migradas com sucesso!`);
      }
    }

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n📊 Resumo da migração:');
    console.log(`- Configurações: ${data.configuracoes ? '1' : '0'}`);
    console.log(`- Louvores: ${data.louvores ? data.louvores.length : 0}`);
    console.log(`- Cantores: ${data.membros?.cantores ? data.membros.cantores.length : 0}`);
    console.log(`- Músicos: ${data.membros?.musicos ? data.membros.musicos.length : 0}`);
    console.log(`- Cultos: ${data.cultos ? data.cultos.length : 0}`);
    console.log(`- Bandas: ${data.bandas ? data.bandas.length : 0}`);

  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    process.exit(1);
  }
}

// Executar migração
migrateData();

