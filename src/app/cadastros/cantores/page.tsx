"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Plus, Edit, Trash2, Search, X, Save, Loader2 } from "lucide-react";
import { Cantor } from "@/types/database";

export default function CantoresPage() {
  const [cantores, setCantores] = useState<Cantor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "Vocal Principal"
  });

  const funcoes = ["Vocal Principal", "Back Vocal", "Vocal de Apoio", "Solo"];

  // Carregar cantores
  const fetchCantores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/membros?tipo=cantores');
      if (!response.ok) throw new Error('Erro ao carregar cantores');
      const data = await response.json();
      setCantores(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCantores();
  }, []);

  // Filtrar cantores
  const filteredCantores = cantores.filter(cantor =>
    cantor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cantor.funcao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Salvar cantor
  const saveCantor = async () => {
    if (!formData.nome.trim()) {
      alert("Por favor, preencha o nome do cantor");
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
          tipo: 'cantor'
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar cantor');

      await fetchCantores();
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar cantor');
    }
  };

  // Editar cantor
  const editCantor = (cantor: Cantor) => {
    setEditingId(cantor.id);
    setFormData({
      nome: cantor.nome,
      funcao: cantor.funcao
    });
  };

  // Deletar cantor
  const deleteCantor = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cantor?')) return;

    try {
      const response = await fetch(`/api/membros/${id}?tipo=cantor`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar cantor');

      await fetchCantores();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar cantor');
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setEditingId(null);
    setFormData({ nome: "", funcao: "Vocal Principal" });
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-full mb-4">
              <Mic className="h-6 w-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Cantores
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Cadastre e gerencie os cantores da igreja
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingId ? 'Editar Cantor' : 'Novo Cantor'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do cantor' : 'Adicione um novo cantor'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Cantor</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="funcao">Função</Label>
                <Select value={formData.funcao} onValueChange={(value) => setFormData(prev => ({ ...prev, funcao: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {funcoes.map(funcao => (
                      <SelectItem key={funcao} value={funcao}>{funcao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveCantor} className="flex-1">
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

          {/* Lista de Cantores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Cantores Cadastrados
              </CardTitle>
              <CardDescription>
                {filteredCantores.length} cantor{filteredCantores.length !== 1 ? 'es' : ''} encontrado{filteredCantores.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cantores..."
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
                  <p className="text-muted-foreground">Carregando cantores...</p>
                </div>
              )}

              {/* Lista */}
              {!loading && (
                <div className="space-y-3">
                  {filteredCantores.map((cantor) => (
                    <div
                      key={cantor.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-950/10 rounded-lg border border-emerald-200 dark:border-emerald-800"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{cantor.nome}</h3>
                        <Badge variant="outline" className="mt-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                          {cantor.funcao}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editCantor(cantor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCantor(cantor.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredCantores.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Nenhum cantor encontrado' : 'Nenhum cantor cadastrado'}
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
