import React from 'react';
import { Bookmark, Sun, Moon, Plus } from 'lucide-react';

interface HeaderProps {
  stackCount: number;
  onOpenStack: () => void;
  onOpenSuggest: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  noCardFilter: boolean;
  onToggleNoCard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stackCount,
  onOpenStack,
  onOpenSuggest,
  theme,
  onToggleTheme,
  noCardFilter,
  onToggleNoCard,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zona 1: Nome da Marca */}
        <a
          href="#"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-neutral-900 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-950">
            0$
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-50">DevFree</span>
          <span className="hidden sm:inline text-xs font-normal text-neutral-500 dark:text-neutral-400">
            · Diretório de Nuvem Sempre Gratuito
          </span>
        </a>

        {/* Zona 2: Links de Navegação */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <a
            href="#categories-toc"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Categorias
          </a>
          <button
            onClick={onToggleNoCard}
            className={`transition-colors flex items-center gap-1.5 ${
              noCardFilter
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Sem Cartão de Crédito</span>
            {noCardFilter && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
          <button
            onClick={onOpenSuggest}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Sugerir Serviço
          </button>
        </nav>

        {/* Zona 3: Ações Primárias */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleTheme}
            aria-label="Alternar tema claro/escuro"
            title="Alternar tema"
            className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenSuggest}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900 rounded transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Sugerir</span>
          </button>

          <button
            onClick={onOpenStack}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white rounded transition-colors whitespace-nowrap shadow-sm"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Minha Stack</span>
            <span className="font-mono tabular-nums bg-neutral-700 text-white dark:bg-neutral-300 dark:text-neutral-900 px-1.5 py-0.2 rounded text-[11px]">
              {stackCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
