import React from 'react';
import { ServiceItem } from '../data/servicesData';
import { ExternalLink, Bookmark, Check, CreditCard, Copy } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  isInStack: boolean;
  onToggleStack: (serviceId: string) => void;
  onCopyLink: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isInStack,
  onToggleStack,
  onCopyLink,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyLink(service);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article
      id={`service-${service.id}`}
      className="group relative flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2 flex-wrap">
              <span>{service.name}</span>
            </h3>

            {/* Metadados sem cápsula (Conformidade com o Artigo 1.A do Frontend Design) */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-medium text-neutral-600 dark:text-neutral-300">
                {service.categoryName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                {service.requiresCreditCard ? (
                  <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1 font-mono text-[11px]">
                    <CreditCard className="h-3 w-3" />
                    <span>Requer cartão para validação</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                    <Check className="h-3 w-3" />
                    <span>Sem cartão de crédito</span>
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              title="Copiar link direto"
              aria-label="Copiar link direto"
              className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => onToggleStack(service.id)}
              title={isInStack ? 'Remover da Minha Stack' : 'Adicionar à Minha Stack ($0/mês)'}
              aria-label={isInStack ? 'Remover da Minha Stack' : 'Adicionar à Minha Stack'}
              className={`p-1.5 rounded border transition-colors ${
                isInStack
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Resumo / Tagline */}
        <p className="mt-2.5 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {service.tagline}
        </p>

        {/* Recursos Sempre Gratuitos */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Inclusões Sempre Gratuitas
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-800 dark:text-neutral-200">
            {service.freeTierHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-snug">
                <span className="text-neutral-400 dark:text-neutral-600 font-mono text-[11px] select-none mt-0.5">
                  —
                </span>
                <span className="font-mono text-[12px]">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Restrições e Limites Importantes */}
        {service.keyLimits && (
          <div className="mt-3.5 rounded bg-neutral-50 p-2.5 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60">
            <div className="flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                Observação:
              </span>
              <span className="leading-relaxed">{service.keyLimits}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé: Tags em texto corrido e Links externos */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
          {service.tags.slice(0, 4).map((tag, i) => (
            <React.Fragment key={tag}>
              {i > 0 && <span aria-hidden="true">·</span>}
              <span>{tag}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={service.pricingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline underline-offset-4 font-medium transition-colors"
          >
            Preços e Detalhes
          </a>
          <a
            href={service.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300 transition-colors"
          >
            <span>Acessar</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
