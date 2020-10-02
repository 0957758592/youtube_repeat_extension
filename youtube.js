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
 
console.log(" YouTubeRepead STARTED ")
var frame = document.getElementById("youTubeRepead");
  
(function start() {

  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = "youTubeRepead"
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    document.body.appendChild(frame);
  }
})()

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  let trackSearch = message.linkURL ? message.linkURL : window.location.search
  let isMix = trackSearch.indexOf("&");
  let trackId = trackSearch.substring(
    trackSearch.indexOf("v=") + 2,
    isMix != -1 ? isMix : trackSearch.length
  );

  frame.src = message.action ? `https://www.youtube.com/embed/${trackId}?&autoplay=1&loop=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist=${trackId}` : "";
});

