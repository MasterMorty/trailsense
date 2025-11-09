<template>
  <div ref="mapContainer" style="width: 100%; height: 100%; min-height: 500px;"></div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue'

import type {Map} from 'maplibre-gl'

import 'maplibre-gl/dist/maplibre-gl.css'
import mapStyle from '~/assets/map/style.json'
import polyline from '@mapbox/polyline'
import type {Feature, FeatureCollection, LineString} from 'geojson'

const center = {lat: 47.4404, lng: 12.3794}
const zoom = 13

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = ref<Map | null>(null)

let resizeObserver: ResizeObserver | null = null
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  if (process.client && mapContainer.value) {
    try {
      const maplibreModule = await import('maplibre-gl')
      const maplibregl = maplibreModule.default

      const map = new maplibregl.Map({
        container: mapContainer.value,
        // @ts-ignore
        style: mapStyle,
        center: [center.lng, center.lat],
        zoom: zoom
      })

      mapInstance.value = map

      map.on('load', () => {
        const mapEl = map.getContainer()
        resizeObserver = new ResizeObserver(() => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }
          resizeTimeout = setTimeout(() => {
            map.resize()
          }, 2)
        })

        resizeObserver.observe(mapEl)

        map.addSource('strava-segments', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        map.addLayer({
          id: 'strava-segments-layer',
          type: 'line',
          source: 'strava-segments',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 3,
            'line-opacity': 0.8
          }
        });
      })

    } catch (e) {
      console.error('Failed to load MapLibre', e)
    }
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }

  if (mapInstance.value) {
    mapInstance.value.remove()
  }
})

function getCurrentBounds(): number[] | null {
  if (mapInstance.value) {
    const mapBounds = mapInstance.value.getBounds();
    const sw = mapBounds.getSouthWest();
    const ne = mapBounds.getNorthEast();

    return [sw.lat, sw.lng, ne.lat, ne.lng];
  }
  return null;
}

function updateSegments(segments: any[]) {
  if (!mapInstance.value) return;

  const features: Feature<LineString>[] = segments.map(segment => {
    const decodedCoords = polyline.decode(segment.pathData);

    const geoJsonCoords = decodedCoords.map(coord => [coord[1], coord[0]]);

    // @ts-ignore
    const visible = deterministicRandom(segment.id) > 0.65;

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: geoJsonCoords
      },
      properties: {
        id: segment.id,
        name: segment.name,
        color: `rgba(255,0,0,${visible ? 0.2 : 0})`,
      }
    };
  });

  const geoJsonData: FeatureCollection = {
    type: 'FeatureCollection',
    features: features
  };

  const source = mapInstance.value.getSource('strava-segments');
  if (source && source.type === 'geojson') {
    // @ts-ignore
    source.setData(geoJsonData);
  }
}

const deterministicRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

defineExpose({
  getCurrentBounds,
  updateSegments,
});
</script>