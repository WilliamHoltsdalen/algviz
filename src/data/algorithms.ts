import { Algorithm } from '@/types/algorithm';

export const algorithms: Algorithm[] = [
  // Sorting Algorithms
  {
    id: 'quicksort',
    name: 'Quicksort',
    category: 'sorting',
    description: 'A divide-and-conquer algorithm that picks a pivot and partitions the array around it.',
    timeComplexity: 'O(n log n) average, O(n²) worst',
    spaceComplexity: 'O(log n)',
    isImplemented: true,
  },
  {
    id: 'mergesort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'A stable divide-and-conquer algorithm that divides the array into halves and merges them.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    isImplemented: true,
  },
  {
    id: 'bubblesort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list and swaps adjacent elements.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    isImplemented: true,
  },
  {
    id: 'insertionsort',
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Builds the final sorted array one item at a time by inserting elements in their correct position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    isImplemented: true,
  },
  {
    id: 'selectionsort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Finds the minimum element and places it at the beginning of the array.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    isImplemented: true,
  },

  // Graph Algorithms
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description: 'Finds the shortest path between nodes in a weighted graph.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    isImplemented: false,
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    description: 'Explores all nodes at the present depth before moving to nodes at the next depth level.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    isImplemented: false,
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    description: 'Explores as far as possible along each branch before backtracking.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    isImplemented: false,
  },
  {
    id: 'astar',
    name: 'A* Search',
    category: 'pathfinding',
    description: 'An informed search algorithm that finds the shortest path using heuristics.',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    isImplemented: false,
  },
];

export const getAlgorithmsByCategory = (category: string) => {
  return algorithms.filter(alg => alg.category === category);
};

export const getAlgorithmById = (id: string) => {
  return algorithms.find(alg => alg.id === id);
};
