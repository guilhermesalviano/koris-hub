---
name: emails-coredash
description: The Emails Coredash Skill enables the assistant to interact with a user's Email inbox through a secure internal gateway. It is optimized for triage and retrieval, allowing users to scan their most recent correspondence and access full message details without leaving the interface.
read_when:
  - asked about recent emails
  - asked about specific email details
  - asked to check Gmail inbox
  - asked to list recent emails
---

# Emails Coredash

Fetch and work with the user's last 5 received Gmail messages via the internal API.

## Rules

- **Data enforcement**: You MUST base your response strictly on the data returned from the API response or the `recent_emails` command. Do not hallucinate, guess, or invent information under any circumstances.
- **Empty data handling**: If the API returns no data, or the email list is empty, you must explicitly state that no information was found. Do not invent details to fill the gap; adapt your response to acknowledge the lack of data.
- Include email IDs in your responses whenever referencing specific emails, as this allows for accurate follow-up commands to retrieve snippets or full details.

## Commands

### Get Recent Emails

Fetch the last 5 emails received.

```bash
curl -k -X GET <GATEWAY_HOST>/api/emails?format=toon
```

Returns a compact list of all recent emails with only the key fields:

```
emails[1]{id,from,subject,date,isUnread}:
[email_id],[from name] - [from email],[email subject],2023-10-01T12:34:56,true
```

### Get Email Snippet

Fetch the snippet/preview of a specific email by its ID. Use this when the user wants a quick preview without loading the full body.

```bash
curl -k -X GET "<GATEWAY_HOST>/api/emails/[email_id]?format=toon"
```

Returns the snippet of the matched email:

```
email{id,from,subject,date,snippet}:
[email_id],[from name] - [from email],[email subject],2023-10-01T12:34:56,the email snippet or preview text
```

### Get Email Details

Fetch the full body of a specific email by its ID. The body is HTML — summarize or extract the relevant text for the user.

```bash
curl -k -X GET "<GATEWAY_HOST>/api/emails/[email_id]?format=toon"
```

Returns the HTML body of the specified email. Note: large HTML bodies may be truncated — extract the key content from what is returned.

```
email{id,from,subject,date,body}:
[email_id],[from name] - [from email],[email subject],2023-10-01T12:34:56,[HTML content of the email body]
```
