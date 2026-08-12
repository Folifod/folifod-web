import Link from "next/link";

export type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

export function AdminBreadcrumbs({ items }: { items: AdminBreadcrumbItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[#5b6b7a]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden className="text-[#c0cad3]">/</span> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-[#00aeef]">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-[#123]" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
