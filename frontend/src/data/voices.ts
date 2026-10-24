import type { Voice } from "@/types/news"

/** Known outlets. Order matters: stories refer to outlets by index. */
export const voices: Voice[] = [
  { name: "Reuters", color: "#f05b46" },
  { name: "The Verge", color: "#f4d932" },
  { name: "WIRED", color: "#82c59b" },
  { name: "Bloomberg", color: "#ee91a4" },
  { name: "Ars Technica", color: "#7fb7eb" },
  { name: "404 Media", color: "#bd91d4" },
  { name: "MIT Tech Review", color: "#f3973f" },
  { name: "TechCrunch", color: "#93c968" },
  { name: "Rest of World", color: "#f2b9d0" },
  { name: "Financial Times", color: "#f3bca2" },
  { name: "Semafor", color: "#7bcbd0" },
  { name: "IEEE Spectrum", color: "#a4a8ed" },
]

/** Outlets hushed when the page first loads. */
export const initiallyMuted: number[] = []
