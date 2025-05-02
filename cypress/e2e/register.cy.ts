// cypress/e2e/register.cy.ts

describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
    cy.wait(1000); // Wait for the page to load
    cy.clearLocalStorage();
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty form submission', () => {
      cy.get('form').submit();

      cy.contains('Nome é obrigatório').should('be.visible');
      cy.contains('E-mail inválido').should('be.visible');
      cy.contains('Senha deve ter no mínimo 6 caracteres').should('be.visible');
    });

    it('should show error when passwords do not match', () => {
      cy.get('input[name="name"]').type('Teste Usuario');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha456');
      cy.get('form').submit();

      cy.contains('As senhas não coincidem').should('be.visible');
    });

    it('should show error for invalid email format', () => {
      cy.get('input[name="email"]').type('emailinvalido');
      cy.get('form').submit();

      cy.contains('E-mail inválido').should('be.visible');
    });

    it('should show error for short password', () => {
      cy.get('input[name="password"]').type('12345');
      cy.get('form').submit();

      cy.contains('Senha deve ter no mínimo 6 caracteres').should('be.visible');
    });
  });

  describe('Registration Process', () => {
    it('should successfully register and login a new user', () => {
      // Intercepta a requisição de registro
      cy.intercept('POST', '**/auth/register', {
        statusCode: 200,
        body: {
          message: 'User registered successfully',
        },
      }).as('registerRequest');

      // Intercepta a requisição de login após registro
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
        },
      }).as('loginRequest');

      // Preenche o formulário
      cy.get('input[name="name"]').type('Teste Usuario');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');

      // Submete o formulário
      cy.get('button[type="submit"]').click();

      // Espera as requisições
      cy.wait('@registerRequest');
      cy.wait('@loginRequest');

      // Verifica se o token foi salvo
      cy.window().should((win) => {
        const token = win.localStorage.getItem('token');
        expect(token).to.equal('fake-jwt-token');
      });

      // Verifica o redirecionamento
      cy.url().should('include', '/movies');
    });

    it('should show error message when registration fails', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 400,
        body: {
          error: 'Email already exists',
        },
      }).as('failedRegister');

      cy.get('input[name="name"]').type('Teste Usuario');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');
      cy.get('button[type="submit"]').click();

      cy.wait('@failedRegister');
      cy.contains('Email already exists').should('be.visible');
      cy.url().should('include', '/register');
    });

    it('should show loading state during registration', () => {
      cy.intercept('POST', '**/auth/register', {
        delay: 1000,
        statusCode: 200,
        body: {
          message: 'User registered successfully',
        },
      }).as('delayedRegister');

      cy.intercept('POST', '**/auth/login', {
        delay: 500,
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
        },
      }).as('delayedLogin');

      cy.get('input[name="name"]').type('Teste Usuario');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');
      cy.get('button[type="submit"]').click();

      // Verifica o estado de loading
      cy.contains('Registrando...').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');

      cy.wait(['@delayedRegister', '@delayedLogin']);
      cy.url().should('include', '/movies');
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page when clicking login link', () => {
      cy.contains('Logar').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Dark Mode', () => {
    it('should render dark mode styles when dark mode is enabled', () => {
      // Enable dark mode
      cy.get('html').invoke('addClass', 'dark');

      // Check for dark mode specific classes
      cy.get('div').should('have.class', 'dark:bg-gray-800');
      cy.get('input[name="name"]').should('have.class', 'dark:bg-gray-700');
      cy.get('input[name="email"]').should('have.class', 'dark:bg-gray-700');
      cy.get('input[name="password"]').should('have.class', 'dark:bg-gray-700');
      cy.get('input[name="confirmPassword"]').should('have.class', 'dark:bg-gray-700');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '**/auth/register', {
        forceNetworkError: true,
      }).as('networkError');

      cy.get('input[name="name"]').type('Teste Usuario');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');
      cy.get('button[type="submit"]').click();

      cy.contains('Erro ao fazer login').should('be.visible');
    });

    it('should handle server errors gracefully', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 500,
        body: {
          error: 'Internal server error',
        },
      }).as('serverError');

      cy.get('input[name="name"]').type('Teste Usuario');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');
      cy.get('button[type="submit"]').click();

      cy.contains('Internal server error').should('be.visible');
    });
  });
});
