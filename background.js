chrome.action.onClicked.addListener(async (tab) => {
  const windowId = tab.windowId;

  // Если вкладка не в группе
  if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    // Перемещаем в самое начало окна (индекс 0)
    await chrome.tabs.move(tab.id, { index: 0 });
  } 
  else {
    // Если вкладка в группе, нужно найти индекс первой вкладки в этой группе
    const allTabsInWindow = await chrome.tabs.query({ windowId: windowId });
    
    // Фильтруем вкладки, принадлежащие той же группе
    const groupTabs = allTabsInWindow
      .filter(t => t.groupId === tab.groupId)
      .sort((a, b) => a.index - b.index);

    if (groupTabs.length > 0) {
      const firstIndexInGroup = groupTabs[0].index;
      // Перемещаем текущую вкладку на позицию самой первой вкладки группы
      await chrome.tabs.move(tab.id, { index: firstIndexInGroup });
    }
  }
});