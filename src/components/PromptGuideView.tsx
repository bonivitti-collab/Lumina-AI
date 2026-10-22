import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Camera,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PromptGuideViewProps {
  onGoToStudio: () => void;
}

export const PromptGuideView: React.FC<PromptGuideViewProps> = ({ onGoToStudio }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guia Prático de Engenharia de Prompts</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight mb-3">
          Como Criar Imagens Incríveis com Inteligência Artificial
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Modelos de IA generativa transformam descrições em linguagem natural em pixels com base em bilhões de relações visuais. Quanto mais clara e rica for a sua descrição, mais impressionante será o resultado final.
        </p>
      </div>

      {/* The 5 Key Pillars of an AI Prompt */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-purple-400" />
          A Anatomia de um Prompt Perfeito (Fórmula em 5 Etapas)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>1. Sujeito Principal</span>
            </div>
            <p className="text-xs text-slate-300">
              Defina com precisão quem ou o que está no centro da cena. Evite termos vagos como "uma pessoa"; prefira "um astronauta experiente com uniforme tático de titânio".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>2. Ambiente & Cenário</span>
            </div>
            <p className="text-xs text-slate-300">
              Onde o sujeito está inserido? Exemplo: "em uma floresta tropical mágica com neblina matinal e ruínas de cristal antigo cobertas de musgo".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>3. Iluminação & Atmosfera</span>
            </div>
            <p className="text-xs text-slate-300">
              A luz é a alma da imagem. Use termos como: "luz da hora dourada", "néon volumétrico", "iluminação de estúdio com softbox" ou "chiaroscuro dramático".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>4. Estilo & Meio Artístico</span>
            </div>
            <p className="text-xs text-slate-300">
              Escolha o formato visual: fotografia f/1.4, render 3D Octane, pintura a óleo com impasto, ilustração em aquarela ou anime cel-shading.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison: Weak vs Strong Prompts */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Exemplos: Antes e Depois da Otimização
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Prompt Comum (Genérico):</span>
            </div>
            <p className="text-xs text-slate-400 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              "Um gato fofo na chuva."
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Prompt Profissional (Rico e Direto):</span>
            </div>
            <p className="text-xs text-slate-200 font-mono bg-purple-950/30 p-2.5 rounded-lg border border-purple-500/30">
              "Close-up cinematográfico de um pequeno filhote de gato tigrado com gotas de orvalho no pelo, sentado sob uma grande folha verde em um dia chuvoso, iluminação suave da hora dourada, lente 85mm f/1.8 com bokeh cremoso no fundo."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <button
          onClick={onGoToStudio}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 inline-flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Experimentar no Estúdio Criativo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
