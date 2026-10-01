/**
 * Official Kento Season 01 artist artwork thumbnails.
 * Source: Kento’s public artist pages, retrieved 1 October 2026.
 */
export const KENTO_SEASON_ONE_ARTIST_THUMBNAILS: Record<string, string> = {
  "https://kento.art/artists/adhd/": "/manus-storage/kento-season-one-adhd_44376c26.webp",
  "https://kento.art/artists/adiw/": "/manus-storage/kento-season-one-adiw_0e0be5cc.webp",
  "https://kento.art/artists/albertine-meunier/": "/manus-storage/kento-season-one-albertine-meunier_2b953443.webp",
  "https://kento.art/artists/alienqueen/": "/manus-storage/kento-season-one-alienqueen_7b5afef5.webp",
  "https://kento.art/artists/amber-vittoria/": "/manus-storage/kento-season-one-amber-vittoria_b05deaaf.webp",
  "https://kento.art/artists/anna-lucia/": "/manus-storage/kento-season-one-anna-lucia_40f6c94d.webp",
  "https://kento.art/artists/axstone/": "/manus-storage/kento-season-one-axstone_165dc4a8.webp",
  "https://kento.art/artists/canek-zapata/": "/manus-storage/kento-season-one-canek-zapata_2f897aad.webp",
  "https://kento.art/artists/cemhah/": "/manus-storage/kento-season-one-cemhah_f7cd842a.webp",
  "https://kento.art/artists/diela/": "/manus-storage/kento-season-one-diela_4a8fea5e.webp",
  "https://kento.art/artists/elna-frederick/": "/manus-storage/kento-season-one-elna-frederick_63ec3672.webp",
  "https://kento.art/artists/enigmatriz/": "/manus-storage/kento-season-one-enigmatriz_1d433878.webp",
  "https://kento.art/artists/esra-eslen/": "/manus-storage/kento-season-one-esra-eslen_53103a00.webp",
  "https://kento.art/artists/felixfelixfelix/": "/manus-storage/kento-season-one-felixfelixfelix_8680b796.webp",
  "https://kento.art/artists/ganbrood/": "/manus-storage/kento-season-one-ganbrood_545adc7c.webp",
  "https://kento.art/artists/hayden-clay/": "/manus-storage/kento-season-one-hayden-clay_4488780b.webp",
  "https://kento.art/artists/haydiroket/": "/manus-storage/kento-season-one-haydiroket_0bf04287.webp",
  "https://kento.art/artists/khwampa/": "/manus-storage/kento-season-one-khwampa_f8b940dc.webp",
  "https://kento.art/artists/kior/": "/manus-storage/kento-season-one-kior_f4801d47.webp",
  "https://kento.art/artists/kiszkiloszki/": "/manus-storage/kento-season-one-kiszkiloszki_72c2f121.webp",
  "https://kento.art/artists/lewis-osborne/": "/manus-storage/kento-season-one-lewis-osborne_eac9c7a9.webp",
  "https://kento.art/artists/louis-dazy/": "/manus-storage/kento-season-one-louis-dazy_e6148aa3.webp",
  "https://kento.art/artists/macbeth/": "/manus-storage/kento-season-one-macbeth_d3de4e60.webp",
  "https://kento.art/artists/marcelo-pinel/": "/manus-storage/kento-season-one-marcelo-pinel_f6bc5033.webp",
  "https://kento.art/artists/mariah/": "/manus-storage/kento-season-one-mariah_70604339.webp",
  "https://kento.art/artists/mek-txt/": "/manus-storage/kento-season-one-mek-txt_98453ac2.webp",
  "https://kento.art/artists/oelhan/": "/manus-storage/kento-season-one-oelhan_435c62c6.webp",
  "https://kento.art/artists/omgidrawedit/": "/manus-storage/kento-season-one-omgidrawedit_47f575e7.webp",
  "https://kento.art/artists/perfectl00p/": "/manus-storage/kento-season-one-perfectl00p_496946af.webp",
  "https://kento.art/artists/qubibi/": "/manus-storage/kento-season-one-qubibi_e10138ab.webp",
  "https://kento.art/artists/reza-afshar/": "/manus-storage/kento-season-one-reza-afshar_d21b9443.webp",
  "https://kento.art/artists/riniifish/": "/manus-storage/kento-season-one-riniifish_a893d46b.webp",
  "https://kento.art/artists/sabato/": "/manus-storage/kento-season-one-sabato_43bb324e.webp",
  "https://kento.art/artists/salawaki/": "/manus-storage/kento-season-one-salawaki_081692e9.webp",
  "https://kento.art/artists/spogelsesmaskinen/": "/manus-storage/kento-season-one-spogelsesmaskinen_719af556.webp",
  "https://kento.art/artists/strano/": "/manus-storage/kento-season-one-strano_a36d633a.webp",
  "https://kento.art/artists/travess-smalley/": "/manus-storage/kento-season-one-travess-smalley_5b4ac74e.webp",
  "https://kento.art/artists/ubermorgen/": "/manus-storage/kento-season-one-ubermorgen_8c03aca2.webp",
  "https://kento.art/artists/violet-forest/": "/manus-storage/kento-season-one-violet-forest_38364b11.webp",
  "https://kento.art/artists/zancan/": "/manus-storage/kento-season-one-zancan_6a0a6159.webp",
};

export function getKentoArtistThumbnail(kentoUrl: string): string | undefined {
  return KENTO_SEASON_ONE_ARTIST_THUMBNAILS[kentoUrl];
}
