import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const LESSON_1_CONTENT = `# 🎯 Terms and Definitions

🧠 **How precise knowledge is born**. How observation is transformed into a word, and a word into an instrument of thought.

## 🔍 From Observation to Term

### 📌 Part 1. Observation and Description

👁️ **Everything begins with observation**. What is observed must be described in words in such a way that the listener understands precisely what has been observed.

📝 The shortest possible description will be called a **definition**.

> 📘 **DEFINITION**  
> The shortest description of what is observed, sufficient for understanding by another person.

🏷️ A **term** is assigned to a definition.

> 🏷️ **TERM**  
> A word assigned to a definition for ease of use.

📚 Every term, except a fundamental term, has a definition.

🔑 A **fundamental term** is a term that has no definition.

---

### 🌟 Part 2. Fundamental Terms

📍 **POINT** is a fundamental term. A point has no definition because it cannot be observed. It is zero-dimensional, or, as one says, has no measure or dimension.

> 📍 **POINT**  
> 🔑 Fundamental term  
> 0️⃣ 0 dimensions  
> 👻 Unobservable

✏️ A point drawn with chalk on a board or pencil on paper is not, in fact, a point, but a **spot** ⚫.

📏 **LINE** is a first-level fundamental term; that is, it is one-dimensional. It can be described using a point.

> 📏 **LINE**  
> 🔑 Fundamental term  
> 1️⃣ 1 dimension  
> ➡️ A point extended

🔗 It is said that a line consists of a set of points. However, it is impossible to describe the order of these points without circularity, since one must say that the points are arranged along a line, which is incorrect.

---

### 📐 Part 3. Plane and Space

📐 **PLANE** is a second-level fundamental term; that is, it is two-dimensional.

> 📐 **PLANE**  
> 🔑 Fundamental term  
> 2️⃣ 2 dimensions  
> ↔️ A line extended laterally

📋 It is said that a plane consists of many parallel lines. A plane is unobservable, since the lines of which it consists are also unobservable.

🌌 **SPACE** is a third-level fundamental term; that is, it is three-dimensional.

> 🌌 **SPACE**  
> 🔑 Fundamental term  
> 3️⃣ 3 dimensions  
> ↕️ A plane extended laterally

🌠 Space is unobservable, since the planes of which it consists are also unobservable.

---

### ⚡ Part 4. The Power of Fundamental Terms

These four fundamental terms allow us to construct descriptions and definitions of any abstract objects.

> 🔑 **THE FOUR FUNDAMENTAL TERMS**  
> 📍 Point — 0️⃣ 0 dimensions  
> 📏 Line — 1️⃣ 1 dimension  
> 📐 Plane — 2️⃣ 2 dimensions  
> 🌌 Space — 3️⃣ 3 dimensions

Since every abstract object is, in essence, nothing, it can be described by a finite number of fundamental terms.

> ⚖️ **KEY DISTINCTION**  
> 🎨 An abstract object can be described completely and definitively.  
> 🌍 A real object cannot.

🌏 A real object cannot be described by a finite number of named elements, since their number — down to the atomic level — is infinite.

---

### 🏷️ Part 5. Name and Term

Thus, every real object cannot be fully described, but it can be directly demonstrated and designated by a word.

> 🏷️ **NAME**  
> A word for a real object  
> 👉 Can be pointed to  
> ❌ Cannot be fully described

> 📘 **TERM**  
> A word for an abstract object  
> ❌ Cannot be pointed to  
> ✅ Can be fully described

🧩 An abstract object cannot be demonstrated. It does not exist. But it can be described using fundamental terms.

---

### 🔄 Part 6. Two Opposing Movements

We have demonstrated the path by which an abstract object becomes a noun. But is the reverse path possible?

🎯 Can a noun become a term and thereby an abstraction?

**✅ It can.**

#### 🚶 The Path from Reality to Abstraction

👶 For a child, the word "🍎 apple" initially refers only to **this particular red apple**.

🍏 If another apple is shown — for example, a green one — the child, comparing it with the first and noticing the difference, will not accept it as an apple. For the child, it is **not** an apple; it is something else.

⏳ Only over time, through experience and communication, does the child come to understand that there are many objects which, despite their differences, are still called apples.

#### 🌱 The Birth of Abstraction

🧠 The child forms an image of "**🍎 apple in general**" — an abstraction. By comparing with this abstraction, the child recognizes an observed object as an apple, even if encountering that type of apple for the first time.

✨ In this case, the word "apple" is no longer a name for the child, but a **term**.

---

## 📚 Lesson Summary

We have traced two opposing movements:

**🌍 From reality to abstraction**  
👁️ Observe → 📝 describe → 📘 define → 🏷️ assign a term

**🧠 From abstraction to reality**  
🏷️ Take a term → 🔍 search for corresponding objects in the world

> 🎓 **THE ESSENCE OF EDUCATION**  
> The ability to move freely in both directions is what we must teach a child. The development of the capacity to translate reality into images (abstractions) and images back into reality.

💭 This is the foundation of thinking: the ability to see the invisible behind the visible and to find visible embodiments of invisible ideas.`

export default function Lesson1Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Lesson 1 of 17</span>
              <Link href="/checkout" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Enroll Now - $30
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                Lesson 1
              </span>
              <span className="text-sm text-gray-500">⏱️ 40 minutes</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Terms and Definitions
            </h1>
            <p className="text-gray-600 text-lg">
              How knowledge is born. Fundamental terms: point, line, plane, space. Two opposing movements of thought.
            </p>
          </div>

          {/* Lesson Content */}
          <article className="bg-white rounded-lg shadow-sm p-8 prose prose-lg max-w-none
            prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
            prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:px-6
            prose-blockquote:not-italic prose-blockquote:font-medium
            prose-hr:my-8
          ">
            <ReactMarkdown>{LESSON_1_CONTENT}</ReactMarkdown>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              ← All Lessons
            </Link>
            <div className="flex gap-3">
              <Link href="/checkout" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
                Enroll to Continue
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Master Critical Thinking?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Get lifetime access to all 17 lessons for just $30
            </p>
            <Link href="/checkout" className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">
              Enroll Now - $30
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Algorithms of Thinking and Cognition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
