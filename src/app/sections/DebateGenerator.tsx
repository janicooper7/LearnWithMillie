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
          'Identity',
          'Discipline',
          'Equality',
          'Tradition',
          'Expression',
        ],
      },
      {
        question: 'Is social media doing more harm than good?',
        keywords: [
          'Wellbeing',
          'Influence',
          'Privacy',
          'Misinformation',
          'Behaviour',
        ],
      },
      {
        question: 'Should the voting age be lowered to 16?',
        keywords: [
          'Responsibility',
          'Engagement',
          'Maturity',
          'Representation',
          'Participation',
        ],
      },
      {
        question: 'Is celebrity culture a bad influence on young people?',
        keywords: [
          'Role models',
          'Pressure',
          'Popularity',
          'Consumerism',
          'Expectations',
        ],
      },
      {
        question:
          'Are violent video games harmful enough to deserve stricter limits?',
        keywords: [
          'Aggression',
          'Exposure',
          'Regulation',
          'Responsibility',
          'Impact',
        ],
      },
      {
        question: 'Is traditional marriage still relevant today?',
        keywords: [
          'Commitment',
          'Values',
          'Independence',
          'Lifestyle',
          'Expectations',
        ],
      },
      {
        question: 'Should children be allowed to use smartphones?',
        keywords: [
          'Attention',
          'Safety',
          'Development',
          'Supervision',
          'Communication',
        ],
      },
      {
        question: 'Is cancel culture a necessary form of accountability?',
        keywords: [
          'Reputation',
          'Criticism',
          'Fairness',
          'Consequences',
          'Public opinion',
        ],
      },
      {
        question: 'Should everyone have to do mandatory community service?',
        keywords: [
          'Contribution',
          'Responsibility',
          'Skills',
          'Engagement',
          'Cooperation',
        ],
      },
      {
        question: 'Is there a point when ambition becomes unhealthy?',
        keywords: ['Pressure', 'Burnout', 'Goals', 'Productivity', 'Balance'],
      },
      {
        question: 'Is AI a threat to human jobs?',
        keywords: [
          'Automation',
          'Skills',
          'Efficiency',
          'Employment',
          'Adaptation',
        ],
      },
      {
        question: 'Would society be better without YouTube?',
        keywords: [
          'Entertainment',
          'Learning',
          'Influence',
          'Accessibility',
          'Distraction',
        ],
      },
      {
        question:
          'Do social media platforms need stronger rules to control harmful content?',
        keywords: [
          'Privacy',
          'Safety',
          'Misinformation',
          'Responsibility',
          'Oversight',
        ],
      },
      {
        question: 'Are self-driving cars a good idea?',
        keywords: [
          'Safety',
          'Innovation',
          'Reliability',
          'Responsibility',
          'Technology',
        ],
      },
      {
        question: 'Should we be worried about deepfake technology?',
        keywords: [
          'Trust',
          'Manipulation',
          'Evidence',
          'Security',
          'Misinformation',
        ],
      },
      {
        question: 'Do dating apps make relationships less meaningful?',
        keywords: [
          'Connection',
          'Expectations',
          'Communication',
          'Trust',
          'Compatibility',
        ],
      },
      {
        question: 'Is personality shaped more by nature or nurture?',
        keywords: [
          'Environment',
          'Behaviour',
          'Development',
          'Genetics',
          'Influence',
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
          'Integrity',
          'Learning',
          'Dependence',
          'Creativity',
          'Supervision',
        ],
      },
      {
        question: 'Are video games more beneficial than harmful?',
        keywords: [
          'Skills',
          'Entertainment',
          'Focus',
          'Social interaction',
          'Wellbeing',
        ],
      },
      {
        question: 'Should students have to learn a second language?',
        keywords: [
          'Communication',
          'Opportunity',
          'Culture',
          'Globalisation',
          'Skills',
        ],
      },
      {
        question: 'Is homework necessary for academic success?',
        keywords: [
          'Practice',
          'Independence',
          'Motivation',
          'Discipline',
          'Performance',
        ],
      },
      {
        question: 'Should university education be free?',
        keywords: [
          'Access',
          'Opportunity',
          'Inequality',
          'Finances',
          'Investment',
        ],
      },
      {
        question: 'Do grades reflect intelligence?',
        keywords: [
          'Ability',
          'Performance',
          'Fairness',
          'Assessment',
          'Pressure',
        ],
      },
      {
        question: 'Is homeschooling better than traditional schooling?',
        keywords: [
          'Flexibility',
          'Independence',
          'Socialisation',
          'Structure',
          'Support',
        ],
      },
      {
        question: 'Should schools focus more on practical life skills?',
        keywords: [
          'Financial literacy',
          'Independence',
          'Decision-making',
          'Confidence',
          'Practical skills',
        ],
      },
      {
        question: 'Should students have more say in what they learn?',
        keywords: [
          'Motivation',
          'Engagement',
          'Independence',
          'Creativity',
          'Responsibility',
        ],
      },
      {
        question: 'Is online learning as effective as in-person learning?',
        keywords: [
          'Interaction',
          'Flexibility',
          'Discipline',
          'Access',
          'Engagement',
        ],
      },
      {
        question: 'Are standardised tests a fair way to measure ability?',
        keywords: [
          'Pressure',
          'Accuracy',
          'Comparison',
          'Preparation',
          'Stress',
        ],
      },
      {
        question: 'Should financial literacy be a required subject in school?',
        keywords: [
          'Budgeting',
          'Planning',
          'Responsibility',
          'Awareness',
          'Decision-making',
        ],
      },
      {
        question: 'Should companies offer a four-day workweek?',
        keywords: [
          'Productivity',
          'Wellbeing',
          'Flexibility',
          'Workload',
          'Motivation',
        ],
      },
      {
        question: 'Is working from home better than working in an office?',
        keywords: [
          'Routine',
          'Communication',
          'Balance',
          'Productivity',
          'Flexibility',
        ],
      },
      {
        question: 'Should unpaid internships be banned?',
        keywords: [
          'Exploitation',
          'Opportunity',
          'Experience',
          'Fairness',
          'Access',
        ],
      },
      {
        question: 'Is job stability more important than job satisfaction?',
        keywords: [
          'Security',
          'Motivation',
          'Expectations',
          'Wellbeing',
          'Long-term goals',
        ],
      },
      {
        question: 'Are emotions or logic more important in decision-making?',
        keywords: [
          'Intuition',
          'Analysis',
          'Judgement',
          'Balance',
          'Priorities',
        ],
      },
      {
        question: 'Is it better to travel alone or with others?',
        keywords: [
          'Freedom',
          'Planning',
          'Safety',
          'Connection',
          'Independence',
        ],
      },
      {
        question: 'Should businesses aim for gender-balanced teams?',
        keywords: [
          'Diversity',
          'Equality',
          'Representation',
          'Fairness',
          'Performance',
        ],
      },
      {
        question: 'Is learning history important in school?',
        keywords: [
          'Identity',
          'Awareness',
          'Perspective',
          'Memory',
          'Understanding',
        ],
      },
      {
        question: 'Should tourists learn basic phrases of the local language?',
        keywords: [
          'Communication',
          'Respect',
          'Culture',
          'Preparation',
          'Safety',
        ],
      },
      {
        question: 'Is it better to work for a company or be self-employed?',
        keywords: [
          'Security',
          'Independence',
          'Risk',
          'Motivation',
          'Flexibility',
        ],
      },
      {
        question: 'Should junk food be heavily taxed?',
        keywords: [
          'Health',
          'Habits',
          'Responsibility',
          'Regulation',
          'Prevention',
        ],
      },
      {
        question: 'Is veganism the future of food?',
        keywords: [
          'Diet',
          'Sustainability',
          'Ethics',
          'Farming',
          'Consumer choices',
        ],
      },
      {
        question: 'Is a complete ban on smoking a practical solution?',
        keywords: [
          'Addiction',
          'Health',
          'Freedom',
          'Regulation',
          'Consequences',
        ],
      },
      {
        question: 'Is mental health more important than physical health?',
        keywords: ['Wellbeing', 'Balance', 'Support', 'Stress', 'Awareness'],
      },
      {
        question:
          'Is it better to work in a job you love or a job that pays well?',
        keywords: [
          'Passion',
          'Security',
          'Fulfilment',
          'Motivation',
          'Priorities',
        ],
      },
      {
        question: 'Is exercise more important than diet for a healthy life?',
        keywords: [
          'Nutrition',
          'Fitness',
          'Metabolism',
          'Wellbeing',
          'Long-term health',
        ],
      },
      {
        question: 'Should euthanasia be legal?',
        keywords: ['Dignity', 'Suffering', 'Rights', 'Consent', 'Ethics'],
      },
      {
        question: 'Are beauty standards harmful to society?',
        keywords: [
          'Confidence',
          'Pressure',
          'Representation',
          'Wellbeing',
          'Expectations',
        ],
      },
      {
        question: 'Is it better to live in a small town or a big city?',
        keywords: [
          'Community',
          'Opportunities',
          'Transport',
          'Cost of living',
          'Diversity',
        ],
      },
      {
        question: 'Is social media addiction a real problem?',
        keywords: [
          'Habits',
          'Wellbeing',
          'Behaviour',
          'Dependence',
          'Motivation',
        ],
      },

      {
        question: 'Is travelling to dangerous countries worth the risk?',
        keywords: [
          'Adventure',
          'Safety',
          'Judgement',
          'Experience',
          'Awareness',
        ],
      },
      {
        question:
          'Does tourism need stricter limits to protect the environment?',
        keywords: [
          'Overcrowding',
          'Preservation',
          'Sustainability',
          'Impact',
          'Responsibility',
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
          'Emissions',
          'Sustainability',
          'Alternatives',
          'Impact',
          'Lifestyle',
        ],
      },
      {
        question: 'Are all-inclusive resorts bad for local communities?',
        keywords: [
          'Tourism',
          'Employment',
          'Culture',
          'Development',
          'Dependence',
        ],
      },
      {
        question:
          'Is it better to invest in experiences rather than material possessions?',
        keywords: [
          'Memories',
          'Value',
          'Satisfaction',
          'Priorities',
          'Lifestyle',
        ],
      },
      {
        question: 'Should students be allowed to grade their teachers?',
        keywords: [
          'Feedback',
          'Fairness',
          'Performance',
          'Motivation',
          'Accountability',
        ],
      },
      {
        question: 'Is honesty always the best policy?',
        keywords: [
          'Trust',
          'Consequences',
          'Relationships',
          'Integrity',
          'Communication',
        ],
      },
      {
        question: 'Can money buy happiness?',
        keywords: [
          'Freedom',
          'Comfort',
          'Security',
          'Satisfaction',
          'Priorities',
        ],
      },
      {
        question: 'Is it ever acceptable to lie?',
        keywords: [
          'Trust',
          'Intention',
          'Consequences',
          'Relationships',
          'Judgement',
        ],
      },
      {
        question: 'Should the death penalty be abolished worldwide?',
        keywords: ['Justice', 'Punishment', 'Rights', 'Evidence', 'Morality'],
      },
      {
        question: 'Should everyone learn basic first aid?',
        keywords: [
          'Safety',
          'Preparation',
          'Responsibility',
          'Emergencies',
          'Awareness',
        ],
      },
      {
        question: 'Should universities have a dress code?',
        keywords: [
          'Professionalism',
          'Expression',
          'Culture',
          'Comfort',
          'Expectations',
        ],
      },
      {
        question: 'Is reading books better than listening to audiobooks?',
        keywords: [
          'Focus',
          'Imagination',
          'Convenience',
          'Comprehension',
          'Habits',
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
        keywords: ['Health', 'Farming', 'Innovation', 'Regulation', 'Trust'],
      },
      {
        question: 'Should we always respect authority?',
        keywords: ['Rules', 'Responsibility', 'Trust', 'Fairness', 'Power'],
      },
      {
        question: 'Is it better to live in a multicultural society?',
        keywords: [
          'Diversity',
          'Tolerance',
          'Identity',
          'Community',
          'Opportunities',
        ],
      },
      {
        question: 'Is music more powerful than books?',
        keywords: [
          'Emotion',
          'Creativity',
          'Memory',
          'Imagination',
          'Expression',
        ],
      },
      {
        question: 'Is free healthcare essential for a fair society?',
        keywords: ['Access', 'Equality', 'Cost', 'Wellbeing', 'Responsibility'],
      },
      {
        question: 'Should athletes and celebrities avoid political issues?',
        keywords: [
          'Influence',
          'Responsibility',
          'Reputation',
          'Awareness',
          'Freedom',
        ],
      },
      {
        question: 'Is binge-watching TV shows unhealthy?',
        keywords: ['Habits', 'Sleep', 'Attention', 'Wellbeing', 'Balance'],
      },
      {
        question:
          'Should influencers be held responsible for promoting unhealthy lifestyles?',
        keywords: [
          'Impact',
          'Behaviour',
          'Transparency',
          'Reputation',
          'Responsibility',
        ],
      },
      {
        question: 'Is reading better than watching movies?',
        keywords: [
          'Creativity',
          'Detail',
          'Imagination',
          'Engagement',
          'Interpretation',
        ],
      },
      {
        question: 'Should comedians be allowed to joke about anything?',
        keywords: [
          'Freedom',
          'Offence',
          'Boundaries',
          'Expression',
          'Sensitivity',
        ],
      },
      {
        question: 'Are awards shows still relevant today?',
        keywords: [
          'Recognition',
          'Popularity',
          'Standards',
          'Influence',
          'Reputation',
        ],
      },
      {
        question: 'Should video games be considered a form of art?',
        keywords: [
          'Creativity',
          'Storytelling',
          'Design',
          'Innovation',
          'Expression',
        ],
      },
      {
        question:
          'Is banning plastic bags the most effective way to reduce waste?',
        keywords: [
          'Pollution',
          'Habits',
          'Alternatives',
          'Sustainability',
          'Convenience',
        ],
      },
      {
        question: 'Is climate change the biggest threat to humanity?',
        keywords: [
          'Disasters',
          'Resources',
          'Impact',
          'Instability',
          'Survival',
        ],
      },
      {
        question:
          'Is it better to have a small circle of friends or a large one?',
        keywords: [
          'Support',
          'Closeness',
          'Trust',
          'Diversity',
          'Communication',
        ],
      },
      {
        question: 'Should cars be banned in city centres?',
        keywords: [
          'Traffic',
          'Pollution',
          'Accessibility',
          'Planning',
          'Safety',
        ],
      },
      {
        question: 'Is nuclear energy a reliable long-term solution?',
        keywords: [
          'Safety',
          'Cost',
          'Reliability',
          'Emissions',
          'Sustainability',
        ],
      },
      {
        question: 'Is bottled water harmful enough to justify a complete ban?',
        keywords: [
          'Waste',
          'Pollution',
          'Access',
          'Convenience',
          'Responsibility',
        ],
      },
      {
        question: 'Are electric cars really better for the environment?',
        keywords: [
          'Emissions',
          'Resources',
          'Efficiency',
          'Sustainability',
          'Cost',
        ],
      },
      {
        question:
          'Is it ever acceptable to limit family size for environmental or social reasons?',
        keywords: [
          'Resources',
          'Freedom',
          'Responsibility',
          'Population',
          'Ethics',
        ],
      },
      {
        question: 'Is it ethical to keep animals in zoos?',
        keywords: [
          'Conservation',
          'Welfare',
          'Education',
          'Captivity',
          'Protection',
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
          'Security',
          'Opportunity',
          'Inequality',
          'Stability',
          'Responsibility',
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
          'Accessibility',
          'Congestion',
          'Sustainability',
          'Planning',
          'Efficiency',
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
          'Flexibility',
          'Autonomy',
          'Motivation',
          'Productivity',
          'Wellbeing',
        ],
      },
      {
        question: 'Is it better to learn from mistakes or avoid them entirely?',
        keywords: ['Experience', 'Risk', 'Growth', 'Resilience', 'Judgement'],
      },
      {
        question: 'Should schools offer more practical science experiments?',
        keywords: [
          'Engagement',
          'Curiosity',
          'Understanding',
          'Safety',
          'Resources',
        ],
      },
      {
        question: 'Do loyalty rewards encourage unnecessary spending?',
        keywords: [
          'Temptation',
          'Behaviour',
          'Value',
          'Marketing',
          'Decisions',
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
          'Confidence',
          'Comparison',
          'Motivation',
          'Perception',
          'Influence',
        ],
      },
      {
        question: 'Should schools require students to participate in sports?',
        keywords: ['Fitness', 'Teamwork', 'Discipline', 'Health', 'Engagement'],
      },
      {
        question: 'Are subscription services becoming too expensive?',
        keywords: ['Cost', 'Value', 'Convenience', 'Habits', 'Expectations'],
      },

      {
        question:
          'Is mental health support receiving enough attention and resources today?',
        keywords: ['Access', 'Support', 'Awareness', 'Wellbeing', 'Prevention'],
      },
      {
        question:
          'Is it better to focus on long-term goals or short-term success?',
        keywords: [
          'Motivation',
          'Priorities',
          'Planning',
          'Achievement',
          'Discipline',
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
        keywords: ['Communication', 'Distance', 'Habits', 'Attention', 'Trust'],
      },
      {
        question: 'Should companies reduce email communication?',
        keywords: [
          'Overload',
          'Efficiency',
          'Clarity',
          'Boundaries',
          'Organisation',
        ],
      },
      {
        question: 'Is it better to cook at home or eat out regularly?',
        keywords: ['Health', 'Cost', 'Habits', 'Convenience', 'Lifestyle'],
      },
      {
        question: 'Should schools teach digital citizenship?',
        keywords: [
          'Safety',
          'Behaviour',
          'Awareness',
          'Responsibility',
          'Communication',
        ],
      },
      {
        question: 'Are travel documentaries a good substitute for real travel?',
        keywords: [
          'Experience',
          'Culture',
          'Access',
          'Curiosity',
          'Authenticity',
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
          'Cooperation',
          'Responsibility',
          'Communication',
          'Performance',
          'Teamwork',
        ],
      },

      {
        question: 'Should employers offer unlimited holiday time?',
        keywords: [
          'Trust',
          'Productivity',
          'Balance',
          'Motivation',
          'Responsibility',
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
          'Budgeting',
          'Independence',
          'Planning',
          'Awareness',
          'Skills',
        ],
      },
      {
        question:
          'Do smartphones make people feel more connected or more isolated?',
        keywords: [
          'Interaction',
          'Perception',
          'Expectations',
          'Behaviour',
          'Wellbeing',
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
          'Motivation',
          'Performance',
          'Satisfaction',
          'Culture',
          'Wellbeing',
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
          'Creativity',
          'Expression',
          'Engagement',
          'Confidence',
          'Imagination',
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
          'Safety',
          'Planning',
          'Resources',
          'Prevention',
          'Resilience',
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
          'Comfort',
          'Professionalism',
          'Expression',
          'Culture',
          'Expectations',
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
          'Concentration',
          'Habits',
          'Balance',
          'Engagement',
          'Supervision',
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
          'Experience',
          'Maturity',
          'Exploration',
          'Independence',
          'Preparation',
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
          'Pollution',
          'Responsibility',
          'Production',
          'Consumption',
          'Ethics',
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
          'Flexibility',
          'Access',
          'Performance',
          'Collaboration',
          'Balance',
        ],
      },

      {
        question:
          'Is it better to invest in experiences or personal belongings?',
        keywords: [
          'Satisfaction',
          'Value',
          'Memory',
          'Lifestyle',
          'Priorities',
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
          'Logic',
          'Creativity',
          'Independence',
          'Strategy',
          'Understanding',
        ],
      },
      {
        question: 'Are cities doing enough to support cyclists?',
        keywords: [
          'Infrastructure',
          'Safety',
          'Planning',
          'Mobility',
          'Commitment',
        ],
      },
      {
        question: 'Should students be allowed to use AI tools for learning?',
        keywords: [
          'Support',
          'Creativity',
          'Supervision',
          'Dependence',
          'Ethics',
        ],
      },
      {
        question: 'Is it better to live close to your workplace?',
        keywords: ['Commuting', 'Convenience', 'Cost', 'Stress', 'Lifestyle'],
      },
      {
        question: 'Should companies allow pets in the office?',
        keywords: [
          'Comfort',
          'Distraction',
          'Wellbeing',
          'Atmosphere',
          'Responsibility',
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
        keywords: ['Memory', 'Habits', 'Dependence', 'Learning', 'Attention'],
      },

      {
        question:
          'Are financial incentives a good way to encourage eco-friendly habits?',
        keywords: [
          'Incentives',
          'Sustainability',
          'Responsibility',
          'Impact',
          'Participation',
        ],
      },
      {
        question: 'Is it better to communicate by text or by voice?',
        keywords: [
          'Clarity',
          'Convenience',
          'Tone',
          'Misunderstanding',
          'Connection',
        ],
      },
      {
        question: 'Should schools increase outdoor learning time?',
        keywords: [
          'Activity',
          'Wellbeing',
          'Engagement',
          'Exploration',
          'Development',
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
        keywords: ['Stress', 'Awareness', 'Information', 'Balance', 'Habits'],
      },
      {
        question: 'Should schools limit competitive activities?',
        keywords: [
          'Pressure',
          'Confidence',
          'Equality',
          'Motivation',
          'Behaviour',
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
        keywords: ['Distraction', 'Habits', 'Efficiency', 'Behaviour', 'Focus'],
      },
      {
        question: 'Is congestion pricing a fair way to manage heavy traffic?',
        keywords: ['Traffic', 'Mobility', 'Fairness', 'Planning', 'Regulation'],
      },
      {
        question:
          'Is it better to read fiction or non-fiction for personal growth?',
        keywords: [
          'Knowledge',
          'Imagination',
          'Understanding',
          'Perspective',
          'Curiosity',
        ],
      },
      {
        question: 'Should workplaces offer mental health days?',
        keywords: ['Balance', 'Wellbeing', 'Support', 'Stress', 'Motivation'],
      },
      {
        question: 'Do theme parks encourage unhealthy habits?',
        keywords: [
          'Spending',
          'Excitement',
          'Marketing',
          'Behaviour',
          'Expectations',
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
        keywords: ['Focus', 'Energy', 'Comfort', 'Productivity', 'Atmosphere'],
      },
      {
        question: 'Should students be allowed more flexible deadlines?',
        keywords: [
          'Motivation',
          'Fairness',
          'Responsibility',
          'Balance',
          'Performance',
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
        keywords: ['Image', 'Reputation', 'Pressure', 'Visibility', 'Identity'],
      },
      {
        question:
          'Would more pedestrian-only streets make cities safer and more enjoyable?',
        keywords: [
          'Safety',
          'Mobility',
          'Planning',
          'Experience',
          'Environment',
        ],
      },
      {
        question: 'Does technology make it harder to relax?',
        keywords: ['Stress', 'Habits', 'Stimulation', 'Balance', 'Wellbeing'],
      },
      {
        question: 'Should companies reduce unnecessary meetings?',
        keywords: [
          'Efficiency',
          'Communication',
          'Planning',
          'Productivity',
          'Priorities',
        ],
      },
      {
        question: 'Is it better to save money regularly or invest it?',
        keywords: ['Security', 'Growth', 'Risk', 'Planning', 'Priorities'],
      },

      {
        question: 'Should companies hire more older workers?',
        keywords: [
          'Experience',
          'Productivity',
          'Diversity',
          'Adaptability',
          'Opportunity',
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
        keywords: ['Convenience', 'Habits', 'Cost', 'Health', 'Lifestyle'],
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
        keywords: ['Marketing', 'Rewards', 'Behaviour', 'Value', 'Temptation'],
      },

      {
        question: 'Should children learn basic first-aid skills?',
        keywords: [
          'Safety',
          'Confidence',
          'Emergencies',
          'Responsibility',
          'Preparation',
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
        keywords: ['Entertainment', 'Access', 'Value', 'Cost', 'Expectations'],
      },
      {
        question: 'Should renewable energy receive much higher investment?',
        keywords: [
          'Sustainability',
          'Innovation',
          'Emissions',
          'Planning',
          'Long-term impact',
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
        keywords: ['Content', 'Access', 'Cost', 'Protection', 'Responsibility'],
      },
      {
        question: 'Are modern diets too restrictive?',
        keywords: ['Health', 'Habits', 'Balance', 'Pressure', 'Nutrition'],
      },
      {
        question: 'Should schools teach conflict resolution?',
        keywords: [
          'Communication',
          'Cooperation',
          'Respect',
          'Behaviour',
          'Problem-solving',
        ],
      },
      {
        question:
          'Is it better to have a long commute or live in a smaller home?',
        keywords: ['Space', 'Convenience', 'Cost', 'Lifestyle', 'Priorities'],
      },
      {
        question: 'Should companies reward employees for healthy habits?',
        keywords: [
          'Motivation',
          'Wellbeing',
          'Participation',
          'Incentives',
          'Responsibility',
        ],
      },
      {
        question: 'Do holidays improve productivity at work?',
        keywords: ['Rest', 'Motivation', 'Performance', 'Balance', 'Energy'],
      },

      {
        question: 'Should people reduce the amount of clothing they buy?',
        keywords: [
          'Consumption',
          'Sustainability',
          'Habits',
          'Value',
          'Responsibility',
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
        keywords: ['Nutrition', 'Energy', 'Access', 'Wellbeing', 'Performance'],
      },
      {
        question: 'Is it better to work fewer hours with lower pay?',
        keywords: [
          'Balance',
          'Priorities',
          'Wellbeing',
          'Security',
          'Motivation',
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
        keywords: ['Rest', 'Productivity', 'Planning', 'Balance', 'Wellbeing'],
      },
      {
        question: 'Should companies invest more in employee wellbeing?',
        keywords: [
          'Motivation',
          'Health',
          'Performance',
          'Support',
          'Satisfaction',
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
        keywords: ['Confidence', 'Risk', 'Analysis', 'Pressure', 'Judgement'],
      },
      {
        question: 'Should advertisements for gambling be banned?',
        keywords: [
          'Protection',
          'Addiction',
          'Responsibility',
          'Influence',
          'Regulation',
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
        keywords: ['Sleep', 'Health', 'Habits', 'Exposure', 'Concentration'],
      },
      {
        question: 'Should companies shorten meetings to fifteen minutes?',
        keywords: [
          'Efficiency',
          'Focus',
          'Planning',
          'Productivity',
          'Priorities',
        ],
      },
      {
        question: 'Is it better to buy second-hand products?',
        keywords: ['Cost', 'Sustainability', 'Quality', 'Habits', 'Value'],
      },
      {
        question:
          'Do small businesses receive enough support to stay competitive?',
        keywords: [
          'Development',
          'Competition',
          'Stability',
          'Innovation',
          'Community',
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
        keywords: ['Focus', 'Range', 'Expertise', 'Curiosity', 'Development'],
      },
      {
        question: 'Should parents control how much TV their children watch?',
        keywords: ['Habits', 'Supervision', 'Behaviour', 'Wellbeing', 'Limits'],
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
        keywords: ['Experience', 'Cost', 'Depth', 'Planning', 'Lifestyle'],
      },
      {
        question: 'Should schools give less homework to young children?',
        keywords: [
          'Development',
          'Balance',
          'Pressure',
          'Concentration',
          'Wellbeing',
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
        keywords: ['Convenience', 'Experience', 'Cost', 'Choice', 'Habits'],
      },
      {
        question: 'Should schools teach basic home maintenance skills?',
        keywords: [
          'Independence',
          'Practicality',
          'Responsibility',
          'Confidence',
          'Preparation',
        ],
      },
      {
        question: 'Do smartphones make it harder to relax?',
        keywords: ['Stress', 'Habits', 'Attention', 'Boundaries', 'Wellbeing'],
      },
      {
        question: 'Are holiday prices becoming too high for most families?',
        keywords: [
          'Affordability',
          'Demand',
          'Fairness',
          'Tourism',
          'Stability',
        ],
      },

      {
        question:
          'Is it better to have a predictable routine or a flexible one?',
        keywords: ['Structure', 'Habits', 'Comfort', 'Balance', 'Productivity'],
      },
      {
        question: 'Should companies limit after-hours communication?',
        keywords: [
          'Boundaries',
          'Stress',
          'Professionalism',
          'Wellbeing',
          'Expectations',
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
        keywords: ['Health', 'Sustainability', 'Habits', 'Nutrition', 'Impact'],
      },
      {
        question:
          'Is affordable childcare essential for helping more parents stay in work?',
        keywords: ['Access', 'Equality', 'Support', 'Employment', 'Stability'],
      },
      {
        question: 'Is it better to be optimistic or realistic?',
        keywords: [
          'Perspective',
          'Expectations',
          'Resilience',
          'Motivation',
          'Decision-making',
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
        keywords: ['Energy', 'Efficiency', 'Stress', 'Performance', 'Balance'],
      },
      {
        question:
          'Should supermarkets stop offering discounts on unhealthy foods?',
        keywords: [
          'Marketing',
          'Habits',
          'Health',
          'Influence',
          'Responsibility',
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
        keywords: ['Attention', 'Habits', 'Behaviour', 'Routine', 'Wellbeing'],
      },
      {
        question: 'Is it better to live with a friend or alone?',
        keywords: [
          'Privacy',
          'Compatibility',
          'Communication',
          'Independence',
          'Lifestyle',
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
        keywords: ['Energy', 'Routine', 'Productivity', 'Lifestyle', 'Habits'],
      },
      {
        question: 'Does modern life make it harder to find real rest?',
        keywords: ['Stress', 'Stimulation', 'Routine', 'Wellbeing', 'Balance'],
      },
      {
        question:
          'Is it better to follow your passion or choose a practical path?',
        keywords: [
          'Fulfilment',
          'Security',
          'Ambition',
          'Opportunity',
          'Priorities',
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
        keywords: ['Convenience', 'Cost', 'Health', 'Habits', 'Lifestyle'],
      },
      {
        question:
          'Should children be encouraged to solve problems independently?',
        keywords: [
          'Confidence',
          'Resilience',
          'Critical thinking',
          'Support',
          'Judgement',
        ],
      },
      {
        question: 'Do people overshare personal information online?',
        keywords: ['Privacy', 'Boundaries', 'Judgement', 'Identity', 'Safety'],
      },
      {
        question: 'Is it better to listen to music while studying or not?',
        keywords: [
          'Concentration',
          'Preference',
          'Productivity',
          'Comfort',
          'Focus',
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
        keywords: ['Health', 'Habits', 'Risk', 'Behaviour', 'Awareness'],
      },
      {
        question:
          'Is it better to buy one high-quality item or several cheaper ones?',
        keywords: [
          'Value',
          'Durability',
          'Sustainability',
          'Habits',
          'Preference',
        ],
      },
      {
        question: 'Do smartphones reduce our ability to think deeply?',
        keywords: ['Focus', 'Reflection', 'Habits', 'Awareness', 'Attention'],
      },
      {
        question: 'Are modern workplaces becoming too informal?',
        keywords: [
          'Professionalism',
          'Culture',
          'Behaviour',
          'Expectations',
          'Communication',
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
        keywords: ['Commuting', 'Lifestyle', 'Stress', 'Cost', 'Priorities'],
      },

      {
        question: 'Are young people losing interest in traditional hobbies?',
        keywords: ['Trends', 'Creativity', 'Culture', 'Habits', 'Engagement'],
      },
      {
        question: 'Do smartphone notifications harm concentration?',
        keywords: [
          'Distraction',
          'Habits',
          'Routine',
          'Attention',
          'Behaviour',
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
          'Simplicity',
          'Satisfaction',
          'Clarity',
          'Habits',
          'Balance',
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
        keywords: ['Risk', 'Growth', 'Planning', 'Priorities', 'Security'],
      },
      {
        question:
          'Are smartphones affecting the quality of modern friendships?',
        keywords: [
          'Communication',
          'Habits',
          'Expectations',
          'Behaviour',
          'Connection',
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
        keywords: ['Identity', 'Culture', 'Connection', 'Habits', 'Values'],
      },
      {
        question:
          'Is it better to learn through challenges or through support?',
        keywords: [
          'Motivation',
          'Resilience',
          'Confidence',
          'Development',
          'Learning',
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
        keywords: ['Resilience', 'Habits', 'Behaviour', 'Coping', 'Motivation'],
      },
      {
        question:
          'Is it better to focus on strengths or weaknesses when improving yourself?',
        keywords: [
          'Priorities',
          'Confidence',
          'Growth',
          'Development',
          'Strategy',
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
        keywords: ['Balance', 'Coping', 'Habits', 'Awareness', 'Priorities'],
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 py-20'>
      <div className='container'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <span className='inline-block px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-bold rounded-full text-sm mb-6'>
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
                    <div className='w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full'></div>
                    <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                      Your Debate Topic
                    </span>
                  </div>

                  <div ref={questionRef} className='space-y-4'>
                    <div className='bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10'>
                      <h2 className='text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4'>
                        {question}
                      </h2>
                      <div className='h-1 bg-gradient-to-r from-primary to-accent rounded-full'></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className='flex-1 lg:border-l border-gray-200 lg:pl-12'>
                <div className='space-y-6'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full'></div>
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
                      {keywords.map((keyword, index) => (
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
                          <div className='bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary/10 hover:to-accent/10 rounded-xl p-3 border border-gray-200 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-105'>
                            <span className='text-gray-700 font-medium text-sm group-hover:text-primary transition-colors'>
                              {keyword}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='mt-12 flex justify-center'>
              <button
                onClick={handleNextDebate}
                className='btn-primary shadow-glow-lg hover:shadow-glow-lg group'
              >
                <ArrowPathIcon className='w-5 h-5 group-hover:rotate-180 transition-transform duration-500' />
                Generate New Debate
              </button>
            </div>

            {/* Usage Tips */}
            <div className='mt-12 pt-8 border-t border-gray-200'>
              <div className='grid md:grid-cols-3 gap-6 text-center'>
                <div className='space-y-2'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
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
                  <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
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
                  <div className='w-12 h-12 bg-gradient-to-br from-custom-pink to-rose-600 rounded-xl mx-auto flex items-center justify-center text-white text-xl font-bold'>
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
