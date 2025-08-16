import { supabase } from '../supabase'
import { Culto } from '@/types/database'

export const cultosService = {
  // Buscar todos os cultos
  async getAll(): Promise<Culto[]> {
    const { data, error } = await supabase
      .from('cultos')
      .select('*')
      .order('data', { ascending: true })

    if (error) {
      console.error('Erro ao buscar cultos:', error)
      throw new Error('Erro ao buscar cultos')
    }

    return data || []
  },

  // Buscar cultos futuros
  async getFuturos(): Promise<Culto[]> {
    const hoje = new Date()
    const dataFormatada = hoje.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('cultos')
      .select('*')
      .gte('data', dataFormatada)
      .order('data', { ascending: true })

    if (error) {
      console.error('Erro ao buscar cultos futuros:', error)
      throw new Error('Erro ao buscar cultos futuros')
    }

    return data || []
  },

  // Buscar culto por ID
  async getById(id: number): Promise<Culto | null> {
    const { data, error } = await supabase
      .from('cultos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar culto:', error)
      throw new Error('Erro ao buscar culto')
    }

    return data
  },

  // Criar novo culto
  async create(culto: Omit<Culto, 'id' | 'created_at' | 'updated_at'>): Promise<Culto> {
    const { data, error } = await supabase
      .from('cultos')
      .insert([culto])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar culto:', error)
      throw new Error('Erro ao criar culto')
    }

    return data
  },

  // Atualizar culto
  async update(id: number, culto: Partial<Culto>): Promise<Culto> {
    const { data, error } = await supabase
      .from('cultos')
      .update(culto)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar culto:', error)
      throw new Error('Erro ao atualizar culto')
    }

    return data
  },

  // Deletar culto
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('cultos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar culto:', error)
      throw new Error('Erro ao deletar culto')
    }
  }
}

