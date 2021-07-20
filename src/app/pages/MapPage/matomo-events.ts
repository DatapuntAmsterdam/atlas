import type { TrackEventParams } from '@datapunt/matomo-tracker-react/lib/types'

const CATEGORY = 'kaart-2.0'

export const DRAWTOOL_REMOVE_POLYGON: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-verwijder-polygoon',
}

export const DRAWTOOL_ADD_POLYGON: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-nieuw-polygoon',
}

export const DRAWTOOL_EDIT_POLYGON: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-wijzig-polygoon',
}

export const DRAWTOOL_REMOVE_POLYLINE: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-verwijder-lijn',
}

export const DRAWTOOL_ADD_POLYLINE: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-nieuw-lijn',
}

export const DRAWTOOL_EDIT_POLYLINE: TrackEventParams = {
  category: CATEGORY,
  action: 'tekentool-wijzig-lijn',
}

export const BASE_LAYER_CHANGE: TrackEventParams = {
  category: CATEGORY,
  action: 'wijzig-ondergrond',
}

export const MARKER_SET: TrackEventParams = {
  category: CATEGORY,
  action: 'kaart-puntzoek',
}

export const PANORAMA_FULLSCREEN_TOGGLE: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-volledig-klik',
}

export const PANORAMA_CLOSE: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-sluit',
}

export const PANORAMA_SELECT: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-selecteer',
}

export const PANORAMA_THUMBNAIL: TrackEventParams = {
  category: CATEGORY,
  action: 'panorama-thumbnail',
}

export const LEGEND_OPEN: TrackEventParams = {
  category: CATEGORY,
  action: 'legenda-open',
}

export const LEGEND_CLOSE: TrackEventParams = {
  category: CATEGORY,
  action: 'legenda-sluit',
}

export const ZOOM_IN: TrackEventParams = {
  category: CATEGORY,
  action: 'zoom-in-knop',
}

export const ZOOM_OUT: TrackEventParams = {
  category: CATEGORY,
  action: 'zoom-uit-knop',
}

export const CONTEXT_MENU_SHARE: TrackEventParams = {
  category: CATEGORY,
  action: 'menu-delen',
}

export const CONTEXT_MENU_PRINT: TrackEventParams = {
  category: CATEGORY,
  action: 'menu-printen',
}

export const CONTEXT_MENU_EMBED: TrackEventParams = {
  category: CATEGORY,
  action: 'menu-embed',
}

export const DRAWER_HANDLE: TrackEventParams = {
  category: CATEGORY,
  action: 'panel-handle',
}

export const DATASELECTION_ADD_FILTER: TrackEventParams = {
  category: CATEGORY,
  action: 'dataselectie-filter-toevoegen',
}

export const DATASELECTION_REMOVE_FILTER: TrackEventParams = {
  category: CATEGORY,
  action: 'dataselectie-filter-verwijderen',
}

export const DATASELECTION_TABLE_BUTTON: TrackEventParams = {
  category: CATEGORY,
  action: 'dataselectie-tabel-toggle',
}

export const DATASELECTION_MAP_BUTTON: TrackEventParams = {
  category: CATEGORY,
  action: 'dataselectie-kaart-toggle',
}

export const BEFORE_PRINT: TrackEventParams = {
  category: CATEGORY,
  action: 'print-dialoog-open',
}

export const AFTER_PRINT: TrackEventParams = {
  category: CATEGORY,
  action: 'print-dialoog-dicht',
}
