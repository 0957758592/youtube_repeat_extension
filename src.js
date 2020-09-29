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
const YOUTUBE = "https://www.youtube.com/";
let start = true;

chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
		if (changeInfo.url) {
			useListener(tabId);
		}
	}
);

chrome.tabs.onActivated.addListener(function (activeInfo) {
	useListener(activeInfo.tabId);
});

chrome.browserAction.onClicked.addListener(function (tabs) {
	chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
		start ?
			chrome.tabs.executeScript(tabs[0].id, { file: "youtube.js" }, messaging(tabs)) :
			messaging(tabs);
	});
});

function messaging(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, { action: start = !start });
}

function getStatus(status) {
	chrome.browserAction.setBadgeText({ text: status ? "on" : "off" }, null);
	chrome.browserAction.setBadgeBackgroundColor({ color: status ? [0, 180, 0, 100] : [180, 0, 0, 100] }, null);
}

function useListener(tabId) {
	chrome.tabs.get(tabId, function (tab) {
		tab.url.includes(YOUTUBE) ?
			chrome.browserAction.enable(tab.id, getStatus(true)) :
			chrome.browserAction.disable(tab.id, getStatus(false));
	});
}
