-- Script para criar as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Habilitar a extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de cantores
CREATE TABLE IF NOT EXISTS cantores (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    funcao VARCHAR(100) NOT NULL DEFAULT 'Vocal Principal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de músicos
CREATE TABLE IF NOT EXISTS musicos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    funcao VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de louvores
CREATE TABLE IF NOT EXISTS louvores (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tom VARCHAR(10) NOT NULL,
    duracao VARCHAR(10) NOT NULL,
    categoria VARCHAR(50) NOT NULL DEFAULT 'Louvor',
    letra TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    link_louvor TEXT,
    link_cifra TEXT,
    tipo_link VARCHAR(20) DEFAULT 'youtube',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cultos
CREATE TABLE IF NOT EXISTS cultos (
    id BIGSERIAL PRIMARY KEY,
    data DATE NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    horario TIME NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'agendado',
    cantores JSONB NOT NULL DEFAULT '[]',
    banda JSONB NOT NULL DEFAULT '{"instrumentos": []}',
    louvores JSONB NOT NULL DEFAULT '[]',
    novos_louvores JSONB DEFAULT '[]',
    novos_cantores JSONB DEFAULT '[]',
    novos_musicos JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id BIGSERIAL PRIMARY KEY,
    igreja_nome VARCHAR(255) NOT NULL DEFAULT 'Igreja',
    igreja_endereco TEXT,
    igreja_telefone VARCHAR(50),
    igreja_email VARCHAR(255),
    cultos_dias JSONB DEFAULT '["Domingo", "Quarta"]',
    cultos_horarios JSONB DEFAULT '["18:00", "19:30"]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de bandas
CREATE TABLE IF NOT EXISTS bandas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cantores_nome ON cantores(nome);
CREATE INDEX IF NOT EXISTS idx_musicos_nome ON musicos(nome);
CREATE INDEX IF NOT EXISTS idx_louvores_nome ON louvores(nome);
CREATE INDEX IF NOT EXISTS idx_louvores_categoria ON louvores(categoria);
CREATE INDEX IF NOT EXISTS idx_louvores_status ON louvores(status);
CREATE INDEX IF NOT EXISTS idx_cultos_data ON cultos(data);
CREATE INDEX IF NOT EXISTS idx_cultos_status ON cultos(status);

-- Função para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_cantores_updated_at BEFORE UPDATE ON cantores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_musicos_updated_at BEFORE UPDATE ON musicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_louvores_updated_at BEFORE UPDATE ON louvores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cultos_updated_at BEFORE UPDATE ON cultos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bandas_updated_at BEFORE UPDATE ON bandas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais de exemplo
INSERT INTO configuracoes (igreja_nome, igreja_endereco, igreja_telefone, igreja_email) 
VALUES ('Igreja Exemplo', 'Rua das Flores, 123', '(11) 3333-4444', 'contato@igrejaexemplo.com')
ON CONFLICT DO NOTHING;

-- Inserir alguns louvores de exemplo
INSERT INTO louvores (nome, tom, duracao, categoria, letra, status) VALUES
('Santo Santo Santo', 'C', '4:30', 'Adoração', 'Santo, Santo, Santo...', 'ativo'),
('Grande é o Senhor', 'D', '5:15', 'Louvor', 'Grande é o Senhor...', 'ativo'),
('Agnus Dei', 'G', '6:00', 'Adoração', 'Agnus Dei...', 'ativo'),
('Te Adoramos', 'F', '4:45', 'Louvor', 'Te adoramos...', 'ativo')
ON CONFLICT DO NOTHING;

-- Inserir alguns cantores de exemplo
INSERT INTO cantores (nome, funcao) VALUES
('João Silva', 'Vocal Principal'),
('Maria Santos', 'Back Vocal'),
('Pedro Costa', 'Vocal Principal'),
('Ana Oliveira', 'Back Vocal')
ON CONFLICT DO NOTHING;

-- Inserir alguns músicos de exemplo
INSERT INTO musicos (nome, funcao) VALUES
('Carlos Eduardo', 'Guitarrista'),
('Pedro Henrique', 'Baterista'),
('Ana Beatriz', 'Violonista'),
('Lucas Mendes', 'Violonista'),
('Fernanda Costa', 'Tecladista'),
('Roberto Alves', 'Baixista')
ON CONFLICT DO NOTHING;

