import type { CatalogParam } from '@content/marketplace/schema';

function typeLabel(type: CatalogParam['type']): string {
  return Array.isArray(type) ? type.join(' | ') : type;
}

export function ParamTable({ params }: { params: CatalogParam[] }) {
  if (params.length === 0) {
    return <p className="text-sm text-muted">No parameters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="py-2 pr-4 font-semibold">Name</th>
            <th className="py-2 pr-4 font-semibold">Type</th>
            <th className="py-2 pr-4 font-semibold">Required</th>
            <th className="py-2 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-border/60 align-top">
              <td className="py-2 pr-4 font-mono text-accent">{p.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {typeLabel(p.type)}
                {p.enum && (
                  <span className="block text-[10px] text-muted/70">
                    {p.enum.join(', ')}
                  </span>
                )}
              </td>
              <td className="py-2 pr-4 text-muted">{p.required ? 'yes' : '—'}</td>
              <td className="py-2 text-muted">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
