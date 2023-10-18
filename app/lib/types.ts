import type { PostgrestError } from "@supabase/supabase-js";

export const gunTypes: { [key: string]: string } = {
  assault: "Assault",
  sniper: "Sniper",
  lmg: "LMG",
  smg: "SMG",
  shotgun: "Shotgun",
  marksman: "Marksman",
};

export const attachmentTypes: { [key: string]: string } = {
  muzzle: "Muzzle",
  barrel: "Barrel",
  optic: "Optic",
  stock: "Stock",
  grip: "Rear Grip",
  magazine: "Magazine",
  underbarrel: "Underbarrel",
  laser: "Laser",
  perk: "Perk",
};

export type Sort = {
  id: string;
  desc: boolean;
};

export type Filter = {
  id: string;
  value: unknown;
};

export type Error = {
  name?: string;
  type?: string;
  attachment?: string;
  model?: string;
  server?: PostgrestError;
  request?: string;
};
