console.log('External Bluesky widget loaded');

document.addEventListener('DOMContentLoaded', function() {
  var isHome = document.body.classList.contains('home-template') || 
               window.location.pathname === '/';
  
  if (!isHome) return;
  
  var widget = document.createElement('div');
  widget.style.cssText = 'background:#000;color:#fff;padding:20px;margin:20px auto;max-width:600px;border-radius:12px;font-family:sans-serif;';
  widget.innerHTML = '<h3 style="margin:0 0 15px 0;">Recent Bluesky Posts</h3><div id="bluesky-content">Loading posts...</div>';
  
  var target = document.querySelector('.gh-main') || document.querySelector('main') || document.body;
  target.appendChild(widget);
  
  fetch('https://raw.githubusercontent.com/M0nkeyFl0wer/black-ink-journal/main/bluesky-feed.json')
    .then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function(data) {
      var container = document.getElementById('bluesky-content');
      if (data && data.posts && data.posts.length > 0) {
        var html = '';
        data.posts.forEach(function(post) {
          html += '<div style="border:1px solid #333;padding:15px;margin:10px 0;border-radius:8px;">';
          html += '<div style="margin-bottom:10px;"><strong>' + (post.author ? post.author.displayName : 'Unknown') + '</strong></div>';
          html += '<div style="margin-bottom:10px;">' + (post.text || '') + '</div>';
          if (post.blueskyUrl) {
            html += '<div><a href="' + post.blueskyUrl + '" target="_blank" style="color:#1da1f2;">View on Bluesky</a></div>';
          }
          html += '</div>';
        });
        container.innerHTML = html;
      } else {
        container.innerHTML = '<p>No posts found</p>';
      }
    })
    .catch(function(error) {
      console.error('Bluesky widget error:', error);
      document.getElementById('bluesky-content').innerHTML = '<p style="color:#ff6b6b;">Error loading posts</p>';
    });
});