/** Scene coordinates are 520 x 330. */
export const SCENE_WIDTH = 520
export const SCENE_HEIGHT = 330

/**
 * Bench spots on the stage: [x, feet]. `feet` is the y position where a
 * singer stands. Listed in fill order: back row first, centre-out within
 * each row, so a small choir still looks balanced.
 */
export const stageSlots: [x: number, feet: number][] = [
  // back row
  [232, 144],
  [289, 144],
  [175, 144],
  [346, 144],
  // middle row
  [203, 206],
  [317, 206],
  [146, 206],
  [374, 206],
  // front row
  [177, 268],
  [343, 268],
  [120, 268],
  [400, 268],
]
