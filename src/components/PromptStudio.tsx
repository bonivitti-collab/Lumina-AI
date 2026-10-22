import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Dice5,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sun,
  Maximize2,
  Palette,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  ASPECT_RATIO_OPTIONS,
  LIGHTING_PRESETS,
  SAMPLE_INSPIRATIONS,
  STYLE_PRESETS,
  enhancePrompt
} from '../utils/promptEnhancer';
import { AspectRatioType } from '../types/imageStudio';

interface PromptStudioProps {
  prompt: string;
  setPrompt: (p: string) => void;
  negativePrompt: string;
  setNegativePrompt: (np: string) => void;
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedAspectRatio: AspectRatioType;
  setSelectedAspectRatio: (ar: AspectRatioType) => void;
  selectedLighting: string;
  setSelectedLighting: (l: string) => void;
  seed: number;
  setSeed: (s: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStep: string;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  selectedStyle,
  setSelectedStyle,
  selectedAspectRatio,
  setSelectedAspectRatio,
  selectedLighting,
  setSelectedLighting,
  seed,
  setSeed,
  onGenerate,
  isGenerating,
  generationStep,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [styleCategory, setStyleCategory] = useState<string>('Todos');
  const [isEnhancedFeedback, setIsEnhancedFeedback] = useState(false);

  const categories = ['Todos', 'Realismo', 'Ficção & Fantasia', 'Arte & Pintura', 'Design & 3D'];

  const filteredStyles =
    styleCategory === 'Todos'
      ? STYLE_PRESETS
      : STYLE_PRESETS.filter((s) => s.category === styleCategory);

  const handleRandomPrompt = () => {
    const random = SAMPLE_INSPIRATIONS[Math.floor(Math.random() * SAMPLE_INSPIRATIONS.length)];
    setPrompt(random.prompt);
    setSelectedStyle(random.styleId);
    setSelectedAspectRatio(random.aspectRatio);
    setSelectedLighting(random.lightingId);
    setSeed(Math.floor(Math.random() * 999999) + 1);
  };

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    const enriched = enhancePrompt(prompt, selectedStyle, selectedLighting);
    setPrompt(enriched);
    setIsEnhancedFeedback(true);
    setTimeout(() => setIsEnhancedFeedback(false), 2000);
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 999999) + 1);
  };

  return (
    <div className="space-y-6">
      {/* Prompt input card */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <label htmlFor="prompt-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Descreva a imagem que deseja criar:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPrompt}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Preencher com um prompt aleatório criativo"
            >
              <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt Aleatório</span>
            </button>
            {prompt && (
              <button
                onClick={() => setPrompt('')}
                className="text-xs px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                title="Limpar texto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            id="prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Uma cidade futurista flutuando entre as nuvens com cachoeiras de cristal, iluminação dourada do entardecer e naves espaciais velozes..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onGenerate();
              }
            }}
          />

          {/* Quick enhancer bar inside textarea area */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 mt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnhance}
                disabled={!prompt.trim() || isGenerating}
                className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                  isEnhancedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/40'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isEnhancedFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Prompt Aprimorado!</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-purple-300" />
                    <span>Aprimorar com IA</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Ctrl + Enter para gerar
              </span>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              {prompt.length} caracteres
            </div>
          </div>
        </div>

        {/* Negative prompt toggle */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Configurações avançadas (Prompt negativo & Seed)</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  Prompt Negativo (o que evitar na imagem):
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Ex: desfoque, baixa resolução, distorção, texto indesejado"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 block mb-1">
                    Seed determinístico (semente de geração):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value) || 1)}
                      className="w-36 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleRandomSeed}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
                      title="Gerar nova semente aleatória"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Aleatório</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Style Preset Selector */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">Estilo Artístico</h3>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setStyleCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  styleCategory === cat
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {filteredStyles.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* Visual gradient stripe */}
                <div className={`h-1 w-full rounded-full bg-gradient-to-r ${style.gradient} mb-2.5`} />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                    {style.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {style.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {style.features.slice(0, 2).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio & Lighting Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Proporção (Aspect Ratio)</h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {ASPECT_RATIO_OPTIONS.map((ar) => {
              const isSelected = selectedAspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setSelectedAspectRatio(ar.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {/* Icon miniature representation */}
                  <div
                    className={`w-7 border-2 rounded-sm mb-1.5 transition-colors ${
                      isSelected ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-600 bg-slate-800'
                    } ${
                      ar.id === '1:1'
                        ? 'h-7'
                        : ar.id === '16:9'
                        ? 'h-4 w-8'
                        : ar.id === '9:16'
                        ? 'h-8 w-5'
                        : ar.id === '4:3'
                        ? 'h-5 w-7'
                        : 'h-7 w-5'
                    }`}
                  />
                  <span className="text-xs font-semibold">{ar.id}</span>
                  <span className="text-[10px] text-slate-500 truncate w-full mt-0.5">
                    {ar.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lighting & Mood */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">Iluminação & Clima</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LIGHTING_PRESETS.map((light) => {
              const isSelected = selectedLighting === light.id;
              return (
                <button
                  key={light.id}
                  type="button"
                  onClick={() => setSelectedLighting(light.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: light.colorTone }}
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium truncate">{light.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Generate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-semibold text-base shadow-xl shadow-purple-600/25 border border-purple-400/20 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.008] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>{generationStep || 'Sintetizando Obra de Arte...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span>Gerar Imagem com IA</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 mt-2 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Geração instantânea e determinística com suporte a resolução 4K e exportação PNG</span>
        </p>
      </div>
    </div>
  );
};
