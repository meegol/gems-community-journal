'use client';

import React, { useState } from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Camera, 
  Clock, 
  Heart, 
  MessageSquare, 
  Plus, 
  Send, 
  Share2, 
  Sparkles, 
  Upload, 
  User, 
  X 
} from 'lucide-react';
import { formatCurrency } from '../lib/trade-calculator';
import { CommunityPost, DirectionType, InstrumentType, UserProfile } from '../lib/types';

interface CommunityFeedWidgetProps {
  posts: CommunityPost[];
  user: UserProfile;
  onLikePost: (postId: string) => void;
  onCreatePost: (post: CommunityPost) => void;
}

export function CommunityFeedWidget({
  posts,
  user,
  onLikePost,
  onCreatePost,
}: CommunityFeedWidgetProps) {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [title, setTitle] = useState('');
  const [instrument, setInstrument] = useState<InstrumentType>('NQ');
  const [direction, setDirection] = useState<DirectionType>('Long');
  const [setupTag, setSetupTag] = useState('Liquidity Sweep + FVG');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScreenshot(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !notes.trim()) {
      alert('Please enter a title and post description.');
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      anonymizedHandle: `@${user.name.replace(/\s+/g, '')}`,
      userAvatar: user.avatar,
      date: new Date().toISOString().slice(0, 10),
      title,
      instrument,
      direction,
      realizedPnL: 2400.0,
      realizedRR: 3.0,
      screenshots: screenshot ? [screenshot] : [],
      setupTag,
      notes,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };

    onCreatePost(newPost);
    setIsCreatingPost(false);
    setTitle('');
    setNotes('');
    setScreenshot('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl">
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
            Community Trade Feed & Setup Discussions
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Share chart screenshots, ICT/Price action setups, and daily market takeaways with fellow traders
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Publish Trade Post</span>
        </button>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-xl space-y-4 transition-all hover:border-emerald-500/30"
          >
            {/* Author Row */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="h-10 w-10 rounded-full border border-emerald-500/40 bg-slate-800"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)]">
                    {post.userName}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                    <span>{post.anonymizedHandle}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                    post.direction === 'Long'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {post.direction === 'Long' ? (
                    <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 stroke-[3]" />
                  )}
                  <span>{post.instrument} {post.direction}</span>
                </span>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-emerald-400">
                  {post.setupTag}
                </span>
              </div>
            </div>

            {/* Title & Notes */}
            <div>
              <h3 className="text-base font-extrabold text-[var(--text-primary)] mb-2">
                {post.title}
              </h3>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                {post.notes}
              </p>
            </div>

            {/* Screenshot Attachment */}
            {post.screenshots && post.screenshots.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-black max-h-[420px] flex items-center justify-center">
                <img
                  src={post.screenshots[0]}
                  alt={post.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Footer Bar: Likes & Comments */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    post.isLiked ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
                  <span>{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>

                <div className="flex items-center gap-1.5 font-semibold">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>

              {post.realizedRR && (
                <span className="font-extrabold text-emerald-400">
                  Result: +{post.realizedRR}R (+{formatCurrency(post.realizedPnL || 0)})
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Create Post Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                Create Community Post
              </h3>
              <button
                onClick={() => setIsCreatingPost(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clean NQ Liquidity Sweep & 1m FVG Retest"
                  className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">
                    Instrument
                  </label>
                  <select
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  >
                    <option value="NQ">NQ</option>
                    <option value="ES">ES</option>
                    <option value="MNQ">MNQ</option>
                    <option value="MES">MES</option>
                    <option value="YM">YM</option>
                    <option value="MYM">MYM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">
                    Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as DirectionType)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  >
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">
                    Setup Tag
                  </label>
                  <input
                    type="text"
                    value={setupTag}
                    onChange={(e) => setSetupTag(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Chart Screenshot
                </label>
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] cursor-pointer hover:border-emerald-500">
                  <Upload className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {screenshot ? 'Screenshot Attached ✓' : 'Upload Chart Image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">
                  Setup Breakdown & Lessons
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain why you took this trade, key levels, entry triggers, and takeaways..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black shadow-md shadow-emerald-500/20"
                >
                  Publish Post
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
