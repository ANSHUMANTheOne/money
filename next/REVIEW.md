# Million Pixel Auction — next edition

A complete, independently hosted review edition of the proposed wall and auction model. The existing `ANSHUMANTheOne/money` homepage and Firebase collections are not changed by this application.

**This is an interactive review application, not a production payment service.** Every action is local to one browser. No real account, bid, payment or ownership record is created. The persistent review banner and checkout disclosure are intentional.

## Run

No build or runtime dependencies are required for the website:

```sh
python -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. All eight views use hash routes, so static hosting needs no rewrite rules. `dist/` can also be published on GitHub Pages or another static host.

Run the business logic tests:

```sh
node --test model.test.mjs
```

The separate `browser-test.mjs` records end-to-end coverage. It expects Playwright in `../qa/node_modules`, a local server on port 4173 and Chrome at the configured Windows path. Playwright is test tooling only; it is not part of the deployed site.

## Review the whole journey

1. Click a community or creator block and choose **Try demo checkout**.
2. Create a demo profile. No email or real authentication is requested.
3. Accept the preview disclosure and simulate payment. The ownership record is a local demo record only.
4. Submit a title, HTTPS link, optional raster image and description.
5. Open **Owner Studio (demo)** in the footer and approve the ad.
6. See the ad on the wall and in Discover. Try directory search, link disclosure and reporting.
7. Open Auctions and start the sample auction. Bid as Alex, switch to Sam using the profile dialog and place a competing bid.
8. End the auction using the demo studio. The winner sees a payment reminder in My Pixels, without checking email.
9. Complete winner checkout, or use the missed-deadline control to return the block to the queue.
10. Open the progress journal and copy the daily update. Exports and copied updates explicitly label demo figures.

## Proposed model

| Tier | Count | Size | Mode | Proposed price |
| --- | ---: | --- | --- | ---: |
| Community | 800 | 25 × 25 | Buy Now | AED 20 |
| Creator | 120 | 50 × 50 | Buy Now | AED 100 |
| Brand | 20 | 100 × 100 | Featured auction | AED 500 opening bid |

The layout covers exactly 1,000 × 1,000 pixels, without overlap. Community occupies 500,000 pixels, Creator 300,000 and Brand 200,000.

The proposed placement term is 12 months from confirmed payment. It is not permanent ownership, a financial asset or a guarantee of impressions. There is no recurring charge. A live implementation must remove expired placements and define renewals; the preview does not run a real annual renewal service.

Auctions run one at a time for 48 hours. Bids increase by at least 10%, rounded up. Last-minute bids leave 60 seconds on the timer, capped at ten extra minutes. A winner gets 24 hours to pay. An unpaid block returns to the queue; the runner-up is never silently charged.

The mixed model preserves the auction identity while allowing a casual visitor to buy immediately. The daily video narrative is paid area filled, new advertisers, and the featured auction. Do not publish demo figures as actual sales.

## Economics

Full sell-through at the proposed Buy Now prices and minimum winning bids yields **AED 38,000 gross**, not profit. It requires 940 successful transactions and assumes every block sells. It excludes auction upside.

An illustrative 2.9% + AED 1 processing assumption gives AED 2,042 of processing cost. A 5% refund reserve is AED 1,900. This leaves AED 34,058 before hosting, licence costs, taxes, disputes, labour and other overhead. These are planning inputs, not a verified provider quote or a forecast. The studio calculator lets you vary sell-through, fees, reserve and hosting cost.

Higher auction bids can increase gross revenue. A large number of low-value disputes can erase the margin. Avoid upfront spend on a promise of full sell-through.

## Scope of verification

- 13 Node model tests: exact inventory coverage, reservation expiry, payment identity and replay, bid validation, end times, anti-sniping cap, single auction, no-bid expiry, unpaid winner expiry, winner checkout, ad moderation, URL/image validation and economics.
- Browser flow checks: profile, Buy Now, simulated checkout, submission, owner approval, directory search, external link disclosure, two-bidder auction, closure, winner checkout, reload persistence and area-based stats.
- Desktop and mobile checks of wall, auctions, Discover, dashboard, journal, how it works, rules and studio, with no horizontal page overflow.
- Saved desktop and mobile screenshots were inspected.

These checks validate the review application. Local browser checks do not provide server-side security, payment verification or multi-user concurrency.

## Production launch requirements

See [PRODUCTION.md](PRODUCTION.md). The current Firebase account/configuration, payment eligibility, live database rules, business identity, domain DNS and actual provider credentials were not changed or verified. No money can be accepted by this build.

