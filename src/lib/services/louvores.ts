import { supabase } from '../supabase'
import { Louvor } from '@/types/database'

export const louvoresService = {
  // Buscar todos os louvores
  async getAll(): Promise<Louvor[]> {
    const { data, error } = await supabase
      .from('louvores')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar louvores:', error)
      throw new Error('Erro ao buscar louvores')
    }

    return data || []
  },

  // Buscar louvores por categoria
  async getByCategoria(categoria: string): Promise<Louvor[]> {
    const { data, error } = await supabase
      .from('louvores')
      .select('*')
      .eq('categoria', categoria)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar louvores por categoria:', error)
      throw new Error('Erro ao buscar louvores por categoria')
    }

    return data || []
  },

  // Buscar louvores ativos
  async getAtivos(): Promise<Louvor[]> {
    const { data, error } = await supabase
      .from('louvores')
      .select('*')
      .eq('status', 'ativo')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar louvores ativos:', error)
      throw new Error('Erro ao buscar louvores ativos')
    }

    return data || []
  },

  // Buscar louvor por ID
  async getById(id: number): Promise<Louvor | null> {
    const { data, error } = await supabase
      .from('louvores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar louvor:', error)
      throw new Error('Erro ao buscar louvor')
    }

    return data
  },

  // Buscar louvores por nome (busca parcial)
  async searchByNome(nome: string): Promise<Louvor[]> {
    const { data, error } = await supabase
      .from('louvores')
      .select('*')
      .ilike('nome', `%${nome}%`)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar louvores por nome:', error)
      throw new Error('Erro ao buscar louvores por nome')
    }

    return data || []
  },

  // Criar novo louvor
  async create(louvor: Omit<Louvor, 'id' | 'created_at' | 'updated_at'>): Promise<Louvor> {
    const { data, error } = await supabase
      .from('louvores')
      .insert([louvor])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar louvor:', error)
      throw new Error('Erro ao criar louvor')
    }

    return data
  },

  // Atualizar louvor
  async update(id: number, louvor: Partial<Louvor>): Promise<Louvor> {
    const { data, error } = await supabase
      .from('louvores')
      .update(louvor)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar louvor:', error)
      throw new Error('Erro ao atualizar louvor')
    }

    return data
  },

  // Deletar louvor
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('louvores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar louvor:', error)
      throw new Error('Erro ao deletar louvor')
    }
  }
}

