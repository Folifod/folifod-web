import Link from "next/link";
import { AdminBreadcrumbs, type AdminBreadcrumbItem } from "@/components/admin/admin-breadcrumbs";

export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  breadcrumbs?: AdminBreadcrumbItem[];
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 ? <AdminBreadcrumbs items={breadcrumbs} /> : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#123]">{title}</h1>
          {description ? <p className="mt-1 text-sm text-[#5b6b7a]">{description}</p> : null}
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex items-center rounded-md bg-[#00aeef] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0099d6]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
