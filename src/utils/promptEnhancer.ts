import { AspectRatioOption, AspectRatioType, LightingMood, PromptInspiration, StylePreset } from '../types/imageStudio';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'photoreal',
    name: 'Fotorealista 8K',
    category: 'Realismo',
    description: 'Fotografia ultradetalhada, profundidade de campo óptica e texturas táteis.',
    gradient: 'from-amber-500 via-orange-600 to-red-700',
    promptModifier: 'shot on 85mm f/1.4 lens, hyper-realistic, photorealistic, 8k resolution, subsurface scattering, tactile textures, studio quality',
    negativeModifier: 'blurry, distorted, oversaturated, plastic skin, cartoon, low resolution',
    primaryColors: ['#f59e0b', '#b45309', '#78350f', '#0f172a'],
    features: ['Lente 85mm f/1.4', 'Textura Real', 'Subsurface Scattering'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'Ficção & Fantasia',
    description: 'Metrópoles futuristas, luzes de neon vibrantes e reflexos em asfalto molhado.',
    gradient: 'from-cyan-400 via-fuchsia-500 to-purple-800',
    promptModifier: 'cyberpunk aesthetic, vibrant neon cyan and hot magenta glows, rain-soaked reflections, high-tech holographic UI, volumetric fog, octane render',
    negativeModifier: 'vintage, sepia, dull colors, daylight, rustic',
    primaryColors: ['#06b6d4', '#d946ef', '#8b5cf6', '#090d16'],
    features: ['Néon Cian/Magenta', 'Reflexos de Chuva', 'Volumetria'],
  },
  {
    id: 'fantasy',
    name: 'Fantasia Mítica',
    category: 'Ficção & Fantasia',
    description: 'Cenários mágicos, ruínas ancestrais, ilhas flutuantes e arte conceitual épica.',
    gradient: 'from-emerald-400 via-teal-600 to-indigo-900',
    promptModifier: 'mythical fantasy concept art, ethereal magical aura, ancient crystal spires, floating stones, enchanted atmosphere, masterpiece painting, trending on artstation',
    negativeModifier: 'modern buildings, cars, plastic, pixelated',
    primaryColors: ['#10b981', '#0d9488', '#4338ca', '#064e3b'],
    features: ['Aura Mágica', 'Arte Conceitual', 'Atmosfera Épica'],
  },
  {
    id: 'oil_painting',
    name: 'Pintura a Óleo',
    category: 'Arte & Pintura',
    description: 'Pinceladas visíveis, técnica de impasto e iluminação dramática chiaroscuro.',
    gradient: 'from-yellow-600 via-amber-700 to-stone-900',
    promptModifier: 'classical oil painting on canvas, visible rich impasto brushstrokes, fine art masterpiece, chiaroscuro lighting, Rembrandt palette, textured canvas',
    negativeModifier: 'photograph, 3d render, vector, digital flat art',
    primaryColors: ['#d97706', '#92400e', '#451a03', '#1c1917'],
    features: ['Técnica Impasto', 'Chiaroscuro', 'Textura de Tela'],
  },
  {
    id: 'anime',
    name: 'Anime Japonês',
    category: 'Arte & Pintura',
    description: 'Estética visual de animação japonesa moderna com céus vibrantes e cel shading.',
    gradient: 'from-pink-400 via-rose-500 to-indigo-600',
    promptModifier: 'modern anime movie visual style, Makoto Shinkai inspired aesthetic, stunning cloudscapes, vibrant cel shading, expressive dramatic lighting, high key artwork',
    negativeModifier: 'western comic, realistic skin, noisy, grunge',
    primaryColors: ['#f43f5e', '#ec4899', '#6366f1', '#1e1b4b'],
    features: ['Estilo Shinkai', 'Cel Shading', 'Céus Radiantes'],
  },
  {
    id: 'render_3d',
    name: '3D Octane Render',
    category: 'Design & 3D',
    description: 'Iluminação global de traçado de raios, materiais translúcidos e modelagem estilizada.',
    gradient: 'from-violet-500 via-purple-600 to-blue-800',
    promptModifier: '3d octane render, blender 4.0 cycles, raytraced global illumination, smooth clay and glass materials, isometric perfection, soft ambient occlusion, 4k digital art',
    negativeModifier: 'sketch, 2d drawing, blurry, low polygon',
    primaryColors: ['#8b5cf6', '#6366f1', '#3b82f6', '#1e1b4b'],
    features: ['Raytracing Global', 'Vidro & Cerâmica', 'Ambient Occlusion'],
  },
  {
    id: 'scifi',
    name: 'Exploração Espacial',
    category: 'Ficção & Fantasia',
    description: 'Nebulosas cósmicas, tecnologia estelar de titânio e vastidão do universo.',
    gradient: 'from-blue-500 via-indigo-600 to-slate-900',
    promptModifier: 'deep space sci-fi, swirling colorful nebula dust, distant binary stars, sleek interstellar starcraft, high-tech titanium hull, James Webb space telescope aesthetics',
    negativeModifier: 'terrestrial, low-tech, medieval',
    primaryColors: ['#3b82f6', '#4f46e5', '#1e293b', '#020617'],
    features: ['Nebulosa Cósmica', 'Nave de Titânio', 'Estrelas Binárias'],
  },
  {
    id: 'minimalist',
    name: 'Minimalismo Moderno',
    category: 'Design & 3D',
    description: 'Linhas elegantes, paleta restrita, formas puras e espaço negativo equilibrado.',
    gradient: 'from-slate-300 via-zinc-400 to-stone-600',
    promptModifier: 'minimalist graphic design, clean geometric silhouettes, harmonious duotone palette, golden ratio composition, modern architectural simplicity',
    negativeModifier: 'cluttered, chaotic, noisy textures, neon, crowded',
    primaryColors: ['#e2e8f0', '#94a3b8', '#475569', '#0f172a'],
    features: ['Espaço Negativo', 'Proporção Áurea', 'Geometria Pura'],
  },
];

export const LIGHTING_PRESETS: LightingMood[] = [
  {
    id: 'golden_hour',
    name: 'Hora Dourada',
    description: 'Sol poente quente com sombras longas e contornos alaranjados.',
    modifier: 'illuminated by warm golden hour sunlight, long cinematic shadows, soft warm rim light, 3200k color temperature',
    colorTone: '#f59e0b',
  },
  {
    id: 'neon_night',
    name: 'Néon Noturno',
    description: 'Luzes artificiais brilhantes, atmosfera escura e reflexos especulares.',
    modifier: 'lit by vibrant electric neon tubes, dramatic edge lighting, high contrast specular glow against deep shadows',
    colorTone: '#06b6d4',
  },
  {
    id: 'studio_soft',
    name: 'Estúdio Suave',
    description: 'Difusores profissionais, luz balanceada e sem sombras duras.',
    modifier: 'professional photography studio lighting, large dual softboxes, balanced fill light, crisp high-end beauty dish highlights',
    colorTone: '#e0e7ff',
  },
  {
    id: 'bioluminescent',
    name: 'Bioluminescência',
    description: 'Fungos, plantas ou criaturas que emitem seu próprio brilho turquesa e esmeralda.',
    modifier: 'organic bioluminescent radiance, soft cyan and emerald glow emitted from surfaces, ethereal particle spores in darkness',
    colorTone: '#10b981',
  },
  {
    id: 'dramatic_noir',
    name: 'Cinema Dramático',
    description: 'Feixes de luz volumétrica cortando a penumbra com alto contraste.',
    modifier: 'dramatic cinematic chiaroscuro, harsh volumetric light beams piercing dust motes, moody atmospheric haze, film noir aesthetics',
    colorTone: '#a855f7',
  },
];

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  {
    id: '1:1',
    label: 'Quadrado (1:1)',
    description: 'Ideal para posts de feed, avatares e capas',
    width: 800,
    height: 800,
    iconRatio: 'aspect-square',
  },
  {
    id: '16:9',
    label: 'Panorâmico (16:9)',
    description: 'Padrão cinema, paisagens e wallpapers widescreen',
    width: 960,
    height: 540,
    iconRatio: 'aspect-video',
  },
  {
    id: '9:16',
    label: 'Vertical (9:16)',
    description: 'Formato ideal para Stories, Reels e smartphones',
    width: 540,
    height: 960,
    iconRatio: 'aspect-[9/16]',
  },
  {
    id: '4:3',
    label: 'Clássico (4:3)',
    description: 'Composição fotográfica tradicional e exposições',
    width: 800,
    height: 600,
    iconRatio: 'aspect-[4/3]',
  },
  {
    id: '3:4',
    label: 'Retrato (3:4)',
    description: 'Retratos editoriais e pôsteres verticais',
    width: 600,
    height: 800,
    iconRatio: 'aspect-[3/4]',
  },
];

export const SAMPLE_INSPIRATIONS: PromptInspiration[] = [
  {
    id: 'insp-1',
    title: 'Metrópole Cyberpunk com Chuva',
    prompt: 'Uma avenida futurista de Tóquio no ano 2099 com arranha-céus colossais, letreiros em néon refletindo no asfalto molhado e carros voadores cruzando o céu noturno nebuloso.',
    styleId: 'cyberpunk',
    aspectRatio: '16:9',
    lightingId: 'neon_night',
    tags: ['Cyberpunk', 'Futuro', 'Néon', 'Cidade'],
  },
  {
    id: 'insp-2',
    title: 'Santuário Flutuante nas Nuvens',
    prompt: 'Ilhas flutuantes com cachoeiras de águas cristalinas caindo no vazio infinito, templos antigos de mármore branco com heras douradas e pássaros de luz voando entre nuvens ao pôr do sol.',
    styleId: 'fantasy',
    aspectRatio: '16:9',
    lightingId: 'golden_hour',
    tags: ['Fantasia', 'Ilhas', 'Mágico', 'Pôr do Sol'],
  },
  {
    id: 'insp-3',
    title: 'Retrato de Astronauta Cósmico',
    prompt: 'Close-up hiperdetalhado do capacete de um explorador espacial, onde o visor dourado reflete uma nebulosa estelar multicolorida e a curvatura da Terra no horizonte.',
    styleId: 'photoreal',
    aspectRatio: '1:1',
    lightingId: 'studio_soft',
    tags: ['Espaço', 'Astronauta', 'Realista', 'Retrato'],
  },
  {
    id: 'insp-4',
    title: 'Floresta com Cogumelos Bioluminescentes',
    prompt: 'Uma clareira misteriosa dentro de uma floresta ancestral, onde cogumelos gigantes e flores selvagens emitem uma suave luz azul-turquesa e esmeralda com esporos mágicos flutuantes.',
    styleId: 'fantasy',
    aspectRatio: '4:3',
    lightingId: 'bioluminescent',
    tags: ['Natureza', 'Bioluminescência', 'Místico'],
  },
  {
    id: 'insp-5',
    title: 'Gato Samurai em Arte Anime',
    prompt: 'Um destemido felino samurai vestindo armadura tradicional vermelha e preta segurando uma katana brilhante sob uma chuva de pétalas de cerejeira (sakura).',
    styleId: 'anime',
    aspectRatio: '1:1',
    lightingId: 'dramatic_noir',
    tags: ['Anime', 'Samurai', 'Sakura', 'Personagem'],
  },
  {
    id: 'insp-6',
    title: 'Natureza Morta em Óleo Clássico',
    prompt: 'Uma mesa de carvalho rústico com uma taça de vinho rubi, frutas maduras com gotas de orvalho, um livro de pergaminho antigo e uma vela tremulante em chiaroscuro profundo.',
    styleId: 'oil_painting',
    aspectRatio: '3:4',
    lightingId: 'golden_hour',
    tags: ['Pintura', 'Clássico', 'Chiaroscuro'],
  },
];

/**
 * Generates an integer seed from a string or number
 */
export function hashSeed(input: string | number): number {
  if (typeof input === 'number') {
    return Math.abs(Math.floor(input)) || 42;
  }
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) || 42;
}

/**
 * Expands and enriches a raw prompt with art direction, camera settings, and lighting
 */
export function enhancePrompt(
  rawPrompt: string,
  styleId: string,
  lightingId: string
): string {
  const trimmed = rawPrompt.trim();
  if (!trimmed) {
    return 'Detailed creative composition, vibrant color harmony, balanced framing';
  }

  const style = STYLE_PRESETS.find((s) => s.id === styleId) || STYLE_PRESETS[0];
  const lighting = LIGHTING_PRESETS.find((l) => l.id === lightingId) || LIGHTING_PRESETS[0];

  // Compose enhanced prompt
  return `${trimmed}. Visual style: ${style.promptModifier}. Lighting & atmosphere: ${lighting.modifier}.`;
}

/**
 * Returns dimensions for rendering based on aspect ratio
 */
export function getDimensionsForRatio(ratio: AspectRatioType, maxDim: number = 960): { width: number; height: number } {
  switch (ratio) {
    case '1:1':
      return { width: Math.min(800, maxDim), height: Math.min(800, maxDim) };
    case '16:9':
      return { width: maxDim, height: Math.round((maxDim * 9) / 16) };
    case '9:16':
      return { width: Math.round((maxDim * 9) / 16), height: maxDim };
    case '4:3':
      return { width: maxDim, height: Math.round((maxDim * 3) / 4) };
    case '3:4':
      return { width: Math.round((maxDim * 3) / 4), height: maxDim };
    default:
      return { width: 800, height: 800 };
  }
}

/**
 * Extracts descriptive keywords from a prompt
 */
export function extractTags(prompt: string, styleId: string): string[] {
  const tags: Set<string> = new Set();
  const lower = prompt.toLowerCase();

  const style = STYLE_PRESETS.find((s) => s.id === styleId);
  if (style) {
    tags.add(style.name.split(' ')[0]);
  }

  const keywords: Record<string, string> = {
    cyberpunk: 'Cyberpunk',
    neon: 'Néon',
    futuro: 'Futurista',
    futurista: 'Futurista',
    floresta: 'Floresta',
    espaço: 'Espaço',
    astronauta: 'Astronauta',
    dragão: 'Dragão',
    castelo: 'Castelo',
    mar: 'Oceano',
    oceano: 'Oceano',
    montanha: 'Montanha',
    robô: 'Cibernética',
    cidade: 'Metrópole',
    retrato: 'Retrato',
    anime: 'Anime',
    mágico: 'Mágica',
    estrela: 'Cosmos',
    chuva: 'Chuva',
    pôr: 'Pôr do Sol',
    amanhecer: 'Amanhecer',
  };

  for (const [key, label] of Object.entries(keywords)) {
    if (lower.includes(key)) {
      tags.add(label);
    }
  }

  if (tags.size === 0) {
    tags.add('Arte Digital');
    tags.add('Criativo');
  }

  return Array.from(tags).slice(0, 4);
}
