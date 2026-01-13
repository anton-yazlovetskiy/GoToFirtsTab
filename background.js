async function moveTab(tab, direction) {
  const windowId = tab.windowId;

  // Если вкладка не в группе
  if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    if (direction === 'start') {
      await chrome.tabs.move(tab.id, { index: 0 });
    } else {
      // Перемещаем в самый конец (индекс -1 автоматически ставит вкладку последней)
      await chrome.tabs.move(tab.id, { index: -1 });
    }
  } 
  else {
    // Если вкладка в группе
    const allTabsInWindow = await chrome.tabs.query({ windowId: windowId });
    const groupTabs = allTabsInWindow
      .filter(t => t.groupId === tab.groupId)
      .sort((a, b) => a.index - b.index);

    if (groupTabs.length > 0) {
      const targetIndex = direction === 'start' 
        ? groupTabs[0].index 
        : groupTabs[groupTabs.length - 1].index;
      
      await chrome.tabs.move(tab.id, { index: targetIndex });
    }
  }
}

// Слушатель нажатия на иконку расширения (по умолчанию в начало)
chrome.action.onClicked.addListener((tab) => {
  moveTab(tab, 'start');
});

// Слушатель горячих клавиш
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  if (command === 'move-to-start') {
    moveTab(tab, 'start');
  } else if (command === 'move-to-end') {
    moveTab(tab, 'end');
  }
});