[English Version](#introduction) | [中文版](#简介)

# LeetCode2Notion

##  简介
`LeetCode2Notion` 是一个 Tampermonkey 用户脚本，允许你快速将 LeetCode 题目信息（如题目、难度、标签、代码等）保存到 Notion 数据库中。通过点击一个按钮，脚本会将当前 LeetCode 页面上的题目信息保存到你预先配置的 Notion 数据库中。

##  功能
- 在 LeetCode 页面上添加一个按钮，点击后将题目信息保存到 Notion。
- 自动检查 Notion 数据库中是否已经存在该题目，避免重复创建。
- 支持保存题目的标题、难度、链接、标签以及代码等信息。
- 支持 LeetCode 的中文站（leetcode.cn）和国际站（leetcode.com）。

##  安装

###  1. 安装 Tampermonkey
首先，你需要安装 [Tampermonkey](https://www.tampermonkey.net/)，这是一个流行的用户脚本管理器，支持多种浏览器。

###  2. 安装用户脚本

1. 打开 Tampermonkey 仪表盘，点击 **"添加新脚本"**。
2. 将本仓库的 `main.js` 脚本代码粘贴到编辑器中。
3. 点击保存，脚本将会自动应用到 LeetCode 网站上。

或者直接通过脚本安装链接安装：
```bash
https://github.com/wuyifff/leetcode2notion/raw/main/main.js
```

##  配置

###  1. 获取 Notion API Token
要将题目保存到 Notion，你需要创建一个 Notion 集成并获取 `API Token`：

1. 访问 [Notion Developer Portal](https://www.notion.so/my-integrations) 并创建一个新的集成。
2. 在创建的集成中复制 **Integration Token**，将其粘贴到脚本中的 `notionToken` 变量。

###  2. 获取 Notion Database ID
1. 打开你的 Notion 数据库。
2. 复制数据库页面 URL 中的 `database_id`，它是一串 32 位的 UUID，类似于：

```
https://www.notion.so/workspace/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

其中 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` 就是 `database_id`，将其粘贴到脚本中的 `databaseId` 变量中。

###  3. 更新脚本中的 Token 和 Database ID
打开 Tampermonkey，编辑 `leetcode2notion` 脚本，将以下部分替换为你的 Notion API Token 和 Database ID：

```javascript
const notionToken = 'your-notion-token-here';
const databaseId = 'your-database-id-here';
```

## Notion 数据库字段说明 (Notion Database Description)

为了确保脚本正确保存题目信息，请确保你的 Notion 数据库具有以下字段：

| 字段名称 (Field Name) | 类型 (Type)   | 说明 (Description)                                       |
|-----------------------|---------------|----------------------------------------------------------|
| **Title (标题)**       | `text`        | 存储 LeetCode 题目的标题。                               |
| **Difficulty (难度)**  | `select`      | 存储 LeetCode 题目的难度，例如 `简单`、`中等`、`困难`。 |
| **Link (链接)**        | `url`         | 存储题目链接，方便直接从 Notion 打开对应的 LeetCode 页面。|
| **Date (日期)**        | `date`        | 保存问题保存到 Notion 的日期。                           |
| **Tags (标签)**        | `multi-select`| 存储题目的标签，比如 `二叉树`、`动态规划` 等，支持多个标签。|

### 表格模板地址 (Table Template URL)

你可以使用以下 Notion 数据库模板，直接复制并使用：
[Notion Template 链接](https://wuyifff.notion.site/ac695b0ee80e436382447c6554745ef8?v=dfef27d69ba7475f9bf1fac08870ff7e&pvs=4)

该模板已经预先设置好了所需的字段和类型，可以直接使用或根据需求调整。

##  使用方法

1. 安装并配置好脚本后，打开 [LeetCode](https://leetcode.com/) 或 [LeetCode 中文站](https://leetcode.cn/)。
2. 在题目页面的右下角，你会看到一个 `Save to Notion` 按钮。
3. 点击按钮，题目信息将自动保存到你的 Notion 数据库中。如果该题目已经存在，脚本会打开已有的页面。

---

##  Introduction
`LeetCode2Notion` is a Tampermonkey userscript that allows you to quickly save LeetCode problem information (such as title, difficulty, tags, code, etc.) to a Notion database. By clicking a button, the script saves the LeetCode problem information from the current page to your pre-configured Notion database.

##  Features
- Adds a button on LeetCode pages to save the problem information to Notion with a click.
- Automatically checks if the problem already exists in the Notion database to avoid duplication.
- Supports saving problem title, difficulty, URL, tags, and code.
- Supports both LeetCode's Chinese site (leetcode.cn) and international site (leetcode.com).

##  Installation

###  1. Install Tampermonkey
First, you need to install [Tampermonkey](https://www.tampermonkey.net/), a popular userscript manager that supports multiple browsers.

###  2. Install Userscript

1. Open the Tampermonkey dashboard, and click **"Add a new script"**.
2. Paste the code from `main.js` in this repository into the editor.
3. Click save, and the script will automatically apply to the LeetCode website.

Or install the script directly via the install link:
```bash
https://github.com/wuyifff/leetcode2notion/raw/main/main.js
```

##  Configuration

###  1. Get Notion API Token
To save problems to Notion, you need to create a Notion integration and get the `API Token`:

1. Visit the [Notion Developer Portal](https://www.notion.so/my-integrations) and create a new integration.
2. Copy the **Integration Token** from the integration you created and paste it into the `notionToken` variable in the script.

###  2. Get Notion Database ID
1. Open your Notion database.
2. Copy the `database_id` from the URL of your database page, which is a 32-character UUID like this:

```
https://www.notion.so/workspace/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?v=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Here, `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` is the `database_id`, which you will paste into the `databaseId` variable in the script.

###  3. Update Token and Database ID in Script
Open Tampermonkey, edit the `leetcode2notion` script, and replace the following parts with your Notion API Token and Database ID:

```javascript
const notionToken = 'your-notion-token-here';
const databaseId = 'your-database-id-here';
```

## Notion Database Fields Description

To ensure the script correctly saves problem information, make sure your Notion database contains the following fields:

| Field Name         | Type           | Description                                                    |
|--------------------|----------------|----------------------------------------------------------------|
| **Title**           | `text`         | Stores the title of the LeetCode problem.                      |
| **Difficulty**      | `select`       | Stores the problem difficulty, such as `Easy`, `Medium`, or `Hard`. |
| **Link**            | `url`          | Stores the URL of the problem for easy access from Notion.      |
| **Date**            | `date`         | Saves the date when the problem is added to Notion.             |
| **Tags**            | `multi-select` | Stores tags for the problem, such as `Tree`, `Dynamic Programming`, etc. Multiple tags are supported. |

### Table Template URL

You can use the following Notion database template directly:
[Notion Template Link](https://wuyifff.notion.site/ac695b0ee80e436382447c6554745ef8?v=dfef27d69ba7475f9bf1fac08870ff7e&pvs=4)

This template is pre-configured with the required fields and types, ready to use or modify as needed.

##  Usage

1. After installing and configuring the script, open [LeetCode](https://leetcode.com/) or [LeetCode CN](https://leetcode.cn/).
2. In the bottom right corner of the problem page, you will see a `Save to Notion` button.
3. Click the button, and the problem information will be automatically saved to your Notion database. If the problem already exists, the script will open the existing page.
