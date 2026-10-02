import React from 'react';
import { ServiceItem } from '../data/servicesData';
import { ExternalLink, Bookmark, Check, CreditCard, Copy } from 'lucide-react';

interface ServiceTableRowProps {
  service: ServiceItem;
  isInStack: boolean;
  onToggleStack: (serviceId: string) => void;
  onCopyLink: (service: ServiceItem) => void;
}

export const ServiceTableRow: React.FC<ServiceTableRowProps> = ({
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
    <tr
      id={`row-${service.id}`}
      className="group border-b border-neutral-100 hover:bg-neutral-50/80 dark:border-neutral-800/60 dark:hover:bg-neutral-900/40 transition-colors text-xs"
    >
      {/* Nome do Serviço e Categoria */}
      <td className="py-3 px-3 sm:px-4 align-top">
        <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
          <span>{service.name}</span>
        </div>
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
          {service.categoryName}
        </div>
      </td>

      {/* Destaques do Plano Gratuito */}
      <td className="py-3 px-3 sm:px-4 align-top">
        <p className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px] leading-relaxed">
          {service.freeTierHighlights.slice(0, 3).join(' · ')}
        </p>
        {service.keyLimits && (
          <div className="text-[11px] text-neutral-500 dark:text-neutral-500 mt-1 line-clamp-1">
            Obs: {service.keyLimits}
          </div>
        )}
      </td>

      {/* Exigência de Cartão */}
      <td className="py-3 px-3 sm:px-4 align-top whitespace-nowrap">
        {service.requiresCreditCard ? (
          <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <CreditCard className="h-3 w-3 shrink-0" />
            <span>Cartão p/ ID</span>
          </span>
        ) : (
          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <Check className="h-3 w-3 shrink-0" />
            <span>Sem Cartão</span>
          </span>
        )}
      </td>

      {/* Links Externos */}
      <td className="py-3 px-3 sm:px-4 align-top whitespace-nowrap">
        <div className="flex items-center gap-2">
          <a
            href={service.pricingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline underline-offset-2 transition-colors"
          >
            Preços
          </a>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <a
            href={service.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white transition-colors"
          >
            <span>Acessar</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </td>

      {/* Ações da Stack e Compartilhamento */}
      <td className="py-3 px-3 sm:px-4 align-top text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleCopy}
            title="Copiar link"
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => onToggleStack(service.id)}
            title={isInStack ? 'Remover da Minha Stack' : 'Adicionar à Minha Stack'}
            className={`p-1 rounded border transition-colors ${
              isInStack
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
