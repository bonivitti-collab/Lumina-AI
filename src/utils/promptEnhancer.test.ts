import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashSeed,
  enhancePrompt,
  getDimensionsForRatio,
  extractTags,
  STYLE_PRESETS,
  LIGHTING_PRESETS
} from './promptEnhancer.ts';

test('hashSeed generates stable, deterministic positive numbers', () => {
  const seed1 = hashSeed('cyberpunk-city');
  const seed2 = hashSeed('cyberpunk-city');
  assert.equal(seed1, seed2, 'Same input string should yield exact same seed');
  assert.ok(seed1 > 0, 'Seed should be a positive integer');

  const numSeed = hashSeed(12345);
  assert.equal(numSeed, 12345, 'Numeric seed should be preserved');
});

test('enhancePrompt enriches prompt with style and lighting modifiers', () => {
  const raw = 'Um dragão sobrevoando uma montanha';
  const enhanced = enhancePrompt(raw, 'cyberpunk', 'neon_night');
  
  assert.ok(enhanced.includes(raw), 'Enhanced prompt should contain raw user prompt');
  assert.ok(enhanced.includes('cyberpunk aesthetic'), 'Enhanced prompt should contain cyberpunk keywords');
  assert.ok(enhanced.includes('vibrant electric neon'), 'Enhanced prompt should contain lighting keywords');
});

test('enhancePrompt handles empty input gracefully', () => {
  const enhanced = enhancePrompt('', 'photoreal', 'golden_hour');
  assert.ok(enhanced.length > 20, 'Should return a default enhanced prompt when input is empty');
});

test('getDimensionsForRatio calculates proportional dimensions correctly', () => {
  const square = getDimensionsForRatio('1:1', 800);
  assert.equal(square.width, 800);
  assert.equal(square.height, 800);

  const widescreen = getDimensionsForRatio('16:9', 960);
  assert.equal(widescreen.width, 960);
  assert.equal(widescreen.height, 540);

  const vertical = getDimensionsForRatio('9:16', 960);
  assert.equal(vertical.height, 960);
  assert.equal(vertical.width, 540);
});

test('extractTags correctly identifies subject matter and style tags', () => {
  const tags = extractTags('Um astronauta no espaço sob chuva de meteoros', 'photoreal');
  assert.ok(tags.includes('Astronauta'), 'Should detect Astronauta');
  assert.ok(tags.includes('Espaço'), 'Should detect Espaço');
  assert.ok(tags.includes('Fotorealista'), 'Should include style tag');
});

test('STYLE_PRESETS contains all expected categories and valid colors', () => {
  assert.ok(STYLE_PRESETS.length >= 6, 'Should have at least 6 presets');
  for (const preset of STYLE_PRESETS) {
    assert.ok(preset.id.length > 0);
    assert.ok(preset.name.length > 0);
    assert.ok(preset.primaryColors.length >= 2, 'Must have at least 2 primary colors');
  }
});
