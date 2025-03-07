import { avatar, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star } from '../assets';

interface NavLink {
   id: string;
   title: string;
}

interface Feature {
   id: string;
   icon: string;
   title: string;
   content: string;
}

interface Feedback {
   id: string;
   content: string;
   name: string;
   title: string;
   img: string;
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
   icon: string;
   link: string;
}

interface Client {
   id: string;
   logo: string;
}

export const navLinks: NavLink[] = [
   { id: 'home', title: 'Home' },
   { id: 'features', title: 'Features' },
   { id: 'product', title: 'Product' },
   { id: 'clients', title: 'Clients' },
   { id: 'dashboard', title: 'Dashboard' }
];

export const features: Feature[] = [
   {
      id: 'feature-1',
      icon: star,
      title: 'Accuracy',
      content: 'Lorem ipsum dolor sit amet amincus salve armour corridor raxen forza inter brava'
   },
   {
      id: 'feature-2',
      icon: shield,
      title: 'Efficiency',
      content: 'Lorem ipsum dolor sit amet amincus salve armour corridor raxen forza inter brava'
   },
   {
      id: 'feature-3',
      icon: send,
      title: 'Security',
      content: 'Lorem ipsum dolor sit amet amincus salve armour corridor raxen forza inter brava'
   }
];

export const feedback: Feedback[] = [
   {
      id: 'feedback-1',
      content: 'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua.',
      name: 'Client Name',
      title: 'Reviewer Name',
      img: avatar
   },
   {
      id: 'feedback-2',
      content: 'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua.',
      name: 'Client Name',
      title: 'Reviewer Name',
      img: avatar
   },
   {
      id: 'feedback-3',
      content: 'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua.',
      name: 'Client Name',
      title: 'Reviewer Name',
      img: avatar
   }
];

export const stats: Stat[] = [
   { id: 'stats-2', title: 'Hours Saved', value: '200+' },
   { id: 'stats-1', title: 'Records Analyzed', value: '30,000+' },
   { id: 'stats-3', title: 'Incidents Avoided', value: '10+' }
];

export const footerLinks: FooterSection[] = [
   {
      title: 'Useful Links',
      links: [
         { name: 'Content', link: 'https://www.hoobank.com/content/' },
         { name: 'How it Works', link: 'https://www.hoobank.com/how-it-works/' },
         { name: 'Create', link: 'https://www.hoobank.com/create/' },
         { name: 'Explore', link: 'https://www.hoobank.com/explore/' },
         { name: 'Terms & Services', link: 'https://www.hoobank.com/terms-and-services/' }
      ]
   },
   {
      title: 'Community',
      links: [
         { name: 'Help Center', link: 'https://www.hoobank.com/help-center/' },
         { name: 'Partners', link: 'https://www.hoobank.com/partners/' },
         { name: 'Suggestions', link: 'https://www.hoobank.com/suggestions/' },
         { name: 'Blog', link: 'https://www.hoobank.com/blog/' },
         { name: 'Newsletters', link: 'https://www.hoobank.com/newsletters/' }
      ]
   },
   {
      title: 'Partner',
      links: [
         { name: 'Our Partner', link: 'https://www.hoobank.com/our-partner/' },
         { name: 'Become a Partner', link: 'https://www.hoobank.com/become-a-partner/' }
      ]
   }
];

export const socialMedia: SocialMedia[] = [
   { id: 'social-media-1', icon: instagram, link: 'https://www.instagram.com/' },
   { id: 'social-media-2', icon: facebook, link: 'https://www.facebook.com/' },
   { id: 'social-media-3', icon: twitter, link: 'https://www.twitter.com/' },
   { id: 'social-media-4', icon: linkedin, link: 'https://www.linkedin.com/' }
];

export const clients: Client[] = [
   { id: 'client-1', logo: airbnb },
   { id: 'client-2', logo: binance },
   { id: 'client-3', logo: coinbase },
   { id: 'client-4', logo: dropbox }
];
