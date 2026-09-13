0:00–0:30 — Introduction

Screen: Landing page

“Hi, I'm Chaitanya, and this is my implementation of the Borrower Copilot challenge.

The problem I focused on is that a lender can tell a borrower how much they may be eligible for, but that doesn't necessarily mean the borrower should take that amount.

So I built Borrower Copilot as a borrower-first self-assessment that answers four questions:

Should I borrow at all, how much can I safely carry, is the rate fair, and what EMI should I be comfortable with?

The main principle behind the product is very simple: approved doesn't necessarily mean affordable.”

0:30–1:15 — Why I Designed These Questions

Screen: Click “Start assessment” and show questions

“I designed the questions backward from these four outputs rather than collecting financial information for its own sake.

I have a small set of must-have questions that gives the engine enough information to produce the core outputs, and then I use additional questions only when they can tighten an affordability, pricing, stress, confidence, or product-routing estimate.

For example, I ask for monthly income because it's needed for the affordability calculation and FOIR.

I ask for existing EMIs because those obligations are already consuming part of the borrower's repayment capacity.

And I ask for household expenses because FOIR alone isn't enough. I also want to know what remains after debt payments and essential living expenses.

So the basic affordability flow is:

income, existing obligations and expenses → repayment headroom → safe EMI → safe loan amount.

I also explain why we're asking each question, and when information is unknown, I don't treat it as zero or assume the worst. I widen the range or lower confidence instead.”   

1:15–2:00 — Priya: O1 and O2

Screen: Load Priya demo

“I'll start with Priya, one of the three scenarios provided in the brief.

Priya is a salaried software engineer with a net monthly income of ₹1.10 lakh, an existing ₹14,000 car EMI, ₹28,000 rent, and a credit score of 780. She's looking for an ₹8 lakh personal loan.

I've created predefined fixtures for the three assignment personas, so selecting a persona loads the same inputs every time. This makes the scenarios deterministic and easy to test.

The first output is the borrowing verdict.

The important part here is that the system doesn't simply ask, ‘Can a lender approve this?’ It asks, ‘Does this borrowing fit the borrower's own affordability?’

For O2, I deliberately show two separate numbers.

The first is a lender-side estimate — what might potentially be sanctionable using a higher lender-style ceiling.

The second is the borrower-safe amount — what I actually recommend the borrower use.

I keep these separate because a lender being willing to lend a certain amount doesn't mean that amount is financially comfortable for the borrower.”

2:00–2:50 — Explain FOIR

Screen: O4 / affordability section

“The main affordability concept behind this is FOIR, or Fixed Obligation to Income Ratio.

At a simple level, FOIR is:

existing monthly EMIs plus the proposed EMI, divided by monthly income.

For example, if someone earns ₹1 lakh, already has ₹20,000 of EMIs, and the new loan would add another ₹15,000 EMI, their total monthly debt obligation would be ₹35,000, so their FOIR would be 35 percent.

In my rules, I use different safe FOIR caps for salaried, self-employed and informal or gig borrowers because the stability of their income is different.

But an important design decision is that FOIR is not my entire affordability model.

I also calculate residual cash flow:

income minus existing EMIs minus essential expenses minus the proposed EMI.

This tells me how much money the borrower would actually have left after taking the loan.

So FOIR gives me a debt-obligation ceiling, while residual income and headroom help me determine whether that EMI is actually comfortable.

These FOIR percentages are my product heuristics, documented in RULES.md, and not universal RBI requirements.”

2:50–3:35 — O3: Rate + APR

Screen: O3

“The third output is the fair-rate assessment.

Here I use things like employment type, credit profile and the loan product to determine a reasonable rate band.

For example, a strong salaried borrower with a credit score above 750 and an unsecured personal loan can fall into a lower-risk pricing band in my rules.

Credit score is primarily used for pricing, not affordability. That's an important distinction.

If the credit score is unknown, I don't assume it's bad. I widen the rate range and lower confidence.

I also calculate all-in APR because the headline interest rate doesn't tell the borrower the entire cost of a loan.

A loan can have a particular interest rate but also have a processing fee that reduces the amount the borrower actually receives.

So instead of simply saying ‘interest rate plus processing fee’, the APR calculation looks at the relevant loan cash flows and annualizes the effective cost.

This gives the borrower a more honest number to compare against another offer.”

3:35–4:15 — Anita: Don't Borrow

Screen: Load Anita

“The scenario I particularly wanted to demonstrate is Anita.

Anita has variable gig income, two children, an unemployed husband, existing high-cost app loans, and a recent bounced payment. She's asking for ₹1.5 lakh for an electric scooter.

This is where I wanted the product to show that ‘Don't borrow’ is a valid outcome.

I don't want the system to justify another loan simply because the purpose sounds productive.

Her income volatility, existing expensive debt and recent repayment trouble indicate a very different risk situation from Priya.

I therefore have a distress override for a combination of high-cost debt, recent repayment trouble and a recent negative income shock.

Importantly, a single bounced payment doesn't automatically trigger ‘Don't borrow’. It's treated as a caution signal. The stronger decision comes from multiple signals occurring together.

So the engine isn't just doing one formula. It's combining affordability with financial-stress signals.”

4:15–4:40 — Negotiation Card

Screen: Negotiation Card

“After the assessment, I turn the important outputs into this one-screen Negotiation Card.

The idea is that the borrower can actually take this into a lender conversation.

It gives them the amount they should target, their EMI ceiling, their fair-rate range, and the costs or fees they should clarify.

So instead of just giving the borrower an analysis, the product gives them something they can actually use when negotiating a loan.”

4:40–5:00 — Engineering + Trade-offs

Screen: Quickly show project structure / README

“From an engineering perspective, I kept the financial logic separate from the UI.

The domain layer contains the rules, calculations and explanations, while the engine orchestrates those into O1 through O4 and the Negotiation Card. The UI is responsible for presenting those results.

For this time-boxed challenge, I deliberately cut authentication, backend infrastructure, bureau integrations, machine learning and lender integrations.

If I continued this product, my next priorities would be better lender-offer comparison, stronger all-in APR calculations, cash-flow-based assessment and product routing.

The core principle behind Borrower Copilot is:

I'm not trying to help the borrower borrow the maximum. I'm trying to help them make a borrowing decision they can comfortably live with.

Thank you.”

🔥 The part you should REALLY understand before recording

If the evaluator interrupts you and asks:

“Why did you ask for existing EMI?”

Answer:

“Because existing EMIs already consume repayment capacity. I use them to calculate current and proposed FOIR and to determine how much room remains for a new EMI.”

“Why household expenses?”

“Because FOIR only captures debt obligations. Expenses let me calculate residual income and make sure the borrower isn't left with an unrealistically small amount after taking the loan.”

“Why credit score?”

“Primarily for O3 pricing. It helps narrow the fair-rate band, but I don't use credit score as a substitute for affordability.”