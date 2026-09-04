# Borrower Copilot — Five-Minute Walkthrough

## 1. What I built

Borrower Copilot is a borrower-first self-assessment for Indian borrowers.

The product is designed around four questions:

1. Should I borrow at all?
2. How much might a lender sanction?
3. How much can I safely carry?
4. What rate and EMI should I negotiate for?

The central product decision is that **"what a lender may give me" and "what I should borrow" are deliberately different numbers**.

The application is intentionally not a credit-scoring system. It is a transparent decision-support tool that helps a borrower understand their position before entering a lender conversation.

---

# 2. The core product idea

The biggest information asymmetry in borrowing is that lenders understand the borrower's risk and affordability better than the borrower does.

Borrower Copilot tries to close that gap.

Instead of saying:

> "You are eligible for ₹10L."

the product says:

> "A lender may potentially sanction ₹10L, but based on your income, existing obligations and expenses, you should consider borrowing only ₹7L."

That distinction is the foundation of the product.

I therefore separated:

- **Likely lender sanction**
- **Safe borrowing capacity**

The borrower is explicitly told which number they should use.

---

# 3. The assessment flow

The assessment is adaptive rather than presenting every borrower with the same questionnaire.

The initial questions collect the minimum information required to calculate the four outputs.

Examples:

- loan purpose
- loan type
- requested amount
- monthly income
- income type
- existing EMIs
- household expenses
- age
- credit score, if known

Additional questions are introduced only when they can materially change a result.

For example:

- A salaried borrower may be asked about employment stability.
- A self-employed borrower may be asked about business income and collateral.
- An informal/gig borrower may be asked about income variability and repayment history.
- A borrower with existing loans may be asked about their current obligations.
- A borrower who does not know their credit score is not assigned an artificial score.

This keeps the assessment short while still allowing uncertainty to be reduced when useful information is available.

---

# 4. Why unknown is not zero

One of the important design principles is:

> **Unknown information should increase uncertainty, not automatically become a bad value.**

For example, if a borrower says:

> "I don't know my credit score."

I do not treat that as a score of 300.

Instead:

- the rate range becomes wider
- confidence decreases
- the result communicates that the borrower should verify the score if they want a tighter estimate

This principle also applies to other missing information such as income stability or expenses.

---

# 5. The decision engine

The business logic is separated from the React UI.

Conceptually:

```text
                    User Answers
                         │
                         ▼
                  Normalize Answers
                         │
                         ▼
                  Borrower Profile
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         Affordability  Risk     Product
              │          │          │
              └──────────┼──────────┘
                         ▼
                   Decision Engine
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Borrow      Amount / Capacity   Rate / EMI
      Decision
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  Negotiation Card