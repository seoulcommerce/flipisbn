# FlipISBN

Keep-or-list 25 ISBNs for US used-book flippers. $15 USD one-time per report.

Not a Seoul Commerce Magento/Shopify product.

## How it works
1. Paste up to 25 ISBNs + email
2. Pay $15 (Stripe Checkout — blocked until keys are authorized)
3. Get a sheet: title from Google Books now; eBay sold median and buyback max stay `needs_manual` until those APIs have keys. We never invent sold prices.

## Run
Static `index.html`. Optional Vercel functions in `api/` for submit log + hit log.

## Blocked
- Stripe: no live keys in the environment. Do not fake charges.
- eBay sold / BookScouter buyback: no keys. First reports are concierge.
