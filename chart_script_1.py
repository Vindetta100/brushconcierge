import plotly.graph_objects as go
import plotly.io as pio
import json

# Data for landing page elements impact score
data = {
    "page_elements": [
        {"element": "Hero Section", "score": 9},
        {"element": "Problem/Solution", "score": 8},
        {"element": "Clear CTA", "score": 10},
        {"element": "Social Proof", "score": 7},
        {"element": "Benefits Focus", "score": 6},
        {"element": "FAQ Section", "score": 5}
    ]
}

# Extract data for the chart
elements = [item["element"] for item in data["page_elements"]]
scores = [item["score"] for item in data["page_elements"]]

# Abbreviate element names to fit 15 character limit
abbreviated_elements = [
    "Hero Section",
    "Problem/Solution", 
    "Clear CTA",
    "Social Proof",
    "Benefits Focus",
    "FAQ Section"
]

# Beauty industry colors (muted pinks, soft whites, warm beiges)
beauty_colors = ['#E8B4CB', '#F5E6D3', '#E6D7C3', '#D4C5B9', '#C9B8A8', '#B8A697']

# Create the horizontal bar chart
fig = go.Figure(data=[
    go.Bar(
        x=scores,
        y=abbreviated_elements,
        orientation='h',
        marker_color=beauty_colors,
        text=[f'{score}/10' for score in scores],
        textposition='auto',
        cliponaxis=False
    )
])

# Update layout
fig.update_layout(
    title='Landing Page Elements Impact Score',
    xaxis_title='Score (out of 10)',
    yaxis_title='Page Elements',
    showlegend=False
)

# Update axes
fig.update_xaxes(range=[0, 10])
fig.update_yaxes(autorange='reversed')

# Save the chart
fig.write_image('page_elements_impact.png')