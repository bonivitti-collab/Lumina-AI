export type AspectRatioType = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface StylePreset {
  id: string;
  name: string;
  category: 'Realismo' | 'Arte & Pintura' | 'Ficção & Fantasia' | 'Design & 3D';
  description: string;
  gradient: string;
  promptModifier: string;
  negativeModifier?: string;
  primaryColors: string[];
  features: string[];
}

export interface AspectRatioOption {
  id: AspectRatioType;
  label: string;
  description: string;
  width: number;
  height: number;
  iconRatio: string;
}

export interface LightingMood {
  id: string;
  name: string;
  description: string;
  modifier: string;
  colorTone: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  enhancedPrompt: string;
  styleId: string;
  aspectRatio: AspectRatioType;
  lightingId: string;
  seed: number;
  createdAt: number;
  dataUrl: string;
  tags: string[];
  favorite?: boolean;
  filter?: string;
}

export interface PromptInspiration {
  id: string;
  title: string;
  prompt: string;
  styleId: string;
  aspectRatio: AspectRatioType;
  lightingId: string;
  tags: string[];
}
