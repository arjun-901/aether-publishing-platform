import React, { useState } from 'react';
import { Mail, CheckCircle2, BellRing, Sparkles, ShieldCheck } from 'lucide-react';
import { CategoryType } from '../types';

interface NewsletterSectionProps {
  categories: CategoryType[];
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ categories }) => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['AI', 'Full Stack Development', 'AWS']);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <section className="relative w-full py-16 my-8 overflow-hidden bg-[#fafbf8] dark:bg-[#1e2228]/60 border-y border-[#e2e6de] dark:border-[#333a44]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#fbeee9] text-[#de7c68] dark:bg-[#de7c68]/20 dark:text-[#f2c6b1] mb-6 border border-[#de7c68]/30">
          <BellRing className="w-3.5 h-3.5" />
          <span>Reader Dispatch & Curated Digests</span>
        </div>

        {/* Heading & Subhead - Crisp sans-serif */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1e2228] dark:text-white mb-4">
          Never miss a breakthrough essay.
        </h2>
        <p className="text-[#4b585b] dark:text-[#c4cec9] text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal">
          Get notified when new articles drop in your favorite categories. Filter topics, receive morning briefings, and read without algorithmic noise.
        </p>

        {isSubscribed ? (
          <div className="bg-[#fdfdfc] dark:bg-[#262b32] p-8 rounded-2xl border border-[#7d998a]/40 shadow-xl max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-[#7d998a] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#1e2228] dark:text-white mb-1">
              You are subscribed to the Dispatch!
            </h3>
            <p className="text-sm text-[#4b585b] dark:text-[#c4cec9]">
              We've sent a confirmation ping to <span className="font-mono font-medium text-[#1e2228] dark:text-white">{email}</span>. You'll receive alerts for: {selectedTopics.join(', ')}.
            </p>
            <button
              onClick={() => {
                setIsSubscribed(false);
                setEmail('');
              }}
              className="mt-5 text-xs text-[#de7c68] hover:underline font-semibold"
            >
              Configure or change subscription
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            {/* Topic selectors */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-mono text-[#4b585b] dark:text-[#95a5a8] mb-2.5">
                Select your focus areas:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {categories.slice(0, 6).map((topic) => {
                  const isChecked = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] font-semibold shadow-sm'
                          : 'bg-white dark:bg-[#262b32] text-[#4b585b] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44] hover:border-[#7d998a]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 text-[#4b585b] dark:text-[#95a5a8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  id="newsletter-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#262b32] border border-[#e2e6de] dark:border-[#333a44] rounded-xl sm:rounded-full text-sm text-[#1e2228] dark:text-white placeholder-[#4b585b]/60 dark:placeholder-[#95a5a8]/60 focus:outline-none focus:ring-2 focus:ring-[#de7c68] shadow-sm"
                />
              </div>

              <button
                type="submit"
                id="newsletter-subscribe-btn"
                className="px-6 py-3 bg-[#de7c68] hover:bg-[#cc6752] text-white text-sm font-semibold rounded-xl sm:rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                Join Readers
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#4b585b] dark:text-[#95a5a8]">
              <ShieldCheck className="w-4 h-4 text-[#7d998a]" />
              <span>Zero spam. Unsubscribe anytime in one click. Instant RSS feeds also available.</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
