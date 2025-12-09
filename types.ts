
export interface AnalysisResult {
  fruitName: string;
  ripeness: 'Unripe' | 'Almost Ripe' | 'Perfectly Ripe' | 'Overripe' | 'Unknown';
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
  justification: string;
}
