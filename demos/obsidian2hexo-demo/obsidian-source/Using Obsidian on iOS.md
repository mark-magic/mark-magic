---
Author: Mike Schmitz
Tags: ios, notes, setup
---

There's a bit of a note-taking revolution happening, and at the epicenter is a concept called _bidirectional linking_. It's a fundamentally different approach to linked notes in that the link only needs to exist on one of the notes is order for the connection to be active from both directions. For example, let's say I have a link from _Note 1_ to _Note 2_. In the past, I would be able to travel from _Note 1_ to _Note 2_ by clicking on the link, but I wouldn't be able to get back without a separate link from _Note 2_ to _Note 1_. _Bidirectional linking_ solves this by providing a two-way link between notes, even if there is only a single link between them.

This idea has been incorporated by a bunch of popular note-taking apps lately. Roam Research, Craft, and my beloved Obsidian are just a few of the apps that have implemented some version of bidirectional linking. But what makes Obsidian unique (and appealing to Mac nerds like me) is that it simply sits on top of Markdown-formatted plain text files.

It also offers a lot of customization through plugins that you can use to extend the capabilities of the application. These plugins allow you to turn Obsidian into a digital Bullet Journal, the ultimate writing app, or even a kanban board for project management. Just click a button and you can install a third-party plugin that significantly alters what Obsidian is capable of.

The magic happens in Obsidian as a result of the combination of these three features (bidirectional linking, Markdown-formatted text files, and third-party plugin support). While this appeared feasible on the desktop, being able to combine all of these in an App Store approved iOS app seemed like an impossible task.

But just a few short weeks ago, Obsidian released an official iOS app through the App Store. And it includes everything that makes Obsidian great.

## The Interface

Getting the entire Obsidian interface onto the small screen of an iPhone is no small feat. For example, the main Obsidian interface has three section:

- The left sidebar, which includes the File Explorer and Search
- The main Editor window
- The right sidebar (which includes backlinks, tags, etc.)

And it's all there on the iPhone.

Both of the sidebars are available via swipe gestures , giving you access to the entire Obsidian interface without cluttering up your iPhone screen.

## The Features

_ALL_ of the features of Obsidian on the desktop are here, and it's kind of incredible when you think about it. The Graph View, Quick Switcher, keyboard shortcuts - everything. And not only is it all here, but it's implemented in a way that makes sense on a smaller touch interface. For example, there's a feature on iOS called _Quick Action_ that is activated by swiping down anywhere on the screen (except the top of your device, which opens Notifications or Control Center). You can assign this to any action you want, but by default it opens the Command Palette - which feels only natural since it's kind of Spotlight for Obsidian and the swipe gesture is the same one you use to access Spotlight from the Home Screen.

There's also a mobile toolbar above the onscreen keyboard that gives you access to many common actions. These can not only help you do things quickly in the app but also serve as a great Markdown reference tool. If you're coming from an app like Evernote and haven't written in plain text before, this is a wonderful security blanket.

## The Plugins

Even the community plugins are here, though there is a caveat - not every community plugin will work (or work correctly) on the mobile version. The plugin developers may have to add or modify code to make their plugins work correctly, so if you have 30 community plugins installed don't expect them all to work flawlessly right away. A good number of them will, but I've encountered a few that I rely on which still need some TLC.

## Sync

This is one of the most interesting things about the iOS app.

Obsidian is actually a completely free app for both macOS and iOS. The pricing model is based on two premium core plugins, one of which is _Sync_. The service from Obsidian is currently $4 USD per month, and offers end-to-end encryption and 1 year of revision history.

But, remember, Obsidian simply sits on top of plain text files. So when you open up the iOS app for the first time, you're prompted to create a vault inside of your Obsidian folder on iCloud Drive. For example, if you create a vault on Obsidian for iOS called "Notes" it will live in `iCloud Drive\Obsidian\Notes` on your Mac. This allows you to sync all of your files via iCloud Drive, and even opens up some interesting automation possibilities with Shortcuts and the Files app.

That means that you can get it all - bidirectional linking, Markdown-based text files, plugins, even sync - for free.

Which means there really is no reason not to give connected note-taking a try.
