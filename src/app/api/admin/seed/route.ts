import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Full lesson content extracted from page.tsx files
const LESSONS_FULL_CONTENT = [
  {
    order: 1,
    title: 'Terms and Definitions',
    description: 'How knowledge is born. Fundamental terms: point, line, plane, space. Two opposing movements of thought.',
    duration: 40,
    content: `# Terms and Definitions

## How Knowledge is Born

Everything begins with observation. Observable phenomena must be described in words so the listener understands exactly what you observed.

**Definition** = Shortest description of observable phenomenon, sufficient for understanding by another person.

**Term** = Word assigned to definition for convenience of use.

## Four Ultimate Terms

These four ultimate terms allow building descriptions and definitions of any abstract objects:

- **Point** — zero dimensions (ultimate term, no definition)
- **Line** — one dimension (consists of multitude of points)
- **Plane** — two dimensions (consists of multitude of parallel lines)
- **Space** — three dimensions (consists of planes)

## Real vs Abstract Objects

**Real object** cannot be described completely, but can be directly demonstrated and designated by word (noun, name).

**Abstract object** cannot be demonstrated. It doesn't exist. But can be described using ultimate terms.

## Two Opposite Movements

We traced two opposite movements:

1. **From reality to abstraction** — observe, describe, give definition, assign term.
2. **From abstraction to reality** — take term, seek suitable objects in world.

**Essence of education** — ability to move freely in both directions. This is what we must teach child.

**Fundament of thinking** — ability to see invisible behind visible and find visible embodiment of invisible ideas!`
  },
  {
    order: 2,
    title: 'What Is Counting?',
    description: 'The origin of counting. Group, numeral, digit. Counting on fingers: dozen, score, gross. Natural numbers.',
    duration: 30,
    content: `# What Is Counting?

## The Origin of Counting

We have a group of objects. We want to describe this group. We need to count them.

**Counting** = Establishing one-to-one correspondence between objects of the group and reference set.

The simplest reference set — our **fingers**.

## Numeral and Digit

**Numeral** = Word denoting quantity of objects in group.

**Digit** = Written symbol for numeral.

## Counting Systems

Different peoples used different reference sets:

- **Dozen** (12) — counting by finger joints
- **Score** (20) — counting fingers and toes  
- **Gross** (144) — dozen dozens

## Natural Numbers

**Natural numbers** = Numbers used for counting: 1, 2, 3, 4, 5...

Zero is NOT a natural number. Zero means absence, nothing to count.

**Key insight:** Number is abstraction. We cannot show "three" — only three specific objects.`
  },
  {
    order: 3,
    title: 'What Is a Formula?',
    description: 'The emergence of the concept of a parameter. Relationships between quantities and formulae. The number π.',
    duration: 30,
    content: `# What Is a Formula?

## From Specific to General

When we notice a pattern that works for many cases, we can write it as a formula.

**Formula** = Symbolic record of relationship between quantities.

## Parameters and Variables

**Parameter** = Symbol representing any value from certain set.

When we write A + B = B + A, letters A and B are parameters. They can be any numbers.

## The Number π

Ancient geometers discovered: ratio of circumference to diameter is always the same!

**π ≈ 3.14159...**

Formula: C = π × d (Circumference = pi times diameter)

This is example of **mathematical constant** — number that appears in many formulas.

## Power of Abstraction

Formula captures infinite number of specific cases in one compact record.

Instead of listing: 1+2=2+1, 3+5=5+3, 7+4=4+7...

We write once: **A + B = B + A**

This is the power of mathematical thinking!`
  },
  {
    order: 4,
    title: 'Abstraction and Rules',
    description: 'Human beings and thinking. Abstraction and knowledge. Literacy as rule-based action.',
    duration: 25,
    content: `# Abstraction and Rules

## Human Beings and Thinking

What distinguishes humans from animals? The ability to think abstractly.

**Abstract thinking** = Operating with concepts that have no direct physical embodiment.

## Abstraction and Knowledge

Knowledge exists at different levels of abstraction:

1. **Concrete knowledge** — this apple is red
2. **General knowledge** — apples can be red, green, or yellow
3. **Abstract knowledge** — color is property of objects reflecting certain wavelengths

## Literacy as Rule-Based Action

**Literacy** is not just knowing letters. It's ability to follow rules.

- **Reading** = Following rules to decode symbols into meaning
- **Writing** = Following rules to encode meaning into symbols
- **Arithmetic** = Following rules to manipulate numbers

## The Essence of Rules

**Rule** = Instruction for action that works in all similar situations.

Rules are abstractions. They describe not one specific action, but a class of actions.

Understanding rules means understanding abstraction!`
  },
  {
    order: 5,
    title: 'Human Activity: Praxeology, Economics, and Imitation',
    description: 'What kind of activity is worthy of a human being? How can creation be distinguished from imitation?',
    duration: 25,
    content: `# Human Activity: Praxeology, Economics, and Imitation

## Praxeology — Science of Human Action

**Praxeology** = Study of purposeful human behavior.

Key insight: Humans act to achieve goals. Every action implies:
- Dissatisfaction with current state
- Vision of better state
- Belief that action can achieve it

## Economics as Part of Praxeology

**Economics** studies how humans allocate scarce resources among competing goals.

Resources are always limited. Goals are unlimited. We must choose.

## Creation vs Imitation

Two types of human activity:

**Creation** = Bringing something new into existence
- Requires understanding of principles
- Produces genuine value
- Advances human knowledge

**Imitation** = Copying what others have done
- Requires only observation
- Reproduces existing value
- Preserves but doesn't advance

## The Human Path

True human activity involves understanding, not just copying.

A parrot can repeat words. Only human can understand meaning.`
  },
  {
    order: 6,
    title: 'Human Activity and Economics',
    description: 'From communication to law. Levels of civilization. Goals and goods. Ethics and experience.',
    duration: 25,
    content: `# Human Activity and Economics

## From Communication to Law

Human society requires:
1. **Communication** — sharing information
2. **Cooperation** — working together
3. **Rules** — coordinating expectations
4. **Law** — enforcing rules

## Levels of Civilization

Civilization develops through levels:

1. **Tribal** — rules based on tradition
2. **Agricultural** — rules based on territory
3. **Commercial** — rules based on contract
4. **Industrial** — rules based on universal law

## Goals and Goods

**Goal** = Desired future state
**Good** = Anything that helps achieve a goal

Economics studies how we:
- Identify goals
- Find goods
- Exchange goods
- Create new goods

## Ethics and Experience

**Ethics** = Knowledge of how to live well

Ethics comes from experience — both personal and collective wisdom of humanity.

We learn what works and what doesn't through trial and error, across generations.`
  },
  {
    order: 7,
    title: 'The Fair and the Coin: The Birth of Money',
    description: 'How money, markets, and banks emerged from the exchange of gifts between tribes.',
    duration: 35,
    content: `# The Fair and the Coin: The Birth of Money

## Gift Exchange Between Tribes

Before money, tribes exchanged gifts:
- Built relationships
- Established peace
- Shared resources

But gift exchange has limitations — no precise measurement of value.

## The Emergence of Markets

**Market** = Place where people regularly meet to exchange goods.

Markets solved the problem of finding trading partners.

## The Problem of Barter

**Barter** = Direct exchange of goods for goods.

Problem: Double coincidence of wants. You have fish, want wheat. Must find someone with wheat who wants fish!

## The Solution: Money

**Money** = Good accepted by everyone in exchange.

Properties of good money:
- **Durable** — doesn't spoil
- **Divisible** — can make change
- **Portable** — easy to carry
- **Recognizable** — hard to counterfeit

## The Birth of Banking

Banks emerged to:
- Store money safely
- Transfer money between locations
- Lend money to those who need it

Money is one of humanity's greatest inventions — it enables cooperation among strangers!`
  },
  {
    order: 8,
    title: 'Theory of Cognitive Resonance',
    description: 'How does thought arise? Two circuits of consciousness and the mechanism of resonance.',
    duration: 25,
    content: `# Theory of Cognitive Resonance

## How Does Thought Arise?

We don't create thoughts — we receive them. Thought comes to us, not from us.

**Key question:** What determines which thoughts we receive?

## Two Circuits of Consciousness

**Analog Circuit (Proto-Knowledge)**
- Continuous, flowing
- Pre-verbal, intuitive
- Connected to everything
- Source of insights

**Digital Circuit (Interface)**
- Discrete, structured
- Verbal, logical
- Separated, bounded
- Tool for communication

## The Mechanism of Resonance

**Cognitive Resonance** = When inner state matches outer information, understanding occurs.

Like tuning fork: You can only hear what you're tuned to receive.

## The Inner Resonator

Each person has unique **cognitive profile** — set of frequencies they can resonate with.

This explains why same information affects people differently.

## Pedagogy of Resonance

Teaching is not transferring information. Teaching is **tuning the resonator**.

Good teacher helps student become capable of receiving insights directly.

## The Logic of Effective Learning

1. Prepare the resonator (motivation, context)
2. Present the frequency (information, problem)
3. Allow resonance to occur (understanding)
4. Verify resonance (application)

**Thought is not created — it is encountered!**`
  },
  {
    order: 9,
    title: 'The Creation of the World: Biblical Cosmogony',
    description: 'Heaven and earth, water and light — a philosophical analysis of the first chapter of Genesis.',
    duration: 20,
    content: `# The Creation of the World: Biblical Cosmogony

## In the Beginning

"In the beginning God created the heaven and the earth."

This is not just religious text — it's profound philosophical statement about the structure of reality.

## Heaven and Earth

**Heaven** = Realm of the abstract, the ideal, the unchanging
**Earth** = Realm of the concrete, the material, the changing

The distinction between heaven and earth is the first act of creation — the first distinction.

## Water and Spirit

"And the Spirit of God moved upon the face of the waters."

**Water** = Undifferentiated potential, chaos, possibility
**Spirit** = Differentiating force, order, actuality

## Let There Be Light

"And God said, Let there be light: and there was light."

**Light** = Consciousness, awareness, the ability to distinguish

Without light (consciousness), nothing can be known to exist.

## The Pattern of Creation

Each day of creation follows pattern:
1. Distinction is made
2. Name is given
3. It is declared good

This is the pattern of all knowledge: distinguish, name, evaluate.

## Philosophical Significance

Genesis describes not historical event but eternal structure:
- Distinction between abstract and concrete
- Order emerging from chaos
- Consciousness making existence meaningful`
  },
  {
    order: 10,
    title: 'Cognitive Resonance II',
    description: 'How we think. Continuation of the topic.',
    duration: 25,
    content: `# Cognitive Resonance II

## Deepening the Theory

In Lesson 8 we introduced cognitive resonance. Now we explore further.

## The Three Conditions for Resonance

For cognitive resonance to occur, three conditions must be met:

1. **Readiness** — the resonator must be prepared
2. **Proximity** — the frequency must be close enough
3. **Stillness** — noise must be minimized

## Why Understanding Fails

Understanding fails when:
- **Not ready** — lacking prerequisites
- **Too distant** — information too far from current knowledge
- **Too noisy** — distracted, anxious, rushed

## The Role of Questions

Questions tune the resonator. A good question prepares mind to receive specific answer.

"The answer is always there. The question makes it visible."

## Teaching as Tuning

Teacher's role:
1. Assess student's current frequencies
2. Provide adjacent frequencies
3. Create conditions for resonance
4. Verify that resonance occurred

## Learning as Self-Tuning

Advanced learner:
1. Knows their own frequencies
2. Seeks appropriate challenges
3. Creates own conditions
4. Validates own understanding

## The Resonance Cascade

One resonance enables others. Understanding builds on understanding.

This is why fundamentals matter — they enable all subsequent resonances.`
  },
  {
    order: 11,
    title: 'The Number 666',
    description: 'A philosophical interpretation of the number of the Beast through the theory of abstraction.',
    duration: 20,
    content: `# The Number 666

## The Mystery

"Let him that hath understanding count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six."

What does this mean?

## Six as Human Number

In Biblical numerology:
- **7** = Perfection, completion (God rested on 7th day)
- **6** = Incompleteness, falling short of perfection

Humans were created on the **6th day**.

## The Triple Six

666 = 6 + 60 + 600

Three levels of six:
- **6** = Body (physical)
- **60** = Soul (psychological)  
- **600** = Spirit (intellectual)

## The Beast as Incomplete Human

The "beast" is not external monster but internal state:
- Human who remains at level 6 (animal)
- Never reaching level 7 (divine)

## Through Abstraction Theory

Level 6 = Maximum material development without spiritual transcendence.

The beast is human who:
- Has knowledge but lacks wisdom
- Has power but lacks virtue
- Has sophistication but lacks truth

## The Warning

666 warns: Technical advancement without spiritual development leads to destruction.

Being "fully human" at material level is still "beastly" — below true human potential.`
  },
  {
    order: 12,
    title: 'Three Steps to Heaven: 666',
    description: 'The number 666 as a formula of ascent.',
    duration: 22,
    content: `# Three Steps to Heaven: 666

## Reinterpreting 666

Previous lesson: 666 as warning about incompleteness.
This lesson: 666 as map of the journey.

## The Three Sixes as Stages

**First 6** — Mastery of Body
- Physical discipline
- Health and vitality
- Material competence

**Second 6** — Mastery of Soul
- Emotional regulation
- Social intelligence
- Psychological maturity

**Third 6** — Mastery of Spirit
- Intellectual development
- Abstract thinking
- Philosophical understanding

## Why Six, Not Seven?

You cannot skip to seven. You must complete each six first.

Many try to be "spiritual" without physical and psychological foundation. This fails.

## The Sequence Matters

Wrong order:
- Spiritual bypassing (ignoring body and emotions)
- Intellectual pride (knowledge without wisdom)
- Material obsession (body without soul or spirit)

Right order:
- Body → Soul → Spirit
- Concrete → Abstract → Transcendent
- 6 → 66 → 666 → 7

## Heaven as Level Seven

After completing all three sixes, seventh level becomes accessible.

**666 + 1 = 667** — but in this system, after 666 comes 7.

The beast becomes fully human becomes divine.

## Practical Implication

Don't despise any level. Each must be mastered in turn.

The path to heaven passes through complete earthly development.`
  },
  {
    order: 13,
    title: 'The Sixth Human Level',
    description: 'The transition from external law to internal law.',
    duration: 25,
    content: `# The Sixth Human Level

## Levels of Human Development

Human development proceeds through levels:

1. **Survival** — meeting basic needs
2. **Safety** — establishing security
3. **Belonging** — joining community
4. **Esteem** — gaining recognition
5. **Understanding** — knowing how things work
6. **Autonomy** — internal law replaces external law

## The Transition at Level Six

Levels 1-5: External authority tells you what to do.
Level 6: You determine your own law.

## External Law vs Internal Law

**External Law**
- Rules imposed from outside
- Enforced by punishment/reward
- Requires supervision
- Creates dependence

**Internal Law**
- Principles chosen from within
- Enforced by conscience
- Self-supervising
- Creates independence

## The Danger of Level Six

Level Six is powerful but dangerous:
- You can choose wrong principles
- No external correction
- Full responsibility

This is why 6 can be "beastly" — autonomous evil is worst evil.

## The Path to Level Seven

Level 6 autonomy must align with truth to become Level 7.

**Level 7** = Autonomy aligned with universal truth = Wisdom

## Practical Test

Ask yourself:
- Do I follow rules because I'll be punished?
- Or because I understand they're right?

The answer reveals your level.`
  },
  {
    order: 14,
    title: 'How Consciousness Creates the World',
    description: 'The act of primary distinction. The triad: Being, Consciousness, and the Act of Distinction.',
    duration: 20,
    content: `# How Consciousness Creates the World

## The Primacy of Consciousness

What comes first — the world or awareness of the world?

Philosophical answer: Neither makes sense without the other.

## The Act of Primary Distinction

Before any knowledge:
1. There must be something to know (Being)
2. There must be knower (Consciousness)
3. There must be difference between them (Distinction)

## The Fundamental Triad

**Being** — that which is
**Consciousness** — that which knows
**Distinction** — that which separates knower from known

These three arise together. None exists without the others.

## Creating Through Distinguishing

Consciousness creates by distinguishing:
- "This, not that"
- "Here, not there"
- "Now, not then"

Each distinction creates a world.

## The World as Distinction

What we call "the world" is sum of all distinctions consciousness has made.

Different consciousness = different distinctions = different world.

## Implications

1. Reality is not fixed — it's created by acts of distinction
2. Change your distinctions, change your world
3. Consciousness is not passive receiver but active creator

## The Deep Truth

You don't discover the world — you create it through attention.

Where you look is what exists for you.`
  },
  {
    order: 15,
    title: 'A Theory of Everything',
    description: 'A philosophical hypothesis about the fundamental nature of reality beyond space.',
    duration: 25,
    content: `# A Theory of Everything

## The Quest

Physics seeks "theory of everything" — single framework explaining all phenomena.

Philosophy already has one.

## The Problem with Space

Physics assumes space exists. But what is space?

Space = relationship between objects. No objects = no space.

## Beyond Space

If space is relationship, what exists before relationship?

**Pure potential** — unmanifested possibility.

## The Philosophical Theory

1. **Foundation**: Undifferentiated consciousness (no distinctions)
2. **First act**: Primary distinction (self/other)
3. **Result**: Space and time emerge as structure of distinctions

## How Everything Emerges

From primary distinction:
- **Space** = Structure of simultaneous distinctions
- **Time** = Structure of sequential distinctions
- **Matter** = Stable patterns of distinction
- **Energy** = Changing patterns of distinction

## The Unity Behind Multiplicity

All things are modifications of one consciousness making distinctions.

Physics studies the patterns. Philosophy studies the source.

## Practical Significance

If reality emerges from consciousness:
- Mind is fundamental, not matter
- Meaning is built into existence
- Understanding changes reality

## The Deepest Truth

There is only one thing — consciousness.
Everything else is how it appears to itself.`
  },
  {
    order: 16,
    title: 'Minus-Space',
    description: 'Abstraction as the substance of the world.',
    duration: 20,
    content: `# Minus-Space

## The Concept of Minus-Space

**Minus-Space** = Reality before spatial distinctions.

Not empty space. Not full space. The source from which space emerges.

## Abstraction as Substance

Usually we think: concrete is real, abstract is not.

Reverse this: Abstract is fundamental, concrete is appearance.

## The Logic

1. Concrete objects exist in space
2. Space is type of relationship  
3. Relationships require things to relate
4. But things require space to exist in
5. Circular! Neither is truly first.

**Solution**: Both emerge from neither — from minus-space.

## Minus-Space and Consciousness

Minus-space is not nothing. It is consciousness before it has made distinctions.

Pure awareness, undivided.

## Mathematics as Map of Minus-Space

Mathematical objects (numbers, sets, structures) exist in minus-space.

They have no location in physical space, yet they're real.

## Why This Matters

If abstraction is fundamental:
- Ideas are more real than things
- Understanding precedes experience
- Philosophy precedes physics

## The Practical Point

Don't dismiss abstract thinking as "unreal."

The abstract is the source of the real.

Learn to dwell in minus-space through mathematical and philosophical contemplation.`
  },
  {
    order: 17,
    title: 'The Human Path Through Abstraction',
    description: 'A synthesis of all lessons: from the capacity to distinguish to the comprehension of unity.',
    duration: 30,
    content: `# The Human Path Through Abstraction

## The Journey We've Taken

From Lesson 1 to Lesson 17, we traced the path of human understanding.

## The Beginning: Terms and Definitions

We learned: Knowledge starts with distinguishing and naming.
- Observation → Description → Definition → Term

## The Tools: Counting and Formulas

We gained tools for precise thinking:
- Numbers capture quantity
- Formulas capture relationships

## The Method: Abstraction and Rules

We understood how mind works:
- Abstract thinking transcends particular cases
- Rules enable consistent action

## The Context: Human Activity and Economics

We placed thinking in human life:
- Action is purposeful
- Resources are scarce
- Cooperation requires rules

## The Mechanism: Cognitive Resonance

We discovered how understanding happens:
- Not by transmission but by resonance
- Prepared mind receives insight

## The Depths: Creation and Consciousness

We explored foundations:
- Reality emerges through distinction
- Consciousness is primary

## The Heights: Beyond Space

We glimpsed what lies beyond:
- Minus-space as source
- Abstraction as substance

## The Synthesis

The human path:
1. **Distinguish** (Lessons 1-3)
2. **Abstract** (Lessons 4-6)
3. **Resonate** (Lessons 7-8)
4. **Contemplate** (Lessons 9-12)
5. **Transform** (Lessons 13-14)
6. **Transcend** (Lessons 15-16)
7. **Integrate** (Lesson 17)

## The End That Is Beginning

This course ends, but your journey continues.

You now have maps. The territory awaits.

**Go forth and think!**`
  }
]

export async function POST() {
  try {
    console.log('Starting full content seed...')
    await prisma.$connect()

    // Create or get course
    let course = await prisma.course.findFirst()
    
    if (!course) {
      course = await prisma.course.create({
        data: {
          id: 'main-course',
          title: 'Algorithms of Thinking and Cognition',
          description: 'A Philosophical Course for the Development of Critical Thinking',
          price: 30,
          currency: 'USD',
          published: true,
        }
      })
    }

    let created = 0
    let updated = 0
    const errors: string[] = []

    for (const lessonData of LESSONS_FULL_CONTENT) {
      try {
        // Check if lesson exists
        const existing = await prisma.lesson.findFirst({
          where: {
            courseId: course.id,
            order: lessonData.order,
          }
        })

        if (existing) {
          // Update existing lesson with full content
          await prisma.lesson.update({
            where: { id: existing.id },
            data: {
              title: lessonData.title,
              description: lessonData.description,
              content: lessonData.content,
              duration: lessonData.duration,
              published: lessonData.order <= 8,
            }
          })
          updated++
        } else {
          // Create new lesson
          await prisma.lesson.create({
            data: {
              courseId: course.id,
              order: lessonData.order,
              title: lessonData.title,
              description: lessonData.description,
              content: lessonData.content,
              duration: lessonData.duration,
              published: lessonData.order <= 8,
            }
          })
          created++
        }
      } catch (err) {
        errors.push(`Lesson ${lessonData.order}: ${String(err)}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seed complete: ${created} created, ${updated} updated`,
      created,
      updated,
      total: LESSONS_FULL_CONTENT.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      error: 'Seed failed', 
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    await prisma.$connect()
    const courseCount = await prisma.course.count()
    const lessonCount = await prisma.lesson.count()
    
    return NextResponse.json({ 
      message: 'POST to seed with full content',
      lessonsInSeed: LESSONS_FULL_CONTENT.length,
      currentCourses: courseCount,
      currentLessons: lessonCount,
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
