import { IconType } from 'react-icons';
import { avatar, send, shield, star } from '../assets';
import { FaYoutube, FaSpotify, FaImdb } from 'react-icons/fa';
import { SiDiscogs } from 'react-icons/si';

interface NavLink {
   id: string;
   title: string;
}

interface Feature {
   id: string;
   icon: string;
   title: string;
   subtitle: string;
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
   icon: IconType;
   link: string;
}

export const navLinks: NavLink[] = [{ id: 'dashboard', title: 'Dashboard' }];

export const features: Feature[] = [
   {
      id: 'feature-1',
      icon: star,
      title: 'Precision',
      subtitle: 'Know what you’ve seen, read, and heard—down to the last detail.',
      content:
         'From album drop dates to page counts, track your media experiences with pinpoint precision. Never forget where you left off or what moved you.'
   },
   {
      id: 'feature-2',
      icon: shield,
      title: 'Speed',
      subtitle: 'Track it all in seconds. Relive it anytime.',
      content:
         'Log concerts, books, films, and shows with one click. Your personal dashboard updates instantly—so you can spend less time organizing and more time enjoying.'
   },
   {
      id: 'feature-3',
      icon: send,
      title: 'Diversity',
      subtitle: 'Every medium. Every moment. One platform.',
      content:
         'Whether it’s a midnight concert, an audiobook marathon, or a film binge, we cover it. Movies, albums, books, podcasts, live shows—you name it, we track it.'
   }
];

export const feedback: Feedback[] = [
   {
      id: 'feedback-1',
      content:
         'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua.',
      name: 'Client Name',
      title: 'Reviewer Name',
      img: avatar
   },
   {
      id: 'feedback-2',
      content:
         'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua.',
      name: 'Client Name',
      title: 'Reviewer Name',
      img: avatar
   },
   {
      id: 'feedback-3',
      content:
         'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore et dolore magna aliqua.',
      name: 'Client Name',
      title: 'Reviewer Name',
      img: avatar
   }
];

export const stats: Stat[] = [
   { id: 'stats-2', title: 'Media Databases', value: '20+' },
   { id: 'stats-1', title: 'Records Available', value: '3,000+' },
   { id: 'stats-3', title: 'Convenient Hub', value: '1' }
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
   { id: 'social-media-1', icon: FaYoutube, link: 'https://www.youtube.com/' },
   { id: 'social-media-2', icon: FaSpotify, link: 'https://www.spotify.com/' },
   { id: 'social-media-3', icon: FaImdb, link: 'https://www.imdb.com/' },
   { id: 'social-media-4', icon: SiDiscogs, link: 'https://www.discogs.com/' }
];
