# Borrower Copilot

> A borrower-first self-assessment that helps Indian borrowers walk into a lender better informed.

Borrower Copilot answers four questions before a borrower accepts a loan:

1. **Should I borrow at all?**
2. **How much is a lender likely to sanction?**
3. **How much can I safely carry?**
4. **What rate and EMI should I negotiate for?**

The goal is not to predict a lender's decision. It is to give the borrower a transparent, conservative benchmark they can use before accepting an offer.

---

## Why this exists

A lender knows the borrower's risk profile, affordability and pricing better than the borrower does.

Borrower Copilot reverses that information gap.

Instead of producing a single "eligible amount", the app deliberately separates:

- **Likely lender sanction** — what a lender may approve based on income, obligations, product and risk.
- **Safe borrowing capacity** — what the borrower can reasonably carry without stretching their monthly cash flow.

The borrower should generally negotiate from the **lower, safer number**.

---

## What the app produces

### O1 — Borrow / Don't Borrow

A clear recommendation:

- Borrow
- Borrow less
- Don't borrow

The recommendation includes a short explanation tied to the borrower's answers.

### O2 — Maximum Amount

Two separate numbers:

| Number | Meaning |
|---|---|
| Likely lender sanction | Approximate amount a lender may consider |
| Safe borrowing capacity | Amount the borrower can reasonably carry |

The app explicitly tells the borrower which number to use.

### O3 — Fair Interest Rate

A rate **band**, rather than a false point estimate.

The app considers:

- loan product
- borrower profile
- income type
- credit history
- existing obligations
- secured vs unsecured lending
- risk indicators

Processing fees are incorporated into an **APR-style all-in cost** so that a borrower can compare lender offers more honestly.

### O4 — EMI / Monthly Outflow

A recommended monthly ceiling.

The result also shows:

- tenure trade-off
- approximate total interest
- stress scenario
- why the ceiling is what it is

---

# Negotiation Card

The final screen turns the assessment into something the borrower can actually take to a lender.

Example:

> ## YOUR NEGOTIATION RANGE
>
> **Fair rate:** 11% – 12.5%
>
> **Recommended EMI ceiling:** ₹22,000/month
>
> **Safe loan amount:** ₹6.8L
>
> **Why:** Strong credit profile and stable salaried income, but an existing ₹14,000 car EMI already consumes part of monthly repayment capacity.
>
> **If quoted 14%:** Ask the lender to explain the pricing difference and negotiate toward the fair range.

The card is designed to be useful in an actual branch conversation, not just as an assessment result.

---

# Adaptive Question Flow

The app does not ask every borrower the same questions.

There are two levels:

### Must-answer questions

The minimum information required to produce all four outputs.

Examples:

- loan purpose
- loan type
- amount required
- monthly income
- income type
- existing EMIs
- household expenses
- age
- credit score, if known

### Additional questions

Additional questions appear only when they are relevant and can change an output.

Examples:

- income stability
- variable-income share
- loan repayment history
- recent EMI bounces
- credit-card utilisation
- emergency savings
- collateral
- co-applicant
- existing lender offers
- productive return from the loan

If a question does not change an output, it should not be asked.

---

# Handling Unknown Information

Unknown is **not treated as zero**.

For example:

> "I don't know my credit score"

does not become a score of 300.

Instead, the model widens the relevant range and lowers confidence.

The same principle applies to:

- unknown expenses
- unknown income stability
- unknown loan terms
- unknown credit history

The UI communicates this uncertainty rather than hiding it.

---

# Decision Engine

Business logic is intentionally separated from the UI.

```text
User Answers
     │
     ▼
Normalization
     │
     ▼
Profile Classification
     │
     ├── Product suitability
     ├── Affordability
     ├── Risk adjustments
     ├── Rate band
     └── Stress scenario
     │
     ▼
Decision Engine
     │
     ├── O1 Borrow decision
     ├── O2 Amounts
     ├── O3 Fair rate
     └── O4 EMI ceiling
     │
     ▼
Negotiation Card