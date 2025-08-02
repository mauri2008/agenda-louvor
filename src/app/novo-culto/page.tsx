"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Music, Users, Mic, Plus, X, Save, Search, Check, ArrowLeft } from "lucide-react";
import dadosAgenda from "@/data/agenda-louvores.json";

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
    novosLouvores?: any[];
    novosCantores?: any[];
    novosMusicos?: any[];
}

export default function NovoCulto() {
    const [formData, setFormData] = useState<FormData>({
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

    const [novoCantor, setNovoCantor] = useState({ nome: "", funcao: "Vocal Principal" });
    const [novoInstrumento, setNovoInstrumento] = useState({ instrumento: "", musico: "" });
    const [novoLouvor, setNovoLouvor] = useState({
        nome: "",
        tom: "",
        duracao: "",
        categoria: "Louvor",
        linkLouvor: "",
        linkCifra: "",
        tipoLink: "youtube"
    });

    // Estados para autocomplete de louvores
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<Louvor[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    // Estados para autocomplete de cantores
    const [searchTermCantor, setSearchTermCantor] = useState("");
    const [showSuggestionsCantor, setShowSuggestionsCantor] = useState(false);
    const [suggestionsCantor, setSuggestionsCantor] = useState<Cantor[]>([]);
    const [selectedSuggestionIndexCantor, setSelectedSuggestionIndexCantor] = useState(-1);

    // Estados para autocomplete de músicos
    const [searchTermMusico, setSearchTermMusico] = useState("");
    const [showSuggestionsMusico, setShowSuggestionsMusico] = useState(false);
    const [suggestionsMusico, setSuggestionsMusico] = useState<any[]>([]);
    const [selectedSuggestionIndexMusico, setSelectedSuggestionIndexMusico] = useState(-1);

    const instrumentosDisponiveis = ["Guitarra", "Bateria", "Violão 1", "Violão 2", "Teclado", "Contra Baixo"];
    const categorias = ["Adoração", "Louvor", "Hino"];
    const funcoesCantor = ["Vocal Principal", "Back Vocal"];

    const tiposLink = [
        { value: "youtube", label: "YouTube", icon: "🎵" },
        { value: "spotify", label: "Spotify", icon: "🎧" },
        { value: "deezer", label: "Deezer", icon: "🎼" }
    ];

    // Função para buscar louvores na base de dados
    const buscarLouvores = (termo: string) => {
        if (!termo.trim()) {
            setSuggestions([]);
            return;
        }

        const louvoresExistentes = dadosAgenda.louvores || [];
        const resultados = louvoresExistentes.filter(louvor =>
            louvor.nome.toLowerCase().includes(termo.toLowerCase())
        );
        setSuggestions(resultados);
    };

    // Função para buscar cantores na base de dados
    const buscarCantores = (termo: string) => {
        if (!termo.trim()) {
            setSuggestionsCantor([]);
            return;
        }

        const cantoresExistentes = dadosAgenda.membros?.cantores || [];
        const resultados = cantoresExistentes.filter(cantor =>
            cantor.nome.toLowerCase().includes(termo.toLowerCase())
        );
        setSuggestionsCantor(resultados);
    };

    // Função para buscar músicos na base de dados
    const buscarMusicos = (termo: string) => {
        if (!termo.trim()) {
            setSuggestionsMusico([]);
            return;
        }

        const musicosExistentes = dadosAgenda.membros?.musicos || [];
        const resultados = musicosExistentes.filter(musico =>
            musico.nome.toLowerCase().includes(termo.toLowerCase())
        );
        setSuggestionsMusico(resultados);
    };

    // Função para selecionar um louvor da sugestão
    const selecionarLouvor = (louvor: Louvor) => {
        setNovoLouvor({
            nome: louvor.nome,
            tom: louvor.tom,
            duracao: louvor.duracao,
            categoria: louvor.categoria,
            linkLouvor: louvor.linkLouvor || "",
            linkCifra: louvor.linkCifra || "",
            tipoLink: louvor.tipoLink || "youtube"
        });
        setSearchTerm(louvor.nome);
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
    };

    // Função para selecionar um cantor da sugestão
    const selecionarCantor = (cantor: Cantor) => {
        setNovoCantor({
            nome: cantor.nome,
            funcao: cantor.funcao
        });
        setSearchTermCantor(cantor.nome);
        setShowSuggestionsCantor(false);
        setSuggestionsCantor([]);
        setSelectedSuggestionIndexCantor(-1);
    };

    // Função para selecionar um músico da sugestão
    const selecionarMusico = (musico: any) => {
        setNovoInstrumento({
            instrumento: novoInstrumento.instrumento,
            musico: musico.nome
        });
        setSearchTermMusico(musico.nome);
        setShowSuggestionsMusico(false);
        setSuggestionsMusico([]);
        setSelectedSuggestionIndexMusico(-1);
    };

    // Função para lidar com mudanças no campo de busca
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setNovoLouvor(prev => ({ ...prev, nome: value }));

        if (value.trim()) {
            buscarLouvores(value);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    // Função para lidar com mudanças no campo de busca de cantores
    const handleSearchChangeCantor = (value: string) => {
        setSearchTermCantor(value);
        setNovoCantor(prev => ({ ...prev, nome: value }));

        if (value.trim()) {
            buscarCantores(value);
            setShowSuggestionsCantor(true);
        } else {
            setShowSuggestionsCantor(false);
            setSuggestionsCantor([]);
        }
    };

    // Função para lidar com mudanças no campo de busca de músicos
    const handleSearchChangeMusico = (value: string) => {
        setSearchTermMusico(value);
        setNovoInstrumento(prev => ({ ...prev, musico: value }));

        if (value.trim()) {
            buscarMusicos(value);
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

    // Função para adicionar novo louvor (seja existente ou novo)
    const adicionarLouvor = () => {
        if (novoLouvor.nome && novoLouvor.tom) {
            // Se o louvor não existe na base, criar um novo
            const louvorExistente = dadosAgenda.louvores?.find(
                l => l.nome.toLowerCase() === novoLouvor.nome.toLowerCase()
            );

            const louvorParaAdicionar = louvorExistente
                ? { ...louvorExistente, id: Date.now() }
                : {
                    ...novoLouvor,
                    id: Date.now(),
                    letra: "",
                    status: "ativo"
                };

            // Se o louvor não existe, adicionar à base de dados
            if (!louvorExistente) {
                const novoLouvorParaBase = {
                    id: Date.now(),
                    nome: novoLouvor.nome,
                    tom: novoLouvor.tom,
                    duracao: novoLouvor.duracao,
                    categoria: novoLouvor.categoria,
                    letra: "",
                    status: "ativo",
                    linkLouvor: novoLouvor.linkLouvor || "",
                    linkCifra: novoLouvor.linkCifra || "",
                    tipoLink: novoLouvor.tipoLink || "youtube"
                };

                // Adicionar à base de dados (simulado)
                console.log("Novo louvor adicionado à base:", novoLouvorParaBase);
            }

            setFormData(prev => ({
                ...prev,
                louvores: [...prev.louvores, louvorParaAdicionar]
            }));

            // Limpar campos
            setNovoLouvor({
                nome: "",
                tom: "",
                duracao: "",
                categoria: "Louvor",
                linkLouvor: "",
                linkCifra: "",
                tipoLink: "youtube"
            });
            setSearchTerm("");
            setShowSuggestions(false);
            setSuggestions([]);
            setSelectedSuggestionIndex(-1);
        }
    };

    const adicionarCantor = () => {
        if (novoCantor.nome.trim()) {
            // Se o cantor não existe na base, criar um novo
            const cantorExistente = dadosAgenda.membros?.cantores?.find(
                c => c.nome.toLowerCase() === novoCantor.nome.toLowerCase()
            );

            const cantorParaAdicionar = cantorExistente
                ? { ...cantorExistente, id: Date.now() }
                : { ...novoCantor, id: Date.now() };

            // Se o cantor não existe, adicionar à base de dados
            if (!cantorExistente) {
                const novoCantorParaBase = {
                    id: Date.now(),
                    nome: novoCantor.nome,
                    funcao: novoCantor.funcao
                };

                // Adicionar à base de dados (simulado)
                console.log("Novo cantor adicionado à base:", novoCantorParaBase);
            }

            setFormData(prev => ({
                ...prev,
                cantores: [...prev.cantores, cantorParaAdicionar]
            }));
            setNovoCantor({ nome: "", funcao: "Vocal Principal" });
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
        if (novoInstrumento.instrumento && novoInstrumento.musico) {
            // Se o músico não existe na base, criar um novo
            const musicoExistente = dadosAgenda.membros?.musicos?.find(
                m => m.nome.toLowerCase() === novoInstrumento.musico.toLowerCase()
            );

            const instrumentoParaAdicionar = {
                id: Date.now(),
                instrumento: novoInstrumento.instrumento,
                musico: novoInstrumento.musico
            };

            // Se o músico não existe, adicionar à base de dados
            if (!musicoExistente) {
                const novoMusicoParaBase = {
                    id: Date.now(),
                    nome: novoInstrumento.musico,
                    funcao: novoInstrumento.instrumento
                };

                // Adicionar à base de dados (simulado)
                console.log("Novo músico adicionado à base:", novoMusicoParaBase);
            }

            setFormData(prev => ({
                ...prev,
                banda: {
                    ...prev.banda,
                    instrumentos: [...prev.banda.instrumentos, instrumentoParaAdicionar]
                }
            }));
            setNovoInstrumento({ instrumento: "", musico: "" });
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
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }

        try {
            // Preparar dados para salvar incluindo novos louvores, cantores e músicos
            const dadosParaSalvar = {
                ...formData,
                novosLouvores: [], // Será preenchido com louvores que não existem na base
                novosCantores: [], // Será preenchido com cantores que não existem na base
                novosMusicos: []   // Será preenchido com músicos que não existem na base
            };

            // Verificar louvores novos
            formData.louvores.forEach(louvor => {
                const louvorExistente = dadosAgenda.louvores?.find(
                    l => l.nome.toLowerCase() === louvor.nome.toLowerCase()
                );
                if (!louvorExistente) {
                    (dadosParaSalvar.novosLouvores as any[]).push({
                        id: louvor.id,
                        nome: louvor.nome,
                        tom: louvor.tom,
                        duracao: louvor.duracao,
                        categoria: louvor.categoria,
                        letra: "",
                        status: "ativo",
                        linkLouvor: louvor.linkLouvor || "",
                        linkCifra: louvor.linkCifra || "",
                        tipoLink: louvor.tipoLink || "youtube"
                    });
                }
            });

            // Verificar cantores novos
            formData.cantores.forEach(cantor => {
                const cantorExistente = dadosAgenda.membros?.cantores?.find(
                    c => c.nome.toLowerCase() === cantor.nome.toLowerCase()
                );
                if (!cantorExistente) {
                    (dadosParaSalvar.novosCantores as any[]).push({
                        id: cantor.id,
                        nome: cantor.nome,
                        funcao: cantor.funcao
                    });
                }
            });

            // Verificar músicos novos
            formData.banda.instrumentos.forEach(instrumento => {
                const musicoExistente = dadosAgenda.membros?.musicos?.find(
                    m => m.nome.toLowerCase() === instrumento.musico.toLowerCase()
                );
                if (!musicoExistente) {
                    (dadosParaSalvar.novosMusicos as any[]).push({
                        id: instrumento.id,
                        nome: instrumento.musico,
                        funcao: instrumento.instrumento
                    });
                }
            });

            const response = await fetch('/api/cultos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaSalvar),
            });

            const result = await response.json();

            if (result.success) {
                alert("Culto salvo com sucesso!");

                // Mostrar informações sobre novos dados adicionados
                let mensagem = "Culto salvo com sucesso!";
                if (dadosParaSalvar.novosLouvores.length > 0) {
                    mensagem += `\n\n${dadosParaSalvar.novosLouvores.length} novo(s) louvor(es) adicionado(s) à base de dados.`;
                }
                if (dadosParaSalvar.novosCantores.length > 0) {
                    mensagem += `\n${dadosParaSalvar.novosCantores.length} novo(s) cantor(es) adicionado(s) à base de dados.`;
                }
                if (dadosParaSalvar.novosMusicos.length > 0) {
                    mensagem += `\n${dadosParaSalvar.novosMusicos.length} novo(s) músico(s) adicionado(s) à base de dados.`;
                }

                alert(mensagem);

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
                alert("Erro ao salvar culto: " + result.message);
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert("Erro ao salvar culto. Tente novamente.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    {/* Botão Voltar */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>
                    </div>

                    {/* Título Centralizado */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <Calendar className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-3">
                            Novo Culto
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Cadastre um novo culto na agenda de louvores
                        </p>
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
                                            setTimeout(() => setShowSuggestionsCantor(false), 200);
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
                                                onClick={() => selecionarCantor(cantor)}
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
                                <Select value={novoCantor.funcao} onValueChange={(value) => setNovoCantor(prev => ({ ...prev, funcao: value }))}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {funcoesCantor.map(funcao => (
                                            <SelectItem key={funcao} value={funcao}>{funcao}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button size="sm" onClick={adicionarCantor}>
                                    <Plus className="h-4 w-4" />
                                </Button>
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
                                <div className="flex items-center gap-2">
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
                                    <Select value={novoInstrumento.instrumento} onValueChange={(value) => setNovoInstrumento(prev => ({ ...prev, instrumento: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Instrumento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {instrumentosDisponiveis.map(instrumento => (
                                                <SelectItem key={instrumento} value={instrumento}>{instrumento}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="sm" className="w-20" onClick={adicionarInstrumento}>
                                        <Plus className="h-4 w-4" />
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

                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Tom (ex: C, D, G)"
                                    value={novoLouvor.tom}
                                    onChange={(e) => setNovoLouvor(prev => ({ ...prev, tom: e.target.value }))}
                                />
                                <Input
                                    placeholder="Duração (ex: 4:30)"
                                    value={novoLouvor.duracao}
                                    onChange={(e) => setNovoLouvor(prev => ({ ...prev, duracao: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Select value={novoLouvor.categoria} onValueChange={(value) => setNovoLouvor(prev => ({ ...prev, categoria: value }))}>
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

                            {/* Links do Louvor */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Links do Louvor (Opcional)</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Select value={novoLouvor.tipoLink} onValueChange={(value) => setNovoLouvor(prev => ({ ...prev, tipoLink: value }))}>
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
                                        value={novoLouvor.linkLouvor}
                                        onChange={(e) => setNovoLouvor(prev => ({ ...prev, linkLouvor: e.target.value }))}
                                        className="col-span-2"
                                    />
                                </div>
                                <Input
                                    placeholder="Link da cifra (opcional)"
                                    value={novoLouvor.linkCifra}
                                    onChange={(e) => setNovoLouvor(prev => ({ ...prev, linkCifra: e.target.value }))}
                                />
                            </div>
                            <Button onClick={adicionarLouvor} className="w-full">
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