import { shell, WebContentsView } from 'electron'
import { join } from 'path'
import { getBaseWindow } from './main-window'
import { NavigationRoutes } from './navigation-routes'
import { getSelected, getTabs, setSelected, setTabs } from './tabs-store'
import { getToolbarHeight, resizeToolbar } from './toolbar'
import { getRootUrl } from './url-helpers'

const tabs: WebContentsView[] = []
let selectedTab: WebContentsView | null = null
let tabExists = false; // Flag to track if a tab is already created

/**
 * Creates and loads a new tab with the root URL.
 * @returns The ID of the new tab's web contents, or -1 if creation failed
 */
export async function addNewTab() {
  if (tabExists) {
    tabExists = true
    return;
  }
  const mainWindow = getBaseWindow()
  if (mainWindow === null) {
    return
  }

  // load new content here
  const newTab = await loadTabContent(NavigationRoutes.root, { bringToFront: true })
  if (newTab === null) return -1
  return newTab.webContents.id
}

/**
 * Creates and loads a new tab with the root URL.
 * @returns The ID of the new tab's web contents, or -1 if creation failed
 */
export async function addNewScrapper(defaultUrl) {
  const mainWindow = getBaseWindow()
  if (mainWindow === null) {
    return
  }

  // load new content here
  const response = await loadScrappedContent(NavigationRoutes.root, { bringToFront: true }, defaultUrl)
  if (response === null) return -1
  return { id: response.webContents.webContents.id, data: response.data }
}

/**
 * Creates a new tab and loads the specified path asynchronously.
 * @param path The application route path to load
 * @returns Promise resolving to the WebContentView or null if loading failed
 */
export function loadTabContent(
  path: string,
  { bringToFront = false }: { bringToFront?: boolean } = {}
): Promise<WebContentsView | null> {
  return new Promise((resolve) => {
    const url = getRootUrl() + path
    const baseWindow = getBaseWindow()
    if (baseWindow === null) return resolve(null)
    const newContentView = new WebContentsView({
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    newContentView.setBackgroundColor('#292524')

    newContentView.webContents.once('did-finish-load', () => {
      console.info('WebContents finished loading');

      if (bringToFront) {
        showContent(newContentView);
        saveTabs();
      }

      newContentView.webContents.openDevTools({ mode: 'detach' });
      resolve(newContentView);
    });

    newContentView.webContents.on('did-fail-load', () => {
      resolve(null)
    })

    newContentView.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    tabs.push(newContentView)
    newContentView.webContents.loadURL(url)
    
  })
}

export function loadScrappedContent(
  _path: string,
  { bringToFront = false }: { bringToFront?: boolean } = {}, defaultUrl
): Promise<{webContents: WebContentsView, data: any} | null> {
  return new Promise((resolve) => {
    const baseWindow = getBaseWindow()
    if (baseWindow === null) return resolve(null)
    const newContentView = new WebContentsView({
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    newContentView.setBackgroundColor('#292524')

    newContentView.webContents.on('did-finish-load', async () => {
      if (bringToFront) {
        showContent(newContentView)
        saveTabs()
      }

      // async function extractInstagramData(newContentView) {
      //   const data = await newContentView.webContents.executeJavaScript(`
      //     new Promise((resolve) => {
      //       const check = () => {
      //         const main = document.querySelector('main');
      //         if (!main) {
      //           setTimeout(check, 300);
      //           return;
      //         }

      //         const getTextContent = (selector) => {
      //           const el = document.querySelector(selector);
      //           return el ? el.textContent.trim() : null;
      //         };

      //         const getNumberFromUl = (index) => {
      //           const ul = document.querySelector('ul[class*="x78zum5"]');
      //           if (ul && ul.children[index]) {
      //             const numberSpan = ul.children[index].querySelector('span span');
      //             return numberSpan ? parseInt(numberSpan.textContent.replace(/,/g, '')) : null;
      //           }
      //           return null;
      //         };

      //         const handle = getTextContent('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');

      //         const fullNameContainer = document.querySelector('div.x9f619.xjbqb8w.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1oa3qoh.x6s0dn4.x1amjocr.x78zum5.xl56j7k');
      //         const fullName = fullNameContainer ? fullNameContainer.querySelector('span')?.textContent.trim() : null;

      //         const posts = getNumberFromUl(0);
      //         const followers = getNumberFromUl(1);
      //         const following = getNumberFromUl(2);

      //         // ⬇️ Get all spans with the 'html-span' class and extract their text
      //         const htmlSpanTexts = Array.from(document.querySelectorAll('span.html-span')).map(el => el.textContent.trim());

      //         resolve({
      //           handle,
      //           fullName,
      //           posts,
      //           followers,
      //           following,
      //           htmlSpanTexts
      //         });
      //       };

      //       check();
      //     });
      //   `);

      //   return data;
      // }

      async function extractInstagramData(newContentView) {
        const data = await newContentView.webContents.executeJavaScript(`
          new Promise((resolve) => {
            const waitForElement = (selector, timeout = 7000) => {
              return new Promise((res) => {
                const start = Date.now();
                const check = () => {
                  const el = document.querySelector(selector);
                  if (el) return res(el);
                  if (Date.now() - start > timeout) return res(null);
                  setTimeout(check, 300);
                };
                check();
              });
            };

            const check = async () => {
              const main = await waitForElement('main');
              if (!main) {
                return resolve({ error: 'Main not found' });
              }

              const getTextContent = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.textContent.trim() : null;
              };

              const getNumberFromUl = (index) => {
                const ul = document.querySelector('ul[class*="x78zum5"]');
                if (ul && ul.children[index]) {
                  const numberSpan = ul.children[index].querySelector('span span');
                  return numberSpan ? parseInt(numberSpan.textContent.replace(/,/g, '')) : null;
                }
                return null;
              };

              const handle = getTextContent('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');

              const fullNameContainer = document.querySelector('div.x9f619.xjbqb8w.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1oa3qoh.x6s0dn4.x1amjocr.x78zum5.xl56j7k');
              const fullName = fullNameContainer ? fullNameContainer.querySelector('span')?.textContent.trim() : null;

              const posts = getNumberFromUl(0);
              const followers = getNumberFromUl(1);
              const following = getNumberFromUl(2);

              // Wait for views container
              await waitForElement('div.x6s0dn4.x1w9h7q7.x78zum5.x1pg5gke.x1s688f.xl56j7k.x1r0g7yl.x2b8uid.xtvhhri.x5ur3kl.x13fuv20.x178xt8z');

              await waitForElement('div._ac7v.xat24cr.x1f01sob.xcghwft.xzboxd6')

              await waitForElement('div._aagu')

              // Get anchor tags that are post thumbnails (strict class match)
              const postAnchors = Array.from(document.querySelectorAll('a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz._a6hd'));
              const postLinks = postAnchors.map(a => a.href);

              resolve({
                handle,
                fullName,
                posts,
                followers,
                following,
                postLinks,
              });
            };

            check();
          });
        `);

        return data;
      }




      // async function extractInstagramDom(newContentView) {
      //   const data = await newContentView.webContents.executeJavaScript(`
      //     new Promise((resolve) => {
      //       const check = () => {
      //         const main = document.querySelector('main');
      //         if (!main) {
      //           setTimeout(check, 300);
      //           return;
      //         }

      //         // Get the outer HTML of the main content area
      //         const domTree = main.outerHTML;

      //         resolve({
      //           domTree
      //         });
      //       };

      //       check();
      //     });
      //   `);

      //   return data;
      // }

      const scrapedData = await extractInstagramData(newContentView);
      console.log(scrapedData);
      // const scrapedDom = await extractInstagramDom(newContentView)

      // const text = await newContentView.webContents.executeJavaScript(`
      //   new Promise((resolve) => {
      //     const check = () => {
      //       const el = document.getElementsByTagName('main')[0];
      //       if (el) {
      //         resolve(el.innerText);
      //       } else {
      //         setTimeout(check, 300);
      //       }
      //     };
      //     check();
      //   });
      // `);
      resolve({webContents: newContentView, data: scrapedData});
    });

    newContentView.webContents.on('did-fail-load', () => {
      resolve(null)
    })

    newContentView.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    tabs.push(newContentView)
    newContentView.webContents.loadURL(defaultUrl)
  })
}

/**
 * Displays a WebContentView in the main window and sets it as the active tab.
 * @param webContentsView The WebContentView to display
 */
export function showContent(webContentsView: WebContentsView) {
  const baseWindow = getBaseWindow()
  if (!baseWindow) {
    return
  }

  const setWebContentBounds = () => {
    const newBounds = baseWindow.getBounds()
    webContentsView.setBounds({
      x: 0,
      y: getToolbarHeight(),
      width: newBounds.width,
      height: newBounds.height - getToolbarHeight()
    })
  }

  setWebContentBounds()

  baseWindow.removeAllListeners('resize')

  baseWindow.on('resize', () => {
    setWebContentBounds()
    resizeToolbar()
  })

  selectedTab = webContentsView

  baseWindow.contentView.addChildView(webContentsView)
}

/**
 * Closes a specific tab and removes it from the application.
 * @param id The ID of the tab to close
 */
export function closeTab(id: number) {
  const idx = tabs.findIndex((tab) => tab.webContents.id === id)
  if (idx === -1) {
    return
  }
  const baseWindow = getBaseWindow()
  if (baseWindow) {
    baseWindow.contentView.removeChildView(tabs[idx])
  }
  tabs[idx].webContents.close()
  tabs.splice(idx, 1)
  saveTabs()
}

/**
 * Temporarily hides a tab from view without destroying it.
 * @param id The ID of the tab to hide
 */
export function hideTab(id: number) {
  const tab = tabs.find((tab) => tab.webContents.id === id)
  if (tab == null) {
    return
  }
  const baseWindow = getBaseWindow()
  if (baseWindow === null) {
    return
  }
  baseWindow.contentView.removeChildView(tab)
}

/**
 * Closes all open tabs.
 * @param options Optional configuration object
 * @param options.save Whether to save the tabs state before closing (default: true)
 */
export function closeAllTabs({ save = true }: { save?: boolean } = {}) {
  if (save) {
    saveTabs()
  }

  for (const tab of tabs) {
    tab.webContents.close()
  }

  tabs.splice(0, tabs.length)
  if (!save) {
    saveTabs()
  }
}

/**
 * Retrieves a tab by its ID.
 * @param id The ID of the tab to find
 * @returns The WebContentView if found, undefined otherwise
 */
export function getTab(id: number) {
  return tabs.find((tab) => tab.webContents.id === id)
}

/**
 * Gets all currently open tabs.
 * @returns Array of all WebContentsViews
 */
export function getAllTabs(): WebContentsView[] {
  return tabs
}

/**
 * Gets the IDs of all open tabs.
 * @returns Array of tab IDs
 */
export function getAllTabIds(): number[] {
  if (tabs.length === 0) {
    return []
  }
  const ids = tabs.map((tab) => tab.webContents.id)
  return ids
}

/**
 * Gets the currently selected tab.
 * @returns The active WebContentsView or null if none selected
 */
export function getSelectedTab(): WebContentsView | null {
  return selectedTab
}

/**
 * Changes the selected tab.
 * @param id The ID of the tab to select
 */
export function setSelectedTab(id: number) {
  if (selectedTab) {
    if (id === selectedTab.webContents.id) {
      return
    }
  }
  const idx = tabs.findIndex((tab) => tab.webContents.id === id)
  if (idx === -1) {
    return
  }
  showContent(tabs[idx])
  saveSelectedTab({ tabIndex: idx })
}

/**
 * Saves the currently selected tab index to storage.
 * @param options Optional configuration object
 * @param options.tabIndex Specific tab index to save as selected
 */
function saveSelectedTab({ tabIndex = -1 }: { tabIndex?: number } = {}) {
  if (tabIndex !== -1) {
    setSelected(tabIndex)
    return
  }

  if (selectedTab === null) {
    return
  }
  const idx = tabs.findIndex((tab) => {
    if (selectedTab === null) return false
    return tab.webContents.id === selectedTab!.webContents.id
  })
  if (idx === -1) {
    return
  }
  setSelected(idx)
}

/**
 * Gets the ID of the currently selected tab.
 * @returns The ID of the selected tab, or -1 if none selected
 */
export function getSelectedTabId() {
  if (selectedTab === null) return -1
  return selectedTab.webContents.id
}

/**
 * Reorders tabs based on an array of tab IDs.
 * @param ids Array of tab IDs in the desired order
 */
export function reorderTabs(ids: number[]) {
  const newTabs = ids
    .map((id) => tabs.find((tab) => tab.webContents.id === id))
    .filter((tab): tab is WebContentsView => tab !== undefined)
  if (newTabs.length === 0) return
  tabs.splice(0, tabs.length, ...newTabs)
  saveTabs()
  saveSelectedTab()
}

/**
 * Saves the current tabs state to storage.
 */
export function saveTabs() {
  const mainWindow = getBaseWindow()
  if (mainWindow === null) {
    return
  }
  const tabUrls = tabs.map((tab) => {
    const url = tab.webContents.getURL()
    const idx = url.indexOf('#')
    return idx === -1 ? '/' : url.substring(idx + 1)
  })

  setTabs(tabUrls)
}

/**
 * Restores tabs from the previous session, or loads the root tab if restore is disabled.
 * @param options Optional configuration object
 * @param options.restore Whether to restore previous session tabs (default: true)
 * @returns Promise resolving to the selected tab's WebContentsView or null
 */
export async function restoreTabs({
  restore = false
}: {
  restore?: boolean
} = {}): Promise<WebContentsView | null> {
  if (!restore) {
    return loadTabContent(NavigationRoutes.root)
  }

  const lastSessionTabs = getTabs()
  let selectedTabIndex = getSelected()

  if (lastSessionTabs && lastSessionTabs.length > 0) {
    if (selectedTabIndex < 0 || selectedTabIndex >= lastSessionTabs.length) {
      selectedTabIndex = 0
    }

    for (let i = 0; i < lastSessionTabs.length; i++) {
      if (i === selectedTabIndex) {
        selectedTab = await loadTabContent(lastSessionTabs[i])
      } else {
        loadTabContent(lastSessionTabs[i])
      }
    }
  }

  if (!selectedTab) {
    selectedTab = await loadTabContent(NavigationRoutes.root)
  }

  return selectedTab
}
