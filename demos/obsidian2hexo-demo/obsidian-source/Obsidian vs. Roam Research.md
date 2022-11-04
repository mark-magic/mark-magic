---
Author: Mike Schmitz
Tags: pkm, roam
---

# Obsidian vs. Roam

The last 18 months could be classified as "the rise of the connected note-taking app." In the past year, [Roam Research raised $9 million dollars (with a $200 million valuation) ](https://www.theinformation.com/articles/a-200-million-seed-valuation-for-roam-shows-investor-frenzy-for-note-taking-apps), [Obsidian was nominated for the Product Hunt Golden Kitty award from for the Productivity category](https://www.producthunt.com/stories/announcing-the-2020-golden-kitty-award-winners), and countless other note-taking apps entered the productivity space with their own version of bidirectional linking features. [Even Drafts got an update which allows wiki-style cross-linking](https://docs.getdrafts.com/docs/drafts/cross-linking).

It's an exciting time for thinkers and creators.

While there are lots of apps doing lots of interesting things with notes right now, by far the two most popular options are _Roam Research_ and _Obsidian_. In this article, we're going to compare these two connected note-takers and help you choose the right one.

## The Approach

It's impossible to say "just use this one" when it comes to picking the right connected note-taking app for you. On the surface they may seem similar, but there are several important differences that stem from fundamentally different approaches to how your notes are stored and managed.

There are lots of things you can look at when picking your PKM app, but here are the criteria we used:

- User Interface
- Graph View
- Daily Notes
- Backlinks
- Sidebar
- Block Embeds/References
- Markdown Support
- Search/Query
- Daily Notes
- Tasks
- Expandability
- Theming
- Data Portability
- Publishing
- Data Security
- Mobile Experience
- Pricing

In this article, we're going to carefully consider the design choices each app makes in these categories and do our level best to help you pick the right PKM app to fit your workflow.

## User Interface

The user interface is arguably the most important aspect of a note-taking app, making it easy (or unnecessarily difficult) to capture your ideas and thoughts when you have them.

### Obsidian

As a pure note-taking app, Obsidian's interface can be confusing. There are a couple of sidebars and a whole bunch of buttons that can get in the way of capturing text into your Obsidian vault.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidian.jpg)

Once you understand the interface, this really isn't a problem. But I've watched more than one person open Obsidian for the first time and immediately close the app because it looked too complicated.

When working with text in Obsidian, there are two different modes you will switch between:

- _Edit Mode_ where you write your text
- _Preview Mode_ where you can view the result of your Markdown-formatted text

You can switch modes by clicking the icon in the top-right of the document pane, but if you switch back and forth a lot this can be a little tedious. You can actually hold the _Command_ key when you click on the Preview icon to open the preview in a new pane, which gives you a side-by-side view of your note.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidiansidebyside.jpg)

I actually prefer to write this way as the preview gets updated in real-time. But it's not entirely discoverable for a brand new user.

### Roam

The user interface is where Roam Research really shines. It has a clever way of displaying the raw text when you click on a line, then rendering the preview when you switch the focus to another line.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamresearch.jpg)

This is a great way to work with your text, and eliminates a lot of the friction if you do more than just text.

Roam also includes a section at the bottom of each note which shows the backlinks, making them more easily discoverable for new users. We'll dig deeper into backlinks in the next section, but it's worth calling out here because being able to see and link related pages is an important of the user interface and Roam does this better.

### Winner: Roam

## Graph View

The _Graph_ is kind of like a mind map, showing all of the connections between all of the notes. It can be useful to help see links between notes and ideas, but can also be overwhelming when you have a lot of notes.

### Obsidian

Obsidian's graph view is incredible. Not only is it super-fast, but you can apply filters, create groups, and even change the look and functionality of the graph itself:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidiangraph.jpg)

But the real magic in Obsidian happens in the local graph.

You can open a local graph by clicking on the three dots in the upper-right of the active note and selecting _Open local graph_ from the menu. This opens a simpler graph which shows the notes in your vault that link to the active note, and the notes that the active note links to. These bidirectional links allow you to navigate between your notes by clicking on the dots in the local graph.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidianlocalgraph.jpg)

The local graph automatically updates when you open a new active note, and it can be stored in the sidebar so you can access it quickly.

### Roam

The _Graph Overview_ in Roam gives you a look at the connections between all the notes in you library, but is completely unusable if you have a large number of notes. You can see the connections when you hover over a circle for a specific note, but they seem to be randomly spaced and there isn't a great way to navigate between them.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamgraph.png)

There are also no filters to help clean up the Graph overview, and it's much slower in our testing than the Graph View in Obsidian.

Roam does have a button on each note page that you can click to "Open a graph of this page in the sidebar," but it doesn't update as you navigate through your notes. It is literally a static graph view of the current note and the links between other notes in your Roam database. While it can serve it's purpose, we feel the Graph View in Obsidian is much more polished - and much more useful.

### Winner: Obsidian

## Backlinks

Backlinks are the foundation of a connected note-taking app, allowing you to navigate between your notes like a personal wiki. Both Roam and Obsidian take this wiki-style linking a step further though, allowing you to surface _unlinked mentions_ of your currently selected note and make connections with a click. This allows you to intentionally connect your notes in new and more meaningful ways, which can be especially useful for creatives who want to develop their ideas.

### Obsidian

Linking to pages in Obsidian is simple: just use `[[pagetitle]]` anywhere in your text to add a link to the note with that page title. Obsidian's auto-complete helps you find the page you want to link to, or you can create a link to new page by entering a text string that doesn't currently exist in a note title. You can click on these links to navigate to that page when in Preview mode, and the connection also shows up in the graph view.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidianautocomplete.jpg)

You can also use Obsidian's auto-complete to link to headers in the document by using `#`, or link to a specific block by using `^`.

The problem with backlinks in Obsidian lies in how it handles unlinked mentions. Backlinks (linked mentions and unlinked mentions) are both located in the sidebar and easy to miss. Once you know where to look it's not a big deal, but we prefer the way Roam puts backlinks at the bottom of the note.

### Roam

Just like Obsidian, Roam allows you to create a ink to another page using `[[pagetite]]`. The big difference is the addition of the linked mentions and unlinked mentions at the bottom of your currently selected note. This may seem like a small detail, but it makes finding and creating links incredibly easy in Roam since it's hard to miss. And the more that you use intentionally link your notes together, the more valuable your web of ideas becomes.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/autocompleteroam.jpg)

Roam also does a _much_ better job handling backlinks to individual blocks. Unlike Obsidian (which uses individual text files), Roam is a database. This means that each individual block in Roam is it's own entry in the database, and makes it much easier to link atomic note elements together. We'll dig into this in the next section on block references, but Roam is built to make the most of this essential feature.

### Winner: Roam

## Sidebar

Another important part of the user interface is the _sidebar_. This can display related information to the note you're currently editing and serve as a collecting place for related notes that you want to view together.

### Obsidian

The sidebar in Obsidian is where much of the magic happens. It can not only show you the linked and unlinked mentions for the note you are currently editing, but can also do things like display an outline of your note broken down by header and give you quick access to your tags. You can even keep a local graph in the sidebar of linked notes that updates when you open a new note.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidiansidebar.jpg)

Using third-party plugins can extend the sidebar capabilities even further. For example, the Calendar plugin allows you to navigate a calendar view and quickly jump to Daily Notes pages for a specific date. Plugins are a whole separate section, but they can extend the capabilities of the sidebar in Obsidian in some really cool ways/

### Roam

The sidebar in Roam serves a little bit of a different purpose. Instead of panes where you can choose what information you want to show, the primary role of the sidebar in Roam is to serve as a collecting place for related information. For example, hold the _Shift_ key while you click a link and the note opens in the sidebar instead of navigating away from the note you are currently on.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamsidebar.jpg)

Putting related notes int he sidebar also makes it easier when you want to embed a block from one note into another one. Just hold down the _Option_ key and drag the block from the sidebar into the note in the main window and the block will be embedded automatically.

The big difference here is that the sidebar in Roam has a very specific function: to aid you in your research. The design choices about the sidebar reflect this: the sidebar is for the bits and pieces, the main window is for your active note. There is no such distinction in Obsidian, but the flexibility it gives you in designing your sidebar layout makes up for this in time. While there's a lot to be said for Roam's focused simplicity, when you start extending Obsidian's capabilities using plugins the sidebar becomes an essential tool

### Winner: Roam

## Block Embeds/References

Occasionally, you might want to link to a specific section of a note. These fundamental building blocks of notes are called _blocks_, and being able to link and embed them in other notes is a powerful benefit of connected note-taking apps.

### Obsidian

To embed something in Obsidian, you simply put an `!` character before the `[[pagetitle]]`. This tells Obsidian that instead of just linking to the page, you want to embed it in the current location in the active note. You can take this even further by using a `#` to embed a specific header or `^` to embed a specific block. Using auto-complete like this make block embeds in Obsidian even easier than they are in Roam.

Linking and embedding blocks is kind of a hacky workaround in Obsidian. Since it's based on individual text files, the way Obsidian connects to individual blocks is to add a weird identifier at the end of the block that it can use to locate it again:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidianbolck.jpg)

This is fine for embedding blocks into other notes. Where this really falls down though is with block references.

Unfortunately, the only way to see block references is in the backlinks section in the sidebar. This isn't a problem if you have very small (atomic) notes in your Obsidian vault, but it gets tricky if you have longer notes with lots of blocks you'd like to reference in other notes. Instead of quickly being able to find the few notes that reference a specific block in a list, you have to comb through _all_ the links to the entire page.

This is Obsidian's achilee's heel, and forces you to keep a large number of short notes in your vault instead of a small number of large notes. You can work around it, but it's annoying.

### Roam

Block embeds and references in Roam are easy. Because everything in Roam is stored in a database, there is no distinction between individual notes and blocks and everything can be broken down into more atomic units.

You can use a block reference in Roam by:

- Using `((` and searching your database for the block you want to link
- Right-clicking on a block and selecting _Copy Block Reference_
- Dragging a block from a note in your sidebar into the main note window

Because Roam converts text to preview the moment you deselect the line, a block reference in Roam looks very much like a block embed in Obsidian. It shows you the contents of the original block, but if you go back to the original block you will also see a number to the right of the block. This indicates the number of references to the block in your entire Roam Research database, and clicking on it will show all references in line:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamblock.jpg)

This is incredibly useful, and a major reason to choose Roam Research for your PKM needs. The more you use block references like this, the more powerful you realize this feature is.

Block Embeds in Roam are also better than they are in Obsidian, allowing you created a linked copy of the block in the current note. The difference here is that instead of merely pointing back to the original block and displaying the contents, a block embed allows you to edit the contents of the block right in your new note. When you do, the original block (and all other embedded copies of the block) are updated as well.

### Winner: Roam

## Markdown Support

Both apps support Markdown formatting in plain text. This allows you to style your text (for example, for publishing to the web), but means your plain text notes are compatible with any text editor on the planet.

### Obsidian

Obsidian is simply an interface for plain text files that are stored on your computer, and supports standard Markdown formatting. Many themes will have syntax highlighting to make it easier to see your Markdown-formatted text, but the Markdown that Obsidian supports will be viewable in any other text editor.

This is unremarkable, but the way it should be.

### Roam

Roam, on the other hand, supports a weird flavor of Markdown. Most of it will be familiar (i.e. `#` for headers, bulleted lists, etc.), but it also inexplicably changes some very familiar Markdown formatting. For example, standard Markdown lets you use `**` (or `__`) for bold and `*` (or `_`) for italic formatting. But in Roam, you have to use `**` for bold and `__` for italic. This goes directly against the standard Markdown convention of double characters for bold text and single for italic.

I don't understand why the Roam team made this choice. You can argue that you'll just get used to it, but not if you do writing in any other plain text editors that support standard Markdown formatting. This is inexcusable, and a dealbreaker for many.

### Winner: Obsidian

## Search/Query

Search used to be the only practical way to surface your notes after you had captured them. This has changed with the advent of bidirectional linking in connected note-taking apps, but search is still useful when you need to locate something specific. In addition, queries can help you comb through your entire database of notes quickly and easily return notes that match certain criteria, like tasks due on a certain date or articles that are currently in progress.

### Obsidian

After spending some time using search and queries in both apps, I have toa dmit that search in Obsidian feel secondary. It lets you search your library using criteria like `path:`, `file:`, and `tag:`. You can also combine search modifiers to quickly find the needle in the digital haystack.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidiansearch.jpg)

It feels very much like a standard boolean search, but doesn't do a great job of showing the context of your search results. You can embed a search or query in a note, but the annoyances with displaying note context make this... not great.

### Roam

Roam's minimal interface has a search bar at the top to help you quickly find anything you might be looking for, but the real magic happens with Roam's _Queries_. Queries require a specific formatting to be used, but are incredibly powerful because they embed the blocks that match your criteria in the page. For example, a simple query that return everything with a tag of `#Quote` looks something like this:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamsearch.jpg)

In addition to search and queries, Roam also has _Filters_ that can limit what data you see when looking at your note. Click the funnel icon and you can choose what you want to include or remove using the filter.

### Winner: Roam

## Daily Notes

Both Obsidian and Roam have support fora feature called _Daily Notes_. Daily Notes are the digital equivalent of the Bullet Journal's daily page, serving as a place to capture bits and pieces of information before you process them and decide where they belong.

### Obsidian

If you open a fresh install of Obsidian, you won't see the Daily Notes feature as it's not on by default. It must be enabled by going to **Settings --> Core Plugins** and toggling on **Daily Notes**. This is both an advantage and a disadvantage, as it's not on by default but also allows you to limit the features you don't use to keep Obsidian from getting unwieldy.

Once you have Daily Notes enabled, an icon will appear on the left sidebar that you can click to go straight to today's Daily Note:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidiandailynotes.jpg)

This opens up today's daily note, and you can capture text that gets linked to that specific date.

And out of the box, that's all it does. But with the addition of other plugins, Daily Notes can get a lot more powerful.

For example, the Calendar plugin gives you a monthly calendar view that you can use to jump to a specific date (either past or in the future). You can also use the templates feature (another Core Plugin) to auto-populate your new daily notes with text templates, [like I do for journaling](https://thesweetsetup.com/journaling-using-daily-questions-in-obsidian/).

The big limitation with Obsidian's Daily Notes is in the way it surfaces tasks (or rather doesn't). We look at tasks in another section, but Daily Notes are an important piece to task management and it's a little bit lacking in Obsidian. You can link tasks to a specific date, but because they aren't displayed in the main note it's very easy to miss them.

### Roam

Daily Notes are a very important part of the Roam Research experience. In fact, the app opens straight to your Daily Notes page for today when you log in.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamdailynotes.jpg)

With Roam, there is a specific workflow you are guided into:

1. capture things on your daily notes page
2. embed/reference them somewhere else later

The way Roam handles queries and block references/embeds, the focus is clearly on just capturing things to your Daily Notes page - not on deciding which note they belong with. You can easily do that after the fact using the sidebar, or not at all if you prefer and just surface things using queries. This makes for some [very interesting journaling workflows](https://thesweetsetup.com/how-i-use-roam-research-for-journaling/).

By opening to today's daily note, Roam also makes it a better option for managing tasks than Obsidian. In addition to showing linked tasks (the ones due that day) on the main note in the linked mentions section, it also shows that day first thing when you open the app so you don't miss them. Of course, that still assumes you are opening the app every day.

### Winner: Roam

## Tasks

Plain text task management is nothing new. But bidirectional linking opens up some interesting new possibilities, like a digital bullet journal or being able to link directly to the article you're writing in the same application.

### Obsidian

You can create a task in Obsidian by using the `- [ ]` formatting, which makes it possible to check off the task as complete in Preview Mode.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidiantask.jpg)

You can also link a task to a specific date using the `[[pagetitle]]` syntax. Just insert the name of the daily note you want to link the task to, and the task will show up in the linked mentions on that date. It's not great, but it works.

Unfortunately, tasks don't feel like they belong in Obsidian. But there are lots of third-party plugins that try to fix this in lots of different ways, like:

- the Slated plugin which adds a bunch of additional features to task management in Obsidian
- the Todoist plugin that allows you to embed tasks from Todoist using filters
- the Kanban plugin which allows you to create cards for your tasks and link to pages from the card titles

But the vanilla Obsidian app leaves a lot to be desired.

### Roam

Roam seems to be built with task management in mind. From any block, you can use the keyboard shortcut **Command + Enter** to cycle between a todo, a completed todo, and a plain text block. You can also use the slash command in the block to quickly access the date picker and select a due date for the task, which creates a page link to that day's daily note in Roam:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamtask-scaled.jpg)

From here, surfacing your tasks when they are due is easy. Roam opens to today's daily note by default, and your tasks that are due are surfaced in the linked mentions section at the bottom of the main note window.

You can also use tags and Roam's powerful queries to cobble together your own [GTD-style task management system in Roam](https://thesweetsetup.com/using-roam-research-for-gtd-style-task-management/).

It's still not as nice as a dedicated task management app like [Things](https://thesweetsetup.com/apps/best-personal-gtd-app-suite/), but if you have only basic task management needs or want to link your tasks to the documents you're working on, Roam is a decent option.

### Winner: Roam

## Expandability

Both apps can do a lot out of the box, but you may want to customize the app you use to fit your specific workflow. With a few tweaks, you can turn your note-taking app into a productivity powerhouse.

### Obsidian

Obsidian ships with standard feature set, but it is easily expandable using _plugins_. There are two kines of plugins:

- _Core plugins_, which ship with the app
- _Community plugins_, which are developed by third-parties and installable via a public directory

As of this writing, the Obsidian API is not officially released (at least per the [public development roadmap](https://trello.com/b/Psqfqp7I/obsidian-roadmap)). But it's still amazing what you can do currently with community plugins. There are currently 178 plugins listed in the directory, which can do things like:

- Push a backup of your entire vault to GitHub
- Create editable kanban boards
- Automatically log completed tasks from Things
- Use natural language for dates
- much, much more

It's impossible to overstate how awesome plugins are in Obsidian. Some of the functionality third-party developers have been able to add is astounding. It takes some trial and error to figure out which ones will fit for you, but the quality is great and the directory keeps getting bigger.

### Roam

Roam doesn't have plugin like Obsidian, but you can embed scripts and code directly into Roam to extend it's capability. One of the most popular Roam "extensions" is called [Roam42](https://roamresearch.com/#/app/roamhacker/page/UeoxCm8rm). Roam 42 gives you a lot of extra stuff Roam doesn't support by default, like:

- SmartBlocks workflows to use your text in some pretty incredible ways
- deep navigation using the keyboard
- natural language processing for dates

To "install" code snippets like Roam42, you copy a script and embed it in a code block in your database. There are obviously some security risks inherent with this, but it's currently the only way to extend Roam's capabilities.

### Winner: Obsidian (by a landslide)

## Theming

In addition to extending functionality, you can also customize the look and feel of each app using themes. These themes are built using CSS, which means you have the ability to tweak them exactly the way you want - with a little bit of web development knowledge.

### Obsidian

Installing themes in Obsidian is incredibly easy. You can actually access a public directory of themes right from the app by going to **Settings --> Appearance --> Community Themes**. You can select a theme to install it, or preview any of the themes in the directory if you're not quite sure.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidianthemes.jpg)

All of the themes that you download are kept in a hidden folder on your computer, and you can edit the CSS directly in a text editor like SublimeText or BBEdit.

You can also create your own _CSS Snippets_ that can be toggled on or off from **Settings --> Appearance**. But there are a lot of great themes that also have an associated plugin that allow you to tweak the visual settings without touching any actual code.

### Roam

Roam doesn't have a public directory of themes you can access directly from the app, but it does allow you to make the same kind of changes by pasing a CSS code block on your `roam/css` page.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamtheme.jpg)

You can have many of these code snippets active at once, which can cause conflicts if you're not sure which ones are enabled (you way you turn them off is to switch the code snippet from _CSS_ to _Clojure_). But if you want to tweak any of these settings yourself, you're going to have to know your way around CSS.

### Winner: Obsidian

## Data Portability

The beauty of plain text is that it is timeless, giving you access to your notes on any platform and any device. By keeping your notes in plain text, you ensure future compatibility should you decide to switch apps down the road.

### Obsidian

Obsidian as an application sits on top local files stored on your computer. The files themselves are not imported into Obsidian, they are simply opened and viewed there. That means that if you ever decide to stop using Obsidian, what you are left with is a bunch of local plain text files. While some features in Obsidian may use special formatting, the foundation of your notes documents is standard Markdown that can be opened and edited in any other plain text editor.

In terms of futureproofing, it doesn't get any safer than this.

### Roam

Roam also uses plain text, but stores it in a proprietary database format. You can export your data from Roam as either separate Markdown files or a single JSON file, but while your data is in Roam it is still in a proprietary format.

I've personally used Roam's export feature and it worked fine. There's no reason to think you won't be able to get your notes out of Roam if decide to switch connected note-taking apps, but recognize that there is an additional step involved and it isn't as simple as it is in Obsidian.

### Winner: Obsidian

## Publishing

Occasionally, you may want to share your notes with someone directly. Publishing your notes allows you to send a public link to someone so they can access them directly via a web browser.

### Obsidian

Obsidian has an add-on service called _Publish_ that you can buy directly from the developers. It is currently $8/month per site (billed annually), and allows you to publish your notes directly to the web. The service gives you a _publish.obsidian.md_ site, but you can also use a custom domain if you want.

![](https://thesweetsetup.com/wp-content/uploads/2021/04/obsidianpublish.jpg)

The site itself displays the notes that you choose to publish, alongside the local graph view of the currently selected note. You can even password protect your site if you want to control who has access to it.

This is pretty brilliant way to monetize the application without charging people for features if they don't need them.

One note: you can't publish directly to a Wordpress site from Obsidian like you can from Ulysses, but the standard Markdown formatting means it is easy to copy and paste your text when you're done writing in Obsidian.

### Roam

Sharing notes in Roam is a little more complicated.

First, you need to understand that data in Roam is not end-to-end encrypted (more on this later). That might not be such a big deal, except that when you share a note in Roan, _all of the data in your entire graph gets loaded in your visitor's browser_. There's even a warning if you toggle on the setting for sharing individual pages:

![](https://thesweetsetup.com/wp-content/uploads/2021/04/roamsharing.jpg)

The alternative is to make your entire graph public, but if you keep notes on things you don't want to share with the world you'll need to keep that info in a separate graph (meaning it's unlinkable from the graph that you share).

Like Obsidian, Roam also doesn't have a way to publish directly to Wordpress. But it also doesn't use standard Markdown, which means you can't simply copy and paste either. It seems like the Roam team is focused on developing more multi-user features, but at the moment it's not a great publishing or sharing platform for most people.

### Winner: Obsidian

## Data Security

Your notes should be private unless you decide to share them. Plain and simple.

### Obsidian

If you're concerned about the security of your notes, Obsidian is the obvious choice for a couple of reasons.

First, all your notes in Obsidian are really just text files that are stored locally on your computer. They're not shared publicly _anywhere_ by default unless your vault is located in a shared folder like Dropbox or iCloud Drive.

Second, the Obsidian Sync service (another add-on which currently costs $4/month, paid annually) is end-to-end encrypted. Whatever data you decide to send to the Obsidian servers is encrypted from the moment it leaves you hard drive to the moment you download it on a new device.

It's also important to note that you don't need to use Obsidian's Sync service. But it is the best way to sync data if you're going to use the Obsidian mobile app.

### Roam

With Roam Research, everything is stored on their servers. There's also no two-factor authentication for logging in, and no end-to-end encryption of your stored data.

For some, that's not a big deal. If someone wants to steal my sermon notes, I don't really care. But if you store sensitive information in your notes, Roam's "security by obscurity" is not going to be enough.

### Winner: Obsidian

## Mobile Experience

While the computer is the primary place to interact with your notes with both of these apps, occasionally you may want to access your notes on the go.

### Obsidian

As mentioned above, Obsidian sits on top of plain text files on your computer. Which means the way you can access your notes on your iOS devices is fairly limited (at least until the iOS app is officially released).

One easy way to see and edit your notes on the go is to keep your notes in a cloud folder and access them via an iOS text editor. For example, I keep my vault in my Dropbox folder, which allows me to access my notes in apps like 1Writer. Because Dropbox sync is so solid, any changes are instantly sent back to my Mac and instantly show up in Obsidian.

There is also an iOS app in development, but it is currently in closed beta as of this writing. It's amazingly functional and very solid for such a young app, but early signs indicate this could be a very pleasant iOS experience for Obsidian users - assuming that they are willing to pay for Obsidian Sync to keep their vault up-to-date between their different devices.

### Roam

Roam Research is not made for mobile access. Plain and simple. There is no mobile app for Roam, and the full site in a mobile browser is not a pleasant experience.

Roam does have a mobile stylesheet that changes the main page from the standard Daily Notes page to a _Quick Capture_ page. Quick Capture lets you jot down text, todos, links, and images and add them as blocks directly to your Daily Notes pages so you can process them when you get back to your computer. You can choose the graph you want and select the page you want to add the block to, but it's really just for capturing things on the go.

Bottom line: if you want to access your notes from your iPhone, Roam isn't a great option.

### Winner: Obsidian

## Pricing

While we all love a good deal, ultimately you want to make sure that the connected note-taker you decide to use has a clear business model that can support future development. And of course, the price you pay must be reflective of the value that you get form using the application itself.

### Obsidian

Obsidian's pricing model is _very_ interesting.

The app itself is actually free for personal use. You can download the app, point it at your notes stored locally on your device, and use it forever without paying a dime. That would normally make us a little nervous, but Obsidian has a very clear monetization strategy by offering add-ons for purchase.

There are currently two different add-ons available for Obsidian:

- _Publish_, which allows you to share your notes publicly via the web for $8/month (current pricing, paid annually)
- _Sync_,which allows you to access your vault on your mobile devices and includes 1 year of revision history for $4/month (current pricing, paid annually)

Both of these services are well implemented, and allow users who need them to support Obsidian's development. Note that these add-ons are _not_ the same as the plugins mentioned earlier, which are accessible in the free version. And if you don't need Sync or Publish but just want to support the Obsidian team, you can do that as well via the web.

### Roam

Let's get this out of the way: Roam is _really_ expensive.

There is no free version of Roam, and pricing begins at $15/month for the "Pro" version. If you decide to pay yearly it's $165, and there is a "Believer" plan that is $500 for 5 years. The Pro version includes a 30 day free trial (you get charged on day 31), but it's a pretty big investment. By comparison, if you signed up for both the Sync and Publish add-ons using current pricing, you'd be paying $144/year for Obsidian.

It's hard to make a blanket statement about whether Roam's hefty price tag is worth it. If you're all in with Roam it probably is. But if you're just getting started with connected note-taking and dipping your toes in the PKM waters, it's hard to justify.

### Winner: Obsidian
