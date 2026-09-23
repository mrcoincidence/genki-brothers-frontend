// app/playground/page.tsx
import PlaygroundClient from './PlaygroundClient';

export const metadata = {
  title: 'Playground | Genki Brothers',
  description: 'A sandbox of in-house AI prototypes and experimental digital tools built by Genki Brothers.',
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}