import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Maximize2,
  RefreshCw,
  Heart,
  Sliders,
  Sparkles,
  Calendar,
  Layers,
  Hash,
  X
} from 'lucide-react';
import { GeneratedImage } from '../types/imageStudio';
import { STYLE_PRESETS, LIGHTING_PRESETS } from '../utils/promptEnhancer';

interface ImageCanvasProps {
  currentImage: GeneratedImage | null;
  isGenerating: boolean;
  generationStep: string;
  onGenerateVariation: () => void;
  onToggleFavorite: (id: string) => void;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  currentImage,
  isGenerating,
  generationStep,
  onGenerateVariation,
  onToggleFavorite,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filterStyles: Record<string, string> = {
    normal: '',
    cyber: 'hue-rotate-15 contrast-125 saturate-150 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    vintage: 'sepia-[0.35] contrast-105 saturate-90 brightness-95',
    noir: 'grayscale contrast-130 brightness-90',
    vivid: 'saturate-150 contrast-110 brightness-105',
  };

  const handleCopyPrompt = () => {
    if (!currentImage) return;
    navigator.clipboard.writeText(currentImage.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.download = `lumina_${currentImage.styleId}_${Date.now()}.png`;
    link.href = currentImage.dataUrl;
    link.click();
  };

  const currentStyle = STYLE_PRESETS.find((s) => s.id === currentImage?.styleId);
  const currentLighting = LIGHTING_PRESETS.find((l) => l.id === currentImage?.lightingId);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-200">Visualização em Tempo Real</h3>
        </div>

        {currentImage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(currentImage.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                currentImage.favorite
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
              }`}
              title="Favoritar imagem"
            >
              <Heart className={`w-4 h-4 ${currentImage.favorite ? 'fill-rose-400' : ''}`} />
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Expandir para tela cheia"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Visual Display Area */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[380px] relative rounded-xl bg-slate-950/70 border border-slate-800/80 p-3 overflow-hidden">
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 animate-spin p-[2px]">
                <div className="w-full h-full bg-slate-950 rounded-[14px]" />
              </div>
              <Sparkles className="w-8 h-8 text-purple-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <h4 className="text-base font-semibold text-white mb-2">Criando sua Imagem...</h4>
            <p className="text-sm text-purple-300 font-medium animate-pulse">{generationStep}</p>

            <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-cyan-400 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Rendered Artwork */}
        {currentImage ? (
          <div className="relative group max-w-full max-h-[500px] flex items-center justify-center">
            <img
              src={currentImage.dataUrl}
              alt={currentImage.prompt}
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-[480px] rounded-lg shadow-2xl object-contain transition-all duration-300 ${
                filterStyles[activeFilter] || ''
              }`}
            />
          </div>
        ) : (
          /* Empty state */
          <div className="text-center p-8 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 opacity-80" />
            </div>
            <h4 className="text-base font-semibold text-slate-200 mb-1">Nenhuma imagem criada ainda</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Escreva uma descrição ao lado, escolha o estilo artístico desejado e clique no botão para gerar sua primeira obra de arte.
            </p>
          </div>
        )}
      </div>

      {/* Filter Chips Bar (if image exists) */}
      {currentImage && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Filtro Visual:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Proporção {currentImage.aspectRatio}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'normal', label: 'Original' },
              { id: 'vivid', label: 'Vívido HDR' },
              { id: 'cyber', label: 'Néon Cyber' },
              { id: 'vintage', label: 'Vintage 35mm' },
              { id: 'noir', label: 'Noir P&B' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  activeFilter === f.id
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-medium'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Prompt Preview & Badges */}
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <p className="text-slate-300 italic line-clamp-2">"{currentImage.prompt}"</p>

            <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/60">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40 font-medium">
                {currentStyle?.name || currentImage.styleId}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40 font-medium">
                {currentLighting?.name || currentImage.lightingId}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono flex items-center gap-1">
                <Hash className="w-2.5 h-2.5" />
                {currentImage.seed}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={handleDownload}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Baixar PNG</span>
            </button>

            <button
              onClick={handleCopyPrompt}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copiar Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={onGenerateVariation}
              disabled={isGenerating}
              className="py-2.5 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-purple-700/50 disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
              <span>Nova Variação</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização em tela cheia"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-lg"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700"
              title="Fechar tela cheia"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={currentImage.dataUrl}
              alt={currentImage.prompt}
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl ${
                filterStyles[activeFilter] || ''
              }`}
            />

            <div className="mt-4 text-center max-w-2xl">
              <p className="text-sm text-slate-200 font-medium">"{currentImage.prompt}"</p>
              <p className="text-xs text-slate-400 mt-1">
                {currentStyle?.name} • Proporção {currentImage.aspectRatio} • Seed #{currentImage.seed}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
