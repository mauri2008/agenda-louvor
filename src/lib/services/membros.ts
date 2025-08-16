import { supabase } from '../supabase'
import { Cantor, Musico } from '@/types/database'

export const membrosService = {
  // Buscar todos os cantores
  async getCantores(): Promise<Cantor[]> {
    const { data, error } = await supabase
      .from('cantores')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar cantores:', error)
      throw new Error('Erro ao buscar cantores')
    }

    return data || []
  },

  // Buscar cantores por função
  async getCantoresPorFuncao(funcao: string): Promise<Cantor[]> {
    const { data, error } = await supabase
      .from('cantores')
      .select('*')
      .eq('funcao', funcao)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar cantores por função:', error)
      throw new Error('Erro ao buscar cantores por função')
    }

    return data || []
  },

  // Buscar cantor por ID
  async getCantorById(id: number): Promise<Cantor | null> {
    const { data, error } = await supabase
      .from('cantores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar cantor:', error)
      throw new Error('Erro ao buscar cantor')
    }

    return data
  },

  // Buscar cantores por nome (busca parcial)
  async searchCantoresPorNome(nome: string): Promise<Cantor[]> {
    const { data, error } = await supabase
      .from('cantores')
      .select('*')
      .ilike('nome', `%${nome}%`)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar cantores por nome:', error)
      throw new Error('Erro ao buscar cantores por nome')
    }

    return data || []
  },

  // Criar novo cantor
  async createCantor(cantor: Omit<Cantor, 'id' | 'created_at' | 'updated_at'>): Promise<Cantor> {
    const { data, error } = await supabase
      .from('cantores')
      .insert([cantor])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar cantor:', error)
      throw new Error('Erro ao criar cantor')
    }

    return data
  },

  // Atualizar cantor
  async updateCantor(id: number, cantor: Partial<Cantor>): Promise<Cantor> {
    const { data, error } = await supabase
      .from('cantores')
      .update(cantor)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar cantor:', error)
      throw new Error('Erro ao atualizar cantor')
    }

    return data
  },

  // Deletar cantor
  async deleteCantor(id: number): Promise<void> {
    const { error } = await supabase
      .from('cantores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar cantor:', error)
      throw new Error('Erro ao deletar cantor')
    }
  },

  // Buscar todos os músicos
  async getMusicos(): Promise<Musico[]> {
    const { data, error } = await supabase
      .from('musicos')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar músicos:', error)
      throw new Error('Erro ao buscar músicos')
    }

    return data || []
  },

  // Buscar músicos por função
  async getMusicosPorFuncao(funcao: string): Promise<Musico[]> {
    const { data, error } = await supabase
      .from('musicos')
      .select('*')
      .eq('funcao', funcao)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar músicos por função:', error)
      throw new Error('Erro ao buscar músicos por função')
    }

    return data || []
  },

  // Buscar músico por ID
  async getMusicoById(id: number): Promise<Musico | null> {
    const { data, error } = await supabase
      .from('musicos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar músico:', error)
      throw new Error('Erro ao buscar músico')
    }

    return data
  },

  // Buscar músicos por nome (busca parcial)
  async searchMusicosPorNome(nome: string): Promise<Musico[]> {
    const { data, error } = await supabase
      .from('musicos')
      .select('*')
      .ilike('nome', `%${nome}%`)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar músicos por nome:', error)
      throw new Error('Erro ao buscar músicos por nome')
    }

    return data || []
  },

  // Criar novo músico
  async createMusico(musico: Omit<Musico, 'id' | 'created_at' | 'updated_at'>): Promise<Musico> {
    const { data, error } = await supabase
      .from('musicos')
      .insert([musico])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar músico:', error)
      throw new Error('Erro ao criar músico')
    }

    return data
  },

  // Atualizar músico
  async updateMusico(id: number, musico: Partial<Musico>): Promise<Musico> {
    const { data, error } = await supabase
      .from('musicos')
      .update(musico)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar músico:', error)
      throw new Error('Erro ao atualizar músico')
    }

    return data
  },

  // Deletar músico
  async deleteMusico(id: number): Promise<void> {
    const { error } = await supabase
      .from('musicos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar músico:', error)
      throw new Error('Erro ao deletar músico')
    }
  }
}

