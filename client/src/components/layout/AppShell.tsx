import React, { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';
import { Toast } from '../common/Toast';
import { MutualMatchModal } from '../matches/MutualMatchModal';
import { ProfileDetailsModal } from '../profile/ProfileDetailsModal';
import { ReportUserModal } from '../safety/ReportUserModal';
import { CallModal } from '../calls/CallModal';
import { IncomingCallModal } from '../calls/IncomingCallModal';
import { GiftModal } from '../gifts/GiftModal';
import { GiftAnimationOverlay } from '../gifts/GiftAnimationOverlay';
import { NotificationsDrawer } from '../notifications/NotificationsDrawer';
import { CreateBottomSheet } from './CreateBottomSheet';
import { SearchModal } from '../search/SearchModal';
import { CreatePostModal } from '../feed/CreatePostModal';
import { CreateStatusModal } from '../feed/CreateStatusModal';
import { StatusViewerModal } from '../feed/StatusViewerModal';
import { StatusNoteModal } from '../feed/StatusNoteModal';
import { FollowersModal } from '../profile/FollowersModal';
import { SharePostModal } from '../feed/SharePostModal';
import { EditPostModal } from '../feed/EditPostModal';
import { CommentSheet } from '../feed/CommentSheet';
import { UpgradeModal } from '../subscription/UpgradeModal';
import { BoostModal } from '../subscription/BoostModal';
import { WhoLikedMeModal } from '../subscription/WhoLikedMeModal';
import { AdvancedFilterModal } from '../discover/AdvancedFilterModal';
import { DiscountPromoModal } from '../subscription/DiscountPromoModal';
import { RechargeModal } from '../wallet/RechargeModal';
import { VipDiscountPromoModal } from '../subscription/VipDiscountPromoModal';
import { CallPaymentModal } from '../calls/CallPaymentModal';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    currentView,
    isDiscountModalOpen,
    isWalletPackModalOpen,
    closeWalletPackModal,
    walletPackContext,
    closeDiscountModal,
    isVipDiscountModalOpen,
    closeVipDiscountModal,
    isCallPaymentModalOpen,
    closeCallPaymentModal,
    callPaymentPartner,
    callPaymentType,
    handleCallPaymentSuccess
  } = useApp();

  const isAuthOrOnboarding = [
    'splash',
    'welcome',
    'login',
    'signup',
    'profile-setup',
    'add-photos',
    'dating-preferences',
    'terms',
    'privacy'
  ].includes(currentView);

  const isChat = currentView === 'chat';

  // Bottom navigation is displayed on all main app pages (excluding auth/onboarding & active chat)
  const showBottomNav = !isAuthOrOnboarding && !isChat;

  // Secondary sub-pages show back button in TopHeader
  const isSecondaryPage = [
    'edit-profile',
    'settings',
    'blocked-users',
    'notifications'
  ].includes(currentView);

  return (
    <div className="app-viewport-wrapper">
      {/* Organic curved lines & soft pink ambient orbs */}
      <div className="organic-bg-decoration">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <svg className="bg-curved-lines" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-50 180C280 320 420 80 800 220C1180 360 1280 180 1520 280"
            stroke="rgba(244, 63, 94, 0.08)"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M-100 680C220 540 450 780 880 620C1250 480 1380 720 1580 580"
            stroke="rgba(251, 113, 133, 0.08)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <circle cx="1180" cy="220" r="14" fill="rgba(244, 63, 94, 0.12)" />
          <circle cx="280" cy="620" r="18" fill="rgba(251, 113, 133, 0.12)" />
          <circle cx="920" cy="740" r="10" fill="rgba(225, 29, 72, 0.1)" />
        </svg>
      </div>

      {/* Desktop Navigation (Full-width sticky header on desktop >= 1024px for in-app views) */}
      {!isAuthOrOnboarding && <DesktopNav />}

      <div className="app-container">
        {/* Global Toast */}
        <Toast />

        {/* Mobile Top Header (Rendered on mobile < 768px / tablet) */}
        {!isAuthOrOnboarding && !isChat && (
          <div className="mobile-only" style={{ width: '100%' }}>
            <TopHeader
              title={
                currentView === 'likes' || currentView === 'matches'
                  ? 'Matches & Likes'
                  : currentView === 'chat-list'
                  ? 'MIORA Chats'
                  : currentView === 'feed'
                  ? 'MIORA Feed'
                  : currentView === 'rooms'
                  ? 'Dating Rooms'
                  : currentView === 'games' || currentView === 'play'
                  ? 'MIORA Play'
                  : currentView === 'wallet'
                  ? 'MIORA Wallet'
                  : currentView === 'my-profile'
                  ? 'My Profile'
                  : currentView === 'edit-profile'
                  ? 'Edit Profile'
                  : currentView === 'settings'
                  ? 'Settings'
                  : currentView === 'blocked-users'
                  ? 'Blocked Profiles'
                  : undefined
              }
              showBack={isSecondaryPage}
              rightAction={currentView === 'home' || currentView === 'discover' ? 'filters' : 'none'}
            />
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className={`app-content ${isChat ? 'chat-page-active' : currentView === 'chat-list' ? 'chat-list-page-active' : ''}`}>{children}</main>

        {/* Global Modals & Fullscreen Overlays */}
        <MutualMatchModal />
        <ProfileDetailsModal />
        <ReportUserModal />
        <CallModal />
        <IncomingCallModal />
        <CallPaymentModal
          isOpen={isCallPaymentModalOpen}
          onClose={closeCallPaymentModal}
          partner={callPaymentPartner}
          callType={callPaymentType}
          onPaymentSuccess={handleCallPaymentSuccess}
        />
        <GiftModal />
        <GiftAnimationOverlay />
        <NotificationsDrawer />

        {/* Social & Creator Modals */}
        <CreateBottomSheet />
        <SearchModal />
        <CreatePostModal />
        <CreateStatusModal />
        <StatusViewerModal />
        <StatusNoteModal />
        <FollowersModal />
        <SharePostModal />
        <EditPostModal />
        <CommentSheet />

        {/* Monetization & Subscriptions Modals */}
        <DiscountPromoModal isOpen={isDiscountModalOpen} onClose={closeDiscountModal} />
        {/* Global 'Add money' popup: chat, games, calls - anywhere the wallet runs low */}
        <RechargeModal
          isOpen={isWalletPackModalOpen}
          onClose={closeWalletPackModal}
          requiredAmount={walletPackContext.requiredAmount}
          reason={walletPackContext.reason}
        />
        <VipDiscountPromoModal isOpen={isVipDiscountModalOpen} onClose={closeVipDiscountModal} />
        <UpgradeModal />
        <BoostModal />
        <WhoLikedMeModal />
        <AdvancedFilterModal />
      </div>

      {/* Mobile Fixed Bottom Navigation (Locked at viewport bottom on mobile < 768px) */}
      {showBottomNav && (
        <div
          className="mobile-only mobile-bottom-nav-wrapper"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 9999,
            boxSizing: 'border-box'
          }}
        >
          <BottomNav />
        </div>
      )}
    </div>
  );
};
