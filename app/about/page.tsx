// app/about/page.tsx
import AboutClient from './AboutClient';

export const metadata = {
  title: 'About | Genki Brothers',
  description: 'Learn about Yoshihito Kawamura, Founder of Genki Brothers — a Creative Collective bridging culinary UX principles, global design craft, and emerging tech.',
};

export default function AboutPage() {
  return <AboutClient />;
}