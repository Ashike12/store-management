# Admin portal implementation plan

Repository: store-management. Staff manage inventory, wholesalers and invoices; wholesalers receive a restricted view.

Companions: [Backend](../store-management-node/IMPLEMENTATION_PLAN.md), [Client](../store-management-client/IMPLEMENTATION_PLAN.md).

## How to use this plan

Snapshot: 2026-10-23. IMPLEMENTED means present in inspected source, not a claim of production verification. PARTIAL means code exists but the requirement has gaps. TODO is proposed work; DECISION needs business input. Historical chat requests are recorded separately from verified behavior.

Add future requests in the template at the end. Give each request a stable ID and acceptance criteria. When implementing, read this plan and the linked companion plans, inspect current code, update affected contracts together, record tests and mark complete only after verification. Do not implement every TODO merely because this document exists.

Do not run npm run build or other production builds unless explicitly requested. Never put real credentials in these documents or commit .env files. Check the active branch and working tree before editing; preserve unrelated changes. Do not automatically commit, push, merge, or deploy from a roadmap request.

## Required API permission seed updates

Every new API implementation must include corresponding FeatureEndpointMap and FeatureRoleMap seed records, not just controller/service code. Update affected mappings when an endpoint is renamed or its allowed roles change. Frontend feature delivery that introduces an API includes this backend task.

- Register the endpoint and intended feature/role permissions in both collections using their actual database schema. Reuse valid existing mappings rather than inserting duplicates; make seeds repeatable and runnable after a fresh database reset.
- Verify authorized roles can call the endpoint and unauthorized roles cannot. Preserve own-record restrictions for employees and wholesalers; a feature permission does not grant access to another user's data.
- Explicitly document public endpoint access; do not accidentally require login for public storefront APIs or grant private APIs public access.
- Include seed application and permission checks in acceptance criteria. Do not mark a new API complete while its required permission data is missing, or bypass validation to avoid adding seed data.
- Source note: src/auth/jwt.strategy.ts currently queries FeatureEndpointMap. FeatureRoleMap and its seed implementation were not located in the inspected backend source; inspect the existing database/seed setup and establish the version-controlled seed path before implementation. Never guess its fields.

## MVP data policy

This is a pre-launch MVP with no client deployments. Existing database records are disposable test data. Do not plan legacy-data migration, backfills, or backward compatibility solely to preserve those records. Prefer a consistent new schema and fresh test/seed data across all three repos.

The owner may reset the database when needed. This planning update does not authorize or perform a database deletion; identify the target database and obtain explicit reset instructions before any destructive operation. Continue to enforce permissions, unique serials, correct calculations and financial records for newly created data. Future operational edit/delete rules still matter. This policy does not remove the need to rotate exposed credentials.

## Architecture and source map

Package declarations: React 19, React Router 7, MUI 6, Redux Toolkit/RTK Query, Formik/Yup, Vite 6, TypeScript 5.7. These are installed-family declarations, not an assertion of latest releases.

| Area | Source |
|---|---|
| Startup and loaders | src/main.tsx, src/app/, src/components/loaders/ |
| Routes and role navigation | src/router/, src/core/config/routePath.ts, src/core/config/base-routes.ts |
| Layout and sidebar | src/layout/, src/components/left-sidebar/LeftSidebar.tsx |
| Theme | src/theme/theme-provider.tsx, src/theme/core/palette.ts, src/theme/core/components.tsx, src/index.css |
| Header/profile | src/components/header/header.tsx, src/components/header/UserProfileDialog.tsx |
| API and auth state | src/core/store/api/, src/core/store/slices/auth.slice.ts |
| Product inventory | src/features/store-management/pages/store-management.tsx |
| Product and production forms | src/features/store-management/components/productModal.tsx, productionModal.tsx |
| Category constants | src/core/config/product-category.constants.ts |
| Invoice editor/list/details | src/features/invoice/pages/, src/features/invoice/components/InvoiceForm.tsx |
| Wholesalers/due reminder | src/features/wholesalers/ |
| Dashboard | src/features/dashboard/pages/dashboard.tsx |
| Auth animation | src/features/auth/components/SpiderNetBackground.tsx |
| AI suggestion control | src/components/ai-suggestion-button/AiSuggestionButton.tsx |
| Translations | src/assets/i18n/common/, src/core/services/i18n.service.ts |

## Existing feature inventory

IMPLEMENTED below identifies source capability. Historical visual fixes still require browser regression checks.

| ID | Status | Capability |
|---|---|---|
| ADMIN-001 | IMPLEMENTED | Login, set password, authenticated routing and persisted auth state. |
| ADMIN-002 | IMPLEMENTED | Header user/profile/logout menu, profile dialog and password-change API integration. |
| ADMIN-003 | IMPLEMENTED | Light/dark/pro theme infrastructure; dark initial state. Sidebar selection/contrast and expanded layout have been iterated. |
| ADMIN-004 | IMPLEMENTED | Authentication spider-net background and animated ring startup loaders. |
| ADMIN-005 | IMPLEMENTED | Product listing, search, category/subcategory filters, making-price range and pagination infrastructure. |
| ADMIN-006 | IMPLEMENTED | Add/edit product with multiple images, optional video, descriptions, category/subcategory, production and pricing fields. |
| ADMIN-007 | IMPLEMENTED | Clone flow in product feature; requested save rule is change to ProductName, Category or SubCategory, using create API. Preserve source product. Regression-test exact rule. |
| ADMIN-008 | IMPLEMENTED | Product description AI suggestion control backed by Bengali generation endpoint. |
| ADMIN-009 | IMPLEMENTED | NetHeight field for MosquitoNet/MosquitoNetYard; current inch placeholder conflicts with client feet interpretation. |
| ADMIN-010 | IMPLEMENTED | Product-invoice and due-payment forms, list/details, wholesaler context and product/wholesaler dropdown labels. |
| ADMIN-011 | IMPLEMENTED | Wholesaler management/details and mobile due-message interaction. |
| ADMIN-012 | IMPLEMENTED | Role-sensitive dashboard and invoice views. Wholesaler access must also be enforced in backend. |
| ADMIN-013 | TODO | Customer order fulfillment console; no dedicated order feature found in current source tree. |
| ADMIN-014 | DECISION | Payment management for bKash/Nagad/Rocket; provider/workflow not selected. |

## Product and invoice rules to preserve

- Default product category/subcategory: MosquitoNet / Double, as requested. Product filters also support All.
- Categories and subcategories must match backend constants. Current canonical category spellings include spaces in Baby Item, Filter Net, Fishing Net and China Net.
- MosquitoNetYard: Bonafide, Shaha, ThreeStar, Other.
- MosquitoNet: Single, Semi-Double, Double, Large, Window Net.
- Baby Item: Nouka, Vanga, Umbrella.
- Filter Net: CowNet, BuldingSafety, WholeItem, FieldMat.
- Fishing Net: Jhaki-Zal, Thela-Zal, WholeItem, Door-Zal.
- China Net: FoldingNetThreeVaj, FoldingNetFiveVaj, TabligNet.
- Others: SutarBobin, Fita, MosquitoNetBelowCloth.
- Product pricing separates MakingPrice, WholeSalerPrice, EndUserPrice and EndUserDiscountedPrice.
- Wholesaler invoices prefill wholesale price; customer invoices prefill discounted end-user price. Actual negotiated SellingPrice belongs to the sale snapshot, not a retroactive product price lookup.
- Due-payment invoices have no products, reduce outstanding dues, and must not change inventory. Switching invoice type must not carry due-payment amounts into a fresh product invoice.
- Wholesaler-origin invoice navigation should preselect the wholesaler. Due payment should prefill current due while allowing payment editing.
- Wholesaler users should see their own invoice count/recent invoices/dues, never company revenue or profit.

## Prioritized next work

### ADMIN-101 - P0 - Resolve NetHeight unit mismatch (TODO)

Current product modal says Height in inch; builder treats stored NetHeight as feet. Agree canonical unit with BE-103, label it consistently and create fresh test data using that unit. Acceptance: stored 5 feet produces 60 inches in builder. Existing test records do not require migration.

### ADMIN-102 - P1 - Customer order management (TODO)

With BE-104, add order list/detail, date/status/customer filters, pagination, delivery address, products/custom build specification, authoritative totals and fulfillment transitions. Keep custom options readable and distinguish pending order from paid order. Acceptance: authorized staff can process orders; wholesalers cannot access this console.

### ADMIN-103 - P1 - Payment operations (DECISION)

With BE-105 and CLIENT-104, display method, amount, reference, verified status and payment history. If manual verification is chosen, approval requires receipt confirmation and an audit trail. Gateway refunds/status actions depend on server support. UI cannot mark a gateway payment paid without verification.

### ADMIN-104 - P1 - Business regression checks (TODO)

Verify cloning identity-change rule, optional video, image arrays, 10-row server paging, search/category/subcategory/price filtering together, invoice type reset, due prefilling, create/edit/delete cache invalidation and wholesaler scoping. Include direct URL access and missing/expired token cases.

### ADMIN-105 - P1 - Theme and layout regression (TODO)

Verify first-load dark background, sidebar text/active route/collapse icon in all themes, expanded content offset, floating actions at bottom right and readable login inputs. Check mobile modals, two-column desktop product fields, keyboard focus and reduced-motion behavior. Earlier screenshot complaints are not proof of a resolved browser state.

### ADMIN-106 - P2 - Dependency and UX maintenance (TODO)

React 19 is already declared. Research current supported versions at implementation time; verify MUI/router/React compatibility before upgrading. Improve API error/loading/empty states, translation coverage and Vercel root/deep-link asset behavior. Do not run build without user instruction.

### ADMIN-107 - P2 - Reporting and business controls (PROPOSED)

Coordinate BE-107 before changing due-payment profit reporting. Consider stock history, low-stock alerts, exports and configurable shipping/coupons after core order flow is reliable. These are suggestions, not already requested implementation commitments.

## Future feature requests

### ADMIN-108 - Enable QR verification for selected products

- Status: TODO - documentation only; implementation deferred by user.
- Requested: 2026-10-23. Priority: to be assigned.
- Requirement: authorized staff can choose which specific products support QR verification. It is optional and off by default, including existing products.
- Planned UI: enable/disable control in product management and access to the assigned QR label for enabled products. Label preview/download or printing is proposed to support attaching the code to the physical product; confirm required format before implementation.
- Acceptance: staff can enable the feature for one product while others remain unchanged; its QR links to the correct public name/image verification page; disabling follows the backend verification policy; clone must not silently reuse a source product's assigned code.
- Source areas: src/features/store-management/components/productModal.tsx, src/features/store-management/pages/store-management.tsx, src/core/interfaces/api/IProduct.ts, src/core/store/api/product.ts.
- Dependencies: BE-109 provides management/lookup contracts; CLIENT-110 provides the public verification destination.
- Decisions: product-level versus individual-item codes, label size/download/print requirements, and whether disabled codes can be reactivated.
- Verification evidence: not implemented or tested.

### ADMIN-109 - Batch-based stock entry and item serial inspection

- Status: TODO - documentation only; implementation deferred by user.
- Requested: 2026-10-23. Priority: to be assigned.
- Requirement: adding a new product with stock or adding production/quantity to an existing product creates a batch. Each physical item has an exclusive serial BatchId_UniqueId; serials never match another item's serial, even across different products.
- Product management: when an administrator selects a product, show its associated batches and allow inspection of the items in each batch. A catalog product can have multiple batches. Display BatchId and individual serials in an admin-only detail view with pagination/search as needed.
- Stock entry: show the backend-created batch reference after successful creation/addition. Serial assignment is performed by backend; do not generate editable serial values in the browser. Preserve prior batches and serials when adding new stock.
- Acceptance: N initial items and M later items appear in separate batches with N+M unique serials; admin can identify an item's batch; non-admin roles cannot access serial screens/data; duplicate submissions do not create duplicate stock; partial failures are shown without claiming success.
- Source areas: src/features/store-management/components/productModal.tsx, productionModal.tsx, src/features/store-management/pages/store-management.tsx, src/core/store/api/product.ts, src/core/interfaces/api/IProduct.ts; new batch/detail components as needed.
- Dependencies: BE-110 owns uniqueness, transactions and authorization. Coordinate ADMIN-108 for QR labels without revealing serials to customers.
- Decisions: serial search/filter requirements and sales batch-selection workflow. Serial export/printing is not requested yet. Public QR labels must not expose an admin-only serial.
- Verification evidence: not implemented or tested.

### ADMIN-110 - Employee management and employee landing page

- Status: TODO - documentation only; implementation deferred by user.
- Requested: 2026-10-23. Priority: to be assigned.
- Admin menu: add Employee Management. Admin can add/edit/view/delete employees, daily work entries and payment entries. Employee account creation includes Employee role and uses the agreed login/password setup flow.
- Employee detail/overview: work history, daily earned amounts, payment history, total earned, total paid and balance with explicit labels: business owes employee / employee advance or overpayment / settled. Admin can enter money paid and correct or delete entries; totals refresh from backend after every successful mutation.
- Optional maker selector: new product stock and Add Production forms can select an employee or leave it empty. Show maker against the corresponding batch in product inspection (ADMIN-109); do not treat the entire catalog product as permanently made by one employee.
- Employee experience: on login, land on a single employee page containing their daily work, money earned that day, work history and balance. Do not expose admin inventory, wholesaler, invoice, revenue or employee-management menus. History and feedback sections stay within this landing-page experience.
- Permissions: admin alone edits/deletes authoritative employee/work/payment records. Employees only read their own permitted information and raise feedback. Route guards and UI controls supplement backend authorization; they are not the sole enforcement.
- Feedback submission: from a relevant work/payment entry, employee explains the suspected amount mismatch and submits for review. Show pending status and later the admin's decision/note. No direct employee editing of the underlying amount.
- Admin notifications: new employee feedback appears in portal notifications, opens the related employee/entry and supports unread/read state. Review view shows original entry and employee explanation. Accept and Decline both require a message note; an accepted correction uses explicit admin ledger editing and refreshes the overview.
- Source areas: src/core/config/routePath.ts, src/router/, src/components/left-sidebar/LeftSidebar.tsx, src/components/header/, src/core/store/api/, new src/features/employees/ feature, productModal.tsx and productionModal.tsx, auth role routing.
- Dependencies: BE-111 employee ledger/feedback/notification APIs; ADMIN-109 and BE-110 batch attribution. CLIENT-112 keeps this out of the public storefront.
- Acceptance: admin can complete all requested CRUD operations; maker selection remains optional; employee login opens only the employee landing experience; daily totals and balance are correct after corrections; employee submits feedback and sees resolution; admin receives notification and must provide a note for either decision.
- Decisions: date filters/default history range; onboarding details; deletion behavior for employees with historical financial data; whether accepted feedback opens a correction form or is resolved after a separate edit. Do not imply acceptance automatically changes the amount.
- Verification evidence: not implemented or tested. Verify both admin and employee sessions, direct URL restrictions, cross-employee ID changes, empty states and mobile layouts during implementation.

### ID: REPLACE-NEXT - Feature name

Copy this block for each new request.

- Status: TODO
- Priority: P0 / P1 / P2
- Requested behavior:
- Business rules and examples:
- Affected screens or endpoints:
- Related IDs in companion plans:
- Acceptance criteria:
- Fresh database/seed or environment configuration:
- Verification evidence:
- Completion date and commit:

## Change log

- 2026-10-23: Required FeatureEndpointMap and FeatureRoleMap seed updates and permission checks for every new API. Planning only; no database changes.

- 2026-10-23: Adopted disposable-data, pre-launch MVP scope; no legacy migrations required. Documentation only; no database reset performed.

- 2026-10-23: Created source-mapped baseline and actionable backlog. Documentation only; no runtime tests or builds performed for this inventory.

