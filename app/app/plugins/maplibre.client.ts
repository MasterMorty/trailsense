import maplibregl from 'maplibre-gl'
import { PMTiles, Protocol } from 'pmtiles'

export default defineNuxtPlugin(() => {
    const protocol = new Protocol()

    maplibregl.addProtocol('pmtiles', protocol.tile)

    const p = new PMTiles('https://maps.daugt.com/world.pmtiles')
    protocol.add(p)

    return {
        provide: {
            maplibregl
        }
    }
})
