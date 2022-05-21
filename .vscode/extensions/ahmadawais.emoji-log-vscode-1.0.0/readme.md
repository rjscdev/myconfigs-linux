<h1 align="center">
  <a href="https://github.com/ahmadawais/Emoji-Log-VSCode"><img src="https://on.ahmda.ws/pXeE/c" /></a>

`EMOJI-LOG-VSCode`

<div align="center"><p><a href="https://VSCode.pro/?utm_source=EmojiLogVSCode"><img alt="Learn VSCode" align="center" src="https://img.shields.io/badge/%F0%9F%A6%84-Become%20a%20VSCode%20Power%20User%20%E2%86%92-gray.svg?colorA=5734F5&colorB=5734F5&style=flat" /></a>

</h1>

<h5 align="center">

After building [hundreds of open source software](https://github.com/ahmadawais) I've ended up inventing a git commit log standard called `EMOJI-LOG` that helps me understand a project's history with a less cognitive load just by looking at the git log.

</h5>

## USAGE

1. Open the command palette (macOS: <kbd>`⌘`</kbd> + <kbd>`⇧`</kbd> + <kbd>`P`</kbd> | Win/Linux: <kbd>`⌃`</kbd> + <kbd>`⇧`</kbd> + <kbd>`P`</kbd>)
2. Search and select the `Emoji-Log` option
3. Chose the appropriate Emoji-Log prefix
4. Emoji-Log will add itself to the Git message box as a prefix
5. Write the git commit message and commit it.

[![⚙️](https://github.com/ahmadawais/Emoji-Log-VSCode/raw/master/./images/emoij-log.gif)](https://marketplace.visualstudio.com/items?itemName=ahmadawais.emoji-log-vscode)

**ALTERNATIVELY**:

1. Open the Source Control View (where you write the Git commit message)
2. Click the Smile Button ☻ in the navigation menu in the top bar
3. Chose the appropriate Emoji-Log prefix
4. Emoji-Log will add itself to the Git message box as a prefix
5. Write the git commit message and commit it.

<br>

![Install](https://raw.githubusercontent.com/ahmadawais/shades-of-purple-vscode/master/images/4_install.png)

## EASY INSTALLATION

1. Open the extensions sidebar on Visual Studio Code
2. Search for **ahmadawais.emoji-log-vscode**
3. Click **Install** to install it.
4. 🌟 [Rate five-stars](https://marketplace.visualstudio.com/items?itemName=ahmadawais.emoji-log-vscode&ssr=false#review-details).

#### ALTERNATE INSTALLATION

1. Launch Quick Open using <kbd>COMMAND (⌘)</kbd>+<kbd>P</kbd> OR <kbd>CONTROL (⌃)</kbd>+<kbd>P</kbd>.
2. Paste the command `ext install ahmadawais.emoji-log-vscode`
3. Click **Install** to install it.
4. 🌟 [Rate five-stars](https://marketplace.visualstudio.com/items?itemName=ahmadawais.emoji-log-vscode&ssr=false#review-details).

<br>

![Philosophy](https://on.ahmda.ws/orq5/c)

### PHILOSOPHY

I like emoji. I like ’em a lot. Programming, code, geeks/nerds, open-source, all of that is inherently dull and sometimes boring. Emoji (which is, in fact, the plural of emoji) helps me add colors and emotions to the mix. Nothing wrong if you want to attach feelings to this 2D flat text-based world of code. I found out that instead of memorizing [hundreds of emoji](https://gitmoji.carloscuesta.me/) it's better to keep the categories small and general.


1. **IMPERATIVE** ↓
    - Make your Git commit messages imperative.
    - Write commit message like you're giving an order.
    - E.g., Use ✅ `Add` instead of ❌ `Added`.
    - E.g., Use ✅ `Create` instead of ❌ `Creating`.
1. **RULES** ↓
    - A small number of categories — easy to memorize.
    - Nothing more nothing less.
    - E.g. `📦 NEW`, `👌 IMPROVE`, `🐛 FIX`, `📖 DOC`, `🚀 RELEASE`, `🤖 TEST`, and `‼️ BREAKING`
2. **ACTIONS** ↓
    - Make git commits based on the actions you take.
    - Use a good editor like [VSCode](https://code.visualstudio.com/) to commit the right files with commit messages.
<br>

[![Start](https://on.ahmda.ws/osd3/c)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

### GETTING STARTED

Only use the following Git Commit Messages. A simple and small footprint is critical here.

1. `📦 NEW: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when you add something entirely new.
    > E.g. `📦 NEW: Add Git ignore file`

1. `👌 IMPROVE: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when you improve/enhance piece of code like refactoring etc.
    > E.g. `👌 IMPROVE: Remote IP API Function`

1. `🐛 FIX: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when you fix a bug — need I say more?
    > E.g. `🐛 FIX: Case conversion`

1. `📖 DOC: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when you add documentation like `README.md`, or even inline docs.
    > E.g. `📖 DOC: API Interface Tutorial`


1. `🚀 RELEASE: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when you release a new version.
    > E.g. `🚀 RELEASE: Version 2.0.0`


1. `🤖 TEST: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when it's related to testing.
    > E.g. `🤖 TEST: Mock User Login/Logout`


1. `‼️ BREAKING: IMPERATIVE_MESSAGE_GOES_HERE`
    > Use when releasing a change that breaks previous versions.
    > E.g. `‼️ BREAKING: Change authentication protocol`

_— That's it for now. Nothing more nothing less._

<br>

[![More](https://on.ahmda.ws/orsm/c)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

#### THE WORKFLOW & MEANINGS

I'd like to share what each of these emojis mean.

- `📦 NEW:` Emoji meaning: A "package emoji" — which can contain new stuff.
- `👌 IMPROVE:` Emoji meaning: An "OK Hand emoji" — which is meant to appreciate an improvement.
- `🐛 FIX:` Emoji meaning: A "bug emoji" — which means there was a bug that got fixed.
- `📖 DOCS:` Emoji meaning: A "book emoji" — which means documentation or notes just like in a book.
- `🚀 RELEASE:` Emoji meaning: A "rocket emoji" — which is meant to show a new release/launch.
- `🤖 TEST:` Emoji meaning: A "robot emoji" — which says some test were run successfully.
- `‼️ BREAKING:` Emoji meaning: A "bangbang emoji" — which attracts attention to a breaking change.

For quick prototyping, I have made the following functions that you can add to your `.bashrc`/`.zshrc` files and use Emoji-Log quickly.

```sh
#.# Better Git Logs.
### Using EMOJI-LOG (https://github.com/ahmadawais/Emoji-Log).

# Git Commit, Add all and Push — in one step.
function gcap() {
    git add . && git commit -m "$*" && git push
}

# NEW.
function gnew() {
    gcap "📦 NEW: $@"
}

# IMPROVE.
function gimp() {
    gcap "👌 IMPROVE: $@"
}

# FIX.
function gfix() {
    gcap "🐛 FIX: $@"
}

# RELEASE.
function grlz() {
    gcap "🚀 RELEASE: $@"
}

# DOC.
function gdoc() {
    gcap "📖 DOC: $@"
}

# TEST.
function gtst() {
    gcap "🤖 TEST: $@"
}

# BREAKING CHANGE.
function gbrk() {
    gcap "‼️ BREAKING: $@"
}
```

To install these functions for the fish shell, run the following commands:

```sh
function gcap; git add .; and git commit -m "$argv"; and git push; end;
function gnew; gcap "📦 NEW: $argv"; end
function gimp; gcap "👌 IMPROVE: $argv"; end;
function gfix; gcap "🐛 FIX: $argv"; end;
function grlz; gcap "🚀 RELEASE: $argv"; end;
function gdoc; gcap "📖 DOC: $argv"; end;
function gtst; gcap "🤖 TEST: $argv"; end;
function gbrk; gcap "‼️ BREAKING: $argv"; end;
funcsave gcap
funcsave gnew
funcsave gimp
funcsave gfix
funcsave grlz
funcsave gdoc
funcsave gtst
funcsave gbrk
```

If you prefer, you can paste these aliases directly in your `~/.gitconfig` file:

```sh
# Make sure you're adding under the [alias] block.
[alias]
  # Git Commit, Add all and Push — in one step.
  cap = "!f() { git add .; git commit -m \"$@\"; git push; }; f"

  # NEW.
  new = "!f() { git cap \"📦 NEW: $@\"; }; f"
  # IMPROVE.
  imp = "!f() { git cap \"👌 IMPROVE: $@\"; }; f"
  # FIX.
  fix = "!f() { git cap \"🐛 FIX: $@\"; }; f"
  # RELEASE.
  rlz = "!f() { git cap \"🚀 RELEASE: $@\"; }; f"
  # DOC.
  doc = "!f() { git cap \"📖 DOC: $@\"; }; f"
  # TEST.
  tst = "!f() { git cap \"🤖 TEST: $@\"; }; f"
  # BREAKING CHANGE.
  brk = "!f() { git cap \"‼️ BREAKING: $@\"; }; f"
```

<br>

[![Using](https://on.ahmda.ws/rP6e/c)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

### USING `EMOJI-LOG`

Here's a list of repos that make use of Emoji-Log.

- [Create-Guten-Block Toolkit →](https://github.com/ahmadawais/create-guten-block/commits/)
- [VSCode Shades of Purple Theme →](https://github.com/ahmadawais/shades-of-purple-vscode/commits/)
- [Ahmad Awais GitHub Repos →](https://github.com/ahmadawais) — _Latest repos on this account._
- [CaptainCore CLI (WordPress Management Toolkit) →](https://github.com/CaptainCore/captaincore-cli/commits/)
- [CaptainCore GUI (WordPress plugin) →](https://github.com/CaptainCore/captaincore-gui/commits/)
- **You?!** Add your repo to the list after adding the Emoji-log badge to your readme.

<br>

[![AlfredSnippets](https://on.ahmda.ws/05bd88/c)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

### Alfred Snippets

[Alfred](https://www.alfredapp.com/) [PowerPack](https://www.alfredapp.com/powerpack/) users can use the Snippets feature to quickly call Emoji-Log, or use the text expand feature for even quicker creation.

To setup:

1. Have Alfred 3 with PowerPack installed
2. For auto-expansion, in _Alfred Settings » Features » Snippets_ ensure the "Automatically expand snippets by Keyword" box is checked
3. Download & open [`Emoji-Log.alfredsnippets`](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/Emoji-Log.alfredsnippets), deselecting "Strip snippets of 'auto expand' flag" when prompted

This will give the following text expander keywords for the Emoji-Log:

| Keyword |   Snippet    |
| ------- | ------------ |
| `;gnew` | 📦 NEW:      |
| `;gimp` | 👌 IMPROVE:  |
| `;gfix` | 🐛 FIX:      |
| `;grlz` | 🚀 RELEASE:  |
| `;gdoc` | 📖 DOC:      |
| `;gtst` | 🤖 TEST:     |
| `;gbrk` | ‼️ BREAKING:  |

To edit the `;` prefix to your preferred expansion flag, double click right click the Emoji-Log Collection in _Alfred Settings » Features » Snippets_.

> TextExpander Snippets are also available. Download & open [`Emoji-Log.textexpander`](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/Emoji-Log.textexpander) to import.

<br>

[![badge](https://on.ahmda.ws/rOMZ/c)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

### `EMOJI-LOG` BADGE COLLECTION

If your repo uses `EMOJI-LOG` then you can add any of the following badges to your read me and send me a PR to list your repo here.

<br>

![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)

- **STYLE**: Flat Square
- **MARKDOWN** ↓

```markdown
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)
```

- **HTML** ↓

```html
<a href="https://github.com/ahmadawais/Emoji-Log/"><img alt="emoji-log" src="https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat" /></a>
```

<br>

![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)

- **STYLE**: Flat Rounded
- **MARKDOWN** ↓

```markdown
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)
```

- **HTML** ↓

```html
<a href="https://github.com/ahmadawais/Emoji-Log/"><img alt="emoji-log" src="https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat" /></a>
```

<br>

![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)

- **STYLE**: Non-flat Rounded
- **MARKDOWN** ↓

```markdown
[![emoji-log](https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat)](https://github.com/ahmadawais/Emoji-Log/)
```

- **HTML** ↓

```html
<a href="https://github.com/ahmadawais/Emoji-Log/"><img alt="emoji-log" src="https://img.shields.io/badge/%F0%9F%9A%80-emoji%20log-gray.svg?colorA=3F3750&colorB=84799D&style=flat" /></a>
```

<br>

[![👌](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/sponsor.png)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

## Sponsor

Me ([Ahmad Awais](https://twitter.com/mrahmadawais/)) and my incredible wife ([Maedah Batool](https://twitter.com/MaedahBatool/)) are two engineers who fell in love with open source and then with each other. You can read more [about me here](https://ahmadawais.com/about). If you or your company use any of my projects or like what I’m doing then consider backing me. I'm in this for the long run. An open-source developer advocate.

- 🌟  **$9.99/month (recommended)** ❯ [Two cups of Caffè latte (coffee) every month →](https://pay.paddle.com/checkout/540217)
- 🚀  **$99.99 (one-time sponsor)** ❯ [Support an hour of open-source code →](https://pay.paddle.com/checkout/515568)
- 🔰  **$49.99 (one-time sponsor)** ❯ [Support an hour of maintenance →](https://pay.paddle.com/checkout/527253)
- ☕️  **$9.99 (one-time sponsor)** ❯ [Lunch/coffee →](https://pay.paddle.com/checkout/527254)

<br>

[![📃](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/license.png)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

## License & Conduct

- MIT © [Ahmad Awais](https://twitter.com/MrAhmadAwais/)
- [Code of Conduct](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/code-of-conduct.md)
- [Munawar](https://munwr.com/) for making awesome badges
- @seatonjiang for Gitmoji whose codebase inspired me

<br>

[![🙌](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/connect.png)](https://github.com/ahmadawais/Emoji-Log-VSCode/blob/master/./../../)

## Connect

<div align="left">
    <p><a href="https://github.com/ahmadawais"><img alt="GitHub @AhmadAwais" align="center" src="https://img.shields.io/badge/GITHUB-gray.svg?colorB=6cc644&colorA=6cc644&style=flat" /></a>&nbsp;<small><strong>(follow)</strong> To stay up to date on free & open-source software</small></p>
    <p><a href="https://twitter.com/MrAhmadAwais/"><img alt="Twitter @MrAhmadAwais" align="center" src="https://img.shields.io/badge/TWITTER-gray.svg?colorB=1da1f2&colorA=1da1f2&style=flat" /></a>&nbsp;<small><strong>(follow)</strong> To get #OneDevMinute daily hot tips & trolls</small></p>
    <p><a href="https://www.youtube.com/AhmadAwais"><img alt="YouTube AhmadAwais" align="center" src="https://img.shields.io/badge/YOUTUBE-gray.svg?colorB=ff0000&colorA=ff0000&style=flat" /></a>&nbsp;<small><strong>(subscribe)</strong> To tech talks & #OneDevMinute videos</small></p>
    <p><a href="https://AhmadAwais.com/"><img alt="Blog: AhmadAwais.com" align="center" src="https://img.shields.io/badge/MY%20BLOG-gray.svg?colorB=4D2AFF&colorA=4D2AFF&style=flat" /></a>&nbsp;<small><strong>(read)</strong> In-depth & long form technical articles</small></p>
    <p><a href="https://www.linkedin.com/in/MrAhmadAwais/"><img alt="LinkedIn @MrAhmadAwais" align="center" src="https://img.shields.io/badge/LINKEDIN-gray.svg?colorB=0077b5&colorA=0077b5&style=flat" /></a>&nbsp;<small><strong>(connect)</strong> On the LinkedIn profile y'all</small></p>
</div>

<br>
<br>
<br>
<br>

### VSCode Power User Course

> After 10 years with Sublime Text, I switched to VSCode — the new open source cross-platform editor everyone's talking about. I've spent over a 1,000 hours perfecting my setup to help you <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">switch today</a> and bring all your <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">custom settings</a> and the <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">power user workflows</a> for <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">HTML/CSS</a>, GitHub/<a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">Git &amp; Open Source</a>, supercharged <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">Markdown</a>, and everything from <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">JavaScript</a> to <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">PHP</a>, Go, Python, C++, C#, ROR &amp; 50+ Extensions. I'm <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode">sharing it all</a> in five hours — 65 videos online course. <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode" target="_blank">Learn Visual Studio Code →</a>

<br>
<img src="https://raw.githubusercontent.com/ahmadawais/shades-of-purple-vscode/master/images/hr.png" />
<br>
<br>

<div align="center">
  <a href="https://VSCode.pro/?utm_source=EmojiLogVSCode" target="_blank">
  <img src="https://raw.githubusercontent.com/ahmadawais/shades-of-purple-vscode/master/images/vscodeproPlay.jpg" /><br>VSCode</a>

  _<small><a href="https://VSCode.pro/?utm_source=EmojiLogVSCode" target="_blank">VSCode Power User Course →</a></small>_
</div>

[course]: https://VSCode.pro/?utm_source=EmojiLogVSCode
