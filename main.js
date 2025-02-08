// ==UserScript==
// @name         leetcode2notion
// @namespace    wuyifff
// @version      1.2
// @description  Save LeetCode problems to Notion after clicking a button.
// @author       wuyifff
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/problems/*
// @connect      api.notion.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @homepage     https://github.com/wuyifff/leetcode2notion
// @downloadURL https://update.greasyfork.org/scripts/507388/leetcode2notion.user.js
// @updateURL https://update.greasyfork.org/scripts/507388/leetcode2notion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // replace to your own token and ID
    const notionToken = 'xxx';  // Notion API token
    const databaseId = 'xxx';  // Notion database ID
    const lcName = 'xxx'// 你的leetcode昵称

    // 1. add save button
    // select language button (optional)
    let currentMinutes = 0;
    let currentSeconds = 0;
    let selectedLanguage = 'java'; // 默认语言
    function addUIElements() {
        // 1.1 save button
        const button = document.createElement("button");
        button.innerHTML = "Save to Notion";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.right = "10px";
        button.style.zIndex = 1000;
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = saveProblemToNotion;

        // 1.2 save language button (disabled)
        const select = document.createElement("select");
        select.id = "languageSelect";
        select.style.position = "fixed";
        select.style.bottom = "50px";
        select.style.right = "10px";
        select.style.zIndex = 1000;
        select.style.padding = "10px";
        select.style.backgroundColor = "#4CAF50";
        select.style.color = "white";
        select.style.border = "none";
        select.style.borderRadius = "5px";
        select.style.cursor = "pointer";
        // 创建语言选项
        const languages = [
            { value: 'java', text: 'Java' },
            { value: 'python', text: 'Python' },
            { value: 'cpp', text: 'C++' },
            { value: 'javascript',text: 'JavaScript'}
        ];

        languages.forEach(lang => {
            const option = document.createElement("option");
            option.value = lang.value;
            option.innerText = lang.text;
            select.appendChild(option);
        });

        // 添加改变事件监听器
        select.addEventListener('change', function(e) {
            selectedLanguage = e.target.value;
            // 可以在这里添加其他需要随语言改变的逻辑
            console.log(`Language changed to: ${selectedLanguage}`);
        });

        const container = document.createElement("div");
        container.id = "save"
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.marginLeft = "10px";
        container.appendChild(select);
        container.appendChild(button);
        container.style.position = "fixed";
        container.style.bottom = "10px";
        container.style.right = "10px";
        document.body.appendChild(container);
    }
    function addTimer() {
        // Create timer span if it doesn't exist
        let timerSpan = document.querySelector('#timerSpan');
        if (!timerSpan) {
            timerSpan = document.createElement("span");
            timerSpan.id = "timerSpan";
            timerSpan.className = 'ml-2 group/nav-back cursor-pointer gap-2 hover:text-lc-icon-primary dark:hover:text-dark-lc-icon-primary flex items-center h-[32px] transition-none hover:bg-fill-quaternary dark:hover:bg-fill-quaternary text-gray-60 dark:text-gray-60 px-2';

            // Append the timer span to the target location
            const targetDiv = document.getElementById('ide-top-btns');
            if (targetDiv) {
                targetDiv.appendChild(timerSpan);
                console.log("append timer success");
            } else {
                console.log("no ide-top-btns element!");
            }
        }
    }

    function updateTimer() {
        const now = new Date().getTime();  // Get the current time
        const elapsedTime = now - startTime;  // Calculate the elapsed milliseconds
        const totalSeconds = Math.floor(elapsedTime / 1000);  // Convert to seconds
        currentMinutes = Math.floor(totalSeconds / 60);
        currentSeconds = totalSeconds % 60;
        const formattedMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;
        const formattedSeconds = currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;

        // Make sure timerSpan is available
        let timerSpan = document.querySelector('#timerSpan');
        if (!timerSpan) {
            addTimer();
            timerSpan = document.querySelector('#timerSpan'); // Re-select after creation
        }

        // Update the timer content
        timerSpan.textContent = `Time: ${formattedMinutes}:${formattedSeconds}`;
    }

    // 2. get leetcode problem info
    function getProblemData() {
        const title = document.querySelector('.text-title-large a')?.innerText || 'No title found';
        const difficultyElement = document.querySelector("div[class*='text-difficulty-']");
        const difficulty = difficultyElement ? difficultyElement.innerText : 'No difficulty found';
        const url = window.location.href;
        const tagElements = document.querySelectorAll("a[href*='/tag/']");
        const tagTexts = Array.from(tagElements).map(element => element.innerText);
        // 从数据中提取题目编号
        const number = document.querySelector("#__NEXT_DATA__").text.match(/questionId":"(\d+)"/)[1];
        const time = document.querySelector("#timerSpan").innerText.split(': ')[1]
        const desc = document.querySelector(`[data-track-load="description_content"]`)
        // 构建localStorage中的key
        const storageKey = `ugc_${lcName}_${number}_${selectedLanguage}_code`;

        // 从localStorage获取缓存的数据
        const cachedData = localStorage.getItem(storageKey);
        let codeText = '';
        if (cachedData) {
            try {
                // 解析JSON数据
                const parsedData = JSON.parse(cachedData);
                // 将code赋值给problem.code
                codeText = parsedData.code;
            } catch (error) {
                console.error('解析缓存数据时出错:', error);
            }
        }
        const elements = desc.querySelectorAll('p, pre,ul');

        const descText = [];

        elements.forEach(element => {
            if (element.tagName.toLowerCase() === 'p'|| element.tagName.toLowerCase() === 'ul') {
                descText.push({
                    "paragraph": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": element.textContent,
                                }
                            }
                        ]
                    }
                });
            } else if (element.tagName.toLowerCase() === 'pre') {
                descText.push({
                    "quote": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {
                                    "content": element.textContent,
                                    "link": null
                                }
                            }
                        ]
                    }
                });
            }
        });
        //console.log(codeText);
        //const selectedLanguage = document.getElementById("languageSelect").value;

        return {
            title: title,
            difficulty: difficulty,
            url: url,
            tag: tagTexts,
            desc:descText,
            code: codeText,
            language: selectedLanguage,
            time: time
        };
    }

    // 3. save to notion and check if duplicate
    async function saveProblemToNotion() {
        const problemData = getProblemData();
        console.log(problemData);

        const searchUrl = `https://api.notion.com/v1/search`;
        const searchBody = {
            "query": problemData.title,
            "filter": {
                "value": "page",
                "property": "object"
            },
            "sort": {
                "direction": "ascending",
                "timestamp": "last_edited_time"
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: searchUrl,
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            data: JSON.stringify(searchBody),
            onload: function(searchResponse) {
                if (searchResponse.status === 200) {
                    const searchResult = JSON.parse(searchResponse.responseText);
                    const existingPage = searchResult.results.find(result => result.properties?.Title?.title[0]?.text?.content === problemData.title);

                    if (existingPage) {
                        const existingPageUrl = existingPage.url;
                        alert('Problem already exists in Notion! Opening existing page...');
                        window.open(existingPageUrl, '_blank');
                    } else {
                        createNewNotionPage(problemData);
                    }
                } else {
                    console.error('Error searching Notion database', searchResponse.responseText);
                    alert('Failed to search Notion database. Check the console for details.');
                }
            },
            onerror: function(error) {
                console.error('Error in searching Notion database', error);
                alert('An error occurred while searching Notion database.');
            }
        });
    }

    /**
 * 将代码内容分割成Notion富文本块
 * @param {object} problemData - 包含code属性的问题数据对象
 * @param {number} [chunkSize=1500] - 每个块的最大字符数（默认1500）
 * @returns {Array} 返回格式化后的富文本块数组
 */
    function splitCodeIntoBlocks(code, chunkSize = 1500) {
        const chunks = [];
        let remaining = code;

        // 分割代码
        while (remaining.length > 0) {
            if (remaining.length <= chunkSize) {
                chunks.push(remaining);
                break;
            }

            // 在块大小限制内找最后一个换行符
            let splitIndex = remaining.lastIndexOf('\n', chunkSize);

            // 如果没找到换行符，就在单词边界分割
            if (splitIndex === -1 || splitIndex > chunkSize) {
                splitIndex = remaining.lastIndexOf(' ', chunkSize);
                if (splitIndex === -1 || splitIndex > chunkSize) {
                    splitIndex = chunkSize;
                }
            }

            chunks.push(remaining.substring(0, splitIndex));
            remaining = remaining.substring(splitIndex).trimLeft();
        }

        // 转换为Notion富文本块格式
        return chunks.map(chunk => ({
            type: 'text',
            text: {
                content: chunk
            }
        }));
    }
    // 4. create new page
    function createNewNotionPage(problemData) {
        const tags = problemData.tag.map(tag => ({
            name: tag
        }));
        const code = splitCodeIntoBlocks(problemData.code);
        const url = `https://api.notion.com/v1/pages`;
        const body = {
            parent: { database_id: databaseId },
            properties: {
                '题目': {
                    title: [
                        {
                            text: {
                                content: problemData.title
                            }
                        }
                    ]
                },
                '难度': {
                    select: {
                        name: problemData.difficulty
                    }
                },
                '链接': {
                    url: problemData.url
                },
                '题解参考': {
                    url: problemData.url+'solutions/'
                },
                '创建日期': {
                    date: {
                        start: new Date().toISOString().split('T')[0] // format YYYY-MM-DD
                    }
                },
                '标签': {
                    multi_select: tags
                },
                '耗时': {
                    rich_text:[
                        {
                         text:{
                               content: problemData.time
                        }
                    }
                ]
                },
                '刷题次数': {
                    number: 1
                },
            },
            children: [
                {
                    "heading_1": {
                        "rich_text": [{
                            "type": "text",
                            "text": {
                                "content": "题目介绍",
                                "link": null
                            }
                        }],
                        "color": "default",
                        "is_toggleable": true,
                        children:problemData.desc
                    }
                },
                {
                    "heading_1": {
                        "rich_text": [{
                            "type": "text",
                            "text": {
                                "content": "解题思路",
                                "link": null
                            }
                        }],
                        "color": "default",
                        "is_toggleable": true,
                    }
                },
                {
                    "heading_1": {
                        "rich_text": [{
                            "type": "text",
                            "text": {
                                "content": "解题代码",
                                "link": null
                            }
                        }],
                        "color": "default",
                        "is_toggleable": true,
                        children:[{
                            code: {
                                rich_text:code,
                                language: problemData.language
                            }
                        }]
                    }
                }
            ]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Authorization': `Bearer ${notionToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            data: JSON.stringify(body),
            onload: function(response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    const notionPageUrl = responseData.url;
                    alert('Problem saved to Notion!');
                    window.open(notionPageUrl, '_blank');
                } else {
                    console.error('Failed to save to Notion', response.responseText);
                    alert('Failed to save to Notion. Check the console for more details.');
                }
            },
            onerror: function(error) {
                console.error('Error in saving to Notion', error);
                alert('An error occurred while saving to Notion.');
            }
        });
    }

    addUIElements();
    let startTime;  // Record the start time
    setTimeout(function() {
        startTime = new Date().getTime();
        var tmp = setInterval(updateTimer, 1000);  // update every second
    }, 5000);  // delay 5 seconds
})();
