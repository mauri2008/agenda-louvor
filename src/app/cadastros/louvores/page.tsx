"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Plus, Edit, Trash2, Search, X, Save, Loader2, ExternalLink, Guitar } from "lucide-react";
import { Louvor } from "@/types/database";

export default function LouvoresPage() {
  const [louvores, setLouvores] = useState<Louvor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    tom: "",
    duracao: "",
    categoria: "Louvor",
    letra: "",
    status: "ativo",
    linkLouvor: "",
    linkCifra: "",
    tipoLink: "youtube"
  });

  const categorias = ["Adoração", "Louvor", "Hino", "Coral", "Especial"];
  const statusOptions = ["ativo", "inativo"];
  const tiposLink = [
    { value: "youtube", label: "YouTube", icon: "🎵" },
    { value: "spotify", label: "Spotify", icon: "🎧" },
    { value: "deezer", label: "Deezer", icon: "🎼" }
  ];

  // Carregar louvores
  const fetchLouvores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/louvores');
      if (!response.ok) throw new Error('Erro ao carregar louvores');
      const data = await response.json();
      setLouvores(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLouvores();
  }, []);

  // Filtrar louvores
  const filteredLouvores = louvores.filter(louvor =>
    louvor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    louvor.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    louvor.tom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Salvar louvor
  const saveLouvor = async () => {
    if (!formData.nome.trim() || !formData.tom.trim() || !formData.duracao.trim()) {
      alert("Por favor, preencha nome, tom e duração do louvor");
      return;
    }

    try {
      const url = editingId ? `/api/louvores/${editingId}` : '/api/louvores';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          tom: formData.tom,
          duracao: formData.duracao,
          categoria: formData.categoria,
          letra: formData.letra,
          status: formData.status,
          link_louvor: formData.linkLouvor,
          link_cifra: formData.linkCifra,
          tipo_link: formData.tipoLink
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar louvor');

      await fetchLouvores();
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar louvor');
    }
  };

  // Editar louvor
  const editLouvor = (louvor: Louvor) => {
    setEditingId(louvor.id);
    setFormData({
      nome: louvor.nome,
      tom: louvor.tom,
      duracao: louvor.duracao,
      categoria: louvor.categoria,
      letra: louvor.letra || "",
      status: louvor.status,
      linkLouvor: louvor.link_louvor || "",
      linkCifra: louvor.link_cifra || "",
      tipoLink: louvor.tipo_link || "youtube"
    });
  };

  // Deletar louvor
  const deleteLouvor = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este louvor?')) return;

    try {
      const response = await fetch(`/api/louvores/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar louvor');

      await fetchLouvores();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar louvor');
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nome: "",
      tom: "",
      duracao: "",
      categoria: "Louvor",
      letra: "",
      status: "ativo",
      linkLouvor: "",
      linkCifra: "",
      tipoLink: "youtube"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-full mb-4">
              <Music className="h-6 w-6 text-amber-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Louvores
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Cadastre e gerencie o repertório de louvores
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingId ? 'Editar Louvor' : 'Novo Louvor'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Edite as informações do louvor' : 'Adicione um novo louvor'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Louvor</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome do louvor"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tom">Tom</Label>
                  <Input
                    id="tom"
                    placeholder="Ex: C, D, G"
                    value={formData.tom}
                    onChange={(e) => setFormData(prev => ({ ...prev, tom: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duracao">Duração</Label>
                  <Input
                    id="duracao"
                    placeholder="Ex: 4:30"
                    value={formData.duracao}
                    onChange={(e) => setFormData(prev => ({ ...prev, duracao: e.target.value }))}
                  />
                </div>
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

              <div>
                <Label htmlFor="letra">Letra (Opcional)</Label>
                <Textarea
                  id="letra"
                  placeholder="Digite a letra do louvor..."
                  value={formData.letra}
                  onChange={(e) => setFormData(prev => ({ ...prev, letra: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Links */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Links (Opcional)</Label>
                
                <div className="grid grid-cols-3 gap-2">
                  <Select value={formData.tipoLink} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoLink: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposLink.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          <span className="flex items-center gap-2">
                            <span>{tipo.icon}</span>
                            {tipo.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Link do louvor"
                    value={formData.linkLouvor}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkLouvor: e.target.value }))}
                    className="col-span-2"
                  />
                </div>
                
                <Input
                  placeholder="Link da cifra (opcional)"
                  value={formData.linkCifra}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkCifra: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveLouvor} className="flex-1">
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

          {/* Lista de Louvores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Louvores Cadastrados
              </CardTitle>
              <CardDescription>
                {filteredLouvores.length} louvor{filteredLouvores.length !== 1 ? 'es' : ''} encontrado{filteredLouvores.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar louvores..."
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
                  <p className="text-muted-foreground">Carregando louvores...</p>
                </div>
              )}

              {/* Lista */}
              {!loading && (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredLouvores.map((louvor) => (
                    <div
                      key={louvor.id}
                      className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-950/10 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{louvor.nome}</h3>
                            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                              {louvor.categoria}
                            </Badge>
                            <Badge variant={louvor.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                              {louvor.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-2">
                            <span className="font-mono">Tom: {louvor.tom}</span>
                            <span className="mx-2">•</span>
                            <span>{louvor.duracao}</span>
                          </div>

                          <div className="flex gap-2">
                            {louvor.link_louvor && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={() => window.open(louvor.link_louvor, '_blank')}
                                title={`Link do louvor (${louvor.tipo_link === 'youtube' ? 'YouTube' : louvor.tipo_link === 'spotify' ? 'Spotify' : 'Deezer'})`}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {louvor.tipo_link === 'youtube' && '🎵'}
                                {louvor.tipo_link === 'spotify' && '🎧'}
                                {louvor.tipo_link === 'deezer' && '🎼'}
                              </Button>
                            )}
                            {louvor.link_cifra && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                                onClick={() => window.open(louvor.link_cifra, '_blank')}
                                title="Link da cifra"
                              >
                                <Guitar className="h-3 w-3 mr-1" />
                                🎸
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editLouvor(louvor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteLouvor(louvor.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredLouvores.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'Nenhum louvor encontrado' : 'Nenhum louvor cadastrado'}
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
