# FlipISBN

Keep-or-list 25 ISBNs for US used-book flippers. $15 USD one-time per report.

Not a Seoul Commerce Magento/Shopify product.

## How it works
1. Paste up to 25 ISBNs + email
2. Pay $15 via live Stripe Checkout
3. Thanks page. We queue email + ISBNs and send the keep-or-list sheet. eBay sold / buyback stay manual. We never invent sold prices.

## Stripe (Vercel env only)
Do not put keys in git or chat.

- `STRIPE_SECRET_KEY` (must be `sk_live_…`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (must be `pk_live_…`)

Paste those only in the claimed Vercel project, then push `main` to deploy. The public Pay $15 button stays off if either key is missing or test-mode.

## Run
Static `index.html` + `thanks.html`. Vercel functions in `api/`.
