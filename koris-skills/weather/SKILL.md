---
name: weather
description: Get current weather and forecasts via wttr.in or Open-Meteo, no API key needed.
read_when:
  - user asks about weather, temperature, or forecasts for any location
---

# Weather

Current weather conditions and short-range forecasts. Not for historical weather data, severe-weather alerts, or detailed meteorological analysis.

## Rules

- **Location**: Always include a city, region, or airport code in weather queries.

## Commands

### Current Weather

Specific city.

```bash
curl "wttr.in/[city]?format=3"
```

Response: `[city]: ⛅  +17°C`

### What's the weather?

```bash
curl -s "wttr.in/[city]?format=%l:+%c+%t+(feels+like+%f),+%w+wind,+%h+humidity"
```

Response: `[city]: ⛅  +17°C (feels like +17°C), ←8km/h wind, 93% humidity`

### Will it rain?

```bash
curl -s "wttr.in/[city]?format=%l:+%c+%p"
```

Response: `[city]: ⛅  0.0mm`

## Format codes

| Code | Meaning |
|---|---|
| `%c` | Weather condition emoji |
| `%t` | Temperature |
| `%f` | Feels like |
| `%w` | Wind |
| `%h` | Humidity |
| `%p` | Precipitation |
| `%l` | Location |
