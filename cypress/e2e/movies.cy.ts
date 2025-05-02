describe('Movies Page', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
    });

    // Intercepta a chamada da API de filmes
    cy.intercept('GET', '**/api/movies**', {
      statusCode: 200,
      body: {
        movies: [
          {
            id: 1,
            title: 'Test Movie 1',
            description: 'Description 1',
            releaseDate: '2024-01-01',
            image: 'https://placehold.co/400x200.png?text=Test+Movie+1',
          },
          {
            id: 2,
            title: 'Test Movie 2',
            description: 'Description 2',
            releaseDate: '2024-01-02',
            image: 'https://placehold.co/400x200.png?text=Test+Movie+2',
          },
        ],
        total: 2,
      },
    }).as('getMovies');

    cy.visit('http://localhost:3000/movies');
  });

  describe('Layout and Initial Render', () => {
    it('should display the page title', () => {
      cy.contains('🎬 Catálogo de Filmes').should('be.visible');
    });

    it('should show search input and buttons', () => {
      cy.get('input[placeholder="Buscar por título..."]').should('be.visible');
      cy.contains('button', 'Filtros').should('be.visible');
      cy.contains('a', '+ Novo Filme').should('be.visible');
    });

    it('should display movie cards', () => {
      cy.wait('@getMovies');
      cy.get('.grid').children().should('have.length', 2);
      cy.contains('Test Movie 1').should('be.visible');
      cy.contains('Test Movie 2').should('be.visible');
    });
  });

  describe('Search Functionality', () => {
    it('should search movies when typing in search input', () => {
      cy.intercept('GET', '**/api/movies**', {
        query: { search: 'test' },
      }).as('searchMovies');

      cy.get('input[placeholder="Buscar por título..."]').type('test');
      cy.wait('@searchMovies');
    });
  });

  describe('Filters', () => {
    beforeEach(() => {
      cy.contains('button', 'Filtros').click();
    });

    it('should show filter inputs when clicking filter button', () => {
      cy.get('input[type="number"]').should('have.length', 4); // Duration and budget inputs
      cy.get('input[type="date"]').should('have.length', 2); // Date inputs
    });

    it('should apply duration filters', () => {
      cy.intercept('GET', '**/api/movies**', {
        query: { durationMin: '90', durationMax: '120' },
      }).as('filterMovies');

      cy.get('label').contains('Duração mínima').parent().find('input').type('90');
      cy.get('label').contains('Duração máxima').parent().find('input').type('120');
      cy.wait('@filterMovies');
    });

    it('should apply budget filters', () => {
      cy.intercept('GET', '**/api/movies**', {
        query: { minBudget: '1000000', maxBudget: '5000000' },
      }).as('filterMovies');

      cy.get('label').contains('Orçamento mínimo').parent().find('input').type('1000000');
      cy.get('label').contains('Orçamento máximo').parent().find('input').type('5000000');
      cy.wait('@filterMovies');
    });

    it('should apply date filters', () => {
      cy.intercept('GET', '**/api/movies**', {
        query: { dateStart: '2024-01-01', dateEnd: '2024-12-31' },
      }).as('filterMovies');

      cy.get('label').contains('Data inicial').parent().find('input').type('2024-01-01');
      cy.get('label').contains('Data final').parent().find('input').type('2024-12-31');
      cy.wait('@filterMovies');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Mock com mais filmes para testar paginação
      cy.intercept('GET', '**/api/movies**', {
        body: {
          movies: Array.from({ length: 9 }, (_, i) => ({
            id: i + 1,
            title: `Test Movie ${i + 1}`,
            description: `Description ${i + 1}`,
            releaseDate: '2024-01-01',
            image: `https://placehold.co/400x200.png?text=Test+Movie+${i + 1}`,
          })),
          total: 18,
        },
      }).as('getMovies');
      cy.visit('http://localhost:3000/movies');
    });

    it('should display correct number of pagination buttons', () => {
      cy.get('button[class*="rounded-full"]').should('have.length', 2); // 18 items / 9 per page = 2 pages
    });

    it('should change page when clicking pagination buttons', () => {
      cy.intercept('GET', '**/api/movies**', {
        body: {
          movies: Array.from({ length: 9 }, (_, i) => ({
            id: i + 1,
            title: `Test Movie ${i + 1}`,
            description: `Description ${i + 1}`,
            releaseDate: '2024-01-01',
            image: `https://placehold.co/400x200.png?text=Test+Movie+${i + 1}`,
          })),
          total: 18,
        },
      }).as('getPage2');

      cy.get('button[class*="rounded-full"]').contains('2').click();
      cy.wait('@getPage2');
    });
  });

  describe('Navigation', () => {
    it('should navigate to new movie page', () => {
      cy.contains('+ Novo Filme').click();
      cy.url().should('include', '/movies/new');
    });

    it('should navigate to movie details when clicking a movie card', () => {
      cy.wait('@getMovies');
      cy.contains('Test Movie 1').click();
      cy.url().should('include', '/movies/1');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner while fetching movies', () => {
      cy.intercept('GET', '**/api/movies**', {
        delay: 3000,
        body: {
          movies: [],
          total: 0,
        },
      }).as('getMoviesDelayed');

      cy.visit('http://localhost:3000/movies');
      cy.get('[data-testid="spinner"]').should('be.visible');
      cy.wait('@getMoviesDelayed');
    });
  });

  describe('Dark Mode', () => {
    it('should apply dark mode styles', () => {
      cy.get('html').invoke('addClass', 'dark');

      cy.get('.dark\\:bg-gray-800').should('exist');
      cy.get('.dark\\:text-white').should('exist');
      cy.get('.dark\\:bg-gray-700').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/movies**', {
        statusCode: 500,
        body: {
          error: 'Internal Server Error',
        },
      }).as('getMoviesError');

      cy.visit('http://localhost:3000/movies');
      cy.wait(10000);
      cy.contains('Erro ao carregar filmes').should('be.visible');
    });
  });
});
