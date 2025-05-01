# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import plotly.express as px

import streamlit as st

# Create a simple dataset
data = {"x": [1, 2, 3, 4, 5], "y": [10, 11, 12, 13, 14]}

# Create a Plotly chart
fig = px.line(data_frame=data, x="x", y="y", title="Simple Line Chart")

# Display the chart in Streamlit
st.plotly_chart(fig)
