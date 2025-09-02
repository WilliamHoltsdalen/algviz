import { AlgorithmStep } from '@/types/algorithm';

export function mergesortSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...arr];

  function mergeSort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        type: 'highlight',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        message: `Dividing array from index ${left} to ${right}`,
        array: [...array],
      });

      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  function merge(left: number, mid: number, right: number) {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);

    steps.push({
      type: 'highlight',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      message: `Merging subarrays from ${left} to ${right}`,
      array: [...array],
    });

    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        message: `Comparing ${leftArray[i]} and ${rightArray[j]}`,
        array: [...array],
      });

      if (leftArray[i] <= rightArray[j]) {
        array[k] = leftArray[i];
        steps.push({
          type: 'move',
          indices: [k],
          message: `Placing ${leftArray[i]} at position ${k}`,
          array: [...array],
        });
        i++;
      } else {
        array[k] = rightArray[j];
        steps.push({
          type: 'move',
          indices: [k],
          message: `Placing ${rightArray[j]} at position ${k}`,
          array: [...array],
        });
        j++;
      }
      k++;
    }

    // Copy remaining elements
    while (i < leftArray.length) {
      array[k] = leftArray[i];
      steps.push({
        type: 'move',
        indices: [k],
        message: `Placing remaining element ${leftArray[i]} at position ${k}`,
        array: [...array],
      });
      i++;
      k++;
    }

    while (j < rightArray.length) {
      array[k] = rightArray[j];
      steps.push({
        type: 'move',
        indices: [k],
        message: `Placing remaining element ${rightArray[j]} at position ${k}`,
        array: [...array],
      });
      j++;
      k++;
    }
  }

  steps.push({
    type: 'highlight',
    indices: [],
    message: 'Starting Merge Sort algorithm',
    array: [...array],
  });

  mergeSort(0, array.length - 1);

  steps.push({
    type: 'complete',
    indices: [],
    message: 'Merge Sort completed!',
    array: [...array],
  });

  return steps;
}
