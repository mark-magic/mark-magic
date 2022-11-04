---
Author: Mike Schmitz
Tags: plugins, writing
---

When I first started using Obsidian, I expected it would help me make connections between my notes and inspire new ideas. But over the last 12 months I've been using the app, I have also fallen in love with it as a writing tool. In fact, _I have written every article I've published in 2021 in Obsidian._

In this post, I want to share a few tweaks that make Obsidian my perfect writing app.

## My Journey Away from Ulysses

Let me get this out right now: _Ulysses is an incredible writing app_.

It's just not for me for a couple specific reasons.

First, publishing to the web isn't quite as easy as it should be with Ulysses. It does give you the ability to publish straight to Wordpress, and you can even update blog posts from Ulysses now - if you can get it to connect to your custom Wordpress blog.

When this broke for me, I started digging in to how to fix it and quickly came across weird plugins and settings for modifying XMLRPC. And unfortunately, I could never get it functioning again. I fully understand it's something on my domains, but the "simple instructions" didn't work and even as a web developer I didn't feel comfortable digging too far into this.

Which meant I was stuck copying and pasting into Wordpress. And because Ulysses doesn't use standard Markdown, that meant I had to "export" my text first. Which works, but adds a few extra clicks or taps in order to get my text. Combine that with the fact that Ulysses has some weird Markdown formatting that never quite clicked for me in the first place, and I was left looking for a straight Markdown-based text editor.

Obsidian fits that description perfectly. It's simple, uses plain text files, provides inline formatting, and supports standard Markdown formatting. It's everything I've ever wanted in a plain text editor.

But there are a few additional settings and plugins you can use to make it even better as a writing app.

## Obsidian Settings

First, let's look at some of the settings.

To access these settings, click on the gear icon in the lower-left corner and then select _Editor_ from the Settings sidebar.

The defaults are actually pretty good, but here's the key settings you want if you're going to use Obsidian for writing:

- Make sure that **Auto pair Markdown syntax** is toggled **ON**. This creates both symbol and places the cursor in the middle, making it easier to create italicized or emphasized text.
- Make sure **Smart indent lists** is toggled **ON**. This makes it easier to create bulleted and numbered lists quickly, automatically adding the next bullet when you hit the _Return_ key.
- Make sure that **Fold heading** and **Fold indent** are toggled **ON**. This creates carats for Markdown headers as well as indented text, adding some cool outliner-inspired features that make it easy to fold up text in large files and focus on the text you want.

There are a bunch of other settings you can customize, but may of them are simply personal preference. These are the important ones.

Once you have your settings, it's time to move on to the plugins.

## Obsidian Core Plugin Settings

There are two types of plugins in Obsidian: _Core plugins_ that ship with the app, and _Community plugins_ that you can install to extend the functionality of Obsidian. We're going to look at the Core plugins first.

Here are my recommendations for modifying the Core plugins:

- Make sure that **Backlinks** and **Outgoing Links** are both toggled **ON**. These are sections available in the right sidebar that show all of the notes that link to the active note and all of the notes linked to from the active note respectively. (If you're new to the concept of connected notes, check out [this article on using the local graph](https://thesweetsetup.com/the-power-of-obsidians-local-graph/).)
- Make sure that **Outline** is toggled **ON**. This adds a tab in the right sidebar that creates a table of contents for your note based on the Markdown headers. This is helpful when you need to jump to a specific section of a longer text as you can do so simply by clicking on the appropriate header title.
- Turn the**Word Count** setting **OFF**. Word counts are important, but there's a Community plugin that does this _much_ better than the built-in word count tool here.

Again, there are a bunch of options here that are personal preference but these are the important ones. Once you have these Core plugins set, it's time to add some Community plugins.

## Obsidian Community Plugins for an Upgraded Writing Experience

You can access the Community plugins public directory by going to _Settings --> Community plugins --> Browse_ once you've toggled off _Safe Mode_. From there, you can find plugins for just about anything, from [embedding tasks from Todoist](https://thesweetsetup.com/syncing-embedding-tasks-from-todoist-in-obsidian/) to [creating timeblocked daily plans](https://thesweetsetup.com/timeblocking-in-obsidian/) to [creating kanban boards](https://thesweetsetup.com/my-obsidian-based-kanban-writing-workflow/) - all based off plain text files using standard Markdown.

![](https://thesweetsetup.com/wp-content/uploads/2021/10/communityplugins.jpg)

Note that many of the plugins I will share here are replacements for standard features in Ulysses, so if you don't mind non-standard Markdown formatting and don't run into the publishing issues that I did maybe try that instead. But if you're all in with Obsidian, here are the plugins I use to make Obsidian my perfect writing app.

### Better Word Count

The first plugin is called [Better Word Count](https://github.com/lukeleppan/better-word-count). This replaces the built-in word count core plugin, but adds a few more options and features (for example, the ability to add the daily words written).

![](https://thesweetsetup.com/wp-content/uploads/2021/10/betterwordcount.jpg)

Here are the settings I recommend for this:

- Make sure that **Collect Statistics** is toggled **ON**. This is required for the daily word count statistic.
- Turn **Select a Preset** to **Custom**. This allows you to create your own stats formatting in the status bar. I use `w: {word_count} c: {character_count} dw: {words_today}` which gives me the words and characters in the current document, plus the total words written today.

(Note that you may need to force reload Obsidian before the stats show up in your status bar. You can do this by quitting and reopening the app or selecting _View --> Force Reload_.)

It's not as good as the writing stats in Ulysses, but it's good enough for me.

### Reading Time

Another handy Ulysses feature is being able to see how long it will take to read the text in the selected file. But you can add this feature to the status bar using the [Reading Time](https://github.com/avr/obsidian-reading-time) plugin.

![](https://thesweetsetup.com/wp-content/uploads/2021/10/readingtime.jpg)

This one is pretty straightforward - just install it and turn it on and you'll see the reading time at the bottom of your Obsidian window. You can customize your reading speed however in the settings for the plugin.

### Footnote Shortcut

If you use footnotes a lot, they can be a bit of a pain to create via standard Markdown. But it's a lot easier with the [Obsidian Footnotes](https://github.com/akaalias/obsidian-footnotes) plugin.

Once installed, you can a command and hotkey is added for _Footnote Shortcut: Insert and Navigate Footnote_. You can customize the hotkey by going to _Settings --> Hotkey_ and searching for _Footnote_, which will then insert the appropriate Markdown and navigate to the bottom of the note where you can insert the text for your footnote.

### Focus Mode

The Obsidian interface can be a little distracting when you're trying to focus on your words. Fortunately, the [Focus Mode](https://github.com/ryanpcmcquen/obsidian-focus-mode) plugin allows you to remove all the distractions and focus on what you're writing.

![](https://thesweetsetup.com/wp-content/uploads/2021/10/focusmode.jpg)

Once the plugin is installed and active, just click the _Toggle Focus Mode_ button to hide the sidebars and status bar, and you can shift-click the button to hide everything but the active writing pane.

_(If you want more plugin recommendations, check out [[A Few of Our Favorite Obsidian Plugins]])._
