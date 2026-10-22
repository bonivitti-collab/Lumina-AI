/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { PromptStudio } from './components/PromptStudio';
import { ImageCanvas } from './components/ImageCanvas';
import { Gallery } from './components/Gallery';
import { InspirationsView } from './components/InspirationsView';
import { PromptGuideView } from './components/PromptGuideView';
import { AspectRatioType, GeneratedImage, PromptInspiration } from './types/imageStudio';
import { synthesizeArtwork } from './utils/imageSynthesizer';
import { enhancePrompt, extractTags } from './utils/promptEnhancer';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'lumina_ai_gallery_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery' | 'inspirations' | 'guide'>('studio');
  
  // Studio form states
  const [prompt, setPrompt] = useState<string>(
    'Uma metrópole futurista no estilo cyberpunk com arranha-céus colossais, letreiros em néon refletindo no asfalto molhado e naves voadoras sob chuva leve'
  );
  const [negativePrompt, setNegativePrompt] = useState<string>('desfoque, baixa qualidade, ruído');
  const [selectedStyle, setSelectedStyle] = useState<string>('cyberpunk');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioType>('16:9');
  const [selectedLighting, setSelectedLighting] = useState<string>('neon_night');
  const [seed, setSeed] = useState<number>(42891);

  // Active artwork & gallery state
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate artwork function
  const handleGenerate = useCallback(
    async (customSeed?: number) => {
      if (!prompt.trim() || isGenerating) return;

      setIsGenerating(true);
      const activeSeed = customSeed !== undefined ? customSeed : seed;

      // Realistic generation phases
      setGenerationStep('1/4: Analisando prompt e intenção semântica...');
      await new Promise((r) => setTimeout(r, 300));

      setGenerationStep('2/4: Calculando profundidade e composição...');
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep('3/4: Aplicando iluminação volumétrica e paleta...');
      await new Promise((r) => setTimeout(r, 450));

      setGenerationStep('4/4: Finalizando detalhes e texturas...');
      
      try {
        const dataUrl = await synthesizeArtwork(
          prompt,
          selectedStyle,
          selectedLighting,
          selectedAspectRatio,
          activeSeed
        );

        const enhanced = enhancePrompt(prompt, selectedStyle, selectedLighting);
        const tags = extractTags(prompt, selectedStyle);

        const newImage: GeneratedImage = {
          id: `img_${Date.now()}_${activeSeed}`,
          prompt,
          enhancedPrompt: enhanced,
          styleId: selectedStyle,
          aspectRatio: selectedAspectRatio,
          lightingId: selectedLighting,
          seed: activeSeed,
          createdAt: Date.now(),
          dataUrl,
          tags,
          favorite: false,
        };

        setCurrentImage(newImage);
        setGalleryImages((prev) => {
          const updated = [newImage, ...prev];
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
          } catch {
            // storage quota fallback
          }
          return updated;
        });

        showToast('Imagem sintetizada com sucesso!');
      } catch (err) {
        console.error('Error generating artwork:', err);
        showToast('Erro ao gerar imagem. Tente novamente.');
      } finally {
        setIsGenerating(false);
        setGenerationStep('');
      }
    },
    [prompt, selectedStyle, selectedLighting, selectedAspectRatio, seed, isGenerating]
  );

  // Initialize gallery and first generation on mount
  useEffect(() => {
    // Check saved gallery
    let initialList: GeneratedImage[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        initialList = JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    if (initialList.length > 0) {
      setGalleryImages(initialList);
      setCurrentImage(initialList[0]);
    } else {
      // Generate initial showcase image
      synthesizeArtwork(prompt, 'cyberpunk', 'neon_night', '16:9', 42891).then((dataUrl) => {
        const firstImg: GeneratedImage = {
          id: 'initial_cyberpunk_1',
          prompt,
          enhancedPrompt: enhancePrompt(prompt, 'cyberpunk', 'neon_night'),
          styleId: 'cyberpunk',
          aspectRatio: '16:9',
          lightingId: 'neon_night',
          seed: 42891,
          createdAt: Date.now(),
          dataUrl,
          tags: ['Cyberpunk', 'Metrópole', 'Néon'],
          favorite: true,
        };
        setCurrentImage(firstImg);
        setGalleryImages([firstImg]);
      });
    }
  }, []);

  // Handle variation
  const handleGenerateVariation = () => {
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    setSeed(newSeed);
    handleGenerate(newSeed);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setGalleryImages((prev) => {
      const updated = prev.map((img) => (img.id === id ? { ...img, favorite: !img.favorite } : img));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
      } catch {
        // quota fallback
      }
      return updated;
    });

    if (currentImage && currentImage.id === id) {
      setCurrentImage((curr) => (curr ? { ...curr, favorite: !curr.favorite } : null));
    }
  };

  // Delete image
  const handleDeleteImage = (id: string) => {
    setGalleryImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // quota fallback
      }
      return updated;
    });

    if (currentImage && currentImage.id === id) {
      setCurrentImage(galleryImages.find((img) => img.id !== id) || null);
    }
    showToast('Imagem removida da galeria');
  };

  // Select image from gallery to view and edit in Studio
  const handleSelectFromGallery = (image: GeneratedImage) => {
    setCurrentImage(image);
    setPrompt(image.prompt);
    setSelectedStyle(image.styleId);
    setSelectedAspectRatio(image.aspectRatio);
    setSelectedLighting(image.lightingId);
    setSeed(image.seed);
    setActiveTab('studio');
  };

  // Load an inspiration recipe into the studio
  const handleUseInspiration = (insp: PromptInspiration) => {
    setPrompt(insp.prompt);
    setSelectedStyle(insp.styleId);
    setSelectedAspectRatio(insp.aspectRatio);
    setSelectedLighting(insp.lightingId);
    setSeed(Math.floor(Math.random() * 900000) + 100000);
    setActiveTab('studio');
    showToast(`Inspiração "${insp.title}" carregada no estúdio!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-purple-500/50 shadow-2xl rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs text-white animate-bounce-subtle">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        generationsCount={galleryImages.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: STUDIO */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Controls */}
            <div className="lg:col-span-7">
              <PromptStudio
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                selectedAspectRatio={selectedAspectRatio}
                setSelectedAspectRatio={setSelectedAspectRatio}
                selectedLighting={selectedLighting}
                setSelectedLighting={setSelectedLighting}
                seed={seed}
                setSeed={setSeed}
                onGenerate={() => handleGenerate()}
                isGenerating={isGenerating}
                generationStep={generationStep}
              />
            </div>

            {/* Right Column: Interactive Canvas & Viewer */}
            <div className="lg:col-span-5 sticky top-24">
              <ImageCanvas
                currentImage={currentImage}
                isGenerating={isGenerating}
                generationStep={generationStep}
                onGenerateVariation={handleGenerateVariation}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>
        )}

        {/* TAB 2: GALLERY */}
        {activeTab === 'gallery' && (
          <Gallery
            images={galleryImages}
            onSelectImage={handleSelectFromGallery}
            onDeleteImage={handleDeleteImage}
            onToggleFavorite={handleToggleFavorite}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {/* TAB 3: INSPIRATIONS */}
        {activeTab === 'inspirations' && (
          <InspirationsView onUseInspiration={handleUseInspiration} />
        )}

        {/* TAB 4: GUIDE */}
        {activeTab === 'guide' && (
          <PromptGuideView onGoToStudio={() => setActiveTab('studio')} />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>Lumina AI • Estúdio de Criação & Síntese de Imagens em Alta Resolução</p>
      </footer>
    </div>
  );
}
