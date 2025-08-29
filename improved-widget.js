(function () {
  // Version tag so we can confirm this code loaded
  console.log('[BlueskyWidget] v2.3 loaded - improved private browsing support');

  // --- Only run on the homepage ---
  var isHome =
    document.body.classList.contains('home-template') ||
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html';
  if (!isHome) return;

  var HANDLE_FALLBACK = 'benwest.bsky.social';

  // Safe localStorage wrapper that works in private browsing
  var safeStorage = {
    getItem: function(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('[BlueskyWidget] localStorage getItem failed (private browsing?):', e);
        return null;
      }
    },
    setItem: function(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn('[BlueskyWidget] localStorage setItem failed (private browsing?):', e);
        return false;
      }
    }
  };

  function injectWidgetShell(profileUrl) {
    var widget = document.createElement('div');
    widget.id = 'bluesky-widget';
    widget.innerHTML =
      '<a href="' + profileUrl + '" target="_blank" rel="noopener" ' +
      'style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding:15px;' +
      'background:linear-gradient(135deg,#0085ff 0%,#00a8ff 100%);border-radius:12px;color:white;text-decoration:none;">' +
        '<div style="width:24px;height:24px;background:white;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#0085ff;font-size:14px;">🦋</div>' +
        '<div>' +
          '<h3 style="margin:0;font-size:18px;">Join Me Where the Sky is Blue</h3>' +
          '<p style="margin:0;font-size:14px;opacity:0.9;">Recent posts and updates</p>' +
        '</div>' +
      '</a>' +
      '<div id="bluesky-posts">Loading posts...</div>';
    var target = document.querySelector('.gh-main') || document.querySelector('main') || document.body;
    target.appendChild(widget);
  }

  function renderPosts(data) {
    var container = document.getElementById('bluesky-posts');
    if (!container) return;

    if (!data || !data.posts || !data.posts.length) {
      container.innerHTML = 'No posts found';
      return;
    }

    try {
      var handle = data.handle || (data.posts[0] && data.posts[0].author && data.posts[0].author.handle) || HANDLE_FALLBACK;
      var headerLink = document.querySelector('#bluesky-widget > a');
      if (headerLink) headerLink.href = 'https://bsky.app/profile/' + handle;
    } catch (e) {}

    var html = '';
    for (var i = 0; i < data.posts.length; i++) {
      var post = data.posts[i];
      html += '<div class="bluesky-post">';
      html +=   '<div class="bluesky-post-header">';
      html +=     '<img src="' + (post.author && post.author.avatar ? post.author.avatar : '') + '" class="bluesky-avatar" alt="">';
      html +=     '<div class="bluesky-author">';
      html +=       '<p class="bluesky-display-name">' + (post.author && post.author.displayName ? post.author.displayName : 'Unknown') + '</p>';
      html +=       '<p class="bluesky-handle">@' + (post.author && post.author.handle ? post.author.handle : '') + '</p>';
      html +=     '</div>';
      html +=   '</div>';
      html +=   '<div class="bluesky-text">' + (post.text || '') + '</div>';

      // Top-level photos (on your post)
      if (post.images && post.images.length) {
        html += '<div class="bluesky-images">';
        for (var ii = 0; ii < Math.min(post.images.length, 4); ii++) {
          var im = post.images[ii];
          html += '<img src="' + im.url + '" alt="' + (im.alt || '') + '">';
        }
        html += '</div>';
      }

      // --- QUOTED POST CARD ---
      if (post.quotedPost) {
        var qp = post.quotedPost;
        var qpHandle = qp.handle ? qp.handle.replace(/^@/, '') : '';
        var qpProfileUrl = qpHandle ? ('https://bsky.app/profile/' + qpHandle) : '#';
        var qpAttribution = qp.author
          ? (qp.author + (qpHandle ? ' (@' + qpHandle + ')' : ''))
          : (qpHandle ? '@' + qpHandle : 'Quoted post');

        html += '<div class="bluesky-quote">';
        html +=   '<div class="bluesky-quote-author"><a href="' + qpProfileUrl + '" target="_blank" rel="noopener">' + qpAttribution + '</a></div>';
        html +=   '<div class="bluesky-quote-text">' + (qp.text || '') + '</div>';

        // Quoted post photos (if any)
        if (qp.images && qp.images.length) {
          html += '<div class="bluesky-quote-images">';
          for (var qi = 0; qi < Math.min(qp.images.length, 4); qi++) {
            var qim = qp.images[qi];
            html += '<img src="' + qim.url + '" alt="' + (qim.alt || '') + '">';
          }
          html += '</div>';
        }

        if (qp.url) {
          html += '<div style="margin-top:8px;"><a href="' + qp.url + '" target="_blank" rel="noopener">View quoted post</a></div>';
        }
        html += '</div>';
      }

      // External link (if any)
      if (post.externalLink && post.externalLink.url) {
        html += '<a href="' + post.externalLink.url + '" target="_blank" rel="noopener" class="bluesky-external-link">';
        if (post.externalLink.thumb) html += '<img src="' + post.externalLink.thumb + '" class="bluesky-link-image" alt="">';
        if (post.externalLink.title) html += '<div class="bluesky-link-title">' + post.externalLink.title + '</div>';
        if (post.externalLink.description) html += '<div class="bluesky-link-description">' + post.externalLink.description + '</div>';
        html += '</a>';
      }

      if (post.blueskyUrl) {
        html += '<div class="bluesky-engagement"><a href="' + post.blueskyUrl + '" target="_blank" rel="noopener" class="bluesky-post-link">View on Bluesky</a></div>';
      }
      html += '</div>';
    }
    container.innerHTML = html;

    // Freshness badge
    try {
      var badge = document.createElement('div');
      badge.style.cssText = 'text-align:right;font-size:12px;color:#8899a6;margin-top:8px;';
      badge.textContent = 'Updated: ' + (data.generatedAt || new Date().toISOString());
      document.getElementById('bluesky-widget').appendChild(badge);
    } catch (e) {}
  }

  function loadPosts() {
    var postsEl = document.getElementById('bluesky-posts');
    if (!postsEl) return;
    postsEl.innerHTML = '<div style="text-align:center;color:#8899a6;padding:20px;">Fetching posts...</div>';

    var url = '/content/images/bluesky-feed.json?ts=' + Date.now();
    console.log('[BlueskyWidget] Fetching from:', url);
    
    fetch(url, { 
      cache: 'no-store', 
      mode: 'cors',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(function (r) { 
        console.log('[BlueskyWidget] Response status:', r.status);
        if (!r.ok) throw new Error('HTTP ' + r.status); 
        return r.json(); 
      })
      .then(function (data) {
        console.log('[BlueskyWidget] Data received:', data);
        
        // Try to cache the data (will silently fail in private browsing)
        var cached = safeStorage.setItem('blueskyFeedCache', JSON.stringify(data));
        if (cached) {
          console.log('[BlueskyWidget] Cached successfully');
        } else {
          console.log('[BlueskyWidget] Caching unavailable (private browsing mode)');
        }
        
        renderPosts(data);
      })
      .catch(function (err) {
        console.error('[BlueskyWidget] Fetch error:', err);
        
        // Try cache fallback (will be null in private browsing)
        var cached = safeStorage.getItem('blueskyFeedCache');
        if (cached) {
          try {
            console.log('[BlueskyWidget] Using cached data');
            return renderPosts(JSON.parse(cached));
          } catch (e) {
            console.warn('[BlueskyWidget] Cache parse failed:', e);
          }
        } else {
          console.log('[BlueskyWidget] No cache available (private browsing or first visit)');
        }
        
        // Better error message with retry option
        postsEl.innerHTML = '<div style="text-align:center;color:#ff6b6b;padding:20px;">' +
          'Unable to load posts. ' +
          '<button onclick="window.location.reload()" style="background:#1da1f2;color:white;border:none;padding:4px 8px;border-radius:4px;margin:0 4px;cursor:pointer;">Retry</button>' +
          'or <a href="https://bsky.app/profile/' + HANDLE_FALLBACK + '" ' +
          'target="_blank" style="color:#1da1f2;">View on Bluesky</a></div>';
      });
  }

  // Build shell and boot
  injectWidgetShell('https://bsky.app/profile/' + HANDLE_FALLBACK);

  // Show any cached data immediately (will be null in private browsing)
  var cached = safeStorage.getItem('blueskyFeedCache');
  if (cached) {
    try {
      console.log('[BlueskyWidget] Loading cached data on page load');
      renderPosts(JSON.parse(cached));
    } catch (e) {
      console.warn('[BlueskyWidget] Failed to load cached data:', e);
    }
  } else {
    console.log('[BlueskyWidget] No cached data available');
  }

  window.addEventListener('load', function () {
    loadPosts();
    // Refresh every 5 minutes
    setInterval(loadPosts, 5 * 60 * 1000);
  });
})();