// cypress/e2e/edit-movie.cy.ts

describe('Edit Movie Page', () => {
    beforeEach(() => {
      // Mock do token de autenticação
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token')
      })
  
      // Mock da resposta da API com dados do filme
      cy.intercept('GET', '**/api/movies/*', {
        statusCode: 200,
        body: {
          id: '1',
          title: 'Filme Original',
          description: 'Descrição original',
          releaseDate: '2024-01-01T00:00:00.000Z',
          duration: 120,
          budget: 1000000,
          image: 'https://placehold.co/400x400.png'
        }
      }).as('getMovie')
  
      cy.visit('http://localhost:3000/movies/1/edit')
      cy.wait('@getMovie')
    })
  
    describe('Initial Load', () => {
      it('should load movie data into form', () => {
        cy.get('input[name="title"]').should('have.value', 'Filme Original')
        cy.get('textarea[name="description"]').should('have.value', 'Descrição original')
        cy.get('input[name="releaseDate"]').should('have.value', '2024-01-01')
        cy.get('input[name="duration"]').should('have.value', '120')
        cy.get('input[name="budget"]').should('have.value', '1000000')
      })
  
      it('should display current movie image', () => {
        cy.get('img[alt="Imagem atual"]')
          .should('be.visible')
          .should('have.attr', 'src')
          .and('include', 'placehold.co')
      })
  
      it('should show back button', () => {
        cy.contains('Cancelar').should('be.visible')
      })
    })
  
    describe('Form Validation', () => {
      it('should show validation errors for empty fields', () => {
        // Limpa todos os campos
        cy.get('input[name="title"]').clear()
        cy.get('textarea[name="description"]').clear()
        cy.get('input[name="releaseDate"]').clear()
        cy.get('input[name="duration"]').clear()
        cy.get('input[name="budget"]').clear()
  
        cy.get('form').submit()
  
        // Verifica mensagens de erro
        cy.contains('String must contain at least 1 character(s)').should('be.visible')
      })
  
      it('should validate numeric fields', () => {
        cy.get('input[name="duration"]').clear().type('-1')
        cy.get('input[name="budget"]').clear().type('-1')
        cy.get('form').submit()
  
        cy.contains('Number must be greater than or equal to 1').should('be.visible')
        cy.contains('Number must be greater than or equal to 0').should('be.visible')
      })
    })
  
    describe('Image Upload', () => {
      it('should show preview when new image is selected', () => {
        // Simula upload de imagem
        cy.get('input[type="file"]').attachFile({
          filePath: 'test-image.jpg',
          mimeType: 'image/jpeg',
          encoding: 'base64'
        })
  
        // Verifica se a preview aparece
        cy.get('img[alt="Preview"]').should('be.visible')
      })
    })
  
    describe('Form Submission', () => {
      it('should successfully update movie', () => {
        // Mock da requisição de atualização
        cy.intercept('PUT', '**/api/movies/*', {
          statusCode: 200,
          body: {
            id: '1',
            title: 'Filme Atualizado'
          }
        }).as('updateMovie')
  
        // Atualiza campos
        cy.get('input[name="title"]').clear().type('Filme Atualizado')
        cy.get('textarea[name="description"]').clear().type('Nova descrição')
        cy.get('input[name="duration"]').clear().type('150')
        cy.get('input[name="budget"]').clear().type('2000000')
  
        // Submete o formulário
        cy.get('button[type="submit"]').click()
  
        // Espera a requisição e verifica redirecionamento
        cy.wait('@updateMovie')
        cy.contains('Filme editado com sucesso!').should('be.visible')
        cy.url().should('include', '/movies/1')
      })
  
      it('should handle API errors', () => {
        cy.intercept('PUT', '**/api/movies/*', {
          statusCode: 400,
          body: {
            error: 'Erro ao atualizar filme'
          }
        }).as('updateMovieError')
  
        cy.get('button[type="submit"]').click()
        cy.contains('Erro ao atualizar filme').should('be.visible')
      })
  
      it('should show loading state during submission', () => {
        cy.intercept('PUT', '**/api/movies/*', {
          delay: 1000,
          statusCode: 200,
          body: {
            id: '1',
            title: 'Filme Atualizado'
          }
        }).as('updateMovieDelayed')
  
        cy.get('button[type="submit"]').click()
        cy.contains('Salvando...').should('be.visible')
        cy.get('button[type="submit"]').should('be.disabled')
      })
    })
  
    describe('Navigation', () => {
      it('should navigate back when cancel is clicked', () => {
        cy.contains('Cancelar').click()
        cy.url().should('not.include', '/movies/1/edit')
      })
    })
  
    describe('Error States', () => {
      it('should handle movie not found', () => {
        cy.intercept('GET', '**/api/movies/*', {
          statusCode: 404,
          body: {
            error: 'Movie not found'
          }
        }).as('getMovieError')
  
        cy.visit('http://localhost:3000/movies/999/edit')
        cy.contains('Filme não encontrado.').should('be.visible')
      })
  
      it('should handle loading state', () => {
        cy.intercept('GET', '**/api/movies/*', {
          delay: 1000,
          statusCode: 200,
          body: {
            id: '1',
            title: 'Filme Original'
          }
        }).as('getMovieDelayed')
  
        cy.visit('http://localhost:3000/movies/1/edit')
        cy.contains('Carregando filme...').should('be.visible')
      })
    })
  
    describe('Responsive Design', () => {
      it('should adjust layout for mobile', () => {
        cy.viewport('iphone-6')
        cy.get('.grid-cols-1').should('exist')
      })
  
      it('should adjust layout for desktop', () => {
        cy.viewport(1280, 720)
        cy.get('.md\\:grid-cols-2').should('exist')
      })
    })
  })