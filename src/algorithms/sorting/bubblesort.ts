import { AlgorithmStep } from '@/types/algorithm';

export function bubblesortSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    type: 'highlight',
    indices: [],
    message: 'Starting Bubble Sort algorithm',
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    steps.push({
      type: 'highlight',
      indices: [],
      message: `Pass ${i + 1}: Comparing adjacent elements`,
    });

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        message: `Comparing ${array[j]} and ${array[j + 1]}`,
      });

      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;

        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          message: `Swapping ${array[j + 1]} and ${array[j]}`,
        });
      }
    }

    // If no swapping occurred, array is sorted
    if (!swapped) {
      steps.push({
        type: 'highlight',
        indices: [],
        message: 'No swaps in this pass - array is sorted!',
      });
      break;
    }
  }

  steps.push({
    type: 'complete',
    indices: [],
    message: 'Bubble Sort completed!',
  });

  return steps;
}
