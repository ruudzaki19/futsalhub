// src/app/components/ui/Table.tsx
import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ className = '', children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] bg-white dark:bg-[#13192B]">
      <table className={`w-full text-left text-xs ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-stone-50 dark:bg-stone-900/60 border-b-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-[#E3E7EF] dark:divide-[#1E263D] ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = '', children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-3.5 ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className = '', children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-stone-800 dark:text-stone-200 ${className}`} {...props}>
      {children}
    </td>
  );
}
