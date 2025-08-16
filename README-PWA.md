# Funcionalidades PWA - Agenda de Louvores

Este projeto foi configurado como uma Progressive Web App (PWA) para permitir que seja instalado e usado como um aplicativo nativo em smartphones e tablets.

## 🚀 Funcionalidades PWA Implementadas

### ✅ Manifesto PWA
- **Arquivo**: `public/manifest.json`
- **Funcionalidades**:
  - Nome e descrição do app
  - Ícones em múltiplos tamanhos
  - Tema e cores personalizadas
  - Modo standalone (sem barra de navegação)
  - Atalhos para funcionalidades principais

### ✅ Service Worker
- **Arquivo**: `public/sw.js`
- **Funcionalidades**:
  - Cache de recursos estáticos
  - Funcionamento offline básico
  - Estratégia "Cache First" para melhor performance
  - Atualização automática de cache

### ✅ Componente de Instalação
- **Arquivo**: `src/components/PWAInstallPrompt.tsx`
- **Funcionalidades**:
  - Banner de instalação automático
  - Botão de instalação personalizado
  - Dismiss automático após instalação
  - Design responsivo e acessível

### ✅ Meta Tags Otimizadas
- **Arquivo**: `src/app/layout.tsx`
- **Funcionalidades**:
  - Meta tags para iOS (Apple Web App)
  - Meta tags para Android
  - Viewport otimizado para mobile
  - Ícones para diferentes plataformas
  - Registro automático do Service Worker

## 📱 Como Instalar no Smartphone

### Android (Chrome)
1. Abra o site no Chrome
2. Toque no menu (3 pontos) no canto superior direito
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### iOS (Safari)
1. Abra o site no Safari
2. Toque no botão de compartilhar (quadrado com seta)
3. Selecione "Adicionar à Tela Inicial"
4. Confirme a instalação

### Desktop (Chrome/Edge)
1. Abra o site no navegador
2. Procure pelo ícone de instalação na barra de endereços
3. Clique em "Instalar"

## 🎨 Ícones Gerados

Os ícones foram criados automaticamente em múltiplos tamanhos:
- 72x72px (Android)
- 96x96px (Android)
- 128x128px (Android)
- 144x144px (Android)
- 152x152px (iOS)
- 192x192px (Android)
- 384x384px (Android)
- 512x512px (Android)

## 🔧 Configuração Técnica

### Implementação Manual
Este projeto implementa PWA de forma manual, sem dependências externas:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Agenda de Louvores",
  description: "Aplicativo para gerenciar agenda de louvores e cultos",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  // ... outras configurações
};
```

### Service Worker Registration
```javascript
// Registrado automaticamente no layout.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
      })
      .catch(function(registrationError) {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

## 📊 Benefícios PWA

### Para Usuários
- ✅ Instalação rápida e fácil
- ✅ Funcionamento offline
- ✅ Performance otimizada
- ✅ Experiência similar a app nativo
- ✅ Atualizações automáticas

### Para Desenvolvedores
- ✅ Código único para web e mobile
- ✅ Manutenção simplificada
- ✅ Distribuição via web
- ✅ Analytics web padrão
- ✅ Sem dependências externas

## 🧪 Testando PWA

### Ferramentas de Desenvolvimento
1. **Chrome DevTools**:
   - Abra DevTools (F12)
   - Vá para a aba "Application"
   - Verifique "Manifest" e "Service Workers"

2. **Lighthouse**:
   - Execute auditoria PWA
   - Verifique pontuação de performance

3. **Teste Offline**:
   - Desconecte da internet
   - Recarregue a página
   - Verifique se funciona offline

## 🔄 Atualizações

### Service Worker
- Atualiza automaticamente quando há mudanças
- Estratégia de cache inteligente
- Fallback para conteúdo offline

### Manifesto
- Atualize `public/manifest.json` para mudanças de configuração
- Regenere ícones se necessário

## 📝 Próximos Passos

### Melhorias Sugeridas
- [ ] Push notifications
- [ ] Background sync
- [ ] Cache mais inteligente
- [ ] Splash screen personalizada
- [ ] Atalhos dinâmicos

### Comandos Úteis
```bash
# Gerar ícones
node scripts/generate-icons.js

# Build para produção
npm run build

# Testar PWA
npm run start
```

## 🆘 Solução de Problemas

### PWA não aparece para instalação
1. Verifique se está em HTTPS
2. Confirme se o manifesto está válido
3. Verifique se o service worker está registrado

### Ícones não aparecem
1. Execute o script de geração de ícones
2. Verifique se os arquivos PNG existem
3. Confirme os caminhos no manifesto

### Cache não funciona
1. Verifique se o service worker está ativo
2. Limpe o cache do navegador
3. Verifique as regras de cache no sw.js

## 🎯 Vantagens da Implementação Manual

### ✅ Controle Total
- Configuração personalizada
- Sem dependências externas
- Melhor performance

### ✅ Compatibilidade
- Funciona com todas as versões do Next.js
- Sem conflitos de configuração
- Fácil manutenção

### ✅ Flexibilidade
- Fácil customização
- Controle sobre cache
- Implementação gradual
