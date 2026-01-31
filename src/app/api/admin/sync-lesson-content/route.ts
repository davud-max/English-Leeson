import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Полный текст слайдов для каждого урока
// Формат: текст слайдов разделён через ---

const LESSON_CONTENTS: Record<number, string> = {
  1: `Good day and welcome to the lesson. Today we'll explore how knowledge is born. How observation transforms into words, and words become tools of thinking. The journey from seeing to understanding. From concrete reality to abstract concepts.
---
Everything begins with observation. Observable phenomena must be described in words so the listener understands exactly what you observed. Shortest description we'll call definition. Definition equals shortest description of observable phenomenon, sufficient for understanding by another person. Definition is assigned a term. Term equals word assigned to definition for convenience of use. Every term, except ultimate term, has its definition. Ultimate term equals term having no definition.
---
Point is an ultimate term. Point has no definition because point cannot be observed. It is zero-dimensional or, as they say, has no measure, no dimension. Point left by chalk on board or pencil on paper is actually not a point, but a spot. Line is an ultimate term of first level, that is, it is one-dimensional. It can be described using point. They say line consists of multitude of points. But describing order of arrangement of these points is impossible, because have to say these are points arranged along line, which is incorrect. Therefore line has no definition.
---
Plane is an ultimate term of second level, that is, it is two-dimensional. It can be described using point and line. They say plane consists of multitude of parallel lines. But describing order of their arrangement is impossible. Plane is unobservable, because lines of which it consists are also unobservable. Space is an ultimate term of third level, that is, it is three-dimensional. It can be described using point, line and plane. Space is unobservable, because planes of which it consists are also unobservable.
---
These four ultimate terms allow building descriptions and definitions of any abstract objects. Point has zero dimensions. Line has one dimension. Plane has two dimensions. Space has three dimensions. Since every abstract object is nothing, it can be described by finite number of ultimate terms composing it. After all, there are only four of them. Or even just one ultimate term, point. Key distinction: Abstract object can be described completely and finally. Real object cannot.
---
Real object cannot be described completely, but can be directly demonstrated and designated by word. This word is a noun, a name. Name equals word for real object. Can point with finger. Cannot describe completely. Abstract object cannot be demonstrated. It doesn't exist. But can be described using ultimate terms. Term equals word for abstract object. Cannot show. Can describe completely through definition. We demonstrated path: How abstract object having only term make into noun.
---
Can demonstrate reverse path? Can noun transition to term and through this to abstraction? Can. For child initially name apple is only this specific red apple. If shown different apple, for example green, then comparing with first and finding difference, child won't accept it as apple. For child this is not apple. This is something else. Only after some time from experience of communication child understands there are multitude of objects which, however they differ, are still called apples. Child forms image of apple in general, an abstraction.
---
We traced two opposite movements: From abstraction to reality and from reality to abstraction. From reality to abstraction means observe, describe, give definition, assign term. From abstraction to reality means take term, seek suitable objects in world. Essence of education is ability to move freely in both directions. This is what we must teach child. Fundament of thinking is ability to see invisible behind visible and find visible embodiment of invisible ideas!`,

  2: `You taught the child and yourself to observe, describe, build definitions and assign terms. What's next? Next we'll learn to count. Of course, you know how to count. But to teach this to the child, you need to understand and remember yourself what this means. And then learn to explain it. But first, there must be a need for counting. Otherwise it's hard to explain why spend time and effort on this procedure. Try to clearly explain to yourself how the need for counting arose. Then compare with what we'll cover now.
---
So, where did we stop? We had a drawing: circle, chords, radii, diameters. Child already knows what circle, chord, radius, diameter are. Now ask: are there identical terms in the drawing? At first it seems there are none. But then they distinguish: here are chords, here are segments, here are radii, here are points. Set of identical terms forms a group. And immediately new question arises: how many are in the group? How to convey information about quantity to another person? That is, how to describe quantity?
---
Put three pencils on the table. If person is nearby, you just point and they see how many. But if you went outside and were asked: How many pencils were on the table? You need to describe their quantity. And for this they need to be counted. In word count, co is prefix, unt is root. In old times word cheta meant pair. That is, counted by pairs, by two. So many pairs. At first glance, nothing complicated. Everyone knows how to count. But is it really so?
---
Put three pencils in front of child and ask to count them. Most likely, they'll immediately say: Three. But ask them to actually count. Count exactly these pencils. They'll start, pointing finger at each: One, two, three. As soon as they point at third pencil and say three, lift this pencil and ask: How many is this? They'll say: One. But why just now they said it was three? Let them count again. They'll start: One, two, three. As soon as they point at second pencil and say two, stop them. Lift this second pencil and ask: How many is this? They'll say: One. But why before they said it was two?
---
But remember how your baby learned to walk. You didn't yell at them when nothing worked out. You helped again and again, comforting after each failure. And how you rejoiced at first independent step! You didn't hide this joy. And baby felt it, and strained to take another step. Let your child now be ten years old, fifteen. They are still the same baby. They still need your comfort and your joy for their success.
---
What is counting then? Show one pencil and say: This is one pencil. Ask: which word here is extra? Good if child guesses: word one. Pencil is already singular. Adding that it's one is unnecessary. Now lift three pencils and say: These are pencils. Then lift five: And these are pencils. But quantities in first and second cases are different. If we say pencils, plural, then need to describe their quantity. Description of quantity is counting.
---
But description of quantity of what and where? Take three pencils, two pens and one marker. Ask: how many pencils here? Child answers: Three. How many pens? Two. How many markers? One. How many items total? Six! Why each time different answers? Because spoke about different names: first pencils, then pens, then markers, and finally items. Set of identically named items is called group. Unification of identically named items is grouping. Description of quantity of items in group is counting.
---
Term denoting result of counting is numeral. Symbol denoting numeral is digit. Need to add: there are countable and uncountable groups. Uncountable, for example, stars in sky or leaves in forest. We say about them many, but don't count individually. How to describe quantity of units in countable group? Simplest way is counting on fingers.
---
When your child was three years old, they knew how to count on fingers. Check if they forgot how it's done. Put three pencils in front and ask to count them on fingers. They'll probably start bending fingers and saying: One, two. Stop them. They're counting fingers, but need to count pencils. They'll start pointing at pencils with finger, saying: One, two. Stop again. They're counting with fingers, but need on fingers. Child is confused. Remind: on fingers count those who don't know numerals yet. That is, silently. Put aside one pencil, bend one finger. Put aside another pencil, bend another finger. Until get group of fingers equal to countable group. This we demonstrate, saying: This many!
---
How many can count on fingers of one hand? Five. Can more? Can. How? Child puzzled? Help. Hint: thumb marked phalanges of four remaining fingers. Resulting quantity was called dozen. Today this is twelve. Twelve hours on clock face, twelve months in year. All from dozen. On fingers of two hands? Child will say: twenty-four. That is, two dozens. But in old times could count on two hands up to five dozens. On one hand counted dozen, on other bent one finger. Another dozen, another finger. Five dozens called copeck. Today this quantity is sixty.
---
In old times sexagesimal system was widespread. It remained on clocks: sixty seconds is minute, sixty minutes is hour. Sixtieth part of whole was called copeck, from word cope. Maybe that's why hundredth part of ruble is still called copeck. Can more than copeck? Can. Let child guess. If can't, hint: dozen counted on one hand, mark on second not whole finger, but phalanx. Get dozen dozens. This was called gross. Today this is one hundred forty-four. And there was dozen grosses, mass. This is one thousand seven hundred twenty-eight.
---
But in school haven't counted on fingers for long. Remember first grade. Counted with counting sticks. Notice: counted not sticks, but with sticks. How? Children, picture has many birds. Count them. Count like this: one bird, put aside one stick. Another bird, put aside another stick. And so, until count all. Now, show how many birds total? Right, as many as you have sticks. Sticks you can take and show mom. And mom will know how many birds there were. To count means to describe quantity of units in given group.
---
But what if units very many? Imagine: father sent son to count sheep in flock. And son brought whole bag of sticks, three thousand four hundred fifty-seven pieces. For this case first-grader's kit has sticks of different colors. Ten white sticks denote one red. Ten red, one blue. Ten blue, one black. So son should bring father only three black sticks, four blue, five red and seven white. Just need to remember colors. True, if on way dropped one black stick, mistaken by thousand sheep. And if make notches on board? Ten notches, one cross. Ten crosses. And here appear digits, Roman for example, symbols denoting quantity of identically named objects in group.
---
Today for describing result of counting we use not sticks, but numerals. Numerals are terms denoting quantity of units in groups. Without term group, numeral has no meaning. Numerals can be denoted by symbols, digits. Group and numeral can be represented. But number, as mathematical term, cannot be represented. Try to represent number five. You won't succeed. Symbol five is not number, this is digit. Can write it as Roman five. If you represented five items, this is group of items, not number. But you can perform operations on numbers, count with numbers, and result write with digits or numerals.
---
Child first learns to group identically named items. Then distinguish groups by quantity. Then memorizes names of quantities, numerals. For example, today learn to recognize groups of three items. On table three pencils, this is group. Find in room more groups of three. Right: three flowers in vase, three bogatyrs in picture, three chairs. Numbers describing quantity of units in group are called natural numbers. In nature we don't observe three and half sparrows or minus six horses. Natural numbers are all positive integers from one to infinity. Like Roman digits: all positive, integers, and no zero. Automatic recognition of groups by quantity and memorizing numerals needs time and effort. Try quickly learn to count in German or Japanese. Not just recite numerals in order, but instantly answer how many items shown. So main thing, don't rush. After all your baby already knows how to count. And to question How old are you? proudly shows three fingers.`,

  3: `Good day! Today we will learn how to perform operations on quantities. Having mastered counting, we move to the next level, working with numbers as abstractions. Addition, subtraction, multiplication, division, these are not just mechanical procedures. They are tools of thinking that allow modeling reality and predicting results.
---
Let's start with addition. What does it mean to add? We have two groups of identical items. Pencils here and pencils there. To add means to unite them into one group and describe the quantity of the new group. Three pencils plus two pencils equals five pencils. Note: we can only add identical items! Adding three pencils and two apples gives us five items, not five pencils or five apples.
---
Subtraction is the reverse operation. From a large group, we separate a smaller group. Five pencils minus two pencils equals three pencils. But attention! We cannot subtract more than we have. Five minus seven has no meaning in the world of real objects. Later, mathematicians invented negative numbers, but in the real world, you cannot have minus two apples.
---
Multiplication is repeated addition. Three times four means three added four times, which equals twelve. But there's a deeper meaning. Multiplication describes the area of a rectangle. Three rows of four items each gives twelve items total. This is why multiplication is so useful in real life.
---
Division is distributing a group into equal parts. Twelve items divided by three equals four items in each group. But what if division doesn't come out evenly? Thirteen divided by three? Four in each group with one remaining. This remainder is important, it shows the limits of even division.
---
Now let's connect these operations. The order matters! Three plus two times four. Do we add first or multiply first? Mathematicians agreed: multiplication and division come before addition and subtraction. So three plus two times four equals three plus eight equals eleven. Not twenty.
---
Parentheses change the order. Three plus two, all times four, equals five times four equals twenty. Parentheses are a way to say: do this first. They are essential for clear communication of mathematical ideas.
---
Fractions extend our number system. What is one half? It's one whole divided into two equal parts, and we take one part. Fractions allow us to describe quantities between whole numbers. Three and one half pencils? Impossible in reality, but useful in calculations.
---
The key insight: mathematical operations are abstractions. They model reality but go beyond it. We can calculate with fractions, negative numbers, even imaginary numbers. These don't exist in the physical world, but they help us solve real problems. This is the power of abstraction!`,

  4: `Every living creature obtains food, defends itself, cares for offspring, and acts. Actions are based on instincts and reflexes. This is the world of the beast. The beast cannot change the goals that nature sets before it. It cannot act purposefully. Human differs by a unique quality: the ability to form new goals. And to achieve a new goal, new actions are needed. These are already purposeful actions. Where does this ability come from? It arose thanks to the ability to abstract, to distinguish, to differentiate something outside oneself. What is distinguished begins to exist for a person.
---
It may seem that animals can do this too. A squirrel sees a nut, a fox sees a rabbit. But we don't know if a squirrel can imagine a nut in its absence. Was there a goal to pick the nut, or did it simply obey instinct? Scientists believe: for the beast, neither the external world nor itself exists. Everything is a unified system of signals and reactions.
---
And what about humans? At first, nothing existed for humans either. Everything was unified, whole, let's call this being. Using the ability to abstract, humans learned to distinguish parts from being. They began to differentiate them. Definition: The process of distinguishing and differentiating a part of being is called abstraction. A part of being perceived as a separate whole is called an abstraction. What is distinguished begins to exist!
---
What did humans distinguish first? First, the physical world, what can be sensed. Second, nothingness, what lies beyond its boundaries. Third, themselves, the observer. Without nothing one cannot imagine the boundaries of something! Further, humans divide the physical world into parts: sun, sky, water. Later they unite homogeneous parts into a higher-order abstraction, being. For example, from many apples arises the image of apple in general.
---
Each abstraction is assigned a sign by humans: a sound, a gesture, a symbol. Signs plus abstractions equal knowledge. Definition: Knowledge is an abstraction translated into sign form. Operating with knowledge, humans build models of events and actions. They begin to think. Thinking is operations on abstractions.
---
Observing the world, humans divide it into many beings. How to describe them? Let's recall the lesson about the circle. If ten people describe the same thing, they will give ten different but correct descriptions. But if you ask them to give the shortest description? It will be the same for everyone! This shortest description is the definition. It is unique. And it can be assigned a word, a term. This is how our mind worked when we defined: circle, chord, diameter.
---
If we follow this logic, then the term human should also have a definition. Let's try: Human equals a being possessing the ability to abstract. This is the main difference from the beast! Beast uses instincts leading to actions. Human uses abstraction leading to goals leading to actions.
---
Constant practice of working with definitions and terms develops a new quality, the ability to act according to rules. Let's call this literacy. Literacy equals action by rules. A literate person speaks briefly and precisely, uses terms. An illiterate person is forced to give lengthy descriptions.
---
Between objects and phenomena there are connections. They can also be described with signs. Distance divided by time equals speed. Concept equals a term denoting the connection between quantities or phenomena. The library of knowledge contains all terms and concepts. Operating with them, humans can model a state better than the present. This model becomes a thought. If a person begins to act, the thought becomes a goal.
---
Goal equals abstract model of desired state. To achieve it, new actions are needed, purposeful ones. This means humans are beings capable of acting purposefully. In this area, they are free from instincts! But how to achieve a goal? Method one: trial and error. Method two: build models, choose best, this is analysis. Rule equals result of analysis, sequence of actions leading to goal.
---
Repeated application of a rule forms a skill, an action brought to automatism. Perfecting skills in using knowledge, humans create language, speech appears. And with it, the possibility of cooperation, coordinated activity for a common goal. We have traced the path: Abstraction leads to knowledge leads to thinking leads to goal leads to rule. This is the path of becoming a thinking human, an acting human. But is this enough for activity to be human? No. Because there is also violence. And there is law. To be continued.`,

  5: `Good day! In the last lesson, we discovered that the unique human ability, to abstract, leads to the formation of goals and action according to rules, the main one being the prohibition of violence. Today we move from theory to practice. We will answer the question: what is activity worthy of a human being? How to distinguish genuinely human activity that creates goods from predatory imitation that leads to decline?
---
Part One: The Essence of Human Activity. A goal is born from anxiety, from the desire to improve one's situation. But a human, unlike a beast, cannot use violence against another person to achieve a goal. This is taboo. Human activity equals achieving goals without using violence. To achieve goals, resources and energy are needed. In the human context, resources used to achieve a goal are called goods. Goods are limited. Therefore, a double task arises: How to obtain necessary goods? How to distribute them among competing goals?
---
Part Two: Praxeology and Economics, The Science of Action. The theory describing optimal ways to achieve formed goals is called praxeology, the science of activity. Its core is analysis, searching for paths to the goal within rules. Praxeology equals science of human action. Economics equals obtaining and distributing goods. The most important part of praxeology, dealing precisely with questions of obtaining and distributing goods, is economics. Definition: Economics in its original sense is human activity aimed at obtaining goods and distributing them among goals by rank of importance. Note: forming goals themselves is the domain of psychology. Economics begins when the goal already exists and a non-violent way to provide it with resources must be found.
---
Part Three: Ethical Limits and Experience. Before acting, a person evaluates not only effectiveness but also reputational risks. Violating informal rules of cooperation threatens loss of trust, and therefore future goods. Ethics equals spontaneously formed rules of non-violent interaction. But what if modeling a path to the goal fails? Then a person can act spontaneously, by trial and error. Experience equals result of unintentional actions, positive or bitter. Gaining experience is often associated with risk and resembles a sacrifice on the altar of knowledge.
---
Part Four: Economics as the Science of Uncertainty. How does economic science fundamentally differ from physics? A physicist discovers objective laws that don't depend on opinion. Gravity acts on everyone equally. An economist deals with private evaluative judgments of people that constantly change. It would seem building a general theory is impossible. The solution was found by analogy with gas physics. You can't track each molecule, but you can identify statistical regularities in the behavior of many. So in economics: we rely on basic postulates true for most. A person prefers more goods to less. A present good is valued more than a future one. Key difference: economic postulates are relative, not absolute. Economic theory works with uncertainty, striving to reduce it but unable to eliminate it completely. Any theory promising complete certainty in economics is false, it's an intellectual perpetual motion machine!
---
Part Five: Substitution and Imitation. Human activity based on voluntary cooperation and rejection of violence produces phenomenal growth in well-being. Violent activity, robbery, deception, fraud, gives only temporary private gain, undermining the basis of cooperation and leading to decline. Therefore, violators are forced to mimic. They create an imitation of human activity. Honest person has business, imitator has so-called business. Honest person earns profit, imitator takes loot. Honest person works, imitator robs. Honest person gives charity, imitator creates fake charity. Recognizing this imitation is a vital skill! Its metastases, penetrating the body of society under plausible pretexts like fair redistribution or fighting for something, lead to crises, famine, and wars.
---
Part Six: Call to Literacy. How to learn to recognize imitation? Return to basics. Be honest with yourself. Accept conclusions of formal logic. Use quantitative analysis. Master mathematics at the level of understanding relationships between quantities and formulas. Economic science, in the words of Ludwig von Mises, cannot remain an esoteric branch of knowledge. It concerns everyone and belongs to all. It is the main and true business of every citizen. Just as we find time for personal hygiene, we must find time for hygiene of thinking, to verify whether we're dealing with human activity or its dangerous imitation.
---
Cycle Summary: We have traveled the full path! From the act of distinction to the highest social laws. Algorithm of thinking: Perception leads to distinction leads to term leads to quantity leads to formula. Foundation of society: Ability to abstract leads to knowledge leads to rules leads to prohibition of violence leads to law. Criterion of activity: Goal plus non-violent action equals human activity. Imitation equals violence. Armed with this understanding, you receive not just knowledge, but a coordinate system for navigating the complex world of ideas, actions, and social institutions. You can distinguish a creative rule from a destructive one, law from arbitrariness, true economics from a predatory scheme. This is the goal of true education, not to fill the head with facts, but to give a tool for independently building a consistent picture of the world. Thank you for traveling this path together!`,

  6: `So, we have a person who thinks, sets goals, and acts according to rules. But they are not alone! Language, born from signs for abstractions, allows something completely new, exchanging knowledge. People begin to communicate. And communication leads to the possibility of making agreements, uniting in groups, and acting together for a common goal. Thus, the ability to abstract gave rise to society. Communication equals exchange of knowledge. Society equals group united by shared information field.
---
But what happens when people begin to interact? Conflicts arise. The most terrible of them is violence, the use of force against another person. Force can deprive a person of freedom, right to act by their own rules, and property. Violence destroys the very foundation of cooperation. Over millennia of spontaneous selection between different groups, the main, saving rule crystallized, the prohibition of violence. Law equals formal prohibition on the use of violence against a person. This is not a rule someone invented and introduced. It was discovered, like a law of physics. It is formal, it makes no distinctions by skin color, gender, or age.
---
But if violence is prohibited, how to defend against those who still use it? The answer is in the definition itself: what's prohibited is violence, the use of force against a person, not force itself. Force can and should be used against violence. Defense equals use of force against violence. Organized force protection of a person from violence is politics. And society protected by such politics is called civilization. From Latin civilis, meaning fenced, protected. Defense leads to politics leads to civilization.
---
Do all people equally understand against whom violence cannot be used? History shows: no. Humanity develops in leaps, transitioning from one level to another. Each level is a new circle of people whom a person recognizes as their own, protected by law. Family level: my own equals only my family members. Tribe level: my own equals entire tribe. Nation level: my own equals all who speak my language, share my blood. Civil society level: my own equals any person who has rejected violence. Each of us in childhood passes through these levels, and our upbringing is a purposeful ascent to a higher level.
---
Conflict between people from different levels is a civilizational conflict. For a person at the tribe level, a representative of another tribe is not a person, violence can be used against them. For a person at the nation level, both tribes are their own, and violence is unacceptable. Their collision is a clash of different rules for distinguishing human from not human. Human equals a being that distinguishes another human and recognizes their rights, freedom, and property. This is how the modern concept of human is refined!
---
Let's return to our thinking person. They are troubled by uncertainty, threats, lack of something. To relieve anxiety, they build a mental model of a better state, a goal. But to achieve the goal, resources are needed, sources of energy. Resources used for a goal are goods. And goods are always insufficient. Double task: How to obtain goods? How to distribute them among competing goals? At the same time, actions must remain within the law, be non-violent. Goal plus goods plus law equals human activity.
---
Thus, a strict definition is born: Human activity equals activity aimed at achieving formed goals without using violence. Here is its core: Goal leads to analysis of options, which is praxeology, leads to action by rules without violence, leads to human activity.
---
Before acting, a person evaluates not only effectiveness but also reputational risks. Spoiling relationships with others is too high a price. Thus, rules of non-violent interaction are spontaneously born, ethics. Ethics equals rules regulating non-violent interaction between people. And if goals exist but how to achieve them is unclear? No knowledge to build a model? Then a person can act spontaneously, unintentionally. Experience equals connection between objects or phenomena obtained through unintentional actions. Gaining experience is a sacrifice, a risk in the name of knowledge.
---
Now let's put it all together. The science of human activity as a whole is praxeology. And its key part, studying methods of obtaining and distributing limited goods for achieving goals, is economics. Economics equals human activity aimed at obtaining goods and distributing them among goals by rank of importance. Praxeology, the science of action, contains economics, which deals with goods and distribution.
---
How does economics differ from, say, physics? In physics, connections are objective and don't depend on our opinion. In economics, everything is based on private evaluative judgments of people that constantly change. How to build theory in such uncertainty? Economics finds regularities, what's true for most people in most cases. A person prefers to be healthy and rich rather than sick and poor. A good today is more valuable than the same good in uncertain future. A person strives to get desired with minimum costs. But in economics there are no universal formulas. Formulas here are always agreements between people about what to consider a standard and how to calculate within a specific deal.
---
Human activity based on voluntary cooperation gives phenomenal growth in well-being. Violence leads to decline. Therefore, those who use violence, thieves, fraudsters, robbers, disguise themselves. They create an imitation of human activity. Real has business, imitation has fake business. Real earns profit, imitation takes loot. Real works, imitation robs. Real provides services, imitation provides fake services. Recognizing this imitation is difficult. Outwardly everything is decent: politeness, documents, environmental care. But inside, emptiness and violence. This emptiness devours society, leading to crises.
---
Learning to see this difference is the main practical goal of our course. For this you need: Be honest with yourself. Accept conclusions of formal logic. Use only your own reason for analysis. Master quantitative analysis at seventh-grade math level. As economist Ludwig von Mises said: Economics is the main and true business of every citizen. For this business, as for daily hygiene, it's worth finding time and energy. Because only this way can we protect the genuinely human world, built on abstractions, rules, and voluntary cooperation. Abstractions plus rules plus cooperation equals human world.`
};

// POST /api/admin/sync-lesson-content - синхронизировать контент уроков
export async function POST(request: Request) {
  try {
    const results: { lesson: number; status: string; contentLength?: number }[] = [];

    // Получаем все уроки из базы данных
    const lessons = await prisma.lesson.findMany({
      orderBy: { order: 'asc' },
    });

    for (const lesson of lessons) {
      const lessonNumber = lesson.order;
      const newContent = LESSON_CONTENTS[lessonNumber];

      if (newContent) {
        // Обновляем контент урока
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: { content: newContent },
        });

        results.push({
          lesson: lessonNumber,
          status: 'updated',
          contentLength: newContent.length,
        });
      } else {
        results.push({
          lesson: lessonNumber,
          status: 'no content available',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synchronized ${results.filter(r => r.status === 'updated').length} lessons`,
      results,
    });
  } catch (error) {
    console.error('Error syncing lesson content:', error);
    return NextResponse.json(
      { error: 'Failed to sync lesson content: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/admin/sync-lesson-content - получить статус контента
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        title: true,
        content: true,
      },
    });

    const status = lessons.map(lesson => ({
      lesson: lesson.order,
      title: lesson.title,
      hasContent: !!lesson.content && lesson.content.length > 100,
      contentLength: lesson.content?.length || 0,
      availableContent: !!LESSON_CONTENTS[lesson.order],
      availableContentLength: LESSON_CONTENTS[lesson.order]?.length || 0,
    }));

    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
