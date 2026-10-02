import React, { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';
import { CATEGORIES } from '../data/servicesData';

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestModal: React.FC<SuggestModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pricingUrl, setPricingUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [highlights, setHighlights] = useState('');
  const [requiresCc, setRequiresCc] = useState(false);
  const [limitsNote, setLimitsNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getTemplateText = () => {
    return `### Sugestão de Serviço Gratuito
- **Nome:** ${name || '[Nome do Serviço]'}
- **Categoria:** ${CATEGORIES.find((c) => c.id === category)?.name}
- **Site Oficial:** ${websiteUrl || 'https://...'}
- **Página de Preços/Plano Gratuito:** ${pricingUrl || 'https://...'}
- **Requer Cartão de Crédito:** ${requiresCc ? 'Sim' : 'Não'}
- **Recursos do Plano Sempre Gratuito:**
${highlights || '  - [Informe as cotas permanentes detalhadas]'}
- **Limites e Observações:** ${limitsNote || 'Nenhuma'}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTemplateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fundo escurecido */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              Sugerir um Serviço Gratuito
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              O serviço deve possuir um plano sempre gratuito (&quot;Always Free&quot;), sem testes de 14/30 dias.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-3">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Muito obrigado pela contribuição!
            </h4>
            <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
              Revisamos e auditamos todas as sugestões para garantir que apenas serviços com planos verdadeiramente perpétuos sejam catalogados.
            </p>

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Modelo Copiado!' : 'Copiar Sugestão Formatada'}</span>
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-950 rounded hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fly.io ou Turso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-hidden focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  URL do Site Oficial *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Link de Preços / Documentação do Plano Grátis *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://.../pricing"
                  value={pricingUrl}
                  onChange={(e) => setPricingUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                O que o plano gratuito inclui? (cotas permanentes) *
              </label>
              <textarea
                required
                rows={3}
                placeholder="ex: 500 MB de PostgreSQL, 50.000 usuários ativos, 100k requisições/mês"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Restrições importantes / Política de suspensão (idle)
              </label>
              <input
                type="text"
                placeholder="ex: Entra em hibernação após 15m inativo, expira se não receber requisição por 30 dias"
                value={limitsNote}
                onChange={(e) => setLimitsNote(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-200"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="req-cc-check"
                type="checkbox"
                checked={requiresCc}
                onChange={(e) => setRequiresCc(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-900"
              />
              <label htmlFor="req-cc-check" className="text-neutral-700 dark:text-neutral-300 font-medium">
                Requer cartão de crédito para validação de identidade
              </label>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? 'Copiado!' : 'Copiar Modelo'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded transition-colors"
                >
                  Enviar para Avaliação
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
