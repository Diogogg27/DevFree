import React from 'react';
import { CategoryGroup, ServiceItem } from '../data/servicesData';
import { 
  Cloud, 
  Server, 
  Database, 
  GitBranch, 
  Activity, 
  Globe, 
  HardDrive, 
  ShieldCheck, 
  Mail, 
  Radio, 
  Lock 
} from 'lucide-react';

interface TableOfContentsProps {
  categories: CategoryGroup[];
  services: ServiceItem[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cloud: <Cloud className="h-4 w-4" />,
  Server: <Server className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  GitBranch: <GitBranch className="h-4 w-4" />,
  Activity: <Activity className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />,
  HardDrive: <HardDrive className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  Mail: <Mail className="h-4 w-4" />,
  Radio: <Radio className="h-4 w-4" />,
  Lock: <Lock className="h-4 w-4" />,
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  categories,
  services,
  activeCategoryId,
  onSelectCategory,
}) => {
  const countByCategory = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of services) {
      map[item.categoryId] = (map[item.categoryId] || 0) + 1;
    }
    return map;
  }, [services]);

  const scrollToSection = (categoryId: string) => {
    onSelectCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="categories-toc"
      aria-label="Índice de seções"
      className="border-y border-neutral-200 bg-neutral-100/70 py-3 dark:border-neutral-800 dark:bg-neutral-900/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Seções do Diretório
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-600">·</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
              {categories.length} Categorias
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-500 hidden sm:inline">
            Clique para ir direto até a seção
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((cat) => {
            const count = countByCategory[cat.id] || 0;
            const isActive = activeCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap border ${
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-white'
                }`}
              >
                <span className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                  {ICON_MAP[cat.iconName] || <Server className="h-3.5 w-3.5" />}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive
                      ? 'text-neutral-300 dark:text-neutral-700'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
