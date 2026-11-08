# Issue tracker: Backlog.md

Tasks and specs for this repo live in Backlog.md under `backlog/`. Use the `backlog` CLI with `--plain` for all operations. Task IDs use the `PD` prefix (for example `PD-3`).

## Conventions

- **Create a task**: `backlog task create "<title>" --desc "<body>" --plain`. Add `-l <label>` for labels, `--ac "<criterion>"` (repeatable) for acceptance criteria.
- **Spec**: a parent task whose description holds the full spec.
- **Implementation ticket**: a child task, `backlog task create "<title>" -p <parent-id> ...`. One task per ticket.
- **Read a task**: `backlog task view <id> --plain`.
- **List tasks**: `backlog task list --plain`, filtered with `-s <status>` or `-p <parent-id>`. There is no label filter; use `backlog search "<query>" --plain` or read the files under `backlog/tasks/`.
- **Comment**: `backlog task edit <id> --append-notes "<text>"`.
- **Apply or remove labels**: `backlog task edit <id> --add-label <label>` / `--remove-label <label>`.
- **Close**: `backlog task edit <id> -s Done --final-summary "<summary>"`.
- **Won't fix**: add the `wontfix` label, then `backlog task archive <id>`.
- **Deferred ideas**: drafts (`backlog draft create`), promoted with `backlog draft promote <id>` when work starts.

Statuses: `To Do`, `In Progress`, `Done`.

## When a skill says "publish to the issue tracker"

Create a Backlog task (a parent task for a spec, child tasks for tickets).

## When a skill says "fetch the relevant ticket"

`backlog task view <id> --plain`.

## Wayfinding operations

Used by `/wayfinder`.

- **Map**: a parent task labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: a child task (`-p <map-id>`) labelled `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: `--dep <id>,<id>` on the child. A ticket is unblocked when every dependency is `Done`.
- **Frontier**: `backlog task list -p <map-id> -s "To Do" --plain`, then drop tasks with a dependency that is not `Done` (check each dependency yourself; do not assume the list filters them). First by ID wins.
- **Claim**: `backlog task edit <id> -s "In Progress"`, the session's first write.
- **Resolve**: `--append-notes` with the answer, set `-s Done`, then append a context pointer (gist + task ID) to the map's Decisions-so-far.
