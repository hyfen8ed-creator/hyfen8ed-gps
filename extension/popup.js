document.addEventListener('DOMContentLoaded', async () => {
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const captionInput = document.getElementById('caption');
  const pillarSelect = document.getElementById('pillar');
  const aiProcess = document.getElementById('aiProcess');
  const captureBtn = document.getElementById('captureBtn');
  const statusDiv = document.getElementById('status');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      titleInput.value = tab.title || '';
      urlInput.value = tab.url || '';
    }
  } catch (err) {
    console.error('Error fetching tab:', err);
  }

  captureBtn.addEventListener('click', async () => {
    captureBtn.disabled = true;
    captureBtn.textContent = 'Ingesting & Analyzing...';

    const item = {
      id: 'cap_' + Date.now(),
      title: titleInput.value || 'Captured Web Content',
      url: urlInput.value || '',
      caption: captionInput.value || '',
      pillar: pillarSelect.value,
      aiRequested: aiProcess.checked,
      timestamp: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      source: 'Chrome Extension Quick Capture',
      status: 'Captured'
    };

    // Save to chrome storage
    const stored = await chrome.storage.local.get(['gps_captures']);
    const list = stored.gps_captures || [];
    list.unshift(item);
    await chrome.storage.local.set({ gps_captures: list });

    // Open GPS dashboard in background/new tab with the capture query if user wants
    statusDiv.textContent = 'Saved to hyFen8ed GPS Knowledge Vault!';
    statusDiv.className = 'status success';

    setTimeout(() => {
      window.close();
    }, 1500);
  });
});
