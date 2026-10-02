import React, { useState, useEffect, useMemo } from 'react';
import { 
  CATEGORIES, 
  SERVICES_DATA, 
  ServiceItem 
} from './data/servicesData';
import { Header } from './components/Header';
import { TableOfContents } from './components/TableOfContents';
import { ServiceCard } from './components/ServiceCard';
import { ServiceTableRow } from './components/ServiceTableRow';
import { MyStackDrawer } from './components/MyStackDrawer';
import { SuggestModal } from './components/SuggestModal';
import { Footer } from './components/Footer';
import { 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  CreditCard, 
  Check 
} from 'lucide-react';

export default function App() {
  // Estado de tema claro/escuro
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('devfree_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark'; // Padrão escuro
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('devfree_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Stack pessoal armazenada no localStorage
  const [stackIds, setStackIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('devfree_stack_ids');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    // Exemplos iniciais populares de custo zero
    return ['cloudflare-core', 'neon', 'github-actions', 'resend'];
  });

  useEffect(() => {
    localStorage.setItem('devfree_stack_ids', JSON.stringify(stackIds));
  }, [stackIds]);

  const handleToggleStack = (serviceId: string) => {
    setStackIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleClearStack = () => {
    setStackIds([]);
  };

  // Modais e gavetas
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  // Busca e Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [noCardOnly, setNoCardOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Categoria ativa acompanhada no TOC
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Notificação toast para links copiados
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyLink = (service: ServiceItem) => {
    const url = `${window.location.origin}${window.location.pathname}#service-${service.id}`;
    navigator.clipboard.writeText(url);
    setToastMessage(`Link de "${service.name}" copiado para a área de transferência!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Serviços filtrados dinamicamente
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SERVICES_DATA.filter((item) => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      if (noCardOnly && item.requiresCreditCard) {
        return false;
      }
      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTagline = item.tagline.toLowerCase().includes(q);
        const matchesCategory = item.categoryName.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesHighlights = item.freeTierHighlights.some((h) =>
          h.toLowerCase().includes(q)
        );
        const matchesLimits = item.keyLimits.toLowerCase().includes(q);

        return (
          matchesName ||
          matchesTagline ||
          matchesCategory ||
          matchesTags ||
          matchesHighlights ||
          matchesLimits
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory, noCardOnly]);

  // Agrupamento por categoria
  const servicesByCategory = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const cat of CATEGORIES) {
      map.set(cat.id, []);
    }
    for (const service of filteredServices) {
      const list = map.get(service.categoryId) || [];
      list.push(service);
      map.set(service.categoryId, list);
    }
    return map;
  }, [filteredServices]);

  const stackServices = useMemo(() => {
    return SERVICES_DATA.filter((s) => stackIds.includes(s.id));
  }, [stackIds]);

  const totalNoCardCount = useMemo(() => {
    return SERVICES_DATA.filter((s) => !s.requiresCreditCard).length;
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Notificação Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-900 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:text-white flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        stackCount={stackIds.length}
        onOpenStack={() => setIsStackOpen(true)}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        noCardFilter={noCardOnly}
        onToggleNoCard={() => setNoCardOnly((prev) => !prev)}
      />

      <main className="flex-1">
        {/* Seção Hero: Carregamento rápido, foco em texto e números */}
        <section className="border-b border-neutral-200 bg-white pt-12 pb-10 dark:border-neutral-800 dark:bg-neutral-950/60 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]">
                O Diretório de Nuvem e DevOps Sempre Gratuito
              </h1>
              <p className="mt-3.5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Um índice selecionado de serviços SaaS, PaaS e IaaS com planos gratuitos permanentes e generosos (&quot;Always Free&quot;).
                Feito para desenvolvedores, equipes de DevOps e criadores que buscam infraestrutura estável a custo zero, sem pegadinhas de testes temporários.
              </p>

              {/* Barra de Métricas Editoriais */}
              <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                    {SERVICES_DATA.length}
                  </span>
                  <span>Serviços Catalogados</span>
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                    {CATEGORIES.length}
                  </span>
                  <span>Categorias</span>
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {totalNoCardCount}
                  </span>
                  <span>Sem Cartão de Crédito</span>
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                    $0.00/mês
                  </span>
                  <span>Plano Perpétuo</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Índice / Navegação Rápida entre Seções */}
        <TableOfContents
          categories={CATEGORIES}
          services={filteredServices}
          activeCategoryId={activeCategoryId}
          onSelectCategory={(id) => {
            setActiveCategoryId(id);
            if (selectedCategory !== 'all') {
              setSelectedCategory('all');
            }
          }}
        />

        {/* Barra de Filtros, Busca e Modo de Visualização */}
        <div className="sticky top-14 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md py-3 dark:border-neutral-800 dark:bg-neutral-950/95 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Campo de Busca Rápida */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, tecnologia (ex: Postgres, ARM, Docker, Redis, S3, ilimitado)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 dark:focus:bg-neutral-900 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    title="Limpar pesquisa"
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filtros e Alternância de Visualização */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Botão Sem Cartão de Crédito */}
                <button
                  onClick={() => setNoCardOnly((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                    noCardOnly
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Sem Cartão</span>
                  {noCardOnly && <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                </button>

                {/* Alternador de Layout: Cards vs Tabela */}
                <div className="flex items-center border border-neutral-200 rounded dark:border-neutral-800 bg-white dark:bg-neutral-900 p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Visualização em Cards Detalhada"
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="Visualização Compacta em Tabela"
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'table'
                        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Contador de Resultados */}
                <div className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400 pl-1 hidden sm:block">
                  {filteredServices.length} {filteredServices.length === 1 ? 'serviço' : 'serviços'}
                </div>
              </div>
            </div>

            {/* Abas Rápidas de Categorias */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                Todas as Categorias ({SERVICES_DATA.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = SERVICES_DATA.filter((s) => s.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal do Diretório */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {filteredServices.length === 0 ? (
            /* Estado Vazio */
            <div className="py-20 text-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
              <Search className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Nenhum serviço gratuito encontrado
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                Não localizamos serviços correspondentes a &quot;{searchQuery}&quot;
                {noCardOnly ? ' com filtro de Sem Cartão de Crédito ativo' : ''}.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setNoCardOnly(false);
                    setSelectedCategory('all');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {CATEGORIES.map((category, index) => {
                const categoryServices = servicesByCategory.get(category.id) || [];
                if (categoryServices.length === 0) return null;

                const numberStr = (index + 1).toString().padStart(2, '0');

                return (
                  <section
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-36"
                  >
                    {/* Cabeçalho de Seção Editorial */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-6 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                          <span className="text-neutral-400 dark:text-neutral-500 font-mono mr-2.5">
                            {numberStr}.
                          </span>
                          {category.name}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                          {category.description}
                        </p>
                      </div>

                      <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
                        {categoryServices.length} {categoryServices.length === 1 ? 'serviço' : 'serviços'}
                      </div>
                    </div>

                    {/* Exibição em Cards ou Tabela */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {categoryServices.map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            isInStack={stackIds.includes(service.id)}
                            onToggleStack={handleToggleStack}
                            onCopyLink={handleCopyLink}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/60 shadow-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400">
                              <th className="py-2.5 px-3 sm:px-4">Serviço</th>
                              <th className="py-2.5 px-3 sm:px-4">Inclusões do Plano Grátis</th>
                              <th className="py-2.5 px-3 sm:px-4">Cartão</th>
                              <th className="py-2.5 px-3 sm:px-4">Links</th>
                              <th className="py-2.5 px-3 sm:px-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoryServices.map((service) => (
                              <ServiceTableRow
                                key={service.id}
                                service={service}
                                isInStack={stackIds.includes(service.id)}
                                onToggleStack={handleToggleStack}
                                onCopyLink={handleCopyLink}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* Banner de Chamada para Sugestões */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-10">
          <div className="rounded-lg border border-neutral-200 bg-neutral-100/60 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Conhece algum serviço incrível com plano Sempre Gratuito?
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
                Mantemos um padrão rigoroso: apenas ferramentas com planos gratuitos permanentes e úteis para infraestrutura são aprovadas (sem testes temporários). Ajude outros desenvolvedores.
              </p>
            </div>
            <button
              onClick={() => setIsSuggestOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded transition-colors whitespace-nowrap shrink-0"
            >
              Sugerir Serviço
            </button>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <Footer
        totalServices={SERVICES_DATA.length}
        totalNoCard={totalNoCardCount}
      />

      {/* Gaveta da Stack $0/mês */}
      <MyStackDrawer
        isOpen={isStackOpen}
        onClose={() => setIsStackOpen(false)}
        stackServices={stackServices}
        onRemoveService={handleToggleStack}
        onClearStack={handleClearStack}
      />

      {/* Modal de Sugestão de Serviço */}
      <SuggestModal
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
      />
    </div>
  );
}
