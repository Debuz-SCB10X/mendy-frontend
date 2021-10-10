import mergeImages from "merge-images";

const LAYERS: string[] = ["tail", "body", "eyes", "mouth", "leg", "back", "forehead", "ear"];

export async function createPetImg(appeareances: number[]): Promise<string> {
  return await mergeImages(appeareances.map((e, i) => `img/${LAYERS[i]}/${wrap(e, i).toString().padStart(2, "0")}.png`));
}

const LIMIT: number[] = [16, 16, 16, 16, 16, 16, 22, 16];

function wrap(v: number, layer: number): number {
  return (v % LIMIT[layer]);
}
