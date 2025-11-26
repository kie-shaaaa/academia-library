import React, { useState, useEffect } from 'react';
import '../index.css';
import {sampleBooks } from './SampleBook';


interface Book {
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

interface SearchSectionProps {
  onSearch?: () => void;
  onShowFeatured?: () => void;
  showFeatured?: boolean;
}

function SearchSection({ onSearch, onShowFeatured, showFeatured = true }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);

  const getCoverUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'M') =>
    coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : `https://via.placeholder.com/128x192?text=No+Cover`;

  const getImageUrl = (book: Book, size: 'S' | 'M' | 'L' = 'M'): string => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
    }
    if (book.coverUrl) {
      return book.coverUrl.replace('-L.jpg', `-${size}.jpg`);
    }
    return ''; // Return null instead of placeholder
  };

  const NoPhotoPlaceholder = () => (
    <div
      style={{
        width: '100%',
        height: 220,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#999',
      }}
    >
      <i className="fas fa-image fa-3x mb-2"></i>
      <span className="text-center small">No Photo Available</span>
    </div>
  );

  // use cover_i if available, otherwise fallback to book.coverUrl (from sampleBooks)
  const imageSrc = (book: Book, size: 'S' | 'M' | 'L' = 'M') => {
    if (book.cover_i) return getCoverUrl(book.cover_i, size);
    if (book.coverUrl) return book.coverUrl.replace('-L.jpg', `-${size}.jpg`) || book.coverUrl;
    return `https://via.placeholder.com/128x192?text=No+Photo+Available`;
  };

  const searchBooks = async (query?: string) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=30`);
      const data = await res.json();
      
      // Transform API data to match our Book interface
      let formattedBooks: Book[] = data.docs.map((doc: any, index: number) => ({
        id: doc.key || `book-${index}`,
        title: doc.title,
        author_name: doc.author_name,
        first_publish_year: doc.first_publish_year,
        subject: doc.subject,
        isbn: doc.isbn,
        cover_i: doc.cover_i
      }));

      // Filter for relevance: title or author must contain search query
      const queryLower = q.toLowerCase();
      formattedBooks = formattedBooks.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(queryLower);
        const authorMatch = (book.author_name || []).some(author => 
          author.toLowerCase().includes(queryLower)
        );
        return titleMatch || authorMatch;
      });
      
      setBooks(formattedBooks);
      if (onSearch) onSearch();
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBooks();
    }
  };

  const resetSearch = () => {
    setSearched(false);
    setBooks([]);
    setSearchQuery('');
    if (onShowFeatured) {
      onShowFeatured();
    }
  };

  const handleBookClick = async (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
    
    // If it's a search result book and doesn't have description, fetch from API
    if (!book.description && book.id && !book.id.startsWith('book-')) {
      setDescriptionLoading(true);
      try {
        const workId = book.id.replace('/works/', '');
        const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
        const bookData = await res.json();
        
        let description = "No description available.";
        if (bookData.description) {
          if (typeof bookData.description === 'string') {
            description = bookData.description;
          } else if (bookData.description.value) {
            description = bookData.description.value;
          }
        }
        
        setSelectedBook({
          ...book,
          description: description
        });
      } catch (err) {
        console.error(err);
        setSelectedBook({
          ...book,
          description: "Description not available."
        });
      } finally {
        setDescriptionLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setDescriptionLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Get genre from subjects
  const getGenre = (subjects: string[] | undefined): string => {
    if (!subjects || subjects.length === 0) return 'Fiction';

    const firstSubject = subjects[0];
    let cleanSubject = firstSubject.split('(')[0].split(',')[0].trim();
    
    cleanSubject = cleanSubject.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
      
    return cleanSubject;
  };

  const cleanDescription = (description: string): string => {
    if (!description) return '';
    // Remove URLs and source citations
    return description
      .replace(/\(https?:\/\/[^\)]+\)/g, '')
      .replace(/\[\[source\]\]/gi, '')
      .replace(/\(\[source\]\[.*?\]\)/gi, '')
      .trim();
  };

  // Reset local search state when parent toggles showFeatured -> true
  useEffect(() => {
    if (showFeatured) {
      setSearched(false);
      setBooks(sampleBooks); // optional: restore featured list
      setSearchQuery('');
    }
  }, [showFeatured]);

  return (
    <div className="container my-5">
      {/* Search bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-10">
          <div className="d-flex gap-2">
            <input
              className="form-control"
              type="search"
              placeholder="Search books, authors, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="btn text-white"
              onClick={() => searchBooks()}
              disabled={loading}
              style={{
                backgroundColor: '#660B05',
                borderColor: '#660B05',
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  Searching...
                </>
              ) : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Featured books - only shown when showFeatured is true and no search has been performed */}
      {showFeatured && !searched && (
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="mb-3" style={{color: '#660B05'}}>Featured books</h3>
          </div>
          {sampleBooks.map((book) => (
            <div key={book.id} className="col-12 col-sm-6 col-md-4 mb-3">
              <div 
                className="card h-100 shadow-sm border-0 book-card"
                style={{ cursor: 'pointer' }}
                onClick={() => handleBookClick(book)}
              >
                {getImageUrl(book, 'M') ? (
                  <img 
                    src={getImageUrl(book, 'M')} 
                    className="card-img-top" 
                    alt={book.title} 
                    style={{ height: 220, objectFit: 'cover' }} 
                  />
                ) : (
                  <NoPhotoPlaceholder />
                )}
                <div className="card-body">
                  <h5 className="card-title mb-1">{book.title}</h5>
                  <p className="text-muted small mb-1">{(book.author_name || []).join(', ')}</p>
                  <p className="text-muted small mb-0">{getGenre(book.subject)} • {book.first_publish_year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search results (shown after a search) */}
      {searched && (
        <div className="row">
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 style={{color: '#660B05'}}>Search results</h4>
              {/* Only show back button when there are search results */}
              {books.length > 0 && (
                <button 
                  className="btn btn-link text-decoration-none p-0"
                  onClick={resetSearch}
                  style={{ color: '#660B05' }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Featured Books
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="col-12 text-center py-4">
              <div className="spinner-border" style={{ color: '#660B05' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Searching our library...</p>
            </div>
          )}

          {!loading && books.length === 0 && (
            <div className="col-12 text-center py-4">
              <div className="mb-3">
                <i className="fas fa-book fa-3x text-muted"></i>
              </div>
              <h5>No books found</h5>
              <p className="text-muted">Try different search terms or check your spelling</p>
              <button 
                className="btn text-white mt-2"
                onClick={resetSearch}
                style={{ backgroundColor: '#660B05', borderColor: '#660B05' }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Featured Books
              </button>
            </div>
          )}

          {!loading && books.length > 0 && (
            <div className="row g-4">
              {books.map((book, i) => (
                <div key={book.id} className="col-12 col-sm-6 col-md-4">
                  <div 
                    className="card h-100 shadow-sm border-0 book-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleBookClick(book)}
                  >
                    {getImageUrl(book, 'M') ? (
                      <img 
                        src={getImageUrl(book, 'M')} 
                        className="card-img-top" 
                        alt={book.title} 
                        style={{ height: 220, objectFit: 'cover' }} 
                      />
                    ) : (
                      <NoPhotoPlaceholder />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title mb-1">{book.title}</h5>
                      <p className="text-muted small mb-1">{(book.author_name || []).join(', ')}</p>
                      <p className="text-muted small mb-2">{getGenre(book.subject)}</p>
                      <div className="mt-auto text-muted small">
                        {book.first_publish_year ? `First published: ${book.first_publish_year}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Detail Modal */}
      {showModal && selectedBook && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleBackdropClick}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h2 className="modal-title fw-bold text-dark">{selectedBook.title}</h2>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body py-0">
                <div className="row">
                  <div className="col-md-4 text-center">
                    {getImageUrl(selectedBook, 'L') ? (
                      <img 
                        src={getImageUrl(selectedBook, 'L')} 
                        className="img-fluid rounded shadow"
                        alt={selectedBook.title}
                        style={{ maxHeight: '350px', objectFit: 'cover' }}
                      />
                    ) : (
                      <NoPhotoPlaceholder />
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="mb-4">
                      <h5 className="text-muted small mb-1">Author</h5>
                      <p className="fs-5 fw-semibold text-dark">
                        {(selectedBook.author_name || []).join(', ') || 'Unknown Author'}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-muted small mb-1">Published</h5>
                      <p className="fs-5 text-dark">
                        {selectedBook.first_publish_year || 'Unknown'}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-muted small mb-1">Genre</h5>
                      <p className="fs-5 text-dark">{getGenre(selectedBook.subject)}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-muted small mb-1">Description</h5>
                      {descriptionLoading ? (
                        <div className="text-muted">Loading description...</div>
                      ) : (
                        <p className="fs-6 text-dark" style={{ lineHeight: '1.6', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                          {cleanDescription(selectedBook.description || "No description available.")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button 
                  type="button" 
                  className="btn text-white" 
                  onClick={closeModal}
                  style={{ backgroundColor: '#660B05', borderColor: '#660B05' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .book-card {
          border-left: 4px solid transparent;
          transition: all 0.3s ease;
        }
        .book-card:hover {
          border-left-color: #660B05;
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

export default SearchSection;

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />