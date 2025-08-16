export interface Cantor {
  id: number
  nome: string
  funcao: string
  created_at?: string
  updated_at?: string
}

export interface Musico {
  id: number
  nome: string
  funcao: string
  created_at?: string
  updated_at?: string
}

export interface Louvor {
  id: number
  nome: string
  tom: string
  duracao: string
  categoria: string
  letra?: string
  status: string
  link_louvor?: string
  link_cifra?: string
  tipo_link?: string
  created_at?: string
  updated_at?: string
}

export interface Instrumento {
  id: number
  instrumento: string
  musico: string
}

export interface Banda {
  instrumentos: Instrumento[]
}

export interface Culto {
  id: number
  data: string
  dia_semana: string
  horario: string
  tipo: string
  status: string
  cantores: Cantor[]
  banda: Banda
  louvores: Louvor[]
  novos_louvores?: Louvor[]
  novos_cantores?: Cantor[]
  novos_musicos?: Musico[]
  created_at?: string
  updated_at?: string
}

export interface Configuracao {
  id: number
  igreja_nome: string
  igreja_endereco: string
  igreja_telefone: string
  igreja_email: string
  cultos_dias: string[]
  cultos_horarios: string[]
  created_at?: string
  updated_at?: string
}

export interface BandaConfig {
  id: number
  nome: string
  descricao: string
  status: string
  created_at?: string
  updated_at?: string
}

