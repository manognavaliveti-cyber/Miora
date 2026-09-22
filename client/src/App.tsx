import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { SplashPage } from './pages/SplashPage';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ProfileBuildChoicePage } from './pages/ProfileBuildChoicePage';
import { AddPhotosPage } from './pages/AddPhotosPage';
import { DatingPreferencesPage } from './pages/DatingPreferencesPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MatchesPage } from './pages/MatchesPage';
import { ChatListPage } from './pages/ChatListPage';
import { ChatPage } from './pages/ChatPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { BlockedUsersPage } from './pages/BlockedUsersPage';
import { WalletPage } from './pages/WalletPage';
import { PlayPage } from './pages/PlayPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { authService } from './services/authService';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashPage />;
      case 'welcome':
        return <WelcomePage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'profile-build-choice':
        return <ProfileBuildChoicePage />;
      case 'profile-setup':
        return <ProfileSetupPage />;
      case 'add-photos':
        return <AddPhotosPage />;
      case 'dating-preferences':
        return <DatingPreferencesPage />;
      case 'home':
      case 'discover':
        return <DiscoverPage />;
      case 'likes':
      case 'matches':
        return <MatchesPage />;
      case 'games':
      case 'play':
        return <PlayPage />;
      case 'wallet':
        return <WalletPage />;
      case 'chat-list':
        return <ChatListPage />;
      case 'chat':
        return (
          <>
            <div className="mobile-only chat-mobile-host" style={{ width: '100%' }}>
              <ChatPage />
            </div>
            <div className="desktop-only" style={{ width: '100%', height: '100%' }}>
              <ChatListPage />
            </div>
          </>
        );
      case 'my-profile':
        return <MyProfilePage />;
      case 'edit-profile':
        return <EditProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'blocked-users':
        return <BlockedUsersPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'admin': {
        const firebaseUser = authService.getCurrentUser();
        if (!firebaseUser) return <LoginPage />;
        return (
          <AdminPanel
            currentUser={{ uid: firebaseUser.uid, email: firebaseUser.email }}
            idToken={localStorage.getItem('miora_auth_token') || ''}
            onLogout={async () => { await authService.signOut(); setCurrentView('login'); }}
          />
        );
      }
      default:
        return <DiscoverPage />;
    }
  };

  if (currentView === 'admin') {
    const firebaseUser = authService.getCurrentUser();
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'filpflexteam@gmail.com').trim().toLowerCase();
    if (!firebaseUser || (firebaseUser.email || '').trim().toLowerCase() !== adminEmail) {
      return <LoginPage />;
    }
    return renderCurrentView();
  }

  return <AppShell>{renderCurrentView()}</AppShell>;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
