import { IconType } from 'react-icons';
import { send, shield, star } from '../assets';
import { FaYoutube, FaSpotify, FaImdb } from 'react-icons/fa';
import { SiDiscogs } from 'react-icons/si';
import { FiBarChart2, FiCpu, FiDatabase, FiShield, FiTrendingUp, FiUsers, FiActivity, FiGlobe, FiZap } from 'react-icons/fi';

interface NavLink {
     id: string;
     title: string;
}

interface SidebarLink {
     id: string;
     name: string;
     path: string;
}

interface Feature {
     id: string;
     icon: string;
     title: string;
     subtitle: string;
     content: string;
}

interface FaqData {
     question: string;
     answer: string;
}

interface Stat {
     id: string;
     title: string;
     value: string;
}

interface FooterLink {
     name: string;
     link: string;
}

interface FooterSection {
     title: string;
     links: FooterLink[];
}

interface SocialMedia {
     id: string;
     icon: IconType;
     link: string;
}

interface TermsOfService {
     title: string;
     description: string;
}

interface ExploreFeature {
     title: string;
     description: string;
     icon: IconType;
}

interface TeamMember {
     name: string;
     role: string;
     description: string;
}

export type {
     NavLink,
     SidebarLink,
     Feature,
     FaqData,
     Stat,
     FooterLink,
     FooterSection,
     SocialMedia,
     TermsOfService,
     ExploreFeature,
     TeamMember
};

export const navLinks: NavLink[] = [
     { id: '/', title: 'Home' },
     { id: 'about', title: 'About' },
     { id: 'dashboard', title: 'Dashboard' },
     { id: 'explore', title: 'Explore' },
     { id: 'contact', title: 'Contact' }
];

export const sidebarLinks: SidebarLink[] = [
     { id: 'overview-sidebar', name: 'Overview', path: '/dashboard' },
     { id: 'movies-sidebar', name: 'Movies', path: '/dashboard/movies-table' },
     { id: 'my-media-sidebar', name: 'My Media', path: '/dashboard/my-media' }
];

export const features: Feature[] = [
     {
          id: 'feature-1',
          icon: star,
          title: 'Precision',
          subtitle: 'Know what you’ve seen, read, and heard—down to the last detail.',
          content: 'From album drop dates to page counts, track your media experiences with pinpoint precision. Never forget where you left off or what moved you.'
     },
     {
          id: 'feature-2',
          icon: shield,
          title: 'Speed',
          subtitle: 'Track it all in seconds. Relive it anytime.',
          content: 'Log concerts, books, films, and shows with one click. Your personal dashboard updates instantly—so you can spend less time organizing and more time enjoying.'
     },
     {
          id: 'feature-3',
          icon: send,
          title: 'Diversity',
          subtitle: 'Every medium. Every moment. One platform.',
          content: 'Whether it’s a midnight concert, an audiobook marathon, or a film binge, we cover it. Movies, albums, books, podcasts, live shows—you name it, we track it.'
     }
];

export const stats: Stat[] = [
     { id: 'stats-2', title: 'Media Databases', value: '20+' },
     { id: 'stats-1', title: 'Records Available', value: '3,000+' },
     { id: 'stats-3', title: 'Convenient Hub', value: '1' }
];

export const teamMembers: TeamMember[] = [
     {
          name: 'David Rodriguez',
          role: 'CEO',
          description:
               'David is a seasoned AI and analytics leader known for designing large-scale data ecosystems and transforming operational insights into measurable outcomes. With a deep background in EdTech, he has harnessed advanced LLM fine-tuning, real-time analytics, and automated risk assessments to predict educator performance at scale—matching the accuracy of human judgment. Now, as a driving force at Analysis & Insights Consulting, David applies predictive modeling, behavioral analysis, and strategic AI to empower organizations across all sectors. Whether optimizing resources, streamlining operations, or boosting stakeholder satisfaction, David’s expertise in operational strategy and next-generation AI ensures that data-driven transformation translates into tangible, scalable results. His dedication to blending technological innovation with human-centric processes positions businesses to thrive in the evolving digital landscape.'
     },
     {
          name: 'Fernando Medina',
          role: 'Operations Manager',
          description:
               'Fernando is a seasoned operations leader with a deep understanding of the education industry. He brings a wealth of experience in managing complex operations and streamlining processes to ensure efficient delivery of services. With a focus on customer satisfaction and operational excellence, Fernando drives continuous improvement and ensures that Analysis & Insights Consulting delivers exceptional results for its clients.'
     },
     {
          name: 'Field Palmer',
          role: 'Product Engineer',
          description:
               'Field is a seasoned product engineer with a passion for building scalable and efficient web applications. He brings a wealth of experience in building and managing large-scale data ecosystems and transforming operational insights into measurable outcomes.'
     },
     {
          name: 'Trey Moore',
          role: 'Product Manager',
          description:
               'Trey is a results-driven Academic/Data Analysis Manager and Data & Business Strategy Consultant at Analysis & Insights Consulting, specializing in data strategy, business intelligence, and performance evaluation. With expertise in data analysis, product management, and business strategy, he has a proven track record of optimizing processes, driving performance insights, and leading cross-functional teams. He currently oversees the evaluation and performance analysis of university boot camps at an EdTech firm, leveraging sentiment analysis, instructor performance metrics, and market trends to enhance program effectiveness and inform strategic decision-making. His ability to translate complex data into actionable insights helps organizations improve efficiency, optimize operations, and drive business growth. With four years of experience in inventory management and supply chain, alongside expertise in sprint planning, value proposition development, and strategic road mapping, Trey excels at developing scalable solutions that align data with business objectives. He is passionate about using data-driven strategies to solve complex challenges and foster continuous improvement.'
     },
     {
          name: 'Steven Stabile',
          role: 'Systems Engineer',
          description:
               'Steven is a seasoned systems engineer with a deep understanding of the education industry. He brings a wealth of experience in managing complex operations and streamlining processes to ensure efficient delivery of services. With a focus on customer satisfaction and operational excellence, Steven drives continuous improvement and ensures that Analysis & Insights Consulting delivers exceptional results for its clients.'
     }
];

export const footerLinks: FooterSection[] = [
     {
          title: 'Useful Links',
          links: [
               { name: 'F.A.Q.', link: '/faq' },
               { name: 'Terms & Services', link: '/tos' }
          ]
     },
     {
          title: 'Community',
          links: [
               { name: 'About Us', link: '/about' },
               { name: 'Explore', link: '/explore' }
          ]
     },
     {
          title: 'Contact',
          links: [{ name: 'Contact Us', link: '/contact' }]
     }
];

export const socialMedia: SocialMedia[] = [
     { id: 'social-media-1', icon: FaYoutube, link: 'https://www.youtube.com/' },
     { id: 'social-media-2', icon: FaSpotify, link: 'https://www.spotify.com/' },
     { id: 'social-media-3', icon: FaImdb, link: 'https://www.imdb.com/' },
     { id: 'social-media-4', icon: SiDiscogs, link: 'https://www.discogs.com/' }
];

export const faqData: FaqData[] = [
     {
          question: 'What services does AIC provide?',
          answer: 'AIC specializes in analytics, insights, and AI-driven consulting tailored to your organization’s data needs.'
     },
     {
          question: 'How do I get started?',
          answer: 'Contact us to schedule a demo or consultation. We’ll work with you to understand your goals and create a custom solution.'
     },
     {
          question: 'Is my data secure with AIC?',
          answer: 'Absolutely. We adhere to industry best practices for data security and compliance.'
     }
];

export const termsOfService: TermsOfService[] = [
     {
          title: '1. Use of Service',
          description: `
     AIC provides advanced data analytics, insights generation, and AI-driven consulting services designed to help businesses
     make informed, strategic decisions. You are granted a non-exclusive, non-transferable, limited license to access and
     use our platform for its intended purpose, subject to these terms.
     
     As a user of AIC’s services, you agree to provide accurate, current, and complete information as requested. You are solely
     responsible for the integrity and legality of any data you upload, share, or analyze through our platform. Unauthorized use
     of the platform or its services, including but not limited to reverse engineering, data scraping, or reselling without
     express written consent, is strictly prohibited.
   `
     },
     {
          title: '2. Privacy Policy',
          description: `
     At AIC, safeguarding your data is our top priority. We are committed to maintaining the confidentiality, integrity, and
     security of your information. Our comprehensive Privacy Policy outlines how we collect, store, process, and protect your
     data. By using our platform, you acknowledge that you have reviewed and consented to the practices described in our
     Privacy Policy.
     
     We utilize industry-standard security protocols, including encryption and secure data centers, to ensure that your data
     remains protected. However, you acknowledge that no method of transmission over the Internet is 100% secure, and AIC
     cannot guarantee absolute security.
   `
     },
     {
          title: '3. Limitations of Liability',
          description: `
     AIC provides its services "as is" and makes no warranties, expressed or implied, regarding the accuracy, reliability,
     or completeness of any information or analysis provided. You agree that AIC shall not be held liable for any direct,
     indirect, incidental, consequential, or punitive damages arising from your use or inability to use our services,
     including but not limited to errors, omissions, delays, or inaccuracies in the data or reports.
     
     To the maximum extent permitted by applicable law, AIC disclaims all liability for any damages, losses, or injuries
     resulting from hacking, tampering, or other unauthorized access to or use of our services or your account information.
   `
     },
     {
          title: '4. User Responsibilities',
          description: `
     You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted
     under your account. You agree not to engage in any activity that could damage, disable, overburden, or impair the
     functioning of our platform.
     
     Misuse of our services, including but not limited to the submission of harmful data, distribution of malware, or
     unauthorized access to third-party data, will result in immediate termination of your account and may lead to legal
     action.
   `
     },
     {
          title: '5. Intellectual Property',
          description: `
     All content, trademarks, logos, and proprietary technology on the AIC platform are the intellectual property of AIC or its
     licensors. You are granted no right or license to use any of these intellectual properties without prior written
     authorization. Unauthorized use may violate copyright, trademark, and other applicable laws.
   `
     },
     {
          title: '6. Third-Party Services and Integrations',
          description: `
     AIC may integrate or provide access to third-party services, data sources, or applications. You acknowledge and agree
     that AIC is not responsible for the availability, accuracy, or practices of these third-party services, and your use
     of them is subject to their respective terms and policies.
   `
     },
     {
          title: '7. Indemnification',
          description: `
     You agree to indemnify and hold harmless AIC, its affiliates, officers, directors, employees, and agents from any
     claims, damages, liabilities, and expenses (including reasonable attorneys' fees) arising out of or related to your use
     of the services, violation of these terms, or infringement of any intellectual property or other rights of any third
     party.
   `
     },
     {
          title: '8. Changes to Terms',
          description: `
     AIC reserves the right to revise, modify, or update these Terms & Services at any time, at its sole discretion.
     Continued use of our platform after any such changes constitutes your acceptance of the new terms. We encourage
     users to review this page regularly for updates.
   `
     },
     {
          title: '9. Governing Law and Jurisdiction',
          description: `
     These Terms & Services shall be governed by and construed in accordance with the laws of the state or jurisdiction in
     which AIC is headquartered, without regard to its conflict of law provisions. You agree to submit to the exclusive
     jurisdiction of the courts located in that jurisdiction for any disputes arising from or relating to these terms or your
     use of the services.
   `
     }
];

export const exploreFeatures: ExploreFeature[] = [
     {
          title: 'Custom Dashboards',
          description: `
    Build tailored dashboards that bring your most critical metrics into focus.
    Visualize KPIs in real-time with intuitive, interactive layouts designed to keep your team informed and agile.
    Whether you're tracking sales, customer engagement, or operational efficiency, your dashboard adapts to you.
  `,
          icon: FiBarChart2
     },
     {
          title: 'AI-Powered Insights',
          description: `
    Leverage machine learning algorithms to uncover patterns, trends, and anomalies in your data.
    Our AI-driven analytics provide predictive insights that help you make data-backed decisions faster,
    empowering your business to stay ahead of the competition.
  `,
          icon: FiCpu
     },
     {
          title: 'Data Integration',
          description: `
    Seamlessly connect and unify data from multiple sources—whether it's CRM, ERP, marketing tools, or spreadsheets.
    Gain a holistic view of your organization’s performance and break down silos that limit your strategic insight.
  `,
          icon: FiDatabase
     },
     {
          title: 'Advanced Security',
          description: `
    Protect your sensitive data with enterprise-grade security protocols.
    Our platform includes end-to-end encryption, role-based access controls, and continuous monitoring,
    ensuring your analytics remain private, compliant, and secure.
  `,
          icon: FiShield
     },
     {
          title: 'Predictive Analytics',
          description: `
    Move from hindsight to foresight with predictive analytics tools that forecast trends and future outcomes.
    Identify potential risks, opportunities, and optimize your strategies with AI-powered forecasting models.
  `,
          icon: FiTrendingUp
     },
     {
          title: 'Collaboration Tools',
          description: `
    Share insights and dashboards seamlessly across teams and departments.
    Collaborate in real-time with commenting, report sharing, and automated alerts that keep stakeholders informed and aligned.
  `,
          icon: FiUsers
     },
     {
          title: 'Real-Time Monitoring',
          description: `
      Stay informed with live data streams and real-time monitoring capabilities.
      Our system continuously tracks key metrics and operational data,
      providing immediate visibility into performance and enabling rapid response to critical changes.
    `,
          icon: FiActivity
     },
     {
          title: 'Global Scalability',
          description: `
      Whether you're a growing startup or a multinational enterprise,
      AIC’s infrastructure scales seamlessly to meet your expanding data needs.
      Access consistent, reliable analytics and insights across regions, teams, and time zones.
    `,
          icon: FiGlobe
     },
     {
          title: 'Automated Reporting',
          description: `
      Save time and reduce manual effort with automated reporting features.
      Schedule customized reports to be generated and delivered to key stakeholders,
      ensuring everyone has access to the latest insights without lifting a finger.
    `,
          icon: FiZap
     }
];
