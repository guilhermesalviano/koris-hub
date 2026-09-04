---
name: calendar-coredash
description: The Calendar Coredash Skill enables the assistant to interact with a user's Google Calendar through a secure internal gateway. It is optimized for schedule management, allowing users to view upcoming events, check availability, and retrieve specific meeting details.
read_when:
  - asked about upcoming meetings or events
  - asked what is on the schedule for a specific day
  - asked for event locations or attendee lists
  - asked to check availability
---

# Calendar Coredash

Fetch and manage the user's calendar events and schedule via the internal API.

## Response shape

Expected gateway response format:

```
message: Calendar data retrieved successfully
data:
todayEvents[1]{id,start,end,title,color,type}:
[event_id],HH:mm,HH:mm,Event title,#RRGGBB,default
importantEvents[1]{id,start,end,title,type}:
[event_id],DD/MM - HH:mm,HH:mm,Event title,default
```

## Rules

- **Data enforcement**: You MUST base your response strictly on the data returned from the API response. Do not hallucinate, guess, or invent meetings, times, or locations under any circumstances.
- **Empty data handling**: If both `data.todayEvents` and `data.importantEvents` are empty, explicitly state that the calendar is clear for today and has no important upcoming events.
- **Priority handling**: When both collections are present, present today's events first, then upcoming important events.
- Include event IDs in your internal logic whenever referencing specific entries to ensure follow-up actions (like descriptions or attendee checks) target the correct event.

## Commands

### Get Today's Schedule

Fetch today's and important upcoming events.

```bash
curl -k -X GET <GATEWAY_HOST>/api/calendar/?format=toon
```

Returns today's events and important upcoming events:

```
message: Calendar data retrieved successfully
data:
todayEvents[1]{id,start,end,title,color,type}:
asdasdasd_20260514T220000Z,19:00,20:00,Terapia,#6EE7B7,default
importantEvents[1]{id,start,end,title,type}:
asdasd_20260515T220000Z,15/05 - 19:00,20:00,Aulas de Inglês,default
```
