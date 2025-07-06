import plotly.graph_objects as go
import plotly.io as pio
import json

# Data from the JSON
data = {
    "conversion_benchmarks": {
        "beauty_industry_avg": 2.7,
        "subscription_services": 3.5,
        "high_performing": 10,
        "target_goal": 8
    },
    "conversion_elements": [
        {"element": "Hero Section", "description": "Attention-grabbing headline addressing pain points", "impact": "High"},
        {"element": "Problem/Solution", "description": "Visual before/after showing dirty vs clean brushes", "impact": "High"},
        {"element": "Benefits Focus", "description": "Time-saving, hygiene, and application quality", "impact": "Medium"},
        {"element": "Social Proof", "description": "Testimonials and trust signals", "impact": "High"},
        {"element": "Clear CTA", "description": "Prominent waitlist signup with urgency", "impact": "Critical"},
        {"element": "FAQ Section", "description": "Addresses common objections and concerns", "impact": "Medium"}
    ],
    "design_features": [
        {"feature": "Mobile-First", "importance": "Critical", "description": "60% of beauty shoppers browse on mobile"},
        {"feature": "Beauty Colors", "importance": "High", "description": "Muted pinks, whites, beiges create trust"},
        {"feature": "Clean Layout", "importance": "High", "description": "Minimalist design reduces cognitive load"},
        {"feature": "Professional Images", "importance": "Medium", "description": "High-quality visuals build credibility"}
    ],
    "kpis": [
        {"metric": "Email Signup Rate", "target": "8-12%", "description": "Primary conversion goal"},
        {"metric": "Bounce Rate", "target": "<40%", "description": "Page engagement indicator"},
        {"metric": "Time on Page", "target": "2+ minutes", "description": "Content consumption metric"},
        {"metric": "Social Shares", "target": "5% of visitors", "description": "Viral growth potential"}
    ]
}

# Create comprehensive horizontal bar chart
categories = []
values = []
colors = []
hover_texts = []

# Beauty industry colors (muted pinks, whites, beiges)
beauty_colors = ['#D4B5B0', '#F4E4D6', '#E8D5C2', '#C9A9A6', '#F0E6D2', '#D2C5B8']

# Conversion benchmarks section
categories.extend(['Beauty Avg', 'Subscription', 'High Perform', 'Target'])
values.extend([2.7, 3.5, 10, 8])
colors.extend(beauty_colors[:4])
hover_texts.extend([
    'Beauty Industry Average: 2.7%',
    'Subscription Services: 3.5%', 
    'High-Performing Pages: 10%',
    'Target Goal: 8%'
])

# Impact scoring (Critical=5, High=4, Medium=3)
impact_scores = {'Critical': 5, 'High': 4, 'Medium': 3}

# Conversion elements section
for i, elem in enumerate(data['conversion_elements']):
    categories.append(elem['element'][:12])  # Truncate to 12 chars
    values.append(impact_scores[elem['impact']])
    colors.append(beauty_colors[i % len(beauty_colors)])
    hover_texts.append(f"{elem['element']}: {elem['description'][:50]}...")

# Design features section
importance_scores = {'Critical': 5, 'High': 4, 'Medium': 3}
for i, feature in enumerate(data['design_features']):
    categories.append(feature['feature'][:12])
    values.append(importance_scores[feature['importance']])
    colors.append(beauty_colors[i % len(beauty_colors)])
    hover_texts.append(f"{feature['feature']}: {feature['description'][:50]}...")

# Create the chart
fig = go.Figure(data=[
    go.Bar(
        y=categories,
        x=values,
        orientation='h',
        marker_color=colors,
        text=[f'{val}' if val > 10 else f'{val}' for val in values],
        textposition='auto',
        hovertext=hover_texts,
        hovertemplate='%{hovertext}<extra></extra>',
        cliponaxis=False
    )
])

# Update layout
fig.update_layout(
    title='Makeup Brush Cleaning Service Optimization',
    xaxis_title='Score/Rate',
    yaxis_title='Elements',
    showlegend=False,
    height=800
)

# Update axes
fig.update_xaxes(range=[0, 12])
fig.update_yaxes(categoryorder='total ascending')

# Save the chart
fig.write_image('makeup_brush_optimization.png')