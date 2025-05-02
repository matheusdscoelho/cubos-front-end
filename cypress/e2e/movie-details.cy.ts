describe('Movie Details Page', () => {
  beforeEach(() => {
    // Mock do token de autenticação
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token')
    })
  })

  describe('Successful Movie Load', () => {
    beforeEach(() => {
      // Mock da resposta da API com dados do filme
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 200,
        body: {
          id: '1',
          title: 'Teste Movie',
          description: 'Test movie description',
          releaseDate: '2024-12-31',
          duration: 120,
          budget: 1000000,
          image: 'https://placehold.co/800x400.png?text=Teste+Movie'
        }
      }).as('getMovie')

      cy.visit('http://localhost:3000/movies/1')
    })

    it('should display movie details correctly', () => {
      cy.wait('@getMovie')

      // Verifica título
      cy.contains('Teste Movie').should('be.visible')

      // Verifica data de lançamento
      cy.contains('Lançamento:').should('be.visible')
      cy.contains('30/12/2024').should('be.visible')

      // Verifica descrição
      cy.contains('Test movie description').should('be.visible')

      // Verifica duração e orçamento
      cy.contains('Duração: 120 min').should('be.visible')
      cy.contains('Orçamento: R$ 1.000.000').should('be.visible')

      // Verifica se a imagem está presente
      cy.get('img').should('have.attr', 'alt', 'Teste Movie')
    })

    it('should show edit button and navigate to edit page', () => {
      cy.wait('@getMovie')
      
      cy.contains('Editar')
        .should('be.visible')
        .click()

      cy.url().should('include', '/movies/1/edit')
    })
  })

  describe('Loading State', () => {
    it('should show loading state', () => {
      cy.intercept('GET', '**/api/movies/*', {
        delay: 1000,
        statusCode: 200,
        body: {
          id: '1',
          title: 'Teste Movie'
        }
      }).as('getMovieDelayed')

      cy.visit('http://localhost:3000/movies/1')
      cy.contains('Carregando filme...').should('be.visible')
      cy.wait('@getMovieDelayed')
    })
  })

  describe('Error Handling', () => {
    it('should redirect to not-found page when movie does not exist', () => {
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 404,
        body: {
          error: 'Movie not found'
        }
      }).as('getMovieError')

      cy.visit('http://localhost:3000/movies/999', {
        failOnStatusCode: false
      })

      cy.url().should('include', '/not-found')
    })

    it('should handle server errors', () => {
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 500,
        body: {
          error: 'Internal server error'
        }
      }).as('getMovieServerError')

      cy.visit('http://localhost:3000/movies/1', {
        failOnStatusCode: false
      })

      cy.url().should('include', '/not-found')
    })
  })

  describe('Image Fallback', () => {
    it('should show placeholder image when movie has no image', () => {
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 200,
        body: {
          id: '1',
          title: 'Teste Movie',
          description: 'Test movie description',
          releaseDate: '2024-01-01',
          duration: 120,
          budget: 1000000,
          image: null
        }
      }).as('getMovieNoImage')

      cy.visit('http://localhost:3000/movies/1')
      cy.wait('@getMovieNoImage')

      cy.get('img')
        .should('have.attr', 'src')
        .and('include', 'placehold.co')
    })
  })

  describe('Dark Mode', () => {
    it('should apply dark mode styles', () => {
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 200,
        body: {
          id: '1',
          title: 'Teste Movie'
        }
      }).as('getMovie')

      cy.visit('http://localhost:3000/movies/1')
      cy.get('html').invoke('addClass', 'dark')

      cy.get('div').first().should('have.class', 'dark:bg-gray-900')
      cy.get('.bg-zinc-900').should('exist')
    })
  })

  describe('Responsive Design', () => {
    it('should adjust layout for mobile viewport', () => {
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 200,
        body: {
          id: '1',
          title: 'Teste Movie'
        }
      }).as('getMovie')

      // Define viewport para mobile
      cy.viewport('iphone-6')
      cy.visit('http://localhost:3000/movies/1')
      cy.wait('@getMovie')

      // Verifica se o padding é menor em telas menores
      cy.get('.p-6').should('exist')
    })

    it('should adjust layout for desktop viewport', () => {
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 200,
        body: {
          id: '1',
          title: 'Teste Movie'
        }
      }).as('getMovie')

      // Define viewport para desktop
      cy.viewport(1280, 720)
      cy.visit('http://localhost:3000/movies/1')
      cy.wait('@getMovie')

      // Verifica se o padding é maior em telas maiores
      cy.get('.sm\\:p-8').should('exist')
    })
  })
})