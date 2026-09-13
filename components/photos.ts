// ══════════════════════════════════════════════════════════════
//  FOTOS DE LA QUINCEAÑERA — Celeste
//  Para cambiar una foto: pega aquí la URL (Supabase o /public).
//  Si la dejas vacía "", se muestra un placeholder verde elegante.
//
//  Foto 1 (hero)        → de espaldas, vertical 9:16, golden hour
//  Foto 2 (framed)      → arco de piedra colonial, marco rasgado
//  Foto 3 (framed2)     → jardín de glicinas, marco rasgado
//  Foto 4 (closing)     → bosque encantado, vertical 9:16
// ══════════════════════════════════════════════════════════════
const BASE = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-celeste-melgar";

export const PHOTOS = {
  hero: `${BASE}/hero.jpg`,
  framed: `${BASE}/framed-arco.jpg`,
  framed2: `${BASE}/framed-jardin.jpg`,
  closing: `${BASE}/closing.jpg`,
};
