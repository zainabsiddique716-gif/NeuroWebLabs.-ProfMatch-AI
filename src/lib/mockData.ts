import { Professor, Scholarship } from './types';

export const SAMPLE_PROFESSORS: Professor[] = [
  {
    id: "prof-1",
    name: "Dr. Sergey Levine",
    title: "Associate Professor of Electrical Engineering & Computer Sciences",
    university: "UC Berkeley",
    universityRank: 4,
    department: "EECS / Berkeley AI Research (BAIR)",
    country: "United States",
    email: "svlevine@eecs.berkeley.edu",
    emailVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    profileUrl: "https://people.eecs.berkeley.edu/~svlevine/",
    googleScholarUrl: "https://scholar.google.com/citations?user=svlevine",
    researchSummary: "Deep reinforcement learning, decision-making agents, offline RL, autonomous robotic manipulation, and generalization in machine learning systems.",
    researchAreas: ["Reinforcement Learning", "Robotics", "Deep Learning", "Offline RL"],
    fundingStatus: "High Sponsorship",
    acceptingStudents: true,
    recentPublications: [
      {
        title: "Offline Reinforcement Learning: How to Train RL Algorithms on Static Datasets",
        year: 2023,
        citations: 1420,
        journalOrVenue: "NeurIPS / arXiv",
        url: "https://arxiv.org/abs/2005.01643",
        abstractSnippet: "Offline reinforcement learning promises to extract policy optimizations directly from existing datasets without interactive environment sampling."
      }
    ],
    alignmentScore: 96,
    alignmentJustification: "Dr. Levine's seminal work in offline RL directly aligns with your statement of interest in scalable autonomous decision-making models. His lab actively admits PhD students with strong math and PyTorch background.",
    matchingKeywords: ["Offline RL", "Robotic Manipulation", "Policy Optimization", "Generalization"]
  },
  {
    id: "prof-2",
    name: "Dr. Chelsea Finn",
    title: "Assistant Professor of Computer Science and Electrical Engineering",
    university: "Stanford University",
    universityRank: 2,
    department: "Computer Science (SAIL)",
    country: "United States",
    email: "cbfinn@cs.stanford.edu",
    emailVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    profileUrl: "https://ai.stanford.edu/~cbfinn/",
    googleScholarUrl: "https://scholar.google.com/citations?user=cbfinn",
    researchSummary: "Meta-learning, few-shot learning, robot learning from human demonstration, and self-supervised visual representations for physical control.",
    researchAreas: ["Meta-Learning", "Few-Shot Learning", "Robot Learning", "Visual Representation"],
    fundingStatus: "Active Grants",
    acceptingStudents: true,
    recentPublications: [
      {
        title: "Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks",
        year: 2022,
        citations: 8900,
        journalOrVenue: "ICML",
        url: "https://arxiv.org/abs/1703.03400",
        abstractSnippet: "Proposing MAML algorithm that trains model parameters such that a small number of gradient steps produces good performance on new tasks."
      }
    ],
    alignmentScore: 93,
    alignmentJustification: "Her focus on sample-efficient robot learning and meta-learning matches your stated goal of building adaptable AI agents that transfer across physical environments.",
    matchingKeywords: ["Meta-Learning", "Few-Shot Adaptation", "Teleoperation", "Robot Vision"]
  },
  {
    id: "prof-3",
    name: "Prof. Bernhard Schölkopf",
    title: "Director of Empirical Inference Department",
    university: "Max Planck Institute / ETH Zürich",
    universityRank: 9,
    department: "Computer Science & Machine Learning",
    country: "Germany",
    email: "bs@tuebingen.mpg.de",
    emailVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    profileUrl: "https://bs.is.tuebingen.mpg.de/",
    googleScholarUrl: "https://scholar.google.com/citations?user=bscholkopf",
    researchSummary: "Causal inference, representation learning, kernel methods, statistical learning theory, and machine learning for scientific discovery.",
    researchAreas: ["Causal Inference", "Statistical Learning", "Representation Learning", "AI for Science"],
    fundingStatus: "Active Grants",
    acceptingStudents: true,
    recentPublications: [
      {
        title: "Towards Causal Representation Learning",
        year: 2023,
        citations: 1850,
        journalOrVenue: "IEEE Proceedings",
        url: "https://arxiv.org/abs/2102.11107"
      }
    ],
    alignmentScore: 91,
    alignmentJustification: "Prof. Schölkopf is a global authority in Causal ML. If your research aims to move beyond correlation to causal reasoning in AI, his lab in Germany offers world-class fully-funded PhD positions.",
    matchingKeywords: ["Causal Inference", "Structural Causal Models", "Representation Learning"]
  },
  {
    id: "prof-4",
    name: "Dr. Raia Hadsell",
    title: "VP of Research & Professor of AI",
    university: "University College London (UCL) / DeepMind",
    universityRank: 8,
    department: "Computer Science",
    country: "United Kingdom",
    email: "r.hadsell@ucl.ac.uk",
    emailVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    profileUrl: "https://www.ucl.ac.uk/cs/people/raia-hadsell",
    googleScholarUrl: "https://scholar.google.com",
    researchSummary: "Continual learning, neural network plasticity, spatial navigation, modular RL architectures, and lifelong learning in synthetic agents.",
    researchAreas: ["Continual Learning", "Spatial Navigation", "Reinforcement Learning"],
    fundingStatus: "High Sponsorship",
    acceptingStudents: true,
    recentPublications: [
      {
        title: "Progressive Neural Networks for Transfer Learning in RL",
        year: 2023,
        citations: 2100,
        journalOrVenue: "Nature DeepMind",
        url: "https://arxiv.org/abs/1606.04671"
      }
    ],
    alignmentScore: 88,
    alignmentJustification: "Strong match for research in lifelong learning and continual reinforcement learning without catastrophic forgetting.",
    matchingKeywords: ["Continual Learning", "Transfer Learning", "Catastrophic Forgetting"]
  }
];

export const SAMPLE_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch-1",
    title: "DAAD Doctoral Fellowships in Germany",
    organization: "German Academic Exchange Service (DAAD)",
    country: "Germany",
    coverage: "Full Tuition + €1,300/mo Allowance + Travel Grant + Health Insurance",
    degreeLevel: ["PhD", "Postdoc"],
    eligibleDomains: ["All STEM Fields", "Artificial Intelligence", "Engineering", "Renewable Energy", "Medicine"],
    deadline: "2026-11-15",
    applicationUrl: "https://www.daad.de/en/",
    matchScore: 97,
    description: "Supports international doctoral candidates pursuing research at top German universities and Max Planck Institutes."
  },
  {
    id: "sch-2",
    title: "Fulbright Foreign Student Program",
    organization: "US Department of State / IIE",
    country: "United States",
    coverage: "Full Tuition + Monthly Living Stipend + Health Benefits + Airfare",
    degreeLevel: ["Master / MS", "PhD"],
    eligibleDomains: ["All STEM Fields", "Computer Science", "Biotechnology", "Robotics", "Economics"],
    deadline: "2026-10-31",
    applicationUrl: "https://foreign.fulbrightonline.org/",
    matchScore: 95,
    description: "Prestigious global scholarship funding Master's and PhD studies at premier American research institutions."
  },
  {
    id: "sch-3",
    title: "MEXT Japanese Government Research Scholarship",
    organization: "Ministry of Education, Culture, Sports, Science (MEXT)",
    country: "Japan",
    coverage: "Full Tuition Waiver + ¥143,000/mo Stipend + Roundtrip Flight",
    degreeLevel: ["Master / MS", "PhD"],
    eligibleDomains: ["All Fields", "Engineering", "Robotics", "Biotechnology", "Materials"],
    deadline: "2026-11-20",
    applicationUrl: "https://www.mext.go.jp/en/",
    matchScore: 96,
    description: "Fully funded research scholarship for international graduate students at top Japanese national universities (University of Tokyo, Kyoto Univ, TIT)."
  },
  {
    id: "sch-4",
    title: "Eiffel Excellence Scholarship France",
    organization: "Campus France & French Ministry for Europe",
    country: "France",
    coverage: "€1,700/mo Stipend + International Transport + Cultural Activities",
    degreeLevel: ["Master / MS", "PhD"],
    eligibleDomains: ["Engineering", "Science", "Economics", "Law", "Computer Science"],
    deadline: "2026-12-10",
    applicationUrl: "https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence",
    matchScore: 94,
    description: "Flagship scholarship program developed by the French Ministry for Foreign Affairs to attract top international master & doctoral candidates."
  },
  {
    id: "sch-5",
    title: "SINGA - Singapore International Graduate Award",
    organization: "A*STAR, NUS, NTU & SUTD",
    country: "Singapore",
    coverage: "Full PhD Tuition Waiver + S$2,700/mo Stipend + Airfare + Settlement Grant",
    degreeLevel: ["PhD"],
    eligibleDomains: ["Biomedical Sciences", "Computing", "Physical Sciences", "Engineering"],
    deadline: "2026-12-01",
    applicationUrl: "https://www.a-star.edu.sg/singa-award",
    matchScore: 98,
    description: "Fully funded PhD scholarship for international students conducting research at A*STAR labs, NUS, or NTU in Singapore."
  },
  {
    id: "sch-6",
    title: "ETH Zurich Excellence Scholarship (ESOP)",
    organization: "ETH Zurich",
    country: "Switzerland",
    coverage: "Full Tuition Waiver + CHF 12,000/semester Living Allowance",
    degreeLevel: ["Master / MS"],
    eligibleDomains: ["Computer Science", "Robotics", "Quantum Engineering", "Data Science", "Life Sciences"],
    deadline: "2026-12-15",
    applicationUrl: "https://ethz.ch/students/en/studies/financial/scholarships/msc-programmes.html",
    matchScore: 94,
    description: "Supports outstanding international students pursuing Master's degrees at ETH Zurich with direct lab mentorship."
  },
  {
    id: "sch-7",
    title: "KAUST Fellowship Saudi Arabia",
    organization: "King Abdullah University of Science and Technology",
    country: "Saudi Arabia",
    coverage: "Full Tuition + $25,000-$30,000 Annual Living Allowance + Housing + Health & Dental",
    degreeLevel: ["Master / MS", "PhD"],
    eligibleDomains: ["Computer Science", "Bioscience", "Energy", "Materials", "Applied Mathematics"],
    deadline: "2026-11-30",
    applicationUrl: "https://www.kaust.edu.sa/en/study/fellowship",
    matchScore: 93,
    description: "All admitted MS and PhD students at KAUST receive full fellowship support including generous living stipend and campus housing."
  },
  {
    id: "sch-8",
    title: "Australia Awards Scholarships",
    organization: "Australian Department of Foreign Affairs and Trade (DFAT)",
    country: "Australia",
    coverage: "Full Tuition Fees + Return Air Travel + Contribution to Living Expenses (CLE)",
    degreeLevel: ["Master / MS", "PhD"],
    eligibleDomains: ["All STEM Fields", "Agriculture", "Public Health", "Engineering", "Environment"],
    deadline: "2026-12-15",
    applicationUrl: "https://www.dfat.gov.au/people-to-people/australia-awards",
    matchScore: 92,
    description: "Long-term awards administered by DFAT for students from developing countries to study at top Australian universities."
  }
];
