"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Mic, Music, Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function CadastrosPage() {
  const cadastros = [
    {
      title: "Cantores",
      description: "Cadastre e gerencie os cantores da igreja",
      icon: Mic,
      href: "/cadastros/cantores",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      title: "Músicos",
      description: "Cadastre e gerencie os músicos e instrumentistas",
      icon: Users,
      href: "/cadastros/musicos",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Louvores",
      description: "Cadastre e gerencie o repertório de louvores",
      icon: Music,
      href: "/cadastros/louvores",
      color: "from-amber-500 to-amber-600",
      bgColor: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200"
    },
    {
      title: "Eventos",
      description: "Cadastre e gerencie tipos de eventos e cultos",
      icon: Calendar,
      href: "/cadastros/eventos",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          {/* Botão Voltar */}
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

          {/* Título Centralizado */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Cadastros
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Gerencie os dados da sua igreja
            </p>
          </div>
        </header>

        {/* Grid de Cadastros */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {cadastros.map((cadastro) => (
            <Link key={cadastro.href} href={cadastro.href}>
              <Card className="group hover:shadow-2xl duration-500 border-border/50 hover:border-primary/40 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl cursor-pointer transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 bg-gradient-to-br ${cadastro.bgColor} ${cadastro.borderColor} rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <cadastro.icon className={`h-8 w-8 bg-gradient-to-r ${cadastro.color} bg-clip-text text-transparent`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {cadastro.title}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground mt-2">
                        {cadastro.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Clique para acessar
                    </span>
                    <div className={`w-8 h-8 bg-gradient-to-r ${cadastro.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Informação Adicional */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-muted/50 to-muted/30 border-border/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                💡 Dica
              </h3>
              <p className="text-muted-foreground">
                Mantenha seus cadastros sempre atualizados para facilitar o agendamento de cultos. 
                Quanto mais dados você tiver cadastrados, mais rápido será criar novos cultos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
