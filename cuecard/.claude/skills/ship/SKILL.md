---
name: ship
description: Run one autonomous build iteration on Cuecard — pick the top roadmap item, implement it, verify it, commit and push. Use when asked to "keep working on Cuecard", "ship the next thing", or when a scheduled routine wakes the agent to continue the project.
---

# Ship one thing

You are continuing an ongoing product build without a human watching. Your job
this iteration is to move Cuecard measurably closer to earning money, then stop
cleanly so the next iteration can pick up.

**Finish one thing properly. Do not start three.**

## Hard boundaries

These are not style preferences. Breaking them damages someone else's work.

- **Only ever write inside `cuecard/`.** The repository root is a different,
  pre-existing project belonging to the owner. `pose-pro/app`, `pose-pro/lib`,
  `pose-pro/components`, `pose-pro/public` and `pose-pro/.next` are off limits.
- **Always run commands with an explicit `cd /home/user/pose-pro/cuecard &&`.**
  The shell's working directory persists between calls and has silently
  reverted to the repo root before — a build run from there overwrites the
  owner's committed `.next/` cache.
- Verify the boundary held before every commit:
  ```
  cd /home/user/pose-pro && git status --short --untracked-files=all -- . ':!cuecard'
  ```
  That must print nothing. If it prints anything, restore it with
  `git restore <path>` (or delete the untracked file you created) before
  continuing.
- Never force-push. Never rewrite published history.
- The three other repos under `/workspace/` are read-only reference. Read them
  freely to match the owner's conventions; never write to them.

## The loop

### 1. Orient

Read `cuecard/docs/ROADMAP.md` and `cuecard/docs/PROGRESS.md`. Check
`git log --oneline -8` to see what the last iterations actually shipped.

### 2. Choose

Take the highest item in **Now**, then **Next**, that you can genuinely finish
and verify in one sitting. Skip anything under **Blocked on the owner** — those
need an account or a human decision, and attempting them wastes the iteration.

If an item turns out to be much larger than it reads, split it in the roadmap
into pieces that each fit one sitting, ship the first piece, and leave the rest
checked out for next time. Say so in `PROGRESS.md`.

### 3. Build

Match the codebase. Read a neighbouring file before writing a new one — the
conventions (`lib/brand.ts` for anything name- or price-shaped, `components/ui.tsx`
primitives, warm token palette, comments that explain *why*) are already set.

The owner's other projects under `/workspace/` are the reference for house
style if something isn't settled here.

### 4. Verify — all four, every time

```
cd /home/user/pose-pro/cuecard && npm test
cd /home/user/pose-pro/cuecard && npx tsc --noEmit
cd /home/user/pose-pro/cuecard && npx next build
```

And for anything that changes what a user sees or clicks, drive it in a real
browser:

```
cd /home/user/pose-pro/cuecard && npm run dev &
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  node scripts/smoke.mjs
```

Then **look at the screenshots**. A build that compiles proves nothing about
whether the thing renders. A real bug was caught exactly this way: every image
sat invisible behind its blur placeholder because a cached `<img>` fires `load`
before React attaches the handler, and the build was perfectly green.

Extend `scripts/smoke.mjs` when you add a surface it doesn't cover.

### 5. Commit and push

One commit per iteration, on branch `claude/autonomous-business-agent-0o3o3v`.

Write the message for someone reading `git log` in six months with no memory of
this: what changed, and *why that was the right call*. Explain trade-offs you
made. Do not list files — the diff already does.

```
cd /home/user/pose-pro && git add cuecard && git -c user.name="Claude" \
  -c user.email="noreply@anthropic.com" commit -m "..." \
  && git push -u origin claude/autonomous-business-agent-0o3o3v
```

Retry a failed push up to 4 times with 2s/4s/8s/16s backoff — the network here
is occasionally flaky.

### 6. Record

Tick the item in `ROADMAP.md`, moving it to **Done**. Append to
`docs/PROGRESS.md`:

```markdown
## <ISO date> — <what shipped>

<Two or three sentences: what changed and why. Anything that surprised you.
Anything the next iteration should know. Anything the owner needs to decide.>
```

Then stop. Do not immediately start the next item — a clean stopping point is
what makes the next iteration cheap.

## When you're stuck

If the top item is genuinely blocked — an API that doesn't exist, a decision
only the owner can make, a dependency that won't install — **don't fake
progress and don't thrash**. Move it to **Blocked on the owner** with one
sentence on what you need, take the next item instead, and note the swap in
`PROGRESS.md`.

If the whole **Now** section is blocked, spend the iteration on the **Health**
section instead. There is always accessibility, performance or test coverage
work worth doing.

## What counts as a good iteration

A photographer can do something today they couldn't yesterday, or can find the
product where they couldn't before. Refactors that change no behaviour are not
iterations; do them inside a feature, not instead of one.
