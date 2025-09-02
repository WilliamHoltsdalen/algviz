import type { Graph } from '@/types/graph';

export type ArrayPreset = {
  id: string;
  name: string;
  description: string;
  data: number[];
};

export type GraphPreset = {
  id: string;
  name: string;
  description: string;
  build: () => Graph;
};

export const arrayPresets: ArrayPreset[] = [
  {
    id: 'nearly-sorted',
    name: 'Nearly sorted',
    description: 'Ascending with a few misplaced values',
    data: [1, 2, 3, 4, 5, 7, 6, 8, 9, 10, 12, 11, 13, 14, 15],
  },
  {
    id: 'reversed',
    name: 'Reversed',
    description: 'Strictly descending order',
    data: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6],
  },
  {
    id: 'few-unique',
    name: 'Few unique',
    description: 'Many duplicates; good to show stable sorts',
    data: [5, 1, 3, 3, 2, 5, 1, 2, 3, 5, 1, 2, 3],
  },
  {
    id: 'small-random',
    name: 'Small random',
    description: 'Short random list for quick demos',
    data: [9, 1, 7, 3, 5, 2, 8, 6, 4],
  },
];

export const graphPresets: GraphPreset[] = [
  {
    id: 'star',
    name: 'Star (weighted)',
    description: 'One hub connected to all leaves',
    build: () => {
      const nodes = [
        { id: 'A', x: 250, y: 180, label: 'A', isStart: true },
        { id: 'B', x: 120, y: 60, label: 'B' },
        { id: 'C', x: 380, y: 60, label: 'C' },
        { id: 'D', x: 120, y: 300, label: 'D' },
        { id: 'E', x: 380, y: 300, label: 'E' },
        { id: 'F', x: 250, y: 340, label: 'F', isEnd: true },
      ];
      const edges = [
        { id: 'AB', from: 'A', to: 'B', weight: 2 },
        { id: 'AC', from: 'A', to: 'C', weight: 4 },
        { id: 'AD', from: 'A', to: 'D', weight: 5 },
        { id: 'AE', from: 'A', to: 'E', weight: 1 },
        { id: 'AF', from: 'A', to: 'F', weight: 7 },
      ];
      return { nodes, edges } satisfies Graph;
    },
  },
  {
    id: 'line',
    name: 'Line (chain)',
    description: 'Simple path from start to end',
    build: () => {
      const nodes = [
        { id: 'A', x: 60, y: 200, label: 'A', isStart: true },
        { id: 'B', x: 160, y: 200, label: 'B' },
        { id: 'C', x: 260, y: 200, label: 'C' },
        { id: 'D', x: 360, y: 200, label: 'D' },
        { id: 'E', x: 460, y: 200, label: 'E', isEnd: true },
      ];
      const edges = [
        { id: 'AB', from: 'A', to: 'B', weight: 1 },
        { id: 'BC', from: 'B', to: 'C', weight: 3 },
        { id: 'CD', from: 'C', to: 'D', weight: 2 },
        { id: 'DE', from: 'D', to: 'E', weight: 4 },
      ];
      return { nodes, edges } satisfies Graph;
    },
  },
  {
    id: 'dense',
    name: 'Dense (weighted)',
    description: 'More edges; good for Dijkstra',
    build: () => {
      const nodes = [
        { id: 'A', x: 80, y: 80, label: 'A', isStart: true },
        { id: 'B', x: 230, y: 60, label: 'B' },
        { id: 'C', x: 380, y: 80, label: 'C' },
        { id: 'D', x: 120, y: 220, label: 'D' },
        { id: 'E', x: 260, y: 220, label: 'E' },
        { id: 'F', x: 400, y: 220, label: 'F', isEnd: true },
        { id: 'G', x: 180, y: 330, label: 'G' },
        { id: 'H', x: 320, y: 330, label: 'H' },
      ];
      const edges = [
        { id: 'AB', from: 'A', to: 'B', weight: 2 },
        { id: 'AC', from: 'A', to: 'C', weight: 6 },
        { id: 'AD', from: 'A', to: 'D', weight: 1 },
        { id: 'BE', from: 'B', to: 'E', weight: 2 },
        { id: 'BC', from: 'B', to: 'C', weight: 1 },
        { id: 'CD', from: 'C', to: 'D', weight: 3 },
        { id: 'CF', from: 'C', to: 'F', weight: 4 },
        { id: 'DE', from: 'D', to: 'E', weight: 2 },
        { id: 'EG', from: 'E', to: 'G', weight: 5 },
        { id: 'EH', from: 'E', to: 'H', weight: 2 },
        { id: 'FH', from: 'F', to: 'H', weight: 1 },
        { id: 'GH', from: 'G', to: 'H', weight: 3 },
      ];
      return { nodes, edges } satisfies Graph;
    },
  },
  {
    id: 'small-gridish',
    name: 'Small grid-ish',
    description: 'Compact with cross connections',
    build: () => {
      const nodes = [
        { id: 'A', x: 120, y: 120, label: 'A', isStart: true },
        { id: 'B', x: 240, y: 120, label: 'B' },
        { id: 'C', x: 360, y: 120, label: 'C' },
        { id: 'D', x: 120, y: 240, label: 'D' },
        { id: 'E', x: 240, y: 240, label: 'E' },
        { id: 'F', x: 360, y: 240, label: 'F' },
        { id: 'G', x: 240, y: 340, label: 'G', isEnd: true },
      ];
      const edges = [
        { id: 'AB', from: 'A', to: 'B', weight: 1 },
        { id: 'BC', from: 'B', to: 'C', weight: 2 },
        { id: 'AD', from: 'A', to: 'D', weight: 2 },
        { id: 'BE', from: 'B', to: 'E', weight: 2 },
        { id: 'CF', from: 'C', to: 'F', weight: 3 },
        { id: 'DE', from: 'D', to: 'E', weight: 1 },
        { id: 'EF', from: 'E', to: 'F', weight: 1 },
        { id: 'DG', from: 'D', to: 'G', weight: 4 },
        { id: 'EG', from: 'E', to: 'G', weight: 2 },
        { id: 'FG', from: 'F', to: 'G', weight: 2 },
      ];
      return { nodes, edges } satisfies Graph;
    },
  },
];


