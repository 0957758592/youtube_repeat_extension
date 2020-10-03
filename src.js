/**
 * MIT License
 * 
 * Copyright (c) 2020 Roman Danilov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
**/

"use strict";
const YOUTUBE_TRACK = "https://www.youtube.com/watch?v=";
const YOUTUBE = "https://www.youtube.com/";
let start = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'page_reload') {
		console.log("page reloaded")
		setStatus(start = false, true);
	}
});

chrome.contextMenus.create({
	id: 'YouTube_Repeat',
	title: 'YouTube Repeat',
	contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tabs) => {
	if (info.menuItemId === 'YouTube_Repeat' && info.linkUrl.includes(YOUTUBE_TRACK)) {
		messaging(tabs, info, false);
	}
});

chrome.tabs.onUpdated.addListener(
	function (tabId, info, tab) {
		// if (info.url) {
		// 	useListener(tabId);
		// }

		if (tab.url.includes(YOUTUBE) && info.status == "complete") {
			console.log("before exec")
			chrome.tabs.executeScript(tabId, {
				file: "youtube.js"
			})
		}
	}
);

// chrome.tabs.onActivated.addListener(function (activeInfo) {
// 	useListener(activeInfo.tabId);
// });

chrome.browserAction.onClicked.addListener(function (tabs) {
	callYouTube(tabs, true);
});

function callYouTube(tabs, isBrowserAction = false) {
	chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs, info) {
		if (tabs[0].url.startsWith(YOUTUBE_TRACK) || (tabs[0].url.match(/https\:\/\/www\.youtube\.com/) && start)) {
			messaging(tabs, info, isBrowserAction);
		} 
		if (!tabs[0].url.match(/https\:\/\/www\.youtube\.com/)) {
			window.open(YOUTUBE, '_blank');
		}
	});
}

function messaging(tabs, info, isBrowserAction) {
	let tabId = (tabs[0] && tabs[0].id) || tabs.id;
	let linkURL = info && info.linkUrl || tabs[0] && tabs[0].url

	!isBrowserAction ? isLinkExist(linkURL) : localStorage.setItem("_linkURL", linkURL);;
	chrome.tabs.sendMessage(tabId, { action: start = !start, linkURL: linkURL });
	setStatus(start);
}

function isLinkExist(linkURL) {
	let isLink = localStorage.getItem("_linkURL");
	if (isLink && (isLink != linkURL)) {
		start = !start;
	}
	localStorage.setItem("_linkURL", linkURL);
}

function setStatus(status, reset = false) {
	chrome.browserAction.setBadgeText({ text: status ? "on" : (reset ? "" : "off") }, null);
	chrome.browserAction.setBadgeBackgroundColor({ color: status ? [0, 180, 0, 100] : [180, 0, 0, 100] }, null);
	!status ? localStorage.removeItem("_linkURL") : null;
}

// function useListener(tabId) {
// 	chrome.tabs.get(tabId, function (tab) {
// 		tab.url.includes(YOUTUBE_TRACK) ?
// 			chrome.browserAction.enable(tab.id) :
// 			chrome.browserAction.disable(tab.id);
// 	});
// }
