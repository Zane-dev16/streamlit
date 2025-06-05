/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { memo, useEffect, useRef } from "react"

import MapView from "@arcgis/core/views/MapView"
import WebMap from "@arcgis/core/WebMap"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import TileLayer from "@arcgis/core/layers/TileLayer"
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"
import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
import ImageryLayer from "@arcgis/core/layers/ImageryLayer"
import WMTSLayer from "@arcgis/core/layers/WMTSLayer"
import WMSLayer from "@arcgis/core/layers/WMSLayer"
import WebTileLayer from "@arcgis/core/layers/WebTileLayer"
import OpenStreetMapLayer from "@arcgis/core/layers/OpenStreetMapLayer"
import KMLLayer from "@arcgis/core/layers/KMLLayer"
import CSVLayer from "@arcgis/core/layers/CSVLayer"
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer"
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer"
import PointCloudLayer from "@arcgis/core/layers/PointCloudLayer"
import ElevationLayer from "@arcgis/core/layers/ElevationLayer"
import VideoLayer from "@arcgis/core/layers/VideoLayer"
import VoxelLayer from "@arcgis/core/layers/VoxelLayer"
import Layer from "@arcgis/core/layers/Layer"

import { ArcgisChart as ArcgisChartProto } from "@streamlit/protobuf"

interface ArcGISChartProps {
  element: ArcgisChartProto
}

function calculateCenterFromExtent(extent: {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}): [number, number] {
  return [(extent.xmin + extent.xmax) / 2, (extent.ymin + extent.ymax) / 2]
}

function createLayerFromInfo(layerInfo: {
  type: string
  url: string
  id?: string
  title?: string
}): Layer | null {
  const { type, url, id, title, ...rest } = layerInfo
  switch (type) {
    case "FeatureLayer":
      return new FeatureLayer({ url, id, title, ...rest })
    case "TileLayer":
      return new TileLayer({ url, id, title, ...rest })
    case "VectorTileLayer":
      return new VectorTileLayer({ url, id, title, ...rest })
    case "MapImageLayer":
      return new MapImageLayer({ url, id, title, ...rest })
    case "ImageryLayer":
      return new ImageryLayer({ url, id, title, ...rest })
    case "WMTSLayer":
      return new WMTSLayer({ url, id, title, ...rest })
    case "WMSLayer":
      return new WMSLayer({ url, id, title, ...rest })
    case "WebTileLayer":
      return new WebTileLayer({ urlTemplate: url, id, title, ...rest })
    case "OpenStreetMapLayer":
      return new OpenStreetMapLayer({ urlTemplate: url, id, title, ...rest })
    case "KMLLayer":
      return new KMLLayer({ url, id, title, ...rest })
    case "CSVLayer":
      return new CSVLayer({ url, id, title, ...rest })
    case "GeoJSONLayer":
      return new GeoJSONLayer({ url, id, title, ...rest })
    case "IntegratedMeshLayer":
      return new IntegratedMeshLayer({ url, id, title, ...rest })
    case "PointCloudLayer":
      return new PointCloudLayer({ url, id, title, ...rest })
    case "ElevationLayer":
      return new ElevationLayer({ url, id, title, ...rest })
    case "VideoLayer":
      return new VideoLayer({ url, id, title, ...rest })
    case "VoxelLayer":
      return new VoxelLayer({ url, id, title, ...rest })
    default:
      return null
  }
}

export const ArcGISChart: React.FC<ArcGISChartProps> = ({ element }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<MapView | null>(null)

  // let mapData: {
  //   widget_html?: string
  //   center?: [number, number]
  //   zoom?: number
  //   basemap?: string
  //   extent?: {
  //     xmin: number
  //     ymin: number
  //     xmax: number
  //     ymax: number
  //   }
  //   layers?: {
  //     type: string
  //     url: string
  //     id?: string
  //     title?: string
  //   }[]
  // } = {}

  let mapData = JSON.parse(element.spec)

  // Calculate center from extent if center not provided or invalid
  // let center = mapData.center
  // if (
  //   !Array.isArray(center) ||
  //   center.length !== 2 ||
  //   center.some(v => typeof v !== "number")
  // ) {
  //   if (mapData.extent) {
  //     center = calculateCenterFromExtent(mapData.extent)
  //   } else {
  //     center = [0, 0] // fallback to world center
  //   }
  // }

  // // Validate zoom or fallback to default
  // const zoom =
  //   typeof mapData.zoom === "number" && mapData.zoom >= 0 ? mapData.zoom : 4

  // const basemap =
  //   mapData.basemap == "default" ? "streets-vector" : mapData.basemap
  const width = "100%"
  const height = element.height ? `${element.height}px` : "500px"

  useEffect(() => {
    // const layersArray: Layer[] = []
    // if (Array.isArray(mapData.layers)) {
    //   mapData.layers.forEach(layerInfo => {
    //     const layer = createLayerFromInfo(layerInfo)
    //     if (layer) {
    //       layersArray.push(layer)
    //     }
    //   })
    // }
    // const map = new Map({ basemap: basemap, layers: layersArray })
    const map = WebMap.fromJSON(mapData);

    const view = new MapView({
      map,
      container: mapRef.current as HTMLDivElement,
      // center,
      // zoom,
    })

    // viewRef.current = view

    return () => {
      viewRef.current?.destroy()
      viewRef.current = null
    }
  }, [WebMap, MapView]) // re-run if any of these change

  return (
    <div id="megamapview" ref={mapRef} style={{ height, width }} data-testid="arcgis-chart" />
  )
}

export default memo(ArcGISChart)
