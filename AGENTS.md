# De Plaat Website - Agent Instructions

These instructions are for Codex/ChatGPT agents working on the De Plaat website.

## Working Style

- Treat the user as a beginner/non-technical customer who wants guided help.
- Use plain language in German unless the user asks otherwise.
- Do the work proactively. Do not stop for routine implementation choices.
- Avoid unnecessary prompts. Ask only when a human action is unavoidable: sign-ins, secrets only the user holds, paid/cost-changing actions, destructive changes, or an MCP/tool confirmation gate.
- Keep the repo clean. After a change, verify it, then commit it locally with a clear message unless the task explicitly says not to.
- Never leave unrelated user changes reverted or overwritten.

## gh0stcli First

At the start of every gh0stcloud-related session:

1. Load `gh0st_agent_briefing`.
2. Run the required gh0st reads in order: `gh0st_org_current`, then `gh0st_tenant_home`; read `gh0st_account_state` when account phase or limits matter.
3. Run `gh0st_setup_checklist` before deployment or platform work. Do not start deployment work until setup is complete.
4. For this existing app, use the installed `gh0stapp-*` skills as reference and respect the current architecture. For any brand-new app or major rebuild, load `gh0stapp-architecture` before writing application code and follow its routing.

## Repo Roles

- This repo is the application source repo for the De Plaat website.
- The separate deployment repo is `../gh0stcloud-deployments`.
- Kustomize overlays belong only in `../gh0stcloud-deployments`, never in this app repo.
- The app slug is `de-plaat`.
- The app is a static website served by a small Go webserver on port `8080`.
- The Dockerfile already exists and should remain non-root.

## Delivery Rules

- Use gh0stcli tools for detection, setup, validation, and deployment decisions.
- Before deployment changes, detect the app with `gh0st_gitops_detect_app` and detect the deployment repo with `gh0st_gitops_detect`.
- Keep GitHub Actions and GHCR image delivery aligned with gh0stcloud instructions.
- Do not make private images public as a workaround.
- Before any go-live push, verify deployment manifests with `gh0st_gitops_validate` and verify required OpenBao secrets with metadata-only gh0stcli tools.

## Secrets And Safety

- Never ask the user to paste passwords, tokens, private keys, or `.env` values into chat.
- Never read, echo, log, or commit secret values.
- Use OpenBao through gh0stcli for generated credentials and for values supplied from local files.
- Static public pages are acceptable without app login. If future functionality stores user data, uses paid APIs, external APIs, or a database, require login by default before public exposure.

## Verification

- For content-only website changes, at minimum inspect the affected HTML/CSS/JSON and run a local smoke check when practical.
- For deployment-impacting changes, run gh0st validation before commit.
- Record known existing gh0st validation warnings instead of ignoring them:
  - the current deployment overlays build only with `LoadRestrictionsNone`;
  - the current read-only root filesystem warning reports missing `/tmp` scratch volumes.
