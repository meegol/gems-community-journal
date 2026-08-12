'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CommunityFeedWidget } from '@/components/CommunityFeedWidget';
import { TradeEntryModal } from '@/components/TradeEntryModal';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';
import { CSVModal } from '@/components/CSVModal';
import { fetchPostsAPI, fetchTradesAPI, savePostAPI, saveTradeAPI } from '@/lib/api-client';
import { getStoredUser, saveUser, toggleLikePost } from '@/lib/storage';
import { CommunityPost, Trade, UserProfile } from '@/lib/types';

export default function FeedPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'u-admin-gatie',
    name: 'GATIETRADES',
    email: 'gatietrades@gemsjournal.io',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GATIETRADES',
    isLoggedIn: true,
    role: 'admin',
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isNewTradeModalOpen, setIsNewTradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    fetchTradesAPI().then((data) => setTrades(data));
    fetchPostsAPI().then((data) => setPosts(data));
  }, []);

  const handleLikePost = (postId: string) => {
    const updated = toggleLikePost(postId);
    setPosts(updated);
  };

  const handleCreatePost = async (newPost: CommunityPost) => {
    const updated = await savePostAPI(newPost);
    setPosts(updated);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pb-16">
      
      <Navbar
        user={user}
        onOpenNewTrade={() => setIsNewTradeModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCSVModal={() => setIsCSVModalOpen(true)}
        onLogout={() => {
          saveUser({ ...user, isLoggedIn: false });
          setUser({ ...user, isLoggedIn: false });
        }}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <CommunityFeedWidget
          posts={posts}
          user={user}
          onLikePost={handleLikePost}
          onCreatePost={handleCreatePost}
        />
      </main>

      <TradeEntryModal
        isOpen={isNewTradeModalOpen}
        onClose={() => setIsNewTradeModalOpen(false)}
        onSaveTrade={async (t) => {
          await saveTradeAPI(t);
          const updated = await fetchTradesAPI();
          setTrades(updated);
        }}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(u) => {
          setUser(u);
          saveUser(u);
        }}
      />

      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        trades={trades}
        onImportTrades={async (imported) => {
          for (const t of imported) {
            await saveTradeAPI(t);
          }
          const updated = await fetchTradesAPI();
          setTrades(updated);
        }}
      />

    </div>
  );
}
