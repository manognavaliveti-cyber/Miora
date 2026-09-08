import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { SplashPage } from './pages/SplashPage';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { AddPhotosPage } from './pages/AddPhotosPage';
import { DatingPreferencesPage } from './pages/DatingPreferencesPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ChatListPage } from './pages/ChatListPage';
import { ChatPage } from './pages/ChatPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { BlockedUsersPage } from './pages/BlockedUsersPage';
import { WalletPage } from './pages/WalletPage';
import { PlayPage } from './pages/PlayPage';
import { RoomsPage } from './pages/RoomsPage';
import { FeedPage } from './pages/FeedPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

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
      case 'profile-setup':
        return <ProfileSetupPage />;
      case 'add-photos':
        return <AddPhotosPage />;
      case 'dating-preferences':
        return <DatingPreferencesPage />;
      case 'discover':
      case 'matches':
        return <DiscoverPage />;
      case 'feed':
        return <FeedPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'play':
        return <PlayPage />;
      case 'wallet':
        return <WalletPage />;
      case 'chat-list':
        return <ChatListPage />;
      case 'chat':
        return (
          <>
            <div className="desktop-only" style={{ width: '100%' }}>
              <ChatListPage />
            </div>
            <div className="mobile-only" style={{ width: '100%', height: '100%' }}>
              <ChatPage />
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
      default:
        return <DiscoverPage />;
    }
  };

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
