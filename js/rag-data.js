/**
 * KidSpark RAG Data
 * Chunked Q&A from English and Mathematics Question Books (Class 1)
 * Each chunk: { id, subject, unit, title, question, answer, keywords }
 */

const RAG_DATA = {
  english: [
    // UNIT 1: Me and My Body
    { id:'e1', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'What do we see with?', answer:'We see with our **eyes** 👀! Our eyes are amazing organs that help us look at the world around us. We have **2 eyes** on our face.' },
    { id:'e2', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'What do we hear with?', answer:'We hear with our **ears** 👂! Our ears help us listen to sounds, music, and the voices of our friends and family. We have **2 ears**.' },
    { id:'e3', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'What do we smell with?', answer:'We smell with our **nose** 👃! Our nose helps us smell flowers, food, and everything around us. We have **1 nose** in the centre of our face!' },
    { id:'e4', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'How many hands do we have?', answer:'We have **2 hands** ✋✋! Each hand has **5 fingers**. So together we have **10 fingers**! We use our hands to write, draw, eat, and play.' },
    { id:'e5', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'How many legs do we have?', answer:'We have **2 legs** 🦵🦵! We use our legs to walk, run, jump and play. Each leg has a foot with 5 toes.' },
    { id:'e6', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'Which body part helps us taste food?', answer:'Our **mouth** 👄 helps us taste food! Our tongue inside our mouth has taste buds that help us tell sweet from sour, salty from bitter. Yummy! 😋' },
    { id:'e7', subject:'english', unit:'Unit 1', title:'Me and My Body',
      question:'How many fingers are on one hand?', answer:'There are **5 fingers** on one hand! 🖐️ They are: Thumb, Index, Middle, Ring, and Little finger. Both hands together = **10 fingers**!' },

    // UNIT 2: My Family
    { id:'e8', subject:'english', unit:'Unit 2', title:'My Family',
      question:'Who is your father\'s father?', answer:'My father\'s father is my **Grandfather** (Grandpa) 👴! He is older and very wise. We love spending time with our grandparents!' },
    { id:'e9', subject:'english', unit:'Unit 2', title:'My Family',
      question:'Who is your mother\'s mother?', answer:'My mother\'s mother is my **Grandmother** (Grandma) 👵! Grandmothers are sweet and caring. They tell us wonderful stories!' },
    { id:'e10', subject:'english', unit:'Unit 2', title:'My Family',
      question:'Who is your father\'s wife?', answer:'My father\'s wife is my **Mother** 👩! Our mother loves us very much. She takes care of us every day.' },
    { id:'e11', subject:'english', unit:'Unit 2', title:'My Family',
      question:'Who is your mother\'s son?', answer:'My mother\'s son is my **Brother** 👦! A brother is a boy who has the same parents as you.' },
    { id:'e12', subject:'english', unit:'Unit 2', title:'My Family',
      question:'How many parents do we have?', answer:'We have **2 parents** — a **Mother** 👩 and a **Father** 👨! They love us and take care of us every single day.' },

    // UNIT 3: Animals
    { id:'e13', subject:'english', unit:'Unit 3', title:'Animals Around Me',
      question:'Which animal says Meow?', answer:'The **Cat** 🐱 says "Meow meow"! A cat is a cute pet that loves to cuddle. A baby cat is called a **kitten** 🐱.' },
    { id:'e14', subject:'english', unit:'Unit 3', title:'Animals Around Me',
      question:'Which animal says Bow wow?', answer:'The **Dog** 🐕 says "Bow wow"! Dogs are our best friends. A baby dog is called a **puppy**. They are loyal and loving pets!' },
    { id:'e15', subject:'english', unit:'Unit 3', title:'Animals Around Me',
      question:'Which animal gives us milk?', answer:'The **Cow** 🐄 gives us milk! Cows live on farms. They eat grass and give us healthy milk which we use to make cheese, butter, and curd.' },
    { id:'e16', subject:'english', unit:'Unit 3', title:'Animals Around Me',
      question:'Which animal gives us eggs?', answer:'The **Hen** 🐔 gives us eggs! Hens live on farms. They lay eggs every day. Eggs are healthy food for us! 🥚' },
    { id:'e17', subject:'english', unit:'Unit 3', title:'Animals Around Me',
      question:'Which animal lives in water?', answer:'**Fish** 🐟 live in water! Fish can breathe underwater using their **gills**. There are thousands of types of fish in oceans, rivers, and lakes.' },
    { id:'e18', subject:'english', unit:'Unit 3', title:'Animals Around Me',
      question:'How many legs does a dog have?', answer:'A dog has **4 legs** 🐕! Most animals with 4 legs are called **quadrupeds**. Dogs use all 4 legs to run, walk and play!' },

    // UNIT 4: Food
    { id:'e19', subject:'english', unit:'Unit 4', title:'Food We Eat',
      question:'Which is a yellow fruit?', answer:'**Banana** 🍌 is a yellow fruit! Bananas are sweet, healthy, and full of energy. Monkeys love bananas too! 🐒 They give us vitamins.' },
    { id:'e20', subject:'english', unit:'Unit 4', title:'Food We Eat',
      question:'Which is a healthy food?', answer:'**Apple** 🍎 is a healthy food! "An apple a day keeps the doctor away" is a famous saying. Fruits and vegetables are healthy foods. Avoid chips and candy! 😊' },
    { id:'e21', subject:'english', unit:'Unit 4', title:'Food We Eat',
      question:'What should we wash before eating?', answer:'We should wash our **hands** 🙌 before eating! Clean hands keep away germs and keep us healthy. Always wash with soap and water for 20 seconds!' },
    { id:'e22', subject:'english', unit:'Unit 4', title:'Food We Eat',
      question:'Is apple a fruit or vegetable?', answer:'Apple 🍎 is a **Fruit**! Fruits grow on trees and are usually sweet. Other fruits are: Banana 🍌, Mango 🥭, Orange 🍊, Grapes 🍇.' },
    { id:'e23', subject:'english', unit:'Unit 4', title:'Food We Eat',
      question:'Is carrot a fruit or vegetable?', answer:'Carrot 🥕 is a **Vegetable**! Vegetables are very healthy. Other vegetables are: Potato 🥔, Tomato 🍅, Spinach 🥬. Eat your veggies!' },

    // UNIT 5: Seasons
    { id:'e24', subject:'english', unit:'Unit 5', title:'Seasons and Weather',
      question:'In which season do we feel hot?', answer:'We feel very hot in **Summer** ☀️! In summer, the sun shines brightly. We wear light cotton clothes and drink lots of water to stay cool.' },
    { id:'e25', subject:'english', unit:'Unit 5', title:'Seasons and Weather',
      question:'In which season do we wear sweaters?', answer:'We wear sweaters in **Winter** ❄️! In winter, it is very cold. We wear warm clothes like sweaters, jackets, and scarves to keep warm.' },
    { id:'e26', subject:'english', unit:'Unit 5', title:'Seasons and Weather',
      question:'What falls from clouds?', answer:'**Rain** 🌧️ falls from clouds! Water evaporates from rivers and lakes, forms clouds, and then falls back as rain. We use an umbrella when it rains! ☂️' },
    { id:'e27', subject:'english', unit:'Unit 5', title:'Seasons and Weather',
      question:'What do we see after rain?', answer:'We see a beautiful **Rainbow** 🌈 after rain! A rainbow has 7 colours: Violet, Indigo, Blue, Green, Yellow, Orange, Red. Remember: VIBGYOR! 🌈' },

    // UNIT 6: Letters
    { id:'e28', subject:'english', unit:'Unit 6', title:'Fun with Letters',
      question:'What are vowels?', answer:'The **vowels** are: **A, E, I, O, U** 🔤! All other letters are called consonants. Every word has at least one vowel. For example: Apple 🍎 has A.' },
    { id:'e29', subject:'english', unit:'Unit 6', title:'Fun with Letters',
      question:'What letter comes after C?', answer:'The letter **D** comes after C! The alphabet goes: A B C **D** E F G... There are **26 letters** in the English alphabet.' },
    { id:'e30', subject:'english', unit:'Unit 6', title:'Fun with Letters',
      question:'What letter comes after X?', answer:'The letter **Y** comes after X! The last few letters are: W X **Y** Z. Z is the very last letter of the alphabet!' },

    // UNIT 8: Rhymes
    { id:'e31', subject:'english', unit:'Unit 8', title:'Rhymes and Stories',
      question:'Complete the rhyme: Twinkle twinkle little...', answer:'"Twinkle, twinkle, little **Star** ⭐\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky!" 🎵\n\nThis is a famous nursery rhyme!' },
    { id:'e32', subject:'english', unit:'Unit 8', title:'Rhymes and Stories',
      question:'Complete: Jack and Jill went up the...', answer:'"Jack and Jill went up the **hill** 🏔️\nTo fetch a pail of water;\nJack fell down and broke his crown,\nAnd Jill came tumbling after!" 🎵' },
    { id:'e33', subject:'english', unit:'Unit 8', title:'Rhymes and Stories',
      question:'Complete: Mary had a little...', answer:'"Mary had a little **lamb** 🐑\nIts fleece was white as snow;\nAnd everywhere that Mary went,\nThe lamb was sure to go!" 🎵' },
    { id:'e34', subject:'english', unit:'Unit 8', title:'Rhymes and Stories',
      question:'What is the story of the Thirsty Crow?', answer:'The **Thirsty Crow** 🐦 is a smart story!\n\n1. A crow was very thirsty.\n2. It found a pot with little water.\n3. The crow put stones in the pot.\n4. The water came up!\n5. The crow drank the water. 🎉\n\nLesson: **Be clever and never give up!**' },

    // UNIT 9: Good Habits
    { id:'e35', subject:'english', unit:'Unit 9', title:'Good Habits',
      question:'How many times should we brush our teeth?', answer:'We should brush our teeth **twice a day** 🪥 — once in the morning and once at night before sleeping! This keeps our teeth clean and strong. 😁' },
    { id:'e36', subject:'english', unit:'Unit 9', title:'Good Habits',
      question:'When should we wash our hands?', answer:'We should wash our hands **before** eating food! 🙌 Also wash hands after using the toilet, after playing, and after sneezing. Clean hands = Healthy you!' },
    { id:'e37', subject:'english', unit:'Unit 9', title:'Good Habits',
      question:'What is a good habit?', answer:'**Good habits** include: ✅\n- Brushing teeth twice daily\n- Washing hands before eating\n- Saying "Please" and "Thank you"\n- Sleeping early at night\n- Exercising daily\n- Keeping your room clean 🏠' },
  ],

  maths: [
    // Chapter 1: Positions
    { id:'m1', subject:'maths', unit:'Chapter 1', title:'Position Words',
      question:'What does "above" mean?', answer:'**Above** means higher than something! ☝️\n\nFor example: The bird is **above** the tree 🐦🌳. The sun is **above** us. Think of it as being "on top" or "up high"!' },
    { id:'m2', subject:'maths', unit:'Chapter 1', title:'Position Words',
      question:'What does "inside" mean?', answer:'**Inside** means within something! 📦\n\nFor example: The fish is **inside** the water 🐟. A cat hiding **inside** a box 📦. It means something is contained within something else.' },
    { id:'m3', subject:'maths', unit:'Chapter 1', title:'Position Words',
      question:'What does "under" or "below" mean?', answer:'**Under / Below** means lower than something! ⬇️\n\nFor example: The cat is **under** the bed 🐱. The fish swims **below** the surface. It is the opposite of above!' },

    // Chapter 2: Shapes
    { id:'m4', subject:'maths', unit:'Chapter 2', title:'Shapes',
      question:'How many sides does a circle have?', answer:'A **circle** ⭕ has **0 sides and 0 corners**! A circle is perfectly round. It can **roll**! Examples: ball ⚽, coin 🪙, wheel 🛞.' },
    { id:'m5', subject:'maths', unit:'Chapter 2', title:'Shapes',
      question:'How many sides does a triangle have?', answer:'A **triangle** 🔺 has **3 sides and 3 corners**! It looks like a pyramid or a pizza slice 🍕. Think of a mountain shape! 🏔️' },
    { id:'m6', subject:'maths', unit:'Chapter 2', title:'Shapes',
      question:'How many sides does a square have?', answer:'A **square** ⬜ has **4 equal sides and 4 corners**! All sides are the same length. Examples: a dice 🎲, a tile on the floor.' },
    { id:'m7', subject:'maths', unit:'Chapter 2', title:'Shapes',
      question:'How many sides does a rectangle have?', answer:'A **rectangle** 📏 has **4 sides and 4 corners**! Two sides are long and two sides are short. Examples: a door 🚪, a book 📚, a window 🪟.' },
    { id:'m8', subject:'maths', unit:'Chapter 2', title:'Shapes',
      question:'Which shape can roll?', answer:'A **circle** ⭕ can roll! 🎾\n\nRound shapes like balls and coins can roll.\nFlat shapes like squares and rectangles can **slide** but cannot roll.' },

    // Chapter 3: Numbers 1-9
    { id:'m9', subject:'maths', unit:'Chapter 3', title:'Numbers 1 to 9',
      question:'What number comes after 6?', answer:'The number **7** comes after 6! 🔢\n\nThe order is: 1, 2, 3, 4, 5, 6, **7**, 8, 9\n\nCount on your fingers: one, two, three, four, five, six, **SEVEN**! ✋🖐️' },
    { id:'m10', subject:'maths', unit:'Chapter 3', title:'Numbers 1 to 9',
      question:'What number comes before 5?', answer:'The number **4** comes before 5! 🔢\n\nThe order is: 1, 2, 3, **4**, 5, 6...\n\nIf you count backwards from 5: five, **four**, three, two, one!' },
    { id:'m11', subject:'maths', unit:'Chapter 3', title:'Numbers 1 to 9',
      question:'Which is the biggest number: 7, 4, 9, 2?', answer:'**9** is the biggest! 🏆\n\nLet\'s compare: 9 > 7 > 4 > 2\n\nAmong 7, 4, 9, 2 — the number **9** is the greatest! Nine is the largest single-digit number.' },
    { id:'m12', subject:'maths', unit:'Chapter 3', title:'Numbers 1 to 9',
      question:'What is the smallest 1-digit number?', answer:'**1** is the smallest 1-digit number!\n\nWait — actually **0** is the smallest, but we usually start counting from 1! Zero means **nothing** — no objects at all.' },

    // Chapter 4: Numbers 10-20
    { id:'m13', subject:'maths', unit:'Chapter 4', title:'Numbers 10 to 20',
      question:'How many fingers on both hands?', answer:'We have **10 fingers** on both hands! 🙌\n\n5 fingers on the left hand + 5 fingers on the right hand = **10** fingers!\n\n1+1+1+1+1 + 1+1+1+1+1 = 10 🎉' },
    { id:'m14', subject:'maths', unit:'Chapter 4', title:'Numbers 10 to 20',
      question:'What comes after 15?', answer:'**16** comes after 15! 🔢\n\nLet\'s count: 10, 11, 12, 13, 14, 15, **16**, 17, 18, 19, 20\n\nAfter fifteen comes **sixteen**!' },
    { id:'m15', subject:'maths', unit:'Chapter 4', title:'Numbers 10 to 20',
      question:'What is 10 + 5?', answer:'10 + 5 = **15** ➕\n\nTen plus five equals **fifteen**! 🎉\n\nCount on: 10... 11, 12, 13, 14, 15! You jumped 5 steps forward.' },
    { id:'m16', subject:'maths', unit:'Chapter 4', title:'Numbers 10 to 20',
      question:'What does zero mean?', answer:'**Zero (0)** means **nothing**! 🕳️\n\nIf you have 5 apples and eat all 5, you have **zero** apples left! Zero is very important in mathematics. It comes before 1.' },

    // Chapter 5: Addition
    { id:'m17', subject:'maths', unit:'Chapter 5', title:'Addition',
      question:'What is 2 + 3?', answer:'2 + 3 = **5** ➕\n\n🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎 = **Five** apples!\n\nWhen we add, we put things together. Two plus three equals **five**!' },
    { id:'m18', subject:'maths', unit:'Chapter 5', title:'Addition',
      question:'What is 4 + 4?', answer:'4 + 4 = **8** ➕\n\n⭐⭐⭐⭐ + ⭐⭐⭐⭐ = **8** stars!\n\nFour plus four equals **eight**! When two same numbers are added, it is called a "double".' },
    { id:'m19', subject:'maths', unit:'Chapter 5', title:'Addition',
      question:'What is 5 + 3?', answer:'5 + 3 = **8** ➕\n\nCount on from 5: 6, 7, **8**!\n\n🌸🌸🌸🌸🌸 + 🌸🌸🌸 = 🌸🌸🌸🌸🌸🌸🌸🌸 = **Eight** flowers!' },
    { id:'m20', subject:'maths', unit:'Chapter 5', title:'Addition',
      question:'What is 1 + 9?', answer:'1 + 9 = **10** ➕\n\nOne plus nine = **ten**! 🎉\n\n🍎 + 🍎🍎🍎🍎🍎🍎🍎🍎🍎 = 10 apples\n\n1 and 9 are a **pair that makes 10**! This is called a "number bond".' },
    { id:'m21', subject:'maths', unit:'Chapter 5', title:'Addition',
      question:'Ria has 4 dolls. She gets 3 more. How many dolls?', answer:'Ria has 4 dolls + 3 more = **7 dolls** 🪆!\n\n4 + 3 = **7**\n\nCount: 4... then 5, 6, 7! Ria now has **seven** dolls!' },

    // Chapter 6: Subtraction
    { id:'m22', subject:'maths', unit:'Chapter 6', title:'Subtraction',
      question:'What is 5 - 2?', answer:'5 - 2 = **3** ➖\n\n🍌🍌🍌🍌🍌 — cross out 2 — leaves 🍌🍌🍌 = **3** bananas!\n\nFive minus two equals **three**!' },
    { id:'m23', subject:'maths', unit:'Chapter 6', title:'Subtraction',
      question:'What is 8 - 3?', answer:'8 - 3 = **5** ➖\n\nStart at 8, jump back 3: 8 → 7 → 6 → **5**!\n\nEight minus three equals **five**! ⭐⭐⭐⭐⭐' },
    { id:'m24', subject:'maths', unit:'Chapter 6', title:'Subtraction',
      question:'What is 10 - 6?', answer:'10 - 6 = **4** ➖\n\nTen minus six equals **four**! 🎉\n\nCount back from 10: 9, 8, 7, 6, 5, **4**!\n\n🌸🌸🌸🌸 flowers are left!' },
    { id:'m25', subject:'maths', unit:'Chapter 6', title:'Subtraction',
      question:'Ramu had 8 balloons. 3 flew away. How many left?', answer:'8 - 3 = **5 balloons** 🎈!\n\nRamu had 8 balloons. 3 flew away. So:\n8 - 3 = **5**\n\nRamu has **five** balloons left! 🎈🎈🎈🎈🎈' },
    { id:'m26', subject:'maths', unit:'Chapter 6', title:'Subtraction',
      question:'What is 9 - 5?', answer:'9 - 5 = **4** ➖\n\nNine minus five equals **four**!\n\nStart at 9, count back 5 steps: 8, 7, 6, 5, **4**!\n\nFill in: 9 - 5 = ⬛ → Answer: **4**' },

    // Chapter 7: Measurement
    { id:'m27', subject:'maths', unit:'Chapter 7', title:'Measurement',
      question:'Is a giraffe tall or short?', answer:'A **Giraffe** 🦒 is **TALL**! Very tall! Giraffes are the tallest animals on Earth. They can eat leaves from very tall trees because of their long necks! 🌳' },
    { id:'m28', subject:'maths', unit:'Chapter 7', title:'Measurement',
      question:'Is an elephant heavy or light?', answer:'An **Elephant** 🐘 is **HEAVY**! Elephants are the heaviest land animals. An adult elephant can weigh as much as 5,000 kilograms! That\'s super heavy! 💪' },

    // Chapter 8: Big Numbers
    { id:'m29', subject:'maths', unit:'Chapter 8', title:'Big Numbers 21-99',
      question:'What comes after 29?', answer:'**30** comes after 29! 🔢\n\nWhen we reach 29 (twenty-nine), the next number is **30** (thirty)!\n\n...27, 28, 29, **30**, 31...\n\nWe moved from the twenties to the thirties!' },
    { id:'m30', subject:'maths', unit:'Chapter 8', title:'Big Numbers 21-99',
      question:'What is 4 tens and 5 ones?', answer:'4 tens and 5 ones = **45** (forty-five)! 🔢\n\n4 tens = 40\n5 ones = 5\n40 + 5 = **45**\n\nOur number system uses tens and ones!' },
    { id:'m31', subject:'maths', unit:'Chapter 8', title:'Big Numbers 21-99',
      question:'Which is bigger: 67 or 76?', answer:'**76** is bigger than 67! 📊\n\nLook at the tens digit first:\n- 67 has **6** tens\n- 76 has **7** tens\n\n7 tens > 6 tens, so **76 > 67**! Always compare tens first!' },

    // Chapter 9: Patterns
    { id:'m32', subject:'maths', unit:'Chapter 9', title:'Patterns',
      question:'What comes next in 2, 4, 6, 8?', answer:'**10** comes next! 🔢\n\nThis is a pattern of adding 2 each time!\n2, 4, 6, 8, **10**, 12, 14...\n\nThese are called **even numbers**! They are multiples of 2.' },
    { id:'m33', subject:'maths', unit:'Chapter 9', title:'Patterns',
      question:'What comes next in 5, 10, 15, 20?', answer:'**25** comes next! 🔢\n\nThis is a pattern of adding 5 each time!\n5, 10, 15, 20, **25**, 30...\n\nThese are the **5 times table**! Count in 5s!' },
    { id:'m34', subject:'maths', unit:'Chapter 9', title:'Patterns',
      question:'What is a pattern?', answer:'A **pattern** is something that **repeats** in a regular way! 🌈\n\nExamples:\n- 🔴🔵🔴🔵🔴... (colours repeat)\n- 1, 2, 1, 2, 1... (numbers repeat)\n- ABC, ABC, ABC... (letters repeat)\n\nPatterns are everywhere in nature!' },

    // Chapter 10: Time
    { id:'m35', subject:'maths', unit:'Chapter 10', title:'Time',
      question:'How many days are in a week?', answer:'There are **7 days** in a week! 📅\n\nThe days are:\n1. Sunday\n2. Monday\n3. Tuesday\n4. Wednesday\n5. Thursday\n6. Friday\n7. Saturday\n\n**Sun Mon Tue Wed Thu Fri Sat** — easy to remember!' },
    { id:'m36', subject:'maths', unit:'Chapter 10', title:'Time',
      question:'If today is Wednesday, what is tomorrow?', answer:'If today is **Wednesday**, tomorrow is **Thursday**! 📅\n\nThe order: Monday → Tuesday → Wednesday → **Thursday** → Friday → Saturday → Sunday\n\nJust move one day forward!' },
    { id:'m37', subject:'maths', unit:'Chapter 10', title:'Time',
      question:'When do we wake up — morning or night?', answer:'We wake up in the **Morning** 🌅!\n\nA day has: Morning 🌅 → Afternoon ☀️ → Evening 🌆 → Night 🌙\n\nWe wake up in the morning, go to school, play in the evening, and sleep at night! 😴' },

    // Chapter 11: Groups
    { id:'m38', subject:'maths', unit:'Chapter 11', title:'Equal Groups',
      question:'What is 2 groups of 3?', answer:'2 groups of 3 = **6**! 🔢\n\n⭐⭐⭐ + ⭐⭐⭐ = **6** stars!\n\n3 + 3 = **6**\n\nRepeated addition: add the same number over and over! This is the beginning of multiplication!' },
    { id:'m39', subject:'maths', unit:'Chapter 11', title:'Equal Groups',
      question:'How many wheels on 2 bicycles?', answer:'2 bicycles have **4 wheels** 🚲!\n\nEach bicycle has 2 wheels.\n2 + 2 = **4** wheels!\n\n🚲🚲 → 2+2 = **4**\n\nWhat about 3 bicycles? 2+2+2 = **6** wheels!' },
    { id:'m40', subject:'maths', unit:'Chapter 11', title:'Equal Groups',
      question:'How many fingers on 2 hands?', answer:'2 hands have **10 fingers**! 🙌\n\nEach hand has 5 fingers.\n5 + 5 = **10** fingers!\n\n✋✋ → 5 + 5 = **10** ✨' },

    // Chapter 12: Money
    { id:'m41', subject:'maths', unit:'Chapter 12', title:'Money',
      question:'What is rupees 5 + rupees 2?', answer:'₹5 + ₹2 = **₹7** (seven rupees)! 💰\n\nFive rupees plus two rupees equals seven rupees!\n\n🪙₹5 + 🪙₹2 = ₹**7**' },
    { id:'m42', subject:'maths', unit:'Chapter 12', title:'Money',
      question:'A pencil costs rupees 5. I give rupees 10. What is my change?', answer:'Change = ₹10 - ₹5 = **₹5** (five rupees)! 💰\n\nYou give ₹10 and spend ₹5:\n10 - 5 = **5**\n\nYou get ₹**5** back as change! Always check your change! 😊' },
    { id:'m43', subject:'maths', unit:'Chapter 12', title:'Money',
      question:'Which is more: rupees 2 or rupees 5?', answer:'**₹5** is more than ₹2! 💰\n\n5 > 2\n\nFive rupees is bigger than two rupees. A ₹5 coin can buy more things than a ₹2 coin!' },
  ]
};

// Build keyword index for RAG search
RAG_DATA.keywordIndex = {};
[...RAG_DATA.english, ...RAG_DATA.maths].forEach(chunk => {
  const words = (chunk.question + ' ' + chunk.answer + ' ' + chunk.title).toLowerCase()
    .replace(/[*_#\n]/g,'')
    .split(/\s+/);
  words.forEach(w => {
    if (w.length > 2) {
      if (!RAG_DATA.keywordIndex[w]) RAG_DATA.keywordIndex[w] = [];
      RAG_DATA.keywordIndex[w].push(chunk.id);
    }
  });
});

/**
 * Simple RAG retrieval: search by keywords
 * Returns the best matching chunk answer
 */
function ragSearch(query, subject = null) {
  const pool = subject === 'maths' ? RAG_DATA.maths
             : subject === 'english' ? RAG_DATA.english
             : [...RAG_DATA.english, ...RAG_DATA.maths];

  const words = query.toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).filter(w=>w.length>2);
  const scores = {};
  words.forEach(word => {
    (RAG_DATA.keywordIndex[word] || []).forEach(id => {
      scores[id] = (scores[id] || 0) + 1;
    });
  });

  // Sort by score
  const ranked = Object.entries(scores)
    .sort((a,b) => b[1]-a[1])
    .map(([id]) => id);

  if (!ranked.length) return null;

  const bestId = ranked[0];
  return pool.find(c => c.id === bestId) || null;
}

// Daily tips pool
const DAILY_TIPS = [
  "🌟 Every day you learn, you grow smarter! Keep going!",
  "🍎 An apple a day keeps the doctor away — eat healthy!",
  "📖 Reading books is like going on a magical adventure!",
  "🔢 Numbers are everywhere — count your steps today!",
  "🎨 Drawing and art make our brain super creative!",
  "🤝 Being kind to others makes YOU feel great too!",
  "😴 Good sleep helps your brain learn better!",
  "🌱 Learning something new every day makes you amazing!",
  "🎵 Music and rhymes help us remember things easily!",
  "💧 Drink plenty of water to keep your brain sharp!",
];
