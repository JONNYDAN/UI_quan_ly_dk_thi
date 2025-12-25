Status: partial migration completed (services + initial pages)

What I migrated so far:

- Services (converted to TypeScript and wired to `src/services/api.ts` which now adds `Authorization` header automatically):
  - `paymentService.ts`, `orderService.ts`, `examService.ts`, `provinceService.ts`, `districtService.ts`, `publicService.ts`, `userService.ts`

- Admin pages (initial TypeScript views/stubs):
  - `src/sections/admin/view/board-admin-view.tsx`
  - `src/sections/admin/view/board-moderator-view.tsx`
  - `src/sections/admin/view/board-user-view.tsx`
  - `src/sections/admin/view/dashboard-exam-view.tsx`
  - `src/sections/admin/view/user-management-view.tsx`
  - `src/sections/admin/view/exam-management-view.tsx`
  - `src/sections/admin/view/exam-turn-management-view.tsx`
  - `src/sections/admin/view/exam-pay-management-view.tsx`

- Payment pages:
  - `src/sections/payment/view/payment-detail-view.tsx` (simplified)
  - `src/sections/payment/view/payment-return-view.tsx`

- Exam pages (stubs):
  - `src/sections/exam/view/enrollment-view.tsx`
  - `src/sections/exam/view/enrollment-nn-view.tsx`
  - `src/sections/exam/view/exam-info-view.tsx`
  - `src/sections/exam/view/exam-paper-view.tsx`
  - `src/sections/exam/view/exam-result-view.tsx`
  - `src/sections/exam/view/reexam-register-view.tsx`
  - `src/sections/exam/view/reexam-info-view.tsx`

- Routes & Nav:
  - Added lazy imports and routes in `src/routes/sections.tsx` for admin/payment/exam pages
  - Added admin links in `src/layouts/nav-config-dashboard.tsx`

- Migration helpers:
  - `migration/ASSETS_TO_COPY.md` with a list of assets to be copied from `xettuyen2025_frontend`
  - `migration/MIGRATION_SUMMARY.md` (this file)

Next steps (planned):
1. Finish migrating remaining UI components (full UIs for payment, enrollment, exam pages, admin forms).
2. Copy assets (logos, images) into `public/`.
3. Run `npm run build` and fix TypeScript and ESLint issues.
4. Manually test flows: login (using existing UI sign-in), exam registration, payment, admin management.
5. Final polish and commit on a feature branch.

Notes / Decisions made:
- Kept `sign-in` and `sign-up` from `UI_HCMUE_XetTuyen` unchanged as requested.
- Chosen strategy: do NOT add Redux; migrated slice logic will be replaced by services + `AuthContext` (as requested B).
- Some pages are simplified for now (placeholders) to be iteratively completed in the next step.

If you want, I can continue now to finish full UI migrations and then run the build and tests — confirm and I'll proceed. (Reply: "OK, tiếp tục" to continue.)