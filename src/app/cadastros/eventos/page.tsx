"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Plus, Edit, Trash2, Search, X, Save, Loader2 } from "lucide-react";

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "Culto",
    status: "ativo"
  });

  const categorias = [
    "Culto", "Ensaio", "Evento Especial", "Conferência", "Retiro", 
    "Batismo", "Santa Ceia", "Evangelismo", "Reunião", "Outros"
  ];
  const statusOptions = ["ativo", "inativo"];

  // Eventos padrão que serão criados automaticamente se não existirem
  const eventosPadrao = [
    { nome: "Culto de Domingo", descricao: "Culto principal de domingo", categoria: "Culto" },
    { nome: "Culto de Terça", descricao: "Culto de oração de terça-feira", categoria: "Culto" },
    { nome: "Culto de Quinta", descricao: "Culto de quinta-feira", categoria: "Culto" },
    { nome: "Culto de Sexta", descricao: "Culto de sexta-feira", categoria: "Culto" },
    { nome: "Culto de Jovens", descricao: "Culto específico para jovens", categoria: "Culto" },
    { nome: "Culto de Crianças", descricao: "Culto específico para crianças", categoria: "Culto" },
    { nome: "Ensaio", descricao: "Ensaio da banda e cantores", categoria: "Ensaio" },
    { nome: "Evento Especial", descricao: "Evento especial da igreja", categoria: "Evento Especial" },
    { nome: "Conferência", descricao: "Conferência ou seminário", categoria: "Conferência" },
    { nome: "Retiro", descricao: "Retiro espiritual", categoria: "Retiro" },
    { nome: "Batismo", descricao: "Cerimônia de batismo", categoria: "Batismo" },
    { nome: "Santa Ceia", descricao: "Celebração da Santa Ceia", categoria: "Santa Ceia" },
    { nome: "Evangelismo", descricao: "Ação evangelística", categoria: "Evangelismo" }
  ];

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        // Por enquanto, vamos simular os eventos padrão
        // Em uma implementação real, você teria uma API para eventos
        setEventos(eventosPadrao.map((evento, index) => ({
          id: index + 1,
          nome: evento.nome,
          descricao: evento.descricao,
          categoria: evento.categoria,
          status: "ativo"
        })));
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Filtrar eventos
  const filteredEventos = eventos.filter(evento =>
    evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Salvar evento
  const saveEvento = async () => {
    if (!formData.nome.trim()) {
      alert("Por favor, preencha o nome do evento");
      return;
    }

    try {
      // Simular salvamento
      if (editingId) {
        setEventos(prev => prev.map(evento => 
          evento.id === editingId 
            ? { ...evento, ...formData }
            : evento
        ));
      } else {
        const novoEvento = {
          id: Date.now(),
          ...formData
        };
        setEventos(prev => [...prev, novoEvento]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar evento');
    }
  };

  // Editar evento
  const editEvento = (evento: Evento) => {
    setEditingId(evento.id);
    setFormData({
      nome: evento.nome,
      descricao: evento.descricao,
      categoria: evento.categoria,
      status: evento.status
    });
  };

  // Deletar evento
  const deleteEvento = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      setEventos(prev => prev.filter(evento => evento.id !== id));
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar evento');
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nome: "",
      descricao: "",
      categoria: "Culto",
      status: "ativo"
    });
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-full mb-4">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Eventos
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Cadastre e gerencie tipos de eventos e cultos
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingId ? 'Editar Evento' : 'Novo Evento'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do evento' : 'Adicione um novo tipo de evento'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Evento</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Culto de Domingo"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o evento..."
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveEvento} className="flex-1">
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

          {/* Lista de Eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Eventos Cadastrados
              </CardTitle>
              <CardDescription>
                {filteredEventos.length} evento{filteredEventos.length !== 1 ? 's' : ''} encontrado{filteredEventos.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar eventos..."
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
                  <p className="text-muted-foreground">Carregando eventos...</p>
                </div>
              )}

              {/* Lista */}
              {!loading && (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredEventos.map((evento) => (
                    <div
                      key={evento.id}
                      className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-950/10 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{evento.nome}</h3>
                            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                              {evento.categoria}
                            </Badge>
                            <Badge variant={evento.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                              {evento.status}
                            </Badge>
                          </div>
                          
                          {evento.descricao && (
                            <p className="text-sm text-muted-foreground">
                              {evento.descricao}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editEvento(evento)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteEvento(evento.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredEventos.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento cadastrado'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informação Adicional */}
        <div className="mt-8">
          <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-border/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                💡 Sobre os Eventos
              </h3>
              <p className="text-muted-foreground mb-4">
                Os tipos de eventos são usados para categorizar os cultos e atividades da igreja. 
                Você pode criar novos tipos ou editar os existentes conforme necessário.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {categorias.map(categoria => (
                  <Badge key={categoria} variant="outline" className="justify-center">
                    {categoria}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
