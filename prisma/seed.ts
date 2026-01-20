import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const LESSON_1_CONTENT = `# Terms and Definitions

How precise knowledge is born. How observation is transformed into a word, and a word into an instrument of thought.

## From Observation to Term

### Part 1. Observation and Description

Everything begins with observation. What is observed must be described in words in such a way that the listener understands precisely what has been observed.

The shortest possible description will be called a **definition**.

> **DEFINITION**  
> The shortest description of what is observed, sufficient for understanding by another person.

A **term** is assigned to a definition.

> **TERM**  
> A word assigned to a definition for ease of use.

Every term, except a fundamental term, has a definition.

A **fundamental term** is a term that has no definition.

---

### Part 2. Fundamental Terms

A **point** is a fundamental term. A point has no definition because it cannot be observed. It is zero-dimensional, or, as one says, has no measure or dimension.

> **POINT**  
> Fundamental term  
> 0 dimensions  
> Unobservable

A point drawn with chalk on a board or pencil on paper is not, in fact, a point, but a **spot**.

A **line** is a first-level fundamental term; that is, it is one-dimensional. It can be described using a point.

> **LINE**  
> Fundamental term  
> 1 dimension  
> A point extended

It is said that a line consists of a set of points. However, it is impossible to describe the order of these points without circularity, since one must say that the points are arranged along a line, which is incorrect.

---

### Part 3. Plane and Space

A **plane** is a second-level fundamental term; that is, it is two-dimensional.

> **PLANE**  
> Fundamental term  
> 2 dimensions  
> A line extended laterally

It is said that a plane consists of many parallel lines. A plane is unobservable, since the lines of which it consists are also unobservable.

**Space** is a third-level fundamental term; that is, it is three-dimensional.

> **SPACE**  
> Fundamental term  
> 3 dimensions  
> A plane extended laterally

Space is unobservable, since the planes of which it consists are also unobservable.

---

### Part 4. The Power of Fundamental Terms

These four fundamental terms allow us to construct descriptions and definitions of any abstract objects.

> **THE FOUR FUNDAMENTAL TERMS**  
> Point — 0 dimensions  
> Line — 1 dimension  
> Plane — 2 dimensions  
> Space — 3 dimensions

Since every abstract object is, in essence, nothing, it can be described by a finite number of fundamental terms.

> **KEY DISTINCTION**  
> An abstract object can be described completely and definitively.  
> A real object cannot.

A real object cannot be described by a finite number of named elements, since their number — down to the atomic level — is infinite.

---

### Part 5. Name and Term

Thus, every real object cannot be fully described, but it can be directly demonstrated and designated by a word.

> **NAME**  
> A word for a real object  
> Can be pointed to  
> Cannot be fully described

> **TERM**  
> A word for an abstract object  
> Cannot be pointed to  
> Can be fully described

An abstract object cannot be demonstrated. It does not exist. But it can be described using fundamental terms.

---

### Part 6. Two Opposing Movements

We have demonstrated the path by which an abstract object becomes a noun. But is the reverse path possible?

Can a noun become a term and thereby an abstraction?

**It can.**

#### The Path from Reality to Abstraction

For a child, the word "apple" initially refers only to **this particular red apple**.

If another apple is shown — for example, a green one — the child, comparing it with the first and noticing the difference, will not accept it as an apple. For the child, it is **not** an apple; it is something else.

Only over time, through experience and communication, does the child come to understand that there are many objects which, despite their differences, are still called apples.

#### The Birth of Abstraction

The child forms an image of "**apple in general**" — an abstraction. By comparing with this abstraction, the child recognizes an observed object as an apple, even if encountering that type of apple for the first time.

In this case, the word "apple" is no longer a name for the child, but a **term**.

---

## Lesson Summary

We have traced two opposing movements:

**From reality to abstraction**  
Observe → describe → define → assign a term

**From abstraction to reality**  
Take a term → search for corresponding objects in the world

> **THE ESSENCE OF EDUCATION**  
> The ability to move freely in both directions is what we must teach a child. The development of the capacity to translate reality into images (abstractions) and images back into reality.

This is the foundation of thinking: the ability to see the invisible behind the visible and to find visible embodiments of invisible ideas.`

const LESSON_DESCRIPTIONS = [
  { order: 1, title: 'Terms and Definitions', description: 'How knowledge is born. Fundamental terms: point, line, plane, space. Two opposing movements of thought.', duration: 40 },
  { order: 2, title: 'What Is Counting?', description: 'The origin of counting. Group, numeral, digit. Counting on fingers: dozen, score, gross. Natural numbers.', duration: 30 },
  { order: 3, title: 'What Is a Formula?', description: 'The emergence of the concept of a parameter. Relationships between quantities and formulae. The number π. The distinction between measurement and calculation.', duration: 30 },
  { order: 4, title: 'Abstraction and Rules', description: 'Human beings and thinking. Abstraction and knowledge. Literacy as rule-based action. The path from abstraction to goal.', duration: 25 },
  { order: 5, title: 'Human Activity: Praxeology, Economics, and Imitation', description: 'What kind of activity is worthy of a human being? How can creation be distinguished from imitation?', duration: 25 },
  { order: 6, title: 'Human Activity and Economics', description: 'From communication to law. Levels of civilization. Goals and goods. Ethics and experience. Economics as a science of human action.', duration: 25 },
  { order: 7, title: 'The Fair and the Coin: The Birth of Money and the Banking System', description: 'How money, markets, and banks emerged from the exchange of gifts between tribes.', duration: 25 },
  { order: 8, title: 'The Theory of Cognitive Resonance: A Phenomenological Model of Thinking', description: 'How does thought arise? Two circuits of consciousness and the mechanism of resonance.', duration: 25 },
  { order: 9, title: 'The Creation of the World: Biblical Cosmogony Through the Theory of Abstraction', description: 'Heaven and earth, water and light, firmament and observer — a philosophical analysis of the first chapter of Genesis.', duration: 20 },
  { order: 10, title: 'The Theory of Cognitive Resonance II', description: 'How we think. Continuation of the topic.', duration: 25 },
  { order: 11, title: 'The Number 666', description: 'A philosophical interpretation of the number of the Beast through the theory of abstraction.', duration: 20 },
  { order: 12, title: 'Three Steps to Heaven: 666', description: 'The number 666 as a formula of ascent.', duration: 22 },
  { order: 13, title: 'The Sixth Human Level: From the Letter of the Law to the Spirit', description: 'The transition from external law to internal law.', duration: 25 },
  { order: 14, title: 'How Consciousness Creates the World', description: 'The act of primary distinction. The triad: Being, Consciousness, and the Act of Distinction. The human being as a co-creator of reality.', duration: 20 },
  { order: 15, title: 'A Theory of Everything: Minus-Space and Resonant Tubes', description: 'A philosophical hypothesis about the fundamental nature of reality beyond space.', duration: 25 },
  { order: 16, title: 'Minus-Space', description: 'Abstraction as the substance of the world.', duration: 20 },
  { order: 17, title: 'The Human Path Through Abstraction to Truth', description: 'A synthesis of all lessons: from the capacity to distinguish to the comprehension of unity.', duration: 30 },
]

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create course
  const course = await prisma.course.upsert({
    where: { id: 'main-course' },
    update: {},
    create: {
      id: 'main-course',
      title: 'Algorithms of Thinking and Cognition',
      description: 'A Philosophical Course for the Development of Critical Thinking',
      price: 30,
      currency: 'USD',
      published: true,
    },
  })

  console.log('Course created:', course.title)

  // Create all lessons
  for (const lessonData of LESSON_DESCRIPTIONS) {
    const lesson = await prisma.lesson.upsert({
      where: {
        courseId_order: {
          courseId: course.id,
          order: lessonData.order,
        },
      },
      update: {},
      create: {
        courseId: course.id,
        order: lessonData.order,
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.order === 1 ? LESSON_1_CONTENT : `# ${lessonData.title}\n\nContent coming soon...`,
        duration: lessonData.duration,
        published: lessonData.order === 1, // Only lesson 1 is published initially
      },
    })

    console.log(`Lesson ${lessonData.order} created:`, lesson.title)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
