// User type
export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
}

class AuthService {
  private currentUser: User | null = null;

  // Check if user is authenticated
  isAuthenticated(): boolean {
    // In a real implementation, this would check for a valid token in local storage
    return !!this.currentUser;
  }

  // Get current user
  getCurrentUser(): User | null {
    // In a real implementation, this would fetch the user from the token
    return this.currentUser;
  }

  // Login with email and password
  async login(email: string, password: string): Promise<User> {
    // Call the backend API (to be implemented later)
    // For now, simulate a successful login with mock data
    if (email && password) {
      this.currentUser = {
        id: 'user123',
        email: email,
        username: email.split('@')[0],
        profilePicture: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Felix'
      };
      return this.currentUser;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // Register a new user
  async register(email: string, password: string, username: string): Promise<User> {
    // Call the backend API (to be implemented later)
    // For now, simulate a successful registration with mock data
    if (email && password && username) {
      this.currentUser = {
        id: 'user' + Math.floor(Math.random() * 1000),
        email: email,
        username: username,
        profilePicture: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`
      };
      return this.currentUser;
    } else {
      throw new Error('Invalid registration data');
    }
  }

  // Logout
  async logout(): Promise<void> {
    // Call the backend API if needed (to be implemented later)
    // For now, just clear the current user
    this.currentUser = null;
  }
}

// Export a singleton instance
const authService = new AuthService();
export default authService; 