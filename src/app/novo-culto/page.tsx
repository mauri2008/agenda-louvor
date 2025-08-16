"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Music, Users, Mic, Plus, X, Save, Search, Check, ArrowLeft } from "lucide-react";
import { useAgendaData } from "@/hooks/useAgendaData";

interface Cantor {
    id: number;
    nome: string;
    funcao: string;
}

interface Instrumento {
    id: number;
    instrumento: string;
    musico: string;
}

interface Louvor {
    id: number;
    nome: string;
    tom: string;
    duracao: string;
    categoria: string;
    linkLouvor?: string;
    linkCifra?: string;
    tipoLink?: string;
}

interface FormData {
    data: string;
    diaSemana: string;
    horario: string;
    tipo: string;
    status: string;
    cantores: Cantor[];
    banda: {
        instrumentos: Instrumento[];
    };
    louvores: Louvor[];
    novosLouvores?: Louvor[];
    novosCantores?: Cantor[];
    novosMusicos?: { id: number; nome: string; funcao: string }[];
}

export default function NovoCulto() {
    const { louvores, cantores, musicos, searchLouvores, searchCantores, searchMusicos } = useAgendaData();
    const [isClient, setIsClient] = useState(false);
    
    const [formData, setFormData] = useState<FormData>(() => ({
        data: "",
        diaSemana: "",
        horario: "",
        tipo: "Culto de Domingo",
        status: "agendado",
        cantores: [],
        banda: {
            instrumentos: []
        },
        louvores: []
    }));

    // Garantir que o componente só renderize no cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Estados para seleção de cantores, músicos e louvores
    const [selectedCantor, setSelectedCantor] = useState<Cantor | null>(null);
    const [selectedMusico, setSelectedMusico] = useState<{ id: number; nome: string; funcao: string } | null>(null);
    const [selectedLouvor, setSelectedLouvor] = useState<Louvor | null>(null);
    const [selectedInstrumento, setSelectedInstrumento] = useState("");

    // Estados para autocomplete de louvores
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<Louvor[]>(() => []);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    // Estados para autocomplete de cantores
    const [searchTermCantor, setSearchTermCantor] = useState("");
    const [showSuggestionsCantor, setShowSuggestionsCantor] = useState(false);
    const [suggestionsCantor, setSuggestionsCantor] = useState<Cantor[]>(() => []);
    const [selectedSuggestionIndexCantor, setSelectedSuggestionIndexCantor] = useState(-1);

    // Estados para autocomplete de músicos
    const [searchTermMusico, setSearchTermMusico] = useState("");
    const [showSuggestionsMusico, setShowSuggestionsMusico] = useState(false);
    const [suggestionsMusico, setSuggestionsMusico] = useState<{ id: number; nome: string; funcao: string }[]>(() => []);
    const [selectedSuggestionIndexMusico, setSelectedSuggestionIndexMusico] = useState(-1);
    const [instrumentoIdCounter, setInstrumentoIdCounter] = useState(1);

    const instrumentosDisponiveis = ["Guitarra", "Bateria", "Violão 1", "Violão 2", "Teclado", "Contra Baixo"];
    const categorias = ["Adoração", "Louvor", "Hino"];
    const funcoesCantor = ["Vocal Principal", "Back Vocal"];

    const tiposLink = [
        { value: "youtube", label: "YouTube", icon: "🎵" },
        { value: "spotify", label: "Spotify", icon: "🎧" },
        { value: "deezer", label: "Deezer", icon: "🎼" }
    ];

    // Função para buscar louvores na base de dados
    const buscarLouvores = async (termo: string) => {
        if (!termo.trim()) {
            setSuggestions([]);
            return;
        }

        const resultados = await searchLouvores(termo);
        setSuggestions(resultados);
    };

    // Função para buscar cantores na base de dados
    const buscarCantores = async (termo: string) => {
        if (!termo.trim()) {
            setSuggestionsCantor([]);
            return;
        }

        const resultados = await searchCantores(termo);
        setSuggestionsCantor(resultados);
    };

    // Função para buscar músicos na base de dados
    const buscarMusicos = async (termo: string) => {
        if (!termo.trim()) {
            setSuggestionsMusico([]);
            return;
        }

        const resultados = await searchMusicos(termo);
        setSuggestionsMusico(resultados);
    };

    // Função para selecionar um louvor da sugestão
    const selecionarLouvor = (louvor: Louvor) => {
        setSelectedLouvor(louvor);
        setSearchTerm(louvor.nome);
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
    };

    // Função para selecionar um cantor da sugestão
    const selecionarCantor = (cantor: Cantor) => {
        setSelectedCantor(cantor);
        setSearchTermCantor(cantor.nome);
        setShowSuggestionsCantor(false);
        setSuggestionsCantor([]);
        setSelectedSuggestionIndexCantor(-1);
    };

    // Função para selecionar um músico da sugestão
    const selecionarMusico = (musico: { id: number; nome: string; funcao: string }) => {
        setSelectedMusico(musico);
        setSearchTermMusico(musico.nome);
        setShowSuggestionsMusico(false);
        setSuggestionsMusico([]);
        setSelectedSuggestionIndexMusico(-1);
    };

    // Função para lidar com mudanças no campo de busca
    const handleSearchChange = async (value: string) => {
        setSearchTerm(value);

        if (value.trim()) {
            await buscarLouvores(value);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    // Função para lidar com mudanças no campo de busca de cantores
    const handleSearchChangeCantor = async (value: string) => {
        setSearchTermCantor(value);

        if (value.trim()) {
            await buscarCantores(value);
            setShowSuggestionsCantor(true);
        } else {
            setShowSuggestionsCantor(false);
            setSuggestionsCantor([]);
        }
    };

    // Função para lidar com mudanças no campo de busca de músicos
    const handleSearchChangeMusico = async (value: string) => {
        setSearchTermMusico(value);

        if (value.trim()) {
            await buscarMusicos(value);
            setShowSuggestionsMusico(true);
        } else {
            setShowSuggestionsMusico(false);
            setSuggestionsMusico([]);
        }
    };

    // Função para lidar com navegação por teclado
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                    selecionarLouvor(suggestions[selectedSuggestionIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSuggestions([]);
                setSelectedSuggestionIndex(-1);
                break;
        }
    };

    // Função para lidar com navegação por teclado para cantores
    const handleKeyDownCantor = (e: React.KeyboardEvent) => {
        if (!showSuggestionsCantor) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndexCantor(prev =>
                    prev < suggestionsCantor.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndexCantor(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndexCantor >= 0 && suggestionsCantor[selectedSuggestionIndexCantor]) {
                    selecionarCantor(suggestionsCantor[selectedSuggestionIndexCantor]);
                }
                break;
            case 'Escape':
                setShowSuggestionsCantor(false);
                setSuggestionsCantor([]);
                setSelectedSuggestionIndexCantor(-1);
                break;
        }
    };

    // Função para lidar com navegação por teclado para músicos
    const handleKeyDownMusico = (e: React.KeyboardEvent) => {
        if (!showSuggestionsMusico) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndexMusico(prev =>
                    prev < suggestionsMusico.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndexMusico(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndexMusico >= 0 && suggestionsMusico[selectedSuggestionIndexMusico]) {
                    selecionarMusico(suggestionsMusico[selectedSuggestionIndexMusico]);
                }
                break;
            case 'Escape':
                setShowSuggestionsMusico(false);
                setSuggestionsMusico([]);
                setSelectedSuggestionIndexMusico(-1);
                break;
        }
    };

    // Função para adicionar louvor selecionado
    const adicionarLouvor = () => {
        if (selectedLouvor) {
            setFormData(prev => ({
                ...prev,
                louvores: [...prev.louvores, selectedLouvor]
            }));

            // Limpar seleção
            setSelectedLouvor(null);
            setSearchTerm("");
            setShowSuggestions(false);
            setSuggestions([]);
            setSelectedSuggestionIndex(-1);
        }
    };

    const adicionarCantor = () => {
        if (selectedCantor) {
            setFormData(prev => ({
                ...prev,
                cantores: [...prev.cantores, selectedCantor]
            }));
            setSelectedCantor(null);
            setSearchTermCantor("");
            setShowSuggestionsCantor(false);
            setSuggestionsCantor([]);
            setSelectedSuggestionIndexCantor(-1);
        }
    };

    const removerCantor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            cantores: prev.cantores.filter((_, i) => i !== index)
        }));
    };

    const adicionarInstrumento = () => {
        if (selectedMusico && selectedInstrumento) {
            const instrumentoParaAdicionar = {
                id: instrumentoIdCounter,
                instrumento: selectedInstrumento,
                musico: selectedMusico.nome
            };

            setFormData(prev => ({
                ...prev,
                banda: {
                    ...prev.banda,
                    instrumentos: [...prev.banda.instrumentos, instrumentoParaAdicionar]
                }
            }));
            setInstrumentoIdCounter(prev => prev + 1);
            setSelectedMusico(null);
            setSelectedInstrumento("");
            setSearchTermMusico("");
            setShowSuggestionsMusico(false);
            setSuggestionsMusico([]);
            setSelectedSuggestionIndexMusico(-1);
        }
    };

    const removerInstrumento = (index: number) => {
        setFormData(prev => ({
            ...prev,
            banda: {
                ...prev.banda,
                instrumentos: prev.banda.instrumentos.filter((_, i) => i !== index)
            }
        }));
    };

    const removerLouvor = (index: number) => {
        setFormData(prev => ({
            ...prev,
            louvores: prev.louvores.filter((_, i) => i !== index)
        }));
    };

    const salvarCulto = async () => {
        if (!formData.data || !formData.horario || formData.cantores.length === 0 || formData.banda.instrumentos.length === 0 || formData.louvores.length === 0) {
            if (typeof window !== 'undefined') {
                alert("Por favor, preencha todos os campos obrigatórios!");
            }
            return;
        }

        try {
            if (typeof window === 'undefined') return;
            
            const response = await fetch('/api/cultos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                if (typeof window !== 'undefined') {
                    alert("Culto salvo com sucesso!");
                }

                // Limpar formulário
                setFormData({
                    data: "",
                    diaSemana: "",
                    horario: "",
                    tipo: "Culto de Domingo",
                    status: "agendado",
                    cantores: [],
                    banda: {
                        instrumentos: []
                    },
                    louvores: []
                });
            } else {
                if (typeof window !== 'undefined') {
                    alert("Erro ao salvar culto: " + result.message);
                }
            }
        } catch (error) {
            if (typeof window !== 'undefined') {
                console.error('Erro ao salvar:', error);
                alert("Erro ao salvar culto. Tente novamente.");
            }
        }
    };

    // Não renderizar nada até estar no cliente
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Carregando...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-6">
                    {/* Botão Voltar */}
                    <div className="mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.history.back();
                                }
                            }}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground h-9 px-3"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Voltar</span>
                        </Button>
                    </div>

                    {/* Título Centralizado */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                            Novo Culto
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Cadastre um novo culto na agenda de louvores
                        </p>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                💡 <strong>Dica:</strong> Primeiro cadastre cantores, músicos e louvores na seção "Cadastros" 
                                para facilitar a criação de cultos.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informações Básicas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Informações Básicas
                            </CardTitle>
                            <CardDescription>
                                Defina a data, horário e tipo do culto
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="data">Data</Label>
                                    <Input
                                        id="data"
                                        type="date"
                                        value={formData.data}
                                        onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="horario">Horário</Label>
                                    <Input
                                        id="horario"
                                        type="time"
                                        value={formData.horario}
                                        onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="diaSemana">Dia da Semana</Label>
                                <Select value={formData.diaSemana} onValueChange={(value) => setFormData(prev => ({ ...prev, diaSemana: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o dia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Domingo">Domingo</SelectItem>
                                        <SelectItem value="Segunda">Segunda</SelectItem>
                                        <SelectItem value="Terça">Terça</SelectItem>
                                        <SelectItem value="Quarta">Quarta</SelectItem>
                                        <SelectItem value="Quinta">Quinta</SelectItem>
                                        <SelectItem value="Sexta">Sexta</SelectItem>
                                        <SelectItem value="Sábado">Sábado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="tipoEvento">Tipo do Evento</Label>
                                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Culto de Domingo">Culto de Domingo</SelectItem>
                                        <SelectItem value="Culto de Terça">Culto de Terça</SelectItem>
                                        <SelectItem value="Culto de Quinta">Culto de Quinta</SelectItem>
                                        <SelectItem value="Culto de Sexta">Culto de Sexta</SelectItem>
                                        <SelectItem value="Culto de Jovens">Culto de Jovens</SelectItem>
                                        <SelectItem value="Culto de Crianças">Culto de Crianças</SelectItem>
                                        <SelectItem value="Ensaio">Ensaio</SelectItem>
                                        <SelectItem value="Evento Especial">Evento Especial</SelectItem>
                                        <SelectItem value="Conferência">Conferência</SelectItem>
                                        <SelectItem value="Retiro">Retiro</SelectItem>
                                        <SelectItem value="Batismo">Batismo</SelectItem>
                                        <SelectItem value="Santa Ceia">Santa Ceia</SelectItem>
                                        <SelectItem value="Evangelismo">Evangelismo</SelectItem>
                                        <SelectItem value="Outros">Outros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cantores */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mic className="h-5 w-5" />
                                Cantores
                            </CardTitle>
                            <CardDescription>
                                Adicione os cantores que participarão
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <Label>Nome do Cantor</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Digite o nome do cantor..."
                                        value={searchTermCantor}
                                        onChange={(e) => handleSearchChangeCantor(e.target.value)}
                                        onKeyDown={handleKeyDownCantor}
                                        onFocus={() => {
                                            if (searchTermCantor.trim() && suggestionsCantor.length > 0) {
                                                setShowSuggestionsCantor(true);
                                            }
                                        }}
                                        onBlur={() => {
                                            // Delay para permitir cliques nas sugestões
                                            setTimeout(() => {
                                                if (!showSuggestionsCantor) {
                                                    setShowSuggestionsCantor(false);
                                                }
                                            }, 150);
                                        }}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Lista de sugestões para cantores */}
                                {showSuggestionsCantor && suggestionsCantor.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {suggestionsCantor.map((cantor, index) => (
                                            <div
                                                key={cantor.id}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${index === selectedSuggestionIndexCantor ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    selecionarCantor(cantor);
                                                }}
                                                onMouseDown={(e) => e.preventDefault()} // Previne blur do input
                                            >
                                                <div>
                                                    <div className="font-medium">{cantor.nome}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {cantor.funcao}
                                                    </div>
                                                </div>
                                                <Check className="h-4 w-4 text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" onClick={adicionarCantor} disabled={!selectedCantor}>
                                    <Plus className="h-4 w-4" />
                                    Adicionar Cantor
                                </Button>
                                {selectedCantor && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
                                        <Check className="h-4 w-4" />
                                        {selectedCantor.nome} selecionado
                                    </div>
                                )}

                            </div>

                            <div className="space-y-2">
                                {formData.cantores.map((cantor, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded border">
                                        <span className="text-sm">{cantor.nome} - {cantor.funcao}</span>
                                        <Button size="sm" variant="ghost" onClick={() => removerCantor(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Banda */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Banda
                            </CardTitle>
                            <CardDescription>
                                Configure a banda e instrumentos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">


                            <div className="space-y-2">
                                <Label>Instrumentos</Label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Nome do músico"
                                            value={searchTermMusico}
                                            onChange={(e) => handleSearchChangeMusico(e.target.value)}
                                            onKeyDown={handleKeyDownMusico}
                                            onFocus={() => {
                                                if (searchTermMusico.trim() && suggestionsMusico.length > 0) {
                                                    setShowSuggestionsMusico(true);
                                                }
                                            }}
                                            onBlur={() => {
                                                // Delay para permitir cliques nas sugestões
                                                setTimeout(() => setShowSuggestionsMusico(false), 200);
                                            }}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={selectedInstrumento} onValueChange={setSelectedInstrumento}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o instrumento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {instrumentosDisponiveis.map(instrumento => (
                                                <SelectItem key={instrumento} value={instrumento}>{instrumento}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="sm" onClick={adicionarInstrumento} disabled={!selectedMusico || !selectedInstrumento}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Músico
                                    </Button>
                                </div>

                                {/* Lista de sugestões para músicos */}
                                {showSuggestionsMusico && suggestionsMusico.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {suggestionsMusico.map((musico, index) => (
                                            <div
                                                key={musico.id}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${index === selectedSuggestionIndexMusico ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                                onClick={() => selecionarMusico(musico)}
                                            >
                                                <div>
                                                    <div className="font-medium">{musico.nome}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {musico.funcao}
                                                    </div>
                                                </div>
                                                <Check className="h-4 w-4 text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}


                            </div>

                            <div className="space-y-2">
                                {formData.banda.instrumentos.map((instrumento, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-950/20 rounded border">
                                        <span className="text-sm">{instrumento.instrumento} - {instrumento.musico}</span>
                                        <Button size="sm" variant="ghost" onClick={() => removerInstrumento(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Louvores */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Music className="h-5 w-5" />
                                Louvores
                            </CardTitle>
                            <CardDescription>
                                Adicione os louvores que serão cantados
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Campo de busca com autocomplete */}
                            <div className="relative">
                                <Label>Nome do Louvor</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Digite o nome do louvor..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => {
                                            if (searchTerm.trim() && suggestions.length > 0) {
                                                setShowSuggestions(true);
                                            }
                                        }}
                                        onBlur={() => {
                                            // Delay para permitir cliques nas sugestões
                                            setTimeout(() => setShowSuggestions(false), 200);
                                        }}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Lista de sugestões */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {suggestions.map((louvor, index) => (
                                            <div
                                                key={louvor.id}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${index === selectedSuggestionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                    }`}
                                                onClick={() => selecionarLouvor(louvor)}
                                            >
                                                <div>
                                                    <div className="font-medium">{louvor.nome}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {louvor.categoria} • Tom: {louvor.tom} • {louvor.duracao}
                                                        {(louvor.linkLouvor || louvor.linkCifra) && (
                                                            <div className="flex gap-1 mt-1">
                                                                {louvor.linkLouvor && (
                                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900 px-1 rounded">
                                                                        {louvor.tipoLink === 'youtube' && '🎵'}
                                                                        {louvor.tipoLink === 'spotify' && '🎧'}
                                                                        {louvor.tipoLink === 'deezer' && '🎼'}
                                                                    </span>
                                                                )}
                                                                {louvor.linkCifra && (
                                                                    <span className="text-xs bg-green-100 dark:bg-green-900 px-1 rounded">
                                                                        🎸
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <Check className="h-4 w-4 text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button onClick={adicionarLouvor} disabled={!selectedLouvor} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Louvor
                            </Button>

                            <div className="space-y-2">
                                {formData.louvores.map((louvor, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded border">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{louvor.nome}</span>
                                                {louvor.linkLouvor && (
                                                    <a
                                                        href={louvor.linkLouvor}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                                                    >
                                                        {louvor.tipoLink === 'youtube' && '🎵'}
                                                        {louvor.tipoLink === 'spotify' && '🎧'}
                                                        {louvor.tipoLink === 'deezer' && '🎼'}
                                                    </a>
                                                )}
                                                {louvor.linkCifra && (
                                                    <a
                                                        href={louvor.linkCifra}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-xs"
                                                        title="Link da cifra"
                                                    >
                                                        🎸
                                                    </a>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {louvor.categoria} • {louvor.duracao} • Tom: {louvor.tom}
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => removerLouvor(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Botão Salvar */}
                <div className="mt-8 text-center">
                    <Button size="lg" onClick={salvarCulto} className="px-8">
                        <Save className="h-5 w-5 mr-2" />
                        Salvar Culto
                    </Button>
                </div>
            </div>
        </div>
    );
} 