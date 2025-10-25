---
title: "Selling software without accountability"
date: 2025-10-24
publish: true
---

## The question

When my brother visited me in Chicago to run the 47th Bank of America marathon (on virtually no training!), he raised an interesting question: is **accountability** a good enough reason for why we don't want autonomous AI software engineers? We both agree that full autonomy is not even feasible for at least another two years. The question is more about _when_ AI autonomy becomes feasible, will the need for human accountability get in the way? [1]

If accountability is necessary for running a profitable business, it follows that humans should always have oversight over every product decision and feature implementation; at most, AI would be a coworker, but could never fully displace humans. Alternatively, accountability is not an important part of building software products. In that scenario, AI can successfully decide what to build and then presumably build it too; software engineers and product designers could very well be replaced by fully autonomous AI.

I view accountability as the idea that someone owns a product decision and accepts whatever consequences may follow, good or bad. If we let AI autonomously decide what to do and how to implement those changes, then we can't say that any person truly _owns_ those decisions. At best, we can say that someone instructed the AI on how to operate at a high level, which led to some product outcome. But that's not a generalizable argument—sometimes the decision is a direct result of the human's system instructions, while other times the AI has gone rogue. In any case, autonomous AI prevents clear accountability with any person.

So maybe we can't pinpoint _exactly_ who or what is responsible for certain features, bugs, or errors. Does that negatively affect the bottom line of the software company? To rephrase my brother's question:

> How important is accountability in product teams for building software that sells?

Let's start by looking at our assumptions about why we might need accountability in software teams, meaning each product decision can be traced back to an individual employee.

## Benefits of accountability

I see two main arguments for why firms need accountability to sell software in the pre-AI age.

One is **competitive pressure** from inside the firm. If a knowledge worker makes exceptionally good work they expect promotion, while for exceptionally poor work they can expect to be fired. Accountability motivates employees to do good work and avoid bad work, because everyone owns their decisions and any subsequent consequences. This motivation produces better software products, which helps create a competitive edge in the software market.

Another is the **customer trust**. Naturally, the customer wants to know that the software creator won't betray them. If product teams can make decisions without consequences, what stops them from turning their back on the user? With accountability in place, individual employees are directly responsible for lost customers and revenue if they sunset important features or expose publicly-identifiable information (PII).

Both benefits of accountability help sell software. Are these benefits exclusive to accountability? Let's consider three realistic scenarios in which AI builds software on its own. [2]

## Autonomy scenarios

Imagine AI automation moves up the chain, first replacing engineers with designers who direct autonomous AI to make engineering decisions, then replacing designers with product managers who direct autonomous AI to make design decisions. Even the most technical product managers are swapped with C-suite directing increasingly intelligent yet holistic AI systems. Before you know it, even C-suite is offloading all their decisions. At this point, AI is hypothetically making decisions across every facet of the company. There is not a single employee who can be held accountable for any specific feature, bug, or system failure. Who is accountable when something goes wrong?

There are three plausible scenarios in which all software is designed, coded, and deployed exclusively by AI. The first is exactly as I described: some **small-team company** where the C-suite instructs AI broadly on the company's mission and guiding principles, before kicking their feet up and letting AI make all the product decisions. The second scenario eliminates the company entirely, which is now just a middleman between the user and AI building the software—the **user gives AI high-level instructions** on what software they want built for themselves. In the third scenario, the app builder platform uses context about the user to **anticipate the user's needs**, then builds the software accordingly. [3]

In each scenario, no one can be held fully accountable for how the software turns out, neither the user nor the creator. Since humans can only give AI a finite set of instructions, its decisions will mostly be extrapolations of human rules and intent.

I'd like to test if only accountability can achieve competitive pressure and customer trust, assuming they are both necessary for selling software products. Then we can infer if the absence of accountability, when using autonomous AI systems, would necessarily harm profits.

## Alignment

Alignment is a notable issue with autonomous systems. Even if AI follows all the provided instructions to a T, there will always be edge cases that humans couldn't anticipate or encode preferences for. The system is fully autonomous, so it can't ever ask the human to state or clarify their preferences along the way. AI will need to fill in the gaps with its own preferences, which may or may not be what the software creator would have wanted. There is either human-AI alignment or misalignment: it could go either way.

Let's assume AI makes a decision that is misaligned. The product worsens, users churn, and revenue drops. There is no clear accountability: no individual human made the problematic decision, yet the software suffers. We should ask whether the lack of clear accountability actually hurts the business. Importantly, the market doesn't care _who_ made a bad call—it will respond the same to a misaligned AI as it would to a human making the same misstep. While there is no competitive pressure at an individual level, there is competitive pressure at a company level. If things go sideways, the autonomous system can pick up on that signal and act accordingly.

Autonomous AI might also make an aligned product decision. The product improves and revenue grows. Again, there is no clear accountability: we can't trace the beneficial decision back to an individual. As before, the market doesn't care exactly who created that feature or fixed that bug. So customer trust improves even though accountability is absent. Competitive pressure also acts on the company as a whole—the AI system—rather than on individuals that need incentives to work well.

So there is still competitive pressure even when there's no accountability; the feedback mechanism just acts on a company level rather than an individual level. When aligned, autonomous AI can still maintain or improve customer trust. It's just uncertain whether software changes are aligned (beneficial) or misaligned (harmful), because the human's instructions will have gaps that AI needs to fill on its own.

All in all, autonomous AI can achieve the same main benefits as accountability—competitive pressure and customer trust—just by different, and arguably less certain, means. So autonomous AI can be financially viable, too.

## Blaming users

But what about our intuition that someone, _anyone_, should be responsible when software goes wrong? We can look back at each scenario for creating software with autonomous AI and point fingers at whoever wrote the AI instructions. For commercial software, we might blame the C-suite. For prompt-based personal software, we might blame the user. And for personal software that anticipates user needs, we might blame the app builder platform. Then again, our previous conclusion hasn't changed: no one can be held fully accountable for how the software turns out. We're just running in circles.

Rather than chasing accountability with the software creators, what if we can instead shift the responsibility of good software to the user? This seems backwards and appears to violate every UX principle. The reason is that software markets in the AI age will be highly saturated, due to the rapidly falling barriers for creating software—both skills and cost.

> It's not unlikely that a user can choose from thousands of close software substitutes in the near future.

Accountability will disappear as human teams disappear, and the main responsibility of having a good user experience will fall on the users. Because users have many options, they have greater responsibility over which software product they decide to use.

## Blind trust

You may reasonably say, "but that doesn't solve the issue of information asymmetry!" I completely agree. Let's tackle this separate issue.

Users cannot definitively know ahead of using software if it will work as advertised. However, even today when there are thousands of close substitutes programs for every use case, the overwhelming majority of users blindly accept terms & conditions (T&Cs) and end user license agreements (EULAs). In other words, 99.99% of consumers are already comfortable with blindly trusting the goodwill of software creators to write fine print that is sufficiently aligned with their own goals. After all, EULAs have become longer and more complex over the last decade, and there has only been an increase in software usage. [4]

I see a parallel in blind trust between human-written and AI-written software. I believe that increased AI use in software production will, ceteris paribus, have no effect on software adoption. Most major companies are already writing their software using AI, representing a nonzero percentage of their code. I'm aware some modern companies, like Ramp, even demand their engineers use AI tools to stay ahead of the curve. The software engineering industry has already dialed up the percentage of code produced by AI and the adoption of software has not been affected at all, at least not to my knowledge. If that’s our analysis at the margin, we also won't expect any difference in adoption between software that is 0%, 50%, 90%, 99.9%, or 100% AI made. 100% percentage represents, of course, our autonomous AI system. Why is that? [5]

I think this effect is for pragmatic reasons—all customers should take a product at face value to a certain degree. Consider these reasonable user questions:

- Could my phone battery blow up in my hand?
- Could the tires on my car fall off on the motorway?
- Could the roof in my lecture hall fall on my head mid-class?

You could compile a list of valid concerns about using _any_ product, if you put your mind to it. Even something as harmless as a poster on your wall risks you leaving a bad impression on someone important you invite over. The reason we don’t obsess over such low risks is because we simply want the product that offers maximum upside while falling under a risk threshold—both decided jointly by logical analysis and our gut feeling. The same applies to software products:

> We can only know if software works as expected by using it.

As for trusting the _legal_ goodwill of software creators, you might think we largely trust T&Cs and EULAs because we assume at least one other user _does_ read T&Cs and EULAs and would publicly flag any harmful fine print. Firstly, this is a precarious assumption: not everyone is an Edward Snowdon who finds and reports harmful software practices, and not every software program has been subjected to an Edward Snowdon. Especially in the AI age when there are thousands of close substitutes. Secondly, I would expect an AI system to be far more reliable, accurate, and faster at detecting harmful fine print. [6]

In other words, I don't think the majority of users blindly accept EULAs because they are all free riding on some legal nerd who will read them. No, we just all accept that we can't know for sure if software will work as advertised or breach our trust. We're simply practical creatures: we know the fastest way to find out if software works is to use it, and the fastest way to use software is to skip reading the legal paperwork.

## Conclusion

It turns out, accountability is _not_ vital for selling software. The main benefits of accountability—competitive pressure and customer trust—can also be achieved by autonomous AI systems. Competitive pressure is simply shifted from the individual who needs status-based motivation to the company which continuously collects signals—the company being an autonomous AI system. Customer trust is still feasible, but harder to guarantee when there is no human to validate each decision.

The customer doesn't need perfect trust in a software product to start using it; it just needs to be _promising enough_. At the same time, if autonomous AI is misaligned with what the creator would have wanted and neglects a user, they will still eventually offboard the software, factoring in switching costs. This is analogous to how users blindly accept T&Cs and EULAs for modern software, proving that the vast majority of users accept information asymmetry to a degree and simply look for sufficiently promising products. [7]

Counter to our intuition, users will be responsible for using bad software in the AI age. The falling cost and skills barrier for building software will flood the commercial software market with thousands of close substitutes. Alternatively, users will build their own hyperpersonalized software with AI app builders, meaning they effectively input their needs and also bear responsibility for any poor UX.

Across thousands of commercial and personal software products doing generally the same thing, there will be at least one high quality option. The main barriers to picking high quality software will be switching costs, which is already relevant today, and evaluating all substitutes well, which is a future problem. To solve finding the best option, I expect someone will build a QA testing tool for _users_ that tests software on their behalf before they onboard the best one, which is deserving of its own essay.

Human-AI alignment remains the biggest limiting factor in letting AI design and code software products autonomously. _Letting_ is a much more suitable word than _steering_, because the alignment of products decisions is highly variable: any language-based instruction set will be grossly inexhaustive and full of interpretative gaps that AI needs to fill.

## Notes

[1] My brother ran a total of about 50km in the months leading up to the marathon. Yes, he's crazy.

[2] Competitive pressure is mostly about execution, while customer trust is mostly about product direction.

[3] Assuming that the user is using an app builder platform, the platform would be wise to use general context about the user to more effectively solve the user's needs.

[4] The only chance the user can eliminate information asymmetry about the quality of the software is if there's an agentic AI solution that QA tests software for the end user. Obviously, this solution has its limits when finances and financial products become involved—good luck third party QA testing large money transfers, for example. However, I imagine it would be really useful to the end user if there's the equivalent of an undercover food critic who tests if third party software will work as expected, in the form of an autonomous AI agent.

[5] "How Ramp engineering operates at hyperspeed with Claude Code": https://www.claude.com/customers/ramp.

[6] AI can continuously monitor changes to and proof read the latest EULA.

[7] Shoutout Adobe, who have the lethal combination of consistently bad UX and high switching costs.
