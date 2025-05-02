describe('Login Page', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login');
    cy.wait(1000); // Wait for the page to load
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty form submission', () => {
      // Submit empty form
      cy.get('form').submit();

      // Check for validation error messages
      cy.contains('E-mail inválido').should('be.visible');
      cy.contains('A senha deve ter pelo menos 6 caracteres').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      // Type invalid email
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type('validpassword123');
      cy.get('form').submit();

      // Check for email validation error
      cy.contains('E-mail inválido').should('be.visible');
    });

    it('should show validation error for short password', () => {
      // Type valid email but short password
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('12345');
      cy.get('form').submit();

      // Check for password validation error
      cy.contains('A senha deve ter pelo menos 6 caracteres').should('be.visible');
    });
  });

  describe('Login Functionality', () => {
    it('should successfully login with valid credentials', () => {
      // Intercepta a requisição de login
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token'
        }
      }).as('loginRequest')
    
      // Preenche as credenciais
      cy.get('input[type="email"]').type('teste@teste.com')
      cy.get('input[type="password"]').type('Baltimore100#')
    
      // Clica no botão de submit
      cy.get('button[type="submit"]').click()
    
      // Espera a requisição
      cy.wait('@loginRequest')
    
      // Verifica o localStorage usando should
      cy.window().then((win) => {
        cy.wrap(win.localStorage.getItem('token')).should('exist');
      })
    
      // Verifica o redirecionamento
      cy.url().should('include', '/movies')
    })

    it('should show error message on failed login', () => {
      // Intercept the login API request with error
      cy.intercept('POST', '/auth/login', {
        statusCode: 401,
        body: {
          error: 'Credenciais inválidas',
        },
      }).as('loginRequest');

      // Fill in credentials
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('wrongpassword');

      // Submit form
      cy.get('form').submit();

      // Wait for API request
      cy.wait('@loginRequest');

      // Check for error message
      cy.contains('Credenciais inválidas').should('be.visible');
    });

    it('should show loading state while logging in', () => {
      // Intercept the login API request with delay
      cy.intercept('POST', '/api/login', {
        delay: 1000,
        statusCode: 200,
        body: {
          data: {
            token: 'fake-jwt-token',
          },
        },
      }).as('loginRequest');

      // Fill in credentials
      cy.get('input[type="email"]').type('teste@teste.com');
      cy.get('input[type="password"]').type('Baltimore100#');

      // Submit form
      cy.get('form').submit();

      // Check for loading state
      cy.contains('Entrando...').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page when clicking register link', () => {
      cy.contains('Cadastre-se').click();
      cy.url().should('include', '/register');
    });

    it('should redirect to movies page if already logged in', () => {
      // Set token in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token');
      });

      // Visit login page
      cy.visit('/login');

      // Should be redirected to movies page
      cy.url().should('include', '/movies');
    });
  });

  describe('Dark Mode', () => {
    it('should render dark mode styles when dark mode is enabled', () => {
      // Enable dark mode
      cy.get('html').invoke('addClass', 'dark');

      // Check for dark mode specific classes
      cy.get('form').should('have.class', 'dark:bg-gray-800');
      cy.get('input[type="email"]').should('have.class', 'dark:bg-gray-700');
      cy.get('input[type="password"]').should('have.class', 'dark:bg-gray-700');
    });
  });
});
