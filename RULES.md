# Borrower Copilot — Business Rules

This document defines the rule set encoded in `src/domain/rules/`. Every row below is implemented as a named constant or function.

## FOIR Caps (Fixed Obligation to Income Ratio)

| What | Value | Why |
|---|---|---|
| Safe FOIR cap — salaried | 40% | Leaves buffer for rent/expenses/savings beyond bank's own risk threshold |
| Lender FOIR cap — salaried, strong profile | 55% | Typical ceiling for prime salaried segment |
| Safe FOIR cap — self-employed | 35% | Lower than salaried; income less predictable month to month |
| Lender FOIR cap — self-employed | 50% | Same reasoning, lender side |
| Safe FOIR cap — informal/gig income | 30% | Highest income volatility of the three segments |
| Lender FOIR cap — informal/gig income | 40% | Most lenders are conservative here or require secured product |

## Rate Bands

| What | Value | Why |
|---|---|---|
| Rate band — salaried, credit score >750, unsecured PL | 10.5%–12.5% | Prime-tier unsecured personal loan pricing |
| Rate band — salaried, credit score unknown | widen band by +2 pts on top end | Unknown score = unpriced risk, don't assume prime |
| Rate band — secured LAP, LTV ≤ 40% | 9%–11% | Low loan-to-value means strong recovery cushion for lender regardless of income/credit uncertainty |

## Product & Income Rules

| What | Value | Why |
|---|---|---|
| Product routing rule | If borrower owns unencumbered property/collateral worth ≥ 2× the requested amount AND requested amount is large (>₹5L) → route to secured product (LAP/gold/etc.) instead of unsecured personal loan | Collateral changes lender risk more than income or credit history does |
| Self-employed income source rule | If declared cash income and ITR/filed income diverge, use the ITR (verifiable) figure for FOIR math, not the cash estimate | Cash income is unverifiable; using it overstates what a lender can actually confirm |
| Co-applicant income rule | Do not add a spouse/co-applicant's income to household income for FOIR unless the user explicitly marks them as a committed co-borrower | Conservative default; avoids overstating capacity on unconfirmed income |

## Verdict Rules

| What | Value | Why |
|---|---|---|
| Verdict — comfortable fit | requested EMI ≤ safe ceiling → **"Borrow"** | Fits safely, no reason to shrink the ask |
| Verdict — stretch fit | requested EMI > safe ceiling but ≤ lender ceiling → **"Borrow less"**, recommend the safe amount instead | Technically approvable but not comfortable; steer to the safer number |
| Verdict — overreach | requested EMI > lender ceiling → **"Don't borrow"** at this amount; show what tenure/amount WOULD fit | Not realistically approvable or safe |
| Verdict — distress override | Recent bounced payment (last 3 months) AND existing high-cost debt (any loan/app-loan at >24% APR) AND a recent income-negative shock (job loss/co-earner income loss in household) present together → **force "Don't borrow"** regardless of what the FOIR math shows | These three signals together indicate an active debt spiral; FOIR math alone doesn't capture this. A single bounce alone should NOT force this — treat single bounce as a caution flag/confidence penalty only. |

## Credit & Confidence Rules

| What | Value | Why |
|---|---|---|
| Unknown credit score | Never treat as a low/bad score. Widen the rate band range instead and lower confidence. | "Unknown is never zero" — explicit rule in the brief |
| Confidence rule | Confidence = High if ≥80% of "additional" questions for the user's branch are answered; Medium if 40–80%; Low if <40% or any must-question was skipped | Gives the borrower an honest signal on how much to trust the numbers shown |
