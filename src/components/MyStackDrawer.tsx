import React from 'react';
import { ServiceItem } from '../data/servicesData';
import { X, Trash2, Copy, Check, ExternalLink, Bookmark, Download } from 'lucide-react';

interface MyStackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stackServices: ServiceItem[];
  onRemoveService: (serviceId: string) => void;
  onClearStack: () => void;
}

export const MyStackDrawer: React.FC<MyStackDrawerProps> = ({
  isOpen,
  onClose,
  stackServices,
  onRemoveService,
  onClearStack,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# Minha Arquitetura de Nuvem e DevOps $0/mês\n\n`;
    md += `| Categoria | Serviço | Inclusões Gratuitas | Requer Cartão |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    stackServices.forEach((s) => {
      const highlights = s.freeTierHighlights.slice(0, 2).join('; ');
      const cc = s.requiresCreditCard ? 'Sim (Validação)' : 'Não';
      md += `| ${s.categoryName} | [${s.name}](${s.websiteUrl}) | ${highlights} | ${cc} |\n`;
    });
    md += `\n**Custo Mensal Estimado:** $0.00 USD / mês\n`;
    md += `*Gerado com DevFree - O Diretório de Serviços Gratuitos*\n`;
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stackServices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'minha-stack-gratuita.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fundo escurecido */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-md border-l border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950 flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-neutral-900 dark:text-white" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                Minha Stack $0/mês
              </h2>
              <span className="font-mono text-xs tabular-nums text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                {stackServices.length} {stackServices.length === 1 ? 'serviço' : 'serviços'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Resumo de Custos */}
          <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
                  Custo Mensal Projetado
                </span>
                <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
                  $0.00 <span className="text-xs font-normal text-neutral-500">/ mês</span>
                </div>
              </div>
              <div className="text-right text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Planos Sempre Gratuitos
              </div>
            </div>
          </div>

          {/* Lista de Serviços Selecionados */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100 dark:divide-neutral-900">
            {stackServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Bookmark className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                  Sua stack está vazia
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                  Clique no ícone de marcador em qualquer serviço do diretório para montar sua arquitetura sem custos.
                </p>
              </div>
            ) : (
              stackServices.map((service) => (
                <div key={service.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {service.name}
                        </span>
                        <a
                          href={service.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {service.categoryName} · {service.requiresCreditCard ? 'Requer Cartão p/ ID' : 'Sem Cartão'}
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-300 leading-snug">
                        {service.freeTierHighlights[0]}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveService(service.id)}
                      title="Remover da stack"
                      className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Barra de Ações */}
          {stackServices.length > 0 && (
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white rounded transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar Stack em Markdown'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Baixar JSON</span>
                </button>
                <button
                  onClick={onClearStack}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 border border-neutral-200 dark:border-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition-colors"
                >
                  Limpar Tudo
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
