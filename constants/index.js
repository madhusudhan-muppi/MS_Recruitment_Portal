// Current Date
export const curYear = new Date().getFullYear();
export const curDate = new Date().getDate();
export const curMonth = new Date().getMonth();
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Organization-wide constants
export const ORG_NAME = "GDG VIT Chennai";
export const ORG_LONG_NAME = "GDG on Campus VIT Chennai";
export const MAX_APPLICATIONS = 2;

// Shown in the footer — GDG on Campus chapters are required to carry this.
export const ORG_DISCLAIMER =
  "Google Developer Groups on Campus is an independent, student-led community backed by Google Developers. Student organizers operate voluntarily, and chapter activities are not formally operated by Google LLC.";

// Contact / social links. `icon` maps to a key in components/ContactLinks.jsx.
export const CONTACT_LINKS = [
  {
    name: "Email",
    label: "gdgvitc@gmail.com",
    href: "mailto:gdgvitc@gmail.com",
    icon: "email",
  },
  {
    name: "Instagram",
    label: "@gdg.vitc",
    href: "https://www.instagram.com/gdg.vitc/",
    icon: "instagram",
  },
  {
    name: "LinkedIn",
    label: "GDG VIT Chennai",
    href: "https://www.linkedin.com/company/gdg-vitc/",
    icon: "linkedin",
  },
  {
    name: "Discord",
    label: "Join the server",
    href: "https://discord.gg/67G6bg4Xeq",
    icon: "discord",
  },
  {
    name: "X",
    label: "@gdg_vitc",
    href: "https://x.com/gdg_vitc",
    icon: "x",
  },
];

// Department Details
export const reviews = [
  {
    id: "c21ca066-ab4d-40a3-943c-f170d6312bdc",
    iconKey: "management",
    tone: "#8ab4f8",
    name: "Management",
    tagline: "Turning vision into action.",
    description:
      "The backbone of the organization, turning vision into reality by planning, executing, and improvising. Oversees events, operations, and growth, ensuring smooth functioning, success, and impactful experiences.",
  },
  {
    id: "4499a966-2740-4c36-88dd-8916a909fc77",
    iconKey: "marketing",
    tone: "#FF7A6B",
    name: "Marketing",
    tagline: "Telling our story to the world.",
    description:
      "Drives online presence with creative campaigns, video editing, and storytelling, boosting engagement, promoting events, and showcasing the club to inspire participation and community growth.",
  },
  {
    id: "3936d5a2-acd9-4a98-ac97-42c2c92f5c02",
    iconKey: "outreach",
    tone: "#FFD45E",
    name: "Outreach",
    tagline: "Building bridges beyond campus.",
    description:
      "Builds partnerships and expands outreach by connecting with communities, sponsors, and collaborators, ensuring diverse opportunities and impactful collaborations both within and beyond campus.",
  },
  {
    id: "e2ed9c2c-c36c-457f-a8bb-cf2e8bc7c2e1",
    iconKey: "ui-ux",
    tone: "#FF7A6B",
    name: "UI/UX Design",
    tagline: "Crafting intuitive experiences.",
    description:
      "Designs visually appealing, user-friendly digital interfaces with a focus on accessibility, usability, and aesthetics, ensuring products provide enjoyable, intuitive, and meaningful user experiences.",
  },
  {
    id: "d3beefc1-f8b0-4202-b26c-36e9804b6636",
    iconKey: "design",
    tone: "#FFD45E",
    name: "Graphic Design",
    tagline: "Visual identity, brought to life.",
    description:
      "Creates stunning visuals, event posters, and branding materials that capture the organization's identity, ensuring every design communicates creativity, professionalism, and excitement to engage the community.",
  },
  {
    id: "8143de1d-db17-42fa-958d-13b10804f894",
    iconKey: "web-dev",
    tone: "#8AB4F8",
    name: "Web Development",
    tagline: "Building the web, one page at a time.",
    description:
      "Designs, develops, and maintains responsive, high-performance websites for projects and events, using modern web technologies to enhance accessibility, user experience, and community engagement online.",
  },
  {
    id: "339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
    iconKey: "app-dev",
    tone: "#6EE7A0",
    name: "App Development",
    tagline: "Mobile experiences that matter.",
    description:
      "Builds intuitive, impactful mobile applications, improving accessibility, interaction, and convenience for members and event participants through functional, user-focused design.",
  },
  {
    id: "9055864f-c7dc-44cd-91d5-8759d32a496a",
    iconKey: "game-dev",
    tone: "#FF7A6B",
    name: "Game Development",
    tagline: "Where creativity meets code.",
    description:
      "Combines creativity and technical skills to design engaging, entertaining games, giving members hands-on experience with real-world game development tools, engines, and production workflows.",
  },
  {
    id: "c0f3b1d1-ce05-45f6-9e34-ac9443fc5fcb",
    iconKey: "data-science",
    tone: "#8AB4F8",
    name: "Data Science",
    tagline: "Turning data into decisions.",
    description:
      "Applies AI, machine learning, and analytics to transform data into actionable insights, helping solve problems, build predictive models, and inspire innovation across projects.",
  },
  {
    id: "a1d920df-9eb9-49eb-b3a4-e4a3d1245ede",
    iconKey: "blockchain",
    tone: "#FFD45E",
    name: "Blockchain & Web3",
    tagline: "Decentralizing the future.",
    description:
      "Explores decentralized apps, smart contracts, and Web3 development, giving members hands-on experience with blockchain protocols and tools.",
  },
  {
    id: "6a89c4e2-7b19-4f32-821e-9821a41b5201",
    iconKey: "open-source",
    tone: "#FF7A6B",
    name: "Open Source",
    tagline: "Code that gives back.",
    description:
      "Encourages members to contribute to open-source projects, building collaboration skills, real-world coding experience, and a culture of transparency, learning, and global tech impact.",
  },
  {
    id: "3e9ac635-01d4-495e-aa87-a7335a2403c2",
    iconKey: "cp",
    tone: "#6EE7A0",
    name: "Competitive Programming",
    tagline: "Solve. Compete. Repeat.",
    description:
      "Promotes problem-solving skills through coding contests, hackathons, and peer learning, helping members sharpen algorithms, logic, and efficiency while preparing for real-world tech challenges.",
  },
];

// Departments featured on the /development page
export const DEVELOPMENT_DEPARTMENT_NAMES = ["App Development", "Web Development"];

// Shared questions asked for every department, in addition to its own two
export const GENERAL_QUESTION = [
  {
    name: "Share a portfolio, GitHub, or work sample link (if any).",
    type: "generic",
    placeholder: "Link, or 'N/A'",
  },
  {
    name: "What is your weekly availability for meetings and events?",
    type: "generic",
    placeholder: "e.g. 3-5 hours per week, mostly evenings",
  },
];

// Questionnaire Data
export const QuestionnaireData = [
  {
    department: "Management",
    questions: [
      {
        name: "What leadership or event-organizing experience do you have?",
        type: "long-text",
        placeholder: "Clubs, fests, teams, or any experience leading people",
      },
      {
        name: "How would you handle a last-minute change during an ongoing event?",
        type: "long-text",
        placeholder: "Walk us through how you'd think and act in the moment",
      },
    ],
  },
  {
    department: "Marketing",
    questions: [
      {
        name: "Have you managed or grown a social media account before? Share details.",
        type: "generic",
        placeholder: "Platform, audience size, what you did",
      },
      {
        name: "Pitch a creative campaign idea for one of our upcoming events.",
        type: "long-text",
        placeholder: "A short pitch — concept, platform, hook",
      },
    ],
  },
  {
    department: "Outreach",
    questions: [
      {
        name: "Do you have experience reaching out to sponsors, communities, or partners?",
        type: "generic",
        placeholder: "What kind of outreach, and the outcome",
      },
      {
        name: "How would you approach building a new partnership from scratch?",
        type: "long-text",
        placeholder: "Your step-by-step approach",
      },
    ],
  },
  {
    department: "UI/UX Design",
    questions: [
      {
        name: "Share a link to your design portfolio or relevant work (Figma, Behance, etc.).",
        type: "generic",
        placeholder: "Link, or 'N/A'",
      },
      {
        name: "Walk us through your design process for a recent project.",
        type: "long-text",
        placeholder: "Research, wireframes, iteration, testing",
      },
    ],
  },
  {
    department: "Graphic Design",
    questions: [
      {
        name: "Share samples of your design work (posters, branding, social media, etc.).",
        type: "generic",
        placeholder: "Link, or 'N/A'",
      },
      {
        name: "Which design tools are you most comfortable with?",
        type: "short-text",
        placeholder: "e.g. Figma, Photoshop, Illustrator",
      },
    ],
  },
  {
    department: "Web Development",
    questions: [
      {
        name: "Which web technologies or frameworks have you worked with?",
        type: "short-text",
        placeholder: "e.g. React, Next.js, Node.js",
      },
      {
        name: "Share a link to a website or project you've built.",
        type: "generic",
        placeholder: "Link, or 'N/A'",
      },
    ],
  },
  {
    department: "App Development",
    questions: [
      {
        name: "Which mobile development frameworks have you used (Flutter, React Native, etc.)?",
        type: "short-text",
        placeholder: "e.g. Flutter, React Native, Swift, Kotlin",
      },
      {
        name: "Describe an app you've built or contributed to.",
        type: "long-text",
        placeholder: "What it does, your role, tech used",
      },
    ],
  },
  {
    department: "Game Development",
    questions: [
      {
        name: "Which game engines have you worked with (Unity, Unreal, Godot, etc.)?",
        type: "short-text",
        placeholder: "e.g. Unity, Unreal, Godot",
      },
      {
        name: "Describe a game project you've built or contributed to.",
        type: "long-text",
        placeholder: "Genre, your role, tools used",
      },
    ],
  },
  {
    department: "Data Science",
    questions: [
      {
        name: "Which tools or languages do you use for data analysis (Python, R, SQL, etc.)?",
        type: "short-text",
        placeholder: "e.g. Python, R, SQL, pandas",
      },
      {
        name: "Describe a data project or model you've worked on.",
        type: "long-text",
        placeholder: "Problem, approach, outcome",
      },
    ],
  },
  {
    department: "Blockchain & Web3",
    questions: [
      {
        name: "Have you built or contributed to any smart contracts or dApps?",
        type: "generic",
        placeholder: "What you built and your role",
      },
      {
        name: "Which blockchain platforms are you familiar with (Ethereum, Solana, etc.)?",
        type: "short-text",
        placeholder: "e.g. Ethereum, Solana, Polygon",
      },
    ],
  },
  {
    department: "Open Source",
    questions: [
      {
        name: "Share a link to your GitHub profile.",
        type: "generic",
        placeholder: "https://github.com/your-username",
      },
      {
        name: "Describe an open-source project you've contributed to.",
        type: "long-text",
        placeholder: "Project, what you contributed, link if any",
      },
    ],
  },
  {
    department: "Competitive Programming",
    questions: [
      {
        name: "What is your Codeforces/LeetCode/CodeChef handle (if any)?",
        type: "short-text",
        placeholder: "Handle, or 'N/A'",
      },
      {
        name: "Describe your experience with competitive programming or hackathons.",
        type: "long-text",
        placeholder: "Contests, ranks, achievements",
      },
    ],
  },
];

// Headers for CSV exports
export const CSV_Header = [
  {
    label: "Name",
    key: "Name",
  },
  {
    label: "Email",
    key: "Email",
  },
  {
    label: "Registration Number",
    key: "RegistrationNumber",
  },
  {
    label: "Phone",
    key: "Phone",
  },
  {
    label: "Department",
    key: "Department",
  },
  {
    label: "Gender",
    key: "Gender",
  },
  {
    label: "Year of Study",
    key: "Year of Study",
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
  },
  {
    label: "Questions",
    key: "Questions",
  },
];

// Mailing Templates
export const mailingTemplate = {
  Interview:
    `<p>Edit content</p><br><p>Thank you for applying to ${ORG_NAME}. We are excited to let you know that you have been shortlisted for joining the #dept Department!</p><p>We look forward to your active participation!</p>`,
};
