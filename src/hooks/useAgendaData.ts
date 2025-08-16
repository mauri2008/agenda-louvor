import { useState, useEffect } from 'react';
import { Culto, Louvor, Cantor, Musico } from '@/types/database';

export const useAgendaData = () => {
  const [cultos, setCultos] = useState<Culto[]>(() => []);
  const [louvores, setLouvores] = useState<Louvor[]>(() => []);
  const [cantores, setCantores] = useState<Cantor[]>(() => []);
  const [musicos, setMusicos] = useState<Musico[]>(() => []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar cultos futuros
  const fetchCultosFuturos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cultos');
      if (!response.ok) throw new Error('Erro ao buscar cultos');
      const data = await response.json();
      setCultos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Buscar louvores
  const fetchLouvores = async () => {
    try {
      const response = await fetch('/api/louvores');
      if (!response.ok) throw new Error('Erro ao buscar louvores');
      const data = await response.json();
      setLouvores(data);
    } catch (err) {
      console.error('Erro ao buscar louvores:', err);
    }
  };

  // Buscar membros
  const fetchMembros = async () => {
    try {
      const response = await fetch('/api/membros');
      if (!response.ok) throw new Error('Erro ao buscar membros');
      const data = await response.json();
      setCantores(data.cantores || []);
      setMusicos(data.musicos || []);
    } catch (err) {
      console.error('Erro ao buscar membros:', err);
    }
  };

  // Buscar louvores por nome
  const searchLouvores = async (nome: string) => {
    try {
      const response = await fetch(`/api/louvores?nome=${encodeURIComponent(nome)}`);
      if (!response.ok) throw new Error('Erro ao buscar louvores');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao buscar louvores:', err);
      return [];
    }
  };

  // Buscar cantores por nome
  const searchCantores = async (nome: string) => {
    try {
      const response = await fetch(`/api/membros?tipo=cantores&nome=${encodeURIComponent(nome)}`);
      if (!response.ok) throw new Error('Erro ao buscar cantores');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao buscar cantores:', err);
      return [];
    }
  };

  // Buscar músicos por nome
  const searchMusicos = async (nome: string) => {
    try {
      const response = await fetch(`/api/membros?tipo=musicos&nome=${encodeURIComponent(nome)}`);
      if (!response.ok) throw new Error('Erro ao buscar músicos');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao buscar músicos:', err);
      return [];
    }
  };

  // Carregar todos os dados iniciais
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCultosFuturos(),
        fetchLouvores(),
        fetchMembros()
      ]);
    };

    loadData();

    // Refresh automático a cada 30 segundos
    const interval = setInterval(() => {
      fetchCultosFuturos();
    }, 30000);

    // Refresh quando a página ganha foco (útil para PWA)
    const handleFocus = () => {
      fetchCultosFuturos();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return {
    cultos,
    louvores,
    cantores,
    musicos,
    loading,
    error,
    fetchCultosFuturos,
    fetchLouvores,
    fetchMembros,
    searchLouvores,
    searchCantores,
    searchMusicos
  };
};

