/**
 * Conversão de vídeo no navegador com FFmpeg.wasm.
 * Presets para TikTok Shop e Shopee Vídeo (9:16, duração e tamanho dentro dos limites).
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const INPUT_NAME = 'input.mp4';
const OUTPUT_NAME = 'output.mp4';

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export type PlatformPreset = 'tiktok' | 'shopee';

/** Carrega o FFmpeg uma vez (lazy). Use ESM no Vite. */
export async function loadFFmpeg(onProgress?: (log: string) => void): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
  const ffmpeg = new FFmpeg();

  if (onProgress) {
    ffmpeg.on('log', ({ message }) => onProgress(message));
  }

  loadPromise = ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  ffmpegInstance = await loadPromise;
  return ffmpegInstance;
}

/**
 * Argumentos FFmpeg para cada plataforma.
 * TikTok: 9:16, 1080x1920, até 60s, MP4.
 * Shopee: 9:16, 720x1280, até 60s, MP4, bitrate limitado (~30 MB).
 * Usamos mpeg4 e aac por compatibilidade com o build wasm no navegador.
 */
function getPresetArgs(preset: PlatformPreset): string[] {
  const common = ['-i', INPUT_NAME, '-t', '60', '-movflags', '+faststart'];
  if (preset === 'tiktok') {
    const vf = 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2';
    return [...common, '-vf', vf, '-c:v', 'mpeg4', '-q:v', '5', '-c:a', 'aac', OUTPUT_NAME];
  }
  const vf = 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2';
  return [...common, '-vf', vf, '-c:v', 'mpeg4', '-q:v', '6', '-b:v', '400k', '-maxrate', '500k', '-c:a', 'aac', OUTPUT_NAME];
}

/**
 * Converte o vídeo para o preset da plataforma e retorna o blob MP4.
 * videoUrl deve ser acessível pelo navegador (ex.: URL do proxy).
 */
export async function convertVideoForPlatform(
  preset: PlatformPreset,
  videoUrl: string,
  onProgress?: (log: string) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg(onProgress);
  const data = await fetchFile(videoUrl);
  await ffmpeg.writeFile(INPUT_NAME, data);

  const args = getPresetArgs(preset);
  await ffmpeg.exec(args);

  const output = await ffmpeg.readFile(OUTPUT_NAME);
  await ffmpeg.deleteFile(INPUT_NAME).catch(() => {});
  await ffmpeg.deleteFile(OUTPUT_NAME).catch(() => {});

  return new Blob([output], { type: 'video/mp4' });
}
