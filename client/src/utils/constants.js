export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'corporate', label: 'Corporate Meeting' },
  { value: 'conference', label: 'Conference' },
  { value: 'party', label: 'Party' },
  { value: 'other', label: 'Other' },
];

export const THEME_SUGGESTIONS = {
  wedding: ['Classic Romantic', 'Rustic Charm', 'Modern Elegance', 'Beach Wedding', 'Garden Party'],
  birthday: ['Vintage Glam', 'Superhero', 'Tropical Luau', 'Masquerade Ball', 'Sports Theme'],
  corporate: ['Professional Chic', 'Innovation Tech', 'Green Sustainability', 'Luxury Executive'],
  conference: ['Modern Tech', 'Academic Excellence', 'Creative Arts', 'Business Leadership'],
  party: ['Retro 80s', 'Boho Chic', 'Neon Glow', 'Great Gatsby', 'Tropical Paradise'],
};

export const INITIAL_TASKS = [
  { task: 'Create guest list', done: false },
  { task: 'Book venue', done: false },
  { task: 'Send invitations', done: false },
  { task: 'Arrange catering', done: false },
  { task: 'Plan decorations', done: false },
];