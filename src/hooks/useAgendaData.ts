import { useState, useEffect, useCallback } from 'react';
import { Culto, Louvor, Cantor, Musico } from '@/types/database';

export const useAgendaData = () => {
  const [cultos, setCultos] = useState<Culto[]>(() => []);
  const [louvores, setLouvores] = useState<Louvor[]>(() => []);
  const [cantores, setCantores] = useState<Cantor[]>(() => []);
  const [musicos, setMusicos] = useState<Musico[]>(() => []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para adicionar timestamp único para evitar cache
  const getCacheBuster = () => `?t=${Date.now()}`;

  // Buscar cultos futuros com cache buster
  const fetchCultosFuturos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cultos${getCacheBuster()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Erro ao buscar cultos');
      const data = await response.json();
      setCultos(data);
      
      // Disparar evento de atualização de cultos
      window.dispatchEvent(new CustomEvent('data-updated', {
        detail: { message: 'Lista de cultos atualizada!' }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar cultos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar louvores com cache buster
  const fetchLouvores = useCallback(async () => {
    try {
      const response = await fetch(`/api/louvores${getCacheBuster()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Erro ao buscar louvores');
      const data = await response.json();
      setLouvores(data);
    } catch (err) {
      console.error('Erro ao buscar louvores:', err);
    }
  }, []);

  // Buscar membros com cache buster
  const fetchMembros = useCallback(async () => {
    try {
      const response = await fetch(`/api/membros${getCacheBuster()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Erro ao buscar membros');
      const data = await response.json();
      setCantores(data.cantores || []);
      setMusicos(data.musicos || []);
    } catch (err) {
      console.error('Erro ao buscar membros:', err);
    }
  }, []);

  // Buscar louvores por nome
  const searchLouvores = useCallback(async (nome: string) => {
    try {
      const response = await fetch(`/api/louvores?nome=${encodeURIComponent(nome)}${getCacheBuster()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Erro ao buscar louvores');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao buscar louvores:', err);
      return [];
    }
  }, []);

  // Buscar cantores por nome
  const searchCantores = useCallback(async (nome: string) => {
    try {
      const response = await fetch(`/api/membros?tipo=cantores&nome=${encodeURIComponent(nome)}${getCacheBuster()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Erro ao buscar cantores');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao buscar cantores:', err);
      return [];
    }
  }, []);

  // Buscar músicos por nome
  const searchMusicos = useCallback(async (nome: string) => {
    try {
      const response = await fetch(`/api/membros?tipo=musicos&nome=${encodeURIComponent(nome)}${getCacheBuster()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) throw new Error('Erro ao buscar músicos');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao buscar músicos:', err);
      return [];
    }
  }, []);

  // Função para recarregar todos os dados
  const refreshAllData = useCallback(async () => {
    console.log('🔄 Recarregando todos os dados...');
    await Promise.all([
      fetchCultosFuturos(),
      fetchLouvores(),
      fetchMembros()
    ]);
    
    // Disparar evento de atualização
    window.dispatchEvent(new CustomEvent('data-refreshed', {
      detail: { message: 'Dados recarregados com sucesso!' }
    }));
  }, [fetchCultosFuturos, fetchLouvores, fetchMembros]);

  // Carregar todos os dados iniciais
  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 Carregando dados iniciais...');
      await refreshAllData();
    };

    loadData();

    // Refresh automático a cada 10 segundos (mais agressivo)
    const interval = setInterval(() => {
      console.log('⏰ Refresh automático...');
      fetchCultosFuturos();
    }, 10000);

    // Refresh quando a página ganha foco (útil para PWA)
    const handleFocus = () => {
      console.log('👁️ Página ganhou foco, recarregando...');
      refreshAllData();
    };

    // Refresh quando a página fica visível
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Página ficou visível, recarregando...');
        refreshAllData();
      }
    };

    // Refresh quando o usuário volta para a aba
    const handlePageShow = () => {
      console.log('📄 Página mostrada, recarregando...');
      refreshAllData();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [refreshAllData, fetchCultosFuturos]);

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
    searchMusicos,
    refreshAllData
  };
};

