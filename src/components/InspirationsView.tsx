import React from 'react';
import { Sparkles, ArrowRight, Compass, Palette, Maximize2, Sun } from 'lucide-react';
import { PromptInspiration } from '../types/imageStudio';
import { SAMPLE_INSPIRATIONS, STYLE_PRESETS, LIGHTING_PRESETS } from '../utils/promptEnhancer';

interface InspirationsViewProps {
  onUseInspiration: (insp: PromptInspiration) => void;
}

export const InspirationsView: React.FC<InspirationsViewProps> = ({ onUseInspiration }) => {
  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/40 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Biblioteca de Ideias</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight mb-2">
            Inspirações e Prompts Pré-Configurados
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Selecione qualquer uma das receitas visuais abaixo para carregar instantaneamente o prompt, estilo artístico, iluminação e proporção no estúdio criativo.
          </p>
        </div>
      </div>

      {/* Inspirations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAMPLE_INSPIRATIONS.map((insp) => {
          const style = STYLE_PRESETS.find((s) => s.id === insp.styleId);
          const lighting = LIGHTING_PRESETS.find((l) => l.id === insp.lightingId);

          return (
            <div
              key={insp.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-purple-500/40 transition-all group"
            >
              <div>
                {/* Header with Title and Tags */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                    {insp.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {insp.aspectRatio}
                  </span>
                </div>

                {/* Prompt Text */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-4 italic">
                  "{insp.prompt}"
                </p>

                {/* Settings pills */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Palette className="w-3.5 h-3.5 text-purple-400" />
                    <span>Estilo:</span>
                    <span className="text-slate-200 font-medium">{style?.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Iluminação:</span>
                    <span className="text-slate-200 font-medium">{lighting?.name}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {insp.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onUseInspiration(insp)}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 hover:border-purple-500 text-purple-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Usar este Prompt no Estúdio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
