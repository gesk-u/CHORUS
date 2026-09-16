import type { StageVoice } from "@/types/news"

/** What each outlet "sings" about the headliner, by outlet index. */
export const stageVoices: StageVoice[] = [
  ["Reuters", "Open releases narrow the performance gap again"],
  ["The Verge", "The gap is closing much faster than expected"],
  ["WIRED", "Small models are having a very big week"],
  ["Bloomberg", "Open AI puts new pressure on premium pricing"],
  ["Ars Technica", "Local models just became far more practical"],
  ["404 Media", "Running capable AI locally gets much easier"],
  ["MIT Tech Review", "Benchmarks show a fast-changing field"],
  ["TechCrunch", "A new release resets startup expectations"],
  ["Rest of World", "Cheaper models could widen global access"],
  ["Financial Times", "Investors rethink the closed-model advantage"],
  ["Semafor", "The race shifts from scale to distribution"],
  ["IEEE Spectrum", "Efficiency gains matter more than model size"],
]

/** Scene coordinates are 520 x 330. */
export const SCENE_WIDTH = 520
export const SCENE_HEIGHT = 330

/**
 * Singer placement on the stage: [x, feet, outletIndex].
 * `feet` is the y position where the singer stands on a bench.
 */
export const stagePositions: [x: number, feet: number, outlet: number][] = [
  [175, 144, 0],
  [232, 144, 1],
  [289, 144, 2],
  [346, 144, 3],
  [146, 206, 4],
  [203, 206, 5],
  [317, 206, 6],
  [374, 206, 7],
  [120, 268, 8],
  [177, 268, 9],
  [343, 268, 10],
  [400, 268, 11],
]
