# Sprint 3.5 — Social Experience Polish

## Execution Checklist

- [x] **Task 1: Horizontal Carousel** — `watch-detail.tsx` "In the Wild" section now uses `flex overflow-x-auto snap-x snap-mandatory` with `w-[280px]` cards, hidden scrollbars
- [x] **Task 2: Post Lightbox** — `post-detail-modal.tsx` [NEW] cinematic 2-column layout (photo left, social right), comments list, like toggle, owner edit/delete
- [x] **Task 3: Auto-Add to Collection** — `createWristRoll` now does silent `upsert` into `collections` table after post
- [x] **Task 4: Interactions**
  - [x] Server actions: `toggleWristRollLike`, `getWristRollLikeStatus`, `addWristRollComment`, `getWristRollComments`, `deleteWristRollComment`, `deleteWristRoll`, `updateWristRollCaption`
  - [x] `WristRollCard` — clickable photo opens lightbox, optimistic like toggle
  - [x] `PostDetailModal` — comment input/list, owner edit/delete buttons
- [x] **Task 5: UI Consistency** — all interactions use `#D4AF37`, `revalidatePath` + `router.refresh()` everywhere, `currentUserId` threaded through full component chain

## Verification
- [x] `npx tsc --noEmit` — 0 errors ✓
