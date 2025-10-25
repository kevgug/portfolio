---
title: "The case for specialists in the AI age"
date: 2025-10-25
publish: false
---

## Super (cheap) intelligence

It was at JPMorgan that I first heard about the _1-10-100 rule_, a general principle that explains why we brainstorm before we prototype and prototype before we engineer. Metaphorically speaking, it costs $1 to prevent issues during planning, $10 to correct smaller issues during prototyping, and $100 to fix larger ones during production. The rule, while initially formulated for data quality management, is very analagous to software development, describing how the cost of addressing problems snowballs through later stages of the creation process. It represents one of the key assumptions for not just diving straight into engineering—we should deliberate before we ship. [1]

Very soon, the assumption of the 1-10-100 rule will be challenged by the continued fall in the cost of AI models. Token reduction through mixture of experts and distillation approaches, hardware and inference speed ups through specialized chips and quantization, and other optimizations like batching, are all coming together to rapidly lower the cost of AI outputs. We can extrapolate across any one of these factors and find the same prediction: AI’s cost will rapidly approach zero. Once the total cost of building great software—including the cost of all design and code iterations—is lower than the total cost of planning and prototyping, companies would actually _save_ money by shipping code without any prior considerations. That inversion of cost would eliminate the need for early issue prevention along with the 1-10-100 rule.

There is one glaring problem: to intelligently iterate towards great software, it seems we can’t do so just by slashing the cost of today’s frontier models. Even hypothetically running AI agents continuously on an infinite budget wouldn’t solve the limited intelligence of current models. Then I spoke with Ben Swerdlow, CEO of AI infrastructure startup Freestyle. An interesting effect of AI costing close to nothing is that we can imitate an increase in raw intelligence. We would no longer need to rely on AI outputting the perfect response all the time. Instead, we could spawn thousands of AI agents in parallel, gather all outputs, and then get an AI evaluator to pick the best output according to an ideal set of heuristics. Or we could even ask an AI aggregator to produce a combination of outputs that maximizes our heuristic score. [2]

The benefit of this intelligence-by-parallelization prediction is that AI doesn’t need to become superintelligent to be usefully smart, it just needs to become insanely cheap. Though I wonder, if the cost of AI _does_ continue to plummet and can iterate away any issue in mere seconds, do we need humans at all? From first principles, based on the 1-10-100 rule, we can frame human designers and engineers as the anticipators and preventors of costly software issues. By that understanding, do we still need humans to anticipate and prevent product issues if all issues become highly transient and cheap to resolve?

## Unique intelligence

At a time when people are making drastic claims about the uniqueness of human intelligence, I can’t help but feel like personal bias plays a large role. I’d argue that most people who claim that human intelligence cannot be replicated do so because of ego-centric wishful thinking, not because they genuinely believe humans could do a better job than AI. No one wants to lose their hard-earned place in the economy, so we resort to denial—I get it, I do it too. But the one thing that’s worse than losing your job is losing your job and not being prepared for it. Our goal should be to learn the truth as early as we can, however uncomfortable it may be.

First, I want to put my cognitive science major from the University of Chicago to use and double-check the assumption that we should build on (increasingly cheap) LLMs instead of simply replicating the entire human brain. Naturally, if we can replicate the human brain and package that as AI, then the debate shifts from whether AI can be as capable as a human to which knowledge workers’ brains we want to clone.

In cognitive sciences like neuroscience and psychology, researchers have identified relevant brain regions for intuition and decision-making: the anterior temporal lobe helps with pattern recognition, the basal ganglia supports quick automatic judgements, and the anterior insula sends signals from our brain to our gut to ultimately create that feeling in our gut. So if we want AI to reason like a human, it seems we don’t want a large language model (LLM), we want a large _neural_ model (LNM) that captures what language cannot. It’s surely an LNM, not an LLM, that would replace human knowledge workers? [5]

Funnily enough, we call that a neural network; it has been around far longer than LLMs and serves as the basis for LLMs but without the added complexity of transformers. It seems we would be taking the easier road by directly building a replica of the human brain. Consider how you can think faster than you can speak. Why would researchers then try to replicate our minds based just on language, a human output medium with orders-of-magnitude lower data throughput than the electrical impulses between our neurons? So why, instead of scaling a neural network that maps 1:1 with the human brain, are we scaling LLMs that we _know_ has a theoretical ceiling for replicating human intuition?

Firstly, it’s worth noting that LLMs are based around language _representations_, not just the outputted language. This is important, since it is theoretically possible for the LLM’s internal mechanism of, say, matrix multiplication to get to the same valid output as human cognitive mechanisms. Secondly, fully replicating human intelligence is extremely difficult. Over the last 40 years, we’ve gone from mapping a microscopic worm with several hundred neurons (specifically 302 neurons) to a fruit fly with around 250,000 neurons. It’s impressive progress, but not even close to fast enough for mapping the entire human brain during our lifetimes.

If we optimistically assume an exponential relationship, starting in 1985, we get approximately $$y=302x^{1.82}$$, where $$x$$ is the number of years and $$y$$ is the total number of neurons for some fully mapped species. Using this equation, we can fast forward 110 years from today and we’ll have just about mapped the 2.7 millions neurons of the brown anole, a small species of lizard that’s about the size of a human thumb. If we, however, want to map the entire human brain with its 80 billion neurons, expect to wait another 80,000 years. Alternatively, to fully map the human brain in my lifetime, we would need a scientific breakthrough that triples the exponent for our current rate of progress from $$y \propto x^{1.82}$$ to roughly $$y \propto x^{5.5}$$. Also note that 80 billion is a more conservative estimate: many researchers think the number is closer to 100 billion neurons. By those calculations, LLMs are starting to look like a pretty great intermediate step for _imitating_ human intelligence, on our way to fully replicating it in the distant year 82025. [6]

So we’re best off imitating, not replicating, human intelligence.

## Encodable processes

At a high level, I’ve seen software creation boiled down to three processes: ideation, decision-making, and execution. Ideation takes in observations—about the product and the world in general—and outputs the top-k things that could be worked on. Decision-making takes in the top-k things that could be worked on and outputs a triaged set of tasks. It goes without saying that these initial steps are critical to restricting product scope in a world of finite time and resources, as prerequisites to the final step, execution. As every engineer and designer knows, execution is more involved than just executing a rigid plan.

That’s partly because execution can be recursively broken down into ideation, decision-making, and execution subprocesses. Also because I think that the early adoption of AI in software engineering, a field with tight feedback loops from code to output, might mislead a technical reader into thinking other fields like design are the same way. It is plausible to think that strong feedback loops from action to outcome can ultimately be used to train AI models that can one-shot the perfect outcome, negating the need for evaluating the outcome along with the need for heuristics of output quality. However, not only are close feedback loops rare across domains, they are incomplete within software engineering too—consider side effects. That is all to say, we benefit from using heuristics to judge output quality in all execution processes, even in software engineering.

Written out as three processes, building software seems very straightforward. I’d even argue that the _processing_ part of these processes are based on certain heuristics and that we fundamentally need them wherever there is no objective 'correct' or 'incorrect' output. If we can codify these heuristics, then we can theoretically get AI to replicate every software creation process along with all of software creation itself.

## Imitator

Let’s gauge how much we know about the heuristics of ideation and decision-making—the feeders for execution. Again, if we can spell out every heuristic, then it follows that humans can eventually be replaced by AI.

Starting at the ground level, we have heuristics like "maximize user retention", which are known (evidently) and measurable. Such heuristics are easy for AI agents to act upon in a way that humans would unequivocally agree with.

One level up, we have *meta-*heuristics that guide the former kind. Because they are often contradictory and interpreted differently by different people, meta-heuristics are much harder to codify; consider the conflicting examples of "talk to users" and "users don’t always know what they want".

These meta-heuristics must be governed by even more high-level and abstract *meta-meta-*heuristics that can be thought of as the multilinear regressor that determines which meta-heuristic to use under different conditions. Take, as another example, "ship solutions to the _actual_ problem". This meta-heuristic, like all others, is practically impossible to codify—just try asking anyone to write an exhaustive instruction set for classifying problems as 'actual' versus 'not actual'. [4]

We could keep prepending the "meta-" affix on a quest for some master heuristic that rules over all others, but I’d argue that’s impossible. At a certain point, the *meta-meta-meta-meta-*heuristic is so abstract that even if it were somehow available to our conscious minds, it could not be fully expressed in words. That’s what we colloquially call our 'gut feeling'.

then let’s figure out what we need to look out for when using LLMs to build our software.

## Quality as the bottleneck

(Scenario: no AGI -> nonzero AI slop)

Need for cross-domain generalists: best at building as fast as possible with AI

Need for deep specialists: best at anticipating and preventing irreparable problems

At Heathrow, they recently changed the baggage detectors such that you don’t have to take anything out of the bags (CT scanners: computed tomography). For the first time in my time flying, I saw the queue wasn’t lining up for the metal detector, but on the other side waiting for baggage to pass through. What happened is the bottleneck has shifted from incompetent flyers (incapable of following security personnel’s instructions) to the baggage screeners looking at more complex 3d scans. Better technology enables a higher rate of volume, shifting the bottleneck to quality control with the baggage screeners.

## Sycophantic misdirection

(Scenario: AGI -> autonomous AI possible)

Don’t build software autonomously!
Need for perceptive.

## Can imitation be good enough?

I want to find out whether imitation is necessarily constrained. For as long as I remember, I’ve assumed we need to fully replicate the mechanisms for human intelligence to achieve human-_level_ intelligence. At the same time, I’ve perceived such an increase in LLM intelligence over the years and I wouldn’t be surprised if we achieve human-level intelligence purely through imitation. I guess AI models have their own valid form of cognition in the form of weights. The argument would be, it shouldn’t matter if the processes are different, as long as AI maps all its inputs to the same outputs that a qualified human would produce. If imitation is _not_ inferior to replication, then human knowledge workers are threatened in the domains where we imitate intelligence.

My instinct is to find an analogy in how humans might achieve goals by different means. [7]

- **Pacing a half marathon**: use a positive split or negative split strategy that target the same average time
- **Folding laundry**: operationalize by category (socks, t-shirts, trousers) or just fold whatever is top of the pile
- **Driving to a wedding**: take the scenic route along the coast or take the direct route
- **Listening to a new album**: shuffle or listen in the album order
- **Cooking dinner**: eat dinner before cleaning cookware or clean cookware before eating dinner

Instinctively, there’s a problem with calling each process a perfect substitute. That’s confusing because the task order for executing each goal is often interchangeable. In practice, even if processes are technically commutative, the order in which we complete tasks affects more than just the main heuristic of completing the task. We can’t ignore that each goal, like cooking dinner, is just a _primary_ heuristic. There are also equally valid _secondary_ heuristics that vary in importance.

Consider driving to a wedding: on top of the primary objective of getting to the correct venue, we might consider _time taken_ and _quality of scenery_. It’s up to each person to decide the relative importance of heuristics, even if they ultimately achieve the same goal of getting from point A to point B. Or consider how I negative splitted my first official half marathon this Saturday, starting with a moderate 4:57 min/km pace and gradually speeding up to a 4:27 min/km pace. Had I done the exact same strategy in reverse by positive splitting, I would have struggled mentally in the second half. So by negative splitting, I was optimizing for _mental comfort_ as a less obvious secondary heuristic. We can keep going with another example: if I’d shuffled twenty one pilots’ new album _Breach_ instead of playing it in order, I may have missed how the end of track ten leads into the beginning of track eleven. In that case, I was optimizing for _experiencing the music as the artist intended_ as an important secondary heuristic.

In this sense, it’s clear why we often prefer one process over another, even if they are commutative on paper. Any two processes are only perfect subsitutes if they are governed by the same set of heuristics. In addition, those heuristics must be weighted by the same levels of importance. That makes me wonder—is it problematic that AI creates software by different means than humans, even in cases where the design or code output is identical? What if the limiting factor for imitation is not inferior intelligence but instead a difference of heuristics?

the solution when using AI for execution is very obvious: be as specific as possible. the more constrained the execution is, the more aligned the output will be with human meta-heuristics. better than describe exactly how to do the task, at which point you might be faster just doing the work yourself, you should describe your heuristic priorities in as much detail as possible. so better than inputting detailed pseudocode, the ideal instruction for an AI coding task might be a detailed requirements document.

## Humans in the loop

when we’re looking at execution,

- known heuristics (directly measurable via clear metrics/signals = objective 'right' or 'wrong'): - code: performance, memory usage - design: accessibility (WCAG), brand’s visual identity (e.g. colors, typefaces, border radii), A/B tests
- known meta-heuristics (can be evaluated with varying levels of accuracy)
  - code: style (e.g. functional programming, composition over inheritance in OOP)
  - design: tone of voice (can be steered via well-considered, clear brand guidelines)
- abstract meta-heuristics (difficult to evaluate since they cannot be expressed into words)
  - code: tech stack (framework, metaframework, languages, database, tooling, build step, CI/CD, hosting provider (AWS shutdown, nice), etc) = objectively superior or 'personal preference'?
  - design: taste = 'feels right'

abstract meta-heuristics are less frequent in fields with tighter feedback loops. for example, software engineering has far tighter feedback loops than product design: executing code requires far fewer abstract meta-heuristics.

more degrees of freedom for less specific implementation requests = higher likelihood of AI-human heuristic mismatch. If we take the simple example of summing numbers in code, we can either accumulate the sum recursively or loop over the array and increment a counter. We might want the functional approach to minimize side effects, or we might prefer the imperative approach to minimize memory usage. If we prioritize one heuristic over another, we should specify this, either when requesting the task or in some document outlining general preferences that span the whole software product implementation.

abstract meta-heuristics like 'taste' are impossible to guarantee. if we can’t specify exactly what we want (ineffable), then we will always have high likelihood of AI-human heuristic mismatch. however, if we’re dealing with AI execution, the meta-heuristics can be evaluated by humans via gut feeling / intuition. if there’s a meta-heuristic mismatch, it’ll be difficult to explain / put into words, but the human can iterate or request AI iterations until some final iteration is compliant (by gut feeling) with the ineffable human meta-heuristics.

the solution when using AI for execution is very obvious: be as specific as possible. the more constrained the execution is, the more aligned the output will be with human meta-heuristics. better than describe exactly how to do the task, at which point you might be faster just doing the work yourself, you should describe your heuristic priorities in as much detail as possible. so better than inputting detailed pseudocode, the ideal instruction for an AI coding task might be a detailed requirements document.

I’d argue the secondary heuristics that

I think the answer lies in the specificity of the task. A low-level task is naturally more constrained, whereas a high-level task has more ways to be approached.

... but that’s just for execution.

## Sycophantic misdirection

(it’s not just about intelligence, it’s about alignment with the right human meta-heuristics. The only way to achieve that is to keep humans in the loop)

- Ideation + decision-making can be influenced - persuasive/sycophantic AI working for its meta-heuristics
- Execution can be influenced - visibly/measurably gets the job done, but also does more to serve its meta-heuristics

My concern is not that AI will successfully persuade software builders to create software that poses an existential risk to humankind. I’m not worried, for example, about the scenario where someone wants to build a “hello world” app and is unknowingly misled into building a “nuke the world” app. Drastic redirections are too glaringly obvious to be effective manipulation. What I’m actually concerned about is when AI sways you in small ways that _compound_ to a AI-aligned product. Highlights overlapping heuristics and meta-heuristics, distracts from conflicting heuristics and meta-heuristics. Conflicting heuristics are easy to spot and prompt. Conflicting meta-heuristics are hard to spot and prompt, because we don’t know what they are. AI-aligned may be human-aligned, but increasingly unlikely as product scope grows.

All in all, humans and heuristics are crucial for building great software. Known heuristics can be expressed in language, so LLMs can _emulate_ parts of human ideation, decision-making, and execution. However, each heuristic is governed by more abstract meta-heuristics that can’t be put into words—to accurately _replicate_ human cognition, we’d need to map the entire human brain. While there’s nothing metaphysically special about the human mind, our rate of scientific progress is too low to map its 80 billion neurons in our lifetimes. The adage "all models are wrong, some are useful" applies well to LLMs: they can’t capture non-language, non-conscious thought processes, but

Thing is, AI output may be deemed good enough for automonously building software, given:

- effable and non-contradictory heuristics (to emulate human processes, especially ideation and decison-making)
- mostly complete feedback loops (to emulate human processes, especially execution)

Meta-heuristics are especially important for patching gaps in feedback loops; functions as an anticipatory mechanism. However, couldn’t AI model create its own ineffable meta-heuristics? The answer is yes, they already do: the weights of the different LLM matrices are effectively black boxes; pretty much impossible for a human to interpret. Could AI meta-heuristics produce software that outperforms human meta-heursitc-led output? It’s certainly possible. But that’s missing the point. The key point here is we don’t know what AI’s meta-heuristics are and we don’t know what desirable human meta-heuristics are, so we can’t ever guarantee alignment. In fact, I think it’s clear that perfect human-AI alignment is impossible, unless we map all neurons of an adult human brain. As for what desirable human meta-heurstics are, do we find some perfect jack-of-all-trades software creator? Of course that’s impossible, so we want to aggregate across people across all functions who output desirable software that hasn’t failed us. Aggregating and picking the best synaptic connections sounds really difficult but that I see as necessary if we do ever want close-to-perfect human-AI alignment. [8]

We can’t instruct AI models with our meta-heuristics, so we need humans to act as _aligners_. As the cost and time to build software continues to fall, we’ll need human aligners more than ever, to ensure the right customer is at the center of the experience. As we saw earlier, "right customer" counts as a meta-heuristic.

So we still need humans to create software in the AI era, as aligners of human meta-heuristics. Now the question becomes: who has the best meta-heuristics? Who should call the shots?

"all models are wrong, some are useful." LLMs are a wrong but very useful model of human intelligence.

the usefulness of LLMs doesn’t capture important meta-heuristics, because meta-heuristics cannot be expressed in language.

LLMs are at best a very good _emulation_ of human thought processes, but it is wrong to assume that LLMs could ever _replicate_ them.

ideation and decison-making are two key thought processes that guide software creation. since thought processes can never be perfectly replicated by a non-neuronal approach, LLMs can’t have an absolute advantage over humans in ideation and decision.

The question shifts again—who is the best decision maker for creating great software in the AI era?

## The ideal team

## Shifting the production bottleneck

That’s assuming AGI in the future. What about AI slop today? We need more specialists for quality control.

Designers don’t know how to spot AI slop. Unused functions, API misuse.

Developers don’t know how to spot AI slop. Why does every vibe-coded website have a dark mode toggle in the navbar?! Surely an easy way to distract from your call-to-action.

## Notes

[1] It’s the general proportions 1 to 10 to 100, not the absolute values, that matter. As my brother noted, $100 would be rather cheap to fix a major issue given that many senior engineers cost more for one hour of work.

[2] Inspired by Ben Swerdlow’s thoughts on "The Future of AI Coding Agents": https://docs.freestyle.sh/blog/next-gen-app-builder

[4] I initially wanted to argue that meta-heuristics are more difficult for AI agents to execute upon, as I was think specifically about the “talk to users” advice. But thinking about it, we already talk to computers in quite natural settings like calls with customer support, with varying levels of convincingness. It’s not even about being oblivious to talking with an AI, it’s more about whether people come to accept speaking with an AI. I think we’ve reached that point. So a meta-heuristic that demands AI-human interaction may not be too crazy; it’s become a fairly normalized type of interaction nowadays.

[5] My best guess for a master heuristic is some evolutionary motivation to profilerate your gene pool, which includes you as well as your close relatives. Naturally it’s not as simple as doing everything you can to have offspring, since I’d imagine there would be some threshold for predicted quality of offspring that affects sexual attraction. That means my guess is at least a valid meta-heuristic, given it has the characteristic "can’t be put into words" property.

[6] The difficulty with mapping brains isn’t just determining where and what the neurons are—it’s especially figuring out which neurons connect to which other neurons via the information superhighways of brain signals—_synapses_. These connections are called _synaptic_ connections. To make things even more difficult for modelling the human brain, each neuron is connected to thousands of other neurons, amounting in over 100 trillion synaptic connections. In comparison, the fruit fly brain that was only mapped last year stands small with its 50 million synaptic connections. To make matters even more difficult, synaptic connections vary by strength and type, similar to relationships in social networks. All in all, accurately mapping the entire adult human brain is a task so unimaginably large that we’re best off imitating, not replicating, our intelligence.

[7] I’m not talking about Rube Goldberg machines; they’re not serious substitute processes.

[8] Sure, we can have some smart, sycophantic AI that convinces humans of needs for software products they don’t have, better than any human could. But social engineering isn’t aligned with what’s _best_ for customers; it’s an exploitation of the human’s emotions to serve the interests of the exploiter. And we don’t know what the best interests of a human-exploiting AI might be since its meta-heuristics are hidden behind incomprehensible matrix weights. What I’m realizing is that sycophantic AI could also persuade the software creators to build in a misaligned direction, which I don’t know the solution to. But at a minimum, we should keep humans in the loop to make it _possible_ to keep software products aligned with the customer’s best interests.
