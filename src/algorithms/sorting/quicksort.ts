import { AlgorithmStep } from '@/types/algorithm';

export function quicksortSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...arr];

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(low, high);
      quickSort(low, pivotIndex - 1);
      quickSort(pivotIndex + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    steps.push({
      type: 'highlight',
      indices: [high],
      message: `Pivot selected: ${pivot}`,
      array: [...array],
    });

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        message: `Comparing ${array[j]} with pivot ${pivot}`,
        array: [...array],
      });

      if (array[j] <= pivot) {
        i++;
        if (i !== j) {
          // Swap elements
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            type: 'swap',
            indices: [i, j],
            message: `Swapping ${array[j]} and ${array[i]}`,
            array: [...array],
          });
        }
      }
    }

    // Place pivot in correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({
      type: 'swap',
      indices: [i + 1, high],
      message: `Placing pivot ${pivot} in correct position`,
      array: [...array],
    });

    return i + 1;
  }

  steps.push({
    type: 'highlight',
    indices: [],
    message: 'Starting Quicksort algorithm',
    array: [...array],
  });

  quickSort(0, array.length - 1);

  steps.push({
    type: 'complete',
    indices: [],
    message: 'Quicksort completed!',
    array: [...array],
  });

  return steps;
}
