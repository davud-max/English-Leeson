#!/usr/bin/env python3
"""
Audio generation script for Lesson 4
Requires: pip install gtts

Run: python3 generate_audio.py
"""

from gtts import gTTS
import os

# Create output directory
output_dir = "public/audio/lesson4"
os.makedirs(output_dir, exist_ok=True)

slides = {
    1: """Every living creature obtains food, defends itself, cares for offspring — acts. Actions are based on instincts and reflexes. This is the world of the beast. The beast cannot change the goals that nature sets before it. It cannot act purposefully.

Human differs by a unique quality: the ability to form new goals. And to achieve a new goal, new actions are needed. These are already purposeful actions.

Where does this ability come from? It arose thanks to the ability to abstract — to distinguish, to differentiate something outside oneself. What is distinguished begins to exist for a person.""",

    2: """It may seem that animals can do this too. A squirrel sees a nut, a fox sees a rabbit. But we don't know if a squirrel can imagine a nut in its absence. Was there a goal to pick the nut, or did it simply obey instinct?

Scientists believe: for the beast, neither the external world nor itself exists. Everything is a unified system of signals and reactions.""",

    3: """And what about humans? At first, nothing existed for humans either. Everything was unified, whole — let's call this being. Using the ability to abstract, humans learned to distinguish parts from being. They began to differentiate them.

The process of distinguishing and differentiating a part of being is called abstraction.

A part of being perceived as a separate whole is called an abstraction.

What is distinguished begins to exist.""",

    4: """What did humans distinguish first? The physical world — what can be sensed. Nothingness — what lies beyond its boundaries. And themselves — the observer. Without 'nothing' one cannot imagine the boundaries of 'something'.

Further, humans divide the physical world into parts: sun, sky, water. Later they unite homogeneous parts into a higher-order abstraction — being. For example, from many apples arises the image of 'apple in general'.""",

    5: """Each abstraction is assigned a sign by humans — a sound, gesture, symbol. Signs and abstractions form knowledge.

Knowledge is an abstraction translated into sign form.

Operating with knowledge, humans build models of events and actions. They begin to think.

Thinking is operations on abstractions.""",

    6: """Observing the world, humans divide it into many beings. How to describe them? Let's recall the lesson about the circle. If ten people describe the same thing, they will give ten different but correct descriptions. But if you ask them to give the shortest description? It will be the same for everyone.

This shortest description is the definition. It is unique. And it can be assigned a word — a term.

This is how our mind worked when we defined circle, chord, diameter.""",

    7: """If we follow this logic, then the term 'human' should also have a definition. Let's try:

Human is a being possessing the ability to abstract.

This is the main difference from the beast.""",

    8: """Constant practice of working with definitions and terms develops a new quality — the ability to act according to rules. Let's call this literacy.

Literacy is action according to rules.

A literate person speaks briefly and precisely — uses terms. An illiterate person is forced to give lengthy descriptions.""",

    9: """Between objects and phenomena there are connections. They can also be described with signs. For example, the connection between distance traveled and time spent we describe with the concept of speed.

A concept is a term denoting the connection between quantities or phenomena.

The library of knowledge contains all terms and concepts. Operating with them, humans can model a state better than the present. This model becomes a thought. If a person begins to act, the thought becomes a goal.""",

    10: """A goal is an abstract model of the desired.

To achieve it, new actions are needed — purposeful ones. This means humans are beings capable of acting purposefully. In this area, they are free from instincts.

But how to achieve a goal? One can use trial and error. Or one can build models of actions and choose the best — apply analysis. The found sequence of actions is preserved as a rule.

A rule is the result of analysis, a sequence of actions leading to a goal.""",

    11: """Repeated application of a rule forms a skill — an action brought to automatism. Perfecting skills in using knowledge, humans create language, speech appears. And with it — the possibility of cooperation, coordinated activity for a common goal.

We have traced the path: abstraction, knowledge, thinking, goal, rule. This is the path of becoming a thinking human, an acting human.

But is this enough for activity to be human? No. Because there is also violence. And there is law."""
}

print("Generating audio files for Lesson 4...")

for slide_num, text in slides.items():
    print(f"  Generating slide{slide_num}.mp3...")
    tts = gTTS(text=text, lang='en', slow=False)
    tts.save(f"{output_dir}/slide{slide_num}.mp3")

print("Done! Audio files saved to", output_dir)
