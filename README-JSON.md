# Como Alterar o Arquivo JSON da Agenda de Louvores

## Visão Geral

O arquivo `public/data/agenda-louvores.json` contém todos os dados da agenda de louvores. Após compilar o projeto, você pode alterar este arquivo de várias formas.

## Métodos para Alterar o JSON

### 1. **Edição Manual Direta**

Você pode editar diretamente o arquivo `public/data/agenda-louvores.json` usando qualquer editor de texto.

**Estrutura do arquivo:**
```json
{
    "cultos": [...],
    "louvores": [...],
    "membros": {
        "cantores": [...],
        "musicos": [...]
    },
    "configuracoes": {...}
}
```

### 2. **Através da Interface Web**

1. Acesse a aplicação em `http://localhost:3000`
2. Vá para `/novo-culto`
3. Preencha os dados do culto
4. Clique em "Salvar Culto"
5. O arquivo JSON será automaticamente atualizado

### 3. **Usando Scripts de Automação**

Criamos scripts para automatizar alterações no JSON:

#### Adicionar um novo culto:
```bash
node scripts/update-json.js add-culto
```

#### Adicionar um novo louvor:
```bash
node scripts/update-json.js add-louvor
```

#### Adicionar um novo cantor:
```bash
node scripts/update-json.js add-cantor
```

### 4. **API REST**

O projeto possui uma API que permite alterar o JSON via requisições HTTP:

**POST /api/cultos**
- Adiciona um novo culto ao JSON
- Exemplo de uso:
```javascript
fetch('/api/cultos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        data: "2024-02-01",
        diaSemana: "Domingo",
        horario: "18:00",
        tipo: "Culto de Domingo",
        status: "agendado",
        cantores: [...],
        banda: { instrumentos: [...] },
        louvores: [...]
    }),
});
```

## Estrutura dos Dados

### Culto
```json
{
    "id": 1,
    "data": "2024-01-15",
    "diaSemana": "Domingo",
    "horario": "18:00",
    "tipo": "Culto de Domingo",
    "status": "agendado",
    "cantores": [...],
    "banda": {
        "instrumentos": [...]
    },
    "louvores": [...]
}
```

### Louvor
```json
{
    "id": 1,
    "nome": "Santo Santo Santo",
    "tom": "C",
    "duracao": "4:30",
    "categoria": "Adoração",
    "linkLouvor": "https://youtube.com/...",
    "linkCifra": "https://cifraclub.com/...",
    "tipoLink": "youtube"
}
```

### Cantor
```json
{
    "id": 1,
    "nome": "João Silva",
    "funcao": "Vocal Principal"
}
```

### Instrumento
```json
{
    "id": 1,
    "instrumento": "Guitarra",
    "musico": "Carlos Eduardo"
}
```

## Dicas Importantes

1. **Sempre faça backup** do arquivo JSON antes de fazer alterações
2. **Mantenha a estrutura** do JSON intacta
3. **Use IDs únicos** para cada item
4. **Valide o JSON** após alterações (pode usar ferramentas online)
5. **Reinicie o servidor** após alterações manuais se necessário

## Validação do JSON

Para verificar se o JSON está válido:

```bash
# Usando Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('public/data/agenda-louvores.json', 'utf8')))"

# Ou use ferramentas online como jsonlint.com
```

## Troubleshooting

### Erro: "ENOENT: no such file or directory"
- Verifique se o arquivo está em `public/data/agenda-louvores.json`
- Certifique-se de que o caminho está correto na API

### Erro: "Unexpected token"
- Verifique se o JSON está bem formatado
- Use um validador de JSON online

### Alterações não aparecem na interface
- Limpe o cache do navegador
- Reinicie o servidor Next.js
- Verifique se o arquivo foi salvo corretamente 