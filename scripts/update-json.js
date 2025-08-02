const fs = require('fs');
const path = require('path');

// Função para ler o arquivo JSON
function readJsonFile() {
    const filePath = path.join(process.cwd(), 'public', 'data', 'agenda-louvores.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Função para salvar o arquivo JSON
function saveJsonFile(data) {
    const filePath = path.join(process.cwd(), 'public', 'data', 'agenda-louvores.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    console.log('Arquivo JSON atualizado com sucesso!');
}

// Exemplo: Adicionar um novo culto
function addNewCulto() {
    const data = readJsonFile();
    
    const newCulto = {
        id: Math.max(...data.cultos.map(c => c.id)) + 1,
        data: "2024-02-01",
        diaSemana: "Domingo",
        horario: "18:00",
        tipo: "Culto de Domingo",
        status: "agendado",
        cantores: [],
        banda: {
            instrumentos: []
        },
        louvores: []
    };
    
    data.cultos.push(newCulto);
    saveJsonFile(data);
}

// Exemplo: Adicionar um novo louvor
function addNewLouvor() {
    const data = readJsonFile();
    
    const newLouvor = {
        id: Math.max(...data.louvores.map(l => l.id)) + 1,
        nome: "Novo Louvor",
        tom: "C",
        duracao: "4:30",
        categoria: "Louvor",
        linkLouvor: "",
        linkCifra: "",
        tipoLink: "youtube"
    };
    
    data.louvores.push(newLouvor);
    saveJsonFile(data);
}

// Exemplo: Adicionar um novo cantor
function addNewCantor() {
    const data = readJsonFile();
    
    const newCantor = {
        id: Math.max(...data.membros.cantores.map(c => c.id)) + 1,
        nome: "Novo Cantor",
        funcao: "Vocal Principal"
    };
    
    data.membros.cantores.push(newCantor);
    saveJsonFile(data);
}

// Executar função específica baseada no argumento da linha de comando
const action = process.argv[2];

switch (action) {
    case 'add-culto':
        addNewCulto();
        break;
    case 'add-louvor':
        addNewLouvor();
        break;
    case 'add-cantor':
        addNewCantor();
        break;
    default:
        console.log('Uso: node scripts/update-json.js [add-culto|add-louvor|add-cantor]');
        console.log('Exemplo: node scripts/update-json.js add-culto');
} 