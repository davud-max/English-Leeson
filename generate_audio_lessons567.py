#!/usr/bin/env python3
"""
Generate audio files for Lessons 5, 6, and 7 using Edge TTS

Install: pip3 install edge-tts
Run: python3 generate_audio_lessons567.py
"""

import asyncio
import edge_tts
import os

VOICE = "en-US-GuyNeural"

# ============= LESSON 5 =============
LESSON_5_SLIDES = {
    1: """Good day! In the last lesson, we discovered that the unique human ability — to abstract — leads to the formation of goals and action according to rules, the main one being the prohibition of violence.

Today we move from theory to practice. We will answer the question: what is activity worthy of a human being?

How to distinguish genuinely human activity that creates goods from predatory imitation that leads to decline?""",

    2: """Part One: The Essence of Human Activity.

A goal is born from anxiety, from the desire to improve one's situation. But a human, unlike a beast, cannot use violence against another person to achieve a goal. This is taboo.

Human activity is activity aimed at achieving goals without using violence.

To achieve goals, resources and energy are needed. In the human context, resources used to achieve a goal are called goods. Goods are limited.

Therefore, a double task arises: First, how to obtain necessary goods? Second, how to distribute them among competing goals?""",

    3: """Part Two: Praxeology and Economics — The Science of Action.

The theory describing optimal ways to achieve formed goals is called praxeology — the science of activity. Its core is analysis, searching for paths to the goal within rules.

The most important part of praxeology, dealing precisely with questions of obtaining and distributing goods, is economics.

Economics in its original sense is human activity aimed at obtaining goods and distributing them among goals by rank of importance.

Note: forming goals themselves is the domain of psychology. Economics begins when the goal already exists and a non-violent way to provide it with resources must be found.""",

    4: """Part Three: Ethical Limits and Experience.

Before acting, a person evaluates not only effectiveness but also reputational risks. Violating informal rules of cooperation threatens loss of trust, and therefore future goods.

These spontaneously formed rules of non-violent interaction are called ethics.

But what if modeling a path to the goal fails? Then a person can act spontaneously, by trial and error.

The result of such unintentional actions, positive or bitter, is experience.

Gaining experience is often associated with risk and resembles a sacrifice on the altar of knowledge.""",

    5: """Part Four: Economics as the Science of Uncertainty.

How does economic science fundamentally differ from physics?

A physicist discovers objective laws that don't depend on opinion. Gravity acts on everyone equally.

An economist deals with private evaluative judgments of people that constantly change. It would seem building a general theory is impossible.

The solution was found by analogy with gas physics. You can't track each molecule, but you can identify statistical regularities in the behavior of many. So in economics: we rely on basic postulates true for most. For example, a person prefers more goods to less. A present good is valued more than a future one.

Key difference: economic postulates are relative, not absolute. Economic theory works with uncertainty, striving to reduce it but unable to eliminate it completely.

Any theory promising complete certainty in economics is false — it's an intellectual perpetual motion machine!""",

    6: """Part Five: Substitution and Imitation.

Human activity based on voluntary cooperation and rejection of violence produces phenomenal growth in well-being.

Violent activity — robbery, deception, fraud — gives only temporary private gain, undermining the basis of cooperation and leading to decline.

Therefore, violators are forced to mimic. They create an imitation of human activity. They also have "business," "profit," "services," "charity." But in reality: where an honest person has profit — a result of voluntary exchange — a robber has loot. Where there's work — he has robbery.

Recognizing this imitation is a vital skill! Its metastases, penetrating the body of society under plausible pretexts — "fair redistribution," "fighting for something" — lead to crises, famine, and wars.""",

    7: """Part Six: Call to Literacy.

How to learn to recognize imitation? Return to basics. Be honest with yourself. Accept conclusions of formal logic. Use quantitative analysis. Master mathematics at the level of understanding relationships between quantities and formulas.

Economic science, in the words of Ludwig von Mises, cannot remain an esoteric branch of knowledge. It concerns everyone and belongs to all. It is the main and true business of every citizen.

Just as we find time for personal hygiene, we must find time for hygiene of thinking — to verify whether we're dealing with human activity or its dangerous imitation.""",

    8: """Cycle Summary: We have traveled the full path! From the act of distinction to the highest social laws.

Algorithm of thinking: Perception, Distinction, Term, Quantity, Formula.

Foundation of society: Ability to abstract, Knowledge, Rules, Prohibition of violence — Law.

Criterion of activity: Goal plus Non-violent action equals Human activity. Imitation equals Violence.

Armed with this understanding, you receive not just knowledge, but a coordinate system for navigating the complex world of ideas, actions, and social institutions.

You can distinguish a creative rule from a destructive one, law from arbitrariness, true economics from a predatory scheme.

This is the goal of true education — not to fill the head with facts, but to give a tool for independently building a consistent picture of the world.

Thank you for traveling this path together!"""
}

# ============= LESSON 6 =============
LESSON_6_SLIDES = {
    1: """So, we have a person who thinks, sets goals, and acts according to rules. But they are not alone!

Language, born from signs for abstractions, allows something completely new — exchanging knowledge. People begin to communicate. And communication leads to the possibility of making agreements, uniting in groups, and acting together for a common goal.

Thus, the ability to abstract gave rise to society.

Communication is the exchange of knowledge.

Society is a group of people united by a shared information field.""",

    2: """But what happens when people begin to interact? Conflicts arise. The most terrible of them — violence, the use of force against another person.

Force can deprive a person of freedom, the right to act by their own rules, and property.

Violence destroys the very foundation of cooperation. Over millennia of spontaneous selection between different groups, the main, saving rule crystallized — the prohibition of violence.

This is not a rule someone invented and introduced. It was discovered, like a law of physics. It is formal — it makes no distinctions by skin color, gender, or age. This is Law.

Law is a formal prohibition on the use of violence against a person.""",

    3: """But if violence is prohibited, how to defend against those who still use it?

The answer is in the definition itself: what's prohibited is violence — the use of force against a person, not force itself. Force can and should be used against violence.

Defense is the use of force against violence.

Organized force protection of a person from violence — this is politics.

And society protected by such politics is called civilization. From Latin 'civilis' — fenced, protected.""",

    4: """Do all people equally understand against whom violence cannot be used?

History shows: no. Humanity develops in leaps, transitioning from one level to another. Each level is a new circle of people whom a person recognizes as their own — protected by law.

Family level: 'My own' equals only my family members.

Tribe level: 'My own' equals entire tribe.

Nation level: 'My own' equals all who speak my language, share my blood.

Civil society level: 'My own' equals any person who has rejected violence.

Each of us in childhood passes through these levels, and our upbringing is a purposeful ascent to a higher level.""",

    5: """Conflict between people from different levels is a civilizational conflict.

For a person at the tribe level, a representative of another tribe is not a person — violence can be used against them.

For a person at the nation level, both tribes are "their own," and violence is unacceptable.

Their collision is a clash of different rules for distinguishing "human — not human."

This is how the modern concept of "human" is refined: Human is a being that distinguishes another human and recognizes their rights, freedom, and property.""",

    6: """Let's return to our thinking person. They are troubled by uncertainty, threats, lack of something. To relieve anxiety, they build a mental model of a better state — a goal.

But to achieve the goal, resources are needed, sources of energy. Resources used for a goal are goods. And goods are always insufficient.

Therefore, a double task arises before a person: First, how to obtain goods? Second, how to distribute them among competing goals?

At the same time, actions must remain within the law — be non-violent.""",

    7: """Thus, a strict definition is born:

Human activity is activity aimed at achieving formed goals without using violence.

Here is its core: Goal, then analysis of options — this is praxeology, then action by rules without violence.""",

    8: """Before acting, a person evaluates not only effectiveness but also reputational risks. Spoiling relationships with others is too high a price.

Thus, rules of non-violent interaction are spontaneously born — ethics.

Ethics are rules regulating non-violent interaction between people.

And if goals exist but how to achieve them is unclear? No knowledge to build a model? Then a person can act spontaneously, unintentionally.

Experience is a connection between objects or phenomena obtained through unintentional actions.

Gaining experience is a sacrifice, a risk in the name of knowledge.""",

    9: """Now let's put it all together.

The science of human activity as a whole is praxeology.

And its key part, studying methods of obtaining and distributing limited goods for achieving goals, is economics.

Economics is human activity aimed at obtaining goods and distributing them among goals by rank of importance.""",

    10: """How does economics differ from, say, physics?

In physics, connections are objective and don't depend on our opinion.

In economics, everything is based on private evaluative judgments of people that constantly change.

How to build theory in such uncertainty? Economics finds regularities — what's true for most people in most cases. For example: A person prefers to be healthy and rich rather than sick and poor. A good today is more valuable than the same good in an uncertain future. A person strives to get the desired with minimum costs.

But in economics there are no universal formulas. Formulas here are always agreements between people about what to consider a standard and how to calculate within a specific deal.""",

    11: """Human activity based on voluntary cooperation gives phenomenal growth in well-being.

Violence leads to decline.

Therefore, those who use violence — thieves, fraudsters, robbers — disguise themselves. They create an imitation of human activity. They also have business, profit, services. But in reality, they have no profit — they have loot. No work — robbery.

Recognizing this imitation is difficult. Outwardly everything is decent: politeness, documents, environmental care.

But inside — emptiness and violence. This emptiness devours society, leading to crises.""",

    12: """Learning to see this difference is the main practical goal of our course.

For this you need: Be honest with yourself. Accept conclusions of formal logic. Use only your own reason for analysis. Master quantitative analysis at seventh-grade math level.

As economist Ludwig von Mises said: Economics is the main and true business of every citizen.

For this business, as for daily hygiene, it's worth finding time and energy.

Because only this way can we protect the genuinely human world, built on abstractions, rules, and voluntary cooperation."""
}

# ============= LESSON 7 =============
LESSON_7_SLIDES = {
    1: """Today we'll talk about how from simple exchange of gifts between tribes, money, markets, and the banking system were born.

This is a journey from the communal pot to retail trade.

Let's trace this fascinating path of human cooperation!""",

    2: """Part One: The World Before Trade.

In closed patriarchal-communal societies, trade did not exist. In prehistoric times, most resources were at the disposal of only heads of families, clans, or tribal chiefs.

They worked together and ate from a common pot together. There was no property yet.

Each community had its relatively stable boundary, protected from outsiders' encroachment. Nevertheless, between chiefs of neighboring communities there was interaction, accompanied by mutual gifts. Gifts could include rare items that arrived through a chain from very distant places.

At the first stage, goods moved, but owners of goods did not move. And exchange occurred only between groups foreign to each other.""",

    3: """Part Two: Birth of Merchants and Caravans.

The uniqueness and high usefulness of some goods received as gifts from a neighboring tribe prompted sending a special group to search for them. For traveling through neighboring communities' territory, appropriate gifts and guides were needed.

Expeditions became regular. Routes became more diverse and distant. Now goods weren't moving between communities on their own — special groups of people moved them. Thus merchants and caravans appeared.

A place where several caravan routes intersected became a joint camp. Here merchants exchanged both goods and information. They could agree to meet next season. Thus seasonal fairs appeared.""",

    4: """Part Three: Formal Rules and Markets.

The number of fairs began to grow. Each developed its own rules. Fairs grew faster where conditions for exchange were better and where understandable rules recognized by most were maintained.

These rules sharply differed from rules within a traditional community. Fair owners were most interested in protecting new rules. They allocated part of their forces and resources to ensure these rules worked on their territory.

The largest and most successful fairs attracted merchants from other nations. International trade brought peoples closer, forming unified exchange rules and a common language of exchange.

Territories appeared where unified exchange rules were formed. They no longer depended on tribal, ethnic, or racial differences of exchange participants. They were formal in nature. The market appeared.""",

    5: """Part Four: Birth of the Coin.

Land at the intersection of trade routes was rented for warehouses, workshops, and markets. Payment was calculated daily. As markets grew, tracking rent payments became important.

Each merchant, after paying daily rent, received a token — a tag certifying payment. Token forms varied across markets. It could be a piece of leather with a seal or the landlord's family crest imprint.

As trade volume increased, tokens' fragility and vulnerability to forgery prompted the next step. The family crest began to be stamped on more durable material. Such materials could be copper, bronze, silver, or gold. The first cast coin appeared.

In many countries, the silver coin used to pay for daily market rent was called tanga or denga, from the word tamga — a family or clan crest.""",

    6: """Part Five: Birth of the Bank.

How to achieve multiple use of coins? How to return coins from merchant back to owner?

A special house was designated — a treasury, storage of valuables, where natural payments for daily market rent were accepted. In exchange for received products, a coin was issued. Special controllers each day at a set time walked around the market and collected coins back. If no coin was found, the stall was closed.

Thus, coins issued at the cash desk returned to the same cash desk.

Buyers didn't pay for market access. They had a separate entrance called the "eye of the needle" — due to its resemblance to old needle holders. Only people could physically pass through, but not pack animals.""",

    7: """Part Six: Coin as Payment Means.

A merchant could finish their trading season early. Then remaining coins could be saved until next season, sold to neighbors at a discount, or bought from a neighbor at a premium if needed.

Thus, within a given market, the coin gradually became a payment means between merchants themselves and with buyers. The owner who minted coins couldn't miss this. He began using the treasury not only for rent payments but also for issuing coins on loan — on credit. This additional financial mechanism unexpectedly brought great profit.""",

    8: """Part Seven: Good and Bad Money.

Cast coin is durable but easy to forge. Casting was replaced by minting — stamping an imprint. Initially coins were minted only on one side. Coins with one-sided minting were called bracteates, from the Latin word bractea — tin.

Increased silver coin production raised silver's value. This led to coin clipping — scraping off small amounts of silver from coins. Weight changed, and therefore value, leading to payment conflicts and undermining trust in coins.

Competition began between coins. Same denomination coins with different mints were valued differently. Coins whose owners more strictly prevented forgery or clipping enjoyed greater trust. The former were called good money, the latter bad money.

On a free market, good money drives out bad money, bringing their owners greater profit.""",

    9: """Part Eight: Network Banking System.

Coin owners, seeing the profit from minting coins for retail trade, sought to expand the zone of application. They could rent space at other markets to open branches of their exchange office there. Thus the network banking system was born.

Gradually, the term "cash desk" remained only for the place of receiving or issuing cash. The house where all other operations occurred — from minting to exchange and credit — received the name bank, from the Latin word banco — bench, counter, table on which money changers laid out coins.

Development of retail trade allowed creating permanent markets in place of seasonal fairs. Agricultural producers themselves brought their products to permanent fair locations expecting to exchange them for coins. Cities appeared. Independent owners separated from the community — Cossacks or farmers.

So, two new concepts — bank and coin — radically changed the exchange system. Markets and retail trade appeared. The banking network system allowed establishing coin minting, monitoring coin quality, fighting counterfeiters, exchanging coins, and issuing credit.

Thank you for your attention."""
}

async def generate_audio(lesson_num, slide_num, text, output_dir):
    print(f"  Generating lesson{lesson_num}/slide{slide_num}.mp3...")
    output_path = f"{output_dir}/slide{slide_num}.mp3"
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(output_path)
    print(f"    ✓ Saved {output_path}")

async def main():
    base_dir = "public/audio"
    
    # Generate Lesson 5
    print("\n📚 Generating Lesson 5 audio files...")
    os.makedirs(f"{base_dir}/lesson5", exist_ok=True)
    for slide_num, text in LESSON_5_SLIDES.items():
        await generate_audio(5, slide_num, text, f"{base_dir}/lesson5")
    
    # Generate Lesson 6
    print("\n📚 Generating Lesson 6 audio files...")
    os.makedirs(f"{base_dir}/lesson6", exist_ok=True)
    for slide_num, text in LESSON_6_SLIDES.items():
        await generate_audio(6, slide_num, text, f"{base_dir}/lesson6")
    
    # Generate Lesson 7
    print("\n📚 Generating Lesson 7 audio files...")
    os.makedirs(f"{base_dir}/lesson7", exist_ok=True)
    for slide_num, text in LESSON_7_SLIDES.items():
        await generate_audio(7, slide_num, text, f"{base_dir}/lesson7")
    
    print("\n✅ All audio files generated successfully!")
    print(f"   Lesson 5: {len(LESSON_5_SLIDES)} slides")
    print(f"   Lesson 6: {len(LESSON_6_SLIDES)} slides")
    print(f"   Lesson 7: {len(LESSON_7_SLIDES)} slides")

if __name__ == "__main__":
    asyncio.run(main())
