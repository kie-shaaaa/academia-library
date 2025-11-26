import React from 'react';

export interface Book {
  id: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
  isbn?: string[];
  cover_i?: number;
  coverUrl: string;
  description?: string;
}

export const sampleBooks: Book[] = [
  {
    id: 'OL26491060M',
    title: 'The Great Gatsby',
    author_name: ['F. Scott Fitzgerald'],
    first_publish_year: 1925,
    subject: ['Fiction', 'Classic', 'American Literature'],
    cover_i: 14811172,
    coverUrl: 'https://covers.openlibrary.org/b/id/14811172-L.jpg',
    description:
      'A classic novel of the Jazz Age, telling the story of the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan.',
  },
  {
    id: 'OL234567W',
    title: 'To Kill a Mockingbird',
    author_name: ['Harper Lee'],
    first_publish_year: 1960,
    subject: ['Fiction', 'Southern Gothic', 'Coming-of-age'],
    cover_i: 14351077,
    coverUrl: 'https://covers.openlibrary.org/b/id/14351077-L.jpg',
    description:
      'A gripping story of racial injustice and childhood innocence in the American South, seen through the eyes of young Scout Finch.',
  },
  {
    id: 'OL345678W',
    title: '1984',
    author_name: ['George Orwell'],
    first_publish_year: 1949,
    subject: ['Dystopian', 'Science Fiction', 'Political Fiction'],
    cover_i: 15115831,
    coverUrl: 'https://covers.openlibrary.org/b/id/15115831-L.jpg',
    description:
      'A dystopian social science fiction novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation.',
  },
  {
    id: 'OL456789W',
    title: 'Pride and Prejudice',
    author_name: ['Jane Austen'],
    first_publish_year: 1813,
    subject: ['Romance', 'Classic', 'British Literature'],
    cover_i: 14845129,
    coverUrl: 'https://covers.openlibrary.org/b/id/14845129-L.jpg',
    description:
      'A romantic novel that charts the emotional development of protagonist Elizabeth Bennet, who learns the error of making hasty judgments.',
  },
  {
    id: 'OL567890W',
    title: 'The Hobbit',
    author_name: ['J.R.R. Tolkien'],
    first_publish_year: 1937,
    subject: ['Fantasy', 'Adventure', "Children's Literature"],
    cover_i: 14627222,
    coverUrl: 'https://covers.openlibrary.org/b/id/14627222-L.jpg',
    description:
      'A fantasy novel about the adventures of hobbit Bilbo Baggins, who is hired as a burglar by a group of dwarves on a quest to reclaim their mountain home.',
  },
  {
    id: 'OL678901W',
    title: "Harry Potter and the Philosopher's Stone",
    author_name: ['J.K. Rowling'],
    first_publish_year: 1997,
    subject: ['Fantasy', 'Young Adult', 'Magic'],
    cover_i: 14858822,
    coverUrl: 'https://covers.openlibrary.org/b/id/14858822-L.jpg',
    description:
      "The first novel in the Harry Potter series, following Harry Potter's first year at Hogwarts School of Witchcraft and Wizardry.",
  },
];