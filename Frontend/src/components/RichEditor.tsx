import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Palette,
  Highlighter,
  Clock,
  Eye,
  Send,
  Save,
  CheckCircle,
  Sparkles,
  Settings,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  FileText,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Article, CategoryType } from '../types';
import { SAMPLE_IMAGE_PRESETS } from '../data/mockData';

interface RichEditorProps {
  initialArticle?: Article | null;
  onSaveArticle: (articleData: Partial<Article>, isPublish: boolean) => void;
  onPreviewArticle: (articleData: Article) => void;
  categories: CategoryType[];
  onBack: () => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  initialArticle,
  onSaveArticle,
  onPreviewArticle,
  categories,
  onBack,
}) => {
  // Document state
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [category, setCategory] = useState<CategoryType>(initialArticle?.category || 'AI');
  const [coverImage, setCoverImage] = useState(
    initialArticle?.coverImage ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85'
  );
  const [tags, setTags] = useState<string[]>(initialArticle?.tags || ['AI', 'Tech', 'Research']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>(initialArticle?.status || 'draft');

  // Stats & Autosave
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(1);
  const [lastSaved, setLastSaved] = useState('Saved just now');
  const [isSaving, setIsSaving] = useState(false);

  // UI panels
  const [showSidebar, setShowSidebar] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageCaptionInput, setImageCaptionInput] = useState('');
  
  // Selection reference for restoring cursor when inserting inline images
  const savedSelectionRef = useRef<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      if (initialArticle?.contentHtml) {
        editorRef.current.innerHTML = initialArticle.contentHtml;
      } else {
        editorRef.current.innerHTML = `
          <p class="lead text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">Start drafting your narrative here. Highlight any text to format, or click the toolbar to add structure, pull quotes, and code blocks.</p>
          <h2>The core thesis</h2>
          <p>Every breakthrough architecture begins with a clear hypothesis. Detail the underlying motivation, experimental setup, or industry shift that sparked this publication.</p>
          <blockquote>"The best engineering and research essays combine rigorous empirical evidence with lucid, evocative prose."</blockquote>
          <p>Click the Image icon on the top ribbon anytime to drop high-res visuals exactly where your cursor is positioned.</p>
        `;
      }
      updateCounts();
    }
  }, [initialArticle]);

  // Word count & read time updater
  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadTime(Math.max(1, Math.ceil(words / 200)));
  };

  // Simulate periodic autosave indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved('Saved just now');
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save selection before opening modals
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Execute standard format command
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateCounts();
    setLastSaved('Editing...');
    setTimeout(() => setLastSaved('Saved just now'), 1000);
  };

  // Inline Image Insertion at Cursor Position
  const handleOpenImageModal = () => {
    saveCurrentSelection();
    setShowImageModal(true);
  };

  const handleInsertInlineImage = (url: string, caption?: string) => {
    if (!url) return;
    editorRef.current?.focus();

    // If we have a saved range inside the editor, restore it
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }

    const figureHtml = `
      <figure class="my-6 block text-center">
        <img src="${url}" alt="${caption || 'Inserted image'}" class="rounded-xl shadow-md max-w-full mx-auto my-2 border border-zinc-200 dark:border-zinc-800" />
        ${caption ? `<figcaption class="text-center text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">${caption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, figureHtml);
    setShowImageModal(false);
    setImageUrlInput('');
    setImageCaptionInput('');
    updateCounts();
  };

  // Insert link
  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g., https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Insert code block
  const handleInsertCodeBlock = () => {
    const codeHtml = `<pre class="bg-zinc-900 text-zinc-100 p-4 rounded-xl font-mono text-sm my-4 overflow-x-auto"><code>// Enter code snippet here\nconst result = await compute();</code></pre><p><br></p>`;
    executeCommand('insertHTML', codeHtml);
  };

  // Tag management
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Publish / Save
  const handlePublishOrSave = (isPublish: boolean) => {
    setIsSaving(true);
    const content = editorRef.current?.innerHTML || '';
    const textContent = editorRef.current?.innerText || '';
    const excerpt = textContent.slice(0, 160) + '...';

    const articleData: Partial<Article> = {
      title: title || 'Untitled Story',
      subtitle,
      category,
      coverImage,
      tags,
      contentHtml: content,
      excerpt,
      readTimeMinutes: readTime,
      status: isPublish ? 'published' : 'draft',
      publishedAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setIsSaving(false);
      onSaveArticle(articleData, isPublish);
      if (isPublish) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 600);
  };

  const handlePreview = () => {
    const content = editorRef.current?.innerHTML || '';
    const textContent = editorRef.current?.innerText || '';
    const dummyArticle: Article = {
      id: initialArticle?.id || 'preview-temp',
      slug: 'preview',
      title: title || 'Untitled Story Preview',
      subtitle,
      excerpt: textContent.slice(0, 160) + '...',
      contentHtml: content,
      coverImage,
      category,
      tags,
      author: initialArticle?.author || {
        id: 'user-current',
        name: 'Elena Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        roleTitle: 'Chief AI Architect & Research Fellow',
        bio: 'Pioneering multimodal foundation models and neuro-symbolic reasoning.',
        followersCount: 14200,
        handle: '@elenavance',
      },
      publishedAt: 'Today',
      readTimeMinutes: readTime,
      views: 1,
      likes: 0,
      claps: 0,
      status: 'draft',
      commentsCount: 0,
    };
    onPreviewArticle(dummyArticle);
  };

  const textColors = ['#000000', '#ea580c', '#0284c7', '#16a34a', '#7c3aed', '#dc2626'];
  const highlightColors = ['#fef08a', '#ffedd5', '#dcfce7', '#e0e7ff', '#fce7f3', 'transparent'];

  return (
    <div className="min-h-screen bg-[#fafbf8] dark:bg-[#1e2228] flex flex-col transition-colors">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#fdfdfc]/95 dark:bg-[#262b32]/95 backdrop-blur-md border-b border-[#e2e6de] dark:border-[#333a44] px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Back & Autosave Status */}
        <div className="flex items-center gap-3">
          <button
            id="editor-back-btn"
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#4b585b] dark:text-[#95a5a8] hover:text-[#1e2228] dark:hover:text-white rounded-lg hover:bg-[#f3f5f0] dark:hover:bg-[#333a44] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <span className="h-4 w-px bg-[#e2e6de] dark:border-[#333a44]" />

          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#7d998a] animate-pulse" />
            <span className="hidden xs:inline">{lastSaved}</span>
          </div>

          <span className="h-4 w-px bg-[#e2e6de] dark:bg-[#333a44] hidden md:block" />

          {/* Word Count & Read Time */}
          <div className="hidden md:flex items-center gap-3 text-xs text-[#4b585b] dark:text-[#95a5a8] font-mono">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{readTime} min read</span>
          </div>
        </div>

        {/* Right: Preview, Save Draft, Publish Buttons & Sidebar Toggle */}
        <div className="flex items-center gap-2">
          
          <button
            id="editor-preview-btn"
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1e2228] dark:text-[#f3f5f0] border border-[#e2e6de] dark:border-[#333a44] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44] transition-colors cursor-pointer"
            title="Preview how this article appears to readers"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            id="editor-save-draft-btn"
            disabled={isSaving}
            onClick={() => handlePublishOrSave(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#1e2228] dark:text-[#f3f5f0] bg-[#f3f5f0] dark:bg-[#333a44] hover:bg-[#e2e6de] dark:hover:bg-[#4b585b] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            id="editor-publish-btn"
            disabled={isSaving}
            onClick={() => handlePublishOrSave(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#de7c68] hover:bg-[#cc6752] shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>

          <button
            id="editor-toggle-sidebar-btn"
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg text-xs border transition-colors cursor-pointer ${
              showSidebar
                ? 'bg-[#fbeee9] dark:bg-[#de7c68]/20 text-[#de7c68] border-[#de7c68]/40'
                : 'text-[#4b585b] dark:text-[#95a5a8] border-[#e2e6de] dark:border-[#333a44] hover:bg-[#f3f5f0] dark:hover:bg-[#333a44]'
            }`}
            title="Toggle article metadata settings panel"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Document Column */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* FLOATING / STICKY FORMATTING RIBBON (MS Word + Notion Hybrid) */}
          <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2 shadow-xs">
            <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-1 sm:gap-1.5">
              
              {/* Text styles group */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
                <button
                  id="ribbon-bold-btn"
                  onClick={() => executeCommand('bold')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-italic-btn"
                  onClick={() => executeCommand('italic')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-underline-btn"
                  onClick={() => executeCommand('underline')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-strike-btn"
                  onClick={() => executeCommand('strikeThrough')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Headings group */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
                <button
                  id="ribbon-h1-btn"
                  onClick={() => executeCommand('formatBlock', '<h1>')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
                  title="Heading 1"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-h2-btn"
                  onClick={() => executeCommand('formatBlock', '<h2>')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
                  title="Heading 2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-h3-btn"
                  onClick={() => executeCommand('formatBlock', '<h3>')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
                  title="Heading 3"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-p-btn"
                  onClick={() => executeCommand('formatBlock', '<p>')}
                  className="px-2 py-1 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]"
                  title="Paragraph"
                >
                  P
                </button>
              </div>

              {/* Lists & Quotes */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
                <button
                  id="ribbon-ul-btn"
                  onClick={() => executeCommand('insertUnorderedList')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Bulleted List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-ol-btn"
                  onClick={() => executeCommand('insertOrderedList')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-quote-btn"
                  onClick={() => executeCommand('formatBlock', '<blockquote>')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Blockquote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-code-btn"
                  onClick={handleInsertCodeBlock}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Code Block"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Alignment */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
                <button
                  id="ribbon-align-left-btn"
                  onClick={() => executeCommand('justifyLeft')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-align-center-btn"
                  onClick={() => executeCommand('justifyCenter')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  id="ribbon-align-right-btn"
                  onClick={() => executeCommand('justifyRight')}
                  className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color & Highlight Pickers */}
              <div className="relative">
                <button
                  id="ribbon-color-picker-btn"
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowHighlightPicker(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-white dark:hover:bg-zinc-700"
                  title="Text Color"
                >
                  <Palette className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px]">Color</span>
                </button>

                {showColorPicker && (
                  <div className="absolute top-full mt-1 left-0 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 flex gap-1 z-50">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          executeCommand('foreColor', color);
                          setShowColorPicker(false);
                        }}
                        className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Highlight / Background */}
              <div className="relative">
                <button
                  id="ribbon-highlight-picker-btn"
                  onClick={() => {
                    setShowHighlightPicker(!showHighlightPicker);
                    setShowColorPicker(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-white dark:hover:bg-zinc-700"
                  title="Highlight Background"
                >
                  <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px]">Highlight</span>
                </button>

                {showHighlightPicker && (
                  <div className="absolute top-full mt-1 left-0 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 flex gap-1 z-50">
                    {highlightColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          executeCommand('hiliteColor', color);
                          setShowHighlightPicker(false);
                        }}
                        className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color === 'transparent' ? '#fff' : color }}
                        title={color === 'transparent' ? 'Clear Highlight' : color}
                      >
                        {color === 'transparent' && <span className="text-[9px] text-zinc-500">✕</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Link Inserter */}
              <button
                id="ribbon-link-btn"
                onClick={handleInsertLink}
                className="p-1.5 bg-[#f3f5f0] dark:bg-[#1e2228] rounded-lg border border-[#e2e6de] dark:border-[#333a44] text-[#1e2228] dark:text-[#f3f5f0] hover:bg-white dark:hover:bg-[#333a44] cursor-pointer"
                title="Insert Link"
              >
                <Link className="w-3.5 h-3.5" />
              </button>

              {/* INLINE IMAGE INSERTER (Crucial feature from user request) */}
              <button
                id="ribbon-insert-image-btn"
                onClick={handleOpenImageModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fbeee9] dark:bg-[#de7c68]/20 text-[#de7c68] font-semibold rounded-lg border border-[#de7c68]/40 hover:bg-[#de7c68]/20 dark:hover:bg-[#de7c68]/30 transition-colors text-xs cursor-pointer"
                title="Insert image at current cursor position"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Insert Image at Cursor</span>
              </button>

            </div>
          </div>

          {/* Document Canvas Sheet (Word / Notepad layout) */}
          <div className="flex-1 py-8 px-4 sm:px-8 max-w-4xl w-full mx-auto">
            
            {/* Document Paper Container */}
            <div className="bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl shadow-xl border border-[#e2e6de] dark:border-[#333a44] p-8 sm:p-12 lg:p-16 min-h-[850px] flex flex-col">
              
              {/* Category Pill Tag above title */}
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#eaf0ec] text-[#637e6f] dark:bg-[#7d998a]/20 dark:text-[#7d998a] font-mono">
                  {category}
                </span>
              </div>

              {/* Title Input */}
              <textarea
                id="editor-title-input"
                rows={1}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                placeholder="Article Title..."
                className="w-full font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1e2228] dark:text-white placeholder-[#95a5a8]/50 bg-transparent resize-none focus:outline-none leading-[1.2] mb-3"
              />

              {/* Subtitle Input */}
              <input
                id="editor-subtitle-input"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add a crisp subtitle or deck statement..."
                className="w-full text-lg sm:text-xl text-[#4b585b] dark:text-[#95a5a8] placeholder-[#95a5a8]/50 bg-transparent focus:outline-none mb-8 font-light"
              />

              {/* Optional Inline Banner preview inside document */}
              {coverImage && (
                <div className="relative mb-8 rounded-xl overflow-hidden border border-[#e2e6de] dark:border-[#333a44] group">
                  <img
                    src={coverImage}
                    alt="Article Cover"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="px-3 py-1.5 bg-[#fdfdfc]/90 dark:bg-[#262b32]/90 text-[#1e2228] dark:text-white rounded-lg text-xs font-semibold shadow cursor-pointer"
                    >
                      Change Cover in Settings
                    </button>
                  </div>
                </div>
              )}

              {/* WYSIWYG Content Editable Canvas */}
              <div
                ref={editorRef}
                id="editor-content-editable"
                contentEditable
                onInput={updateCounts}
                onKeyUp={updateCounts}
                className="rich-editor-content flex-1 text-[#1e2228] dark:text-[#f3f5f0] text-base sm:text-lg leading-relaxed focus:outline-none min-h-[450px]"
                placeholder="Type your story here..."
              />

            </div>

          </div>

        </div>

        {/* SIDEBAR / SETTINGS PANEL */}
        {showSidebar && (
          <aside className="w-80 sm:w-88 bg-[#fdfdfc] dark:bg-[#262b32] border-l border-[#e2e6de] dark:border-[#333a44] p-6 flex flex-col justify-between overflow-y-auto z-20">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e6de] dark:border-[#333a44] mb-6">
                <h3 className="font-semibold text-sm text-[#1e2228] dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#de7c68]" />
                  <span>Story Settings</span>
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4b585b] dark:text-[#95a5a8] mb-2">
                  Category
                </label>
                <select
                  id="editor-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-sm text-[#1e2228] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image Selector & Preset gallery */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4b585b] dark:text-[#95a5a8] mb-2">
                  Featured Cover Image
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    id="editor-cover-image-input"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Paste image URL..."
                    className="w-full px-3 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs text-[#1e2228] dark:text-white focus:outline-none font-mono"
                  />

                  {/* Preset quick picks */}
                  <p className="text-[11px] text-[#4b585b] dark:text-[#95a5a8] font-medium">Or choose a preset cover:</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`relative rounded-lg overflow-hidden h-12 border-2 transition-transform hover:scale-105 cursor-pointer ${
                          coverImage === preset.url
                            ? 'border-[#de7c68] ring-2 ring-[#de7c68]/20'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={preset.title}
                      >
                        <img src={preset.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags Input */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4b585b] dark:text-[#95a5a8] mb-2">
                  Tags & Topics
                </label>
                <input
                  type="text"
                  id="editor-tags-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag and press Enter..."
                  className="w-full px-3 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs text-[#1e2228] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68] mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#f3f5f0] dark:bg-[#1e2228] text-[#1e2228] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44]"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#95a5a8] hover:text-[#de7c68] cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status & Publication Info */}
              <div className="p-4 rounded-xl bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4b585b] dark:text-[#95a5a8]">Status</span>
                  <span className={`font-mono font-semibold uppercase ${
                    status === 'published' ? 'text-[#7d998a]' : 'text-[#de7c68]'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4b585b] dark:text-[#95a5a8]">Read Time</span>
                  <span className="font-mono text-[#1e2228] dark:text-white">{readTime} minutes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4b585b] dark:text-[#95a5a8]">Estimated Words</span>
                  <span className="font-mono text-[#1e2228] dark:text-white">{wordCount}</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions in Sidebar */}
            <div className="pt-6 border-t border-[#e2e6de] dark:border-[#333a44] space-y-2">
              <button
                id="sidebar-publish-btn"
                onClick={() => handlePublishOrSave(true)}
                className="w-full py-2.5 bg-[#de7c68] hover:bg-[#cc6752] text-white font-semibold text-xs rounded-xl shadow hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Platform</span>
              </button>
              <button
                id="sidebar-draft-btn"
                onClick={() => handlePublishOrSave(false)}
                className="w-full py-2 bg-[#f3f5f0] dark:bg-[#1e2228] text-[#1e2228] dark:text-[#c4cec9] font-medium text-xs rounded-xl hover:bg-[#e2e6de] dark:hover:bg-[#333a44] transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#e2e6de] dark:border-[#333a44]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Working Draft</span>
              </button>
            </div>
          </aside>
        )}

      </div>

      {/* MODAL: INSERT INLINE IMAGE AT CURSOR POSITION */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdfdfc] dark:bg-[#262b32] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e2e6de] dark:border-[#333a44] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6de] dark:border-[#333a44] mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#de7c68]" />
                <h3 className="text-lg font-bold text-[#1e2228] dark:text-white tracking-tight">
                  Insert Image at Cursor
                </h3>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-[#4b585b] hover:text-[#1e2228] dark:text-[#95a5a8] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4b585b] dark:text-[#c4cec9] mb-4">
              Drop an inline image directly into your text flow. Choose from our curated editorial library or paste your custom image URL.
            </p>

            {/* Custom URL input */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#1e2228] dark:text-white mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="inline-image-url-input"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs text-[#1e2228] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#de7c68] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e2228] dark:text-white mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  id="inline-image-caption-input"
                  value={imageCaptionInput}
                  onChange={(e) => setImageCaptionInput(e.target.value)}
                  placeholder="Figure 1: Cognitive latency profile..."
                  className="w-full px-3 py-2 bg-[#f3f5f0] dark:bg-[#1e2228] border border-[#e2e6de] dark:border-[#333a44] rounded-xl text-xs text-[#1e2228] dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Curated Library Presets */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#1e2228] dark:text-white mb-2">
                Curated Editorial Photos:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrlInput(preset.url);
                      setImageCaptionInput(preset.caption);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 text-left group transition-all cursor-pointer ${
                      imageUrlInput === preset.url
                        ? 'border-[#de7c68] ring-2 ring-[#de7c68]/20'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 p-1 bg-black/60 backdrop-blur-xs text-[10px] text-white truncate block">
                      {preset.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e6de] dark:border-[#333a44]">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#4b585b] dark:text-[#95a5a8] hover:text-[#1e2228] dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-insert-inline-image-btn"
                disabled={!imageUrlInput}
                onClick={() => handleInsertInlineImage(imageUrlInput, imageCaptionInput)}
                className="px-5 py-2 bg-[#de7c68] hover:bg-[#cc6752] disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
