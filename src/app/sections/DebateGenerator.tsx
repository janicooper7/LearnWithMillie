'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const debates = [
  {
    debate_questions: [
      {
        question: 'Should school uniforms be mandatory?',
        keywords: [
          {
            keyword: 'Identity',
            example:
              "School uniforms can suppress students' sense of identity by preventing them from expressing their individuality through clothing choices.",
          },
          {
            keyword: 'Discipline',
            example:
              'Proponents argue that mandatory uniforms promote discipline by creating a structured environment that reduces distractions and focuses students on learning.',
          },
          {
            keyword: 'Equality',
            example:
              'Uniforms can promote equality by eliminating visible differences in socioeconomic status, ensuring all students are treated the same regardless of their background.',
          },
          {
            keyword: 'Tradition',
            example:
              'Many schools maintain the tradition of uniforms as a way to preserve institutional values and create a sense of belonging to the school community.',
          },
          {
            keyword: 'Expression',
            example:
              "Opponents of mandatory uniforms argue that clothing is a form of self-expression and that restricting it limits students' ability to develop their personal identity.",
          },
        ],
      },
      {
        question: 'Is social media doing more harm than good?',
        keywords: [
          {
            keyword: 'Wellbeing',
            example:
              'Social media can negatively impact mental wellbeing through constant comparison, cyberbullying, and the pressure to maintain a perfect online image.',
          },
          {
            keyword: 'Influence',
            example:
              'The influence of social media platforms extends beyond entertainment, shaping public opinion, political discourse, and cultural trends in unprecedented ways.',
          },
          {
            keyword: 'Privacy',
            example:
              'Privacy concerns arise when social media companies collect and monetize user data without transparent consent, potentially exposing personal information.',
          },
          {
            keyword: 'Misinformation',
            example:
              'The rapid spread of misinformation on social media platforms can have serious consequences, from health misinformation to political manipulation.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Social media can alter behavior patterns, creating addiction-like dependencies and reducing face-to-face social interactions and communication skills.',
          },
        ],
      },
      {
        question: 'Should the voting age be lowered to 16?',
        keywords: [
          {
            keyword: 'Responsibility',
            example:
              'Lowering the voting age to 16 would give young people the responsibility to participate in decisions that directly affect their future, such as climate policy and education funding.',
          },
          {
            keyword: 'Engagement',
            example:
              'Allowing 16-year-olds to vote could increase political engagement among young people and establish voting as a lifelong habit from an earlier age.',
          },
          {
            keyword: 'Maturity',
            example:
              'Critics question whether 16-year-olds have sufficient maturity and life experience to make informed decisions about complex political issues.',
          },
          {
            keyword: 'Representation',
            example:
              "Lowering the voting age would improve representation of young people's interests in government, ensuring their voices are heard on issues that impact them.",
          },
          {
            keyword: 'Participation',
            example:
              'Early participation in democracy could foster a stronger sense of civic duty and encourage young people to stay engaged in political processes throughout their lives.',
          },
        ],
      },
      {
        question: 'Is celebrity culture a bad influence on young people?',
        keywords: [
          {
            keyword: 'Role models',
            example:
              'Celebrities often serve as role models for young people, but their behavior and values may not always be appropriate or realistic to emulate.',
          },
          {
            keyword: 'Pressure',
            example:
              'The pressure to achieve celebrity-like success and appearance can lead to unrealistic expectations and negative self-image among young people.',
          },
          {
            keyword: 'Popularity',
            example:
              'The obsession with popularity and fame in celebrity culture can distract young people from developing meaningful relationships and personal values.',
          },
          {
            keyword: 'Consumerism',
            example:
              'Celebrity endorsements and lifestyle promotion drive consumerism, encouraging young people to buy products they may not need to emulate their idols.',
          },
          {
            keyword: 'Expectations',
            example:
              "Celebrity culture creates unrealistic expectations about success, beauty, and lifestyle that can be harmful to young people's mental health and self-esteem.",
          },
        ],
      },
      {
        question:
          'Are violent video games harmful enough to deserve stricter limits?',
        keywords: [
          {
            keyword: 'Aggression',
            example:
              'Research on whether violent video games increase real-world aggression remains inconclusive, with studies showing mixed results.',
          },
          {
            keyword: 'Exposure',
            example:
              'The level of exposure to violent content in video games may desensitize players to violence and normalize aggressive behavior.',
          },
          {
            keyword: 'Regulation',
            example:
              'Stricter regulation of violent video games could protect vulnerable populations, especially children, from potentially harmful content.',
          },
          {
            keyword: 'Responsibility',
            example:
              "Parents and guardians bear the responsibility of monitoring and limiting children's access to age-inappropriate violent content.",
          },
          {
            keyword: 'Impact',
            example:
              'The long-term impact of violent video games on behavior and mental health is still being studied, making it difficult to draw definitive conclusions.',
          },
        ],
      },
      {
        question: 'Is traditional marriage still relevant today?',
        keywords: [
          {
            keyword: 'Commitment',
            example:
              'Traditional marriage emphasizes lifelong commitment, but modern relationships may prioritize personal fulfillment and flexibility over rigid structures.',
          },
          {
            keyword: 'Values',
            example:
              'The values associated with traditional marriage, such as stability and family unity, may conflict with contemporary values of individual autonomy and equality.',
          },
          {
            keyword: 'Independence',
            example:
              'Modern individuals often prioritize financial and emotional independence, which may make traditional marriage structures less appealing or necessary.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Changing lifestyles, including career priorities and cohabitation, challenge the relevance of traditional marriage as the only acceptable relationship model.',
          },
          {
            keyword: 'Expectations',
            example:
              'Traditional marriage comes with specific expectations about gender roles and family structure that may not align with modern egalitarian values and diverse family forms.',
          },
        ],
      },
      {
        question: 'Should children be allowed to use smartphones?',
        keywords: [
          {
            keyword: 'Attention',
            example:
              "Excessive smartphone use can fragment children's attention spans and reduce their ability to focus on tasks, homework, and face-to-face interactions.",
          },
          {
            keyword: 'Safety',
            example:
              "Smartphones can enhance children's safety by allowing parents to track their location and enabling emergency communication, but they also expose children to online risks.",
          },
          {
            keyword: 'Development',
            example:
              "Early smartphone use may interfere with children's cognitive and social development, potentially impacting their ability to develop problem-solving skills and emotional intelligence.",
          },
          {
            keyword: 'Supervision',
            example:
              'Proper supervision and parental controls are essential when children use smartphones to protect them from inappropriate content and online predators.',
          },
          {
            keyword: 'Communication',
            example:
              'Smartphones can facilitate communication between children and parents, but they may also reduce opportunities for developing interpersonal communication skills.',
          },
        ],
      },
      {
        question: 'Is cancel culture a necessary form of accountability?',
        keywords: [
          {
            keyword: 'Reputation',
            example:
              "Cancel culture can permanently damage a person's reputation based on allegations or past actions, sometimes without due process or opportunity for redemption.",
          },
          {
            keyword: 'Criticism',
            example:
              'While cancel culture enables public criticism of harmful behavior, it may also silence legitimate debate and create a climate of fear around expressing unpopular opinions.',
          },
          {
            keyword: 'Fairness',
            example:
              'The fairness of cancel culture is questioned when it applies disproportionate consequences without considering context, intent, or the possibility of growth and change.',
          },
          {
            keyword: 'Consequences',
            example:
              'Cancel culture demonstrates that actions have consequences, but critics argue it can be excessive and prevent people from learning from their mistakes.',
          },
          {
            keyword: 'Public opinion',
            example:
              'Cancel culture is driven by public opinion and social media, which can be volatile and may not always reflect nuanced understanding of complex issues.',
          },
        ],
      },
      {
        question: 'Should everyone have to do mandatory community service?',
        keywords: [
          {
            keyword: 'Contribution',
            example:
              'Mandatory community service ensures that everyone contributes to society, creating a shared sense of civic duty and mutual support.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Requiring community service teaches individuals to take responsibility for their communities and understand the importance of giving back.',
          },
          {
            keyword: 'Skills',
            example:
              'Community service can develop valuable skills such as teamwork, communication, and problem-solving that benefit individuals throughout their lives.',
          },
          {
            keyword: 'Engagement',
            example:
              'Mandatory service can increase civic engagement and help people understand social issues firsthand, fostering more informed and active citizens.',
          },
          {
            keyword: 'Cooperation',
            example:
              'Working together in community service projects builds cooperation skills and breaks down social barriers, creating stronger, more connected communities.',
          },
        ],
      },
      {
        question: 'Is there a point when ambition becomes unhealthy?',
        keywords: [
          {
            keyword: 'Pressure',
            example:
              'Excessive ambition can create unhealthy pressure that leads to stress, anxiety, and neglect of personal relationships and wellbeing.',
          },
          {
            keyword: 'Burnout',
            example:
              'When ambition drives people to work beyond their limits, it can result in burnout, causing physical and mental exhaustion that undermines long-term success.',
          },
          {
            keyword: 'Goals',
            example:
              'While setting ambitious goals can be motivating, unrealistic or constantly shifting goals may prevent people from finding satisfaction and balance in life.',
          },
          {
            keyword: 'Productivity',
            example:
              'Unhealthy ambition may prioritize productivity at all costs, sacrificing rest, relationships, and personal fulfillment for the sake of achievement.',
          },
          {
            keyword: 'Balance',
            example:
              'Maintaining balance between ambition and other life priorities is essential to prevent ambition from becoming a destructive force that consumes everything else.',
          },
        ],
      },
      {
        question: 'Is AI a threat to human jobs?',
        keywords: [
          {
            keyword: 'Automation',
            example:
              'AI-driven automation is replacing many routine and manual jobs, forcing workers to adapt to new roles that require human creativity and emotional intelligence.',
          },
          {
            keyword: 'Skills',
            example:
              'The rise of AI requires workers to develop new skills and continuously learn, as traditional job skills become obsolete in an increasingly automated economy.',
          },
          {
            keyword: 'Efficiency',
            example:
              'While AI increases efficiency and productivity in many industries, this efficiency gain often comes at the cost of human employment opportunities.',
          },
          {
            keyword: 'Employment',
            example:
              'The impact of AI on employment is complex, as it eliminates some jobs while creating new ones, requiring careful workforce planning and retraining programs.',
          },
          {
            keyword: 'Adaptation',
            example:
              'Workers must adapt to the AI revolution by developing skills that complement rather than compete with artificial intelligence, such as critical thinking and empathy.',
          },
        ],
      },
      {
        question: 'Would society be better without YouTube?',
        keywords: [
          {
            keyword: 'Entertainment',
            example:
              'YouTube provides endless entertainment, but may also distract people from more productive activities and real-world engagement.',
          },
          {
            keyword: 'Learning',
            example:
              'YouTube offers valuable educational content and tutorials, making learning accessible to millions of people worldwide.',
          },
          {
            keyword: 'Influence',
            example:
              'YouTube has significant influence on public opinion, culture, and behavior, which can be both positive and negative.',
          },
          {
            keyword: 'Accessibility',
            example:
              'YouTube makes information and entertainment accessible to anyone with internet access, breaking down traditional barriers.',
          },
          {
            keyword: 'Distraction',
            example:
              'YouTube can be highly distracting, leading to time-wasting and reduced productivity when used excessively.',
          },
        ],
      },
      {
        question:
          'Do social media platforms need stronger rules to control harmful content?',
        keywords: [
          {
            keyword: 'Privacy',
            example:
              'Stronger content rules must balance safety with privacy rights, ensuring users can express themselves while being protected from harm.',
          },
          {
            keyword: 'Safety',
            example:
              'Stronger rules can improve safety by removing harmful content that promotes violence, self-harm, or dangerous behaviors.',
          },
          {
            keyword: 'Misinformation',
            example:
              'Stricter rules can help combat misinformation and fake news that spread rapidly on social media platforms.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Platforms have a responsibility to protect users, but determining what content is harmful requires careful judgment and oversight.',
          },
          {
            keyword: 'Oversight',
            example:
              'Effective content rules require proper oversight and enforcement mechanisms to ensure platforms actually implement and maintain standards.',
          },
        ],
      },
      {
        question: 'Are self-driving cars a good idea?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Self-driving cars could improve safety by eliminating human error, which causes most accidents, but technology failures pose new risks.',
          },
          {
            keyword: 'Innovation',
            example:
              'Self-driving cars represent major innovation in transportation, potentially revolutionizing how people travel and commute.',
          },
          {
            keyword: 'Reliability',
            example:
              'The reliability of self-driving technology must be proven before widespread adoption, as system failures could be catastrophic.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Self-driving cars raise questions about responsibility when accidents occur - is it the manufacturer, software developer, or owner at fault?',
          },
          {
            keyword: 'Technology',
            example:
              'Advancing self-driving technology requires significant investment and testing to ensure it can handle all real-world scenarios safely.',
          },
        ],
      },
      {
        question: 'Should we be worried about deepfake technology?',
        keywords: [
          {
            keyword: 'Trust',
            example:
              'Deepfakes can erode trust in media and information, making it difficult to distinguish between real and fabricated content.',
          },
          {
            keyword: 'Manipulation',
            example:
              'Deepfake technology enables manipulation of videos and images, potentially being used for fraud, blackmail, or political manipulation.',
          },
          {
            keyword: 'Evidence',
            example:
              'Deepfakes challenge the reliability of video evidence, which has traditionally been considered strong proof in legal and journalistic contexts.',
          },
          {
            keyword: 'Security',
            example:
              'Deepfakes pose security threats, as they can be used to impersonate people for identity theft or unauthorized access.',
          },
          {
            keyword: 'Misinformation',
            example:
              'Deepfakes can spread misinformation by making false videos appear authentic, potentially influencing public opinion and elections.',
          },
        ],
      },
      {
        question: 'Do dating apps make relationships less meaningful?',
        keywords: [
          {
            keyword: 'Connection',
            example:
              'Dating apps can facilitate connections, but the abundance of options may make people less committed to developing deep relationships.',
          },
          {
            keyword: 'Expectations',
            example:
              'Dating apps create expectations of instant matches and quick connections, which may undermine patience needed for meaningful relationships.',
          },
          {
            keyword: 'Communication',
            example:
              'Dating apps emphasize initial messaging over face-to-face communication, which may reduce the depth of early relationship building.',
          },
          {
            keyword: 'Trust',
            example:
              'Building trust can be challenging on dating apps where people may misrepresent themselves or have multiple conversations simultaneously.',
          },
          {
            keyword: 'Compatibility',
            example:
              'While apps use algorithms to match compatibility, real compatibility often requires in-person interaction that apps cannot fully assess.',
          },
        ],
      },
      {
        question: 'Is personality shaped more by nature or nurture?',
        keywords: [
          {
            keyword: 'Environment',
            example:
              'Environmental factors like family, education, and culture significantly influence personality development throughout life.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Personality shapes behavior, but behavior patterns are also influenced by both genetic predispositions and learned responses.',
          },
          {
            keyword: 'Development',
            example:
              'Personality development involves complex interactions between genetic traits and environmental experiences from childhood through adulthood.',
          },
          {
            keyword: 'Genetics',
            example:
              'Genetic factors contribute to personality traits, with research showing heritability for characteristics like extroversion and neuroticism.',
          },
          {
            keyword: 'Influence',
            example:
              'Both nature and nurture influence personality, with most traits resulting from the interaction of genetic and environmental factors.',
          },
        ],
      },
      {
        question: 'Can money change someone’s personality?',
        keywords: [
          'Lifestyle',
          'Values',
          'Confidence',
          'Behaviour',
          'Priorities',
        ],
      },
      {
        question: 'Should schools ban AI tools like ChatGPT?',
        keywords: [
          {
            keyword: 'Integrity',
            example:
              'AI tools like ChatGPT raise concerns about academic integrity, as students might use them to complete assignments without learning.',
          },
          {
            keyword: 'Learning',
            example:
              'Banning AI tools may preserve traditional learning, but could also prevent students from learning to use modern tools effectively.',
          },
          {
            keyword: 'Dependence',
            example:
              "Allowing AI tools could create dependence, reducing students' ability to think critically and solve problems independently.",
          },
          {
            keyword: 'Creativity',
            example:
              'AI tools might limit creativity by providing ready-made answers, but could also inspire new ideas when used as a starting point.',
          },
          {
            keyword: 'Supervision',
            example:
              'Proper supervision and guidelines could allow beneficial use of AI tools while preventing misuse and maintaining learning standards.',
          },
        ],
      },
      {
        question: 'Are video games more beneficial than harmful?',
        keywords: [
          {
            keyword: 'Skills',
            example:
              'Video games can develop skills like problem-solving, hand-eye coordination, and strategic thinking through interactive challenges.',
          },
          {
            keyword: 'Entertainment',
            example:
              'Video games provide entertainment and relaxation, offering an engaging way to unwind and have fun.',
          },
          {
            keyword: 'Focus',
            example:
              'Gaming can improve focus and attention to detail, but excessive gaming may reduce ability to concentrate on other tasks.',
          },
          {
            keyword: 'Social interaction',
            example:
              'Multiplayer games can facilitate social interaction and teamwork, but may also replace face-to-face social activities.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Moderate gaming can support wellbeing through stress relief, but excessive gaming may harm physical and mental health.',
          },
        ],
      },
      {
        question: 'Should students have to learn a second language?',
        keywords: [
          {
            keyword: 'Communication',
            example:
              'Learning a second language improves communication skills and enables interaction with people from different cultures.',
          },
          {
            keyword: 'Opportunity',
            example:
              'Bilingualism opens opportunities for travel, work, and cultural exchange that monolingual individuals may miss.',
          },
          {
            keyword: 'Culture',
            example:
              'Learning languages provides insight into different cultures, fostering understanding and appreciation of diversity.',
          },
          {
            keyword: 'Globalisation',
            example:
              'In a globalized world, second language skills are increasingly valuable for international communication and collaboration.',
          },
          {
            keyword: 'Skills',
            example:
              'Language learning develops cognitive skills like memory, problem-solving, and multitasking abilities.',
          },
        ],
      },
      {
        question: 'Is homework necessary for academic success?',
        keywords: [
          {
            keyword: 'Practice',
            example:
              'Homework provides practice that reinforces classroom learning and helps students master concepts through repetition.',
          },
          {
            keyword: 'Independence',
            example:
              'Completing homework independently develops self-reliance and the ability to work without constant teacher supervision.',
          },
          {
            keyword: 'Motivation',
            example:
              'While homework can motivate some students, excessive homework may demotivate others and reduce enthusiasm for learning.',
          },
          {
            keyword: 'Discipline',
            example:
              'Regular homework instills discipline and time management skills that are valuable beyond academic settings.',
          },
          {
            keyword: 'Performance',
            example:
              'Research shows homework can improve academic performance, but the amount and type of homework matter significantly.',
          },
        ],
      },
      {
        question: 'Should university education be free?',
        keywords: [
          {
            keyword: 'Access',
            example:
              'Free university education increases access for students from low-income backgrounds who might otherwise be unable to afford higher education.',
          },
          {
            keyword: 'Opportunity',
            example:
              'Free education creates equal opportunities regardless of financial background, allowing talent to flourish based on merit rather than wealth.',
          },
          {
            keyword: 'Inequality',
            example:
              'Free university can reduce educational inequality by removing financial barriers that prevent qualified students from attending.',
          },
          {
            keyword: 'Finances',
            example:
              'Free education requires significant public financing, which must be balanced against other public spending priorities.',
          },
          {
            keyword: 'Investment',
            example:
              'Free university education is an investment in human capital that can benefit society through a more educated workforce.',
          },
        ],
      },
      {
        question: 'Do grades reflect intelligence?',
        keywords: [
          {
            keyword: 'Ability',
            example:
              'Grades measure academic ability and performance, but intelligence encompasses broader cognitive abilities beyond test-taking.',
          },
          {
            keyword: 'Performance',
            example:
              'Grades reflect performance on specific assessments, which may be influenced by factors beyond intelligence like effort and preparation.',
          },
          {
            keyword: 'Fairness',
            example:
              'Using grades as intelligence measures may be unfair, as different students have varying learning styles and test-taking abilities.',
          },
          {
            keyword: 'Assessment',
            example:
              'Traditional grade assessments may not capture all forms of intelligence, such as creativity, emotional intelligence, or practical skills.',
          },
          {
            keyword: 'Pressure',
            example:
              "Focusing on grades as intelligence indicators creates pressure that may not accurately reflect students' true cognitive abilities.",
          },
        ],
      },
      {
        question: 'Is homeschooling better than traditional schooling?',
        keywords: [
          {
            keyword: 'Flexibility',
            example:
              'Homeschooling offers flexibility in curriculum and schedule, allowing personalized learning that adapts to individual needs.',
          },
          {
            keyword: 'Independence',
            example:
              'Homeschooling can develop independence and self-directed learning, but may lack structured guidance some students need.',
          },
          {
            keyword: 'Socialisation',
            example:
              'Traditional schools provide more opportunities for socialisation, while homeschooling requires intentional efforts to ensure social development.',
          },
          {
            keyword: 'Structure',
            example:
              'Traditional schools provide structure and routine, while homeschooling requires parents to create and maintain educational structure.',
          },
          {
            keyword: 'Support',
            example:
              'Traditional schools offer professional teacher support and resources that homeschooling parents must provide themselves.',
          },
        ],
      },
      {
        question: 'Should schools focus more on practical life skills?',
        keywords: [
          {
            keyword: 'Financial literacy',
            example:
              'Teaching financial literacy helps students manage money, budget, and make informed financial decisions as adults.',
          },
          {
            keyword: 'Independence',
            example:
              'Practical life skills promote independence, preparing students to handle real-world responsibilities beyond academic knowledge.',
          },
          {
            keyword: 'Decision-making',
            example:
              'Learning practical skills develops decision-making abilities by applying knowledge to solve everyday problems.',
          },
          {
            keyword: 'Confidence',
            example:
              "Mastering practical skills builds confidence in students' ability to navigate adult life and handle challenges.",
          },
          {
            keyword: 'Practical skills',
            example:
              'Practical skills like cooking, basic repairs, and time management are essential for daily life but often overlooked in traditional curricula.',
          },
        ],
      },
      {
        question: 'Should students have more say in what they learn?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Allowing student choice in learning can increase motivation by making education more relevant and interesting to individual interests.',
          },
          {
            keyword: 'Engagement',
            example:
              'When students have input into their learning, engagement typically increases as they feel more invested in their education.',
          },
          {
            keyword: 'Independence',
            example:
              'Giving students choice develops independence and self-direction, preparing them for lifelong learning beyond school.',
          },
          {
            keyword: 'Creativity',
            example:
              'Student choice can foster creativity by allowing exploration of topics that spark curiosity and innovative thinking.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Involving students in learning decisions teaches responsibility for their education and helps develop critical thinking about what to learn.',
          },
        ],
      },
      {
        question: 'Is online learning as effective as in-person learning?',
        keywords: [
          {
            keyword: 'Interaction',
            example:
              'In-person learning offers direct interaction with teachers and peers, while online learning may feel more isolated.',
          },
          {
            keyword: 'Flexibility',
            example:
              'Online learning provides flexibility in scheduling and location, making education accessible to more people.',
          },
          {
            keyword: 'Discipline',
            example:
              'Online learning requires greater self-discipline and time management skills compared to structured in-person classes.',
          },
          {
            keyword: 'Access',
            example:
              'Online learning increases access to education for those who cannot attend traditional schools due to location or circumstances.',
          },
          {
            keyword: 'Engagement',
            example:
              'In-person learning may provide better engagement through face-to-face interaction, though online platforms are improving.',
          },
        ],
      },
      {
        question: 'Are standardised tests a fair way to measure ability?',
        keywords: [
          {
            keyword: 'Pressure',
            example:
              "Standardized tests create significant pressure that may not accurately reflect students' true abilities under stress.",
          },
          {
            keyword: 'Accuracy',
            example:
              'Standardized tests provide consistent measurement, but may not accurately assess diverse learning styles and intelligences.',
          },
          {
            keyword: 'Comparison',
            example:
              'Standardized tests enable comparison across schools and regions, but may oversimplify complex educational outcomes.',
          },
          {
            keyword: 'Preparation',
            example:
              'Test preparation can improve scores, but this may measure test-taking skills rather than actual knowledge and ability.',
          },
          {
            keyword: 'Stress',
            example:
              'The stress of standardized testing can negatively impact performance, especially for students who struggle with test anxiety.',
          },
        ],
      },
      {
        question: 'Should financial literacy be a required subject in school?',
        keywords: [
          {
            keyword: 'Budgeting',
            example:
              'Financial literacy teaches budgeting skills that help students manage money effectively and avoid debt as adults.',
          },
          {
            keyword: 'Planning',
            example:
              'Learning financial planning prepares students for major life decisions like saving for college, buying a home, or retirement.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Financial education teaches responsibility for money management, helping students make informed financial choices.',
          },
          {
            keyword: 'Awareness',
            example:
              'Financial literacy increases awareness of financial products, risks, and opportunities that affect daily life.',
          },
          {
            keyword: 'Decision-making',
            example:
              'Understanding finances improves decision-making about spending, saving, and investing throughout life.',
          },
        ],
      },
      {
        question: 'Should companies offer a four-day workweek?',
        keywords: [
          {
            keyword: 'Productivity',
            example:
              'A four-day workweek may increase productivity by allowing employees to work more efficiently in compressed time.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Reducing work days can improve employee wellbeing by providing more time for rest, family, and personal activities.',
          },
          {
            keyword: 'Flexibility',
            example:
              'A four-day workweek offers flexibility that can help employees achieve better work-life balance.',
          },
          {
            keyword: 'Workload',
            example:
              'Condensing work into four days may increase daily workload and stress, potentially offsetting benefits.',
          },
          {
            keyword: 'Motivation',
            example:
              'The prospect of a three-day weekend can increase motivation and job satisfaction among employees.',
          },
        ],
      },
      {
        question: 'Is working from home better than working in an office?',
        keywords: [
          {
            keyword: 'Routine',
            example:
              'Working from home requires creating a routine and structure to maintain productivity without office supervision.',
          },
          {
            keyword: 'Communication',
            example:
              'Remote work relies on digital communication, which may lack the nuance and spontaneity of in-person office interactions.',
          },
          {
            keyword: 'Balance',
            example:
              'Working from home can improve work-life balance by eliminating commute time and allowing more flexible schedules.',
          },
          {
            keyword: 'Productivity',
            example:
              'Some people are more productive at home without office distractions, while others need the structure of an office environment.',
          },
          {
            keyword: 'Flexibility',
            example:
              'Remote work offers flexibility in location and schedule, but may blur boundaries between work and personal time.',
          },
        ],
      },
      {
        question: 'Should unpaid internships be banned?',
        keywords: [
          {
            keyword: 'Exploitation',
            example:
              'Unpaid internships can exploit young workers by requiring full-time work without compensation, benefiting only employers.',
          },
          {
            keyword: 'Opportunity',
            example:
              'Unpaid internships provide opportunities for experience and networking that might not exist if all internships required pay.',
          },
          {
            keyword: 'Experience',
            example:
              'Internships offer valuable experience, but unpaid positions limit access to those who can afford to work without income.',
          },
          {
            keyword: 'Fairness',
            example:
              'Unpaid internships are unfair as they exclude students who need income, creating inequality in career opportunities.',
          },
          {
            keyword: 'Access',
            example:
              'Banning unpaid internships could reduce access to entry-level opportunities if companies cannot afford to pay all interns.',
          },
        ],
      },
      {
        question: 'Is job stability more important than job satisfaction?',
        keywords: [
          {
            keyword: 'Security',
            example:
              'Job stability provides financial security and peace of mind, reducing stress about future employment.',
          },
          {
            keyword: 'Motivation',
            example:
              'Job satisfaction increases motivation and engagement, which can improve performance and career growth.',
          },
          {
            keyword: 'Expectations',
            example:
              'The choice between stability and satisfaction depends on individual expectations, life stage, and financial situation.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'While stability reduces financial stress, job satisfaction is crucial for mental wellbeing and overall happiness.',
          },
          {
            keyword: 'Long-term goals',
            example:
              'Long-term goals influence whether stability or satisfaction matters more - some prioritize security, others fulfillment.',
          },
        ],
      },
      {
        question: 'Are emotions or logic more important in decision-making?',
        keywords: [
          {
            keyword: 'Intuition',
            example:
              'Emotional intuition can provide valuable insights that pure logic might miss, especially in personal and social decisions.',
          },
          {
            keyword: 'Analysis',
            example:
              'Logical analysis helps evaluate options objectively, reducing bias and making decisions based on facts and evidence.',
          },
          {
            keyword: 'Judgement',
            example:
              'Good judgment often requires balancing emotions and logic, using both to make well-rounded decisions.',
          },
          {
            keyword: 'Balance',
            example:
              'The best decisions typically balance emotional intelligence with logical reasoning, rather than relying on one alone.',
          },
          {
            keyword: 'Priorities',
            example:
              'The importance of emotions versus logic depends on the decision type - personal choices may favor emotions, business decisions logic.',
          },
        ],
      },
      {
        question: 'Is it better to travel alone or with others?',
        keywords: [
          {
            keyword: 'Freedom',
            example:
              'Traveling alone offers complete freedom to make spontaneous decisions and follow personal interests without compromise.',
          },
          {
            keyword: 'Planning',
            example:
              'Traveling with others requires coordination and planning, which can be challenging but also ensures shared experiences.',
          },
          {
            keyword: 'Safety',
            example:
              'Traveling with others can provide safety through companionship, while solo travel requires greater self-reliance and awareness.',
          },
          {
            keyword: 'Connection',
            example:
              'Traveling with others creates shared memories and strengthens relationships through shared experiences.',
          },
          {
            keyword: 'Independence',
            example:
              'Solo travel develops independence and confidence, while group travel offers support and shared responsibility.',
          },
        ],
      },
      {
        question: 'Should businesses aim for gender-balanced teams?',
        keywords: [
          {
            keyword: 'Diversity',
            example:
              'Gender-balanced teams bring diverse perspectives and approaches that can improve problem-solving and innovation.',
          },
          {
            keyword: 'Equality',
            example:
              'Gender balance promotes equality by ensuring both men and women have equal opportunities in the workplace.',
          },
          {
            keyword: 'Representation',
            example:
              'Gender-balanced teams provide representation that reflects society and can inspire future generations.',
          },
          {
            keyword: 'Fairness',
            example:
              'Achieving gender balance should prioritize fairness and merit, ensuring the best candidates are selected regardless of gender.',
          },
          {
            keyword: 'Performance',
            example:
              'Research suggests diverse, gender-balanced teams often perform better due to varied perspectives and collaborative approaches.',
          },
        ],
      },
      {
        question: 'Is learning history important in school?',
        keywords: [
          {
            keyword: 'Identity',
            example:
              'Learning history helps students understand their cultural identity and how past events shape present society.',
          },
          {
            keyword: 'Awareness',
            example:
              'History education increases awareness of past mistakes and achievements, helping prevent repetition of errors.',
          },
          {
            keyword: 'Perspective',
            example:
              'Studying history provides perspective on current events by showing how similar situations were handled in the past.',
          },
          {
            keyword: 'Memory',
            example:
              'Preserving historical memory ensures important events and lessons are not forgotten by future generations.',
          },
          {
            keyword: 'Understanding',
            example:
              'Understanding history helps students comprehend how societies, cultures, and political systems have evolved over time.',
          },
        ],
      },
      {
        question: 'Should tourists learn basic phrases of the local language?',
        keywords: [
          {
            keyword: 'Communication',
            example:
              'Learning basic phrases improves communication with locals, making travel experiences more meaningful and easier.',
          },
          {
            keyword: 'Respect',
            example:
              'Making an effort to speak the local language shows respect for the culture and people of the destination.',
          },
          {
            keyword: 'Culture',
            example:
              'Learning language phrases provides insight into local culture and helps tourists connect more authentically with the place.',
          },
          {
            keyword: 'Preparation',
            example:
              'Learning basic phrases requires preparation before travel, but enhances the overall experience once at the destination.',
          },
          {
            keyword: 'Safety',
            example:
              'Knowing basic phrases can improve safety by enabling tourists to ask for help, directions, or emergency assistance.',
          },
        ],
      },
      {
        question: 'Is it better to work for a company or be self-employed?',
        keywords: [
          {
            keyword: 'Security',
            example:
              'Company employment typically provides more financial security with steady income, benefits, and job stability.',
          },
          {
            keyword: 'Independence',
            example:
              'Self-employment offers independence and autonomy, allowing control over work schedule, clients, and business decisions.',
          },
          {
            keyword: 'Risk',
            example:
              'Self-employment involves greater financial risk and uncertainty compared to the relative security of company employment.',
          },
          {
            keyword: 'Motivation',
            example:
              'Self-employment can increase motivation through direct connection between effort and reward, while company work offers structure.',
          },
          {
            keyword: 'Flexibility',
            example:
              'Self-employment provides flexibility in work location and hours, while company work offers structured routine and support.',
          },
        ],
      },
      {
        question: 'Should junk food be heavily taxed?',
        keywords: [
          {
            keyword: 'Health',
            example:
              'Taxing junk food could improve public health by reducing consumption of unhealthy, high-calorie foods.',
          },
          {
            keyword: 'Habits',
            example:
              'Higher prices from taxes may change eating habits, encouraging people to choose healthier alternatives.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Taxing junk food raises questions about personal responsibility versus government intervention in food choices.',
          },
          {
            keyword: 'Regulation',
            example:
              'Food taxes are a form of regulation that uses economic incentives to influence consumer behavior.',
          },
          {
            keyword: 'Prevention',
            example:
              'Junk food taxes could prevent obesity and related health problems by making unhealthy options less affordable.',
          },
        ],
      },
      {
        question: 'Is veganism the future of food?',
        keywords: [
          {
            keyword: 'Diet',
            example:
              'Vegan diets can be nutritionally complete, but require careful planning to ensure adequate protein, iron, and B12 intake.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Veganism supports sustainability by reducing environmental impact of animal agriculture, which uses significant resources.',
          },
          {
            keyword: 'Ethics',
            example:
              'Veganism addresses ethical concerns about animal welfare and the treatment of animals in food production.',
          },
          {
            keyword: 'Farming',
            example:
              'Widespread veganism would require major changes in farming practices, shifting from animal agriculture to plant-based production.',
          },
          {
            keyword: 'Consumer choices',
            example:
              'The future of food depends on consumer choices, with growing interest in plant-based options but continued demand for animal products.',
          },
        ],
      },
      {
        question: 'Is a complete ban on smoking a practical solution?',
        keywords: [
          {
            keyword: 'Addiction',
            example:
              'Smoking addiction makes a complete ban challenging, as addicted individuals may turn to illegal markets or suffer withdrawal.',
          },
          {
            keyword: 'Health',
            example:
              'A smoking ban could significantly improve public health by eliminating exposure to secondhand smoke and reducing smoking-related diseases.',
          },
          {
            keyword: 'Freedom',
            example:
              "A complete ban raises questions about personal freedom and the right to make choices about one's own body.",
          },
          {
            keyword: 'Regulation',
            example:
              'Strict regulation and gradual restrictions may be more practical than an immediate complete ban.',
          },
          {
            keyword: 'Consequences',
            example:
              'A smoking ban could have economic consequences for tobacco industries and governments that tax tobacco products.',
          },
        ],
      },
      {
        question: 'Is mental health more important than physical health?',
        keywords: [
          {
            keyword: 'Wellbeing',
            example:
              'Maintaining overall wellbeing requires attention to physical health, mental health, and emotional balance in daily life.',
          },
          {
            keyword: 'Balance',
            example:
              'Finding balance between work, personal life, and self-care is essential for long-term happiness and fulfillment.',
          },
          {
            keyword: 'Support',
            example:
              "Having a strong support network of family and friends is crucial for navigating life's challenges and maintaining mental health.",
          },
          {
            keyword: 'Stress',
            example:
              'Chronic stress can negatively impact both physical and mental health, making stress management techniques important for overall wellbeing.',
          },
          {
            keyword: 'Awareness',
            example:
              'Self-awareness helps individuals recognize their emotions, triggers, and needs, leading to better decision-making and personal growth.',
          },
        ],
      },
      {
        question:
          'Is it better to work in a job you love or a job that pays well?',
        keywords: [
          {
            keyword: 'Passion',
            example:
              'Following your passion in work can lead to greater job satisfaction and personal fulfillment, even if it means earning less money.',
          },
          {
            keyword: 'Security',
            example:
              'A well-paying job provides financial security and stability, allowing you to support yourself and your family without constant worry about money.',
          },
          {
            keyword: 'Fulfilment',
            example:
              'Working in a job you love can provide deep personal fulfillment and a sense of purpose that money alone cannot buy.',
          },
          {
            keyword: 'Motivation',
            example:
              'Intrinsic motivation from loving your work can drive better performance and career growth compared to extrinsic motivation from high pay alone.',
          },
          {
            keyword: 'Priorities',
            example:
              'The choice between passion and pay depends on individual priorities - some value financial security while others prioritize personal satisfaction.',
          },
        ],
      },
      {
        question: 'Is exercise more important than diet for a healthy life?',
        keywords: [
          {
            keyword: 'Nutrition',
            example:
              'Proper nutrition provides essential nutrients and energy, while exercise alone cannot compensate for poor dietary choices.',
          },
          {
            keyword: 'Fitness',
            example:
              'Regular exercise improves cardiovascular fitness, strength, and endurance that diet alone cannot achieve.',
          },
          {
            keyword: 'Metabolism',
            example:
              'Exercise boosts metabolism and helps maintain muscle mass, while diet provides the fuel needed for physical activity.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Both exercise and diet contribute to wellbeing - exercise improves mental health, while nutrition supports physical health.',
          },
          {
            keyword: 'Long-term health',
            example:
              'Long-term health requires both exercise and diet, as they work together to prevent disease and maintain optimal functioning.',
          },
        ],
      },
      {
        question: 'Should euthanasia be legal?',
        keywords: [
          {
            keyword: 'Dignity',
            example:
              'Euthanasia debates center on preserving human dignity and allowing individuals to die with respect and autonomy when facing terminal illness.',
          },
          {
            keyword: 'Suffering',
            example:
              'The question of whether to end suffering through euthanasia raises complex ethical questions about the value of life versus quality of life.',
          },
          {
            keyword: 'Rights',
            example:
              'Proponents argue that individuals have the right to make decisions about their own death when facing unbearable suffering.',
          },
          {
            keyword: 'Consent',
            example:
              'Informed consent is crucial in euthanasia discussions, ensuring individuals fully understand their choices and are not coerced.',
          },
          {
            keyword: 'Ethics',
            example:
              'The ethics of euthanasia involve balancing compassion for suffering individuals with the moral implications of intentionally ending a life.',
          },
        ],
      },
      {
        question: 'Are beauty standards harmful to society?',
        keywords: [
          {
            keyword: 'Confidence',
            example:
              'Unrealistic beauty standards can damage self-confidence, especially among young people who compare themselves to idealized images in media.',
          },
          {
            keyword: 'Representation',
            example:
              'Limited representation of diverse body types and appearances in media reinforces narrow beauty standards and excludes many people.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Harmful beauty standards negatively impact mental wellbeing, contributing to body dysmorphia, eating disorders, and depression.',
          },
          {
            keyword: 'Expectations',
            example:
              'Beauty standards set unrealistic expectations that are impossible for most people to meet, causing feelings of inadequacy and failure.',
          },
        ],
      },
      {
        question: 'Is it better to live in a small town or a big city?',
        keywords: [
          {
            keyword: 'Community',
            example:
              'Small towns often have stronger community bonds where neighbors know each other, while cities offer more anonymity and diversity.',
          },
          {
            keyword: 'Opportunities',
            example:
              'Big cities provide more job opportunities, cultural events, and career advancement, while small towns may offer slower-paced living.',
          },
          {
            keyword: 'Transport',
            example:
              'Cities typically have better public transport systems, while small towns may require car ownership for daily activities.',
          },
          {
            keyword: 'Cost of living',
            example:
              'Small towns generally have lower costs of living, while cities offer more amenities but at higher prices.',
          },
          {
            keyword: 'Diversity',
            example:
              'Cities offer greater cultural and social diversity, while small towns may have more homogeneous communities.',
          },
        ],
      },
      {
        question: 'Is social media addiction a real problem?',
        keywords: [
          {
            keyword: 'Habits',
            example:
              'Social media can create compulsive checking habits that interfere with daily life and reduce productivity.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Excessive social media use can negatively impact mental wellbeing through comparison, FOMO, and reduced real-world social interaction.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Social media addiction can alter behavior patterns, making people prioritize online interactions over face-to-face relationships.',
          },
          {
            keyword: 'Dependence',
            example:
              'Many people develop dependence on social media for validation and entertainment, experiencing anxiety when unable to access it.',
          },
          {
            keyword: 'Motivation',
            example:
              'Social media addiction can reduce motivation for real-world activities as people become more engaged with virtual experiences.',
          },
        ],
      },

      {
        question: 'Is travelling to dangerous countries worth the risk?',
        keywords: [
          {
            keyword: 'Adventure',
            example:
              'Traveling to challenging destinations can provide unique adventure and experiences that safer destinations may not offer.',
          },
          {
            keyword: 'Safety',
            example:
              'Traveling to dangerous countries involves significant safety risks that could result in harm, kidnapping, or other serious consequences.',
          },
          {
            keyword: 'Judgement',
            example:
              'Deciding to travel to dangerous countries requires careful judgment about personal risk tolerance and safety precautions.',
          },
          {
            keyword: 'Experience',
            example:
              'Visiting dangerous countries can provide valuable cultural experiences and perspectives, but at potential personal cost.',
          },
          {
            keyword: 'Awareness',
            example:
              'Travelers to dangerous countries must maintain constant awareness of their surroundings and potential threats.',
          },
        ],
      },
      {
        question:
          'Does tourism need stricter limits to protect the environment?',
        keywords: [
          {
            keyword: 'Overcrowding',
            example:
              'Tourism overcrowding can damage fragile ecosystems and cultural sites, requiring limits to preserve them for future generations.',
          },
          {
            keyword: 'Preservation',
            example:
              'Stricter tourism limits help preserve natural environments and cultural heritage sites from degradation and overuse.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Sustainable tourism requires balancing visitor access with environmental protection to ensure long-term viability.',
          },
          {
            keyword: 'Impact',
            example:
              'Mass tourism has significant environmental impact through pollution, resource consumption, and habitat destruction.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Tourism limits reflect responsibility to protect destinations while still allowing people to experience and appreciate them.',
          },
        ],
      },
      {
        question: 'Is it better to live in a city or the countryside?',
        keywords: [
          'Lifestyle',
          'Community',
          'Opportunities',
          'Environment',
          'Transport',
        ],
      },
      {
        question: 'Should air travel be reduced to help fight climate change?',
        keywords: [
          {
            keyword: 'Emissions',
            example:
              'Air travel produces significant greenhouse gas emissions that contribute to climate change, making reduction important.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Reducing air travel supports sustainability goals, but may limit global connectivity and cultural exchange.',
          },
          {
            keyword: 'Alternatives',
            example:
              'Alternatives like trains, video conferencing, or local travel can reduce emissions while maintaining some benefits of travel.',
          },
          {
            keyword: 'Impact',
            example:
              'Reducing air travel could have meaningful impact on emissions, but requires collective action and lifestyle changes.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Reducing air travel requires lifestyle adjustments, potentially limiting travel opportunities and global experiences.',
          },
        ],
      },
      {
        question: 'Are all-inclusive resorts bad for local communities?',
        keywords: [
          {
            keyword: 'Tourism',
            example:
              'All-inclusive resorts can bring tourism revenue, but may prevent money from reaching local businesses and communities.',
          },
          {
            keyword: 'Employment',
            example:
              'Resorts create jobs for locals, but often offer low wages and limited career advancement opportunities.',
          },
          {
            keyword: 'Culture',
            example:
              'All-inclusive resorts may isolate tourists from local culture, reducing authentic cultural exchange and understanding.',
          },
          {
            keyword: 'Development',
            example:
              'Resort development can bring infrastructure improvements, but may also displace local communities or damage environments.',
          },
          {
            keyword: 'Dependence',
            example:
              'Communities can become dependent on resort tourism, making them vulnerable to economic downturns or changing travel trends.',
          },
        ],
      },
      {
        question:
          'Is it better to invest in experiences rather than material possessions?',
        keywords: [
          {
            keyword: 'Memories',
            example:
              'Experiences create lasting memories and emotional connections that material possessions often cannot match.',
          },
          {
            keyword: 'Value',
            example:
              'Experiences may provide greater long-term value through personal growth and happiness compared to material goods.',
          },
          {
            keyword: 'Satisfaction',
            example:
              'Research suggests experiences often provide more lasting satisfaction than material purchases, which can lose appeal over time.',
          },
          {
            keyword: 'Priorities',
            example:
              'Choosing experiences over possessions reflects priorities focused on personal growth and relationships rather than accumulation.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Investing in experiences supports a lifestyle focused on adventure, learning, and meaningful connections.',
          },
        ],
      },
      {
        question: 'Should students be allowed to grade their teachers?',
        keywords: [
          {
            keyword: 'Feedback',
            example:
              'Student feedback can provide valuable insights into teaching effectiveness and areas for improvement.',
          },
          {
            keyword: 'Fairness',
            example:
              'Student evaluations may not be fair if influenced by grades received or personal preferences rather than teaching quality.',
          },
          {
            keyword: 'Performance',
            example:
              'Student input can help improve teacher performance, but may also create pressure to please students rather than educate them.',
          },
          {
            keyword: 'Motivation',
            example:
              'Knowing students will evaluate them can motivate teachers to improve, but may also lead to grade inflation.',
          },
          {
            keyword: 'Accountability',
            example:
              'Student evaluations provide accountability for teachers, ensuring they meet educational standards and student needs.',
          },
        ],
      },
      {
        question: 'Is honesty always the best policy?',
        keywords: [
          {
            keyword: 'Trust',
            example:
              'Honesty builds trust in relationships, but brutal honesty without consideration can damage trust and hurt others.',
          },
          {
            keyword: 'Consequences',
            example:
              'While honesty is generally positive, there are situations where truth-telling can cause unnecessary harm or conflict.',
          },
          {
            keyword: 'Relationships',
            example:
              'Honest communication strengthens relationships, but timing and delivery of honesty matter greatly.',
          },
          {
            keyword: 'Integrity',
            example:
              'Maintaining integrity through honesty is important, but must be balanced with compassion and wisdom.',
          },
          {
            keyword: 'Communication',
            example:
              'Effective communication requires honesty, but also sensitivity to context and the impact of words.',
          },
        ],
      },
      {
        question: 'Can money buy happiness?',
        keywords: [
          {
            keyword: 'Freedom',
            example:
              'Money provides freedom to make choices about work, lifestyle, and experiences that can contribute to happiness.',
          },
          {
            keyword: 'Comfort',
            example:
              'Financial resources provide comfort and reduce stress about basic needs, which can improve overall wellbeing.',
          },
          {
            keyword: 'Security',
            example:
              'Money offers security that reduces anxiety about the future, contributing to peace of mind and happiness.',
          },
          {
            keyword: 'Satisfaction',
            example:
              'While money can buy comfort and security, true satisfaction often comes from relationships, purpose, and personal growth.',
          },
          {
            keyword: 'Priorities',
            example:
              'The relationship between money and happiness depends on priorities - some value financial security, others value experiences or relationships.',
          },
        ],
      },
      {
        question: 'Is it ever acceptable to lie?',
        keywords: [
          {
            keyword: 'Trust',
            example:
              'Lying can damage trust in relationships, but white lies to protect feelings may sometimes preserve relationships.',
          },
          {
            keyword: 'Intention',
            example:
              'The acceptability of lying depends on intention - protecting someone from harm versus deceiving for personal gain.',
          },
          {
            keyword: 'Consequences',
            example:
              'Lies can have serious consequences, but in some situations, truth-telling may cause greater harm.',
          },
          {
            keyword: 'Relationships',
            example:
              'Honesty generally strengthens relationships, but there may be rare situations where a lie prevents unnecessary hurt.',
          },
          {
            keyword: 'Judgement',
            example:
              'Whether lying is acceptable requires careful judgment about context, consequences, and ethical principles.',
          },
        ],
      },
      {
        question: 'Should the death penalty be abolished worldwide?',
        keywords: [
          {
            keyword: 'Justice',
            example:
              'The death penalty raises questions about whether it truly serves justice or perpetuates violence in society.',
          },
          {
            keyword: 'Punishment',
            example:
              'Debates about capital punishment center on whether it is an appropriate punishment for the most serious crimes.',
          },
          {
            keyword: 'Rights',
            example:
              'The right to life is fundamental, but questions arise about whether criminals forfeit this right through their actions.',
          },
          {
            keyword: 'Evidence',
            example:
              'The risk of executing innocent people due to flawed evidence is a major concern in death penalty debates.',
          },
          {
            keyword: 'Morality',
            example:
              'The morality of state-sanctioned killing is deeply contested, with strong arguments on both sides.',
          },
        ],
      },
      {
        question: 'Should everyone learn basic first aid?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Basic first aid knowledge can save lives in emergencies, making it essential for public safety and preparedness.',
          },
          {
            keyword: 'Responsibility',
            example:
              'There is a civic responsibility to be able to help others in emergency situations when medical professionals are not immediately available.',
          },
          {
            keyword: 'Emergencies',
            example:
              'Knowing first aid prepares individuals to respond effectively to medical emergencies before professional help arrives.',
          },
          {
            keyword: 'Awareness',
            example:
              'First aid training increases awareness of potential hazards and how to prevent accidents from becoming life-threatening situations.',
          },
        ],
      },
      {
        question: 'Should universities have a dress code?',
        keywords: [
          {
            keyword: 'Professionalism',
            example:
              'Dress codes can prepare students for professional environments, teaching appropriate workplace attire and presentation.',
          },
          {
            keyword: 'Expression',
            example:
              'Dress codes may limit self-expression and individuality, which are important aspects of personal development in university.',
          },
          {
            keyword: 'Culture',
            example:
              'University dress codes should respect diverse cultural dress practices and not impose Western standards.',
          },
          {
            keyword: 'Comfort',
            example:
              'Dress codes may require uncomfortable clothing that interferes with learning, while casual dress can improve focus.',
          },
          {
            keyword: 'Expectations',
            example:
              'Dress codes set expectations about appropriate attire, but may be unnecessary for adult university students.',
          },
        ],
      },
      {
        question: 'Is reading books better than listening to audiobooks?',
        keywords: [
          {
            keyword: 'Focus',
            example:
              'Reading requires active focus and engagement, while audiobooks allow multitasking but may reduce deep concentration.',
          },
          {
            keyword: 'Imagination',
            example:
              'Both reading and audiobooks stimulate imagination, though reading may allow more personal interpretation of voices and pacing.',
          },
          {
            keyword: 'Convenience',
            example:
              'Audiobooks offer convenience for commuting, exercising, or multitasking, while reading requires dedicated time and attention.',
          },
          {
            keyword: 'Comprehension',
            example:
              'Some people comprehend better through reading, while others benefit from auditory learning through audiobooks.',
          },
          {
            keyword: 'Habits',
            example:
              'Audiobooks can help develop reading habits for busy people, while traditional reading may require more discipline.',
          },
        ],
      },
      {
        question: 'Should parents control their children’s social media use?',
        keywords: [
          'Privacy',
          'Safety',
          'Supervision',
          'Communication',
          'Boundaries',
        ],
      },
      {
        question:
          'Do genetically modified foods require stricter safety controls?',
        keywords: [
          {
            keyword: 'Health',
            example:
              'Genetically modified foods raise health concerns about potential long-term effects on human health and nutrition.',
          },
          {
            keyword: 'Farming',
            example:
              'GMOs can help farming by increasing crop yields and resistance to pests, potentially reducing the need for pesticides.',
          },
          {
            keyword: 'Innovation',
            example:
              'Genetic modification represents agricultural innovation that could help address global food security challenges.',
          },
          {
            keyword: 'Regulation',
            example:
              'Strict regulation of GMOs is necessary to ensure safety, but excessive regulation may hinder beneficial innovations.',
          },
          {
            keyword: 'Trust',
            example:
              'Public trust in GMOs depends on transparent research, clear labeling, and honest communication about risks and benefits.',
          },
        ],
      },
      {
        question: 'Should we always respect authority?',
        keywords: [
          {
            keyword: 'Rules',
            example:
              'While rules and laws are important for social order, blind respect for authority can prevent necessary questioning and reform of unjust systems.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Respecting authority should be balanced with personal responsibility to challenge authority when it acts unjustly or abuses power.',
          },
          {
            keyword: 'Trust',
            example:
              'Respect for authority depends on whether that authority has earned trust through fair, transparent, and ethical behavior.',
          },
          {
            keyword: 'Fairness',
            example:
              'Authority deserves respect when it acts with fairness and justice, but should be questioned when it perpetuates inequality or injustice.',
          },
          {
            keyword: 'Power',
            example:
              'Unquestioning respect for authority can enable abuse of power, making it important to maintain healthy skepticism and accountability.',
          },
        ],
      },
      {
        question: 'Is it better to live in a multicultural society?',
        keywords: [
          {
            keyword: 'Diversity',
            example:
              "Multicultural societies benefit from diversity, bringing together different perspectives, ideas, and cultural practices that enrich everyone's lives.",
          },
          {
            keyword: 'Tolerance',
            example:
              'Living in a multicultural society requires tolerance and respect for different customs, beliefs, and ways of life.',
          },
          {
            keyword: 'Identity',
            example:
              'In multicultural societies, individuals can maintain their cultural identity while also participating in a broader shared community.',
          },
          {
            keyword: 'Community',
            example:
              'Multicultural communities can be stronger when they celebrate differences while building common bonds and shared values.',
          },
          {
            keyword: 'Opportunities',
            example:
              'Multicultural societies offer more opportunities for cultural exchange, learning, and personal growth through exposure to different perspectives.',
          },
        ],
      },
      {
        question: 'Is music more powerful than books?',
        keywords: [
          {
            keyword: 'Emotion',
            example:
              'Music can evoke immediate emotional responses and create powerful moods that books may take longer to establish.',
          },
          {
            keyword: 'Creativity',
            example:
              'Both music and books inspire creativity, but music provides immediate sensory experience while books require more active engagement.',
          },
          {
            keyword: 'Memory',
            example:
              'Music can trigger strong memories and associations, while books create detailed mental images and narratives.',
          },
          {
            keyword: 'Imagination',
            example:
              'Books may stimulate imagination more by requiring readers to visualize, while music provides the auditory experience directly.',
          },
          {
            keyword: 'Expression',
            example:
              'Both music and books are powerful forms of expression, but music can communicate emotions instantly without language barriers.',
          },
        ],
      },
      {
        question: 'Is free healthcare essential for a fair society?',
        keywords: [
          {
            keyword: 'Access',
            example:
              'Universal healthcare ensures that all citizens have access to medical care regardless of their financial situation.',
          },
          {
            keyword: 'Equality',
            example:
              'Healthcare equality means everyone receives the same quality of care, eliminating disparities based on income or social status.',
          },
          {
            keyword: 'Cost',
            example:
              'Universal healthcare systems can reduce overall healthcare costs through preventive care and centralized administration.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Universal healthcare promotes public wellbeing by ensuring people seek medical attention early rather than delaying due to cost concerns.',
          },
          {
            keyword: 'Responsibility',
            example:
              'There is debate about whether healthcare is a government responsibility or an individual responsibility to manage through insurance.',
          },
        ],
      },
      {
        question: 'Should athletes and celebrities avoid political issues?',
        keywords: [
          {
            keyword: 'Influence',
            example:
              'Celebrities and athletes have significant influence over public opinion, which raises questions about their responsibility to use it wisely.',
          },
          {
            keyword: 'Reputation',
            example:
              "Speaking out on political issues can damage a celebrity's reputation and brand, potentially affecting their career and income.",
          },
          {
            keyword: 'Awareness',
            example:
              'Celebrities can raise awareness about important political issues, bringing attention to causes that might otherwise be overlooked.',
          },
          {
            keyword: 'Freedom',
            example:
              'Celebrities have the same freedom of speech as anyone else, but their platform amplifies their voice in ways that require consideration.',
          },
        ],
      },
      {
        question: 'Is binge-watching TV shows unhealthy?',
        keywords: [
          {
            keyword: 'Habits',
            example:
              'Screen time before bed can disrupt healthy sleep habits and create dependency on devices for relaxation.',
          },
          {
            keyword: 'Sleep',
            example:
              'Excessive screen time, especially before bed, can interfere with sleep quality and duration, affecting overall health.',
          },
          {
            keyword: 'Attention',
            example:
              'Constant screen use can fragment attention spans and reduce the ability to focus on tasks that require sustained concentration.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'While screens can provide entertainment and connection, excessive use can negatively impact mental and physical wellbeing.',
          },
          {
            keyword: 'Balance',
            example:
              'Finding balance between screen time and offline activities is essential for maintaining healthy relationships and personal development.',
          },
        ],
      },
      {
        question:
          'Should influencers be held responsible for promoting unhealthy lifestyles?',
        keywords: [
          {
            keyword: 'Impact',
            example:
              "Influencers have significant impact on their followers' choices, especially young people who may not recognize marketing tactics.",
          },
          {
            keyword: 'Behaviour',
            example:
              'Promoting unhealthy behaviors like extreme dieting or dangerous challenges can normalize harmful practices among impressionable followers.',
          },
          {
            keyword: 'Transparency',
            example:
              'Influencers should be transparent about sponsored content and the potential health impacts of products they promote.',
          },
          {
            keyword: 'Reputation',
            example:
              'Influencers who promote unhealthy lifestyles risk damaging their reputation and losing trust with their audience.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Influencers bear responsibility for the messages they promote, especially when they affect vulnerable audiences like teenagers.',
          },
        ],
      },
      {
        question: 'Is reading better than watching movies?',
        keywords: [
          {
            keyword: 'Creativity',
            example:
              'Reading requires more active creativity as readers must visualize scenes, while movies provide visual interpretation.',
          },
          {
            keyword: 'Detail',
            example:
              'Books can explore internal thoughts and detailed descriptions that movies may struggle to convey in limited screen time.',
          },
          {
            keyword: 'Imagination',
            example:
              'Reading stimulates imagination by requiring mental visualization, while movies provide ready-made visual experiences.',
          },
          {
            keyword: 'Engagement',
            example:
              'Both reading and movies can be engaging, but reading requires sustained attention while movies may be more passive.',
          },
          {
            keyword: 'Interpretation',
            example:
              "Reading allows personal interpretation of characters and events, while movies present a director's specific vision.",
          },
        ],
      },
      {
        question: 'Should comedians be allowed to joke about anything?',
        keywords: [
          {
            keyword: 'Freedom',
            example:
              'Comedians should have freedom of expression, but this freedom must be balanced with responsibility and respect.',
          },
          {
            keyword: 'Offence',
            example:
              'Jokes that cause offense may perpetuate harmful stereotypes or hurt marginalized groups, even if unintended.',
          },
          {
            keyword: 'Boundaries',
            example:
              'While comedy pushes boundaries, there should be limits when jokes cause real harm or promote discrimination.',
          },
          {
            keyword: 'Expression',
            example:
              'Comedy is a form of expression that can challenge norms and provide social commentary, but should consider impact.',
          },
          {
            keyword: 'Sensitivity',
            example:
              'Comedians should consider sensitivity to different groups while maintaining the ability to address difficult topics through humor.',
          },
        ],
      },
      {
        question: 'Are awards shows still relevant today?',
        keywords: [
          {
            keyword: 'Recognition',
            example:
              'Awards shows provide recognition for artistic achievement, but may not always reflect true merit or quality.',
          },
          {
            keyword: 'Popularity',
            example:
              'Awards often reflect popularity and industry politics rather than genuine artistic excellence or innovation.',
          },
          {
            keyword: 'Standards',
            example:
              'Awards shows can set industry standards and influence what types of work get produced and recognized.',
          },
          {
            keyword: 'Influence',
            example:
              'Awards shows have significant influence on careers and public perception, even if their relevance is questioned.',
          },
          {
            keyword: 'Reputation',
            example:
              'Winning awards can enhance reputation and career opportunities, making awards shows important for industry professionals.',
          },
        ],
      },
      {
        question: 'Should video games be considered a form of art?',
        keywords: [
          {
            keyword: 'Creativity',
            example:
              'Video games require immense creativity in design, narrative, music, and visual art, combining multiple artistic disciplines.',
          },
          {
            keyword: 'Storytelling',
            example:
              'Many video games tell complex, emotionally engaging stories that rival literature and film in narrative depth.',
          },
          {
            keyword: 'Design',
            example:
              'Game design involves artistic vision in creating worlds, characters, and experiences that evoke emotion and meaning.',
          },
          {
            keyword: 'Innovation',
            example:
              'Video games represent innovative art forms that allow interactive experiences impossible in traditional media.',
          },
          {
            keyword: 'Expression',
            example:
              'Games can express ideas, emotions, and social commentary, fulfilling the same expressive function as traditional art.',
          },
        ],
      },
      {
        question:
          'Is banning plastic bags the most effective way to reduce waste?',
        keywords: [
          {
            keyword: 'Pollution',
            example:
              'Plastic bag bans can reduce pollution and environmental damage, but may not address larger sources of plastic waste.',
          },
          {
            keyword: 'Habits',
            example:
              'Bans can change consumer habits, encouraging reusable bags, but may create inconvenience that reduces compliance.',
          },
          {
            keyword: 'Alternatives',
            example:
              'Alternatives like reusable bags or paper bags have their own environmental impacts that must be considered.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Plastic bag bans support sustainability goals, but effectiveness depends on consumer behavior and alternative options.',
          },
          {
            keyword: 'Convenience',
            example:
              'Bans may reduce convenience for consumers, potentially leading to resistance or finding ways around restrictions.',
          },
        ],
      },
      {
        question: 'Is climate change the biggest threat to humanity?',
        keywords: [
          {
            keyword: 'Disasters',
            example:
              'Climate change increases frequency and severity of natural disasters, threatening lives, infrastructure, and economies.',
          },
          {
            keyword: 'Resources',
            example:
              'Climate change threatens essential resources like water, food, and habitable land, creating potential conflicts.',
          },
          {
            keyword: 'Impact',
            example:
              'The long-term impact of climate change on global systems could be catastrophic if not addressed urgently.',
          },
          {
            keyword: 'Instability',
            example:
              'Climate change creates political and economic instability through resource scarcity, displacement, and conflict.',
          },
          {
            keyword: 'Survival',
            example:
              'Climate change poses existential threats to human survival through extreme weather, sea-level rise, and ecosystem collapse.',
          },
        ],
      },
      {
        question:
          'Is it better to have a small circle of friends or a large one?',
        keywords: [
          {
            keyword: 'Support',
            example:
              'Small friend circles often provide deeper emotional support, while large networks offer broader but potentially shallower connections.',
          },
          {
            keyword: 'Closeness',
            example:
              'Small circles allow for closer, more intimate friendships, while large networks may have more casual relationships.',
          },
          {
            keyword: 'Trust',
            example:
              'Small friend groups can build stronger trust through deeper bonds, while large networks may have more varied trust levels.',
          },
          {
            keyword: 'Diversity',
            example:
              'Large friend networks offer more diversity in perspectives and experiences, while small circles may be more homogeneous.',
          },
          {
            keyword: 'Communication',
            example:
              'Small circles allow for more frequent, meaningful communication, while large networks require more effort to maintain.',
          },
        ],
      },
      {
        question: 'Should cars be banned in city centres?',
        keywords: [
          {
            keyword: 'Traffic',
            example:
              'Banning cars can reduce traffic congestion and improve flow for public transport, cyclists, and pedestrians.',
          },
          {
            keyword: 'Pollution',
            example:
              'Car bans significantly reduce air and noise pollution in city centers, improving public health and quality of life.',
          },
          {
            keyword: 'Accessibility',
            example:
              'Car bans may limit accessibility for people with disabilities, elderly, or those who cannot use alternative transport.',
          },
          {
            keyword: 'Planning',
            example:
              'Effective car bans require careful urban planning to ensure alternative transport options are available and convenient.',
          },
          {
            keyword: 'Safety',
            example:
              'Removing cars from city centers improves pedestrian and cyclist safety, reducing accidents and creating safer spaces.',
          },
        ],
      },
      {
        question: 'Is nuclear energy a reliable long-term solution?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Nuclear energy has safety risks from accidents and waste disposal, but modern technology has improved safety significantly.',
          },
          {
            keyword: 'Cost',
            example:
              'Nuclear power requires high initial costs but provides stable, long-term energy production once operational.',
          },
          {
            keyword: 'Reliability',
            example:
              'Nuclear energy provides reliable, consistent power generation regardless of weather, unlike some renewable sources.',
          },
          {
            keyword: 'Emissions',
            example:
              'Nuclear energy produces minimal greenhouse gas emissions, making it attractive for climate change mitigation.',
          },
          {
            keyword: 'Sustainability',
            example:
              'While nuclear reduces emissions, questions about waste disposal and uranium availability affect long-term sustainability.',
          },
        ],
      },
      {
        question: 'Is bottled water harmful enough to justify a complete ban?',
        keywords: [
          {
            keyword: 'Waste',
            example:
              'Bottled water creates massive plastic waste that pollutes oceans and landfills, contributing to environmental damage.',
          },
          {
            keyword: 'Pollution',
            example:
              'Plastic bottle production and disposal cause significant pollution, from manufacturing emissions to ocean plastic.',
          },
          {
            keyword: 'Access',
            example:
              'Bottled water provides access to clean water in areas with unsafe tap water, making complete bans problematic.',
          },
          {
            keyword: 'Convenience',
            example:
              'Bottled water offers convenience for travel and emergencies, but this convenience comes at environmental cost.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Reducing bottled water consumption reflects environmental responsibility, but bans may be too restrictive in some contexts.',
          },
        ],
      },
      {
        question: 'Are electric cars really better for the environment?',
        keywords: [
          {
            keyword: 'Emissions',
            example:
              'Electric cars produce zero tailpipe emissions, but manufacturing and electricity generation still create environmental impact.',
          },
          {
            keyword: 'Resources',
            example:
              'Electric cars require rare earth minerals and battery materials that have environmental costs in mining and production.',
          },
          {
            keyword: 'Efficiency',
            example:
              'Electric vehicles are more energy-efficient than gasoline cars, converting more energy to motion with less waste.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Electric cars are more sustainable when powered by renewable energy, but less so when using fossil fuel-generated electricity.',
          },
          {
            keyword: 'Cost',
            example:
              'While electric cars have higher upfront costs, they can be more cost-effective long-term and reduce environmental costs.',
          },
        ],
      },
      {
        question:
          'Is it ever acceptable to limit family size for environmental or social reasons?',
        keywords: [
          {
            keyword: 'Resources',
            example:
              'Limiting family size can reduce resource consumption and environmental impact, but raises questions about personal freedom.',
          },
          {
            keyword: 'Freedom',
            example:
              'Family size limits restrict reproductive freedom, which conflicts with fundamental human rights and personal autonomy.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Some argue that environmental responsibility requires smaller families, while others see this as overreach into personal decisions.',
          },
          {
            keyword: 'Population',
            example:
              'Population control policies aim to address overpopulation concerns, but implementation raises ethical and practical challenges.',
          },
          {
            keyword: 'Ethics',
            example:
              'Limiting family size involves complex ethics balancing individual rights, environmental concerns, and social responsibility.',
          },
        ],
      },
      {
        question: 'Is it ethical to keep animals in zoos?',
        keywords: [
          {
            keyword: 'Conservation',
            example:
              'Zoos contribute to conservation efforts by breeding endangered species and supporting wildlife protection programs.',
          },
          {
            keyword: 'Welfare',
            example:
              'Zoo captivity may compromise animal welfare by restricting natural behaviors, space, and social structures.',
          },
          {
            keyword: 'Education',
            example:
              'Zoos provide educational opportunities that help people understand and appreciate wildlife, fostering conservation awareness.',
          },
          {
            keyword: 'Captivity',
            example:
              'Keeping animals in captivity raises ethical questions about depriving them of natural habitats and freedom.',
          },
          {
            keyword: 'Protection',
            example:
              'Zoos can protect animals from threats in the wild, but may also prevent them from living natural lives.',
          },
        ],
      },
      {
        question:
          'Should there be penalties for failing to meet climate targets?',
        keywords: [
          'Accountability',
          'Responsibility',
          'Emissions',
          'Reputation',
          'Consequences',
        ],
      },
      {
        question:
          'Is a universal basic income a realistic way to reduce poverty?',
        keywords: [
          {
            keyword: 'Security',
            example:
              'Universal basic income provides financial security that can reduce poverty and allow people to pursue education or better opportunities.',
          },
          {
            keyword: 'Opportunity',
            example:
              'Basic income creates opportunities for people to take risks, start businesses, or improve their situation without fear of destitution.',
          },
          {
            keyword: 'Inequality',
            example:
              'UBI can reduce inequality by ensuring everyone has a minimum income floor, but funding it requires significant tax changes.',
          },
          {
            keyword: 'Stability',
            example:
              'Basic income provides economic stability that can reduce poverty-related stress and improve overall wellbeing.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Critics question whether UBI reduces personal responsibility, while supporters argue it enables people to make better choices.',
          },
        ],
      },
      {
        question: 'Is democracy the best form of government?',
        keywords: [
          'Freedom',
          'Representation',
          'Stability',
          'Participation',
          'Fairness',
        ],
      },

      {
        question:
          'Is travelling by public transport the best way to reduce traffic problems?',
        keywords: [
          {
            keyword: 'Accessibility',
            example:
              'Public transport must be accessible and convenient to attract users away from cars, requiring good coverage and frequency.',
          },
          {
            keyword: 'Congestion',
            example:
              'Public transport can significantly reduce traffic congestion by moving more people in less space than private vehicles.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Public transport is more sustainable than private cars, reducing emissions and resource consumption per passenger.',
          },
          {
            keyword: 'Planning',
            example:
              'Effective public transport requires careful urban planning and investment in infrastructure to be a viable alternative.',
          },
          {
            keyword: 'Efficiency',
            example:
              'Well-designed public transport can be more efficient than cars for many trips, but may be less convenient for some routes.',
          },
        ],
      },
      {
        question: 'Are smartphones reducing people’s attention spans?',
        keywords: [
          'Distraction',
          'Habits',
          'Behaviour',
          'Concentration',
          'Technology',
        ],
      },
      {
        question:
          'Should companies give employees more control over their schedules?',
        keywords: [
          {
            keyword: 'Flexibility',
            example:
              'Flexible schedules allow employees to balance work with personal responsibilities, improving work-life integration.',
          },
          {
            keyword: 'Autonomy',
            example:
              'Giving employees control over schedules increases autonomy and trust, which can boost job satisfaction and performance.',
          },
          {
            keyword: 'Motivation',
            example:
              'Schedule control can increase motivation by allowing employees to work when they are most productive and engaged.',
          },
          {
            keyword: 'Productivity',
            example:
              'Flexible scheduling can improve productivity by matching work times to individual peak performance periods.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Control over schedules improves employee wellbeing by reducing stress and allowing better work-life balance.',
          },
        ],
      },
      {
        question: 'Is it better to learn from mistakes or avoid them entirely?',
        keywords: [
          {
            keyword: 'Experience',
            example:
              'Real-world experience provides practical knowledge and skills that cannot be fully learned through theoretical study alone.',
          },
          {
            keyword: 'Risk',
            example:
              'Taking risks and making mistakes is an essential part of learning, but it must be balanced with safety and guidance.',
          },
          {
            keyword: 'Growth',
            example:
              'Personal growth often comes from challenging experiences that push individuals outside their comfort zones.',
          },
          {
            keyword: 'Resilience',
            example:
              'Learning from failures and setbacks builds resilience, teaching individuals to persevere and adapt when facing difficulties.',
          },
          {
            keyword: 'Judgement',
            example:
              'Experience helps develop good judgement and decision-making skills that are crucial for navigating complex real-world situations.',
          },
        ],
      },
      {
        question: 'Should schools offer more practical science experiments?',
        keywords: [
          {
            keyword: 'Engagement',
            example:
              'Hands-on science experiments increase student engagement by making abstract concepts tangible and interactive.',
          },
          {
            keyword: 'Understanding',
            example:
              'Experiments help students develop deeper understanding of scientific principles by seeing them in action rather than just reading about them.',
          },
          {
            keyword: 'Safety',
            example:
              'Practical experiments require careful attention to safety protocols to protect students while they learn through hands-on experience.',
          },
          {
            keyword: 'Resources',
            example:
              'Conducting more experiments requires additional resources including equipment, materials, and potentially more teacher training.',
          },
        ],
      },
      {
        question: 'Do loyalty rewards encourage unnecessary spending?',
        keywords: [
          {
            keyword: 'Temptation',
            example:
              "Loyalty rewards create temptation to spend more to reach reward thresholds, even when purchases aren't necessary.",
          },
          {
            keyword: 'Behaviour',
            example:
              "Reward programs can change spending behavior, encouraging purchases that wouldn't occur without the incentive.",
          },
          {
            keyword: 'Value',
            example:
              'While rewards provide value, they may encourage spending that exceeds the actual value received from rewards.',
          },
          {
            keyword: 'Marketing',
            example:
              'Loyalty programs are marketing strategies designed to increase customer spending and brand loyalty.',
          },
          {
            keyword: 'Decisions',
            example:
              "Rewards can influence purchasing decisions, making people buy things they don't need to earn points or maintain status.",
          },
        ],
      },
      {
        question: 'Should some city areas become completely car-free?',
        keywords: [
          'Pollution',
          'Safety',
          'Planning',
          'Mobility',
          'Environment',
        ],
      },
      {
        question: 'Is sharing personal achievements online harmful or helpful?',
        keywords: [
          {
            keyword: 'Confidence',
            example:
              'Sharing achievements can boost confidence and provide validation, but may create dependence on external approval.',
          },
          {
            keyword: 'Comparison',
            example:
              'Sharing achievements can inspire others, but may also trigger unhealthy comparison and feelings of inadequacy.',
          },
          {
            keyword: 'Motivation',
            example:
              'Publicly sharing goals and achievements can increase motivation and accountability, helping people follow through.',
          },
          {
            keyword: 'Perception',
            example:
              'Sharing achievements shapes how others perceive you, which can be positive for networking but may seem boastful.',
          },
          {
            keyword: 'Influence',
            example:
              'Sharing achievements can positively influence others to pursue their goals, but may also create pressure to perform.',
          },
        ],
      },
      {
        question: 'Should schools require students to participate in sports?',
        keywords: [
          {
            keyword: 'Fitness',
            example:
              'Physical education classes promote fitness and help students develop healthy exercise habits that can last a lifetime.',
          },
          {
            keyword: 'Teamwork',
            example:
              'PE classes teach teamwork and cooperation through group activities and team sports, building important social skills.',
          },
          {
            keyword: 'Discipline',
            example:
              'Regular physical education instills discipline and commitment to maintaining an active lifestyle and healthy habits.',
          },
          {
            keyword: 'Health',
            example:
              'PE classes contribute to overall health by reducing sedentary behavior and promoting cardiovascular fitness and strength.',
          },
          {
            keyword: 'Engagement',
            example:
              'Physical activities can increase student engagement and provide a break from academic work, potentially improving focus in other subjects.',
          },
        ],
      },
      {
        question: 'Are subscription services becoming too expensive?',
        keywords: [
          {
            keyword: 'Cost',
            example:
              'The cumulative cost of multiple subscription services can add up quickly, making them unaffordable for many consumers.',
          },
          {
            keyword: 'Value',
            example:
              'Consumers must evaluate whether subscription services provide sufficient value relative to their cost and usage frequency.',
          },
          {
            keyword: 'Convenience',
            example:
              'Subscription services offer convenience through automatic delivery and access, but this convenience comes at a premium price.',
          },
          {
            keyword: 'Habits',
            example:
              'Subscription models create habits of automatic renewal that can lead to paying for services that are no longer used or needed.',
          },
          {
            keyword: 'Expectations',
            example:
              'As subscription prices rise, consumer expectations for quality and value increase, creating pressure on service providers to deliver more.',
          },
        ],
      },

      {
        question:
          'Is mental health support receiving enough attention and resources today?',
        keywords: [
          {
            keyword: 'Access',
            example:
              'Improving access to mental health support ensures that people can get help when they need it, regardless of financial barriers.',
          },
          {
            keyword: 'Support',
            example:
              'Adequate mental health support includes counseling, therapy, and community resources that help people manage their mental wellbeing.',
          },
          {
            keyword: 'Awareness',
            example:
              'Increasing awareness about mental health reduces stigma and encourages people to seek help without shame or fear of judgment.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Mental health support is essential for overall wellbeing, as mental and physical health are deeply interconnected.',
          },
          {
            keyword: 'Prevention',
            example:
              'Early mental health support can prevent more serious conditions from developing and reduce the need for crisis intervention later.',
          },
        ],
      },
      {
        question:
          'Is it better to focus on long-term goals or short-term success?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Short-term successes provide immediate motivation and positive reinforcement, while long-term goals require sustained motivation over time.',
          },
          {
            keyword: 'Priorities',
            example:
              'Deciding between long-term and short-term focus depends on individual priorities and what matters most in different life stages.',
          },
          {
            keyword: 'Planning',
            example:
              'Long-term goals require careful planning and strategic thinking, while short-term success can be achieved with more immediate action.',
          },
          {
            keyword: 'Achievement',
            example:
              'Both approaches can lead to achievement, but long-term goals often result in more significant and lasting accomplishments.',
          },
          {
            keyword: 'Discipline',
            example:
              'Long-term goals require greater discipline and the ability to stay committed even when immediate rewards are not visible.',
          },
        ],
      },
      {
        question: 'Should people be encouraged to take afternoon naps?',
        keywords: [
          'Energy',
          'Productivity',
          'Routine',
          'Health',
          'Performance',
        ],
      },
      {
        question: 'Do smartphones improve or damage relationships?',
        keywords: [
          {
            keyword: 'Communication',
            example:
              'Long-distance relationships require strong communication skills to maintain emotional connection despite physical separation.',
          },
          {
            keyword: 'Distance',
            example:
              'Physical distance can create challenges, but modern technology helps bridge the gap and maintain relationships across distances.',
          },
          {
            keyword: 'Habits',
            example:
              'Maintaining long-distance relationships requires developing new habits of regular communication and finding creative ways to stay connected.',
          },
          {
            keyword: 'Attention',
            example:
              'Long-distance relationships demand focused attention and intentional effort to make the other person feel valued and included in daily life.',
          },
          {
            keyword: 'Trust',
            example:
              'Trust is essential in long-distance relationships, as partners must have confidence in each other without constant physical presence.',
          },
        ],
      },
      {
        question: 'Should companies reduce email communication?',
        keywords: [
          {
            keyword: 'Overload',
            example:
              'Email overload can lead to stress, decreased productivity, and important messages being missed in the flood of daily emails.',
          },
          {
            keyword: 'Clarity',
            example:
              'Face-to-face or phone conversations often provide more clarity than email, reducing misunderstandings and the need for follow-up messages.',
          },
          {
            keyword: 'Boundaries',
            example:
              'Reducing email helps establish healthier work boundaries and prevents employees from feeling constantly on-call.',
          },
          {
            keyword: 'Organisation',
            example:
              'Better organization of communication channels can reduce email volume while ensuring important information still reaches the right people.',
          },
        ],
      },
      {
        question: 'Is it better to cook at home or eat out regularly?',
        keywords: [
          {
            keyword: 'Health',
            example:
              'Home cooking generally provides better health outcomes by allowing control over ingredients and portion sizes.',
          },
          {
            keyword: 'Cost',
            example:
              'Cooking at home is typically more cost-effective than eating out, especially when preparing meals in larger quantities.',
          },
          {
            keyword: 'Habits',
            example:
              'Developing cooking habits takes time and effort, but can lead to healthier eating patterns and greater food awareness.',
          },
          {
            keyword: 'Convenience',
            example:
              'Eating out offers convenience and saves time, which can be valuable for busy individuals and families.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'The choice between cooking and eating out depends on lifestyle factors like available time, cooking skills, and personal preferences.',
          },
        ],
      },
      {
        question: 'Should schools teach digital citizenship?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Digital citizenship education teaches students how to stay safe online, protect their privacy, and avoid cyberbullying and scams.',
          },
          {
            keyword: 'Awareness',
            example:
              'Students need awareness of digital rights, privacy issues, and how to critically evaluate information found online.',
          },
          {
            keyword: 'Responsibility',
            example:
              "Digital citizenship emphasizes responsibility for one's online actions and understanding the consequences of digital behavior.",
          },
          {
            keyword: 'Communication',
            example:
              'Teaching appropriate digital communication helps students interact respectfully and effectively in online environments.',
          },
        ],
      },
      {
        question: 'Are travel documentaries a good substitute for real travel?',
        keywords: [
          {
            keyword: 'Experience',
            example:
              'Travel documentaries provide vicarious experiences, but cannot replicate the personal growth and memories of actual travel.',
          },
          {
            keyword: 'Culture',
            example:
              'Documentaries can introduce cultures and places, but lack the immersive, multi-sensory experience of being there.',
          },
          {
            keyword: 'Access',
            example:
              'Documentaries make travel accessible to those who cannot afford or physically travel, providing valuable exposure.',
          },
          {
            keyword: 'Curiosity',
            example:
              'Travel documentaries can spark curiosity and inspire future travel, but may also satisfy curiosity without actual exploration.',
          },
          {
            keyword: 'Authenticity',
            example:
              'Documentaries may present curated views of places, while real travel provides authentic, unfiltered experiences.',
          },
        ],
      },
      {
        question:
          'Is local tourism important enough to deserve more support and attention?',
        keywords: [
          'Economy',
          'Community',
          'Promotion',
          'Development',
          'Sustainability',
        ],
      },
      {
        question: 'Are group projects beneficial for students?',
        keywords: [
          {
            keyword: 'Cooperation',
            example:
              'Group projects teach cooperation and collaboration skills essential for workplace success and real-world problem-solving.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Group work develops responsibility as students must contribute their share, but free-riders can create unfair situations.',
          },
          {
            keyword: 'Communication',
            example:
              'Group projects improve communication skills through negotiation, discussion, and presenting ideas to peers.',
          },
          {
            keyword: 'Performance',
            example:
              "Group projects can improve performance through shared knowledge, but may also suffer if some members don't contribute.",
          },
          {
            keyword: 'Teamwork',
            example:
              'Working in teams prepares students for collaborative work environments, teaching conflict resolution and shared decision-making.',
          },
        ],
      },

      {
        question: 'Should employers offer unlimited holiday time?',
        keywords: [
          {
            keyword: 'Trust',
            example:
              'Unlimited holiday policies demonstrate trust in employees to manage their time responsibly and maintain productivity.',
          },
          {
            keyword: 'Productivity',
            example:
              'Well-rested employees may be more productive, but unlimited holiday could be abused and reduce overall output.',
          },
          {
            keyword: 'Balance',
            example:
              'Unlimited holiday can improve work-life balance, allowing employees to take time when needed without stress.',
          },
          {
            keyword: 'Motivation',
            example:
              'Flexible holiday policies can increase motivation and job satisfaction, making employees feel valued and trusted.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Unlimited holiday requires employees to exercise responsibility, balancing personal needs with work commitments.',
          },
        ],
      },
      {
        question: 'Is it better to stay in one career or change paths often?',
        keywords: [
          'Stability',
          'Experience',
          'Ambition',
          'Development',
          'Opportunity',
        ],
      },
      {
        question:
          'Should schools teach financial responsibility from a young age?',
        keywords: [
          {
            keyword: 'Budgeting',
            example:
              'Teaching budgeting from a young age helps students understand money management and make informed financial decisions.',
          },
          {
            keyword: 'Independence',
            example:
              'Financial education promotes independence by giving students skills to manage money and avoid debt as adults.',
          },
          {
            keyword: 'Planning',
            example:
              'Learning financial planning early helps students understand saving, investing, and long-term financial goals.',
          },
          {
            keyword: 'Awareness',
            example:
              'Financial education increases awareness of financial products, risks, and opportunities that affect daily life.',
          },
          {
            keyword: 'Skills',
            example:
              'Financial skills are essential life skills that schools should teach, preparing students for real-world financial challenges.',
          },
        ],
      },
      {
        question:
          'Do smartphones make people feel more connected or more isolated?',
        keywords: [
          {
            keyword: 'Interaction',
            example:
              'Smartphones enable constant interaction with others, but may reduce quality of face-to-face social interactions.',
          },
          {
            keyword: 'Perception',
            example:
              'Social media can create perception of connection through likes and messages, but may feel superficial compared to real relationships.',
          },
          {
            keyword: 'Expectations',
            example:
              'Smartphones create expectations for constant availability and immediate responses, which can increase stress and reduce genuine connection.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Smartphone use during social interactions can create isolation by reducing engagement with people physically present.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'While smartphones help maintain long-distance connections, excessive use can harm wellbeing and increase feelings of loneliness.',
          },
        ],
      },
      {
        question:
          'Would replacing street parking with green spaces improve city living?',
        keywords: [
          'Environment',
          'Planning',
          'Mobility',
          'Wellbeing',
          'Sustainability',
        ],
      },
      {
        question: 'Should companies focus more on employee happiness?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Happy employees are generally more motivated and engaged, leading to better performance and innovation.',
          },
          {
            keyword: 'Performance',
            example:
              'Employee happiness correlates with improved performance, reduced turnover, and increased productivity.',
          },
          {
            keyword: 'Satisfaction',
            example:
              'Focusing on happiness increases job satisfaction, which can improve retention and reduce recruitment costs.',
          },
          {
            keyword: 'Culture',
            example:
              'Prioritizing employee happiness creates positive workplace culture that attracts talent and improves collaboration.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Supporting employee happiness improves overall wellbeing, reducing stress, burnout, and healthcare costs.',
          },
        ],
      },
      {
        question: 'Is it better to keep a small wardrobe or own many clothes?',
        keywords: [
          'Consumption',
          'Style',
          'Sustainability',
          'Habits',
          'Organisation',
        ],
      },
      {
        question: 'Should schools offer more art classes?',
        keywords: [
          {
            keyword: 'Creativity',
            example:
              'Art classes develop creativity and innovative thinking that benefit students across all subjects and future careers.',
          },
          {
            keyword: 'Expression',
            example:
              'Art provides important outlets for self-expression, allowing students to communicate ideas and emotions non-verbally.',
          },
          {
            keyword: 'Engagement',
            example:
              'Art classes can increase student engagement, especially for those who struggle with traditional academic subjects.',
          },
          {
            keyword: 'Confidence',
            example:
              'Creating art builds confidence and self-esteem as students see their ideas come to life and receive recognition.',
          },
          {
            keyword: 'Imagination',
            example:
              'Art education stimulates imagination and helps students think creatively and see possibilities beyond conventional solutions.',
          },
        ],
      },
      {
        question: 'Are smartphones essential for modern education?',
        keywords: [
          'Access',
          'Research',
          'Convenience',
          'Distraction',
          'Technology',
        ],
      },
      {
        question: 'Is disaster preparedness being prioritised enough today?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Disaster preparedness is essential for public safety, but may not receive adequate funding or attention until disasters occur.',
          },
          {
            keyword: 'Planning',
            example:
              'Effective disaster preparedness requires comprehensive planning, but many communities lack detailed emergency response plans.',
          },
          {
            keyword: 'Resources',
            example:
              'Disaster preparedness requires significant resources for infrastructure, training, and equipment that may be underfunded.',
          },
          {
            keyword: 'Prevention',
            example:
              'Preparedness includes prevention measures, but climate change and urbanization increase disaster risks faster than preparation.',
          },
          {
            keyword: 'Resilience',
            example:
              'Building community resilience through preparedness can reduce disaster impact, but requires ongoing commitment and investment.',
          },
        ],
      },

      {
        question: 'Is it better to follow trends or develop your own style?',
        keywords: [
          'Confidence',
          'Identity',
          'Influence',
          'Creativity',
          'Expression',
        ],
      },
      {
        question: 'Should workplaces allow more flexible dress codes?',
        keywords: [
          {
            keyword: 'Comfort',
            example:
              'Flexible dress codes can improve comfort and productivity, allowing employees to work in clothing that suits their tasks.',
          },
          {
            keyword: 'Professionalism',
            example:
              'Dress codes maintain professionalism, but flexible policies can still project professionalism while allowing individuality.',
          },
          {
            keyword: 'Expression',
            example:
              'Flexible dress codes allow self-expression and cultural expression, making workplaces more inclusive and welcoming.',
          },
          {
            keyword: 'Culture',
            example:
              'Dress codes reflect workplace culture, and flexibility can create more modern, inclusive, and employee-friendly cultures.',
          },
          {
            keyword: 'Expectations',
            example:
              'Clear but flexible dress code expectations can balance professionalism with comfort and individual expression.',
          },
        ],
      },
      {
        question: 'Are cities becoming too crowded?',
        keywords: [
          'Population',
          'Housing',
          'Infrastructure',
          'Pressure',
          'Mobility',
        ],
      },
      {
        question: 'Should schools limit the amount of screen time in class?',
        keywords: [
          {
            keyword: 'Concentration',
            example:
              'Limiting screen time can improve concentration and reduce digital distractions that interfere with learning.',
          },
          {
            keyword: 'Habits',
            example:
              'Reducing screen time in class helps students develop healthy technology habits and balance digital with offline learning.',
          },
          {
            keyword: 'Balance',
            example:
              'Limiting screens promotes balance between digital tools and traditional learning methods that develop different skills.',
          },
          {
            keyword: 'Engagement',
            example:
              'While screens can be engaging, excessive use may reduce engagement with teachers and peers in classroom interactions.',
          },
          {
            keyword: 'Supervision',
            example:
              'Limiting screen time makes supervision easier and ensures students stay on task rather than accessing distractions.',
          },
        ],
      },
      {
        question: 'Is it better to live close to nature?',
        keywords: [
          'Health',
          'Relaxation',
          'Lifestyle',
          'Environment',
          'Wellbeing',
        ],
      },
      {
        question: 'Should students take a gap year before university?',
        keywords: [
          {
            keyword: 'Experience',
            example:
              'Gap years provide real-world experience through work, travel, or volunteering that can inform career choices.',
          },
          {
            keyword: 'Maturity',
            example:
              'Taking a gap year can increase maturity and life experience, helping students approach university with greater focus.',
          },
          {
            keyword: 'Exploration',
            example:
              'Gap years allow exploration of interests and career paths before committing to expensive university education.',
          },
          {
            keyword: 'Independence',
            example:
              'Gap years develop independence and life skills that benefit students when they enter university.',
          },
          {
            keyword: 'Preparation',
            example:
              'Gap years can provide better preparation for university, but some students may lose academic momentum or motivation.',
          },
        ],
      },
      {
        question: 'Are electric vehicles the future of transport?',
        keywords: [
          'Innovation',
          'Sustainability',
          'Affordability',
          'Efficiency',
          'Demand',
        ],
      },
      {
        question:
          'Do fast fashion brands need stricter standards to reduce environmental harm?',
        keywords: [
          {
            keyword: 'Pollution',
            example:
              'Fast fashion causes significant pollution through manufacturing, transportation, and textile waste in landfills.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Stricter standards would enforce corporate responsibility for environmental impact throughout the supply chain.',
          },
          {
            keyword: 'Production',
            example:
              'Fast fashion production uses excessive water, chemicals, and resources, requiring standards to reduce environmental harm.',
          },
          {
            keyword: 'Consumption',
            example:
              'Fast fashion encourages overconsumption and disposable clothing culture that creates massive waste.',
          },
          {
            keyword: 'Ethics',
            example:
              'Stricter standards address both environmental ethics and labor ethics in fast fashion supply chains.',
          },
        ],
      },
      {
        question: 'Do smartphones harm children’s creativity?',
        keywords: [
          'Imagination',
          'Development',
          'Habits',
          'Exploration',
          'Attention',
        ],
      },
      {
        question: 'Should more workplaces offer remote positions?',
        keywords: [
          {
            keyword: 'Flexibility',
            example:
              'Remote work offers flexibility that improves work-life balance and allows employees to work from anywhere.',
          },
          {
            keyword: 'Access',
            example:
              'Remote positions increase access to jobs for people with disabilities, caregiving responsibilities, or geographic limitations.',
          },
          {
            keyword: 'Performance',
            example:
              'Remote work can improve performance for some employees, but may reduce it for others who need in-person structure.',
          },
          {
            keyword: 'Collaboration',
            example:
              'Remote work may reduce spontaneous collaboration and team bonding, though technology can bridge some gaps.',
          },
          {
            keyword: 'Balance',
            example:
              'Remote work improves work-life balance, but may blur boundaries between work and personal time.',
          },
        ],
      },

      {
        question:
          'Is it better to invest in experiences or personal belongings?',
        keywords: [
          {
            keyword: 'Satisfaction',
            example:
              'Research suggests experiences often provide more lasting satisfaction than material possessions, which can lose appeal over time.',
          },
          {
            keyword: 'Value',
            example:
              'Experiences create memories and personal growth, while belongings provide utility but may depreciate in value.',
          },
          {
            keyword: 'Memory',
            example:
              'Experiences create lasting memories and stories, while possessions may be forgotten or replaced over time.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Investing in experiences supports a lifestyle focused on adventure and growth, while belongings support comfort and stability.',
          },
          {
            keyword: 'Priorities',
            example:
              'The choice depends on priorities - some value experiences for personal growth, others value possessions for security.',
          },
        ],
      },
      {
        question: 'Should people limit their social media accounts?',
        keywords: [
          'Privacy',
          'Wellbeing',
          'Habits',
          'Comparison',
          'Boundaries',
        ],
      },
      {
        question: 'Should schools focus more on problem-solving skills?',
        keywords: [
          {
            keyword: 'Logic',
            example:
              'Problem-solving develops logical thinking and analytical skills that are valuable across all subjects and life situations.',
          },
          {
            keyword: 'Creativity',
            example:
              'Problem-solving encourages creative thinking and innovative approaches to challenges, not just following formulas.',
          },
          {
            keyword: 'Independence',
            example:
              'Teaching problem-solving promotes independence by giving students tools to tackle challenges without constant guidance.',
          },
          {
            keyword: 'Strategy',
            example:
              'Problem-solving teaches strategic thinking and planning skills that are essential for real-world success.',
          },
          {
            keyword: 'Understanding',
            example:
              'Problem-solving deepens understanding by requiring students to apply knowledge rather than just memorize facts.',
          },
        ],
      },
      {
        question: 'Are cities doing enough to support cyclists?',
        keywords: [
          {
            keyword: 'Infrastructure',
            example:
              'Many cities lack adequate cycling infrastructure like dedicated lanes, secure parking, and bike-sharing programs.',
          },
          {
            keyword: 'Safety',
            example:
              "Cyclist safety requires protected lanes, traffic calming, and driver education that many cities haven't fully implemented.",
          },
          {
            keyword: 'Planning',
            example:
              'Supporting cycling requires integrated urban planning that prioritizes bikes alongside cars and public transport.',
          },
          {
            keyword: 'Mobility',
            example:
              'Better cycling support improves urban mobility and reduces congestion, but requires significant infrastructure investment.',
          },
          {
            keyword: 'Commitment',
            example:
              'Cities need long-term commitment to cycling, not just token bike lanes, to make cycling a viable transportation option.',
          },
        ],
      },
      {
        question: 'Should students be allowed to use AI tools for learning?',
        keywords: [
          {
            keyword: 'Support',
            example:
              'AI tools can provide learning support and personalized assistance, but may reduce development of independent thinking skills.',
          },
          {
            keyword: 'Creativity',
            example:
              'AI can support creativity by generating ideas, but may also limit creative thinking if students become too dependent.',
          },
          {
            keyword: 'Supervision',
            example:
              'Using AI tools requires supervision to ensure students learn rather than just getting answers without understanding.',
          },
          {
            keyword: 'Dependence',
            example:
              'Over-reliance on AI tools can create dependence that undermines learning and critical thinking development.',
          },
          {
            keyword: 'Ethics',
            example:
              'AI use raises ethical questions about academic integrity, but can also teach responsible technology use.',
          },
        ],
      },
      {
        question: 'Is it better to live close to your workplace?',
        keywords: [
          {
            keyword: 'Commuting',
            example:
              'Working from home eliminates daily commuting, saving time and reducing transportation costs and stress.',
          },
          {
            keyword: 'Convenience',
            example:
              'Remote work offers convenience and flexibility, allowing employees to work from anywhere and manage their own schedules.',
          },
          {
            keyword: 'Cost',
            example:
              'Working from home can reduce costs for both employees and employers, including office space, commuting, and work-related expenses.',
          },
          {
            keyword: 'Stress',
            example:
              'While remote work can reduce commuting stress, it may also create new stressors related to isolation and work-life boundaries.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Remote work can improve lifestyle by providing more time for family, hobbies, and personal activities, but requires self-discipline.',
          },
        ],
      },
      {
        question: 'Should companies allow pets in the office?',
        keywords: [
          {
            keyword: 'Comfort',
            example:
              'Pets in the office can provide comfort and reduce stress, creating a more relaxed and positive work environment.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Pet-friendly offices can improve employee wellbeing by reducing stress and providing emotional support throughout the workday.',
          },
          {
            keyword: 'Atmosphere',
            example:
              'Pets can create a more friendly and relaxed office atmosphere, improving workplace culture and employee satisfaction.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Allowing pets requires clear policies about pet owner responsibility, including behavior, cleanliness, and care during work hours.',
          },
        ],
      },
      {
        question: 'Are young people too influenced by trends?',
        keywords: [
          'Identity',
          'Pressure',
          'Behaviour',
          'Expectations',
          'Marketing',
        ],
      },
      {
        question: 'Should schools encourage students to study abroad?',
        keywords: [
          'Culture',
          'Opportunity',
          'Independence',
          'Confidence',
          'Experience',
        ],
      },
      {
        question: 'Do smartphones make it harder to remember information?',
        keywords: [
          {
            keyword: 'Memory',
            example:
              'Relying on smartphones for information can weaken memory skills, as people become less likely to remember things when they know they can look them up.',
          },
          {
            keyword: 'Habits',
            example:
              'Constant smartphone use creates habits of dependency that can be difficult to break and may interfere with real-world interactions.',
          },
          {
            keyword: 'Dependence',
            example:
              'Over-reliance on smartphones creates dependence that can cause anxiety when devices are unavailable or battery dies.',
          },
          {
            keyword: 'Learning',
            example:
              'While smartphones provide access to information, over-reliance may reduce critical thinking and deep learning skills.',
          },
          {
            keyword: 'Attention',
            example:
              'Smartphones can fragment attention and reduce the ability to focus on tasks that require sustained concentration.',
          },
        ],
      },

      {
        question:
          'Are financial incentives a good way to encourage eco-friendly habits?',
        keywords: [
          {
            keyword: 'Incentives',
            example:
              'Financial incentives can motivate people to adopt eco-friendly habits by making sustainable choices more economically attractive.',
          },
          {
            keyword: 'Sustainability',
            example:
              'While financial incentives can promote sustainability, they may not create lasting behavioral change once the incentives are removed.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Some argue that environmental responsibility should come from intrinsic motivation rather than external financial rewards.',
          },
          {
            keyword: 'Impact',
            example:
              'The environmental impact of incentive programs must be significant enough to justify the financial cost of implementation.',
          },
          {
            keyword: 'Participation',
            example:
              'Financial incentives can increase participation in eco-friendly programs, especially among those who might not otherwise engage.',
          },
        ],
      },
      {
        question: 'Is it better to communicate by text or by voice?',
        keywords: [
          {
            keyword: 'Clarity',
            example:
              'Voice communication provides clarity through tone and inflection, while text can be misinterpreted without vocal cues.',
          },
          {
            keyword: 'Convenience',
            example:
              'Text offers convenience for quick messages and asynchronous communication, while voice requires real-time interaction.',
          },
          {
            keyword: 'Tone',
            example:
              'Voice conveys tone and emotion naturally, while text requires careful wording to avoid misunderstandings.',
          },
          {
            keyword: 'Misunderstanding',
            example:
              'Text messages are more prone to misunderstanding without vocal cues, while voice allows immediate clarification.',
          },
          {
            keyword: 'Connection',
            example:
              'Voice communication creates stronger emotional connection, while text can feel more distant and transactional.',
          },
        ],
      },
      {
        question: 'Should schools increase outdoor learning time?',
        keywords: [
          {
            keyword: 'Activity',
            example:
              'Outdoor learning increases physical activity and reduces sedentary behavior, improving health and energy levels.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Time outdoors improves mental wellbeing through exposure to nature, fresh air, and natural light.',
          },
          {
            keyword: 'Engagement',
            example:
              'Outdoor learning can increase engagement by making lessons more interactive and connected to real-world environments.',
          },
          {
            keyword: 'Exploration',
            example:
              'Outdoor settings encourage exploration and hands-on learning that may not be possible in traditional classrooms.',
          },
          {
            keyword: 'Development',
            example:
              'Outdoor learning supports holistic development including physical, social, and environmental awareness.',
          },
        ],
      },
      {
        question: 'Are online influencers becoming too powerful?',
        keywords: [
          'Promotion',
          'Behaviour',
          'Influence',
          'Responsibility',
          'Visibility',
        ],
      },
      {
        question: 'Should companies reduce their use of email marketing?',
        keywords: [
          'Privacy',
          'Engagement',
          'Relevance',
          'Consent',
          'Communication',
        ],
      },
      {
        question: 'Do modern diets focus too much on appearance?',
        keywords: [
          'Pressure',
          'Identity',
          'Health',
          'Expectations',
          'Behaviour',
        ],
      },
      {
        question: 'Should businesses invest more in employee training?',
        keywords: [
          'Skills',
          'Development',
          'Performance',
          'Motivation',
          'Opportunity',
        ],
      },
      {
        question: 'Is it better to read news daily or avoid it sometimes?',
        keywords: [
          {
            keyword: 'Stress',
            example:
              'Constant news consumption can create stress and anxiety, especially when focusing on negative or alarming information.',
          },
          {
            keyword: 'Awareness',
            example:
              'Staying informed increases awareness of important issues, but too much information can lead to information overload.',
          },
          {
            keyword: 'Information',
            example:
              'Access to information is valuable, but the quality and accuracy of news sources must be carefully evaluated.',
          },
          {
            keyword: 'Balance',
            example:
              'Finding balance between staying informed and protecting mental health is essential for wellbeing in the information age.',
          },
          {
            keyword: 'Habits',
            example:
              'Developing healthy news consumption habits, such as limiting time and choosing reliable sources, can improve mental wellbeing.',
          },
        ],
      },
      {
        question: 'Should schools limit competitive activities?',
        keywords: [
          {
            keyword: 'Pressure',
            example:
              'Excessive competition can create unhealthy pressure on students, leading to stress, anxiety, and burnout.',
          },
          {
            keyword: 'Equality',
            example:
              'Limiting competition can promote equality by ensuring all students have opportunities to participate regardless of skill level.',
          },
          {
            keyword: 'Motivation',
            example:
              'While competition can motivate some students, it may demotivate others who feel they cannot compete successfully.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Competitive environments can sometimes encourage negative behaviors like cheating or poor sportsmanship when winning becomes too important.',
          },
        ],
      },
      {
        question: 'Are smart homes improving people’s lives?',
        keywords: [
          'Convenience',
          'Security',
          'Efficiency',
          'Privacy',
          'Technology',
        ],
      },

      {
        question: 'Should people avoid multitasking?',
        keywords: [
          'Focus',
          'Efficiency',
          'Habits',
          'Performance',
          'Concentration',
        ],
      },
      {
        question: 'Is it better to study in silence or with background noise?',
        keywords: [
          'Focus',
          'Comfort',
          'Preference',
          'Productivity',
          'Concentration',
        ],
      },
      {
        question: 'Should companies offer gym memberships to employees?',
        keywords: [
          'Health',
          'Motivation',
          'Engagement',
          'Wellbeing',
          'Incentives',
        ],
      },
      {
        question: 'Are shopping malls becoming less relevant?',
        keywords: [
          'Convenience',
          'Trends',
          'Experience',
          'Economy',
          'Consumer behaviour',
        ],
      },
      {
        question: 'Should schools allow students to retake assignments?',
        keywords: [
          'Fairness',
          'Improvement',
          'Motivation',
          'Responsibility',
          'Performance',
        ],
      },
      {
        question: 'Is it better to buy local products?',
        keywords: [
          'Quality',
          'Community',
          'Sustainability',
          'Value',
          'Preference',
        ],
      },
      {
        question:
          'Should workplaces allow shorter lunch breaks for earlier finishing times?',
        keywords: [
          'Productivity',
          'Choice',
          'Wellbeing',
          'Balance',
          'Efficiency',
        ],
      },
      {
        question: 'Do smartphones affect children’s social skills?',
        keywords: [
          'Communication',
          'Behaviour',
          'Development',
          'Interaction',
          'Confidence',
        ],
      },
      {
        question:
          'Should public sports facilities be made more affordable for everyone?',
        keywords: [
          'Accessibility',
          'Health',
          'Community',
          'Affordability',
          'Participation',
        ],
      },
      {
        question: 'Is it better to have a predictable morning routine?',
        keywords: [
          'Consistency',
          'Productivity',
          'Habits',
          'Energy',
          'Organisation',
        ],
      },

      {
        question: 'Should schools teach students how to manage money?',
        keywords: [
          'Responsibility',
          'Planning',
          'Budgeting',
          'Awareness',
          'Independence',
        ],
      },
      {
        question: 'Are people too reliant on digital reminders?',
        keywords: [
          'Memory',
          'Habits',
          'Convenience',
          'Dependence',
          'Organisation',
        ],
      },
      {
        question: 'Should companies limit the use of plastic packaging?',
        keywords: [
          'Waste',
          'Sustainability',
          'Production',
          'Responsibility',
          'Consumption',
        ],
      },
      {
        question: 'Is it better to follow a schedule or be spontaneous?',
        keywords: [
          'Flexibility',
          'Structure',
          'Habits',
          'Balance',
          'Preference',
        ],
      },
      {
        question:
          'Are outdoor community spaces receiving enough support and investment?',
        keywords: [
          'Wellbeing',
          'Engagement',
          'Planning',
          'Environment',
          'Connection',
        ],
      },
      {
        question: 'Do smartphones reduce productivity at work?',
        keywords: [
          {
            keyword: 'Distraction',
            example:
              'Open-plan offices can create distractions that reduce productivity and make it difficult to focus on complex tasks.',
          },
          {
            keyword: 'Habits',
            example:
              'Working in open-plan offices requires developing new habits for managing noise, interruptions, and maintaining privacy.',
          },
          {
            keyword: 'Efficiency',
            example:
              'While open-plan offices can improve communication efficiency, they may reduce individual productivity due to constant interruptions.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Open-plan layouts can influence behavior, encouraging collaboration but potentially reducing individual focus and deep work.',
          },
          {
            keyword: 'Focus',
            example:
              'Maintaining focus in open-plan offices can be challenging, requiring strategies like noise-canceling headphones or designated quiet spaces.',
          },
        ],
      },
      {
        question: 'Is congestion pricing a fair way to manage heavy traffic?',
        keywords: [
          {
            keyword: 'Traffic',
            example:
              'Congestion pricing aims to reduce traffic by charging drivers during peak hours, encouraging alternative transportation or off-peak travel.',
          },
          {
            keyword: 'Mobility',
            example:
              'While congestion pricing may reduce traffic, it can limit mobility for those who cannot afford the additional costs.',
          },
          {
            keyword: 'Fairness',
            example:
              'The fairness of congestion pricing is debated, as it may disproportionately affect lower-income drivers who have fewer transportation alternatives.',
          },
          {
            keyword: 'Planning',
            example:
              'Effective congestion pricing requires careful planning to ensure it reduces traffic without creating undue hardship for essential workers.',
          },
          {
            keyword: 'Regulation',
            example:
              'Congestion pricing is a form of traffic regulation that uses economic incentives to manage road usage and reduce congestion.',
          },
        ],
      },
      {
        question:
          'Is it better to read fiction or non-fiction for personal growth?',
        keywords: [
          {
            keyword: 'Knowledge',
            example:
              'Non-fiction provides direct knowledge and factual information that can be immediately applied to real-world situations.',
          },
          {
            keyword: 'Imagination',
            example:
              'Fiction stimulates imagination and creativity, helping readers think beyond current limitations and envision new possibilities.',
          },
          {
            keyword: 'Understanding',
            example:
              'Both fiction and non-fiction contribute to understanding - fiction through emotional insight, non-fiction through factual comprehension.',
          },
          {
            keyword: 'Perspective',
            example:
              'Fiction offers diverse perspectives and helps readers understand different viewpoints, cultures, and human experiences.',
          },
          {
            keyword: 'Curiosity',
            example:
              'Both genres can spark curiosity, but non-fiction satisfies it with facts while fiction encourages exploration of possibilities.',
          },
        ],
      },
      {
        question: 'Should workplaces offer mental health days?',
        keywords: [
          {
            keyword: 'Balance',
            example:
              'Taking afternoon naps requires finding balance between rest and productivity, ensuring naps enhance rather than disrupt daily routines.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Afternoon naps can improve wellbeing by reducing fatigue, boosting mood, and enhancing overall physical and mental health.',
          },
          {
            keyword: 'Support',
            example:
              'Workplace support for napping, such as designated rest areas, can help employees manage energy levels and improve performance.',
          },
          {
            keyword: 'Stress',
            example:
              'Short naps can reduce stress and help people recharge, but long or poorly timed naps may interfere with nighttime sleep.',
          },
          {
            keyword: 'Motivation',
            example:
              'A well-timed nap can restore motivation and energy, helping people maintain productivity throughout the day.',
          },
        ],
      },
      {
        question: 'Do theme parks encourage unhealthy habits?',
        keywords: [
          {
            keyword: 'Spending',
            example:
              'Theme parks encourage excessive spending on food, souvenirs, and premium experiences, promoting consumerism over moderation.',
          },
          {
            keyword: 'Marketing',
            example:
              'Aggressive marketing at theme parks promotes consumption of unhealthy foods and expensive merchandise, targeting both children and adults.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Theme parks may normalize behaviors like excessive consumption, instant gratification, and prioritizing entertainment over health.',
          },
          {
            keyword: 'Expectations',
            example:
              'Theme parks create expectations for constant excitement and consumption that may be difficult to satisfy in everyday life.',
          },
        ],
      },
      {
        question:
          'Should students learn presentation skills earlier in school?',
        keywords: [
          'Confidence',
          'Communication',
          'Structure',
          'Expression',
          'Preparation',
        ],
      },
      {
        question: 'Are people becoming too dependent on convenience products?',
        keywords: [
          'Consumption',
          'Habits',
          'Comfort',
          'Sustainability',
          'Efficiency',
        ],
      },
      {
        question:
          'Would more people consider carpooling if it were easier and more convenient?',
        keywords: [
          'Mobility',
          'Sustainability',
          'Planning',
          'Incentives',
          'Environment',
        ],
      },
      {
        question: 'Does tracking your fitness improve your health?',
        keywords: [
          'Motivation',
          'Awareness',
          'Habits',
          'Consistency',
          'Behaviour',
        ],
      },
      {
        question: 'Should employers limit after-work emails?',
        keywords: [
          'Boundaries',
          'Stress',
          'Professionalism',
          'Wellbeing',
          'Expectations',
        ],
      },
      {
        question: 'Is it better to work in a quiet or busy environment?',
        keywords: [
          {
            keyword: 'Focus',
            example:
              'Standing desks can improve focus by reducing physical discomfort and allowing movement, which can help maintain mental alertness.',
          },
          {
            keyword: 'Energy',
            example:
              'Standing while working can increase energy levels and reduce afternoon fatigue compared to sitting all day.',
          },
          {
            keyword: 'Comfort',
            example:
              'While standing desks offer health benefits, they may cause discomfort for those not used to standing for long periods.',
          },
          {
            keyword: 'Productivity',
            example:
              'Standing desks may improve productivity by reducing sedentary behavior and keeping workers more alert and engaged.',
          },
          {
            keyword: 'Atmosphere',
            example:
              'Standing desks can create a more dynamic office atmosphere, encouraging movement and interaction among colleagues.',
          },
        ],
      },
      {
        question: 'Should students be allowed more flexible deadlines?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Flexible deadlines can increase motivation by reducing stress and allowing students to work at their own pace when they feel most productive.',
          },
          {
            keyword: 'Responsibility',
            example:
              'While flexible deadlines offer support, students must still learn responsibility and time management skills for real-world situations.',
          },
          {
            keyword: 'Balance',
            example:
              'Flexible deadlines can help students balance academic work with other responsibilities like jobs, family, or health issues.',
          },
          {
            keyword: 'Performance',
            example:
              'When students have more time to complete work, they may produce higher quality results, improving overall academic performance.',
          },
        ],
      },
      {
        question: 'Do smartphones improve the learning experience?',
        keywords: [
          'Access',
          'Engagement',
          'Convenience',
          'Distraction',
          'Technology',
        ],
      },
      {
        question:
          'Are local businesses at risk due to the influence of large corporations?',
        keywords: [
          'Competition',
          'Stability',
          'Fairness',
          'Development',
          'Economy',
        ],
      },
      {
        question: 'Is it better to live near your friends?',
        keywords: [
          'Support',
          'Connection',
          'Lifestyle',
          'Convenience',
          'Community',
        ],
      },

      {
        question: 'Should schools reduce the number of exams?',
        keywords: [
          'Stress',
          'Assessment',
          'Performance',
          'Learning',
          'Motivation',
        ],
      },
      {
        question: 'Are people reading fewer books because of technology?',
        keywords: [
          'Habits',
          'Attention',
          'Entertainment',
          'Preference',
          'Access',
        ],
      },
      {
        question: 'Should companies offer paid time for volunteering?',
        keywords: [
          'Community',
          'Support',
          'Participation',
          'Responsibility',
          'Engagement',
        ],
      },
      {
        question: 'Is it better to take risks when you are young?',
        keywords: [
          'Opportunity',
          'Confidence',
          'Experience',
          'Independence',
          'Growth',
        ],
      },
      {
        question: 'Should schools teach students how to set goals?',
        keywords: [
          'Motivation',
          'Planning',
          'Focus',
          'Achievement',
          'Discipline',
        ],
      },
      {
        question: 'Are people too focused on personal branding today?',
        keywords: [
          {
            keyword: 'Image',
            example:
              'Social media allows people to curate their image, but this can create pressure to present an idealized version of oneself.',
          },
          {
            keyword: 'Reputation',
            example:
              'Online reputation can be easily damaged by social media posts, making it important to think carefully before sharing.',
          },
          {
            keyword: 'Pressure',
            example:
              'Social media creates pressure to maintain a certain image, leading to anxiety and stress about how others perceive you.',
          },
          {
            keyword: 'Visibility',
            example:
              'Increased visibility on social media can bring opportunities but also exposes individuals to criticism and judgment.',
          },
          {
            keyword: 'Identity',
            example:
              'Social media can both help and hinder identity development, as people may struggle to separate their online persona from their true self.',
          },
        ],
      },
      {
        question:
          'Would more pedestrian-only streets make cities safer and more enjoyable?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Pedestrian-only streets eliminate vehicle traffic, significantly reducing the risk of accidents and creating safer spaces for walking.',
          },
          {
            keyword: 'Mobility',
            example:
              'While pedestrian streets improve mobility for walkers, they may create challenges for people with mobility issues who rely on vehicles.',
          },
          {
            keyword: 'Planning',
            example:
              'Creating pedestrian-only streets requires careful urban planning to ensure alternative routes and access for emergency services.',
          },
          {
            keyword: 'Experience',
            example:
              'Pedestrian streets create more enjoyable urban experiences by allowing people to walk, shop, and socialize without traffic concerns.',
          },
          {
            keyword: 'Environment',
            example:
              'Pedestrian-only streets reduce air pollution and noise, creating a cleaner and more pleasant environment for residents and visitors.',
          },
        ],
      },
      {
        question: 'Does technology make it harder to relax?',
        keywords: [
          {
            keyword: 'Stress',
            example:
              'Constant stimulation from technology and busy schedules can create stress that makes it difficult to truly rest and recharge.',
          },
          {
            keyword: 'Habits',
            example:
              'Modern life encourages habits of constant activity and connectivity that can prevent people from developing healthy rest practices.',
          },
          {
            keyword: 'Stimulation',
            example:
              'The constant stimulation of modern life - from screens to notifications to busy schedules - can make genuine rest feel impossible.',
          },
          {
            keyword: 'Balance',
            example:
              'Finding balance between activity and rest requires intentional effort in a culture that often values productivity over restoration.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Without adequate rest, wellbeing suffers, leading to burnout, decreased mental health, and reduced overall quality of life.',
          },
        ],
      },
      {
        question: 'Should companies reduce unnecessary meetings?',
        keywords: [
          {
            keyword: 'Efficiency',
            example:
              'Reducing unnecessary meetings improves efficiency by allowing employees to focus on productive work instead of attending redundant discussions.',
          },
          {
            keyword: 'Planning',
            example:
              'Better planning can help identify which meetings are truly necessary and which can be replaced with more efficient communication methods.',
          },
          {
            keyword: 'Productivity',
            example:
              'Excessive meetings reduce productivity by fragmenting work time and preventing employees from engaging in deep, focused work.',
          },
          {
            keyword: 'Priorities',
            example:
              'Reducing meetings helps employees prioritize their work and focus on tasks that directly contribute to company goals.',
          },
        ],
      },
      {
        question: 'Is it better to save money regularly or invest it?',
        keywords: [
          {
            keyword: 'Security',
            example:
              'Saving money provides financial security and a safety net for unexpected expenses or emergencies.',
          },
          {
            keyword: 'Growth',
            example:
              'Spending money on experiences can contribute to personal growth, learning, and creating meaningful memories.',
          },
          {
            keyword: 'Risk',
            example:
              'Saving reduces financial risk, while spending on experiences involves accepting some risk for potential personal enrichment.',
          },
          {
            keyword: 'Planning',
            example:
              'Effective financial planning balances saving for the future with spending on experiences that enhance current quality of life.',
          },
          {
            keyword: 'Priorities',
            example:
              'The choice between saving and spending depends on individual priorities, financial situation, and life stage.',
          },
        ],
      },

      {
        question: 'Should companies hire more older workers?',
        keywords: [
          {
            keyword: 'Experience',
            example:
              'Older workers bring valuable experience, wisdom, and institutional knowledge that can benefit organizations and mentor younger employees.',
          },
          {
            keyword: 'Productivity',
            example:
              'Older workers often maintain high productivity levels and bring reliability and consistency to their work.',
          },
          {
            keyword: 'Diversity',
            example:
              'Hiring older workers increases age diversity, bringing different perspectives and approaches that can enhance team performance.',
          },
          {
            keyword: 'Adaptability',
            example:
              'Older workers can adapt to new technologies and methods, though they may require additional training and support.',
          },
          {
            keyword: 'Opportunity',
            example:
              'Providing employment opportunities for older workers addresses age discrimination and utilizes valuable talent that might otherwise be overlooked.',
          },
        ],
      },
      {
        question: 'Is it better to take risks or play it safe in life?',
        keywords: [
          'Confidence',
          'Consequences',
          'Opportunity',
          'Growth',
          'Decision-making',
        ],
      },
      {
        question:
          'Should schools use digital textbooks instead of printed ones?',
        keywords: [
          'Accessibility',
          'Cost',
          'Convenience',
          'Concentration',
          'Sustainability',
        ],
      },
      {
        question: 'Are online reviews reliable when choosing products?',
        keywords: [
          'Feedback',
          'Trust',
          'Accuracy',
          'Influence',
          'Expectations',
        ],
      },
      {
        question:
          'Would lowering speed limits in cities make urban areas safer?',
        keywords: [
          'Safety',
          'Congestion',
          'Enforcement',
          'Behaviour',
          'Planning',
        ],
      },
      {
        question: 'Is it better to invest in skills or formal education?',
        keywords: [
          'Training',
          'Qualifications',
          'Development',
          'Employability',
          'Opportunity',
        ],
      },
      {
        question: 'Should schools allow more creative subjects?',
        keywords: [
          'Expression',
          'Motivation',
          'Engagement',
          'Imagination',
          'Confidence',
        ],
      },
      {
        question: 'Do smartphones make learning easier or harder?',
        keywords: [
          'Distraction',
          'Access',
          'Concentration',
          'Habits',
          'Efficiency',
        ],
      },
      {
        question: 'Should people be encouraged to grow their own food?',
        keywords: [
          'Health',
          'Sustainability',
          'Effort',
          'Independence',
          'Lifestyle',
        ],
      },
      {
        question: 'Are holidays becoming too commercial?',
        keywords: [
          'Tradition',
          'Marketing',
          'Spending',
          'Expectations',
          'Celebration',
        ],
      },

      {
        question: 'Should public speaking be required in school?',
        keywords: [
          'Confidence',
          'Communication',
          'Preparation',
          'Expression',
          'Performance',
        ],
      },
      {
        question: 'Are online courses as effective as traditional classes?',
        keywords: [
          'Interaction',
          'Flexibility',
          'Discipline',
          'Support',
          'Engagement',
        ],
      },
      {
        question: 'Is affordable housing becoming too difficult to access?',
        keywords: [
          'Affordability',
          'Access',
          'Community',
          'Planning',
          'Stability',
        ],
      },
      {
        question: 'Is it better to specialise in one skill or be a generalist?',
        keywords: [
          'Expertise',
          'Flexibility',
          'Opportunities',
          'Development',
          'Career path',
        ],
      },
      {
        question: 'Should companies limit meetings to increase productivity?',
        keywords: [
          'Efficiency',
          'Communication',
          'Planning',
          'Focus',
          'Resources',
        ],
      },
      {
        question: 'Are meal delivery services harming home cooking habits?',
        keywords: [
          {
            keyword: 'Convenience',
            example:
              'Meal delivery services offer convenience but may reduce opportunities to develop and practice home cooking skills.',
          },
          {
            keyword: 'Habits',
            example:
              'Regular use of meal delivery can create habits of dependency that make it harder to return to cooking at home.',
          },
          {
            keyword: 'Cost',
            example:
              'While convenient, meal delivery services are typically more expensive than cooking at home, impacting household budgets.',
          },
          {
            keyword: 'Health',
            example:
              'Home cooking allows control over ingredients and nutrition, while meal delivery may include more processed or less healthy options.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'The choice between meal delivery and home cooking depends on lifestyle factors like time, cooking skills, and health priorities.',
          },
        ],
      },
      {
        question:
          'Should schools start later to match students’ sleep patterns?',
        keywords: [
          'Concentration',
          'Wellbeing',
          'Behaviour',
          'Performance',
          'Routine',
        ],
      },
      {
        question: 'Is it better to focus on strengths or improve weaknesses?',
        keywords: [
          'Growth',
          'Confidence',
          'Priorities',
          'Development',
          'Strategy',
        ],
      },
      {
        question: 'Should cities offer more car-free zones?',
        keywords: [
          'Mobility',
          'Pollution',
          'Accessibility',
          'Safety',
          'Sustainability',
        ],
      },
      {
        question: 'Do loyalty programs encourage unhealthy spending habits?',
        keywords: [
          {
            keyword: 'Marketing',
            example:
              'Loyalty programs use marketing strategies to encourage repeat purchases and build customer relationships.',
          },
          {
            keyword: 'Rewards',
            example:
              'Rewards from loyalty programs can provide value, but may also encourage unnecessary spending to earn points or benefits.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Loyalty programs can change consumer behavior, creating habits of purchasing from specific brands to maintain rewards status.',
          },
          {
            keyword: 'Value',
            example:
              'The value of loyalty programs depends on whether the rewards justify the spending required to earn them.',
          },
          {
            keyword: 'Temptation',
            example:
              'Loyalty programs can create temptation to spend more than planned in order to reach reward thresholds or maintain status.',
          },
        ],
      },

      {
        question: 'Should children learn basic first-aid skills?',
        keywords: [
          {
            keyword: 'Safety',
            example:
              'Teaching children first aid can improve safety by enabling them to help in emergencies and potentially save lives.',
          },
          {
            keyword: 'Confidence',
            example:
              'Learning first aid builds confidence in children, giving them the knowledge and skills to act calmly in emergency situations.',
          },
          {
            keyword: 'Emergencies',
            example:
              'Children who know first aid are better prepared to respond to accidents, injuries, or medical emergencies at home or school.',
          },
          {
            keyword: 'Responsibility',
            example:
              'First aid training teaches children responsibility and the importance of helping others in need.',
          },
          {
            keyword: 'Preparation',
            example:
              'Basic first aid skills prepare children for real-world situations where they might need to help themselves or others.',
          },
        ],
      },
      {
        question: 'Is it better to live alone or with a partner?',
        keywords: [
          'Privacy',
          'Support',
          'Independence',
          'Communication',
          'Lifestyle',
        ],
      },
      {
        question: 'Should advertising for unhealthy products be limited?',
        keywords: [
          'Responsibility',
          'Influence',
          'Health',
          'Regulation',
          'Behaviour',
        ],
      },
      {
        question: 'Are modern workplaces too stressful?',
        keywords: [
          'Pressure',
          'Deadlines',
          'Expectations',
          'Balance',
          'Wellbeing',
        ],
      },
      {
        question: 'Should companies provide financial education to employees?',
        keywords: [
          'Security',
          'Planning',
          'Responsibility',
          'Investment',
          'Awareness',
        ],
      },
      {
        question: 'Do smartphones reduce our ability to focus?',
        keywords: [
          'Attention',
          'Habits',
          'Distraction',
          'Productivity',
          'Behaviour',
        ],
      },
      {
        question: 'Should schools encourage students to read more fiction?',
        keywords: [
          'Creativity',
          'Imagination',
          'Language',
          'Engagement',
          'Learning',
        ],
      },
      {
        question: 'Are theme parks too expensive for families?',
        keywords: [
          {
            keyword: 'Entertainment',
            example:
              'Streaming services provide convenient access to entertainment, but subscription costs can add up across multiple platforms.',
          },
          {
            keyword: 'Access',
            example:
              'Streaming services offer access to vast libraries of content, but availability varies by region and licensing agreements.',
          },
          {
            keyword: 'Value',
            example:
              'The value of streaming services depends on how much content you actually watch relative to the monthly subscription cost.',
          },
          {
            keyword: 'Cost',
            example:
              'Multiple streaming subscriptions can become expensive, potentially costing more than traditional cable or satellite services.',
          },
          {
            keyword: 'Expectations',
            example:
              'Streaming services create expectations for instant access to content, which may not always be available due to licensing or technical issues.',
          },
        ],
      },
      {
        question: 'Should renewable energy receive much higher investment?',
        keywords: [
          {
            keyword: 'Sustainability',
            example:
              'Renewable energy is essential for long-term sustainability, reducing dependence on finite fossil fuel resources.',
          },
          {
            keyword: 'Emissions',
            example:
              'Renewable energy significantly reduces greenhouse gas emissions, helping combat climate change and air pollution.',
          },
          {
            keyword: 'Planning',
            example:
              'Increased investment in renewable energy requires careful planning for infrastructure, grid integration, and workforce development.',
          },
          {
            keyword: 'Long-term impact',
            example:
              'Investing in renewable energy now has positive long-term impacts on the environment, economy, and energy security for future generations.',
          },
        ],
      },
      {
        question: 'Do uniforms improve discipline in schools?',
        keywords: [
          'Behaviour',
          'Equality',
          'Identity',
          'Structure',
          'Tradition',
        ],
      },

      {
        question: 'Should cities plant more trees in urban areas?',
        keywords: [
          'Environment',
          'Wellbeing',
          'Planning',
          'Shade',
          'Sustainability',
        ],
      },
      {
        question: 'Is it better to work in a highly competitive environment?',
        keywords: [
          'Pressure',
          'Motivation',
          'Resilience',
          'Performance',
          'Expectations',
        ],
      },
      {
        question: 'Is limiting working hours a good way to protect employees?',
        keywords: [
          'Productivity',
          'Wellbeing',
          'Regulation',
          'Fairness',
          'Efficiency',
        ],
      },
      {
        question: 'Do people depend too much on GPS technology?',
        keywords: [
          'Navigation',
          'Habits',
          'Independence',
          'Accuracy',
          'Convenience',
        ],
      },
      {
        question: 'Should schools offer mindfulness breaks?',
        keywords: [
          'Stress',
          'Concentration',
          'Wellbeing',
          'Balance',
          'Awareness',
        ],
      },
      {
        question: 'Is it better to focus on one hobby or try many?',
        keywords: [
          'Interest',
          'Skills',
          'Commitment',
          'Enjoyment',
          'Exploration',
        ],
      },
      {
        question:
          'Should companies allow staff to use their own devices for work?',
        keywords: [
          'Security',
          'Privacy',
          'Efficiency',
          'Supervision',
          'Convenience',
        ],
      },
      {
        question: 'Does social media make friendships stronger or weaker?',
        keywords: [
          'Connection',
          'Communication',
          'Trust',
          'Support',
          'Expectations',
        ],
      },
      {
        question:
          'Should natural parks restrict visitor numbers to protect the environment?',
        keywords: [
          'Conservation',
          'Overcrowding',
          'Protection',
          'Access',
          'Sustainability',
        ],
      },
      {
        question:
          'Is it better to choose a career based on passion or stability?',
        keywords: [
          'Interests',
          'Security',
          'Motivation',
          'Fulfilment',
          'Priorities',
        ],
      },

      {
        question: 'Should schools introduce financial planning courses?',
        keywords: [
          'Budgeting',
          'Responsibility',
          'Independence',
          'Awareness',
          'Preparation',
        ],
      },
      {
        question: 'Are electric bicycles a good solution for urban travel?',
        keywords: [
          'Mobility',
          'Convenience',
          'Safety',
          'Sustainability',
          'Efficiency',
        ],
      },
      {
        question: 'Should parents limit their children’s hobbies?',
        keywords: [
          'Balance',
          'Development',
          'Responsibility',
          'Support',
          'Priorities',
        ],
      },
      {
        question: 'Is it better to be a leader or a team player?',
        keywords: [
          'Initiative',
          'Cooperation',
          'Communication',
          'Responsibility',
          'Influence',
        ],
      },
      {
        question:
          'Do video streaming services need more control to protect viewers?',
        keywords: [
          {
            keyword: 'Content',
            example:
              'Parental controls help filter inappropriate content, but may also limit access to educational or beneficial material.',
          },
          {
            keyword: 'Access',
            example:
              "Controlling children's internet access protects them from harmful content while potentially limiting their learning opportunities.",
          },
          {
            keyword: 'Cost',
            example:
              "Parental control software and tools may have costs, but the investment in children's online safety is often considered worthwhile.",
          },
          {
            keyword: 'Protection',
            example:
              'Parental controls provide protection from online dangers including predators, cyberbullying, and inappropriate content.',
          },
          {
            keyword: 'Responsibility',
            example:
              "Parents bear responsibility for their children's online safety, but controls should be balanced with education and trust.",
          },
        ],
      },
      {
        question: 'Are modern diets too restrictive?',
        keywords: [
          {
            keyword: 'Health',
            example:
              'While some restrictive diets can improve health, overly restrictive approaches may lead to nutrient deficiencies and health problems.',
          },
          {
            keyword: 'Habits',
            example:
              'Restrictive diets can create unhealthy relationships with food and eating habits that may persist long-term.',
          },
          {
            keyword: 'Balance',
            example:
              'Healthy eating requires balance and moderation rather than extreme restriction, which can be unsustainable and harmful.',
          },
          {
            keyword: 'Pressure',
            example:
              'Restrictive diets create pressure to follow rigid rules, which can lead to anxiety, guilt, and disordered eating patterns.',
          },
          {
            keyword: 'Nutrition',
            example:
              'Overly restrictive diets may not provide adequate nutrition, potentially causing health issues despite initial weight loss.',
          },
        ],
      },
      {
        question: 'Should schools teach conflict resolution?',
        keywords: [
          {
            keyword: 'Communication',
            example:
              "Conflict resolution teaches effective communication skills that help students express their needs and understand others' perspectives.",
          },
          {
            keyword: 'Respect',
            example:
              'Learning conflict resolution promotes respect for different viewpoints and helps students value diverse perspectives.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Teaching conflict resolution can improve student behavior by providing tools to handle disagreements constructively rather than aggressively.',
          },
          {
            keyword: 'Problem-solving',
            example:
              'Conflict resolution develops problem-solving skills that help students find creative solutions to disagreements.',
          },
        ],
      },
      {
        question:
          'Is it better to have a long commute or live in a smaller home?',
        keywords: [
          {
            keyword: 'Space',
            example:
              'Living in a smaller home requires creative use of space and may mean sacrificing some comfort and storage options.',
          },
          {
            keyword: 'Convenience',
            example:
              'Smaller homes are often more convenient to maintain and clean, requiring less time and effort than larger properties.',
          },
          {
            keyword: 'Cost',
            example:
              'Smaller homes typically cost less to purchase, maintain, and heat, making them more affordable for many people.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'The choice between small and large homes depends on lifestyle factors like family size, entertaining needs, and personal preferences.',
          },
          {
            keyword: 'Priorities',
            example:
              'Choosing home size reflects priorities - some value space and comfort while others prioritize affordability and simplicity.',
          },
        ],
      },
      {
        question: 'Should companies reward employees for healthy habits?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Financial rewards can motivate employees to adopt healthy habits, but intrinsic motivation may be more sustainable long-term.',
          },
          {
            keyword: 'Participation',
            example:
              'Rewards can increase participation in wellness programs, encouraging more employees to engage in healthy activities.',
          },
          {
            keyword: 'Incentives',
            example:
              'Wellness incentives can be effective, but must be designed to support genuine health improvements rather than just participation.',
          },
          {
            keyword: 'Responsibility',
            example:
              'While companies can support healthy habits, employees also bear personal responsibility for their own health choices.',
          },
        ],
      },
      {
        question: 'Do holidays improve productivity at work?',
        keywords: [
          {
            keyword: 'Rest',
            example:
              'Taking regular breaks and rest periods is essential for maintaining energy and preventing burnout in the workplace.',
          },
          {
            keyword: 'Motivation',
            example:
              'Adequate rest can restore motivation and enthusiasm, helping employees maintain engagement and productivity.',
          },
          {
            keyword: 'Performance',
            example:
              'Well-rested employees perform better, with improved focus, decision-making, and overall work quality.',
          },
          {
            keyword: 'Balance',
            example:
              'Finding balance between work and rest is crucial for long-term career success and personal wellbeing.',
          },
          {
            keyword: 'Energy',
            example:
              'Regular rest periods help maintain energy levels throughout the workday, preventing fatigue and maintaining performance.',
          },
        ],
      },

      {
        question: 'Should people reduce the amount of clothing they buy?',
        keywords: [
          {
            keyword: 'Consumption',
            example:
              'Reducing clothing consumption can help minimize environmental impact and reduce the demand for fast fashion production.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Buying less clothing supports sustainability by reducing resource use, waste, and the environmental costs of manufacturing.',
          },
          {
            keyword: 'Habits',
            example:
              'Developing habits of buying less and choosing quality over quantity can lead to more sustainable consumption patterns.',
          },
          {
            keyword: 'Value',
            example:
              'Buying fewer, higher-quality items often provides better value than purchasing many cheaper, lower-quality pieces.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Reducing clothing purchases reflects personal responsibility for environmental impact and conscious consumption choices.',
          },
        ],
      },
      {
        question: 'Are smartphones making people more impatient?',
        keywords: [
          'Expectations',
          'Behaviour',
          'Attention',
          'Frustration',
          'Habits',
        ],
      },
      {
        question: 'Should schools provide free breakfasts for students?',
        keywords: [
          {
            keyword: 'Nutrition',
            example:
              'School meals can provide essential nutrition for students who might not have access to healthy food at home.',
          },
          {
            keyword: 'Energy',
            example:
              'Proper nutrition from school meals provides energy that helps students focus, learn, and participate in activities.',
          },
          {
            keyword: 'Access',
            example:
              "Free school meals ensure all students have access to nutritious food regardless of their family's financial situation.",
          },
          {
            keyword: 'Wellbeing',
            example:
              "Regular, nutritious school meals contribute to students' physical and mental wellbeing, supporting overall health and development.",
          },
          {
            keyword: 'Performance',
            example:
              'Well-nourished students perform better academically, with improved concentration, memory, and cognitive function.',
          },
        ],
      },
      {
        question: 'Is it better to work fewer hours with lower pay?',
        keywords: [
          {
            keyword: 'Balance',
            example:
              'Working fewer hours can improve work-life balance, providing more time for family, hobbies, and personal activities.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'More free time can improve physical and mental wellbeing, reducing stress and allowing time for self-care and rest.',
          },
          {
            keyword: 'Security',
            example:
              'Lower pay may reduce financial security, making it difficult to save for emergencies or future needs.',
          },
          {
            keyword: 'Motivation',
            example:
              'Having more time for personal interests can increase overall life satisfaction and motivation, even with lower income.',
          },
        ],
      },
      {
        question:
          'Do cities need stricter noise rules to protect residents’ wellbeing?',
        keywords: [
          'Disturbance',
          'Comfort',
          'Health',
          'Behaviour',
          'Enforcement',
        ],
      },
      {
        question: 'Are video calls as effective as in-person meetings?',
        keywords: [
          'Interaction',
          'Clarity',
          'Communication',
          'Efficiency',
          'Engagement',
        ],
      },
      {
        question: 'Should children spend more time outdoors?',
        keywords: [
          'Health',
          'Creativity',
          'Activity',
          'Development',
          'Exploration',
        ],
      },
      {
        question: 'Is it better to take many short breaks or one long holiday?',
        keywords: [
          {
            keyword: 'Rest',
            example:
              'Taking regular weekends off provides essential rest that helps employees recharge and maintain work-life balance.',
          },
          {
            keyword: 'Productivity',
            example:
              'Well-rested employees are more productive during the week, making weekend rest beneficial for overall work performance.',
          },
          {
            keyword: 'Planning',
            example:
              'Weekend rest requires planning to ensure work is completed during the week, promoting better time management.',
          },
          {
            keyword: 'Balance',
            example:
              'Weekend rest helps maintain balance between work responsibilities and personal life, preventing burnout.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Regular weekend rest is essential for physical and mental wellbeing, reducing stress and improving overall quality of life.',
          },
        ],
      },
      {
        question: 'Should companies invest more in employee wellbeing?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Investing in employee wellbeing can increase motivation and engagement, leading to better job performance and satisfaction.',
          },
          {
            keyword: 'Performance',
            example:
              'Healthier, happier employees are generally more productive, making wellbeing investments beneficial for business outcomes.',
          },
          {
            keyword: 'Support',
            example:
              'Wellbeing programs show that companies support their employees, creating loyalty and improving workplace culture.',
          },
          {
            keyword: 'Satisfaction',
            example:
              'Employees who feel their wellbeing is valued report higher job satisfaction and are more likely to stay with the company.',
          },
        ],
      },
      {
        question: 'Do smartphones make parenting more challenging?',
        keywords: [
          'Attention',
          'Boundaries',
          'Behaviour',
          'Communication',
          'Supervision',
        ],
      },

      {
        question: 'Should schools introduce more digital learning tools?',
        keywords: [
          'Technology',
          'Engagement',
          'Access',
          'Flexibility',
          'Efficiency',
        ],
      },
      {
        question: 'Is it better to finish tasks quickly or carefully?',
        keywords: [
          'Accuracy',
          'Pressure',
          'Quality',
          'Habits',
          'Time management',
        ],
      },
      {
        question: 'Is promoting cycling an effective way to improve city life?',
        keywords: [
          'Safety',
          'Mobility',
          'Environment',
          'Planning',
          'Sustainability',
        ],
      },
      {
        question: 'Are supermarkets wasting too much food?',
        keywords: [
          'Consumption',
          'Responsibility',
          'Efficiency',
          'Sustainability',
          'Supply',
        ],
      },
      {
        question: 'Should students be allowed to retake exams?',
        keywords: [
          'Motivation',
          'Fairness',
          'Opportunity',
          'Performance',
          'Learning',
        ],
      },
      {
        question: 'Does working from home reduce teamwork?',
        keywords: [
          'Communication',
          'Connection',
          'Collaboration',
          'Efficiency',
          'Habits',
        ],
      },
      {
        question: 'Should students be allowed to choose their teachers?',
        keywords: [
          'Compatibility',
          'Fairness',
          'Motivation',
          'Responsibility',
          'Preferences',
        ],
      },
      {
        question: 'Is it better to make decisions slowly or quickly?',
        keywords: [
          {
            keyword: 'Confidence',
            example:
              'Making independent decisions builds confidence and self-reliance, helping children trust their own judgment and abilities.',
          },
          {
            keyword: 'Risk',
            example:
              'Allowing children to make decisions involves accepting some risk, but this risk is necessary for learning and growth.',
          },
          {
            keyword: 'Analysis',
            example:
              'Making decisions independently helps children develop analytical thinking skills and learn to evaluate options carefully.',
          },
          {
            keyword: 'Pressure',
            example:
              'While independence is valuable, children may feel pressure when making decisions without guidance, especially for important choices.',
          },
          {
            keyword: 'Judgement',
            example:
              'Independent decision-making helps children develop good judgement through experience, learning from both successes and mistakes.',
          },
        ],
      },
      {
        question: 'Should advertisements for gambling be banned?',
        keywords: [
          {
            keyword: 'Protection',
            example:
              'Banning gambling ads can protect vulnerable individuals, especially those with addiction problems, from being triggered to gamble.',
          },
          {
            keyword: 'Responsibility',
            example:
              'The gambling industry has a responsibility to advertise responsibly, but self-regulation may not be sufficient to protect vulnerable people.',
          },
          {
            keyword: 'Influence',
            example:
              'Gambling advertisements have significant influence on behavior, normalizing gambling and potentially encouraging problem gambling among vulnerable populations.',
          },
          {
            keyword: 'Regulation',
            example:
              'Stricter regulation of gambling advertisements may be necessary to protect public health and prevent gambling-related harm.',
          },
        ],
      },
      {
        question: 'Are shared workspaces better than private offices?',
        keywords: [
          'Interaction',
          'Creativity',
          'Noise',
          'Collaboration',
          'Flexibility',
        ],
      },

      {
        question: 'Should people reduce their screen time before bed?',
        keywords: [
          {
            keyword: 'Sleep',
            example:
              'Screen time before bed can disrupt sleep patterns by suppressing melatonin production and keeping the brain alert.',
          },
          {
            keyword: 'Health',
            example:
              'Excessive screen time can negatively impact physical health, contributing to eye strain, poor posture, and sedentary behavior.',
          },
          {
            keyword: 'Habits',
            example:
              'Regular screen use before bed creates habits that can be difficult to break and may interfere with healthy sleep routines.',
          },
          {
            keyword: 'Exposure',
            example:
              'Blue light exposure from screens before bedtime can interfere with natural sleep cycles and reduce sleep quality.',
          },
          {
            keyword: 'Concentration',
            example:
              'Excessive screen time can reduce the ability to concentrate on tasks that require sustained attention and focus.',
          },
        ],
      },
      {
        question: 'Should companies shorten meetings to fifteen minutes?',
        keywords: [
          {
            keyword: 'Efficiency',
            example:
              'Shorter meetings force participants to be more efficient, focusing on essential points and making decisions quickly.',
          },
          {
            keyword: 'Planning',
            example:
              'Fifteen-minute meetings require better planning and preparation to ensure all important topics are covered effectively.',
          },
          {
            keyword: 'Productivity',
            example:
              'Reducing meeting length can increase overall productivity by minimizing interruptions and preserving time for deep work.',
          },
          {
            keyword: 'Priorities',
            example:
              'Short meetings help prioritize the most important topics, forcing participants to focus on what truly matters.',
          },
        ],
      },
      {
        question: 'Is it better to buy second-hand products?',
        keywords: [
          {
            keyword: 'Cost',
            example:
              'Buying second-hand items is typically more cost-effective than purchasing new, making it accessible to people with limited budgets.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Second-hand shopping supports sustainability by extending the life of products and reducing waste and resource consumption.',
          },
          {
            keyword: 'Quality',
            example:
              'While second-hand items can be high quality, there may be concerns about wear, condition, and lack of warranty.',
          },
          {
            keyword: 'Habits',
            example:
              'Developing habits of buying second-hand can reduce consumption and support more sustainable lifestyle choices.',
          },
          {
            keyword: 'Value',
            example:
              'Second-hand shopping can provide excellent value, allowing people to acquire quality items at a fraction of the original cost.',
          },
        ],
      },
      {
        question:
          'Do small businesses receive enough support to stay competitive?',
        keywords: [
          {
            keyword: 'Development',
            example:
              'Small businesses need support for development, including access to funding, training, and business development resources.',
          },
          {
            keyword: 'Competition',
            example:
              'Small businesses face intense competition from larger corporations that have more resources and market power.',
          },
          {
            keyword: 'Stability',
            example:
              'Without adequate support, many small businesses struggle to achieve stability, leading to closures and economic uncertainty.',
          },
          {
            keyword: 'Innovation',
            example:
              'While small businesses can be innovative, they may lack the resources to develop and scale their innovations effectively.',
          },
          {
            keyword: 'Community',
            example:
              'Small businesses contribute to local communities, and supporting them helps maintain economic diversity and local character.',
          },
        ],
      },
      {
        question: 'Are school uniforms old-fashioned?',
        keywords: [
          'Tradition',
          'Identity',
          'Expectations',
          'Equality',
          'Discipline',
        ],
      },
      {
        question: 'Should cities invest in better cycling lanes?',
        keywords: [
          'Safety',
          'Planning',
          'Mobility',
          'Convenience',
          'Sustainability',
        ],
      },
      {
        question: 'Does social media reduce independence in young people?',
        keywords: [
          'Confidence',
          'Behaviour',
          'Expectations',
          'Comparison',
          'Influence',
        ],
      },
      {
        question:
          'Should companies publish their environmental impact reports?',
        keywords: [
          'Transparency',
          'Responsibility',
          'Sustainability',
          'Performance',
          'Regulation',
        ],
      },
      {
        question: 'Is it better to study one subject deeply or learn many?',
        keywords: [
          {
            keyword: 'Focus',
            example:
              'Specializing in one area allows for deep focus and mastery, while generalizing provides broader but shallower knowledge.',
          },
          {
            keyword: 'Range',
            example:
              'Having a wide range of knowledge makes people more adaptable, but may prevent them from becoming experts in any one area.',
          },
          {
            keyword: 'Expertise',
            example:
              'Specialization leads to expertise and can make individuals highly valuable in their specific field.',
          },
          {
            keyword: 'Curiosity',
            example:
              'General knowledge satisfies curiosity about many topics, while specialization may limit exploration of other interests.',
          },
          {
            keyword: 'Development',
            example:
              'Both approaches support development - specialization in depth, generalization in breadth and adaptability.',
          },
        ],
      },
      {
        question: 'Should parents control how much TV their children watch?',
        keywords: [
          {
            keyword: 'Habits',
            example:
              'Controlling TV viewing helps children develop healthy media consumption habits and prevents excessive screen time.',
          },
          {
            keyword: 'Supervision',
            example:
              'Parental supervision of TV viewing ensures children are exposed to age-appropriate content and protected from harmful material.',
          },
          {
            keyword: 'Behaviour',
            example:
              "Excessive TV watching can negatively affect children's behavior, attention span, and social development.",
          },
          {
            keyword: 'Wellbeing',
            example:
              "Limiting TV time supports children's physical and mental wellbeing by encouraging active play and other activities.",
          },
          {
            keyword: 'Limits',
            example:
              'Setting appropriate limits on TV viewing helps children learn self-regulation and balance screen time with other activities.',
          },
        ],
      },

      {
        question: 'Would alcohol-free public events create a safer atmosphere?',
        keywords: [
          'Safety',
          'Behaviour',
          'Atmosphere',
          'Responsibility',
          'Health',
        ],
      },
      {
        question:
          'Is it better to travel frequently or stay in one place longer?',
        keywords: [
          {
            keyword: 'Experience',
            example:
              'Travel provides valuable life experiences, cultural exposure, and personal growth that cannot be gained from staying home.',
          },
          {
            keyword: 'Cost',
            example:
              'Travel can be expensive, and the money spent on trips might be better used for savings, investments, or other priorities.',
          },
          {
            keyword: 'Depth',
            example:
              'While travel offers breadth of experience, staying home allows for deeper engagement with local community and relationships.',
          },
          {
            keyword: 'Planning',
            example:
              'Travel requires planning and can be stressful, while staying home offers simplicity and reduces planning burdens.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'The choice between travel and staying home depends on lifestyle preferences, financial situation, and personal values.',
          },
        ],
      },
      {
        question: 'Should schools give less homework to young children?',
        keywords: [
          {
            keyword: 'Development',
            example:
              'Reducing homework allows young children more time for physical development, play, and social interaction, which are crucial at this age.',
          },
          {
            keyword: 'Pressure',
            example:
              'Too much homework creates pressure on young children, potentially leading to stress, anxiety, and burnout at an early age.',
          },
          {
            keyword: 'Concentration',
            example:
              'Young children have limited attention spans, and excessive homework may exceed their ability to concentrate effectively.',
          },
          {
            keyword: 'Wellbeing',
            example:
              "Less homework supports children's wellbeing by allowing time for rest, play, and family activities that are essential for healthy development.",
          },
        ],
      },
      {
        question: 'Are electric vehicles becoming too expensive?',
        keywords: [
          'Affordability',
          'Technology',
          'Demand',
          'Sustainability',
          'Access',
        ],
      },
      {
        question: 'Should companies offer mental health training?',
        keywords: [
          'Awareness',
          'Support',
          'Resilience',
          'Wellbeing',
          'Communication',
        ],
      },
      {
        question:
          'Is public art valuable enough to deserve more community investment?',
        keywords: [
          'Culture',
          'Community',
          'Identity',
          'Expression',
          'Creativity',
        ],
      },
      {
        question: 'Is it better to shop online or in physical stores?',
        keywords: [
          {
            keyword: 'Convenience',
            example:
              'Online shopping offers convenience and saves time, but may lack the personal experience and immediate gratification of in-store shopping.',
          },
          {
            keyword: 'Experience',
            example:
              'In-store shopping provides sensory experiences like trying on clothes or seeing products in person that online shopping cannot replicate.',
          },
          {
            keyword: 'Cost',
            example:
              'Online shopping often offers better prices and deals, while in-store shopping may have higher prices but allows immediate purchase.',
          },
          {
            keyword: 'Choice',
            example:
              'Online shopping provides more choice and variety, while in-store shopping offers immediate availability and the ability to inspect items.',
          },
          {
            keyword: 'Habits',
            example:
              'Shopping habits are changing, with many people preferring online convenience while others value the social and sensory aspects of in-store shopping.',
          },
        ],
      },
      {
        question: 'Should schools teach basic home maintenance skills?',
        keywords: [
          {
            keyword: 'Independence',
            example:
              'Learning home maintenance skills promotes independence, allowing students to handle basic repairs and maintenance when they live on their own.',
          },
          {
            keyword: 'Responsibility',
            example:
              "Learning to maintain a home teaches responsibility and care for one's living space and property.",
          },
          {
            keyword: 'Confidence',
            example:
              'Knowing how to perform basic home maintenance builds confidence and reduces dependence on professionals for simple tasks.',
          },
          {
            keyword: 'Preparation',
            example:
              'Teaching home maintenance prepares students for adulthood, giving them confidence to handle common household issues.',
          },
        ],
      },
      {
        question: 'Do smartphones make it harder to relax?',
        keywords: [
          {
            keyword: 'Stress',
            example:
              'Constant connectivity through smartphones can create stress by making people feel always available and unable to disconnect.',
          },
          {
            keyword: 'Habits',
            example:
              'Smartphone use creates habits of constant checking and responding, which can interfere with work-life boundaries.',
          },
          {
            keyword: 'Attention',
            example:
              'Smartphone notifications fragment attention and make it difficult to focus on work tasks or personal activities.',
          },
          {
            keyword: 'Boundaries',
            example:
              'Setting boundaries around smartphone use is essential for maintaining work-life balance and personal wellbeing.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Excessive smartphone use can negatively impact wellbeing by reducing face-to-face interaction and increasing stress and anxiety.',
          },
        ],
      },
      {
        question: 'Are holiday prices becoming too high for most families?',
        keywords: [
          {
            keyword: 'Affordability',
            example:
              'Rising holiday prices make vacations unaffordable for many families, limiting their ability to travel and take breaks.',
          },
          {
            keyword: 'Fairness',
            example:
              'High holiday prices create inequality, where only wealthier families can afford to travel, excluding many from vacation opportunities.',
          },
          {
            keyword: 'Tourism',
            example:
              'While high prices may benefit tourism businesses, they limit access and may reduce overall tourism numbers in the long term.',
          },
          {
            keyword: 'Stability',
            example:
              'Price stability in the holiday market is important for families to plan and budget for vacations effectively.',
          },
        ],
      },

      {
        question:
          'Is it better to have a predictable routine or a flexible one?',
        keywords: [
          {
            keyword: 'Structure',
            example:
              'Working from home requires creating structure and routines to maintain productivity and separate work from personal life.',
          },
          {
            keyword: 'Habits',
            example:
              'Remote work requires developing new habits for time management, communication, and maintaining work-life boundaries.',
          },
          {
            keyword: 'Comfort',
            example:
              'Working from home offers comfort and convenience, but may lack the structure and social interaction of office environments.',
          },
          {
            keyword: 'Balance',
            example:
              'Maintaining work-life balance can be challenging when working from home, as boundaries between work and personal time blur.',
          },
          {
            keyword: 'Productivity',
            example:
              'While some people are more productive at home, others may struggle with distractions and lack of structure.',
          },
        ],
      },
      {
        question: 'Should companies limit after-hours communication?',
        keywords: [
          {
            keyword: 'Boundaries',
            example:
              'Limiting after-hours communication helps establish healthy boundaries between work and personal life, preventing burnout.',
          },
          {
            keyword: 'Professionalism',
            example:
              'While professionalism is important, respecting personal time is also a professional standard that supports employee wellbeing.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Protecting after-hours time improves employee wellbeing by allowing complete disconnection and recovery from work stress.',
          },
          {
            keyword: 'Expectations',
            example:
              'Clear policies about after-hours communication set expectations and prevent employees from feeling obligated to respond immediately.',
          },
        ],
      },
      {
        question:
          'Are younger generations facing more pressure than previous ones?',
        keywords: [
          'Expectations',
          'Competition',
          'Wellbeing',
          'Opportunity',
          'Comparison',
        ],
      },
      {
        question: 'Should people reduce their meat consumption?',
        keywords: [
          {
            keyword: 'Health',
            example:
              'Plant-based diets can improve health by reducing risk of chronic diseases, but require careful planning to ensure adequate nutrition.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Plant-based diets are more sustainable, requiring fewer resources and producing less environmental impact than meat-based diets.',
          },
          {
            keyword: 'Habits',
            example:
              'Adopting a plant-based diet requires changing eating habits and learning new ways to prepare and enjoy food.',
          },
          {
            keyword: 'Nutrition',
            example:
              'While plant-based diets can be nutritious, they require knowledge to ensure adequate intake of protein, iron, and other essential nutrients.',
          },
          {
            keyword: 'Impact',
            example:
              'Widespread adoption of plant-based diets could have significant positive impact on the environment and animal welfare.',
          },
        ],
      },
      {
        question:
          'Is affordable childcare essential for helping more parents stay in work?',
        keywords: [
          {
            keyword: 'Access',
            example:
              'Affordable childcare ensures all parents have access to quality care, regardless of their financial situation.',
          },
          {
            keyword: 'Equality',
            example:
              'Accessible childcare promotes gender equality by enabling both parents to work and pursue careers.',
          },
          {
            keyword: 'Support',
            example:
              'Affordable childcare provides essential support for working families, allowing parents to maintain employment while ensuring children are well-cared for.',
          },
          {
            keyword: 'Employment',
            example:
              'Without affordable childcare, many parents, especially mothers, are forced to leave the workforce or work part-time.',
          },
          {
            keyword: 'Stability',
            example:
              'Reliable, affordable childcare provides stability for families and enables parents to maintain consistent employment.',
          },
        ],
      },
      {
        question: 'Is it better to be optimistic or realistic?',
        keywords: [
          {
            keyword: 'Perspective',
            example:
              'Optimism provides a positive perspective that can improve mood and motivation, while realism offers a more accurate view of situations.',
          },
          {
            keyword: 'Resilience',
            example:
              'Optimistic people often show greater resilience in facing challenges, while realistic thinking helps with preparation and planning.',
          },
          {
            keyword: 'Motivation',
            example:
              'Optimistic expectations can motivate action, but unrealistic optimism may lead to disappointment and poor preparation.',
          },
          {
            keyword: 'Decision-making',
            example:
              'Realistic thinking supports better decision-making by providing accurate assessments, while optimism can sometimes cloud judgment.',
          },
        ],
      },
      {
        question: 'Should schools teach students how to debate properly?',
        keywords: [
          'Confidence',
          'Structure',
          'Communication',
          'Critical thinking',
          'Preparation',
        ],
      },
      {
        question: 'Does working long hours reduce overall productivity?',
        keywords: [
          {
            keyword: 'Energy',
            example:
              'Working from home can save energy spent on commuting, but may require more self-discipline to maintain productivity.',
          },
          {
            keyword: 'Efficiency',
            example:
              'Remote work can increase efficiency by eliminating commute time and office distractions, but requires good self-management.',
          },
          {
            keyword: 'Stress',
            example:
              'While remote work can reduce commuting stress, it may create new stressors related to isolation and work-life boundaries.',
          },
          {
            keyword: 'Performance',
            example:
              'Performance in remote work depends on individual self-discipline, work environment, and ability to stay focused without supervision.',
          },
          {
            keyword: 'Balance',
            example:
              'Remote work can improve work-life balance by providing flexibility, but requires setting clear boundaries to prevent overwork.',
          },
        ],
      },
      {
        question:
          'Should supermarkets stop offering discounts on unhealthy foods?',
        keywords: [
          {
            keyword: 'Marketing',
            example:
              'Discounts on unhealthy foods are marketing strategies that encourage consumption of products that may harm public health.',
          },
          {
            keyword: 'Habits',
            example:
              'Discounts can create habits of purchasing unhealthy foods, making it harder for people to choose healthier options.',
          },
          {
            keyword: 'Health',
            example:
              'Stopping discounts on unhealthy foods could improve public health by reducing consumption of high-sugar, high-fat products.',
          },
          {
            keyword: 'Influence',
            example:
              'Supermarket pricing has significant influence on consumer choices, especially for price-sensitive shoppers.',
          },
          {
            keyword: 'Responsibility',
            example:
              'Supermarkets have a responsibility to promote healthy choices, but critics argue they should not restrict consumer freedom.',
          },
        ],
      },
      {
        question:
          'Is it better to live in a modern apartment or an older house?',
        keywords: [
          'Comfort',
          'Maintenance',
          'Design',
          'Character',
          'Lifestyle',
        ],
      },

      {
        question:
          'Is it better to focus on one long-term goal or many short-term ones?',
        keywords: [
          'Motivation',
          'Priorities',
          'Planning',
          'Discipline',
          'Achievement',
        ],
      },
      {
        question:
          'Do smartphones make us too dependent on constant stimulation?',
        keywords: [
          {
            keyword: 'Attention',
            example:
              'Morning routines help focus attention and set a positive tone for the day, improving productivity and mental clarity.',
          },
          {
            keyword: 'Habits',
            example:
              'Establishing consistent morning habits creates structure and can lead to better overall daily performance and wellbeing.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Morning routines can influence behavior throughout the day, setting patterns for how time and energy are managed.',
          },
          {
            keyword: 'Routine',
            example:
              'A structured morning routine provides predictability and reduces decision fatigue, making the start of the day smoother.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Well-designed morning routines that include self-care activities can significantly improve overall wellbeing and life satisfaction.',
          },
        ],
      },
      {
        question: 'Is it better to live with a friend or alone?',
        keywords: [
          {
            keyword: 'Privacy',
            example:
              'Living alone provides complete privacy and freedom, while living with a friend requires sharing space and compromising on privacy.',
          },
          {
            keyword: 'Communication',
            example:
              'Living with a friend requires good communication to manage shared responsibilities and avoid conflicts.',
          },
          {
            keyword: 'Independence',
            example:
              "Living alone provides complete independence, while living with a friend requires consideration of another person's needs and preferences.",
          },
          {
            keyword: 'Lifestyle',
            example:
              'The choice between living alone or with a friend depends on lifestyle preferences, financial situation, and social needs.',
          },
        ],
      },
      {
        question: 'Does having too many choices make life more difficult?',
        keywords: [
          'Decision-making',
          'Expectations',
          'Pressure',
          'Satisfaction',
          'Behaviour',
        ],
      },
      {
        question: 'Are people becoming too focused on self-improvement?',
        keywords: [
          'Pressure',
          'Motivation',
          'Identity',
          'Expectations',
          'Balance',
        ],
      },
      {
        question: 'Is it better to be highly organised or naturally flexible?',
        keywords: [
          'Structure',
          'Habits',
          'Adaptability',
          'Routine',
          'Productivity',
        ],
      },
      {
        question: 'Do smartphones make people less creative?',
        keywords: [
          'Imagination',
          'Habits',
          'Distraction',
          'Exploration',
          'Expression',
        ],
      },
      {
        question:
          'Should students be encouraged to question their teachers more?',
        keywords: [
          'Confidence',
          'Critical thinking',
          'Communication',
          'Respect',
          'Independence',
        ],
      },
      {
        question: 'Is social media changing the way we form friendships?',
        keywords: [
          'Connection',
          'Behaviour',
          'Trust',
          'Communication',
          'Expectations',
        ],
      },
      {
        question:
          'Are people too focused on documenting their lives instead of living them?',
        keywords: [
          'Memory',
          'Experience',
          'Pressure',
          'Distraction',
          'Attention',
        ],
      },

      {
        question: 'Is remote learning suitable for younger students?',
        keywords: [
          'Attention',
          'Support',
          'Behaviour',
          'Development',
          'Engagement',
        ],
      },
      {
        question: 'Do people judge others too quickly based on appearance?',
        keywords: [
          'Perception',
          'Bias',
          'Behaviour',
          'Expectations',
          'Impression',
        ],
      },
      {
        question: 'Is it better to wake up early or stay up late?',
        keywords: [
          {
            keyword: 'Energy',
            example:
              'Waking up early can provide more energy and productive hours, but requires discipline and may reduce sleep if not managed properly.',
          },
          {
            keyword: 'Routine',
            example:
              'Early rising creates routine and structure, but may conflict with natural sleep patterns and social activities.',
          },
          {
            keyword: 'Productivity',
            example:
              'Early mornings can be highly productive times with fewer distractions, but productivity depends on individual chronotype.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Early rising suits some lifestyles and careers, but may not be compatible with night shifts or evening social activities.',
          },
          {
            keyword: 'Habits',
            example:
              "Developing the habit of early rising takes time and consistency, and may not be suitable for everyone's natural rhythms.",
          },
        ],
      },
      {
        question: 'Does modern life make it harder to find real rest?',
        keywords: [
          {
            keyword: 'Stress',
            example:
              'Constant stimulation from technology and busy schedules can create stress that makes it difficult to truly rest and recharge.',
          },
          {
            keyword: 'Stimulation',
            example:
              'The constant stimulation of modern life - from screens to notifications to busy schedules - can make genuine rest feel impossible.',
          },
          {
            keyword: 'Routine',
            example:
              'Modern routines often prioritize productivity and activity over rest, making it challenging to create space for true relaxation.',
          },
          {
            keyword: 'Wellbeing',
            example:
              'Without adequate rest, wellbeing suffers, leading to burnout, decreased mental health, and reduced overall quality of life.',
          },
          {
            keyword: 'Balance',
            example:
              'Finding balance between activity and rest requires intentional effort in a culture that often values productivity over restoration.',
          },
        ],
      },
      {
        question:
          'Is it better to follow your passion or choose a practical path?',
        keywords: [
          {
            keyword: 'Fulfilment',
            example:
              'Following your passion can lead to deep personal fulfillment and a sense of purpose that practical paths may not provide.',
          },
          {
            keyword: 'Security',
            example:
              'Practical paths often provide more financial security and stability, reducing stress and allowing for better long-term planning.',
          },
          {
            keyword: 'Ambition',
            example:
              'Both paths can satisfy ambition - passion through personal achievement, practical paths through career advancement and stability.',
          },
          {
            keyword: 'Opportunity',
            example:
              'Passion paths may offer unique opportunities for creativity and self-expression, while practical paths provide more predictable career opportunities.',
          },
          {
            keyword: 'Priorities',
            example:
              'The choice depends on individual priorities - some value fulfillment and purpose, while others prioritize security and stability.',
          },
        ],
      },
      {
        question: 'Are young people today under too much pressure to succeed?',
        keywords: [
          'Expectations',
          'Comparison',
          'Competition',
          'Resilience',
          'Wellbeing',
        ],
      },
      {
        question:
          'Is it better to have a large network or a few close friends?',
        keywords: [
          'Connection',
          'Trust',
          'Support',
          'Diversity',
          'Consistency',
        ],
      },
      {
        question: 'Do smartphones make multitasking easier or worse?',
        keywords: [
          'Efficiency',
          'Distraction',
          'Habits',
          'Performance',
          'Focus',
        ],
      },
      {
        question:
          'Should schools give more opportunities for creative expression?',
        keywords: [
          'Confidence',
          'Imagination',
          'Engagement',
          'Identity',
          'Motivation',
        ],
      },
      {
        question: 'Are people losing interest in long-form reading?',
        keywords: [
          'Attention',
          'Habits',
          'Entertainment',
          'Comprehension',
          'Preference',
        ],
      },

      {
        question: 'Is it better to live in a noisy area or a very quiet one?',
        keywords: [
          'Comfort',
          'Concentration',
          'Lifestyle',
          'Stress',
          'Environment',
        ],
      },
      {
        question: 'Does technology make parenting easier or more challenging?',
        keywords: [
          'Supervision',
          'Habits',
          'Communication',
          'Influence',
          'Boundaries',
        ],
      },
      {
        question: 'Are people too dependent on food delivery apps?',
        keywords: [
          {
            keyword: 'Convenience',
            example:
              'Fast food offers convenience for busy individuals and families who may not have time to prepare meals at home.',
          },
          {
            keyword: 'Cost',
            example:
              'While fast food may seem cheaper initially, home cooking is generally more cost-effective and provides better nutritional value.',
          },
          {
            keyword: 'Health',
            example:
              'Fast food is typically high in calories, sodium, and unhealthy fats, contributing to obesity and chronic health problems.',
          },
          {
            keyword: 'Habits',
            example:
              'Regular fast food consumption can create unhealthy eating habits that are difficult to break and may persist into adulthood.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'The choice between fast food and home cooking depends on lifestyle factors like time availability, cooking skills, and health priorities.',
          },
        ],
      },
      {
        question:
          'Should children be encouraged to solve problems independently?',
        keywords: [
          {
            keyword: 'Confidence',
            example:
              'Solving problems independently builds confidence and self-reliance, helping children trust their own abilities and judgment.',
          },
          {
            keyword: 'Resilience',
            example:
              'Facing challenges independently develops resilience, teaching children to persevere and adapt when facing difficulties.',
          },
          {
            keyword: 'Critical thinking',
            example:
              'Independent problem-solving develops critical thinking skills, helping children analyze situations and develop creative solutions.',
          },
          {
            keyword: 'Support',
            example:
              'While independence is important, children also need support and guidance to learn effective problem-solving strategies.',
          },
          {
            keyword: 'Judgement',
            example:
              'Independent decision-making helps children develop good judgement through experience, learning from both successes and mistakes.',
          },
        ],
      },
      {
        question: 'Do people overshare personal information online?',
        keywords: [
          {
            keyword: 'Privacy',
            example:
              "Parents monitoring social media must balance protecting children's privacy with ensuring their safety online.",
          },
          {
            keyword: 'Boundaries',
            example:
              'Setting boundaries around social media use helps protect children while teaching them responsible online behavior.',
          },
          {
            keyword: 'Judgement',
            example:
              "Parental monitoring can help guide children's judgment about what to share online and how to interact safely.",
          },
          {
            keyword: 'Identity',
            example:
              "Excessive monitoring may interfere with children's identity development and sense of autonomy as they grow older.",
          },
          {
            keyword: 'Safety',
            example:
              'Monitoring social media helps protect children from online dangers including predators, cyberbullying, and inappropriate content.',
          },
        ],
      },
      {
        question: 'Is it better to listen to music while studying or not?',
        keywords: [
          {
            keyword: 'Concentration',
            example:
              'Music can help some people concentrate by blocking out distractions, while others find it interferes with their focus.',
          },
          {
            keyword: 'Productivity',
            example:
              'The impact of music on productivity varies by individual and task type - some work better with music, others need silence.',
          },
          {
            keyword: 'Comfort',
            example:
              'Music can create a comfortable study environment, but may also be distracting depending on the type of music and task.',
          },
          {
            keyword: 'Focus',
            example:
              'Some people use music to maintain focus during repetitive tasks, while complex problem-solving may require silence.',
          },
        ],
      },
      {
        question: 'Are career changes becoming more important in modern life?',
        keywords: [
          'Ambition',
          'Development',
          'Opportunity',
          'Flexibility',
          'Security',
        ],
      },
      {
        question: 'Does social media make people more or less confident?',
        keywords: [
          'Image',
          'Validation',
          'Comparison',
          'Perception',
          'Behaviour',
        ],
      },
      {
        question: 'Are strict routines helpful or limiting?',
        keywords: [
          'Discipline',
          'Flexibility',
          'Habits',
          'Productivity',
          'Comfort',
        ],
      },
      {
        question: 'Is physical appearance becoming too important in society?',
        keywords: [
          'Identity',
          'Pressure',
          'Expectations',
          'Self-esteem',
          'Perception',
        ],
      },

      {
        question:
          'Should students participate more in decision-making at school?',
        keywords: [
          'Responsibility',
          'Engagement',
          'Autonomy',
          'Communication',
          'Confidence',
        ],
      },
      {
        question: 'Are energy drinks too easily available to young people?',
        keywords: [
          {
            keyword: 'Health',
            example:
              'Excessive social media use can negatively impact mental health, contributing to anxiety, depression, and poor self-esteem.',
          },
          {
            keyword: 'Habits',
            example:
              'Social media creates habits of constant checking and comparison that can be difficult to break and may interfere with real-world interactions.',
          },
          {
            keyword: 'Risk',
            example:
              'Social media use involves risks including privacy concerns, cyberbullying, and exposure to inappropriate content.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Social media can influence behavior, creating pressure to present an idealized version of oneself and compare with others.',
          },
          {
            keyword: 'Awareness',
            example:
              "Developing awareness of social media's impact is important for using it in ways that support rather than harm wellbeing.",
          },
        ],
      },
      {
        question:
          'Is it better to buy one high-quality item or several cheaper ones?',
        keywords: [
          {
            keyword: 'Value',
            example:
              'High-quality items often provide better long-term value despite higher initial cost, lasting longer and performing better.',
          },
          {
            keyword: 'Durability',
            example:
              'Quality items are typically more durable, reducing the need for frequent replacements and saving money over time.',
          },
          {
            keyword: 'Sustainability',
            example:
              'Buying fewer, higher-quality items supports sustainability by reducing consumption, waste, and environmental impact.',
          },
          {
            keyword: 'Habits',
            example:
              'Choosing quality over quantity develops habits of thoughtful consumption and appreciation for well-made products.',
          },
          {
            keyword: 'Preference',
            example:
              'The choice between quality and quantity depends on personal preference, budget, and specific needs for the item.',
          },
        ],
      },
      {
        question: 'Do smartphones reduce our ability to think deeply?',
        keywords: [
          {
            keyword: 'Focus',
            example:
              'Meditation helps develop focus and concentration, training the mind to stay present and avoid distractions.',
          },
          {
            keyword: 'Reflection',
            example:
              'Regular meditation encourages reflection and self-awareness, helping people understand their thoughts and emotions better.',
          },
          {
            keyword: 'Habits',
            example:
              'Developing a meditation habit requires discipline and consistency, but can lead to lasting improvements in mental wellbeing.',
          },
          {
            keyword: 'Awareness',
            example:
              'Meditation increases awareness of thoughts, feelings, and bodily sensations, promoting mindfulness and emotional regulation.',
          },
          {
            keyword: 'Attention',
            example:
              'Meditation practice improves attention span and the ability to focus on tasks without being distracted by thoughts or external stimuli.',
          },
        ],
      },
      {
        question: 'Are modern workplaces becoming too informal?',
        keywords: [
          {
            keyword: 'Professionalism',
            example:
              'Informal workplaces may reduce professionalism, potentially affecting how employees are perceived by clients and colleagues.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Informal workplace culture can influence behavior, potentially blurring boundaries between professional and personal interactions.',
          },
          {
            keyword: 'Expectations',
            example:
              'Informal workplaces may create unclear expectations about appropriate behavior, dress, and communication standards.',
          },
          {
            keyword: 'Communication',
            example:
              'While informal communication can be more comfortable, it may lack the clarity and professionalism needed in certain contexts.',
          },
        ],
      },
      {
        question:
          'Should couples talk openly about finances before committing?',
        keywords: [
          'Trust',
          'Responsibility',
          'Communication',
          'Expectations',
          'Stability',
        ],
      },
      {
        question:
          'Is it better to have a predictable career or an unpredictable one?',
        keywords: [
          'Security',
          'Excitement',
          'Opportunity',
          'Stress',
          'Ambition',
        ],
      },
      {
        question: 'Does nostalgia make people see the past unrealistically?',
        keywords: [
          'Memory',
          'Perception',
          'Emotion',
          'Comparison',
          'Expectations',
        ],
      },
      {
        question: 'Are young adults too influenced by social trends?',
        keywords: [
          'Identity',
          'Behaviour',
          'Comparison',
          'Marketing',
          'Expectations',
        ],
      },
      {
        question:
          'Is it better to be optimistic or realistic when facing challenges?',
        keywords: [
          'Resilience',
          'Perspective',
          'Expectations',
          'Confidence',
          'Decision-making',
        ],
      },

      {
        question:
          'Do smartphones make communication more efficient or more confusing?',
        keywords: [
          'Clarity',
          'Misunderstanding',
          'Speed',
          'Tone',
          'Connection',
        ],
      },
      {
        question: 'Are people becoming too sensitive to criticism?',
        keywords: [
          'Feedback',
          'Confidence',
          'Judgement',
          'Resilience',
          'Perception',
        ],
      },
      {
        question: 'Is digital art as valuable as traditional art?',
        keywords: [
          'Creativity',
          'Expression',
          'Authenticity',
          'Technique',
          'Perception',
        ],
      },
      {
        question: 'Do modern diets create unnecessary pressure on people?',
        keywords: [
          'Identity',
          'Expectations',
          'Lifestyle',
          'Health',
          'Behaviour',
        ],
      },
      {
        question: 'Is it better to take regular digital breaks?',
        keywords: [
          'Balance',
          'Habits',
          'Wellbeing',
          'Concentration',
          'Boundaries',
        ],
      },
      {
        question: 'Are people too focused on achieving perfection?',
        keywords: [
          'Expectations',
          'Confidence',
          'Pressure',
          'Motivation',
          'Behaviour',
        ],
      },
      {
        question:
          'Does technology bring families closer together or push them apart?',
        keywords: [
          'Interaction',
          'Habits',
          'Connection',
          'Communication',
          'Expectations',
        ],
      },
      {
        question:
          'Is it better to work steadily or in intense bursts of focus?',
        keywords: [
          'Productivity',
          'Concentration',
          'Habits',
          'Discipline',
          'Energy',
        ],
      },
      {
        question:
          'Do young people rely too much on inspirational content online?',
        keywords: [
          'Motivation',
          'Comparison',
          'Expectations',
          'Influence',
          'Behaviour',
        ],
      },
      {
        question: 'Is the fear of missing out affecting people’s decisions?',
        keywords: [
          'Anxiety',
          'Habits',
          'Comparison',
          'Expectations',
          'Behaviour',
        ],
      },

      {
        question: 'Are modern relationships too focused on convenience?',
        keywords: [
          'Expectations',
          'Communication',
          'Habits',
          'Compatibility',
          'Lifestyle',
        ],
      },
      {
        question:
          'Is it better to learn one language deeply or several at a basic level?',
        keywords: [
          'Proficiency',
          'Communication',
          'Motivation',
          'Opportunity',
          'Development',
        ],
      },
      {
        question: 'Do smartphones make people more impatient?',
        keywords: [
          'Behaviour',
          'Habits',
          'Expectations',
          'Attention',
          'Frustration',
        ],
      },
      {
        question: 'Are people too focused on productivity?',
        keywords: [
          'Pressure',
          'Wellbeing',
          'Motivation',
          'Balance',
          'Expectations',
        ],
      },
      {
        question:
          'Should students get more opportunities for hands-on learning?',
        keywords: [
          'Engagement',
          'Understanding',
          'Experience',
          'Curiosity',
          'Motivation',
        ],
      },
      {
        question: 'Is social comparison becoming unavoidable?',
        keywords: [
          'Expectations',
          'Behaviour',
          'Perception',
          'Identity',
          'Pressure',
        ],
      },
      {
        question: 'Do inspirational quotes actually help people?',
        keywords: [
          'Motivation',
          'Reflection',
          'Perspective',
          'Encouragement',
          'Behaviour',
        ],
      },
      {
        question: 'Is gaming becoming a more meaningful form of entertainment?',
        keywords: [
          'Creativity',
          'Storytelling',
          'Engagement',
          'Community',
          'Experience',
        ],
      },
      {
        question: 'Are people too worried about looking productive?',
        keywords: [
          'Appearance',
          'Expectations',
          'Pressure',
          'Behaviour',
          'Identity',
        ],
      },
      {
        question: 'Is it better to live near your workplace for convenience?',
        keywords: [
          {
            keyword: 'Commuting',
            example:
              'Working from home eliminates daily commuting, saving time and reducing transportation costs and stress.',
          },
          {
            keyword: 'Lifestyle',
            example:
              'Remote work can improve lifestyle by providing more time for family, hobbies, and personal activities, but requires self-discipline.',
          },
          {
            keyword: 'Stress',
            example:
              'While remote work can reduce commuting stress, it may also create new stressors related to isolation and work-life boundaries.',
          },
          {
            keyword: 'Cost',
            example:
              'Working from home can reduce costs for both employees and employers, including office space, commuting, and work-related expenses.',
          },
          {
            keyword: 'Priorities',
            example:
              'The choice between remote and office work depends on individual priorities, job requirements, and personal work style preferences.',
          },
        ],
      },

      {
        question: 'Are young people losing interest in traditional hobbies?',
        keywords: [
          {
            keyword: 'Trends',
            example:
              "Digital trends and social media are influencing young people's interests, potentially reducing engagement with traditional hobbies.",
          },
          {
            keyword: 'Creativity',
            example:
              'While traditional hobbies often foster creativity, digital alternatives can also be creative, just in different ways.',
          },
          {
            keyword: 'Culture',
            example:
              'Cultural shifts toward digital entertainment may be replacing traditional hobbies, changing how young people spend their free time.',
          },
          {
            keyword: 'Habits',
            example:
              'Young people are developing different habits and interests, which may not include traditional hobbies like reading, crafts, or sports.',
          },
          {
            keyword: 'Engagement',
            example:
              'Traditional hobbies may require more sustained engagement and effort compared to quick digital entertainment options.',
          },
        ],
      },
      {
        question: 'Do smartphone notifications harm concentration?',
        keywords: [
          {
            keyword: 'Distraction',
            example:
              'Constant smartphone notifications create distractions that interrupt focus and make it difficult to concentrate on tasks.',
          },
          {
            keyword: 'Routine',
            example:
              'Notifications create routines of constant checking that fragment attention and reduce ability to maintain sustained focus.',
          },
          {
            keyword: 'Attention',
            example:
              'Frequent notifications train the brain to have shorter attention spans, making it harder to sustain focus on important tasks.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Notification-driven behavior creates habits of constant interruption that can become difficult to break and may reduce productivity.',
          },
        ],
      },
      {
        question:
          'Is it better to practise one talent intensely or explore many?',
        keywords: [
          'Mastery',
          'Curiosity',
          'Development',
          'Motivation',
          'Priorities',
        ],
      },
      {
        question: 'Are people becoming too reliant on digital calendars?',
        keywords: [
          'Organisation',
          'Habits',
          'Convenience',
          'Dependence',
          'Planning',
        ],
      },
      {
        question: 'Does minimalism truly improve wellbeing?',
        keywords: [
          {
            keyword: 'Simplicity',
            example:
              'Minimalism promotes simplicity by reducing clutter and focusing on what truly matters, which can lead to less stress and greater mental clarity.',
          },
          {
            keyword: 'Satisfaction',
            example:
              'Living with fewer possessions can increase satisfaction by helping people appreciate what they have rather than constantly seeking more.',
          },
          {
            keyword: 'Clarity',
            example:
              'A minimalist lifestyle can bring clarity to decision-making by eliminating unnecessary choices and distractions from daily life.',
          },
          {
            keyword: 'Habits',
            example:
              'Adopting minimalist habits requires discipline and intentional choices about what to keep and what to let go of.',
          },
          {
            keyword: 'Balance',
            example:
              'Minimalism seeks to create balance between having enough to be comfortable and avoiding excess that can cause stress and overwhelm.',
          },
        ],
      },
      {
        question: 'Is online learning making education more accessible?',
        keywords: [
          'Flexibility',
          'Opportunity',
          'Resources',
          'Engagement',
          'Convenience',
        ],
      },
      {
        question: 'Are people avoiding difficult conversations too often?',
        keywords: [
          'Communication',
          'Conflict',
          'Honesty',
          'Boundaries',
          'Trust',
        ],
      },
      {
        question: 'Is it better to read a physical book or an e-book?',
        keywords: [
          'Experience',
          'Convenience',
          'Habits',
          'Preference',
          'Engagement',
        ],
      },
      {
        question:
          'Are people too focused on taking photos instead of being present?',
        keywords: [
          'Memory',
          'Attention',
          'Distraction',
          'Experience',
          'Habits',
        ],
      },
      {
        question:
          'Does giving children too much praise affect their confidence?',
        keywords: [
          'Motivation',
          'Resilience',
          'Expectations',
          'Behaviour',
          'Development',
        ],
      },

      {
        question: 'Is it better to save money slowly or invest aggressively?',
        keywords: [
          {
            keyword: 'Risk',
            example:
              'Taking financial risks can lead to growth and opportunities, but also involves the possibility of significant losses.',
          },
          {
            keyword: 'Growth',
            example:
              'Some financial risks, like investments, can lead to growth and increased wealth, while others may result in losses.',
          },
          {
            keyword: 'Planning',
            example:
              'Effective financial planning balances risk-taking with security, ensuring both growth potential and protection of essential assets.',
          },
          {
            keyword: 'Priorities',
            example:
              'The level of financial risk people are willing to take depends on their priorities, life stage, and financial situation.',
          },
          {
            keyword: 'Security',
            example:
              'While risk can lead to growth, security provides stability and peace of mind, which are also valuable financial goals.',
          },
        ],
      },
      {
        question:
          'Are smartphones affecting the quality of modern friendships?',
        keywords: [
          {
            keyword: 'Communication',
            example:
              'Smartphones enable constant communication, but digital communication may lack the depth and nuance of face-to-face interaction.',
          },
          {
            keyword: 'Habits',
            example:
              'Smartphone use creates habits of digital communication that may replace or reduce face-to-face social interactions.',
          },
          {
            keyword: 'Expectations',
            example:
              'Smartphones create expectations for immediate responses, which can create pressure and reduce quality of interactions.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Smartphone use during social interactions can reduce engagement and make people feel less valued and heard.',
          },
          {
            keyword: 'Connection',
            example:
              'While smartphones help maintain connections across distances, they may reduce the quality of in-person connections.',
          },
        ],
      },
      {
        question: 'Is it harder to stay focused in the digital age?',
        keywords: [
          'Distraction',
          'Habits',
          'Stimulation',
          'Productivity',
          'Concentration',
        ],
      },
      {
        question:
          'Do people spend too much time comparing themselves to others?',
        keywords: [
          'Perception',
          'Expectations',
          'Identity',
          'Pressure',
          'Behaviour',
        ],
      },
      {
        question:
          'Are traditional jobs becoming less appealing to young adults?',
        keywords: [
          'Opportunity',
          'Expectations',
          'Stability',
          'Ambition',
          'Trends',
        ],
      },
      {
        question:
          'Is it better to have a strict schedule for children or a flexible one?',
        keywords: [
          'Routine',
          'Development',
          'Behaviour',
          'Balance',
          'Expectations',
        ],
      },
      {
        question: 'Are social skills becoming harder to develop online?',
        keywords: [
          'Interaction',
          'Communication',
          'Confidence',
          'Behaviour',
          'Expectations',
        ],
      },
      {
        question: 'Do people rely too much on online advice?',
        keywords: [
          'Guidance',
          'Judgement',
          'Influence',
          'Behaviour',
          'Expectations',
        ],
      },
      {
        question:
          'Is it better to challenge yourself regularly or stay comfortable?',
        keywords: [
          'Growth',
          'Confidence',
          'Motivation',
          'Resilience',
          'Wellbeing',
        ],
      },
      {
        question: 'Does humour help people deal with stress?',
        keywords: [
          'Coping',
          'Perspective',
          'Connection',
          'Wellbeing',
          'Behaviour',
        ],
      },

      {
        question: 'Are young people too influenced by celebrity lifestyles?',
        keywords: [
          'Identity',
          'Comparison',
          'Expectations',
          'Behaviour',
          'Pressure',
        ],
      },
      {
        question: 'Is it better to start your day slowly or with energy?',
        keywords: [
          'Routine',
          'Productivity',
          'Habits',
          'Wellbeing',
          'Preference',
        ],
      },
      {
        question: 'Do people depend too much on ratings and online reviews?',
        keywords: [
          'Trust',
          'Judgement',
          'Influence',
          'Behaviour',
          'Expectations',
        ],
      },
      {
        question: 'Are family traditions becoming less important?',
        keywords: [
          {
            keyword: 'Identity',
            example:
              'Traditional foods are important for cultural identity, connecting people to their heritage and community traditions.',
          },
          {
            keyword: 'Culture',
            example:
              'Food is central to culture, and traditional recipes preserve cultural knowledge and practices across generations.',
          },
          {
            keyword: 'Connection',
            example:
              'Preparing traditional foods creates connection to family history and cultural roots, strengthening sense of belonging.',
          },
          {
            keyword: 'Habits',
            example:
              'Maintaining traditional food habits preserves cultural practices, though modern lifestyles may make this challenging.',
          },
          {
            keyword: 'Values',
            example:
              'Traditional foods reflect cultural values and beliefs, and preserving them maintains important aspects of cultural heritage.',
          },
        ],
      },
      {
        question:
          'Is it better to learn through challenges or through support?',
        keywords: [
          {
            keyword: 'Motivation',
            example:
              'Challenges can motivate learning by creating urgency and engagement, while support provides encouragement to persist.',
          },
          {
            keyword: 'Resilience',
            example:
              'Facing challenges develops resilience and problem-solving skills, while support helps people recover from setbacks.',
          },
          {
            keyword: 'Confidence',
            example:
              'Overcoming challenges builds confidence, but support helps build confidence by providing reassurance and validation.',
          },
          {
            keyword: 'Development',
            example:
              'Learning through challenges promotes development by pushing people beyond their comfort zones, while support provides safety to explore.',
          },
          {
            keyword: 'Learning',
            example:
              'A balanced approach combining challenges with support often leads to deeper learning and more effective skill development.',
          },
        ],
      },
      {
        question:
          'Do smartphones make people more distracted than they realise?',
        keywords: [
          'Awareness',
          'Habits',
          'Behaviour',
          'Attention',
          'Stimulation',
        ],
      },
      {
        question: 'Is it harder to make friends as an adult?',
        keywords: [
          'Connection',
          'Confidence',
          'Opportunity',
          'Communication',
          'Lifestyle',
        ],
      },
      {
        question: 'Are people too focused on gaining followers online?',
        keywords: [
          'Validation',
          'Identity',
          'Influence',
          'Behaviour',
          'Expectations',
        ],
      },
      {
        question:
          'Is it better to plan your free time or keep it unstructured?',
        keywords: [
          'Flexibility',
          'Relaxation',
          'Habits',
          'Balance',
          'Preference',
        ],
      },
      {
        question: 'Do small daily habits shape long-term success?',
        keywords: [
          'Discipline',
          'Routine',
          'Motivation',
          'Progress',
          'Consistency',
        ],
      },

      {
        question: 'Is personal branding becoming unavoidable in modern life?',
        keywords: [
          'Identity',
          'Visibility',
          'Expectations',
          'Reputation',
          'Behaviour',
        ],
      },
      {
        question: 'Are people communicating less face to face?',
        keywords: [
          'Interaction',
          'Habits',
          'Confidence',
          'Connection',
          'Convenience',
        ],
      },
      {
        question: 'Should students challenge ideas that they disagree with?',
        keywords: [
          'Confidence',
          'Respect',
          'Critical thinking',
          'Communication',
          'Independence',
        ],
      },
      {
        question: 'Do people rely too much on comfort to avoid stress?',
        keywords: [
          {
            keyword: 'Resilience',
            example:
              'Facing challenges builds resilience, teaching people to bounce back from setbacks and adapt to difficult situations.',
          },
          {
            keyword: 'Habits',
            example:
              'Developing healthy coping habits helps people manage stress and maintain wellbeing during challenging times.',
          },
          {
            keyword: 'Behaviour',
            example:
              'Challenges can reveal behavior patterns and coping mechanisms, providing opportunities for growth and improvement.',
          },
          {
            keyword: 'Coping',
            example:
              'Learning effective coping strategies is essential for managing challenges and maintaining mental health and wellbeing.',
          },
          {
            keyword: 'Motivation',
            example:
              'While challenges can be motivating, they may also overwhelm, requiring support to maintain motivation and persistence.',
          },
        ],
      },
      {
        question:
          'Is it better to focus on strengths or weaknesses when improving yourself?',
        keywords: [
          {
            keyword: 'Priorities',
            example:
              'The choice between focusing on strengths or weaknesses depends on priorities - maximizing potential versus addressing limitations.',
          },
          {
            keyword: 'Confidence',
            example:
              'Building on strengths increases confidence and motivation, while improving weaknesses can boost confidence by overcoming challenges.',
          },
          {
            keyword: 'Growth',
            example:
              'Focusing on strengths can accelerate growth in areas of natural talent, while addressing weaknesses prevents limitations from holding you back.',
          },
          {
            keyword: 'Development',
            example:
              'Both approaches support development - strengths for competitive advantage, weaknesses for essential skills that limit performance.',
          },
          {
            keyword: 'Strategy',
            example:
              'The best strategy depends on context - strengths for competitive advantage, weaknesses for essential skills that limit performance.',
          },
        ],
      },
      {
        question: 'Are friendships becoming more superficial online?',
        keywords: [
          'Trust',
          'Communication',
          'Expectations',
          'Identity',
          'Behaviour',
        ],
      },
      {
        question: 'Do people spend too much time trying to impress others?',
        keywords: [
          'Validation',
          'Identity',
          'Pressure',
          'Behaviour',
          'Expectations',
        ],
      },
      {
        question: 'Is curiosity more important than intelligence for success?',
        keywords: [
          'Motivation',
          'Learning',
          'Exploration',
          'Potential',
          'Mindset',
        ],
      },
      {
        question: 'Are people too influenced by motivational trends?',
        keywords: [
          'Behaviour',
          'Expectations',
          'Comparison',
          'Identity',
          'Influence',
        ],
      },
      {
        question:
          'Is it better to slow down or speed up when life becomes stressful?',
        keywords: [
          {
            keyword: 'Balance',
            example:
              'Maintaining balance between work, personal life, and self-care is essential for long-term happiness and fulfillment.',
          },
          {
            keyword: 'Coping',
            example:
              'Developing healthy coping strategies helps people manage stress, challenges, and difficult emotions effectively.',
          },
          {
            keyword: 'Habits',
            example:
              'Establishing positive habits supports wellbeing, while breaking negative habits can improve quality of life and mental health.',
          },
          {
            keyword: 'Awareness',
            example:
              'Self-awareness helps individuals recognize their emotions, triggers, and needs, leading to better decision-making and personal growth.',
          },
          {
            keyword: 'Priorities',
            example:
              'Understanding and aligning with personal priorities helps people make choices that support their values and long-term goals.',
          },
        ],
      },
    ],
  },
]

// Extract the debate questions array from the nested structure
const debateQuestions = debates[0].debate_questions

function getRandomIndex(exclude: number[], max: number) {
  let idx
  do {
    idx = Math.floor(Math.random() * max)
  } while (exclude.includes(idx))
  return idx
}

export default function DebateGenerator() {
  const [shown, setShown] = useState<number[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [exampleSentence, setExampleSentence] = useState<string | null>(null)
  const questionRef = useRef<HTMLDivElement>(null)
  const keywordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentIdx(getRandomIndex([], debateQuestions.length))
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNextDebate = () => {
    const isMobile = window.innerWidth < 768

    // On mobile, skip animations and update immediately
    if (isMobile) {
      let newShown = [...shown, currentIdx]
      if (newShown.length === debateQuestions.length) newShown = []
      const nextIdx = getRandomIndex(newShown, debateQuestions.length)
      setCurrentIdx(nextIdx)
      setShown(newShown)
      return
    }

    // Animate out
    if (questionRef.current && keywordsRef.current) {
      gsap.to([questionRef.current, keywordsRef.current], {
        opacity: 0,
        y: 30,
        duration: 0.3,
        onComplete: () => {
          let newShown = [...shown, currentIdx]
          if (newShown.length === debateQuestions.length) newShown = []
          const nextIdx = getRandomIndex(newShown, debateQuestions.length)
          setCurrentIdx(nextIdx)
          setShown(newShown)
          // Animate in
          gsap.fromTo(
            [questionRef.current, keywordsRef.current],
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
          )
        },
      })
    }
  }

  const { question, keywords } = debateQuestions[currentIdx]

  // Handle both old format (string array) and new format (object array with examples)
  const getKeywordData = (
    keywordItem: string | { keyword: string; example: string }
  ) => {
    // If it's a string (old format), return with no example
    if (typeof keywordItem === 'string') {
      return { keyword: keywordItem, example: null }
    }

    // It's an object - extract keyword and example
    const keyword = keywordItem.keyword || ''

    // Check if example exists and is a valid non-empty string
    let example: string | null = null
    if (
      keywordItem.example !== undefined &&
      keywordItem.example !== null &&
      typeof keywordItem.example === 'string' &&
      keywordItem.example.trim().length > 0
    ) {
      example = keywordItem.example.trim()
    }

    return { keyword, example }
  }

  const handleKeywordClick = (keyword: string, example: string | null) => {
    if (selectedKeyword === keyword) {
      // Toggle off if clicking the same keyword
      setSelectedKeyword(null)
      setExampleSentence(null)
    } else {
      // Show example sentence for the clicked keyword - only if example exists in database
      if (example && example.trim().length > 0) {
        setSelectedKeyword(keyword)
        setExampleSentence(example)
      }
      // If no example, do nothing - don't show anything
    }
  }

  // Reset selected keyword when debate changes
  useEffect(() => {
    setSelectedKeyword(null)
    setExampleSentence(null)
  }, [currentIdx])

  return (
    <div className='min-h-screen bg-gray-50 py-20'>
      <div className='container'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <span className='inline-block px-6 py-3 bg-primary/10 text-primary font-bold rounded-full text-sm mb-6'>
            💬 ESL Tool
          </span>
          <h1 className='heading-lg text-gray-900 mb-6'>
            Random Debate{' '}
            <span className='text-gradient-primary'>Generator</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Get inspired with thought-provoking ESL debate topics and key
            vocabulary. Perfect for classroom discussions, speaking practice, or
            just sparking great conversations!
          </p>
        </div>

        {/* Main Generator Card */}
        <div className='max-w-5xl mx-auto'>
          <div className='relative bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-8 md:p-12 min-h-[500px]'>
            <div className='flex flex-col lg:flex-row gap-12'>
              {/* Question Section */}
              <div className='flex-1'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                    <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                      Your Debate Topic
                    </span>
                  </div>

                  <div ref={questionRef} className='space-y-4'>
                    <div className='bg-primary/5 rounded-2xl p-6 border border-primary/10'>
                      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4'>
                        {question}
                      </h2>
                      <div className='h-1 bg-primary rounded-full'></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className='flex-1 lg:border-l border-gray-200 lg:pl-12'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                    <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                      Vocabulary Boost
                    </span>
                  </div>

                  <div className='space-y-4'>
                    <h3 className='text-xl font-bold text-gray-900'>
                      💡 Make It Interesting
                    </h3>
                    <p className='text-sm text-gray-600'>
                      Try to incorporate these vocabulary words when developing
                      your arguments and responses.
                    </p>
                  </div>

                  <div ref={keywordsRef} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-3'>
                      {keywords.map((keywordItem, index) => {
                        const { keyword, example } = getKeywordData(keywordItem)
                        return (
                          <motion.div
                            key={keyword}
                            {...(isMobile
                              ? {
                                  initial: { opacity: 1, scale: 1 },
                                  animate: { opacity: 1, scale: 1 },
                                }
                              : {
                                  initial: { opacity: 0, scale: 0.9 },
                                  animate: { opacity: 1, scale: 1 },
                                  transition: { delay: index * 0.1 },
                                })}
                            className='group'
                          >
                            <div
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleKeywordClick(keyword, example)
                              }}
                              className={`bg-gray-50 hover:bg-primary/10 rounded-xl p-3 border transition-all duration-300 hover:scale-105 cursor-pointer ${
                                selectedKeyword === keyword
                                  ? 'bg-primary/15 border-primary/40 shadow-md scale-105'
                                  : 'border-gray-200 hover:border-primary/20'
                              }`}
                            >
                              <span
                                className={`font-medium text-sm transition-colors ${
                                  selectedKeyword === keyword
                                    ? 'text-primary font-semibold'
                                    : 'text-gray-700 group-hover:text-primary'
                                }`}
                              >
                                {keyword}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Example Sentence Display */}
                    {selectedKeyword && exampleSentence && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className='mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl'
                      >
                        <div className='flex items-start gap-3'>
                          <div className='flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5'>
                            <span className='text-primary text-xs'>💡</span>
                          </div>
                          <div className='flex-1'>
                            <p className='text-xs font-semibold text-primary mb-1 uppercase tracking-wide'>
                              Example for "{selectedKeyword}"
                            </p>
                            <p className='text-sm text-gray-700 leading-relaxed'>
                              {exampleSentence}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='mt-12 flex justify-center'>
              <button
                onClick={handleNextDebate}
                className='btn-primary shadow-glow-lg hover:shadow-glow-lg group flex gap-[15px]'
              >
                <ArrowPathIcon className='w-5 h-5 group-hover:rotate-180 transition-transform duration-500' />
                Generate New Debate
              </button>
            </div>

            {/* Usage Tips */}
            <div className='mt-12 pt-8 border-t border-gray-200'>
              <div className='grid md:grid-cols-3 gap-6 text-center'>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
                    🎯
                  </div>
                  <h4 className='font-semibold text-gray-900'>
                    Classroom Ready
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Perfect for ESL lessons and group discussions
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-accent rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
                    💬
                  </div>
                  <h4 className='font-semibold text-gray-900'>
                    Speaking Practice
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Enhance fluency and persuasive speaking skills
                  </p>
                </div>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
                    🧠
                  </div>
                  <h4 className='font-semibold text-gray-900'>
                    Critical Thinking
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Develop analytical and reasoning abilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// NOTE: Fill in the rest of the debates array with the provided JSON for full functionality.
