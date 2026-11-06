# Million Pixel Auction — next edition

A complete, independently hosted review edition of the proposed wall and auction model. The existing `ANSHUMANTheOne/money` homepage and Firebase collections are not changed by this application.

**This is an interactive review application, not a production payment service.** Every action is local to one browser. No real account, bid, payment or ownership record is created. The persistent review banner and checkout disclosure are intentional.

## Run

No build or runtime dependencies are required for the website:

```sh
python -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. All eleven views use hash routes, so static hosting needs no rewrite rules. `dist/` can also be published on GitHub Pages or another static host.

Run the business logic tests:

```sh
node --test model.test.mjs
```

The separate `browser-test.mjs` records end-to-end coverage. It expects Playwright in `../qa/node_modules`, a local server on port 4173 and Chrome at the configured Windows path. Playwright is test tooling only; it is not part of the deployed site.

## Current revision: original layout and a shared wall

The original navy/grey retro layout is restored, using the original CSS in `dist/original.css` plus responsive adapters in `dist/retro.css`. There are no separate buyer categories or exclusive regions.

Choose 25 x 25, 50 x 50 or 100 x 100, then click any available location. Selection snaps to a 25-pixel grid. A larger placement merges adjacent free cells and can cross any former zone boundary. Overlap, wall overflow and reservation conflicts are rejected.

- 25 x 25: USD 20 Buy Now, available to everyone.
- 50 x 50: USD 100 Buy Now, available to everyone.
- 100 x 100: auction from USD 500, available to everyone.

Start with the same 1,000 x 1,000 wall. Inventory is allocated dynamically, rather than imposing 800/120/20 slots or a company district. The journal counts paid area, regardless of placement size.

To review: select a free location, choose a size, create a local demo profile, simulate checkout, submit an ad, and approve it in the demo admin view. For an auction, select 100 x 100 at any free location and open a demo auction there. Switch profiles to try competitive bidding; use the admin time controls to test closing and unpaid winners.

Expired or canceled larger reservations release their footprint back to the neutral wall. An expired unpaid auction also releases its area; runners-up are never silently charged. The preview uses a new versioned local storage key so the previous zoned demo is not reinterpreted as free-position inventory.

## Proposed operating model

Buy Now for the two smaller sizes, one featured 48-hour auction at a time for the 100 x 100 size. At least a 10% raise, with last-minute extensions capped at 10 minutes. Winners have 24 hours to pay. Proposed ad placement lasts 12 months from payment; no recurring charge or promise of clicks.

## Economics

There is no fixed sell-through mix. A completely filled wall of 25 x 25 blocks would generate USD 32,000 gross; all 50 x 50 would generate USD 40,000; all 100 x 100 at opening bids would generate USD 50,000. These examples are not a forecast or profit guarantee. Actual totals depend on sizes, available geometry, bids, refunds and costs.

The studio calculator uses the all-25 x 25 scenario: 1,600 payments at USD 20. At an illustrative 2.9% + USD 1 fee and a 5% refund reserve, that leaves USD 27,872 before hosting, licensing, taxes, disputes, labour and other overhead. Fee inputs are assumptions, not provider quotes.

## Scope of verification

- 16 Node model tests: exact inventory coverage, reservation expiry, payment identity and replay, bid validation, end times, anti-sniping cap, single auction, no-bid expiry, unpaid winner expiry, winner checkout, ad moderation, URL/image validation and economics.
- Browser flow checks: profile, Buy Now, simulated checkout, submission, owner approval, directory search, external link disclosure, two-bidder auction, closure, winner checkout, reload persistence and area-based stats.
- Desktop and mobile checks of wall, auctions, Discover, dashboard, journal, how it works, rules and studio, with no horizontal page overflow.
- Saved desktop and mobile screenshots were inspected.

These checks validate the review application. Local browser checks do not provide server-side security, payment verification or multi-user concurrency.

## Production launch requirements

See [PRODUCTION.md](PRODUCTION.md). The current Firebase account/configuration, payment eligibility, live database rules, business identity, domain DNS and actual provider credentials were not changed or verified. No money can be accepted by this build.

## USD currency revision

All review prices, bids, checkout totals, records and revenue displays are now denominated in USD. The proposed numeric prices remain 20, 100 and 500; this is a new USD price proposal, not an exchange-rate conversion of the old AED prices. The versioned USD demo storage key prevents old AED records from being relabelled as dollars. Existing local demo records remain untouched under their previous key. No live provider is connected. See PAYMENTS.md for the provider research and remaining account requirements.

