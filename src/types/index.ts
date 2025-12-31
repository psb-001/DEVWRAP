export interface WrapData {
  categoryHeader: string;
  tagline: string;
  name: string;
  role: string;
  trait: string;
  stats: {
    label: string;
    value: string;
  }[];
  tools: string[];
  languages: string[];
  imageUrl: string;
  beverage: 'coffee' | 'chai';
  brandColor?: string;
  leetcodeCount?: string;
  heatmap?: number[];
}

export type ThemeName = 'minimal' | 'neon-green' | 'neon-blue' | 'hologram' | 'midnight-tokyo' | 'industrial';
