---
name: cloudflare-tool-subdomain
description: >-
  Provision the Cloudflare DNS hostname for a newly created Koris tool. Use
  when a new tool plugin is scaffolded or added and its public hostname should
  be based on the tool slug under koaris.com.
---

# Cloudflare tool subdomains

When creating a new Koris tool, provision its public hostname as
`<tool-slug>.koaris.com` after the tool slug is known.

## Workflow

1. Derive the hostname from the tool's canonical kebab-case slug. For example,
   `weather-lookup` becomes `weather-lookup.koaris.com`. Do not derive it from
   the display name if the slug is already available.
2. Determine the DNS record target from the tool's deployment configuration or
   the user's request. Do not invent an origin, IP address, Worker name, or
   CNAME target. If no target is known, stop and ask for it.
3. Check whether the hostname already exists before changing anything. An
   existing record with the same type and target is already complete. An
   existing record with a different type or target is a conflict: show it and
   stop; never overwrite it automatically.
4. Show the planned mutation, including the record type, full hostname, target,
   TTL, and proxy status. Wait for explicit user confirmation immediately
   before creating the record.
5. After confirmation, create the record through the Cloudflare API from the
   CLI. Prefer environment variables or an authenticated CLI profile; never
   print or commit credentials.
6. Verify the API response and report the created record ID and hostname. DNS
   propagation is not instant, so distinguish successful record creation from
   successful application reachability.

## CLI/API procedure

Use a scoped Cloudflare API token with DNS edit permission for the `koaris.com`
zone. The following environment variables are expected:

```sh
export CLOUDFLARE_API_TOKEN='...'
export CLOUDFLARE_ZONE_ID='...'
```

Keep the token out of command output. Use the Cloudflare REST API with `curl`
when no project-local Wrangler command is available:

```sh
curl --fail-with-body --silent --show-error \
  --request GET \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records?name=${TOOL_SLUG}.koaris.com"
```

For a new record, construct the JSON body from the confirmed values rather
than interpolating untrusted strings into JSON. The usual record for a hosted
tool is a `CNAME`, but use `A`, `AAAA`, or another type only when the deployment
requires it. For a CNAME, the body has this shape:

```json
{
  "type": "CNAME",
  "name": "tool-slug.koaris.com",
  "content": "origin.example.com",
  "ttl": 1,
  "proxied": true
}
```

Create it with:

```sh
curl --fail-with-body --silent --show-error \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data @record.json \
  "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records"
```

If the project has an authenticated Wrangler setup and the hostname is a
Cloudflare Worker Custom Domain, use that project's documented Wrangler
configuration instead. A Worker Custom Domain can create the DNS record and
certificate as part of the deployment; do not create a competing CNAME first.

## Safety boundaries

- DNS changes are external mutations. Confirmation is required even when the
  tool creation itself was already confirmed.
- Never delete, replace, or bulk-edit DNS records as part of this workflow.
- Never guess `CLOUDFLARE_ZONE_ID`, the target, proxy status, or record type.
- If authentication, zone access, or the target is missing, report the exact
  prerequisite and stop without changing DNS.
- Treat a successful API response as the completion of provisioning; do not
  claim that the hostname is serving the tool until it is separately verified.

Official references:

- Cloudflare DNS Records API:
  https://developers.cloudflare.com/api/resources/dns/subresources/records/
- Cloudflare Worker Custom Domains:
  https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
