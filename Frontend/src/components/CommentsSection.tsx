import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ThumbsUp, Reply, Send, Loader2, LogIn } from 'lucide-react';
import { Comment, UserProfile } from '../types';
import { readerApi, ApiComment } from '../api/client';

interface CommentsSectionProps {
  articleId: string;
  readerUser: UserProfile | null;
  onLoginRequired: () => void;
  showToast: (msg: string) => void;
}

function mapComment(c: ApiComment): Comment {
  return {
    ...c,
    replies: c.replies?.map(mapComment) || [],
  };
}

function updateCommentInTree(list: Comment[], id: string, updater: (c: Comment) => Comment): Comment[] {
  return list.map((c) => {
    if (c.id === id) return updater(c);
    if (c.replies?.length) {
      return { ...c, replies: updateCommentInTree(c.replies, id, updater) };
    }
    return c;
  });
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  readerUser: UserProfile | null;
  onLoginRequired: () => void;
  onLike: (id: string) => void;
  onReply: (parentId: string, content: string) => Promise<void>;
  likingId: string | null;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth = 0,
  readerUser,
  onLoginRequired,
  onLike,
  onReply,
  likingId,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!readerUser) {
      onLoginRequired();
      return;
    }
    setSubmitting(true);
    try {
      await onReply(comment.id, replyText.trim());
      setReplyText('');
      setShowReplyBox(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={depth > 0 ? 'ml-4 sm:ml-8 mt-3 pl-4 border-l-2 border-[#7d998a]/30' : ''}>
      <div className="p-4 sm:p-5 rounded-2xl bg-[#fafbf8] dark:bg-[#262b32] border border-[#e2e6de] dark:border-[#333a44]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <img
              src={comment.authorAvatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#e2e6de] dark:border-[#333a44]"
            />
            <div>
              <span className="text-xs font-semibold text-[#1e2228] dark:text-white block">
                {comment.authorName}
              </span>
              <span className="text-[10px] font-mono text-[#95a5a8]">{comment.createdAt}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#4b585b] dark:text-[#c4cec9] leading-relaxed mb-3 whitespace-pre-wrap">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => {
              if (!readerUser) {
                onLoginRequired();
                return;
              }
              onLike(comment.id);
            }}
            disabled={likingId === comment.id}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
              comment.isLikedByMe
                ? 'text-[#de7c68] bg-[#fbeee9] dark:bg-[#de7c68]/20'
                : 'text-[#4b585b] dark:text-[#95a5a8] hover:text-[#de7c68] hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228]'
            }`}
          >
            {likingId === comment.id ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLikedByMe ? 'fill-current' : ''}`} />
            )}
            <span>{comment.likes}</span>
          </button>

          <button
            onClick={() => {
              if (!readerUser) {
                onLoginRequired();
                return;
              }
              setShowReplyBox(!showReplyBox);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[#4b585b] dark:text-[#95a5a8] hover:text-[#1e2228] dark:hover:text-white hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228] transition-colors"
          >
            <Reply className="w-3.5 h-3.5" />
            Reply
          </button>
        </div>

        {showReplyBox && readerUser && (
          <form onSubmit={handleReplySubmit} className="mt-4 pt-3 border-t border-[#e2e6de] dark:border-[#333a44]">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.authorName}...`}
              className="w-full bg-[#f3f5f0] dark:bg-[#1e2228] rounded-xl px-3 py-2 text-sm text-[#1e2228] dark:text-white border border-[#e2e6de] dark:border-[#333a44] focus:outline-none focus:ring-2 focus:ring-[#7d998a] resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowReplyBox(false)}
                className="px-3 py-1.5 text-xs text-[#95a5a8] hover:text-[#1e2228] dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyText.trim() || submitting}
                className="px-4 py-1.5 rounded-lg bg-[#637e6f] text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          readerUser={readerUser}
          onLoginRequired={onLoginRequired}
          onLike={onLike}
          onReply={onReply}
          likingId={likingId}
        />
      ))}
    </div>
  );
};

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  articleId,
  readerUser,
  onLoginRequired,
  showToast,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      const { comments: data, total: t } = await readerApi.getComments(articleId);
      setComments(data.map(mapComment));
      setTotal(t);
    } catch {
      showToast('Could not load comments');
    } finally {
      setLoading(false);
    }
  }, [articleId, showToast]);

  useEffect(() => {
    setLoading(true);
    loadComments();
  }, [loadComments]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!readerUser) {
      onLoginRequired();
      return;
    }
    setPosting(true);
    try {
      await readerApi.postComment(articleId, newComment.trim());
      setNewComment('');
      showToast('Comment posted!');
      await loadComments();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      await readerApi.postComment(articleId, content, parentId);
      showToast('Reply posted!');
      await loadComments();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to post reply');
    }
  };

  const handleLike = async (commentId: string) => {
    setLikingId(commentId);
    try {
      const { liked, likes, comment } = await readerApi.likeComment(commentId);
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (c) => ({
          ...c,
          likes,
          isLikedByMe: liked,
        }))
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Could not like');
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-[#e2e6de] dark:border-[#333a44]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2228] dark:text-white flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-[#de7c68]" />
          Discussion ({total})
        </h2>
        <span className="text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono hidden sm:inline">
          Peer review & discourse
        </span>
      </div>

      {readerUser ? (
        <form onSubmit={handlePostComment} className="mb-10">
          <div className="p-4 rounded-2xl border border-[#e2e6de] dark:border-[#333a44] bg-[#fafbf8] dark:bg-[#262b32] focus-within:ring-2 focus-within:ring-[#de7c68] transition-all">
            <div className="flex items-center gap-2 mb-3">
              <img src={readerUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
              <span className="text-xs font-semibold text-[#1e2228] dark:text-white">
                Commenting as {readerUser.name}
              </span>
            </div>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your perspective, critique, or question..."
              className="w-full bg-transparent text-sm text-[#1e2228] dark:text-white placeholder-[#4b585b]/60 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-3 border-t border-[#e2e6de] dark:border-[#333a44]">
              <span className="text-xs text-[#4b585b] dark:text-[#95a5a8]">Be respectful & constructive</span>
              <button
                type="submit"
                disabled={!newComment.trim() || posting}
                className="px-5 py-2 bg-[#de7c68] hover:bg-[#cc6752] text-white font-semibold text-xs rounded-xl disabled:opacity-40 flex items-center gap-1.5"
              >
                {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-5 rounded-2xl bg-[#eaf0ec]/50 dark:bg-[#7d998a]/10 border border-[#7d998a]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#4b585b] dark:text-[#c4cec9]">
            Log in to join the discussion, like comments & reply.
          </p>
          <button
            onClick={onLoginRequired}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#637e6f] text-white text-xs font-semibold shrink-0"
          >
            <LogIn className="w-4 h-4" />
            Log In to Comment
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#de7c68] animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#4b585b] dark:text-[#95a5a8] italic py-8 text-center">
          No comments yet. Be the first to start the conversation!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              readerUser={readerUser}
              onLoginRequired={onLoginRequired}
              onLike={handleLike}
              onReply={handleReply}
              likingId={likingId}
            />
          ))}
        </div>
      )}
    </section>
  );
};
