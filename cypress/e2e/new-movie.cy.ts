// cypress/e2e/new-movie.cy.ts

describe('New Movie Page', () => {
    beforeEach(() => {
      // Mock do token de autenticação
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token')
      })
      cy.visit('http://localhost:3000/movies/new')
      cy.wait(1000) // Espera o carregamento da página
    })
  
    describe('Form Validation', () => {
      it('should show validation errors for empty form submission', () => {
        cy.get('form').submit()
  
        cy.contains('Título é obrigatório').should('be.visible')
        cy.contains('Descrição é obrigatória').should('be.visible')
        cy.contains('Data é obrigatória').should('be.visible')
        cy.contains('Duração em minutos').should('be.visible')
        cy.contains('Orçamento deve ser positivo').should('be.visible')
      })
  
      it('should validate individual fields', () => {
        cy.get('form').submit()
        // Título
        cy.get('input[name="title"]').type('a').clear()
        cy.contains('Título é obrigatório').should('be.visible')
  
        // Descrição
        cy.get('textarea[name="description"]').type('a').clear()
        cy.contains('Descrição é obrigatória').should('be.visible')
  
        // Data
        cy.get('input[type="date"]').type('2024-01-01').clear()
        cy.contains('Data é obrigatória').should('be.visible')
  
        // Duração
        cy.get('input[name="duration"]').type('0')
        cy.contains('Duração em minutos').should('be.visible')
  
        // Orçamento
        cy.get('input[name="budget"]').type('-1')
        cy.contains('Orçamento deve ser positivo').should('be.visible')
      })
    })
  
    describe('Form Submission', () => {
      it('should successfully create a new movie', () => {
        // Intercepta a requisição de criação
        cy.intercept('POST', '**/api/movies', {
          statusCode: 200,
          body: {
            id: 1,
            title: 'Teste Movie',
            description: 'Test Description',
            releaseDate: '2024-01-01',
            duration: 120,
            budget: 1000000
          }
        }).as('createMovie')
  
        // Preenche o formulário
        cy.get('input[name="title"]').type('Teste Movie')
        cy.get('textarea[name="description"]').type('Test Description')
        cy.get('input[type="date"]').type('2024-01-01')
        cy.get('input[name="duration"]').type('120')
        cy.get('input[name="budget"]').type('1000000')
  
        // Simula upload de imagem
        cy.get('input[type="file"]').attachFile({
          filePath: 'test-image.jpg',
          mimeType: 'image/jpeg',
          encoding: 'base64'
        })
  
        // Submete o formulário
        cy.get('button[type="submit"]').click()
  
        // Espera a requisição e verifica o redirecionamento
        cy.wait('@createMovie')
        cy.url().should('include', '/movies')
  
        // Verifica se a mensagem de sucesso aparece
        cy.contains('Filme criado com sucesso!').should('be.visible')
      })
  
      it('should handle API errors', () => {
        cy.intercept('POST', '**/api/movies', {
          statusCode: 400,
          body: {
            error: 'Erro ao criar filme'
          }
        }).as('createMovieError')
  
        // Preenche o formulário
        cy.get('input[name="title"]').type('Teste Movie')
        cy.get('textarea[name="description"]').type('Test Description')
        cy.get('input[type="date"]').type('2024-01-01')
        cy.get('input[name="duration"]').type('120')
        cy.get('input[name="budget"]').type('1000000')
  
        cy.get('button[type="submit"]').click()
  
        // Verifica se a mensagem de erro aparece
        cy.contains('Erro ao criar filme').should('be.visible')
      })
    })
  
    describe('Image Preview', () => {
      it('should show image preview when file is selected', () => {
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
  
    describe('Loading State', () => {
      it('should show loading state during submission', () => {
        cy.intercept('POST', '**/api/movies', {
          delay: 1000,
          statusCode: 200,
          body: {
            id: 1,
            title: 'Teste Movie'
          }
        }).as('createMovieDelayed')
  
        // Preenche o formulário
        cy.get('input[name="title"]').type('Teste Movie')
        cy.get('textarea[name="description"]').type('Test Description')
        cy.get('input[type="date"]').type('2024-01-01')
        cy.get('input[name="duration"]').type('120')
        cy.get('input[name="budget"]').type('1000000')
  
        cy.get('button[type="submit"]').click()
  
        // Verifica o estado de loading
        cy.contains('Salvando...').should('be.visible')
        cy.get('button[type="submit"]').should('be.disabled')
      })
    })
  
    describe('Dark Mode', () => {
      it('should apply dark mode styles', () => {
        cy.get('html').invoke('addClass', 'dark')
  
        cy.get('input[name="title"]').should('have.class', 'dark:bg-gray-700')
        cy.get('textarea[name="description"]').should('have.class', 'dark:bg-gray-700')
        cy.get('label').first().should('have.class', 'dark:text-gray-300')
      })
    })
  })