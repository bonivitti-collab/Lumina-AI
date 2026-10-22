import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Heart,
  Trash2,
  ExternalLink,
  Filter,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GeneratedImage } from '../types/imageStudio';
import { STYLE_PRESETS } from '../utils/promptEnhancer';

interface GalleryProps {
  images: GeneratedImage[];
  onSelectImage: (image: GeneratedImage) => void;
  onDeleteImage: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onGoToStudio: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  images,
  onSelectImage,
  onDeleteImage,
  onToggleFavorite,
  onGoToStudio,
}) => {
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredImages = images.filter((img) => {
    if (onlyFavorites && !img.favorite) return false;
    if (filterStyle !== 'all' && img.styleId !== filterStyle) return false;
    return true;
  });

  const handleCopy = (img: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(img.prompt);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (img: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.download = `lumina_${img.styleId}_${img.id}.png`;
    link.href = img.dataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top filters */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-slate-200">
            Galeria de Criações ({filteredImages.length})
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Favorite filter toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
              onlyFavorites
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 font-medium'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-400' : ''}`} />
            <span>Favoritos</span>
          </button>

          {/* Style filter dropdown */}
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            className="text-xs bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">Todos os Estilos</option>
            {STYLE_PRESETS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Images */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map((image) => {
            const style = STYLE_PRESETS.find((s) => s.id === image.styleId);
            return (
              <div
                key={image.id}
                onClick={() => onSelectImage(image)}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg group hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Image preview with aspect ratio container */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={image.dataUrl}
                    alt={image.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top-right favorite button overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(image.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        image.favorite
                          ? 'bg-rose-950/80 text-rose-400'
                          : 'bg-black/60 text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100'
                      }`}
                      title="Favoritar"
                    >
                      <Heart className={`w-3.5 h-3.5 ${image.favorite ? 'fill-rose-400' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom style tag badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-medium">
                      {style?.name || image.styleId}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 font-mono">
                      {image.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    "{image.prompt}"
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(image.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopy(image, e)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Copiar prompt"
                      >
                        {copiedId === image.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => handleDownload(image, e)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Baixar imagem"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteImage(image.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                        title="Excluir da galeria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty gallery state */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center max-w-lg mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            Nenhuma imagem encontrada
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {onlyFavorites
              ? 'Você ainda não marcou nenhuma imagem como favorita.'
              : 'Gere novas imagens no estúdio para compor sua galeria pessoal.'}
          </p>
          <button
            onClick={onGoToStudio}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <span>Ir para o Estúdio Criativo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
