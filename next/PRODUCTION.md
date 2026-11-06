# Production handoff

## What the repository inspection found

The original `index.html` combines UI, Firebase Auth, browser-side Firestore writes, auctions and simulated/unfinished payment paths. It has no checked-in Firestore rules, backend or package manifest. The deployed database rules could not be inspected through GitHub.

Specific client code paths that must not remain authoritative for real commerce:

- `_fbPlaceBid` calculates price and end time in the browser, and currently resets the auction end to 24 hours from every bid.
- `_fbFinalizeAuction` and `_fbForfeit` let client code initiate auction settlement and transfers.
- `_fbSavePxEdit` writes owner, uid and `status: sold` together with advertiser content.
- `submitSpotlight` writes spotlight sale records without a verified provider payment.
- Admin UI checks use browser state. Concealing a variable or a button cannot enforce authorisation.
- `updStats` counts sold block records rather than the exact paid pixel area and can count unpaid auction outcomes.
- Some display paths insert stored names and titles into HTML templates. Treat every stored user field as untrusted when migrating.

Whether these writes are exploitable depends on the live Firestore rules. Do not assume a public Firebase API key is the issue; Firebase web configuration is normally public. The important controls are database rules, server authorisation and payment verification.

## Recommended production shape

Keep Firebase Auth for identity. Move all price, bid, reservation, auction closing, payment and ownership transitions to a trusted server. A Firebase Functions implementation requires the appropriate billing plan; a different backend must still have durable storage and trusted execution. Do not represent this as guaranteed zero hosting cost.

Use a new versioned namespace, such as `campaigns/season-1`, so original block IDs are not reinterpreted under the new layout. Inspect existing paid owners and outstanding claims before choosing a migration. Preserve any legitimate obligations.

Suggested records:

- `publicLots`: canonical geometry, block size, public sale state, approved ad and public auction information. No email, secret or provider session data.
- `auctions`: trusted timestamps, reserve, bid sequence and winning user ID. Restrict write access to the backend.
- `bids`: immutable audit entries created by the backend; hide private payment/customer details.
- `orders`: buyer uid, canonical lot ID, immutable amount in minor units, AED currency, expiry, provider ID and state. Accessible to that user and server only.
- `adSubmissions`: authenticated paid-owner content, revision and review state. Users cannot change ownership or payment flags.
- `reports`: rate-limited reports and moderation audit history. Private to moderators.
- `notifications`: private account reminders for wins, deadlines, rejected ads and payment failures.

## Checkout and settlement contract

1. Verify the Firebase ID token and, for administration, an admin custom claim on the server. Require verified accounts to bid. Enforce request rate limits and App Check or equivalent abuse protection.
2. Read the canonical lot, price and availability in a transaction. Never trust the amount or owner supplied by the browser.
3. Reserve one Buy Now block for ten minutes, or validate that the caller is the recorded auction winner within their 24-hour window.
4. Create an immutable order and a provider checkout using server-held credentials and a unique idempotency key. No card details pass through site code.
5. Verify a signed webhook according to provider documentation, or retrieve payment state directly using server-held credentials. Check provider account, order identity, payment ID, completed status, exact amount and currency. Browser redirect parameters are insufficient.
6. Fulfill ownership once in a database transaction. Replay events must return the existing fulfillment without duplicating revenue or ownership. A payment received after expiry or a mismatched payment goes to a review/refund path, never an automatic overwrite of another owner.
7. Only settled paid orders affect gross sales. Only current, non-refunded paid placements affect filled area. Track refunds, disputes, tax and payment fees separately.
8. Run deadline expiry and auction closure with server time and durable scheduled jobs. The website must work when no buyer has a tab open.
9. Trigger private in-site notifications automatically. Email or opt-in push can be a backup; buyers finish from My Pixels. Do not promise unattended winner charging unless the selected provider explicitly supports saved methods and the required consent/authentication flow.
10. Keep payment-state audit records, operator alerts and refund tools. Define whether an expired placement can renew or return to inventory before enabling annual sales.

## Fraud and workload controls

- Launch one featured auction at a time, with no paid bidding or customer wallet balances.
- Use a minimum meaningful price instead of processing one million tiny card charges.
- Put a verified-account requirement and sensible bid limits in the server, not only in JavaScript.
- Never accept a screenshot as proof of payment.
- Never auto-charge a runner-up when the winner defaults.
- Reject and revise ad content before publication; keep the previous approved revision during an edit review.
- Confirm HTTPS destinations and add a leaving-site screen. Review destination changes and reports; a previously approved link can later become malicious.
- Restrict uploads to decoded/resized raster images with strict dimensions and byte limits. Use managed file storage with appropriate access rules for production.
- Protect the owner studio with real server authorisation. It is intentionally public in the local review app so the flow can be tested.
- Keep real user email addresses, payment metadata and reports out of public queries.

## Payment eligibility is still unresolved

The user is in the UAE and has no trade licence or startup budget. Stripe UAE normally requires a trade licence or freelancer permit. Ziina's documentation describes limited Professional account features before full verification, but this does **not** confirm that this advertising-auction activity, API access and payouts are eligible without a licence.

Obtain a provider's confirmation for the exact business and account before activating checkout. A transaction fee deducted from proceeds can avoid an upfront provider fee, but it does not remove account requirements, business obligations or backend operating costs.

Do not collect live payments through a personal transfer type mislabelled as a gift/donation, someone else's credentials, or an unsupported provider flow.

Primary references checked during this work:

- [Ziina integration overview](https://docs.ziina.com/getting-started)
- [Ziina payment and account disclosures](https://ziina.com/fees)
- [Stripe UAE activation requirements](https://support.stripe.com/questions/uae-account-activation-requirements)
- [Firebase callable functions](https://firebase.google.com/docs/functions/callable)
- [Firestore security conditions](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firebase Stripe payment tutorial and billing requirement](https://firebase.google.com/docs/tutorials/payments-stripe)

## Before changing millionpixelauction.com

Review the new hosted edition first. Then select a production payment provider and backend, migrate legitimate records, test server-side concurrency and provider sandbox flows, publish operator/contact/refund/privacy details and confirm legal/tax requirements. Finally configure production hosting, credentials and DNS. The new review Site does not change the existing domain.

## Free-position layout revision

The review now keeps the original retro shell and removes all buyer-specific zones. The backend must validate a selected rectangle in 25-pixel grid increments, check every covered cell in a transaction and reserve the entire footprint atomically. Use a canonical cell occupancy index to prevent concurrent overlapping allocations. Price depends only on size and sale mode, never a company/creator classification. Cancellation and payment expiry release the footprint. Do not migrate the earlier zoned IDs into this layout without an explicit occupancy migration.

