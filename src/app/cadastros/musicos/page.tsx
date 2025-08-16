"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Plus, Edit, Trash2, Search, X, Save, Loader2, Guitar, Drum, Piano } from "lucide-react";
import { Musico } from "@/types/database";

export default function MusicosPage() {
  const [musicos, setMusicos] = useState<Musico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "Guitarra"
  });

  const instrumentos = [
    "Guitarra", "Violão 1", "Violão 2", "Bateria", "Teclado", "Contra Baixo", 
    "Saxofone", "Trompete", "Flauta", "Percussão", "Acordeão", "Outros"
  ];

  // Função para obter o ícone do instrumento
  const getInstrumentIcon = (instrumento: string) => {
    switch (instrumento.toLowerCase()) {
      case 'guitarra':
      case 'violão 1':
      case 'violão 2':
        return <Guitar className="h-4 w-4" />;
      case 'bateria':
        return <Drum className="h-4 w-4" />;
      case 'teclado':
        return <Piano className="h-4 w-4" />;
      default:
        return <Guitar className="h-4 w-4" />;
    }
  };

  // Carregar músicos
  const fetchMusicos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/membros?tipo=musicos');
      if (!response.ok) throw new Error('Erro ao carregar músicos');
      const data = await response.json();
      setMusicos(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicos();
  }, []);

  // Filtrar músicos
  const filteredMusicos = musicos.filter(musico =>
    musico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    musico.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Salvar músico
  const saveMusico = async () => {
    if (!formData.nome.trim()) {
      alert("Por favor, preencha o nome do músico");
      return;
    }

    try {
      const url = editingId ? `/api/membros/${editingId}` : '/api/membros';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo: 'musico'
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar músico');

      await fetchMusicos();
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar músico');
    }
  };

  // Editar músico
  const editMusico = (musico: Musico) => {
    setEditingId(musico.id);
    setFormData({
      nome: musico.nome,
      funcao: musico.funcao
    });
  };

  // Deletar músico
  const deleteMusico = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este músico?')) return;

    try {
      const response = await fetch(`/api/membros/${id}?tipo=musico`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar músico');

      await fetchMusicos();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar músico');
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setEditingId(null);
    setFormData({ nome: "", funcao: "Guitarra" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground h-9 px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full mb-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Músicos
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Cadastre e gerencie os músicos da igreja
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingId ? 'Editar Músico' : 'Novo Músico'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do músico' : 'Adicione um novo músico'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Músico</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="funcao">Instrumento</Label>
                <Select value={formData.funcao} onValueChange={(value) => setFormData(prev => ({ ...prev, funcao: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {instrumentos.map(instrumento => (
                      <SelectItem key={instrumento} value={instrumento}>{instrumento}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveMusico} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Músicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Músicos Cadastrados
              </CardTitle>
              <CardDescription>
                {filteredMusicos.length} músico{filteredMusicos.length !== 1 ? 's' : ''} encontrado{filteredMusicos.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar músicos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Carregando músicos...</p>
                </div>
              )}

              {/* Lista */}
              {!loading && (
                <div className="space-y-3">
                  {filteredMusicos.map((musico) => (
                    <div
                      key={musico.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-950/10 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          {getInstrumentIcon(musico.funcao)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{musico.nome}</h3>
                          <Badge variant="outline" className="mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                            {musico.funcao}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editMusico(musico)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMusico(musico.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredMusicos.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Nenhum músico encontrado' : 'Nenhum músico cadastrado'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
