# Public payment-provider capabilities for USD checkout

Checked 7 November 2026. This document summarizes public product documentation only. It contains no merchant's private account details and does not establish approval of any particular merchant or website.

| Provider | USD checkout | Online auction holds | Relevant public onboarding information |
| --- | --- | --- | --- |
| Ziina | Documented; settles to AED wallet | Not verified in published payment API | Professional onboarding can start without a trade licence; individual application approval and limits still apply |
| Nomod | Hosted checkout documents USD; UAE payouts are AED | Holds documented for in-person Card Form; hosted online authorization/capture remains unverified | Individual onboarding accepts sellers without a trade licence, subject to verification |
| PayPal | Documented | Authorize/capture is documented; capture is not guaranteed | Merchant/API eligibility, business documentation and processing limits must be confirmed for the specific account |
| Stripe UAE | Documented | Manual capture documented | UAE trade licence or freelancer permit required |
| Mamo / PayTabs UAE | Not shortlisted further | Not evaluated further | Their public onboarding/KYC documents request a trade licence |

No provider is connected to this review application. Live payments must remain disabled until account approval, secure backend integration and provider sandbox tests are complete. Charging a buyer in USD does not establish that USD can be retained or withdrawn without conversion. No setup fee does not mean no transaction, FX, refund or dispute fees.

Do not treat an in-person authorization feature as evidence of an online authorization API. Do not accept a typed bid or browser redirect as payment verification. A live backed auction requires a server-verified authorization for the full bid amount, within the provider's actual capture deadline and transaction limit.

Primary documentation:

- [Ziina account types](https://ziina.com/help-center/6847490-what-is-the-difference-between-personal-professional-and-business-accounts)
- [Ziina currencies and AED conversion](https://docs.ziina.com/supported-currencies)
- [Ziina API](https://docs.ziina.com/api-reference/payment-service-openapi.json)
- [Ziina fees](https://ziina.com/help-center/6847430-what-are-the-fees-to-use-ziina-business-101)
- [Nomod onboarding](https://nomod.com/docs/account/set-up-account)
- [Nomod hosted checkout](https://nomod.com/docs/api-reference/create-checkout)
- [Nomod in-person holds](https://nomod.com/docs/managing-inperson-payments)
- [Nomod payouts](https://nomod.com/docs/how-payouts-work)
- [Nomod pricing](https://nomod.com/en-ae/pricing)
- [PayPal authorization/capture](https://developer.paypal.com/v5/checkout/auth-capture)
- [PayPal UAE onboarding](https://www.paypal.com/ae/business/open-business-account)
- [PayPal UAE merchant fees](https://www.paypal.com/ae/business/paypal-business-fees)
- [Stripe UAE requirements](https://support.stripe.com/questions/uae-business-verification-requirements)
- [Mamo onboarding](https://help.mamopay.com/en/articles/7200023-getting-started-with-mamo)
- [PayTabs KYC](https://support.paytabs.com/en/support/solutions/articles/60000716510-what-kyc-documents-are-required-to-activate-my-paytabs-account-)
