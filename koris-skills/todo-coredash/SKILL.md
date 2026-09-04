---
name: todo-coredash
description: The Todo Coredash Skill enables the assistant to interact with a user's to-do list through a secure internal gateway. It is optimized for daily task management, allowing users to see their tasks for the day, review unfinished tasks, confirm specific tasks, and mark tasks as checked once they are done.
read_when:
  - asked about tasks of the day
  - asked about unchecked tasks of the day
  - asked to 'check' some specific task
  - asked to review today's priorities
---

# Todo Coredash

Fetch and manage the user's to-do tasks via the internal API.

## Response shape

Expected gateway response format:

```
message: Todos data retrieved from cache
data[1]{id,title,checked,priority,sponsor,usualCompletionTime}:
100,sample - drink water,0,medium,human x,20:00
```

## Rules

- **Data enforcement**: You MUST base your response strictly on the data returned from the API response. Do not hallucinate, guess, or invent tasks, times, or priorities under any circumstances.
- **Checked field**: The `checked` field indicates completion status: `0` means the task is unchecked (still to do), `1` means it is checked (done). Only present unchecked tasks as outstanding.
- **Confirm before check**: Before marking a task as checked, confirm the exact task with the user using its title and id. Never check a task on your own initiative.
- **Empty data handling**: If `data` is empty or the API returns no todos, explicitly state that there are no tasks for today. Do not invent tasks to fill the gap.
- **Priority order**: When presenting tasks, respect the `priority` field (e.g. high before medium before low) so the most important tasks are shown first.
- Include todo IDs in your internal logic whenever referencing specific tasks, so follow-up actions (like confirming or checking a task) target the correct entry.

## Commands

### Get Today's Tasks

Fetch all of the user's to-do tasks.

```bash
curl -k -X GET <GATEWAY_HOST>/api/todo/?format=toon
```

Returns all today's tasks with their completion status:

```
message: Todos data retrieved from cache
data[2]{id,title,checked,priority,sponsor,usualCompletionTime}:
100,sample - drink water,1,medium,human x,09:00
101,sample2 - drink water,1,medium,human x,09:01
```

### Get Unchecked Tasks

Fetch only the tasks that are still pending (`checked == 0`). Use this when the user asks what still needs to be done today.

```bash
curl -k -X GET <GATEWAY_HOST>/api/todo/?onlyUnchecked=1&format=toon
```

Returns only the unchecked tasks:

```
message: Todos data retrieved from cache
data[1]{id,title,checked,priority,sponsor,usualCompletionTime}:
100,sample - drink water,0,medium,human x,09:00
```

### Check a Task

Mark a specific task as checked (`checked == 1`) once it is done. Always use the task id returned by the API and confirm the task with the user before updating.

```bash
curl -k -X PUT <GATEWAY_HOST>/api/todo -H 'Content-Type: application/json' -d '{"id": <TASK_ID>,"checked": 1}'
```

Returns the updated task with `checked` set to 1:

```
message: Todo updated successfully
data{id,title,checked,priority,sponsor,usualCompletionTime}:
100,sample - drink water,1,medium,human x,09:00
```
