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

export const ArcGISChart: React.FC<ArcGISChartProps> = ({ element }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<MapView | null>(null)

  /*
  const { basemap = "streets-vector", view = {}, style = {} } = element

  const { center = [-118.805, 34.027], zoom = 13 } = view

  const { height = "500px", width = "100%" } = style
*/

  const basemap = "streets-vector"
  const zoom = 13
  const height = "500px"
  const width = "100%"

  useEffect(() => {
    const center = [-118.805, 34.027]
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
  }, [element])

  return (
    <div ref={mapRef} style={{ height, width }} data-testid="arcgis-chart" />
  )
}

export default memo(ArcGISChart)
