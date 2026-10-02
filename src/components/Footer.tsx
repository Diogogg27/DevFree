import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  totalServices: number;
  totalNoCard: number;
}

export const Footer: React.FC<FooterProps> = ({ totalServices, totalNoCard }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-950">
                0$
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">DevFree</span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Um diretório independente e mantido pela comunidade catalogando ferramentas de nuvem e DevOps com planos perpétuos sempre gratuitos. Sem testes temporários ou armadilhas de faturas inesperadas.
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500 font-mono">
              <span>{totalServices} serviços listados</span>
              <span>·</span>
              <span>{totalNoCard} sem cartão de crédito</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white transition-colors"
            >
              <span>Voltar ao Topo</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 dark:text-neutral-500">
          <div>
            Dados verificados com as documentações oficiais de cada fornecedor. As cotas estão sujeitas aos termos de cada provedor.
          </div>
          <div>
            Desenvolvido com padrões modernos · Zero telemetria
          </div>
        </div>
      </div>
    </footer>
  );
};
