# Agenda de Louvores - Configuração Supabase

Este projeto foi convertido para usar o Supabase como banco de dados. Siga as instruções abaixo para configurar o ambiente.

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita em https://supabase.com)

## Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Digite um nome para o projeto (ex: "agenda-louvores")
5. Escolha uma senha forte para o banco de dados
6. Escolha a região mais próxima
7. Clique em "Create new project"

### 2. Configurar o Banco de Dados

1. No painel do Supabase, vá para "SQL Editor"
2. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script para criar as tabelas e dados iniciais

### 3. Obter as Credenciais

1. No painel do Supabase, vá para "Settings" > "API"
2. Copie a "Project URL" e a "anon public" key
3. Você precisará dessas informações para configurar as variáveis de ambiente

## Configuração do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env.local`:
```bash
cp env.example .env.local
```

2. Edite o arquivo `.env.local` e adicione suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Executar o Projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Estrutura do Banco de Dados

### Tabelas Criadas

- **cantores**: Armazena informações dos cantores
- **musicos**: Armazena informações dos músicos
- **louvores**: Armazena o repertório de louvores
- **cultos**: Armazena os cultos agendados
- **configuracoes**: Configurações gerais da igreja
- **bandas**: Configurações de bandas

### Principais Funcionalidades

- ✅ Cadastro de cultos com cantores, músicos e louvores
- ✅ Busca e filtros em tempo real
- ✅ Autocomplete para louvores, cantores e músicos
- ✅ Interface responsiva e moderna
- ✅ Dados persistentes no Supabase
- ✅ API RESTful para todas as operações

## Migração de Dados

Se você já tem dados no arquivo JSON, pode migrá-los para o Supabase:

1. Abra o arquivo `public/data/agenda-louvores.json`
2. Use o painel do Supabase para inserir os dados manualmente
3. Ou crie um script de migração personalizado

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Troubleshooting

### Erro de Conexão com Supabase

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o projeto do Supabase está ativo
3. Verifique se as tabelas foram criadas corretamente

### Erro de CORS

1. No Supabase, vá para "Settings" > "API"
2. Adicione seu domínio à lista de "Additional Allowed Origins"

### Problemas de Performance

1. Verifique se os índices foram criados corretamente
2. Considere usar paginação para grandes volumes de dados
3. Otimize as consultas no Supabase

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Supabase
2. Consulte os logs do console do navegador
3. Verifique os logs do Supabase no painel de controle

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar permissões por nível de acesso
- [ ] Implementar backup automático
- [ ] Adicionar relatórios e estatísticas
- [ ] Implementar notificações por email
- [ ] Adicionar upload de arquivos (cifras, letras)

