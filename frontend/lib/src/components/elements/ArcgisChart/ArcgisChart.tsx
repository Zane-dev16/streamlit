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
import Map from "@arcgis/core/Map"

import { PlotlyChart as PlotlyChartProto } from "@streamlit/protobuf"

interface ArcGISChartProps {
  element: PlotlyChartProto
}

function calculateCenterFromExtent(extent: {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}): [number, number] {
  return [(extent.xmin + extent.xmax) / 2, (extent.ymin + extent.ymax) / 2]
}

export const ArcGISChart: React.FC<ArcGISChartProps> = ({ element }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<MapView | null>(null)

  let mapData: {
    widget_html?: string
    center?: [number, number]
    zoom?: number
    basemap?: string
    extent?: {
      xmin: number
      ymin: number
      xmax: number
      ymax: number
    }
  } = {}

  mapData = JSON.parse(element.spec)

  // Calculate center from extent if center not provided or invalid
  let center = mapData.center
  if (
    !Array.isArray(center) ||
    center.length !== 2 ||
    center.some(v => typeof v !== "number")
  ) {
    if (mapData.extent) {
      center = calculateCenterFromExtent(mapData.extent)
    } else {
      center = [0, 0] // fallback to world center
    }
  }

  // Validate zoom or fallback to default
  const zoom =
    typeof mapData.zoom === "number" && mapData.zoom >= 0 ? mapData.zoom : 4

  const basemap =
    mapData.basemap == "default" ? "streets-vector" : mapData.basemap

  const height = "500px"
  const width = "100%"

  useEffect(() => {
    const map = new Map({ basemap })

    const view = new MapView({
      container: mapRef.current as HTMLDivElement,
      map,
      center,
      zoom,
    })

    viewRef.current = view

    return () => {
      viewRef.current?.destroy()
      viewRef.current = null
    }
  }, [basemap, center, zoom]) // re-run if any of these change

  return (
    <div ref={mapRef} style={{ height, width }} data-testid="arcgis-chart" />
  )
}

export default memo(ArcGISChart)
