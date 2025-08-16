"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Music, Users, Mic, Clock, Guitar, Drum, Piano, Guitar as Bass, Plus, ExternalLink, Search, X, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useAgendaData } from "@/hooks/useAgendaData";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import UpdateNotification from "@/components/UpdateNotification";

// Função para obter o ícone do instrumento
const getInstrumentIcon = (instrumento: string) => {
  switch (instrumento.toLowerCase()) {
    case 'guitarra':
      return <Guitar className="h-4 w-4" />;
    case 'bateria':
      return <Drum className="h-4 w-4" />;
    case 'teclado':
      return <Piano className="h-4 w-4" />;
    case 'contra baixo':
      return <Bass className="h-4 w-4" />;
    default:
      return <Guitar className="h-4 w-4" />;
  }
};

export default function Home() {
  const { cultos, loading, error, fetchCultosFuturos } = useAgendaData();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCultosFuturos();
    setRefreshing(false);
  };

  // Função para filtrar cultos baseado no termo de busca
  const filteredCultos = useMemo(() => {
    if (!searchTerm.trim()) return cultos;

    const term = searchTerm.toLowerCase().trim();

    return cultos.filter(culto => {
      // Buscar por nome dos cantores
      const cantoresMatch = culto.cantores.some(cantor =>
        cantor.nome.toLowerCase().includes(term)
      );

      // Buscar por nome dos músicos da banda
      const musicosMatch = culto.banda.instrumentos.some(instrumento =>
        instrumento.musico.toLowerCase().includes(term)
      );

      // Buscar por nome dos louvores
      const louvoresMatch = culto.louvores.some(louvor =>
        louvor.nome.toLowerCase().includes(term)
      );

      return cantoresMatch || musicosMatch || louvoresMatch;
    });
  }, [cultos, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-4 relative">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 mb-6">
          <div className="flex items-center justify-between py-3 px-4">
            {/* Left side - Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full shadow-sm">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Agenda de Louvores
                </h1>
                <p className="text-xs text-muted-foreground">
                  Organize e gerencie os cultos
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Agenda
                </h1>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-9 w-9 p-0"
                title="Atualizar"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <div className="hidden md:flex items-center gap-2">
                <Link href="/cadastros">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-3 text-sm"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Cadastros
                  </Button>
                </Link>
                <Link href="/novo-culto">
                  <Button
                    size="sm"
                    className="h-9 px-3 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Culto
                  </Button>
                </Link>
              </div>

              {/* Mobile menu */}
              <div className="md:hidden flex items-center gap-1">
                <Link href="/cadastros">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0"
                    title="Cadastros"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/novo-culto">
                  <Button
                    size="sm"
                    className="h-9 w-9 p-0"
                    title="Novo Culto"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Filtro de busca */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por cantor, músico ou louvor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-center">
                <span className="text-sm text-muted-foreground">
                  {filteredCultos.length} resultado{filteredCultos.length !== 1 ? 's' : ''} encontrado{filteredCultos.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Carregando cultos...
            </h3>
            <p className="text-muted-foreground text-lg">
              Aguarde enquanto buscamos os dados do banco de dados.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Erro ao carregar dados
            </h3>
            <p className="text-muted-foreground text-lg mb-8">
              {error}
            </p>
            <Button onClick={() => window.location.reload()} size="lg">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Lista de Cards */}
        {!loading && !error && filteredCultos.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCultos.map((culto) => (
              <Card key={culto.id} className="group hover:shadow-2xl duration-500 border-border/50 hover:border-primary/40 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground mb-1"> {culto.tipo}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="font-medium">{culto.dia_semana}</span>
                          <span>•</span>
                          <span>{new Date(culto.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-2 text-xs px-3 py-1 bg-secondary/20 border-secondary/30">
                      <Clock className="h-3 w-3" />
                      {culto.horario}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Cantores */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-lg shadow-sm">
                        <Mic className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        Cantores
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {culto.cantores.map((cantor, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-3 py-1 hover:scale-105 transition-transform">
                          {cantor.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Banda */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 rounded-lg shadow-sm">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        Banda
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
                    </div>

                    {/* Instrumentos */}
                    <div className="grid grid-cols-2 gap-2">
                      {culto.banda.instrumentos.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-950/20 rounded-lg text-xs border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-indigo-500/10 rounded-md">
                              {getInstrumentIcon(item.instrumento)}
                            </div>
                            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                              {item.instrumento}
                            </span>
                          </div>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate ml-2">
                            {item.musico}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Louvores */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-lg shadow-sm">
                        <Music className="h-5 w-5 text-amber-600" />
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        Louvores
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent"></div>
                    </div>
                    <div className="space-y-3">
                      {culto.louvores.map((louvor, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-950/10 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-bold text-foreground mb-1">
                              {louvor.nome}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-2">
                              <span className="font-medium">{louvor.categoria}</span>
                              <span>•</span>
                              <span>{louvor.duracao}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs font-mono bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-3 py-1">
                              Tom: {louvor.tom}
                            </Badge>
                            <div className="flex gap-2">
                              {(louvor as any).linkLouvor && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:scale-110 transition-transform"
                                  onClick={() => window.open((louvor as any).linkLouvor, '_blank')}
                                  title={`Link do louvor (${(louvor as any).tipoLink === 'youtube' ? 'YouTube' : (louvor as any).tipoLink === 'spotify' ? 'Spotify' : 'Deezer'})`}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                              {(louvor as any).linkCifra && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:scale-110 transition-transform"
                                  onClick={() => window.open((louvor as any).linkCifra, '_blank')}
                                  title="Link da cifra"
                                >
                                  <Guitar className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full shadow-lg">
                {searchTerm ? (
                  <Search className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full blur-sm"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-secondary/20 rounded-full blur-sm"></div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum culto agendado'}
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? `Nenhum culto encontrado para "${searchTerm}". Tente buscar por outro termo.`
                : 'Não há cultos futuros agendados. Cadastre um novo culto para começar a organizar a programação.'
              }
            </p>
            {!searchTerm && (
              <Link href="/novo-culto">
                <Button size="lg" className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-6 w-6 mr-3" />
                  Cadastrar Primeiro Culto
                </Button>
              </Link>
            )}
          </div>
        ) : null}

        {/* Footer */}
        <footer className="text-center mt-20 pt-12 border-t border-border/50">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Agenda de Louvores</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <p className="text-muted-foreground text-sm">
              Sistema de Gerenciamento - Powered by Supabase
            </p>
          </div>
        </footer>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Update Notification */}
      <UpdateNotification />
    </div>
  );
}
