'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Search, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { ArrayPreset, GraphPreset } from '@/data/presets';

type PresetsPickerProps = {
  mode: 'array' | 'graph';
  arrayPresets?: ArrayPreset[];
  graphPresets?: GraphPreset[];
  onSelectArray?: (preset: ArrayPreset) => void;
  onSelectGraph?: (preset: GraphPreset) => void;
};

export default function PresetsPicker({
  mode,
  arrayPresets = [],
  graphPresets = [],
  onSelectArray,
  onSelectGraph,
}: PresetsPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (mode === 'array') {
      return arrayPresets.filter((p) =>
        [p.name, p.description].some((t) => t.toLowerCase().includes(q)),
      );
    }
    return graphPresets.filter((p) =>
      [p.name, p.description].some((t) => t.toLowerCase().includes(q)),
    );
  }, [mode, arrayPresets, graphPresets, query]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 inline-flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={mode === 'array' ? 'Choose array preset' : 'Choose graph preset'}
        >
          <ListChecks className="w-4 h-4" /> Presets
        </motion.button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="theme-panel p-2 w-80 max-h-[360px] overflow-hidden"
        >
          {/* Search */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 mb-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                // Prevent Radix typeahead from stealing keystrokes when typing in the input
                e.stopPropagation();
              }}
              className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
              placeholder={mode === 'array' ? 'Search array presets…' : 'Search graph presets…'}
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[300px] pr-1">
            {items.map((p) => (
              <DropdownMenu.Item
                key={p.id}
                onSelect={(e) => {
                  e.preventDefault();
                  if (mode === 'array' && onSelectArray) onSelectArray(p as ArrayPreset);
                  if (mode === 'graph' && onSelectGraph) onSelectGraph(p as GraphPreset);
                  setOpen(false);
                }}
                className="group rounded-md px-2 py-2 outline-none cursor-pointer data-[highlighted]:bg-white/10 border border-transparent data-[highlighted]:border-white/10"
              >
                <div className="text-slate-200 text-sm font-medium">{'name' in p ? p.name : ''}</div>
                <div className="text-slate-400 text-xs line-clamp-2">{'description' in p ? p.description : ''}</div>
              </DropdownMenu.Item>
            ))}
            {items.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">No presets found</div>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}


